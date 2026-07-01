import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type PartnerPayload = {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  category?: string;
  serviceAreas?: string;
  yearsInBusiness?: string;
  googleProfile?: string;
  preferredTerritory?: string;
  notes?: string;
  confirmed?: boolean;
};

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 600) : '';
}

function buildMessage(payload: PartnerPayload) {
  const lines = [
    '*New Neighborhood Demand Engine Application*',
    '',
    `*Business:* ${clean(payload.businessName) || 'Unknown'}`,
    `*Contact:* ${clean(payload.contactName) || 'Unknown'}`,
    `*Email:* ${clean(payload.email) || 'Unknown'}`,
    `*Phone:* ${clean(payload.phone) || 'Unknown'}`,
    `*Category:* ${clean(payload.category) || 'Unknown'}`,
    `*Territory:* ${clean(payload.preferredTerritory) || 'Recommend best open territory'}`,
    `*Areas:* ${clean(payload.serviceAreas) || 'Unknown'}`,
    '*Offer:* Founding Partner Plan - $497/mo for first 3 months, then $750/mo standard',
  ];

  if (payload.website) lines.push(`*Website:* ${clean(payload.website)}`);
  if (payload.googleProfile) lines.push(`*GBP:* ${clean(payload.googleProfile)}`);
  if (payload.yearsInBusiness) lines.push(`*Years:* ${clean(payload.yearsInBusiness)}`);
  if (payload.notes) lines.push('', `*Notes:* ${clean(payload.notes)}`);

  return lines.join('\n');
}

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { skipped: true };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      return { skipped: false, ok: false, status: response.status };
    }

    return { skipped: false, ok: true };
  } catch (error) {
    console.error('Partner Telegram send failed:', error);
    return { skipped: false, ok: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as PartnerPayload;
    const email = clean(payload.email);
    const phoneDigits = clean(payload.phone).replace(/\D/g, '');

    if (!clean(payload.businessName) || !clean(payload.contactName) || !email.includes('@') || phoneDigits.length !== 10) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!clean(payload.category) || !clean(payload.serviceAreas) || !payload.confirmed) {
      return NextResponse.json({ error: 'Missing partner details' }, { status: 400 });
    }

    const telegram = await sendTelegram(buildMessage(payload));
    return NextResponse.json({ ok: true, telegram });
  } catch (error) {
    console.error('Partner application error:', error);
    return NextResponse.json({ error: 'Could not submit application' }, { status: 500 });
  }
}
