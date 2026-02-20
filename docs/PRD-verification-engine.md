# PRD: FindALocalPro Verification Engine

> **Status:** Draft
> **Date:** 2026-06-21
> **Owner:** Shaquille Oatmeal + Clawrl

## Overview

Build an automated provider verification system that checks multiple public databases, composites a trust profile, and powers verified listings on FindALocalPro. This is the core differentiator — no other local directory stitches together state licensing, county registration, insurance, BBB, and business registration into a single trust score.

## Goals

1. **Automated verification pipeline** — given a provider name + trade, check all available databases and return a composite trust profile
2. **Structured provider schema** in Supabase — every data point stored, timestamped, and re-checkable
3. **Verified listing pages** — public-facing pages showing the composite trust data
4. **Revenue foundation** — lead gen (Layer 1) and subscription billing (Layer 2) built on top of verified data

## Non-Goals (for now)

- Data licensing API (Layer 3 — future)
- Permit-to-project matching (Layer 5 — long-term)
- Multi-state expansion (DuPage County first)

---

## 1. Data Sources & Verification Checks

### Tier 1 — Fully Automatable (build first)

| Source | What It Tells You | URL / Method |
|--------|-------------------|--------------|
| **IDFPR License Lookup** | Active IL license, type, expiration, disciplinary actions | https://online-dfpr.micropact.com/lookup/licenselookup.aspx — scrape or headless browser |
| **IL Secretary of State** | Business registration, status (active/dissolved), registered agent | https://www.ilsos.gov/corporatellc/ — searchable |
| **DuPage County Contractor Registration** | Local registration status, registration date | County clerk site — verify availability |
| **Cook County (if expanding)** | Same as DuPage | TBD |
| **BBB Business Profile** | Rating (A+ to F), accreditation, complaint history | https://www.bbb.org — scrape search results |

### Tier 2 — Semi-Automatable

| Source | What It Tells You | Method |
|--------|-------------------|--------|
| **Google Business Profile** | Reviews, rating, hours, photos, response rate | Google Places API or scrape |
| **Yelp** | Reviews, rating, response rate | Yelp Fusion API (limited free tier) |
| **Court Records** | Lawsuits, liens, judgments | IL Court Clerk — varies by county, some searchable online |

### Tier 3 — Manual / Onboarding

| Data Point | How to Get It |
|------------|---------------|
| **Certificate of Insurance (COI)** | Request during onboarding — providers do this routinely |
| **Typical response time** | Ask provider or measure via lead flow |
| **Pricing ranges** | Ask during enrichment call |
| **Service area (specific towns)** | Onboarding form |
| **Availability / booking window** | Periodic Twilio check-in calls |
| **Specialties** | Onboarding form + website scrape |

---

## 2. Supabase Schema

### `providers` — Core provider record

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  trade TEXT NOT NULL,               -- plumbing, hvac, electrical, etc.
  phone TEXT,
  email TEXT,
  website TEXT,
  address_line1 TEXT,
  city TEXT,
  state TEXT DEFAULT 'IL',
  zip TEXT,
  service_area TEXT[],               -- array of zip codes or town names
  trust_score NUMERIC(3,1),          -- composite 0-100
  verification_status TEXT DEFAULT 'unverified',  -- unverified, pending, verified, suspended
  subscription_tier TEXT DEFAULT 'free',          -- free, basic ($49), premium ($149)
  subscription_started_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_providers_trade ON providers(trade);
CREATE INDEX idx_providers_zip ON providers(zip);
CREATE INDEX idx_providers_status ON providers(verification_status);
```

### `verification_checks` — Individual database check results

```sql
CREATE TABLE verification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  source TEXT NOT NULL,              -- 'idfpr', 'sos', 'dupage_county', 'bbb', 'google', 'yelp', 'coi', 'court'
  status TEXT NOT NULL,              -- 'pass', 'fail', 'warning', 'not_found', 'error', 'pending'
  data JSONB,                        -- raw response data from the source
  summary TEXT,                      -- human-readable summary ("Active license #xxx, expires 2027-03-15")
  checked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,            -- when this check should be re-run
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_checks_provider ON verification_checks(provider_id);
CREATE INDEX idx_checks_source ON verification_checks(source);
CREATE INDEX idx_checks_expires ON verification_checks(expires_at);
```

### `provider_enrichment` — Manual/semi-manual data

```sql
CREATE TABLE provider_enrichment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  response_time TEXT,                -- 'same-day', '1-2 days', '3-5 days'
  free_estimates BOOLEAN,
  pricing_notes TEXT,                -- "Typical drain clearing $150-250"
  availability TEXT,                 -- 'booking now', 'booked 2 weeks out'
  specialties TEXT[],
  years_in_business INTEGER,
  num_employees TEXT,                -- 'solo', '2-5', '6-20', '20+'
  enriched_at TIMESTAMPTZ DEFAULT now(),
  enriched_by TEXT DEFAULT 'manual', -- 'manual', 'twilio_checkin', 'onboarding_form'
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `leads` — Extend existing lead tracking

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  source TEXT NOT NULL,              -- 'website', 'sms', 'nextdoor', 'organic'
  homeowner_name TEXT,
  homeowner_phone TEXT,
  homeowner_zip TEXT,
  service_needed TEXT,
  status TEXT DEFAULT 'new',         -- new, sent, contacted, booked, closed, lost
  urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_provider ON leads(provider_id);
CREATE INDEX idx_leads_status ON leads(status);
```

### `reviews` — Aggregated reviews from multiple sources

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  source TEXT NOT NULL,              -- 'google', 'yelp', 'findalocalpro', 'bbb'
  rating NUMERIC(2,1),
  review_text TEXT,
  reviewer_name TEXT,
  review_date DATE,
  verified_customer BOOLEAN DEFAULT false,
  imported_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Trust Score Calculation

Composite score (0-100) based on weighted checks:

| Check | Weight | Scoring |
|-------|--------|---------|
| IDFPR license active | 25 | Pass=25, Fail=0, Not found=5 |
| No disciplinary actions | 10 | Clean=10, Actions=0 |
| County registration | 10 | Registered=10, Not found=3 |
| SOS business active | 10 | Active=10, Dissolved=0, Not found=3 |
| BBB rating | 10 | A+=10, A=8, B=5, C=2, F=0 |
| Insurance (COI on file) | 15 | COI=15, Claims only=5, None=0 |
| Reviews (avg across sources) | 10 | 4.5+=10, 4.0+=7, 3.5+=4, <3.5=1 |
| Enrichment completeness | 10 | All fields=10, partial=5, none=0 |

**Thresholds:**
- **Verified** badge: score ≥ 70 + IDFPR pass + insurance confirmed
- **Premium Verified**: score ≥ 85 + COI on file + enrichment complete
- **Suspended**: any check returns "fail" on license or fraud-related court record

Score recalculates on every new check. Checks auto-expire and get re-run on a schedule (licenses monthly, reviews weekly, BBB quarterly).

---

## 4. Verification Pipeline Flow

```
Input: provider name, trade, location (zip or city)
                    │
                    ▼
    ┌──────────────────────────────┐
    │  1. IDFPR License Lookup     │ ← Scraper/headless browser
    │  2. IL SOS Business Search   │ ← Scraper
    │  3. County Registration      │ ← Scraper (DuPage first)
    │  4. BBB Profile Lookup       │ ← Scraper
    └──────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────┐
    │  5. Google Places API        │ ← API call
    │  6. Yelp Fusion API          │ ← API call (if available)
    └──────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────┐
    │  Store results in            │
    │  verification_checks table   │
    │  Calculate trust_score       │
    │  Update provider record      │
    └──────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────┐
    │  Generate listing page       │
    │  (if score ≥ threshold)      │
    └──────────────────────────────┘
```

### Re-verification Schedule

| Check | Frequency | Trigger |
|-------|-----------|---------|
| IDFPR license | Monthly | Cron + on expiration date |
| SOS registration | Quarterly | Cron |
| County registration | Quarterly | Cron |
| BBB | Quarterly | Cron |
| Google reviews | Weekly | Cron |
| Insurance COI | Annually | Reminder email/SMS to provider |

---

## 5. Lead Routing Architecture

Two distinct paths based on user intent:

### Path A: Direct Contact (Provider Profile Page)

User is on `/pro/:slug`, viewing a specific provider. They have **high intent** to contact THIS business.

**Flow:**
1. User clicks "Call Now" → direct `tel:` link to provider's phone
2. User clicks "Request a Call" → submits phone + consent → webhook receives `{ source: 'website-direct', routing: 'direct', provider_id, provider_name, phone, service }`
3. Backend creates lead in `leads` table with `provider_id` set
4. Backend sends SMS to provider: "New lead from FindALocalPro: [name] needs [service] at [zip]. Call them at [phone]."
5. Lead status tracked: new → sent → contacted → booked/lost

**Toggle:** `VITE_DIRECT_CONTACT_ENABLED` env var. When `false` (default), provider profile shows "Get a Free Quote" redirect to the general chat flow. When `true`, shows direct Call Now + Request a Call buttons. This lets us test the flow end-to-end before going live with real provider numbers.

### Path B: General Matching (Chat Flow / Homepage)

User arrives at homepage or via service landing page. No specific provider in mind. **Lower intent** — needs qualification first.

**Flow:**
1. Chat flow gathers: service type → timing → zip code → phone number
2. All webhook payloads include `routing: 'elocal'`
3. Backend routes to eLocal for matching (they have the provider network)
4. Twilio call bridge: user's number → FindALocalPro tracking number → eLocal's intake line
5. eLocal matches to a provider, we earn per-lead fee

**Future (Phase 3+):** When we have enough verified providers in our own database, replace eLocal with our own matching:
- Query `businesses` table: `WHERE trade = :service AND :zip = ANY(service_area) AND verification_status = 'verified' ORDER BY trust_score DESC`
- Round-robin among top-scoring providers to distribute leads fairly
- Direct SMS/call to matched provider (same as Path A)

### Lead Attribution

Every lead gets tagged:
| Field | Purpose |
|-------|---------|
| `source` | Where it came from: `website`, `website-direct`, `website-quote`, `website-quote-match`, `sms`, `nextdoor` |
| `routing` | How it was routed: `direct` (to specific provider), `elocal` (to eLocal), `internal` (future own matching) |
| `provider_id` | Set for direct leads; NULL for eLocal leads until eLocal reports back |

### Revenue Per Path

- **Path A (direct):** Provider pays subscription ($49-149/mo) for verified listing + direct leads. Higher margin.
- **Path B (eLocal):** eLocal pays $15-50 per qualified lead depending on trade. Lower margin but no provider network needed.
- **Long-term:** Shift volume from Path B → Path A as provider network grows.

---

1. **Discovery** — find provider via Nextdoor recommendations, Google search, existing lead data
2. **Initial verification** — run automated pipeline (Tier 1 + Tier 2 checks)
3. **Outreach** — if checks pass, contact provider:
   - "We've verified your IL license and business registration. Want a free verified listing on FindALocalPro?"
   - Collect: COI, service area, specialties, pricing ranges
4. **Listing created** — provider gets a public profile page with trust data
5. **Upsell** — after generating leads, pitch subscription tier

---

## 7. Tech Stack

| Component | Tech | Notes |
|-----------|------|-------|
| Scrapers | Python (requests + BeautifulSoup) or Playwright for JS-heavy sites | Run locally or as Supabase Edge Functions |
| Pipeline orchestration | Python script or OpenClaw cron job | Start simple, don't over-engineer |
| Database | Supabase (PostgreSQL) | Already have the project |
| Listing pages | React (extend existing site) or Next.js SSR | Need SEO-friendly URLs like `/plumber/downers-grove/joes-plumbing` |
| Trust badge assets | SVG badges for providers to embed | "FindALocalPro Verified ✓" |
| Monitoring | OpenClaw cron — flag expired checks, score changes | Reuse existing cron infrastructure |

---

## 8. Monetization

### Layer 1: Pay-Per-Lead (Now)
- **eLocal partnership** for general matching leads (Path B)
- Revenue: $15-50/lead depending on trade (plumbing/HVAC highest)
- No provider relationships needed — eLocal handles matching
- Target: 50+ leads/month = $750-2,500/month

### Layer 2: Provider Subscriptions (Phase 2-3)
- **Free tier:** Basic listing, unverified
- **Basic ($49/mo):** Verified badge, trust score displayed, direct lead routing
- **Premium ($149/mo):** Priority placement in directory, enhanced profile (photos, reviews), lead analytics dashboard
- Target: 20 paying providers × $100 avg = $2,000/month

### Layer 3: Data Licensing API (Phase 4+)
- Sell verification data to insurance companies, real estate platforms, property managers
- API access: $0.10-1.00 per lookup depending on volume
- Requires 500+ verified providers to be valuable

---

## 9. Phase 1 Milestones (Weeks 1-4)

- [ ] **Week 1:** IDFPR scraper built and tested. Can look up any IL licensed contractor.
- [ ] **Week 1:** Supabase schema deployed (providers, verification_checks, enrichment, leads, reviews tables)
- [ ] **Week 2:** IL SOS + BBB scrapers. Full Tier 1 pipeline running.
- [ ] **Week 2:** First 10 DuPage County providers run through pipeline.
- [ ] **Week 3:** Provider listing page template. SEO-friendly URLs. Trust score display.
- [ ] **Week 3:** Google Places API integration for review aggregation.
- [ ] **Week 4:** Provider onboarding form (collect COI, service area, etc.)
- [ ] **Week 4:** First outreach to 5 verified providers. Pitch free listing.

## 10. Phase 2 Milestones (Weeks 5-8)

- [ ] Lead tracking dashboard for providers
- [ ] Subscription billing (Stripe)
- [ ] Automated re-verification cron jobs
- [ ] Nextdoor integration (Dave Mitchell → FindALocalPro pipeline)
- [ ] 20+ verified providers listed

## 11. Key Metric

**Revenue per verified listing** — track monthly. If this number increases over time, the flywheel is working.

---

## 12. Open Questions

- [ ] IDFPR site — is it scrape-friendly or do we need Playwright for the lookup form?
- [ ] DuPage County contractor registration — is there a public searchable database online?
- [ ] Google Places API pricing — free tier sufficient for our volume?
- [ ] Do we migrate to Next.js for SSR (SEO) or keep React SPA with prerendering?
- [ ] Stripe vs Lemon Squeezy for subscription billing?
- [ ] eLocal integration — what's their API/intake process? Phone number to bridge to?
- [ ] When to flip `VITE_DIRECT_CONTACT_ENABLED` to true? Need at least X providers with verified phone numbers.
- [ ] Call tracking — do we need a Twilio tracking number per provider, or one shared number with routing?
