import { VercelRequest, VercelResponse } from '@vercel/node';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

async function searchPricing(service: string, zip: string): Promise<TavilyResult[]> {
  const query = `${service} cost price estimate ${zip} 2025 2026 average homeowner`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 5,
      include_answer: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

async function generateEstimate(
  service: string,
  zip: string,
  searchResults: TavilyResult[]
): Promise<{ estimate: string; low: string; high: string; details: string }> {
  const context = searchResults
    .map((r: TavilyResult) => `Source: ${r.title}\n${r.content}`)
    .join('\n\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Based on the following pricing data, give a rough cost estimate for "${service}" services near ZIP code ${zip}.

Research data:
${context}

Respond in this exact JSON format only, no other text:
{
  "low": "$X",
  "high": "$Y",
  "estimate": "$X - $Y",
  "details": "A 2-3 sentence explanation of what affects the price range, written conversationally for a homeowner. Mention specific sub-services and what drives costs up or down."
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fall through to default
  }

  return {
    low: '$150',
    high: '$500',
    estimate: '$150 - $500',
    details: `${service} costs vary based on the scope of work, materials needed, and urgency. Getting multiple quotes is always a good idea.`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { service, zip } = req.body || {};

  if (!service || !zip) {
    return res.status(400).json({ error: 'Missing service or zip' });
  }

  if (!TAVILY_API_KEY || !ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API keys not configured' });
  }

  try {
    // Step 1: Search for pricing data
    const searchResults = await searchPricing(service, zip);

    // Step 2: AI generates estimate from research
    const estimate = await generateEstimate(service, zip, searchResults);

    return res.status(200).json({
      success: true,
      service,
      zip,
      ...estimate,
      sources: searchResults.slice(0, 3).map((r: TavilyResult) => ({
        title: r.title,
        url: r.url,
      })),
      disclaimer: 'This is a rough estimate based on market data. Actual costs may vary. Get a free personalized quote by calling (630) 703-2607.',
    });
  } catch (error: any) {
    console.error('Quote estimation error:', error);
    return res.status(500).json({
      error: 'Failed to generate estimate',
      message: error.message,
    });
  }
}
