# FindALocalPro — Master Project Status

> Last updated: 2026-02-20
> **Read this file first when picking up work on FindALocalPro.**

## What Is This

Home services lead gen site for DuPage County, IL. Conversational chat UI + IVR phone system captures leads, routes to pros (eventually via eLocal network). Revenue = per-connected-call fees.

## Architecture

```
SEO Pages (programmatic) → Chat Flow OR Phone IVR (+1 630-703-2607)
         ↓                           ↓
    Lead captured in Supabase (service + zip + phone + timing)
         ↓
    Instant callback w/ ElevenLabs Eric voice (< 30 seconds)
         ↓
    eLocal bridge (future — monetization)
         ↓
    Call tracking + Telegram alerts (every touchpoint logged)
```

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, deployed on Vercel
- **Backend:** Supabase (Postgres + Edge Functions + Storage)
- **Phone:** Twilio (IVR + SMS + callbacks)
- **Voice:** ElevenLabs (Eric voice — `cjVigY5qzO86Huf0OWal`)
- **Monitoring:** Telegram alerts on every lead/call/SMS
- **Repo:** GitHub (openclaw-design org)
- **Domain:** findalocalpro.com

## Key Files

| File | Purpose |
|------|---------|
| `~/clawd/findalocalpro/PROJECT.md` | This file — master status |
| `~/clawd/findalocalpro/docs/PHONE-SYSTEM.md` | Phone/IVR/SMS architecture — READ BEFORE TOUCHING WEBHOOKS |
| `~/clawd/findalocalpro/FULL-SKILL-AUDIT-2026-02-20.md` | Multi-skill audit (SEO, Copy, UX, Dopamine) |
| `~/clawd/findalocalpro/docs/PRD-verification-engine.md` | Product requirements doc |
| `~/clawd/findalocalpro/supabase/functions/voice-webhook/index.ts` | IVR + callback logic |
| `~/clawd/findalocalpro/supabase/functions/sms-webhook/index.ts` | SMS + web form handler |
| `~/clawd/findalocalpro/components/ChatFlow.tsx` | Conversational lead capture UI |
| `~/clawd/scripts/falp-voice.sh` | ElevenLabs audio generator (Eric voice) |
| `~/clawd/scripts/twilio-sync-calls.sh` | Hourly call log sync |

## Supabase

- **Project:** hocipkeeikriqyojiboj
- **URL:** https://hocipkeeikriqyojiboj.supabase.co
- **Service Key:** In `~/clawd/findalocalpro/webhook/.env`
- **Storage bucket:** `ivr-audio` (public) — all IVR MP3s
- **Tables:** leads, call_logs, providers, verification_checks

## Deploy Commands

```bash
# Frontend (Vercel)
cd ~/clawd/findalocalpro && npx vercel --prod

# Edge Functions (Supabase)
cd ~/clawd/findalocalpro
SUPABASE_ACCESS_TOKEN="sbp_695522f2a15b58c2ae732ea04f09679e866315df" npx supabase functions deploy voice-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt
SUPABASE_ACCESS_TOKEN="sbp_695522f2a15b58c2ae732ea04f09679e866315df" npx supabase functions deploy sms-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt
```

---

## ✅ COMPLETED

### Phone System (2026-02-20)
- [x] ElevenLabs IVR with Eric voice (19 audio files)
- [x] Inbound call IVR: greeting → menu → service select → voicemail
- [x] Inbound SMS: smart parsing (service + zip), auto-reply, callback trigger
- [x] Web form → callback flow (JSON + URL-encoded support)
- [x] Service-specific callback audio ("connecting you with a trusted plumber")
- [x] Voicemail recording + transcription
- [x] Telegram alerts on all events
- [x] Follow-up SMS after calls
- [x] call_logs table + hourly Twilio sync
- [x] No awkward pauses in audio flow

### SEO Phase 1 (2026-02-20)
- [x] /about page (E-E-A-T: methodology, team, service area)
- [x] /contact page (NAP, hours, LocalBusiness schema with geo)
- [x] LocalBusiness schema sitewide
- [x] Geo-optimized title: "Verified Home Pros in Downers Grove & DuPage County, IL"
- [x] Geo-optimized meta description (4 databases, 11 pros, phone)
- [x] Sitemap fixed (roofing, about, contact, get-matched, reviews)
- [x] /reviews page with testimonials + star ratings
- [x] Footer: 4-column internal linking grid + 12 service area towns
- [x] Breadcrumbs on about/contact

### Reviews System (2026-02-20)
- [x] Review fetcher script (Google Places API + Tavily fallback)
- [x] Pulls from Yelp, BBB, Angi, Google, web sources
- [x] Deduplication by business + source + review text
- [x] Supabase `reviews` table populated (9 initial reviews)
- [x] /reviews page pulls from Supabase dynamically (with static fallback)
- [x] AggregateRating + Review JSON-LD schema on /reviews page
- [x] Stats bar (average rating, total reviews, 5-star count)
- [x] Source badges (Google, Yelp, BBB, Angi, etc.)
- [x] Weekly cron: `com.findalocalpro.fetch-reviews` — Sundays 7am
- [x] Script: `~/clawd/scripts/falp-fetch-reviews.py`

### AI Review Summaries — TODO (next session)
- [ ] After weekly review fetch, generate AI summary per business using Claude API
- [ ] Summary should be 2-3 sentences: what customers love, any common complaints, overall vibe
- [ ] Store in `businesses` table as `review_summary` column (TEXT)
- [ ] Show on directory cards (below stars/count, above verification badges)
- [ ] Show on pro profile pages (above individual reviews)
- [ ] Script flow: falp-fetch-reviews.py pulls reviews → new script falp-summarize-reviews.py reads all reviews per business → calls Claude API → updates business record
- [ ] Weekly cron: run summarizer AFTER review fetcher (Sundays 7:15am)
- [ ] Example output: "Customers consistently praise Four Suns for same-day emergency service and transparent pricing. A few mentions of scheduling delays during peak season, but overwhelmingly positive — 4.9★ across 259 reviews."

### Verification Engine (2026-02-20)
- [x] IDFPR license lookup via Tavily
- [x] IL Secretary of State business check
- [x] BBB + BuildZoom integration
- [x] Full re-verification pipeline (reverify_all.py)
- [x] Weekly cron (Sundays 6am)
- [x] /directory page with trade filters + trust scores
- [x] /pro/:slug profile pages with verification details + JSON-LD
- [x] 11 verified DuPage County providers

---

## 📋 TODO — Phase 2: SEO Infrastructure

### 2A. Location Pages (12 towns) — HIGHEST PRIORITY
Create `/locations/[town]` pages for each DuPage County town.

**Towns:** downers-grove, westmont, lisle, woodridge, darien, naperville, lombard, glen-ellyn, wheaton, hinsdale, oak-brook, bolingbrook

**Each page needs:**
- 500+ words, 40%+ unique content
- Local landmarks and neighborhood context
- List of verified pros serving that area
- LocalBusiness schema with geo coordinates for that town
- Service links (plumbing, HVAC, electrical, etc.)
- Breadcrumbs
- Internal links to service pages + directory
- Meta title: "Verified Home Pros in [Town], IL | FindALocalPro"
- Meta description with town name + differentiator

**Service+location combos (only where we have pros):**
- /locations/downers-grove/plumbing
- /locations/naperville/hvac
- etc.

### 2B. Service Schema
- Add Service structured data to each service page
- Include name, description, areaServed, provider references

### 2C. Breadcrumbs
- Add BreadcrumbList schema + visual breadcrumbs to ALL pages
- Currently only on /about and /contact

### 2D. Internal Cross-Linking
- "Related Services" sections on each service page
- Pro profiles link back to their trade's service page
- Service pages link to relevant location pages
- Aim for 15+ internal links per service page (currently ~8)

### 2E. Google Setup (REQUIRES SHAQUILLE OATMEAL)
- [ ] Create Google Business Profile for FindALocalPro
- [ ] Create Google Cloud project + enable Places API
- [ ] Google Search Console API setup
- [ ] Submit to Yelp, Apple Maps, BBB directories

---

## 📋 TODO — Phase 3: Content & Authority

- [ ] 5 blog posts (local service guides — "How to find a licensed plumber in DuPage County")
- [ ] Verification methodology deep-dive page
- [ ] llms.txt for AI search visibility
- [ ] Backlinks: Chamber of Commerce, local business associations, HGTV-style guest posts
- [ ] Expand to more providers beyond 11

---

## 📋 TODO — Phase 4: Conversion Copy (Click-Driver Audit)

- [ ] Reframe social proof: "137 Records Analyzed" not "11+ Verified Pros"
- [ ] Dynamic CTA on service pages: "See 3 Licensed Plumbers" (real count)
- [ ] FAQ header: "What Homeowners Ask Us" not "Frequently Asked Questions"
- [ ] Verification cards: add "so what" line explaining each database
- [ ] Service page callback: "Get a Call from a Verified [Trade] Pro"
- [ ] Hero subheadline rewrite: "4 databases checked for every pro: state license • BBB rating • business registration • contractor score. Always free."

---

## 📋 TODO — Phase 5: Dopamine/UX Polish

- [ ] Sticky mobile CTA bar (phone + chat visible on scroll)
- [ ] CTA click ripple effect (CSS-only)
- [ ] FAQ smooth accordion animation (height transition)
- [ ] Trust Score ring on pro cards in directory
- [ ] Chat flow progress dots animation
- [ ] Scroll progress bar (thin bar at viewport top)
- [ ] Form success confetti/celebration (replace any remaining alert())

---

## Monetization Status

- **eLocal:** Not connected yet. Awaiting partnership approval.
- **Direct pros:** 0 paying pros. 11 verified but not monetized.
- **Revenue:** $0
- **Cost:** Twilio (~$1/mo), Supabase (free tier), Vercel (free tier), ElevenLabs (~$5/mo)

---

## Lessons Learned

- **Don't rewrite webhooks without reading PHONE-SYSTEM.md** — broke production once already
- **Always test web form → callback flow after webhook changes** — JSON vs URL-encoded gotcha
- **Eric voice ID:** `cjVigY5qzO86Huf0OWal` — all IVR audio uses this
- **Vercel deploys succeed but may not alias to production** — use `npx vercel --prod`
- **Foundation Scout is a SEPARATE Supabase project** — don't cross-contaminate
