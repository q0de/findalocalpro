import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function clean(value: FormDataEntryValue | null, max = 500) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

function line(label: string, value: string) {
  return value ? `${label}: ${value}` : '';
}

async function notifyTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();

  const businessName = clean(form.get('businessName'), 120);
  const contactName = clean(form.get('contactName'), 120);
  const email = clean(form.get('email'), 160);
  const phone = clean(form.get('phone'), 80);
  const website = clean(form.get('website'), 240);
  const serviceCategory = clean(form.get('serviceCategory'), 120);
  const serviceAreas = clean(form.get('serviceAreas'), 240);
  const yearsInBusiness = clean(form.get('yearsInBusiness'), 80);
  const googleBusinessProfile = clean(form.get('googleBusinessProfile'), 240);
  const preferredTerritory = clean(form.get('preferredTerritory'), 160);
  const notes = clean(form.get('notes'), 900);
  const licenseConfirmed = form.get('licenseConfirmed') ? 'yes' : 'no';

  if (!businessName || !contactName || !email || !phone || !serviceCategory || !serviceAreas || !preferredTerritory || licenseConfirmed !== 'yes') {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
  }

  const body = [
    '🤝 <b>New FindALocalPro Partner Application</b>',
    line('Business', businessName),
    line('Contact', contactName),
    line('Email', email),
    line('Phone', phone),
    line('Website', website),
    line('Category', serviceCategory),
    line('Service areas', serviceAreas),
    line('Preferred territory', preferredTerritory),
    line('Years in business', yearsInBusiness),
    line('GBP', googleBusinessProfile),
    line('License/insurance confirmed', licenseConfirmed),
    line('Notes', notes),
  ].filter(Boolean).join('\n');

  try {
    await notifyTelegram(body);
  } catch (error) {
    console.error('partner application notification failed', error);
  }

  const redirectUrl = new URL('/partners?applied=1#apply', request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
