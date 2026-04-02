# FindALocalPro — Multi-Number Vertical Routing Plan

## Overview
Buy dedicated Twilio numbers per service vertical so callers skip the IVR entirely. The Nextdoor bot (and other channels) will use the vertical-specific number in templates. Each number's webhook already knows the service type → pings eLocal immediately → bridges to provider. Zero friction.

## Numbers Needed

| Vertical | Number | Status | eLocal Need ID |
|----------|--------|--------|----------------|
| **Main/General** | (630) 407-1727 | ✅ Active | IVR menu (keep as-is) |
| **Plumbing** | TBD | 🔲 Buy | 10000- |
| **HVAC/Heating** | TBD | 🔲 Buy | 583- |
| **Electrical** | TBD | 🔲 Buy | 5000- |
| **Pest Control** | TBD | 🔲 Buy | 6000- |
| **Appliance Repair** | TBD | 🔲 Buy | 149- |

## How It Works

1. **Nextdoor bot detects** a service request (e.g., "need an electrician in Bolingbrook")
2. **Bot determines** vertical (electrical) + zip code (from poster's neighborhood)
3. **Bot replies** with the electrical-specific number instead of the general number
4. **Caller dials** → webhook knows it's electrical → extracts caller's area code for zip approximation
5. **Webhook pings eLocal** with need_id=5000- and zip → gets bid → bridges to provider
6. **No IVR menu.** Caller hears: "Connecting you with a licensed electrician in your area now..."

## Zip Code Detection

Since vertical numbers skip the IVR, we need zip another way:
- **Primary:** Caller's area code → approximate zip (630 = DuPage County area)
- **Fallback:** Quick "What zip code are you in?" voice prompt (one question, not a full IVR)
- **Future:** If using web links (Option C hybrid), zip is in the URL params

## Voice Webhook Changes

Each vertical number hits the same voice-webhook but with a query param:
```
https://hocipkeeikriqyojiboj.supabase.co/functions/v1/voice-webhook?vertical=plumbing
https://hocipkeeikriqyojiboj.supabase.co/functions/v1/voice-webhook?vertical=electrical
...etc
```

Webhook logic:
```
if (vertical param exists) {
  // Skip IVR, go straight to eLocal ping
  needId = SERVICE_TO_NEED_ID[vertical]
  zip = getZipFromAreaCode(callerPhone) || askForZip()
  pingElocal(needId, zip, callerPhone)
} else {
  // Main number — play existing IVR menu
  playIvrMenu()
}
```

## Template Updates

Current templates hardcode (630) 407-1727. Update to use vertical-specific numbers:

```json
{
  "plumbing": ["...give these guys a call: (630) XXX-XXXX...", ...],
  "electrical": ["...call (630) YYY-YYYY...", ...],
  "hvac": ["...call (630) ZZZ-ZZZZ...", ...],
  ...
}
```

## Cost

- Twilio numbers: ~$1.15/month each × 5 = ~$5.75/month
- Negligible vs the revenue per lead ($46-$115 per qualified call)

## Implementation Steps

1. 🔲 Buy 5 Twilio numbers (630 area code preferred for local trust)
2. 🔲 Configure each number's voice webhook URL with `?vertical=` param
3. 🔲 Update voice-webhook to handle vertical param (skip IVR)
4. 🔲 Add area-code-to-zip mapping for DuPage County
5. 🔲 Update templates.json with vertical-specific numbers
6. 🔲 Update cron-prompt.md to reference new number mapping
7. 🔲 Test each number end-to-end
8. 🔲 Wait for eLocal production flip before going live

## Main Number Stays

(630) 407-1727 remains the general number for:
- Website (findalocalpro.com)
- Google Business Profile (when claimed)
- Any channel where we don't know the vertical upfront
- Fallback if vertical numbers have issues

---

**Created:** 2026-02-24
**Status:** Planning — blocked on eLocal production flip
**Next:** Buy numbers + update webhook after Nicole confirms production
