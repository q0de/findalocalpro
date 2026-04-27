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

// Category → emoji mapping (matches Twilio voice-webhook style)
const CATEGORY_ICON: Record<string, string> = {
  "pest-control": "🐛",
  "pest control": "🐛",
  "refrigeration-hvac": "❄️",
  "plumbing": "🔧",
  "hood-ventilation": "🏗️",
  "commercial-cleaning": "🧹",
  "handyman": "🛠️",
  "default": "📧",
};

function catIcon(category: string): string {
  return CATEGORY_ICON[category] || CATEGORY_ICON.default;
}

// Extract restaurant name from subject line patterns
function extractRestaurantName(subject: string): string {
  const atMatch = subject.match(/at\s+(.+)$/i);
  if (atMatch) return atMatch[1].trim();
  const dashMatch = subject.match(/—\s+(.+)$/);
  if (dashMatch) return dashMatch[1].trim();
  return "Unknown Restaurant";
}

// Extract category from the /call/ URL if clicked
function extractCategory(url: string): string {
  const match = url.match(/\/call\/([\w-]+)/);
  if (match) return match[1];
  return "";
}

const EVENT_CONFIG: Record<string, { template: (data: any, restaurant: string) => string }> = {
  "email.delivered": {
    template: (data, restaurant) =>
      `📬 *DELIVERED*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}`,
  },
  "email.opened": {
    template: (data, restaurant) =>
      `👀 *OPENED!*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}`,
  },
  "email.clicked": {
    template: (data, restaurant) => {
      const link = data.click?.link || "";
      const category = extractCategory(link);
      if (category) {
        const icon = catIcon(category);
        const label = category.replace(/-/g, " ");
        return `📞 *PHONE TAP!*\n${icon} ${label}\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}\n🎯 Hot lead — expecting call`;
      }
      if (link.includes("/directory")) {
        return `🌐 *SITE VISIT!*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}\n🔗 Browsing pro directory`;
      }
      if (link.includes("findalocalpro")) {
        return `🌐 *SITE VISIT*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}`;
      }
      return `🔗 *LINK CLICK*\n📧 ${restaurant}\n🔗 ${link}`;
    },
  },
  "email.bounced": {
    template: (data, restaurant) =>
      `📭 *BOUNCED*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}\n⚠️ Bad email — auto-removed`,
  },
  "email.complained": {
    template: (data, restaurant) =>
      `🚫 *SPAM COMPLAINT*\n📧 ${restaurant}\n📩 ${data.to?.[0] || "unknown"}\n⚠️ Auto-suppressed from future sends`,
  },
};

async function sendTelegram(message: string): Promise<{ ok: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    const err = `Missing config: token=${!!TELEGRAM_BOT_TOKEN} chat=${!!TELEGRAM_CHAT_ID}`;
    console.error(err);
    return { ok: false, error: err };
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", JSON.stringify(data));
      return { ok: false, error: data.description || "unknown" };
    }
    return { ok: true };
  } catch (e: any) {
    console.error("Telegram fetch error:", e.message);
    return { ok: false, error: e.message };
  }
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

    const fullMessage = `📨 *FindALocalPro Outreach*\n\n${message}`;

    const tgResult = await sendTelegram(fullMessage);

    return NextResponse.json({ ok: true, event: eventType, telegram: tgResult });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Resend sends a GET to verify the webhook URL
export async function GET() {
  return NextResponse.json({ status: "ok", service: "findalocalpro-outreach-webhook" });
}
