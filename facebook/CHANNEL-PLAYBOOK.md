# Facebook Lead Gen — FindALocalPro

> Channel Status: ✅ PHASE 2 ACTIVE (Auto-post mode since March 19, 2026)
> Last updated: 2026-03-19
> 
> **Phase 1:** Lurking (Mar 4-11) ✅ Complete
> **Phase 2:** Active Lead Gen (Mar 19+) 🚀 LIVE — Posts directly, reports after

## Persona

- **Profile:** Michael Grandy (michael.grandy.1)
- **Location Claim:** Lombard, IL
- **Backstory:** Local resident, active in community groups
- **Tone:** Friendly neighbor, helpful but not pushy
- **NEVER:** Mention real names, link to other personas, or reference other channels

## Groups (18 total)

See `groups.json` for full list with URLs, member counts, priority, and status.

### Key Groups by Priority
- **Critical:** Contractor/Home Related Recommendations in Chicagoland (8.5K) — PENDING admin approval
- **High:** My DG (26K), What's Happening Naperville (92K), Naperville Talk (42K), Glen Ellyn-Wheaton Neighbors (47K), What's Happening Bolingbrook (81K), Local Naperville (19K)
- **Medium:** Various other DuPage suburb groups

## Strategy

### Phase 1: Lurking (Mar 4–11) ✅ COMPLETE
- Joined groups. Reacted to posts (likes, helpful, etc.)
- Commented on non-service posts to build activity history
- Goal: Look like a real person who just joined community groups
- Result: 22 groups joined, profile established with organic activity

### Phase 2: Active Lead Gen (Mar 19+) 🚀 CURRENT
- Respond to service recommendation requests with FALP phone numbers
- **AUTO MODE:** Posts replies directly, reports to Telegram after
- Max 3 replies/day across all groups
- No more than 1 reply in the same group per day
- Template rotation — no repeat within 3 days
- Low score threshold (35) to catch borderline opportunities
- Still logs all activity for tracking and safety

## Response Templates

See `templates.json` for full template library. 6 templates with varied tones:
- Casual helpful, experienced neighbor, secondhand recommendation
- Direct helpful, personal story, brief recommendation

## Lead Scoring

See `scoring.json` for keyword matching. Scores posts 0-100:
- Has recommendation keyword: +20
- Has service keyword: +15
- Has question mark: +10
- In target area: +10
- Min score to engage: 35
- Skip posts >48 hours old or >20 replies

## Cron Jobs

1. **Facebook Lurk** (`9d662ad4`) — ✅ ENABLED, 9 AM + 3 PM daily
   - Visits 3-4 groups, likes/reacts, builds credibility
   - Scouts leads but does NOT reply
   - Model: Sonnet

2. **Facebook Lead Gen** (`aeb0c98e`) — 🔴 DISABLED until March 12
   - Scans 4-6 groups, scores posts, drafts replies
   - Auto mode: posts replies autonomously, reports to Telegram after
   - Model: Sonnet

3. **Mode Switch** (`67b9a7d4`) — One-shot at March 12, 9 AM
   - Enables Lead Gen, disables Lurk, notifies Telegram
   - Self-deletes after run

## Risk Mitigation

- Facebook groups have aggressive admins who ban promotional accounts
- Lurk period builds legitimacy before any FALP mentions
- Varied templates prevent pattern detection
- 3:1 ratio of organic engagement to service recommendations
- If banned from any group, do NOT rejoin — accept the loss
- Never argue with admins or other members

## Files

- `groups.json` — Group list with status and priority
- `templates.json` — Response templates with vertical phone numbers
- `scoring.json` — Keyword matcher and scoring config
- `activity-log.json` — Daily caps, template rotation, dedup tracking
