# FindALocalPro — Lead Gen Channels (Master Reference)

> Single source of truth for all lead generation channels.
> Each channel has its own directory under `~/clawd/findalocalpro/` with CHANNEL-PLAYBOOK.md + config files.
> Last updated: 2026-03-04

---

## Channel Overview

| # | Channel | Persona | Status | Directory | Daily Limit | Cron IDs |
|---|---------|---------|--------|-----------|-------------|----------|
| 1 | 🏠 **Nextdoor** | Miles Granite | ✅ LIVE | `nextdoor/` | 3 recs/day | Nextdoor cron (existing) |
| 2 | 📘 **Facebook** | Michael Grandy | ✅ **PHASE 2 LIVE** (Mar 19+) | `facebook/` | 3 replies/day | `aeb0c98e` (lead gen, auto-mode), `9d662ad4` (disabled) |
| 3 | 🔴 **Reddit** | Rob Kessler | 🟡 WARMING (2 weeks) | `reddit/` | 2 FALP mentions/day (active) | `aea46ca1` (karma builder) |
| 4 | 📋 **Craigslist** | Tom Brannigan | 🟡 READY (Mar 18) | `craigslist/` | 3 emails/day | `002d36bb` (scanner) |
| 5 | 📰 **Patch.com** | Danny Kowalski | 🟡 LURKING → active Mar 12 | `patch/` | 3 comments/day | `4c622f8d` (lurk) |
| 6 | 🌐 **Website** | (organic SEO) | ✅ LIVE | `../` (root project) | N/A | N/A |

### Future Channels (Not Started)
| Channel | Notes | Priority |
|---------|-------|----------|
| 🟡 Yelp | "Request a Quote" forums. Aggressive anti-fake. Better as market research. | Low |
| 🟡 Thumbtack/Angi | Can't post. Scrape for demand intelligence only. | Research |
| 🟢 Google Maps Reviews | Mine competitor 1-star reviews for targeting intel. | Research |

---

## ⚠️ Persona Firewall — CRITICAL

**No cross-contamination between personas. Ever.**

| Persona | Platform | Email | Location Claim | Created |
|---------|----------|-------|---------------|---------|
| **Miles Granite** | Nextdoor | d0main@protonmail.com | Downers Grove | Established |
| **Michael Grandy** | Facebook | (Facebook account) | Lombard, IL | 2026-03-04 |
| **Rob Kessler** | Reddit | info@findalocalpro.com | DuPage County | 2026-03-04 |
| **Tom Brannigan** | Craigslist | tbrannigan.dupage@proton.me | Western suburbs | 2026-03-04 |
| **Danny Kowalski** | Patch.com | dkowalski.westmont.creole003@passmail.net | Westmont, IL | 2026-03-05 |

**Rules:**
- Each persona exists ONLY on its assigned platform
- Never mention one persona's name on another channel
- Never reference activity on other platforms
- Never link to the same personal stories across personas
- All use the same FALP phone numbers (that's the only connection)

---

## Phone Number Routing (All Channels)

| Vertical | Phone | eLocal Need ID | Price/Lead |
|----------|-------|---------------|------------|
| 🔧 Plumbing | (630) 756-5104 | 10000- | $57.50 |
| ⚡ Electrical | (630) 318-3024 | 5000- | $33.00 |
| ❄️ AC/Cooling | (630) 599-8262 | 584- | $70.00 |
| 🔥 Heating | (630) 756-5505 | 583- | $70.00 |
| 🐛 Pest Control | (630) 491-3723 | 6000- | $50.00 |
| 🔌 Appliance | (630) 756-5185 | 149- | $32.50 |
| 📱 General/IVR | (630) 407-1727 | varies | varies |

---

## Engagement Philosophy (All Channels)

1. **Be genuinely helpful first.** Answer the actual question with real advice.
2. **Mention FALP naturally.** Recommendation, not sales pitch.
3. **Vary everything.** Templates, timing, length, tone.
4. **Respect platform limits.** Each has different spam thresholds.
5. **Approve first.** All outbound gets Telegram approval before posting.
6. **Track everything.** Every post/reply/email logged in activity-log.json per channel.
7. **When in doubt, don't post.** Missed lead > banned account.

---

## Scaling Timeline

| Week | Nextdoor | Facebook | Reddit | Craigslist | Patch |
|------|----------|----------|--------|------------|-------|
| Mar 4-10 | ✅ Live | ~~🟡 Lurking~~ | 🟡 Karma warming | ⏳ Email setup | 🟡 Lurking |
| Mar 11-17 | ✅ Live | ~~🟡 Still lurking~~ | 🟡 Still warming | 🟡 Scanning begins | 🟡 Soft launch |
| Mar 18-24 | ✅ Live | ✅ **PHASE 2 LIVE (Mar 19)** | 🟡 First FALP mentions | ✅ Emailing begins | ✅ Active |
| Mar 25+ | ✅ Live | ✅ Active | ✅ Active | ✅ Active | ✅ Active |

---

## Per-Channel Documentation Index

### Nextdoor — Miles Granite
- `nextdoor/strategy.md` — Full strategy doc (comprehensive)
- `nextdoor/templates.json` — Response templates
- `nextdoor/scoring.json` — Lead scoring config
- `nextdoor/activity-log.json` — Activity tracking
- `nextdoor/cron-prompt.md` — Cron job prompt text

### Facebook — Michael Grandy
- `facebook/CHANNEL-PLAYBOOK.md` — Strategy + phases
- `facebook/groups.json` — 18 groups with status/priority
- `facebook/templates.json` — 6 response templates
- `facebook/scoring.json` — Keyword matching + scoring
- `facebook/activity-log.json` — Activity tracking

### Reddit — Rob Kessler
- `reddit/CHANNEL-PLAYBOOK.md` — Full strategy + warming plan
- `reddit/subreddits.json` — 8 target subreddits
- `reddit/templates.json` — Reddit-adapted templates + karma topics
- `reddit/activity-log.json` — Activity tracking + phase state

### Craigslist — Tom Brannigan
- `craigslist/CHANNEL-PLAYBOOK.md` — Full strategy + email flow
- `craigslist/templates.json` — Email templates
- `craigslist/activity-log.json` — Activity tracking

### Patch.com — Danny Kowalski
- `patch/CHANNEL-PLAYBOOK.md` — Full strategy + phases
- `patch/communities.json` — 10 DuPage County Patch communities
- `patch/templates.json` — Comment + classifieds templates
- `patch/scoring.json` — Article keyword matching + scoring
- `patch/activity-log.json` — Activity tracking

### Website (Organic SEO)
- Root project files (Next.js app)
- `docs/PHONE-SYSTEM.md` — IVR + call bridge docs
- `DEPLOY-ELOCAL.md` — eLocal integration deployment

---

## Cron Job Quick Reference

| Cron Name | ID | Schedule | Model | Status |
|-----------|-----|----------|-------|--------|
| ~~Facebook Lurk~~ | ~~`9d662ad4`~~ | ~~9 AM + 3 PM~~ | ~~Sonnet~~ | 🔴 ~~DISABLED (Mar 19)~~ |
| **Facebook Lead Gen** | **`aeb0c98e`** | **9 AM, 12 PM, 5 PM** | **Sonnet** | ✅ **PHASE 2 AUTO MODE** |
| ~~Facebook Mode Switch~~ | ~~`67b9a7d4`~~ | ~~One-shot Mar 12~~ | ~~Sonnet~~ | ~~✅ COMPLETE~~ |
| Reddit Karma Builder | `aea46ca1` | 10 AM + 6 PM | Sonnet | ✅ Enabled |
| CL Service Scanner | `002d36bb` | 12 PM | Sonnet | ✅ Enabled |
| Patch Lurk | `4c622f8d` | 11 AM + 5 PM | Sonnet | ✅ Enabled (lurk mode) |
| Nextdoor | (existing) | (existing) | (existing) | ✅ Enabled |

---

## Weekly Review Checklist

Every Monday:
- [ ] Check each persona's account health (warnings, bans, flagged posts)
- [ ] Review leads generated per channel
- [ ] Check template effectiveness (which ones get positive responses)
- [ ] Verify cron jobs ran successfully (no timeouts/errors)
- [ ] Update activity-log.json if any manual activity happened
- [ ] Adjust scoring thresholds if too many/few leads surfacing
- [ ] Review CHANNELS.md for accuracy
