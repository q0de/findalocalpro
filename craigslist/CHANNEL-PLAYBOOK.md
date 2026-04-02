# Craigslist Lead Gen — FindALocalPro

> Channel Status: 🟡 BUILDING
> Last updated: 2026-03-04

## Persona

- **Email:** tbrannigan.dupage@proton.me
- **Display Name:** Tom Brannigan
- **Identity:** Local handyman referral guy. Knows everybody. Quick, helpful emails.
- **NEVER:** Mention real names, link to other personas, or reference other channels

## How Craigslist Works for This

Unlike Reddit/Facebook, Craigslist doesn't have "replies" on posts. The flow is:

1. **Scan** "Services Wanted" and "Household" sections in Chicago CL
2. **Score** posts matching our verticals + DuPage County area
3. **Email** the poster directly with a helpful recommendation
4. Person calls our FALP number → eLocal bridge → we get paid

This is outbound email, so tone MUST be helpful neighbor, not salesperson.

## Target Sections

| Section | URL Base | Priority |
|---------|----------|----------|
| Services Wanted | chicago.craigslist.org/search/sub/wan | 🔴 Critical |
| Household Services | chicago.craigslist.org/search/sub/hss | 🟡 Medium |
| General Community | chicago.craigslist.org/search/sub/com | 🟢 Low |

### Geographic Filters
- **Primary:** DuPage County suburbs (use CL's built-in location filter for western suburbs)
- **Secondary:** Broader Chicagoland if post mentions our target zips

## Email Templates

```
t1_cl:
Subject: Re: [their post title]

Hey — saw your post about needing a [vertical]. I've used a service called Find A Local Pro for stuff like this. Their number is [phone]. They match you with someone local who's been vetted. Saved me a lot of Googling. Hope that helps!

t2_cl:
Subject: [vertical] recommendation

Hi — I'm in [area] and dealt with the same thing recently. I called Find A Local Pro at [phone] and they had a [person] out within a day. Might be worth a shot. Good luck!

t3_cl:
Subject: Might be able to help

Hey, I know a solid referral service for [vertical] work in the suburbs. Find A Local Pro — [phone]. They don't charge you anything, they just connect you with a local [person]. Worked out well for us.
```

## Scanning Infrastructure

We already have CL scanning from the flip scanner. Adapt:

### Search Queries (rotate)
- "need plumber" / "plumber needed" / "plumbing help"
- "need electrician" / "electrical work" / "electrician wanted"  
- "AC repair" / "air conditioning" / "HVAC help"
- "furnace repair" / "heating help" / "no heat"
- "pest control" / "exterminator" / "mice" / "roaches"
- "appliance repair" / "washing machine" / "refrigerator repair"

### Plus area keywords
- "Downers Grove", "Naperville", "Wheaton", "Glen Ellyn", "Lombard", "Bolingbrook", "Westmont", "Woodridge", "Lisle", "Darien", "DuPage"

## Scoring

| Signal | Points |
|--------|--------|
| Has service keyword | +15 |
| Has area keyword | +10 |
| Posted < 24 hours ago | +10 |
| Posted < 6 hours ago | +5 (bonus) |
| "Wanted" section (not selling) | +20 |
| Has phone number already (already found someone?) | -10 |
| Min score to email | 35 |

## Daily Limits

- **Max emails/day:** 3 (Craigslist flags spammy emailers fast)
- **Min hours between emails:** 2
- **Same search section max 1x/day**
- **Never email same poster twice**

## Cron Plan

1. **CL Service Scanner** — 1x daily (12 PM CT)
   - Scan Services Wanted + Household in Chicago CL
   - Filter for DuPage area + our verticals
   - Score and rank matches
   - Draft emails, send to Telegram for approval before sending
   - Model: Sonnet, 5 min timeout

## Email Sending

- Use Proton Mail alias via CLI or SMTP
- Track sent emails in `activity-log.json` (dedup by CL post ID)
- Wait for Telegram approval before sending ANY email
- Include CL post link in Telegram draft for verification

## Risk Mitigation

- Craigslist rate-limits email responses (flagging = account ghosted)
- Keep volume LOW — 2-3 emails/day max
- Vary subject lines and email body
- Never include links (just phone numbers)
- If any email bounces or gets flagged, pause for 48 hours
- Don't email posts that already have 10+ replies (too late)
