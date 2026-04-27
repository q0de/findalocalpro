import { NextRequest, NextResponse } from "next/server";

/**
 * Resend Webhook → Telegram Notifications
 *
 * Resend POSTs events here (delivered, opened, clicked, bounced, complained).
 * We forward notable ones to Telegram so Shaquille Oatmeal sees the full journey.
 *
 * Resend webhook payload:
 * {
 *   "type": "email.delivered" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained",
 *   "created_at": "2026-...",
 *   "data": {
 *     "email_id": "...",
 *     "from": "...",
 *     "to": ["..."],
 *     "subject": "...",
 *     "click"?: { "link": "..." }
 *   }
 * }
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

// Extract restaurant name from subject line patterns
function extractRestaurantName(subject: string): string {
  // "[TEST] About the April 23, 2026 CDPH report at SWEET BEAN"
  const atMatch = subject.match(/at\s+(.+)$/i);
  if (atMatch) return atMatch[1].trim();

  // "[TEST] Re-inspection clock started — SWEET BEAN"
  const dashMatch = subject.match(/—\s+(.+)$/);
  if (dashMatch) return dashMatch[1].trim();

  return "Unknown Restaurant";
}

// Extract category from the /call/ URL if clicked
function extractCategory(url: string): string {
  const match = url.match(/\/call\/([\w-]+)/);
  if (match) return match[1].replace(/-/g, " ");
  return "";
}

const EVENT_CONFIG: Record<string, { emoji: string; template: (data: any, restaurant: string) => string }> = {
  "email.delivered": {
    emoji: "📬",
    template: (data, restaurant) =>
      `📬 <b>Delivered</b> to ${restaurant}\n📧 ${data.to?.[0] || "unknown"}`,
  },
  "email.opened": {
    emoji: "👀",
    template: (data, restaurant) =>
      `👀 <b>${restaurant}</b> opened the email!`,
  },
  "email.clicked": {
    emoji: "🔗",
    template: (data, restaurant) => {
      const link = data.click?.link || "";
      const category = extractCategory(link);
      if (category) {
        return `🔗 <b>${restaurant}</b> tapped the phone number (${category})! 🎯📞`;
      }
      if (link.includes("findalocalpro.com/directory")) {
        return `🌐 <b>${restaurant}</b> clicked through to browse FindALocalPro! 🎯`;
      }
      if (link.includes("findalocalpro.com")) {
        return `🌐 <b>${restaurant}</b> visited FindALocalPro.com`;
      }
      return `🔗 <b>${restaurant}</b> clicked a link: ${link}`;
    },
  },
  "email.bounced": {
    emoji: "📭",
    template: (data, restaurant) =>
      `📭 <b>Bounced</b> — ${restaurant}\n📧 ${data.to?.[0] || "unknown"}\n⚠️ Bad email address, removing from list`,
  },
  "email.complained": {
    emoji: "🚫",
    template: (data, restaurant) =>
      `🚫 <b>Spam complaint</b> — ${restaurant}\n📧 ${data.to?.[0] || "unknown"}\n⚠️ Auto-suppressed from future sends`,
  },
};

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Missing Telegram config");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.type as string;
    const data = body.data || {};

    // Skip events we don't care about
    const config = EVENT_CONFIG[eventType];
    if (!config) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const restaurant = extractRestaurantName(data.subject || "");
    const message = config.template(data, restaurant);

    // Add header
    const fullMessage = `🦞 <b>FindALocalPro Outreach</b>\n\n${message}`;

    await sendTelegram(fullMessage);

    return NextResponse.json({ ok: true, event: eventType });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Resend sends a GET to verify the webhook URL
export async function GET() {
  return NextResponse.json({ status: "ok", service: "findalocalpro-outreach-webhook" });
}
