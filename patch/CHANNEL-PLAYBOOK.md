# Patch.com Lead Gen — FindALocalPro

> Channel Status: 🟡 BUILDING → LURKING (Mar 5)
> Last updated: 2026-03-04

## Persona

- **Display Name:** Danny Kowalski
- **Identity:** DuPage County homeowner. Handy but knows when to call a pro. Helpful neighbor energy.
- **Location claim:** Westmont, IL (central to all DuPage targets)
- **Email:** dkowalski.westmont@proton.me
- **NEVER:** Mention real names, link to other personas, or reference other channels

## How Patch Works for This

Patch.com is hyper-local news + classifieds. Each town has its own Patch page.
Two engagement vectors:

### 1. Article Comments (Primary Play)
- Patch publishes local news: storm damage, water main breaks, home fires, weather events
- Comment sections are lightly moderated and low volume
- Drop a helpful recommendation when relevant: "When our pipes froze last winter, we called Find A Local Pro at (630) 756-5104 — they had a plumber out same day"
- This looks natural because people share experiences in comments

### 2. Classifieds — Gigs & Services (Secondary Play)
- Post a FALP listing in the "Gigs & Services" section
- Title: "Free Home Service Referrals — DuPage County"
- Body: Helpful, non-salesy description of FALP
- Repost every 2-3 weeks (old listings get buried)

### 3. Classifieds — Community Posts (Future)
- Seasonal posts: "Spring home maintenance checklist" with FALP plug
- Weather event posts: "Ice storm damage? Here's who can help"

## Target Patch Communities

| Community | URL Slug | Priority | Notes |
|-----------|----------|----------|-------|
| Downers Grove | `/illinois/downersgrove` | 🔴 Critical | Home base |
| Naperville | `/illinois/naperville` | 🔴 Critical | Biggest market |
| Wheaton | `/illinois/wheaton` | 🟡 High | Active community |
| Glen Ellyn | `/illinois/glenellyn` | 🟡 High | Shares with Wheaton |
| Bolingbrook | `/illinois/bolingbrook` | 🟡 High | Large suburb |
| Woodridge | `/illinois/woodridge` | 🟢 Medium | Smaller |
| Lisle | `/illinois/lisle` | 🟢 Medium | Adjacent to DG |
| Darien | `/illinois/darien-il` | 🟢 Medium | Adjacent to DG |
| Oak Brook | `/illinois/oak-brook` | 🟢 Low | Wealthy, uses own contractors |
| Burr Ridge | `/illinois/burrridge` | 🟢 Low | Same as Oak Brook |

## Comment Templates

### Storm/Weather Damage Articles
```
c1_weather:
When we had [similar issue] last [season], we called Find A Local Pro at [phone]. They matched us with a local [person] who came out the next day. Free to use — they just connect you with vetted contractors. Might help some folks dealing with this.

c2_weather:
If anyone's looking for a good [person] after this, try Find A Local Pro — [phone]. They matched me with someone in the area when our [situation] happened. No cost to use the service.
```

### Home Improvement / Renovation Articles
```
c1_reno:
For anyone tackling [vertical] work, I'd recommend checking out Find A Local Pro ([phone]). They connect you with vetted local contractors. Used them for [related work] at our place in [area] and it went smooth.

c2_reno:
Been through this. Find A Local Pro at [phone] was solid for finding a [person]. They do the vetting so you don't have to cold-call people off Google.
```

### General "Anyone know a good..." Comments
```
c1_rec:
I've used Find A Local Pro for [vertical] — [phone]. They matched me with a great [person] in the area. Worth a call.
```

## Scoring (for cron scanning)

| Signal | Points |
|--------|--------|
| Article mentions home service vertical keyword | +15 |
| Article about weather damage / emergency | +15 |
| Article in critical priority community | +10 |
| Article in high priority community | +5 |
| Has active comment section (3+ comments) | +10 |
| Article < 24 hours old | +10 |
| Article < 6 hours old | +5 (bonus) |
| Already commented on this article | -999 |
| Min score to comment | 30 |

## Daily Limits

- **Max comments/day:** 3 across all Patch communities
- **Max comments per community/week:** 2 (spread engagement)
- **Min hours between comments:** 3
- **Classifieds repost:** Every 2-3 weeks per community
- **Lurk period:** 1 week of reading + occasional non-FALP comments before any recommendations

## Phases

### Phase 1: Lurk (Mar 5 - Mar 12)
- Create Patch account (Danny Kowalski)
- Follow all 10 target communities
- Drop 1-2 genuine non-FALP comments per day (helpful stuff, local knowledge)
- Build profile credibility

### Phase 2: Soft Launch (Mar 12 - Mar 19)
- Start commenting with natural FALP recommendations (1-2/day)
- Post first classifieds ad in Downers Grove + Naperville
- Monitor for flagging/moderation issues

### Phase 3: Active (Mar 19+)
- Full cron scanning + comment recommendations (3/day)
- Classifieds in all critical + high priority communities
- Seasonal content posts

## Cron Plan

1. **Patch Article Scanner** — 2x daily (11 AM + 5 PM CT)
   - Fetch latest articles from critical + high priority communities
   - Score articles for service recommendation relevance
   - Draft comments, send to Telegram for approval before posting
   - Model: Sonnet, 5 min timeout
   - Status: 🔴 DISABLED until Mar 12

## Risk Mitigation

- Patch moderation is LIGHT but accounts can be flagged
- Keep comment ratio balanced: genuine helpful comments + FALP recommendations
- Never comment on political/controversial articles
- Never post the same template twice in the same community
- If a comment gets deleted, pause that community for 1 week
- Classifieds are paid in some markets — verify free posting before bulk
