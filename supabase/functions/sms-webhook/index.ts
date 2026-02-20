import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH = Deno.env.get("TWILIO_AUTH_TOKEN") || "";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "";

async function sendTelegramAlert(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("Telegram alert failed:", e);
  }
}

async function sendSMS(to: string, body: string) {
  try {
    const params = new URLSearchParams({ To: to, From: "+16307032607", Body: body });
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${TWILIO_SID}:${TWILIO_AUTH}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (e) {
    console.error("SMS reply failed:", e);
  }
}

// Try to parse service + zip from message
function parseServiceRequest(body: string): { service: string | null; zip: string | null } {
  const lower = body.toLowerCase();
  let service: string | null = null;
  let zip: string | null = null;

  // Match service
  if (/plumb/i.test(lower)) service = "plumbing";
  else if (/hvac|heat|cool|furnace|ac\b|air condition/i.test(lower)) service = "hvac";
  else if (/electric/i.test(lower)) service = "electrical";
  else if (/roof/i.test(lower)) service = "roofing";
  else if (/pest|bug|ant|roach|termite/i.test(lower)) service = "pest-control";
  else if (/appliance|washer|dryer|fridge|dishwash/i.test(lower)) service = "appliance-repair";

  // Match zip
  const zipMatch = body.match(/\b(\d{5})\b/);
  if (zipMatch) zip = zipMatch[1];

  return { service, zip };
}

serve(async (req) => {
  // Handle CORS preflight for website submissions
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  let params: Record<string, string> = {};
  let isWebsite = false;
  try {
    const text = await req.text();
    // Try JSON first (website submissions), fall back to URLSearchParams (Twilio)
    try {
      const json = JSON.parse(text);
      if (json.source && (json.source.startsWith('website') || json.routing === 'elocal')) {
        isWebsite = true;
        params = {
          From: json.phone || "unknown",
          Body: `${json.service || ""} ${json.zip_code || ""}`.trim(),
          _source: json.source,
          _service: json.service || "",
          _zip: json.zip_code || "",
          _timing: json.timing || "",
          _routing: json.routing || "",
          _contact: json.contact || "",
          _delivery_method: json.delivery_method || "",
          _quote_estimate: json.quote_estimate || "",
        };
      }
    } catch {
      // Not JSON — parse as URL-encoded (Twilio format)
    }
    if (!isWebsite) {
      const sp = new URLSearchParams(text);
      for (const [k, v] of sp.entries()) params[k] = v;
    }
  } catch { /* empty */ }

  const from = params.From || "unknown";
  const to = params.To || "";
  const body = params.Body || "";
  const messageSid = params.MessageSid || "";

  // Skip if no body AND not a website submission
  if (!body.trim() && !isWebsite) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // For website submissions, use the structured data directly
  const service = isWebsite ? (params._service || null) : parseServiceRequest(body).service;
  const zip = isWebsite ? (params._zip || null) : parseServiceRequest(body).zip;

  // Alert on Telegram
  const alertEmoji = isWebsite ? "🌐" : "💬";
  const alertType = isWebsite ? "Website Lead" : "Inbound SMS";
  const timingInfo = params._timing ? `\n⏰ Timing: ${params._timing}` : "";
  await sendTelegramAlert(
    `${alertEmoji} <b>${alertType}</b>\n📱 <code>${from}</code>${isWebsite ? "" : `\n✉️ "${body}"`}${service ? `\n🔧 Service: ${service}` : ""}${zip ? `\n📍 ZIP: ${zip}` : ""}${timingInfo}`
  );

  // Check if this is an existing lead (from a follow-up to our call SMS)
  let existingLead = false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?phone=eq.${encodeURIComponent(from)}&status=eq.new&order=created_at.desc&limit=1`,
      {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      }
    );
    const leads = await res.json();
    if (leads.length > 0) {
      // Update existing lead
      existingLead = true;
      await fetch(
        `${SUPABASE_URL}/rest/v1/leads?id=eq.${leads[0].id}`,
        {
          method: "PATCH",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            service_needed: service || leads[0].service_needed,
            zip_code: zip || leads[0].zip_code,
            notes: `SMS: "${body}" | Previous: ${leads[0].notes || ""}`,
            source: "direct_sms",
          }),
        }
      );
    }
  } catch { /* best effort */ }

  // Create new lead if no existing one
  if (!existingLead) {
    const leadSource = isWebsite ? (params._source || "website") : "direct_sms";
    const leadNotes = isWebsite
      ? `Web lead: ${params._service} | ${params._timing} | ZIP: ${params._zip}${params._quote_estimate ? ` | Est: ${params._quote_estimate}` : ""}`
      : `Message: "${body}"`;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          phone: from,
          source: leadSource,
          service_needed: service,
          zip_code: zip,
          state: "IL",
          notes: leadNotes,
        }),
      });
    } catch { /* best effort */ }
  }

  // Trigger a callback — call them with our ElevenLabs voice
  if (isWebsite || service || zip) {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/voice-webhook/trigger-callback`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ phone: from, service: service || "" }).toString(),
      });
      await sendTelegramAlert(`📞 <b>Auto-callback triggered</b>\n📱 <code>${from}</code>\n🔧 Service: ${service || "unknown"}\n📍 ZIP: ${zip || "unknown"}\n📤 Calling them back now`);
    } catch (e) {
      console.error("Callback trigger failed:", e);
    }
  }

  // Auto-reply via SMS
  let reply: string;
  if (service && zip) {
    reply = `Got it! We're looking for a verified ${service} pro near ${zip}. You'll receive a call from us shortly with next steps. Or browse verified pros at findalocalpro.com/directory`;
  } else if (service) {
    reply = `Thanks! We got your ${service} request. What's your zip code so we can find the closest verified pro? You'll get a call from us shortly.`;
  } else if (zip) {
    reply = `Thanks! What service do you need? (plumbing, HVAC, electrical, roofing, pest control, or appliance repair)`;
  } else {
    reply = `Thanks for reaching out to FindALocalPro! What service do you need and what's your zip code? For example: "plumbing 60515"`;
  }

  // Website submissions get JSON response; SMS gets TwiML
  if (isWebsite) {
    return new Response(
      JSON.stringify({ ok: true, message: "Lead received", service, zip, callback: from !== "unknown" }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  // Return TwiML response (auto-reply)
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
});
