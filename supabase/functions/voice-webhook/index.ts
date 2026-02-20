// FindALocalPro — Twilio Voice Webhook (Supabase Edge Function)
// Handles inbound calls with IVR + call bridging to eLocal
// Also handles SMS-triggered outbound call bridges

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")!;
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")!;
const TWILIO_NUMBER = Deno.env.get("TWILIO_NUMBER") || "+16307032607";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

const WEBHOOK_BASE = Deno.env.get("WEBHOOK_BASE") || "https://hocipkeeikriqyojiboj.supabase.co/functions/v1";
const AUDIO_BASE = "https://hocipkeeikriqyojiboj.supabase.co/storage/v1/object/public/ivr-audio";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── eLocal tracking numbers per vertical ────────────────
// PLACEHOLDER — replace with real eLocal numbers once approved
const ELOCAL_NUMBERS: Record<string, string> = {
  plumbing: "+18005551001",      // TODO: real eLocal plumbing number
  hvac: "+18005551002",           // TODO: real eLocal HVAC number
  electrical: "+18005551003",     // TODO: real eLocal electrical number
  roofing: "+18005551004",        // TODO: real eLocal roofing number
  "pest control": "+18005551005", // TODO: real eLocal pest control number
  landscaping: "+18005551006",    // TODO: real eLocal landscaping number
  "appliance repair": "+18005551007",
  handyman: "+18005551008",
  painting: "+18005551009",
  "water damage": "+18005551010",
  "garage door": "+18005551011",
  locksmith: "+18005551012",
  "tree service": "+18005551013",
  fencing: "+18005551014",
  concrete: "+18005551015",
  "house cleaning": "+18005551016",
  "bathroom remodeling": "+18005551017",
  "air duct cleaning": "+18005551018",
  default: "+18005551000",        // TODO: real eLocal general number
};

// IVR menu — maps DTMF digits to verticals
const IVR_MENU: Record<string, string> = {
  "1": "plumbing",
  "2": "hvac",
  "3": "electrical",
  "4": "roofing",
  "5": "pest control",
  "6": "appliance repair",
  "7": "landscaping",
  "8": "handyman",
  "0": "default", // speak to someone / other
};

// ── Telegram notification ───────────────────────────────
async function notifyTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("[Telegram] Error:", err);
  }
}

// ── Log call to Supabase ────────────────────────────────
async function logCall(params: {
  fromNumber: string; toNumber: string; direction: string;
  service?: string; callSid?: string; status?: string;
}) {
  // Find or create lead
  const { data: existing } = await supabase
    .from("leads")
    .select("*")
    .eq("phone", params.fromNumber)
    .order("created_at", { ascending: false })
    .limit(1);

  let lead;
  if (existing && existing.length > 0) {
    lead = existing[0];
    await supabase.from("leads").update({ last_contact: new Date().toISOString() }).eq("id", lead.id);
  } else {
    const { data: newLead } = await supabase
      .from("leads")
      .insert({ phone: params.fromNumber, source: "direct_call", status: "new" })
      .select()
      .single();
    lead = newLead;
  }

  if (lead && params.service) {
    await supabase.from("leads").update({ service_needed: params.service }).eq("id", lead.id);
  }

  // Log conversation as voice type
  if (lead) {
    await supabase.from("conversations").insert({
      lead_id: lead.id,
      direction: params.direction,
      message_type: "voice",
      body: `Call: ${params.service || "IVR entry"} | Status: ${params.status || "initiated"}`,
      twilio_sid: params.callSid || null,
      twilio_status: params.status || "initiated",
      from_number: params.fromNumber,
      to_number: params.toNumber,
    });
  }

  return lead;
}

// ── Main handler ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Health check
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", service: "FindALocalPro Voice Webhook", timestamp: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await req.formData();
  const callSid = formData.get("CallSid") as string;
  const from = formData.get("From") as string;
  const to = formData.get("To") as string;
  const digits = formData.get("Digits") as string;
  const callStatus = formData.get("CallStatus") as string;

  // ── Route: /gather — IVR digit collection response ────
  if (path.endsWith("/gather")) {
    const selectedService = IVR_MENU[digits] || null;

    if (!selectedService) {
      // Invalid input, retry
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${WEBHOOK_BASE}/voice-webhook/gather" method="POST" timeout="10">
    <Play>${AUDIO_BASE}/menu_retry.mp3</Play>
  </Gather>
  <Play>${AUDIO_BASE}/no_response.mp3</Play>
</Response>`;
      return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
    }

    const elocalNumber = ELOCAL_NUMBERS[selectedService] || ELOCAL_NUMBERS.default;

    // Log the call with service
    const lead = await logCall({
      fromNumber: from, toNumber: to, direction: "inbound",
      service: selectedService, callSid, status: "ivr_selected",
    });

    // Notify Telegram
    await notifyTelegram(`📞 *FindALocalPro Call*
📱 ${from}
🔧 Service: ${selectedService}
🔄 Bridging to eLocal...
📊 Source: direct call`);

    // Map service to audio file name
    const audioMap: Record<string, string> = {
      plumbing: "connect_plumbing", hvac: "connect_heating_and_cooling",
      electrical: "connect_electrical", roofing: "connect_roofing",
      "pest control": "connect_pest_control", "appliance repair": "connect_appliance_repair",
      landscaping: "connect_landscaping", handyman: "connect_handyman",
      default: "connect_other",
    };
    const connectAudio = audioMap[selectedService] || "connect_other";

    // Check if we have a real eLocal number (not placeholder)
    const isLive = !elocalNumber.startsWith("+1800555");

    let twiml: string;
    if (isLive) {
      // Real eLocal number — bridge the call
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalNumber}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/connect_failed.mp3</Play>
</Response>`;
    } else {
      // Placeholder — play "not yet live" message
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Pause length="1"/>
  <Play>${AUDIO_BASE}/not_yet_live.mp3</Play>
</Response>`;
    }
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Service name to audio clip mapping ──────────────────
const SVC_AUDIO_MAP: Record<string, string> = {
  plumbing: "svc_plumbing", hvac: "svc_hvac", "HVAC": "svc_hvac",
  electrical: "svc_electrical", roofing: "svc_roofing",
  "pest control": "svc_pest_control", "appliance repair": "svc_appliance_repair",
  landscaping: "svc_landscaping", handyman: "svc_handyman",
  painting: "svc_painting", "garage door": "svc_garage_door",
  locksmith: "svc_locksmith", "tree service": "svc_tree_service",
  fencing: "svc_fencing", concrete: "svc_concrete",
  "house cleaning": "svc_house_cleaning", "bathroom remodeling": "svc_bathroom_remodeling",
  "air duct cleaning": "svc_air_duct_cleaning", "water damage": "svc_water_damage",
  default: "svc_default",
};

// ── Route: /bridge-nozip — SMS-triggered call, asks for zip first ──
  if (path.endsWith("/bridge-nozip")) {
    const service = formData.get("service") as string || url.searchParams.get("service") || "default";
    const svcAudio = SVC_AUDIO_MAP[service] || SVC_AUDIO_MAP.default;

    // Play intro + service name + ask for zip via Gather
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="5" action="${WEBHOOK_BASE}/voice-webhook/bridge-zip?service=${encodeURIComponent(service)}" method="POST" timeout="10">
    <Play>${AUDIO_BASE}/bridge_intro.mp3</Play>
    <Play>${AUDIO_BASE}/${svcAudio}.mp3</Play>
    <Play>${AUDIO_BASE}/ask_zip.mp3</Play>
  </Gather>
  <Gather numDigits="5" action="${WEBHOOK_BASE}/voice-webhook/bridge-zip?service=${encodeURIComponent(service)}" method="POST" timeout="8">
    <Play>${AUDIO_BASE}/ask_zip_retry.mp3</Play>
  </Gather>
  <Play>${AUDIO_BASE}/no_zip_fallback.mp3</Play>
</Response>`;
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /bridge-zip — received zip from nozip call, now bridge ──
  if (path.endsWith("/bridge-zip")) {
    const service = formData.get("service") as string || url.searchParams.get("service") || "default";
    const zipCode = digits; // 5-digit zip from Gather

    // Store the zip on the lead
    if (from && zipCode) {
      const { data: leads } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", from)
        .order("created_at", { ascending: false })
        .limit(1);

      if (leads && leads.length > 0) {
        await supabase.from("leads").update({
          zip_code: zipCode,
          service_needed: service,
        }).eq("id", leads[0].id);

        await supabase.from("conversations").insert({
          lead_id: leads[0].id,
          direction: "inbound",
          message_type: "voice",
          body: `Provided zip ${zipCode} via phone for ${service}`,
          twilio_sid: callSid,
          twilio_status: "in-progress",
          from_number: from,
          to_number: to || TWILIO_NUMBER,
        });
      }
    }

    // Notify Telegram with the zip
    await notifyTelegram(`📞 *Lead provided zip via phone!*
📱 ${from}
🔧 Service: ${service}
📍 Zip: ${zipCode}
🔄 Bridging to eLocal...`);

    const elocalNumber = ELOCAL_NUMBERS[service] || ELOCAL_NUMBERS.default;
    const isLive = !elocalNumber.startsWith("+1800555");

    // Map service to connect audio
    const audioMap: Record<string, string> = {
      plumbing: "connect_plumbing", hvac: "connect_heating_and_cooling",
      "HVAC": "connect_heating_and_cooling",
      electrical: "connect_electrical", roofing: "connect_roofing",
      "pest control": "connect_pest_control", "appliance repair": "connect_appliance_repair",
      landscaping: "connect_landscaping", handyman: "connect_handyman",
      default: "connect_other",
    };
    const connectAudio = audioMap[service] || "connect_other";

    let twiml: string;
    if (isLive) {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalNumber}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/connect_failed.mp3</Play>
</Response>`;
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Pause length="1"/>
  <Play>${AUDIO_BASE}/not_yet_live.mp3</Play>
</Response>`;
    }
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /bridge — SMS-triggered outbound call bridge ──
  if (path.endsWith("/bridge")) {
    // This is called when we initiate an outbound call to the lead
    // The lead picks up, hears a message, then gets bridged to eLocal
    const service = formData.get("service") as string || url.searchParams.get("service") || "default";
    const elocalNumber = ELOCAL_NUMBERS[service] || ELOCAL_NUMBERS.default;

    const isLive = !elocalNumber.startsWith("+1800555");

    let twiml: string;
    if (isLive) {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/bridge_greeting.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalNumber}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/bridge_failed.mp3</Play>
</Response>`;
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/bridge_greeting.mp3</Play>
  <Pause length="1"/>
  <Play>${AUDIO_BASE}/not_yet_live.mp3</Play>
</Response>`;
    }
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /status — call completion status ───────────
  if (path.endsWith("/status")) {
    const dialCallStatus = formData.get("DialCallStatus") as string;
    const dialCallDuration = formData.get("DialCallDuration") as string;

    console.log(`[Voice] Call ${callSid} completed: ${dialCallStatus}, duration: ${dialCallDuration}s`);

    // Update lead with call result
    if (from) {
      const { data: leads } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", from)
        .order("created_at", { ascending: false })
        .limit(1);

      if (leads && leads.length > 0) {
        await supabase.from("conversations").insert({
          lead_id: leads[0].id,
          direction: "outbound",
          message_type: "voice",
          body: `Call bridge ${dialCallStatus} | Duration: ${dialCallDuration || 0}s`,
          twilio_sid: callSid,
          twilio_status: dialCallStatus,
          from_number: TWILIO_NUMBER,
          to_number: from,
        });
      }
    }

    // Notify on completion
    if (dialCallStatus === "completed" && parseInt(dialCallDuration || "0") > 30) {
      await notifyTelegram(`✅ *Call Connected!*
📱 ${from}
⏱ Duration: ${dialCallDuration}s
💰 Likely billable call`);
    } else if (dialCallStatus !== "completed") {
      await notifyTelegram(`❌ *Call Failed*
📱 ${from}
Status: ${dialCallStatus}
⏱ Duration: ${dialCallDuration || 0}s`);
    }

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // ── Default: Inbound call IVR greeting ────────────────
  const lead = await logCall({
    fromNumber: from, toNumber: to, direction: "inbound",
    callSid, status: "ringing",
  });

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${WEBHOOK_BASE}/voice-webhook/gather" method="POST" timeout="10">
    <Play>${AUDIO_BASE}/greeting.mp3</Play>
    <Pause length="1"/>
    <Play>${AUDIO_BASE}/menu.mp3</Play>
  </Gather>
  <Play>${AUDIO_BASE}/no_response.mp3</Play>
</Response>`;

  return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
});
