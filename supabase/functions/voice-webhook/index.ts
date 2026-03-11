// FindALocalPro — Twilio Voice Webhook (Supabase Edge Function)
// Handles inbound calls with IVR + call bridging to eLocal
// Also handles SMS-triggered outbound call bridges

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { zipToState } from "./zip-to-state.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")!;
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")!;
const TWILIO_NUMBER = Deno.env.get("TWILIO_NUMBER") || "+16304071727";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;
const ELOCAL_API_KEY = Deno.env.get("ELOCAL_API_KEY")!;

const WEBHOOK_BASE = Deno.env.get("WEBHOOK_BASE") || "https://hocipkeeikriqyojiboj.supabase.co/functions/v1";
const AUDIO_BASE = "https://hocipkeeikriqyojiboj.supabase.co/storage/v1/object/public/ivr-audio";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Service to eLocal Need ID mapping ────────────────────────
// Using catch-all NONE IDs for simplicity
const SERVICE_TO_NEED_ID: Record<string, string> = {
  "plumbing": "10000-",
  "hvac": "583-",           // Heating
  "electrical": "5000-",
  "pest control": "6000-",
  "appliance repair": "149-",
  "air conditioning": "584-",
  "roofing": "584-",        // Map to AC as closest fallback
  "default": "10000-",      // Default to plumbing
};

// ── Dedicated vertical numbers → skip IVR, bridge directly ──
const VERTICAL_NUMBERS: Record<string, { service: string; needId: string; audio: string }> = {
  "+16307565104": { service: "plumbing", needId: "10000-", audio: "direct_plumbing" },
  "+16303183024": { service: "electrical", needId: "5000-", audio: "direct_electrical" },
  "+16305998262": { service: "air conditioning", needId: "584-", audio: "direct_cooling" },
  "+16307565505": { service: "hvac", needId: "583-", audio: "direct_heating" },
  "+16304913723": { service: "pest control", needId: "6000-", audio: "direct_pest_control" },
  "+16307565185": { service: "appliance repair", needId: "149-", audio: "direct_appliance" },
};

// ── Vertical-specific icons for Telegram ────────────────────
const SERVICE_ICON: Record<string, string> = {
  "plumbing": "🔧",
  "electrical": "⚡",
  "hvac": "🔥",
  "heating": "🔥",
  "air conditioning": "❄️",
  "pest control": "🐛",
  "appliance repair": "🔌",
  "roofing": "🏠",
  "landscaping": "🌿",
  "handyman": "🛠️",
  "default": "📞",
};

function svcIcon(service: string): string {
  return SERVICE_ICON[service] || SERVICE_ICON.default;
}

// Default zip for caller lookup fallback (DuPage County, IL)
const DEFAULT_ZIP = "60515";

// ── Twilio Lookup → approximate caller zip ──────────────
async function lookupCallerZip(phoneNumber: string): Promise<string> {
  try {
    const resp = await fetch(
      `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneNumber)}?Fields=caller_name,line_type_intelligence`,
      {
        headers: {
          Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        },
      }
    );
    if (!resp.ok) {
      console.log(`[Lookup] Failed: ${resp.status}`);
      return DEFAULT_ZIP;
    }
    const data = await resp.json();
    // Twilio Lookup v2 doesn't directly return zip, but line_type_intelligence
    // may have carrier info. For now, use area code heuristic as primary.
    console.log("[Lookup] Data:", JSON.stringify(data));
    return DEFAULT_ZIP;
  } catch (err) {
    console.error("[Lookup] Error:", err);
    return DEFAULT_ZIP;
  }
}

// ── Area code → zip heuristic for Illinois coverage ─────
function areaCodeToZip(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const areaCode = digits.length >= 10 ? digits.slice(digits.length - 10, digits.length - 7) : "";
  const ZIP_MAP: Record<string, string> = {
    "630": "60515", // DuPage County
    "331": "60515", // DuPage overlay
    "708": "60402", // South/West suburbs
    "773": "60618", // Chicago
    "312": "60601", // Chicago Loop
    "847": "60025", // North suburbs
    "224": "60025", // North suburbs overlay
    "815": "60435", // Joliet/Will County
    "779": "60435", // Will County overlay
    "309": "61602", // Peoria
    "217": "62701", // Springfield
    "618": "62002", // Southern IL
    "872": "60601", // Chicago overlay
  };
  return ZIP_MAP[areaCode] || DEFAULT_ZIP;
}

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

// ── eLocal API Integration ──────────────────────────────────
interface ELocalPingResponse {
  status: string;
  phone_number?: string;
  price?: number;
  billable_duration?: number;
  token?: string;
  message?: string;
}

async function pingElocal(
  needId: string,
  zipCode: string,
  callerPhone: string
): Promise<ELocalPingResponse> {
  try {
    console.log(`[eLocal] Pinging: needId=${needId}, zip=${zipCode}, caller=${callerPhone}`);
    
    const response = await fetch("https://api.elocal.com/call/ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ping: {
          key: ELOCAL_API_KEY,
          zip_code: zipCode,
          need_id: needId,
          caller_id: callerPhone.replace(/\D/g, "").slice(-10),
        },
      }),
    });

    const data = await response.json();
    console.log("[eLocal] Response:", JSON.stringify(data));
    
    // eLocal wraps response in "response" key
    return data.response || data;
  } catch (error) {
    console.error("[eLocal] Error:", error);
    return {
      status: "error",
      message: `API call failed: ${error}`,
    };
  }
}

// ── Log eLocal ping to database ─────────────────────────────
async function logElocalPing(params: {
  callerPhone: string;
  zipCode: string;
  serviceCategory: string;
  needId: string;
  source: string;
  callSid?: string;
  leadId?: string;
  elocalResponse: ELocalPingResponse;
}) {
  try {
    const elocalData: any = {
      caller_phone: params.callerPhone,
      zip_code: params.zipCode,
      service_category: params.serviceCategory,
      need_id: params.needId,
      source: params.source,
      twilio_call_sid: params.callSid || null,
      lead_id: params.leadId || null,
    };

    if (params.elocalResponse.status === "success") {
      elocalData.call_status = "ping_sent";
      elocalData.elocal_phone = params.elocalResponse.phone_number;
      elocalData.bid_price = params.elocalResponse.price;
      elocalData.billable_duration = params.elocalResponse.billable_duration;
      elocalData.elocal_token = params.elocalResponse.token;
    } else {
      elocalData.call_status = params.elocalResponse.status === "not_interested" ? "no_coverage" : "failed";
      elocalData.notes = params.elocalResponse.message;
    }

    const { data, error } = await supabase
      .from("elocal_leads")
      .insert(elocalData)
      .select()
      .single();

    if (error) {
      console.error("[DB] eLocal ping log error:", error);
    } else {
      console.log("[DB] eLocal ping logged:", data.id);
    }

    return data;
  } catch (error) {
    console.error("[DB] eLocal ping log exception:", error);
  }
}

// ── Telegram notification ───────────────────────────────────
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

// ── Log call to Supabase ────────────────────────────────────
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

// ── Main handler ────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Health check
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        service: "FindALocalPro Voice Webhook (eLocal Integrated)", 
        timestamp: new Date().toISOString(),
        elocal_api: ELOCAL_API_KEY ? "configured" : "missing"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // ── Route: /trigger-callback — must be before formData() parse ──
  if (path.endsWith("/trigger-callback")) {
    const text = await req.text();
    const cbParams = new URLSearchParams(text);
    const phone = cbParams.get("phone") || "";
    const service = cbParams.get("service") || "default";
    const zip = cbParams.get("zip") || "";

    if (!phone || phone === "unknown") {
      return new Response(JSON.stringify({ error: "No phone number provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⛔ GUARDRAIL: Never call our own numbers — prevents self-dial loops
    const OUR_NUMBERS = new Set([TWILIO_NUMBER, ...Object.keys(VERTICAL_NUMBERS)]);
    const normalizedPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    if (OUR_NUMBERS.has(normalizedPhone)) {
      console.error(`[trigger-callback] BLOCKED self-dial attempt to ${phone}`);
      await notifyTelegram(`🚨 <b>BLOCKED: Self-dial attempt!</b>\nTried to call our own number: ${phone}\nService: ${service} | ZIP: ${zip}`);
      return new Response(JSON.stringify({ error: "Cannot call our own numbers" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If we already have zip, skip the zip question — go straight to bridge-ready
    // If no zip, fall back to bridge-nozip which asks for it
    const callbackUrl = zip
      ? `${WEBHOOK_BASE}/voice-webhook/bridge-ready?service=${encodeURIComponent(service)}&zip=${encodeURIComponent(zip)}`
      : `${WEBHOOK_BASE}/voice-webhook/bridge-nozip?service=${encodeURIComponent(service)}`;

    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
      const callReqParams = new URLSearchParams({
        To: phone,
        From: TWILIO_NUMBER,
        Url: callbackUrl,
        StatusCallback: `${WEBHOOK_BASE}/voice-webhook/status`,
        StatusCallbackEvent: "completed",
        Timeout: "30",
      });

      const callResp = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: callReqParams.toString(),
      });

      const callData = await callResp.json();

      if (callResp.ok) {
        await logCall({
          fromNumber: TWILIO_NUMBER,
          toNumber: phone,
          direction: "outbound",
          service,
          callSid: callData.sid,
          status: "initiated",
        });
        return new Response(JSON.stringify({ ok: true, callSid: callData.sid }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        console.error("[trigger-callback] Twilio error:", callData);
        await notifyTelegram(`❌ *Callback failed*\n📱 ${phone}\nError: ${callData.message || "unknown"}`);
        return new Response(JSON.stringify({ error: callData.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      console.error("[trigger-callback] Error:", err);
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
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

    // Log the call with service
    const lead = await logCall({
      fromNumber: from, toNumber: to, direction: "inbound",
      service: selectedService, callSid, status: "ivr_selected",
    });

    // Now ask for zip code to ping eLocal
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="5" action="${WEBHOOK_BASE}/voice-webhook/gather-zip?service=${encodeURIComponent(selectedService)}" method="POST" timeout="10">
    <Play>${AUDIO_BASE}/ask_zip.mp3</Play>
  </Gather>
  <Gather numDigits="5" action="${WEBHOOK_BASE}/voice-webhook/gather-zip?service=${encodeURIComponent(selectedService)}" method="POST" timeout="8">
    <Play>${AUDIO_BASE}/ask_zip_retry.mp3</Play>
  </Gather>
  <Play>${AUDIO_BASE}/no_zip_fallback.mp3</Play>
</Response>`;
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /gather-zip — received zip from IVR, now ping eLocal ──
  if (path.endsWith("/gather-zip")) {
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
      }
    }

    // Ping eLocal
    const needId = SERVICE_TO_NEED_ID[service] || SERVICE_TO_NEED_ID.default;
    const elocalResponse = await pingElocal(needId, zipCode, from);

    // Log the eLocal ping
    const lead = await logElocalPing({
      callerPhone: from,
      zipCode,
      serviceCategory: service,
      needId,
      source: "direct_call",
      callSid,
      leadId: undefined, // We'll look it up if needed
      elocalResponse,
    });

    let twiml: string;
    
    if (elocalResponse.status === "success" && elocalResponse.phone_number) {
      // Success! Bridge to eLocal provider
      await notifyTelegram(`🎉 *eLocal Success!*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\n💰 Bid: $${elocalResponse.price}\n📞 Bridging to ${elocalResponse.phone_number}`);
      
      // Map service to audio file name
      const audioMap: Record<string, string> = {
        plumbing: "connect_plumbing", hvac: "connect_heating_and_cooling",
        electrical: "connect_electrical", roofing: "connect_roofing",
        "pest control": "connect_pest_control", "appliance repair": "connect_appliance_repair",
        landscaping: "connect_landscaping", handyman: "connect_handyman",
        default: "connect_other",
      };
      const connectAudio = audioMap[service] || "connect_other";

      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalResponse.phone_number}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/connect_failed.mp3</Play>
</Response>`;
    } else {
      // No coverage or error
      await notifyTelegram(`❌ *eLocal No Coverage*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\nStatus: ${elocalResponse.status}\nMessage: ${elocalResponse.message || "N/A"}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/no_coverage.mp3</Play>
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

  // ── Route: /bridge-ready — We already have service + zip, confirm and connect ──
  if (path.endsWith("/bridge-ready")) {
    const service = formData.get("service") as string || url.searchParams.get("service") || "default";
    const zipCode = formData.get("zip") as string || url.searchParams.get("zip") || "";

    // Ping eLocal
    const needId = SERVICE_TO_NEED_ID[service] || SERVICE_TO_NEED_ID.default;
    const elocalResponse = await pingElocal(needId, zipCode, from);

    // Log the eLocal ping
    await logElocalPing({
      callerPhone: from,
      zipCode,
      serviceCategory: service,
      needId,
      source: "callback",
      callSid,
      leadId: undefined,
      elocalResponse,
    });

    // Map service to the pre-recorded ElevenLabs service name clip
    const svcAudio = SVC_AUDIO_MAP[service] || SVC_AUDIO_MAP.default;

    // Resolve zip → state for the "in [State]" audio clip
    const stateCode = zipCode ? zipToState(zipCode) : null;
    const stateClip = stateCode ? `<Play>${AUDIO_BASE}/state_${stateCode}.mp3</Play>` : "";

    let twiml: string;
    if (elocalResponse.status === "success" && elocalResponse.phone_number) {
      // Success! Play intro and bridge
      await notifyTelegram(`🎉 *eLocal Callback Success!*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\n💰 Bid: $${elocalResponse.price}\n📞 Bridging to ${elocalResponse.phone_number}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/callback_intro.mp3</Play>
  <Play>${AUDIO_BASE}/${svcAudio}.mp3</Play>
  <Play>${AUDIO_BASE}/callback_request.mp3</Play>
  ${stateClip}
  <Pause length="1"/>
  <Play>${AUDIO_BASE}/callback_connecting.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalResponse.phone_number}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/callback_failed.mp3</Play>
</Response>`;
    } else {
      // No coverage
      await notifyTelegram(`❌ *eLocal No Coverage (Callback)*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\nStatus: ${elocalResponse.status}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/callback_intro.mp3</Play>
  <Play>${AUDIO_BASE}/${svcAudio}.mp3</Play>
  <Play>${AUDIO_BASE}/callback_request.mp3</Play>
  ${stateClip}
  <Pause length="1"/>
  <Play>${AUDIO_BASE}/callback_notlive.mp3</Play>
</Response>`;
    }

    // Log the call
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
          body: `Callback: confirmed ${service} in ${zipCode} - eLocal: ${elocalResponse.status}`,
          twilio_sid: formData.get("CallSid") as string,
          twilio_status: "in-progress",
          from_number: TWILIO_NUMBER,
          to_number: from,
        });
      }
    }

    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

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

  // ── Route: /bridge-zip — received zip from nozip call, now ping eLocal and bridge ──
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

    // Ping eLocal
    const needId = SERVICE_TO_NEED_ID[service] || SERVICE_TO_NEED_ID.default;
    const elocalResponse = await pingElocal(needId, zipCode, from);

    // Log the eLocal ping
    await logElocalPing({
      callerPhone: from,
      zipCode,
      serviceCategory: service,
      needId,
      source: "bridge_zip",
      callSid,
      leadId: undefined,
      elocalResponse,
    });

    let twiml: string;
    
    if (elocalResponse.status === "success" && elocalResponse.phone_number) {
      // Success! Bridge to provider
      await notifyTelegram(`🎉 *eLocal Bridge Success!*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\n💰 Bid: $${elocalResponse.price}\n📞 Bridging to ${elocalResponse.phone_number}`);
      
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

      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${connectAudio}.mp3</Play>
  <Dial callerId="${TWILIO_NUMBER}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalResponse.phone_number}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/connect_failed.mp3</Play>
</Response>`;
    } else {
      // No coverage
      await notifyTelegram(`❌ *eLocal No Coverage (Bridge)*\n📱 ${from}\n${svcIcon(service)} ${service} in ${zipCode}\nStatus: ${elocalResponse.status}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/no_coverage.mp3</Play>
</Response>`;
    }

    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /bridge — SMS-triggered outbound call bridge (legacy) ──
  if (path.endsWith("/bridge")) {
    // This route is kept for backward compatibility but now uses eLocal
    const service = formData.get("service") as string || url.searchParams.get("service") || "default";
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/bridge_greeting.mp3</Play>
  <Play>${AUDIO_BASE}/not_yet_live.mp3</Play>
</Response>`;
    
    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── Route: /status — call completion status ───────────
  if (path.endsWith("/status")) {
    const dialCallStatus = formData.get("DialCallStatus") as string;
    const dialCallDuration = formData.get("DialCallDuration") as string;
    const callDuration = parseInt(dialCallDuration || "0");

    console.log(`[Voice] Call ${callSid} completed: ${dialCallStatus}, duration: ${callDuration}s`);

    // Update elocal_leads with call results
    if (callSid) {
      const { data: elocalLeads } = await supabase
        .from("elocal_leads")
        .select("*")
        .eq("twilio_call_sid", callSid)
        .order("created_at", { ascending: false })
        .limit(1);

      if (elocalLeads && elocalLeads.length > 0) {
        const lead = elocalLeads[0];
        const billableDuration = lead.billable_duration || 0;
        const isBillable = callDuration >= billableDuration && dialCallStatus === "completed";
        
        await supabase
          .from("elocal_leads")
          .update({
            call_duration: callDuration,
            call_status: dialCallStatus === "completed" ? "completed" : "failed",
            billable: isBillable,
          })
          .eq("id", lead.id);

        // Billable notification handled below in general completion section
      }
    }

    // Update lead with call result (existing logic)
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
          body: `eLocal call bridge ${dialCallStatus} | Duration: ${callDuration}s`,
          twilio_sid: callSid,
          twilio_status: dialCallStatus,
          from_number: TWILIO_NUMBER,
          to_number: from,
        });
      }
    }

    // General completion notifications (with vertical icon + billable info)
    if (callSid) {
      const { data: elocalLeadsForNotify } = await supabase
        .from("elocal_leads")
        .select("service_category, billable_duration, bid_price, billable")
        .eq("twilio_call_sid", callSid)
        .order("created_at", { ascending: false })
        .limit(1);

      const elLead = elocalLeadsForNotify?.[0];
      const svc = elLead?.service_category || "unknown";
      const icon = svcIcon(svc);
      const minDur = elLead?.billable_duration || 0;

      if (dialCallStatus === "completed" && callDuration > 0) {
        // Per eLocal rules: a call is billable if it rang 10+ seconds OR was answered.
        // A connected call (provider picked up) is always billable regardless of duration.
        // The billable_duration from eLocal API is program-specific but their published
        // policy says answered calls = billable. We treat any connected call as billable.
        const bidStr = elLead?.bid_price ? `$${elLead.bid_price}` : "N/A";
        const billable = true; // Connected + completed = billable per eLocal rules
        
        // Update the DB to mark as billable
        if (elLead) {
          await supabase
            .from("elocal_leads")
            .update({ billable: true, call_duration: callDuration, call_status: "completed" })
            .eq("twilio_call_sid", callSid);
        }

        if (minDur > 0 && callDuration < minDur) {
          // Call was shorter than eLocal's program minimum — still billable per their rules,
          // but flag it so we can track if they try to dispute
          await notifyTelegram(`💰 *BILLABLE CALL* (short)\n${icon} ${svc}\n📱 ${from}\n⏱ ${callDuration}s (program min: ${minDur}s)\n💵 Revenue: ${bidStr}\nℹ️ Connected call = billable per eLocal policy`);
        } else {
          await notifyTelegram(`💰 *BILLABLE CALL!*\n${icon} ${svc}\n📱 ${from}\n⏱ ${callDuration}s ✅\n💵 Revenue: ${bidStr}`);
        }
      } else if (dialCallStatus === "no-answer") {
        await notifyTelegram(`📵 *No Answer*\n${icon} ${svc}\n📱 ${from}\nPro didn't pick up`);
      } else if (dialCallStatus === "busy") {
        await notifyTelegram(`📵 *Pro Busy*\n${icon} ${svc}\n📱 ${from}`);
      } else if (dialCallStatus !== "completed") {
        await notifyTelegram(`❌ *Call Failed*\n${icon} ${svc}\n📱 ${from}\nStatus: ${dialCallStatus}\n⏱ ${callDuration}s`);
      }
    }

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // ── Default: Inbound call ────────────────────────────
  // Check if this is a dedicated vertical number (skip IVR, bridge directly)
  const verticalMatch = VERTICAL_NUMBERS[to];
  if (verticalMatch) {
    const lead = await logCall({
      fromNumber: from, toNumber: to, direction: "inbound",
      service: verticalMatch.service, callSid, status: "ringing",
    });

    // Get zip from area code (no friction for caller)
    const zipCode = areaCodeToZip(from);
    
    // Ping eLocal
    const elocalResponse = await pingElocal(verticalMatch.needId, zipCode, from);
    
    // Log the ping
    await logElocalPing({
      callerPhone: from,
      zipCode,
      serviceCategory: verticalMatch.service,
      needId: verticalMatch.needId,
      source: "dedicated_line",
      callSid,
      leadId: lead?.id,
      elocalResponse,
    });

    let twiml: string;
    if (elocalResponse.status === "success" && elocalResponse.phone_number) {
      await notifyTelegram(`🎉 *Dedicated Line Call!*\n📱 ${from}\n${svcIcon(verticalMatch.service)} ${verticalMatch.service}\n📍 Zip: ${zipCode} (from area code)\n💰 Bid: $${elocalResponse.price}\n📞 Bridging to ${elocalResponse.phone_number}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${verticalMatch.audio}.mp3</Play>
  <Dial callerId="${to}" timeout="30" action="${WEBHOOK_BASE}/voice-webhook/status" method="POST">
    <Number>${elocalResponse.phone_number}</Number>
  </Dial>
  <Play>${AUDIO_BASE}/connect_failed.mp3</Play>
</Response>`;
    } else {
      await notifyTelegram(`❌ *No Coverage (Dedicated Line)*\n📱 ${from}\n${svcIcon(verticalMatch.service)} ${verticalMatch.service}\n📍 Zip: ${zipCode}\nStatus: ${elocalResponse.status}\nMessage: ${elocalResponse.message || "N/A"}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${AUDIO_BASE}/${verticalMatch.audio}.mp3</Play>
  <Play>${AUDIO_BASE}/no_coverage.mp3</Play>
</Response>`;
    }

    return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // ── General number: Full IVR greeting ────────────────
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