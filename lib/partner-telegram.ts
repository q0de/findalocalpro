import type { PartnerApplication } from '@/lib/partner-types';

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required');
  return { token, chatId };
}

async function sendTelegram(payload: Record<string, unknown>) {
  const config = getTelegramConfig();

  const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: config.chatId, disable_web_page_preview: true, ...payload }),
  });

  if (!response.ok) throw new Error(`Telegram send failed (${response.status}): ${await response.text()}`);
  return { ok: true };
}

export async function sendPartnerApplicationForReview(
  application: PartnerApplication,
  links: { approve: string; decline: string },
) {
  const territory = application.preferred_territory || 'Recommend best open territory';
  const text = [
    'New Neighborhood Demand Engine application',
    '',
    `Business: ${application.business_name}`,
    `Contact: ${application.contact_name}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Category: ${application.category}`,
    `Territory: ${territory}`,
    `Areas: ${application.service_areas}`,
    'Payment: none collected · approval required before checkout',
    'Approved plan: $500 for 3 monthly cycles · then $750/mo',
    '',
    'Review within seven days. Each action can be used once.',
  ].join('\n');

  return sendTelegram({
    text,
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Review approval', url: links.approve },
        { text: '✕ Review decline', url: links.decline },
      ]],
    },
  });
}

export async function sendPartnerOperationsAlert(message: string) {
  return sendTelegram({ text: `⚠️ Partner action required\n\n${message}` });
}
