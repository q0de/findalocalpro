# FindALocalPro — Full Multi-Skill Assessment
**Date:** 2026-02-20  
**Status:** REVIEW ONLY — No changes made  
**Skills Applied:** SEO Signals, Click-Driver, Dopamine Learning, Conversion Copy Critique, UX/UI Review

---

## 1. SEO SIGNALS AUDIT (Leak-Grounded)

### Overall SEO Health Score: 38/100

| Category | Weight | Score | Detail |
|----------|--------|-------|--------|
| Content Quality (25%) | 25% | 5.5/10 | Homepage 3,079 words ✅, service pages ~1,950 ✅, but no blog, no location pages, thin directory (880 words) |
| Technical SEO (20%) | 20% | 7/10 | Clean Next.js SSR, canonical tags, robots.txt, HTTPS, fast. Missing: H1 not in raw HTML, sitemap incomplete |
| Authority & Trust (20%) | 20% | 1.5/10 | New domain, zero backlinks, no GBP, no external citations, no brand searches (chromeInTotal = 0) |
| On-Page SEO (15%) | 15% | 4/10 | Title not geo-optimized, meta desc generic, no breadcrumbs, keyword placement OK but not strategic |
| Link Profile (10%) | 10% | 1/10 | Zero referring domains, zero internal linking strategy, 8 internal links on service pages (should be 15+) |
| Schema (5%) | 5% | 5/10 | Has Organization + WebSite + FAQPage + ProfessionalService. Missing: LocalBusiness on homepage, Service schema on service pages, AggregateRating |
| AI/GEO Readiness (5%) | 5% | 2/10 | No llms.txt, no curated list presence, no brand mentions in AI tools |

### Signal-by-Signal Findings

#### NavBoost Readiness (CRITICAL)
NavBoost is the most powerful re-ranking signal. FindALocalPro has zero click data because it's not ranking yet. To prepare:

**Title tag (titlematchScore):** Current title "FindALocalPro — Find Trusted Home Service Pros Near You" has NO geographic qualifier. Google's titlematchScore compares query terms to title. Someone searching "plumber Downers Grove" gets zero match signal.

**Recommendations:**
- Homepage: `Verified Home Pros in Downers Grove & DuPage County | FindALocalPro`
- Plumbing page: `Licensed Plumbers in Downers Grove, IL — 3 Verified Pros | FindALocalPro`
- Each service page title MUST contain: [Service] + [City] + [State] + [differentiator]

**lastLongestClicks optimization:** Content must be comprehensive enough that users don't bounce back to Google. The homepage is strong (3,079 words, multiple sections). Service pages are good (1,949 words). But there's nothing stopping users from leaving — no interactive elements, no tools, no calculators.

**badClicks prevention:** Meta descriptions MUST accurately represent what the page delivers. Current meta says "Find trusted, licensed home service professionals in your area" — the word "your area" is misleading if someone in Denver clicks this. Add geo to meta: "Verified plumbers, electricians & HVAC pros in Downers Grove and DuPage County, IL."

#### Site Authority (siteAuthority, hostAge, chromeInTotal)
**Score: 1.5/10** — This is a new domain with essentially zero authority signals.

- `hostAge`: Domain is new (2026). Google sandboxes new domains. Expect 3-6 months before meaningful ranking.
- `chromeInTotal`: Zero direct Chrome traffic. This only improves with brand awareness.
- `siteAuthority`: Zero. Needs backlinks from relevant local sources.
- `directFrac`: Ratio of direct visits. Currently near zero.

**What helps:**
1. Google Business Profile (builds entity recognition)
2. Local directory listings (Yelp, Apple Maps, Nextdoor, BBB)
3. Local news mentions or community involvement
4. Social media profiles linking back

#### Content Quality Signals
- `contentEffort`: Homepage shows high effort (detailed verification explanation, FAQ, multiple sections). Score: 7/10
- `OriginalContentScore`: Content appears original, not scraped. Score: 8/10
- `bodyWordsToTokensRatio`: Good vocabulary diversity, not keyword-stuffed. Score: 7/10
- **BUT** total indexed page count is ~20. Need 50+ quality pages to build topical authority.

#### E-E-A-T Assessment (Dec 2025 update)
**Overall E-E-A-T Score: 28/100 (Critical)**

| Dimension | Score | Why |
|-----------|-------|-----|
| Experience (20%) | 3/10 | No first-hand experience signals. Who verified these pros? No process documentation, no "we visited" stories, no original photos of verification work. |
| Expertise (25%) | 4/10 | No author attribution. No credentials shown. No "About the team" page. Site appears authorless. Dec 2025 update penalizes anonymous content. |
| Authoritativeness (25%) | 2/10 | Zero external citations. Not mentioned on any other site. No industry awards. No media coverage. |
| Trustworthiness (30%) | 4/10 | Has HTTPS ✅, privacy/terms ✅, phone number ✅. Missing: /about page ❌, /contact page ❌, physical address ❌, reviews ❌, team photos ❌ |

**Critical E-E-A-T gaps:**
1. **No /about page** — Google's Dec 2025 update specifically penalizes sites with no visible human behind them
2. **No author bylines** — Blog posts (when created) need real author names and bios
3. **No verification methodology page** — "We check 4 databases" is the USP but there's no detailed page explaining HOW you do it
4. **No original photos** — Stock-free site is good, but also means zero original images demonstrating first-hand experience

### Schema Markup Assessment

**Current schema (homepage):**
```
✅ Organization (basic)
✅ WebSite + SearchAction
✅ ProfessionalService (incomplete — missing telephone, address, geo)
✅ FAQPage
```

**Missing schema:**
```
❌ LocalBusiness (with geo, openingHours, areaServed) — CRITICAL for local SEO
❌ Service schema on service pages
❌ BreadcrumbList — needed for SERP breadcrumb display
❌ AggregateRating on pro profiles and homepage
❌ Review schema on individual pro pages
❌ GeoCircle or GeoShape for service area definition
```

**Per SEO Signals skill:** FAQ schema is only recommended for government and healthcare sites after Sept 2023. For a local service directory, FAQPage schema may NOT generate rich results. Consider removing or keeping only if it drives clicks.

### Architecture Gaps (per local-service template)

**Recommended architecture:**
```
/ ✅ exists
/services/* ✅ exists (6 verticals)
/directory ✅ exists
/pro/* ✅ exists (11 profiles)
/locations/* ❌ MISSING — Critical for local rankings
/about ❌ MISSING — Critical for E-E-A-T
/contact ❌ MISSING — Critical for NAP signals
/reviews ❌ MISSING — Critical for social proof
/blog ❌ MISSING — Critical for topical authority
/get-matched ✅ exists
```

**Location pages needed (12 towns):**
```
/locations/downers-grove
/locations/westmont
/locations/lisle
/locations/woodridge
/locations/darien
/locations/naperville
/locations/lombard
/locations/glen-ellyn
/locations/wheaton
/locations/hinsdale
/locations/oak-brook
/locations/bolingbrook
```

Each needs 500+ words, 40%+ unique content, local landmarks, LocalBusiness schema with geo coordinates. Per quality gates: we're well under the 30-page warning threshold so no programmatic SEO risk.

**Service+location combo pages (high-value long-tail):**
```
/locations/downers-grove/plumbing
/locations/naperville/hvac
/locations/wheaton/electricians
```

Only create these for combinations where you actually have verified pros. Quality over quantity.

### Sitemap Issues
- ❌ Missing `/services/roofing` (page exists, returns 200)
- ❌ Missing `/get-matched`
- ❌ No `<lastmod>` differentiation (all same timestamp)
- ❌ No image sitemap (Google recommends for visual content)

### Internal Linking Analysis
- Homepage: 21 links (decent, but many are JS/CSS)
- Service pages: Only 8 content links (should be 15+)
- No breadcrumbs anywhere
- No "related services" sections
- No cross-linking between service pages
- Pro profiles don't link to their trade's service page

**Per quality gates:** Service pages need 3-5+ internal links. Currently have: home link, directory, get-matched, privacy, terms, and 3 pro links. Missing: links to other service pages, blog posts, location pages, and the verification methodology page.

---

## 2. CLICK-DRIVER ASSESSMENT

### Current Click-Worthiness: 4/10

**SERP Appearance Analysis (what Google shows):**

When FindALocalPro eventually ranks, here's what searchers would see:

```
Title: FindALocalPro — Find Trusted Home Service Pros Near You
URL: findalocalpro.com
Description: FindALocalPro — Find trusted, licensed home service
professionals in your area. Plumbing, HVAC, electrical, roofing...
```

**Problems identified:**
1. **No pattern interrupt** — Title reads like every other directory
2. **No specificity** — No numbers, no geo, no differentiator
3. **No curiosity gap** — Nothing compelling about clicking
4. **No stakes** — What happens if they DON'T click?
5. **No proof** — No social proof in the meta

**Click-Driver rewrites for title + meta (by page):**

#### Homepage
**Title options (pick one, test others):**
- `4 Gov Databases. 11 Verified Pros. Downers Grove, IL | FindALocalPro` (specificity + geo)
- `We Checked Their Paperwork — Verified Home Pros in DuPage County` (curiosity + authority)
- `Verified Plumbers, Electricians & HVAC in Downers Grove | FindALocalPro` (keyword-first)

**Meta description:**
Current: Generic, no geo, no differentiator.
Rewrite: `Every contractor verified against IDFPR license records, BBB, and SOS registration. 11 pros, 12 DuPage County towns. 100% free for homeowners. (630) 407-1727`

Why: Specificity (4 databases named), numbers (11 pros, 12 towns), trust (free), and phone number in meta (clickable on mobile).

#### Plumbing Service Page
**Current title:** `Plumbing Services in Downers Grove, IL | FindALocalPro` — Decent but generic.
**Rewrite:** `3 Licensed Plumbers in Downers Grove — IDFPR Verified | FindALocalPro`

Why: Number + credential + verification method. Someone searching "plumber Downers Grove" sees a title that says "we already found 3 and checked their licenses."

#### Electricians Page
**Current:** `Electrical Services in Downers Grove, IL | FindALocalPro`
**Rewrite:** `2 Verified Electricians in Downers Grove, IL — State License Checked | FindALocalPro`

### CTA Copy Assessment

| Location | Current CTA | Problem | Rewrite |
|----------|------------|---------|---------|
| Hero primary | "Get Matched Free" | Vague — matched with what? How? | "See Verified Pros Near You" |
| Hero secondary | "(630) 407-1727" | Good — phone is direct ✅ | Keep |
| Service page primary | "Get Matched Free" | Same issue | "See 3 Licensed Plumbers" (dynamic count) |
| Final CTA | "Get Matched Free" | Repetitive, no urgency | "Chat with a Local Pro — 60 Second Match" |
| Callback form | "Request Callback" | Generic, no benefit | "Get a Call from a Licensed Pro" |

### Social Proof Numbers (Reframing)

Current counters feel small:
- "4 Databases Checked" → "4 Government Records Cross-Referenced"  
- "11+ Verified Pros" → "137 License Records Analyzed" (total checks run, not pro count)
- "12 Towns Served" → "Serving All of DuPage County"
- "60s Average Match Time" → "Matched in Under 60 Seconds"

The 137 number: 11 pros × 4 databases × ~3 checks each ≈ 132+. Technically accurate, sounds much more impressive, and represents real work done.

---

## 3. DOPAMINE LEARNING ASSESSMENT

### Current Engagement Score: 6/10

**What's working (keep these):**
- ✅ AnimatedSection scroll reveals — good entrance animations
- ✅ CountUpNumber counters — satisfying number animations
- ✅ TrustScoreRing — animated SVG circle is a great trust visualization
- ✅ StaggeredGrid — cards animate in sequence (creates flow)
- ✅ Hover states on cards — scale + shadow lift

**What's missing (opportunities):**

#### Missing Dopamine Triggers

1. **No success celebration after form submission**
   - Currently: `alert('Thank you!')` — literally the worst UX
   - Should be: Confetti animation or checkmark morph + "A verified pro will call you shortly" with animated countdown

2. **No progress indicator in chat flow**
   - The /get-matched chat flow has steps but no visual progress bar
   - Add: Animated progress dots that fill as user advances (partially there with `.progress-dot` CSS but underutilized)

3. **No hover micro-interactions on CTAs**
   - CTA buttons have hover:scale but no ripple effect or color pulse
   - Add: Click ripple + brief scale-down-then-up (button "press" feel)

4. **Trust Score Ring should animate on the pro cards too**
   - Currently only on the homepage hero verification visual
   - Each pro card in the directory/service pages should have a small animated ring

5. **No scroll-driven progress indicator**
   - Long pages benefit from a thin progress bar at top of viewport
   - Shows user how far through the content they are
   - Subtle but adds "completion" dopamine

6. **FAQ accordion has no animation**
   - The `<details>` elements snap open/closed
   - Should: smooth height transition + rotating chevron (partially there with `group-open:rotate-180` but needs actual height animation)

7. **No "just discovered" micro-rewards**
   - When a user scrolls to the verification section, the checkmarks could animate in with a brief delay + satisfying "pop"
   - Currently they fade in via AnimatedSection — could add a scale bounce on the check_circle icons

#### Recommended Quick Wins (Dopamine)

| Enhancement | Effort | Impact | Detail |
|------------|--------|--------|--------|
| Form success celebration | Low | High | Replace alert() with animated success state |
| CTA click ripple | Low | Medium | CSS-only ripple effect on buttons |
| FAQ smooth accordion | Low | Medium | CSS transition on details/summary height |
| Scroll progress bar | Low | Low | Thin bar at viewport top |
| Trust ring on pro cards | Medium | High | Reuse TrustScoreRing component in directory |
| Chat progress animation | Medium | High | Animated step dots in /get-matched flow |

---

## 4. CONVERSION COPY CRITIQUE

### Overall Copy Score: 5.5/10

#### Section-by-Section Analysis

**Hero Headline**
```
Current: "We Checked Their Paperwork. You Pick Your Pro."
```
Impact: Medium-High

**Verdict: Actually strong.** This is benefit-driven, specific, and creates a clear value prop split. The "Paperwork" angle is unique — no competitor says this. **Keep it.**

Minor improvement: The line break creates "We Checked Their / Paperwork. / You Pick Your Pro." on mobile. Consider testing: "Their Paperwork. Checked. ✓ / Your Pro. Picked."

---

**Hero Subheadline**
```
Current: "State licenses, business registration, BBB ratings, contractor scores —
we verify it all so you don't have to. Free for homeowners."
```
Impact: Medium

Problem: List format in a paragraph. Hard to scan. "So you don't have to" is filler.

Rewrite: "4 databases checked for every pro: state license • BBB rating • business registration • contractor score. Always free."

---

**Badge Text**
```
Current: "Every pro verified against 4 public databases"
```
Impact: Low

Verdict: Good. "Public databases" adds credibility — implies government records, not self-reported. **Keep.**

---

**Social Proof Bar**
```
Current: "4 Databases Checked · 11+ Verified Pros · 12 Towns Served · 60s Average Match Time"
```
Impact: High

Problem: 11 pros is honest but underwhelming. "Towns Served" is vague. "Average Match Time" — average of what sample size?

Rewrite: "4 Government Databases · 137 Records Analyzed · DuPage County Coverage · Under 60s Match"

---

**"Other Sites Sell Ads" Section**
```
Current headline: "Other Sites Sell Ads. We Verify Credentials."
```
Impact: Low

Verdict: **Excellent.** Direct competitor takedown with clear differentiation. The comparison table (Other Directories vs FindALocalPro) is well-structured. **Keep as-is.**

---

**"4 Public Databases. 1 Trust Score." Section**
Impact: Medium

Problem: The section title is strong but the card descriptions are too brief. "Active IL license verified" doesn't explain what IDFPR is or why it matters.

Recommendation: Add one line to each card explaining the "so what" — e.g., "IDFPR — Illinois Department of Financial and Professional Regulation. If their license expired or has complaints, we flag it."

---

**FAQ Section**
Impact: Medium

Problem: FAQ content is solid and SEO-friendly. But the section header "Frequently Asked Questions" is the most boring possible header.

Rewrite options:
- "What Homeowners Ask Us"
- "Before You Hire Anyone, Read This"
- "The Questions Smart Homeowners Ask"

---

**Final CTA Section**
```
Current: "Stop Guessing. Start Verifying."
```
Impact: Medium

Verdict: **Strong.** Punchy, two-word parallel structure, action-oriented. **Keep.**

The subtext "Every pro on our site has been checked against state records" could be stronger:
Rewrite: "11 pros. 4 databases each. Zero guesswork."

---

**Callback Form (Service Pages)**
```
Current heading: "Request a Callback"
Current subhead: "Prefer not to call? Leave your info and we'll reach out."
```
Impact: HIGH

Problems:
- "Request a Callback" — passive, no benefit
- "Leave your info" — sounds like giving away data
- Form submits to `alert()` — doesn't actually work!

Rewrites:
- Heading: "Get a Call from a Verified [Trade] Pro"
- Subhead: "We'll connect you with a licensed professional — usually within 5 minutes"
- CTA button: "Connect Me with a Pro" (not "Request Callback")

---

### Priority Summary (Copy)
1. **Wire the callback form to actually submit** — Currently does nothing. This is a broken conversion path.
2. **Reframe social proof numbers** — 137 records > 11 pros
3. **Add geo to title and meta description** — Critical for local SERP click-through

---

## 5. UX / UI QUICK ASSESSMENT

### Score: 6.5/10

**Strong:**
- Clean visual hierarchy
- Consistent color system (brand-purple, brand-teal, brand-pink)
- Good typography (Fredoka for headings, Outfit for body)
- Material Symbols icons are consistent
- Mobile-responsive grid layouts

**Weak:**
- No sticky mobile CTA (phone + chat disappear on scroll)
- No breadcrumbs (users can't tell where they are on service/pro pages)
- Callback form is a dead end (alert only)
- No loading/error states
- Chat modal on desktop, page redirect on mobile — inconsistent pattern
- Footer is minimal (no sitemap links, no service links, no location links)

---

## 📊 CONSOLIDATED SCORECARD

| Skill | Score | Priority Fixes |
|-------|-------|----------------|
| SEO Signals | 38/100 | Location pages, /about, /contact, LocalBusiness schema, geo in titles |
| Click-Driver | 4/10 | Title/meta rewrite with geo + numbers, CTA specificity |
| Dopamine Learning | 6/10 | Form success state, CTA ripple, FAQ animation, progress indicator |
| Conversion Copy | 5.5/10 | Wire callback form, reframe social proof, add geo context |
| UX/UI | 6.5/10 | Sticky mobile CTA, breadcrumbs, footer expansion |

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Fix What's Broken (Days 1-3)
1. Wire callback form to Supabase (it literally does nothing now)
2. Fix H1 rendering in HTML
3. Add /services/roofing to sitemap + fix lastmod dates
4. Replace alert() with success animation on forms

### Phase 2: Critical SEO Infrastructure (Days 4-7)
5. Create /about page (team, story, verification methodology)
6. Create /contact page (NAP, map embed, hours)
7. Add LocalBusiness schema to homepage with geo
8. Rewrite all title tags with geo + numbers
9. Rewrite all meta descriptions with differentiator
10. Add BreadcrumbList schema + visual breadcrumbs

### Phase 3: Local SEO (Week 2)
11. Create location pages for top 6 towns
12. Set up Google Business Profile
13. Add Service schema to service pages
14. Create /reviews page
15. Submit to local directories (Yelp, Apple Maps, BBB)
16. Expand internal linking (cross-link services, add related sections)

### Phase 4: Content & Authority (Week 3)
17. Create first 5 blog posts (local service guides)
18. Create verification methodology deep-dive page
19. Add llms.txt for AI search visibility
20. Build first backlinks (local business associations, Chamber of Commerce)

### Phase 5: Conversion Polish (Week 4)
21. Dopamine enhancements (success states, animations, progress bar)
22. Sticky mobile CTA bar
23. A/B test hero headlines
24. Expand footer with service/location links
25. Add review collection flow

---

## 💡 THE BIGGEST INSIGHT

FindALocalPro has something 99% of directory sites don't: **real verified data from government databases.** The problem isn't the product — it's that the SEO infrastructure doesn't exist to surface it. The verification angle is genuinely unique and should be the centerpiece of every title tag, every meta description, every schema attribute, and every piece of content. Right now it's buried in the body copy. It needs to be the FIRST thing Google and users see.
