import { NextRequest, NextResponse } from "next/server";

/**
 * /call/[category] — Redirects to the Twilio tracking number for that service category.
 * Used in outreach emails so all links match the sending domain (findalocalpro.com).
 * Also gives us click tracking for free via server logs / analytics.
 */

const CATEGORY_PHONES: Record<string, string> = {
  "pest-control": "6304913723",
  "refrigeration-hvac": "6304913724",
  "plumbing": "6304913725",
  "hood-ventilation": "6304913726",
  "commercial-cleaning": "6304913727",
  "handyman": "6304913728",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const phone = CATEGORY_PHONES[category];

  if (!phone) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // TODO: optionally log the click to Supabase here (restaurant, category, timestamp)

  return NextResponse.redirect(`tel:${phone}`, 302);
}
