import { VercelRequest, VercelResponse } from '@vercel/node';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

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

async function getQuoteFromPerplexity(service: string, zip: string) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a home service pricing expert. Search the web for current pricing data and respond ONLY with valid JSON, no other text.'
        },
        {
          role: 'user',
          content: `What does "${service}" typically cost for a homeowner near ZIP code ${zip}? Search for current 2025-2026 pricing data.

Respond in this exact JSON format only, no markdown, no code blocks, no other text:
{"low":"$X","high":"$Y","estimate":"$X - $Y","details":"A 2-3 sentence explanation of what affects the price range, written conversationally for a homeowner. Mention specific sub-services and what drives costs up or down."}`
        }
      ],
      max_tokens: 400,
      return_citations: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  const citations = data.citations || [];

  // Extract JSON from response (handle markdown code blocks)
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      sources: citations.slice(0, 3).map((url: string) => ({
        title: new URL(url).hostname.replace('www.', ''),
        url,
      })),
    };
  }

  throw new Error('Could not parse response');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { service, zip } = req.body || {};
  if (!service || !zip) return res.status(400).json({ error: 'Missing service or zip' });

  try {
    if (!PERPLEXITY_API_KEY) throw new Error('No API key');

    const result = await getQuoteFromPerplexity(service, zip);

    return res.status(200).json({
      success: true,
      service,
      zip,
      ...result,
      disclaimer: 'This is a rough estimate based on market data. Actual costs may vary. Get a free personalized quote by calling (630) 703-2607.',
    });
  } catch (error: any) {
    console.error('Quote estimation error:', error?.message);
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
