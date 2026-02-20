# FindALocalPro Phone System

> **DO NOT rewrite the voice/SMS webhooks without reading this first.**
> Last time (2026-02-20) Clawrl replaced the working IVR with generic TTS and broke the callback flow. Don't repeat that.

## Architecture

```
Caller → Twilio (+1 630-407-1727) → Supabase Edge Function (voice-webhook)
                                          ↓
                                   ElevenLabs IVR Audio
                                          ↓
                              Lead captured in Supabase
                                          ↓
                              Telegram alert to owner
                                          ↓
                              Follow-up SMS to caller

SMS → Twilio (+1 630-407-1727) → Supabase Edge Function (sms-webhook)
                                          ↓
                                   Parse service + zip
                                          ↓
                              Lead captured in Supabase
                                          ↓
                              Auto-reply SMS
                                          ↓
                              Trigger callback (calls them back with ElevenLabs voice)
                                          ↓
                              Telegram alert to owner
```

## Twilio Config

- **Number:** +1 630-407-1727
- **Account SID:** (In Proton Pass → "login.twilio.com")
- **Auth Token:** In Proton Pass → "login.twilio.com" (clawrl3000@proton.me)
- **Voice URL:** https://hocipkeeikriqyojiboj.supabase.co/functions/v1/voice-webhook (POST)
- **SMS URL:** https://hocipkeeikriqyojiboj.supabase.co/functions/v1/sms-webhook (POST)
- **Status Callback:** https://hocipkeeikriqyojiboj.supabase.co/functions/v1/voice-webhook/status (POST)

## Edge Functions

Both deployed on Supabase project `hocipkeeikriqyojiboj`:

### voice-webhook

**Source:** `~/clawd/findalocalpro/supabase/functions/voice-webhook/index.ts`

**Routes:**
| Path | Purpose |
|------|---------|
| `/` | Main IVR entry — plays greeting.mp3 + menu.mp3, gathers 1 digit |
| `/gather` | Handles keypress — plays service-specific audio + not_yet_live.mp3 |
| `/callback-twiml` | TwiML for outbound callbacks — bridge_greeting + bridge_intro + not_yet_live |
| `/trigger-callback` | API endpoint — POST with `phone=+1xxx` to trigger outbound call |
| `/no-input` | Plays no_response.mp3 if caller doesn't press anything |
| `/status` | Status callback — sends follow-up SMS after inbound call ends |

### sms-webhook

**Source:** `~/clawd/findalocalpro/supabase/functions/sms-webhook/index.ts`

**What it does:**
1. Parses inbound SMS for service type + zip code
2. Creates/updates lead in Supabase `leads` table
3. Sends smart auto-reply (asks for missing info)
4. If service or zip detected → triggers callback (calls them back)
5. Sends Telegram alert

## ElevenLabs Audio Files

Stored in Supabase Storage bucket `ivr-audio` (public):

| File | Purpose |
|------|---------|
| `greeting.mp3` | "Welcome to FindALocalPro..." |
| `menu.mp3` | "Press 1 for plumbing, 2 for..." |
| `menu_retry.mp3` | Menu repeated if invalid input |
| `no_response.mp3` | "We didn't receive your selection..." |
| `connect_plumbing.mp3` | "Connecting you to a plumber..." |
| `connect_heating_and_cooling.mp3` | HVAC connect message |
| `connect_electrical.mp3` | Electrical connect message |
| `connect_roofing.mp3` | Roofing connect message |
| `connect_pest_control.mp3` | Pest control connect message |
| `connect_appliance_repair.mp3` | Appliance repair connect message |
| `connect_handyman.mp3` | Handyman connect message |
| `connect_other.mp3` | Generic connect message |
| `connect_landscaping.mp3` | Landscaping connect message |
| `bridge_greeting.mp3` | Outbound callback greeting |
| `bridge_intro.mp3` | Outbound callback intro |
| `bridge_failed.mp3` | Bridge connection failed |
| `not_yet_live.mp3` | "We're currently building our network..." |
| `ask_zip.mp3` | "What's your zip code?" |
| `ask_zip_retry.mp3` | Zip retry |
| `no_zip_fallback.mp3` | Fallback if no zip entered |
| `svc_*.mp3` | Service-specific IVR prompts |

**⚠️ These are custom ElevenLabs recordings. Do NOT replace with Polly TTS or generic voices.**

## Leads Table Schema

Table `leads` in Supabase:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| phone | text | Caller/texter phone number |
| phone_hash | text | Hashed phone (auto-generated) |
| name | text | Caller name (from voicemail transcription) |
| service_needed | text | plumbing, hvac, electrical, roofing, etc. |
| zip_code | text | 5-digit zip |
| state | text | Default "IL" |
| status | enum | new, contacted, matched, closed |
| source | enum | nextdoor, google, landing_page, direct_sms, direct_call, referral, facebook, other |
| elocal_call_id | text | For future eLocal integration |
| elocal_payout | numeric | For future eLocal integration |
| notes | text | Voicemail transcriptions, SMS content, etc. |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

## Call Tracking

- **Table:** `call_logs` in Supabase
- **Sync script:** `~/clawd/scripts/twilio-sync-calls.sh`
- **Cron:** LaunchAgent `com.findalocalpro.twilio-sync` — runs hourly
- **What it does:** Pulls last 50 calls from Twilio API, upserts into call_logs

## Telegram Alerts

Bot token and chat ID set as Supabase Edge Function secrets:
- `TELEGRAM_BOT_TOKEN` — OpenClaw's Telegram bot
- `TELEGRAM_CHAT_ID` — Shaquille Oatmeal's Telegram chat ID

**You get alerts for:**
- Every inbound call (with caller number)
- Every IVR menu selection (with service chosen)
- Every inbound SMS (with message content + parsed service/zip)
- Every callback triggered
- Every call end (with duration + SMS confirmation)

## Deploy Commands

```bash
cd ~/clawd/findalocalpro
SUPABASE_ACCESS_TOKEN="sbp_..." npx supabase functions deploy voice-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt
SUPABASE_ACCESS_TOKEN="sbp_..." npx supabase functions deploy sms-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt
```

Access token in Proton Pass → "Supabase CLI Access Token" (expires 2026-03-18).

## Current State (2026-02-20)

- ✅ IVR working with ElevenLabs audio
- ✅ SMS webhook with smart parsing + auto-reply + callback
- ✅ Lead capture in Supabase
- ✅ Telegram alerts
- ✅ Follow-up SMS after calls
- ✅ Call tracking synced hourly
- ⏳ eLocal integration (not connected yet)
- ⏳ Direct pro routing (no pros onboarded yet)
- ⏳ IVR ends with "not yet live" message — needs real routing when ready

## Future: Connecting Real Pros

When ready, two options:

**Option A: Direct pro routing**
- Replace `not_yet_live.mp3` with `<Dial>` TwiML that bridges to the pro's number
- Update gather handler to look up available pros by service + area
- Pro pays per lead or monthly

**Option B: eLocal**
- Wire up eLocal API
- Replace gather handler to bridge calls to eLocal's number
- eLocal handles matching, pays per qualified lead

Either way: swap out the `not_yet_live.mp3` step in the gather handler with actual routing.

## ⚠️ Rules for Future Changes

1. **Always check what audio files exist in ivr-audio bucket before making changes**
2. **Never replace ElevenLabs audio with TTS** — the custom voice IS the brand
3. **Test the full flow after any deploy** — call AND text the number
4. **The callback flow (SMS → call them back) is a core feature** — don't remove it
5. **Lead capture must happen for every contact** — no exceptions
6. **Telegram alerts on every inbound** — Shaquille Oatmeal needs to know immediately

## Audio Generation

**Script:** `~/clawd/scripts/falp-voice.sh "text" output.mp3`
**Voice:** Bella (hpp4J3VqNfWAUOO0d1Us) — Professional, Bright, Warm
**Model:** eleven_turbo_v2

To add new IVR audio:
1. Generate: `~/clawd/scripts/falp-voice.sh "Your text here" /tmp/new_audio.mp3`
2. Upload: `curl -X POST ".../storage/v1/object/ivr-audio/filename.mp3" -H "Authorization: Bearer $SERVICE_KEY" -H "Content-Type: audio/mpeg" -H "x-upsert: true" --data-binary @/tmp/new_audio.mp3`
3. Reference in webhook TwiML: `<Play>${AUDIO}/filename.mp3</Play>`

**Clawrl's voice** (e2tGFV0XRqHRjmz9Jfkw) is for Twitter/personality. **Bella** is for FindALocalPro IVR. Don't mix them.
