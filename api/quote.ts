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
  
  // Try Tavily first
  if (TAVILY_API_KEY) {
    try {
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

      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    } catch {
      // Fall through to Brave
    }
  }

  // Fallback: Brave Search API
  const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
  if (BRAVE_API_KEY) {
    try {
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
        headers: { 'X-Subscription-Token': BRAVE_API_KEY, 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        return (data.web?.results || []).map((r: any) => ({
          title: r.title,
          url: r.url,
          content: r.description || '',
        }));
      }
    } catch {
      // Fall through
    }
  }

  // If no search works, return empty — AI will use general knowledge
  return [];
}

async function generateEstimate(
  service: string,
  zip: string,
  searchResults: TavilyResult[]
): Promise<{ estimate: string; low: string; high: string; details: string }> {
  const context = searchResults.length > 0
    ? searchResults.map((r: TavilyResult) => `Source: ${r.title}\n${r.content}`).join('\n\n')
    : '';

  const researchBlock = context
    ? `\nHere's recent pricing research data:\n${context}\n`
    : '\nNo specific local pricing data available — use your general knowledge of US home service costs.\n';

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
          content: `Give a rough cost estimate for "${service}" services near ZIP code ${zip}.
${researchBlock}
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

function getDefaultEstimate(service: string): string {
  const defaults: Record<string, string> = {
    'Plumbing': '$150 - $500',
    'HVAC & Heating': '$200 - $1,500',
    'Electrician': '$150 - $800',
    'Roofing': '$5,000 - $15,000',
    'Handyman': '$100 - $400',
    'Water Damage': '$1,000 - $5,000',
    'Mold Removal': '$500 - $3,000',
    'Appliance Repair': '$100 - $400',
    'Pest Control': '$150 - $500',
    'Locksmith': '$75 - $250',
    'Landscaping': '$200 - $2,000',
    'Tree Services': '$300 - $2,000',
  };
  return defaults[service] || '$150 - $1,000';
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
    // Step 1: Search for pricing data (best effort)
    const searchResults = await searchPricing(service, zip);

    // Step 2: AI generates estimate (works with or without search data)
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
    // Even if everything fails, return a reasonable estimate
    return res.status(200).json({
      success: true,
      service,
      zip,
      estimate: getDefaultEstimate(service),
      low: '',
      high: '',
      details: `${service} costs vary based on the scope of work, materials, and your specific situation. For an accurate quote tailored to your needs, we can connect you with a licensed local pro.`,
      sources: [],
      disclaimer: 'Get a free personalized quote by calling (630) 703-2607.',
    });
  }
}
