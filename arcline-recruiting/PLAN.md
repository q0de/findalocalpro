# Arcline Talent Pipeline — Automated Recruiting System

> **Project Name:** Arcline Talent Pipeline  
> **Entity:** Arcline Ventures LLC  
> **Started:** March 28, 2026  
> **Status:** Phase 1 — Setup & Data Collection  

---

## What Is This?

An automated recruiting pipeline that scans local Facebook and Nextdoor groups for:
1. **Job seekers** — people posting "looking for work"
2. **Employers hiring** — businesses posting "we're hiring"

Then matches them — either through a staffing agency partner (Phase 1) or directly as Arcline (Phase 2).

---

## Revenue Model

### Phase 1: Agency Referral Partner
- Partner with staffing agencies (Express Employment, Aerotek, etc.)
- Source candidates from social media → send to agency
- Agency places them → pays Arcline a referral fee
- **Revenue:** $100–$500 per placement
- **Target:** 2–4 placements/month = $200–$2,000/month

### Phase 2: Direct Matching (Future)
- Build enough candidate + employer data to cut out the agency
- Match candidates directly to employers as Arcline
- Charge placement fee to employer
- **Revenue:** $200–$5,000+ per placement

---

## How It Works (Automated)

### Data Collection (Clawrl handles)
- Facebook cron scans DuPage County groups every 2 hours
- Detects job seeker posts (keywords: "looking for work", "anyone hiring", etc.)
- Detects employer/hiring posts (keywords: "we're hiring", "now hiring", etc.)
- Logs both to local JSON files + pushes to Notion databases

### Candidate Pipeline (Clawrl handles)
- DM job seekers on Facebook: "Hey, I'm with Arcline — we have positions in your area. Interested?"
- Collect name, skills, availability, contact info
- Screen for basic fit against agency's current needs
- Send qualified candidates to agency contact via email
- Track status in Notion (New → Contacted → Interested → Sent to Agency → Placed)

### Human Required (Shaquille Oatmeal handles)
- Initial phone calls to establish agency partnerships
- Approve deal terms and referral fee structure
- Judgment calls on edge cases
- Relationship management with agency contacts

---

## Target Agencies

| Agency | Location | Phone | Status |
|--------|----------|-------|--------|
| Express Employment | Lombard | 630-705-9690 | 🔲 Not contacted |
| Express Employment | Naperville | TBD | 🔲 Not contacted |
| Aerotek | DuPage area | TBD | 🔲 Not contacted |
| Robert Half | DuPage area | TBD | 🔲 Not contacted |
| Staffmark | DuPage area | TBD | 🔲 Not contacted |
| Adecco | DuPage area | TBD | 🔲 Not contacted |

**First call:** Express Employment Lombard — (630) 705-9690
- Ask: Do you work with independent sourcers who send pre-qualified candidates?
- Ask: What percentage/flat fee do you pay for successful placements?
- Ask: What verticals are you most desperate for right now?

---

## Data Infrastructure

### Local Files
- Job seekers: `~/clawd/findalocalpro/facebook/job-seekers-log.json`
- Employers: `~/clawd/findalocalpro/facebook/employers-hiring-log.json`

### Notion Databases (Mission Control)
- 🧑 Job Seekers Pipeline: `331b2d5b-1e91-81a6-96f6-def1d204c0cb`
- 🏢 Employers Hiring: `331b2d5b-1e91-81c8-bbfb-fae0aa7cb0bc`

### Scripts
- `~/clawd/scripts/notion-recruiting.py` — Push entries to Notion
- Facebook cron (`aeb0c98e`) — Auto-detects and logs both types

---

## Unit Economics

| Metric | Value |
|--------|-------|
| Referral fee per placement (agency) | $100–$500 |
| Direct placement fee (Phase 2) | $200–$5,000+ |
| Estimated placements/month (Phase 1) | 2–4 |
| Monthly revenue target (Phase 1) | $200–$2,000 |
| Daily effort (automated) | 30–60 min Clawrl time |
| Daily effort (human) | ~5 min reviewing summaries |

### Comparison to Home Services
- One staffing placement ($250 avg) = ~6 months of home service lead revenue
- Home services: ~$20/lead, 2-3 paid leads/month = $40-60/month
- Staffing: 2 placements/month at $250 = $500/month (10x)

---

## Positioning

- **Entity:** Arcline Ventures LLC (existing website + email)
- **Pitch:** "Local talent sourcing firm" 
- **NOT:** Individual freelancer, recruiter, headhunter
- **Advantage:** Automated candidate discovery via social media monitoring — faster than agency's own sourcing

---

## Phases

### Phase 1 — Setup & Data Collection ← WE ARE HERE
- [x] Facebook cron detecting job seekers
- [x] Facebook cron detecting employers hiring  
- [x] Notion databases created and connected
- [x] Python script for Notion integration
- [x] Employer hiring log file created
- [ ] Call Express Employment Lombard
- [ ] Secure referral partnership deal
- [ ] Begin candidate DM outreach

### Phase 2 — Active Sourcing
- [ ] DM job seekers automatically
- [ ] Screen candidates against agency needs
- [ ] Email matched candidates to agency
- [ ] Track placement outcomes in Notion
- [ ] Expand to Nextdoor job seeker detection

### Phase 3 — Direct Matching
- [ ] Sufficient data on both sides (seekers + employers)
- [ ] Pitch Arcline directly to employers
- [ ] Cut out agency middleman on some placements
- [ ] Higher fees, full control

---

*Last updated: March 28, 2026*
