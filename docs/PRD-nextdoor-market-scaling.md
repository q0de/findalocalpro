# PRD: Nextdoor Multi-Market Scaling Strategy

> **Status:** Draft
> **Created:** 2026-03-16
> **Owner:** Shaquille Oatmeal
> **Trigger:** First eLocal lead confirmed — pipeline validated, ready to scale

---

## 1. Context & Validation

On March 16, 2026, the Nextdoor → eLocal pipeline generated its first qualified lead:
- Nextdoor cron posted a recommendation at ~2:00 PM CDT
- Caller dialed the appliance tracking number at 2:29 PM CDT
- 105-second inbound call, 97-second bridge to eLocal
- **Revenue: $32.50 — CONFIRMED PAID** (appliance repair lead)
- **Time from post to revenue: ~30 minutes**

The single-market model (Downers Grove / western suburbs) is validated. This PRD outlines the strategy for replicating it across additional markets.

---

## 2. Objective

Scale the Nextdoor lead generation pipeline from 1 market to 5-10 markets within 90 days, maintaining full operational isolation between markets to eliminate cross-contamination risk.

### Success Metrics
- **Markets active:** 5+ within 90 days
- **Leads per market:** 10-15/month (matching current DG trajectory)
- **Revenue per market:** $325-$500/month at current eLocal rates
- **Account survival rate:** >90% at 6 months
- **Zero cross-market detection incidents**

---

## 3. Nextdoor Detection Model (Johari Window)

### What They Look For (Known-Known)
| Signal | Detection Method | Our Mitigation |
|--------|-----------------|----------------|
| Address verification | Postcard, credit card, phone GPS | Real address per market (see Section 5) |
| Community flags | User reports → manual review | Natural voice, low frequency, genuine helpfulness |
| Posting velocity | Daily/weekly pattern analysis | Max 2-3 service recs/day, randomized timing |
| Content repetition | Similar text across neighborhoods | Unique template sets per market (7+ per vertical) |
| Geographic inconsistency | Posts from outside stated neighborhood | Residential proxy or VPN per market |
| Engagement ratios | Low engagement + high posting = spam | 3:1 organic-to-lead engagement ratio |

### What They DON'T Look For (Their Blind Spots)
- **Cross-market phone number analysis** — moderators are local, no cross-city visibility
- **Affiliate network pattern matching** — they don't know what eLocal is
- **Browser fingerprint correlation across markets** — no evidence of this capability
- **Temporal correlation** — accounts posting in different cities at similar times not flagged
- **Revenue pattern detection** — they can't see call volumes on external numbers

### Key Insight
Nextdoor enforcement is **community-driven and local**, not centralized intelligence. A moderator in Schaumburg has zero visibility into Downers Grove activity. Isolation between markets = isolation between risk.

---

## 4. Architecture Per Market

Each new market is a fully isolated unit. No shared signals.

```
MARKET UNIT = {
  identity: {
    name:        unique persona
    email:       unique Proton alias (via SimpleLogin)
    phone:       unique Twilio number (local area code)
    address:     verified address in target neighborhood
  },
  
  technical: {
    browser:     dedicated browser profile (unique fingerprint)
    ip:          residential proxy in target metro
    cookies:     isolated, never shared
  },
  
  operations: {
    templates:   unique set per market (7+ per vertical, 15+ community)
    schedule:    randomized posting times (different from other markets)
    tracking:    unique eLocal tracking numbers per vertical
    twilio:      dedicated numbers with local area codes
  },
  
  warmup: {
    week_1-2:    organic engagement only (likes, comments, community posts)
    week_3:      first service recommendation (1/week max)
    week_4+:     scale to 2-3 service recs/day + community engagement
  }
}
```

---

## 5. Address Verification Strategy

This is the hardest barrier. Options ranked by viability:

### Option A: Real Associates (Recommended for First 3-5 Markets)
- Recruit someone who actually lives in target area
- They create the account, we operate it (with consent)
- Revenue split: 50/50 or flat monthly fee
- **Risk: Lowest** — account is genuinely local
- **Effort: Medium** — need to find and onboard people

### Option B: Accessible Addresses
- Friends/family in target suburbs
- Rental properties or mailbox services that receive postcards
- **Risk: Low-Medium** — address is real, just not "home"
- **Effort: Low** — if you already have connections

### Option C: Verification Workaround
- Some markets accept phone GPS verification (no postcard)
- Location spoofing during signup → organic use after
- **Risk: Medium** — depends on Nextdoor's current verification flow
- **Effort: Low** — but brittle if they change the flow

### Option D: Business Accounts
- Nextdoor offers business pages (paid)
- Can recommend services from a business context
- **Risk: Lowest** — fully legitimate
- **Limitation:** Less trust than "neighbor" recommendations, costs money
- **Worth testing** in 1 market as comparison

---

## 6. Tech Stack Per Market

### Email (Proton)
- **SimpleLogin aliases** — one per market account
- Pattern: `{firstname}.{lastname}.{city}@simplelogin.co`
- Managed in Proton Pass vault: "Nextdoor Markets"

### Phone (Twilio)
- Local area code number per market
- Dedicated eLocal tracking numbers per vertical per market
- Voice webhook routes to eLocal bridge (existing infrastructure)
- **Cost:** ~$1/month per number + usage

### Browser (Isolation)
- Separate browser profile per market in OpenClaw
- OR antidetect browser (Multilogin, GoLogin) if scaling past 5
- Each profile: unique user agent, timezone, language, screen resolution
- **Never** access two market accounts from the same profile

### IP (Residential Proxy)
- Residential proxy service with city-level targeting
- Options: Bright Data, Smartproxy, IPRoyal
- **Cost:** ~$5-15/month per market for residential IPs
- Ensure IP is in the same metro as the verified address

### Automation
- Separate cron job per market (existing OpenClaw infrastructure)
- Each cron uses its own browser profile, proxy, and template set
- Staggered schedules (no two markets posting within 30 min of each other)

---

## 7. Market Selection Criteria

Score each potential market on:

| Factor | Weight | Why |
|--------|--------|-----|
| **Median home value** | 30% | Higher values = bigger service tickets = higher eLocal payouts |
| **Population density** | 20% | More people = more Nextdoor posts = more leads |
| **Nextdoor activity level** | 25% | Dead neighborhoods = no leads regardless of setup |
| **eLocal coverage** | 15% | They need to have contractors in the area to route to |
| **Address access** | 10% | Can we actually verify an account there? |

### Priority Markets to Research
- **Chicago North Shore** (Evanston, Wilmette, Winnetka) — high home values, dense
- **Naperville/Aurora corridor** — already adjacent to DG, huge population
- **Oak Brook/Hinsdale** — wealthy, high service ticket values
- **Schaumburg/Arlington Heights** — large NW suburban market
- **Joliet/Plainfield** — growing SW suburbs, less competition

---

## 8. Revenue Model

### Per Market (Steady State — Month 3+)
```
Assumptions:
- 2-3 service recommendations per day
- ~15% conversion to phone call
- 70% eLocal qualification rate
- Average $45/qualified lead across verticals

Monthly per market:
- 75 recommendations/month
- ~11 phone calls
- ~8 qualified leads
- Revenue: $360/month

With 5 markets: $1,800/month
With 10 markets: $3,600/month
```

### Costs Per Market
```
- Twilio numbers: ~$7/month (1 general + 6 verticals)
- Residential proxy: ~$10/month
- Proton alias: free (included in plan)
- Browser profile: free (OpenClaw) or ~$10/month (antidetect)
- eLocal: no cost (they pay us)
- Total overhead: ~$17-27/month per market

Net margin per market: ~$330-340/month (>90%)
```

---

## 9. Rollout Plan

### Phase 1: Optimize DG Market (Now — Week 2)
- [ ] Confirm first eLocal lead qualified and paid
- [ ] Track conversion rate on current posting cadence
- [ ] Document what's working (response templates, timing, verticals)
- [ ] Establish baseline metrics for single-market performance

### Phase 2: Market Research + Infrastructure (Weeks 2-4)
- [ ] Score and rank top 5 target markets
- [ ] Set up Proton aliases and SimpleLogin for first 3 markets
- [ ] Provision residential proxy service
- [ ] Create browser profiles for each market
- [ ] Develop unique template sets per market
- [ ] Request additional eLocal tracking numbers per new market

### Phase 3: Account Creation + Warmup (Weeks 4-8)
- [ ] Create Nextdoor accounts for markets 2-3
- [ ] Complete address verification
- [ ] 2-week organic warmup period per account
- [ ] Monitor for any flags or friction during warmup

### Phase 4: Activate + Scale (Weeks 8-12)
- [ ] Begin lead gen posting in markets 2-3
- [ ] Monitor conversion rates vs DG baseline
- [ ] Tune templates and timing per market
- [ ] If clean, begin markets 4-5
- [ ] Build out automation (dedicated cron per market)

### Phase 5: Steady State + Optimization (Month 4+)
- [ ] All 5 markets running
- [ ] A/B test templates across markets
- [ ] Optimize posting schedule by day/time performance
- [ ] Evaluate expansion to markets 6-10
- [ ] Consider Facebook Groups as additional channel per market

---

## 10. Risk Mitigation

### Circuit Breakers
- **Any account flagged:** Immediately pause that market for 14 days. Do NOT increase activity elsewhere.
- **Two accounts flagged in 30 days:** Full stop, audit all isolation measures before continuing.
- **Community complaint:** Switch to 100% organic engagement for 1 week, then resume at 50% cadence.

### Isolation Audit (Monthly)
- [ ] Verify no shared IPs across markets
- [ ] Verify no shared browser fingerprints
- [ ] Verify no shared tracking numbers in posts
- [ ] Verify template uniqueness across markets
- [ ] Review posting time overlaps

### Nuclear Option
If Nextdoor fundamentally changes their platform (e.g., AI-powered cross-market detection), we pivot:
- Shift volume to Facebook Groups (already researched)
- Lean harder on FindALocalPro.com SEO (organic, no platform risk)
- Explore Google Local Services Ads as paid alternative

---

## 11. Open Questions

1. **eLocal multi-market:** Do they support multiple geographic campaigns under one affiliate account, or do we need separate agreements per market?
2. **Template generation:** Should we use AI to generate unique template sets per market, or hand-write them?
3. **Address verification flow:** What's Nextdoor's current verification method? Has it changed since our last research?
4. **Revenue split model:** If using Option A (real associates), what's the right split? 50/50? Flat $100/month?
5. **Facebook Groups timing:** When do we layer in FB as a second channel per market?

---

*This document is a living strategy. Update as we learn from each new market launch.*
