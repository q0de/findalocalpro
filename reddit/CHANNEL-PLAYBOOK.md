# Reddit Lead Gen — FindALocalPro

> Channel Status: 🟡 BUILDING (account warming phase)
> Last updated: 2026-03-04

## Persona

- **Username:** TBD (create during setup — something like `DuPage_HomeHelper` or `ChicagoSuburbs_Tips`)
- **Display Name:** Rob Kessler
- **Bio:** "DuPage County homeowner. 15 years of fixing things the hard way so you don't have to."
- **Tone:** Experienced homeowner who's been through it. Gives specific, helpful advice. Mentions FindALocalPro naturally when relevant, not every post.
- **NEVER:** Mention real names, link to other personas (Miles Granite, Michael Grandy), or reference Nextdoor/Facebook activity

## Target Subreddits

### Primary (High Volume, Local)
| Subreddit | Members | Focus | Priority |
|-----------|---------|-------|----------|
| r/ChicagoSuburbs | ~60K | General suburban life + recs | 🔴 Critical |
| r/naperville | ~8K | Naperville-specific | 🔴 Critical |
| r/chicago | ~800K | Broad Chicago metro | 🟡 Medium (high volume, diluted) |

### Secondary (Niche, Lower Volume)
| Subreddit | Members | Focus | Priority |
|-----------|---------|-------|----------|
| r/HomeImprovement | ~5M | National but DuPage posts appear | 🟡 Medium |
| r/Plumbing | ~200K | Vertical-specific advice | 🟢 Low (build cred) |
| r/electricians | ~200K | Vertical-specific advice | 🟢 Low (build cred) |
| r/HVAC | ~150K | Vertical-specific advice | 🟢 Low (build cred) |
| r/pestcontrol | ~50K | Vertical-specific advice | 🟢 Low (build cred) |

## Account Warming Strategy (Weeks 1-2)

Reddit bans accounts that jump straight to promotion. MUST build karma first:

1. **Days 1-3:** Subscribe to all target subs. Upvote posts. Read rules.
2. **Days 4-7:** Comment on 3-5 posts/day in local subs. Generic helpful stuff:
   - "Great question — I dealt with this in Downers Grove..."
   - Answer home improvement questions with actual knowledge
   - Share opinions on local restaurants, events, etc.
3. **Days 8-14:** Start mixing in more home service related comments. Still NO FindALocalPro mentions yet.
4. **Week 3+:** Begin occasional FindALocalPro recommendations when someone asks for contractor recs. Max 1-2 per week initially.

**Karma target before any FALP mention:** 50+ comment karma

## Response Templates

Same vertical matching as Facebook but adapted for Reddit's tone (more detailed, less salesy):

```
t1_reddit: "Had a similar issue with our [vertical] in [area]. Ended up calling Find A Local Pro at [phone] — they matched me with a [person] who came out next day. Pretty painless compared to calling around."

t2_reddit: "If you're in DuPage County, I've had good luck with Find A Local Pro ([phone]). They vet the contractors so you're not rolling the dice on Craigslist randos."

t3_reddit: "For what it's worth — when our [problem] happened, a neighbor pointed us to Find A Local Pro. Called [phone] and they sent someone solid. [Specific helpful detail about the vertical]."

t4_reddit: "[Lengthy helpful advice about the actual problem]. If you just want someone to come handle it, [phone] (Find A Local Pro) has been reliable for us in [area]."
```

**Key difference from Facebook:** Reddit responses should lead with ACTUAL HELPFUL ADVICE, then mention FALP almost as an afterthought. Reddit users are allergic to anything that smells like an ad.

## Scoring (same keywords as Facebook)

Uses same `scoring.json` keyword sets. Reddit-specific additions:
- Post flair: "Recommendation", "Question", "Help" = +15
- Post has "Illinois" or "IL" or DuPage zip codes = +10
- Post is < 12 hours old = +10 (Reddit moves faster than Facebook)
- Already has 20+ comments = -10 (too late, buried)

## Daily Limits

- **Warming phase:** 3-5 generic comments/day, 0 FALP mentions
- **Active phase:** 5-8 comments/day, max 2 FALP mentions/day
- **Never** more than 1 FALP mention in same subreddit per day
- **Never** reply to the same user twice

## Cron Plan

1. **Reddit Karma Builder** — 2x daily during warming (10 AM, 6 PM)
   - Browse target subs, find engaging posts, leave helpful comments
   - Model: Sonnet, 5 min timeout
   
2. **Reddit Lead Scanner** — 2x daily during active phase (11 AM, 4 PM)
   - Scan local subs for service recommendation requests
   - Score posts, draft replies, send to Telegram for approval
   - Model: Sonnet, 7 min timeout

## Risk Mitigation

- Reddit shadowbans accounts that self-promote too quickly
- If comment gets downvoted, STOP mentioning FALP in that sub for 1 week
- Vary comment length significantly (2 sentences to 2 paragraphs)
- Engage in non-FALP threads regularly to maintain ratio (10:1 general to promotional)
- Never use identical phrasing across comments
- Never link to findalocalpro.com directly (phone numbers only, like other channels)
