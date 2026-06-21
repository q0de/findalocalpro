# PA Nextdoor Ramp Tracker

Started: 2026-06-15 14:38 CDT
Owner: Clawrl / Shaquille Oatmeal
Last updated: 2026-06-19 12:46 CDT

## Goal
Run Pennsylvania Nextdoor lead capture as normal recurring posting, while preserving the strict wrong-thread/location/duplicate safeguards that prevent bad public replies.

## Current State — NORMAL GUARDED POSTING

Shaquille Oatmeal explicitly approved unlocking PA posting again on 2026-06-19 12:44 CDT after confusion from stale scan/log-only tracker language.

### Dad / Warrington-Bucks
- Cron: `Nextdoor Scan - Pennsylvania`
- Enabled: **yes**
- Posting: **yes, normal guarded posting**
- Mode: find homeowner service-request posts and publish neighbor-style text-only public service replies when all safety checks pass.
- Limits: max 2 public service replies/run; baseline 8/day; up to 2 premium overflow only for fresh score >=85 plumbing/HVAC/electrical leads; hard max 10/day.
- Guardrails:
  - Verify Dad PA proxy/profile and visible Warrington/Bucks/nearby PA context.
  - Use stable `/p/<post_id>` URL only, never feed-card-only posting.
  - Run non-writing target preflight before submit.
  - Require exact post ID/URL, exact target author, distinctive must-contain phrase, correct vertical, correct PA phone number, exactly one in-container comment box/button.
  - Text-only. No image/card upload. No Find A Local Pro brand/link mention. No Illinois/630 numbers.
  - If preflight/browser context is ambiguous, log only and do not type/submit.

### PA Franconia
- Cron: `Nextdoor Scan - PA Franconia`
- Enabled: **yes**
- Posting: **yes, normal guarded posting**
- Same limits and guardrails as Dad/Warrington, using the Franconia profile/port and PA-local numbers.

### PA Reply Monitors
- `Nextdoor Reply Monitor - Pennsylvania`: enabled, normal guarded follow-up monitor.
- `Nextdoor Reply Monitor - PA Franconia`: enabled, normal guarded follow-up monitor.
- Respond only to actionable follow-ups/questions/thanks on our existing comments. If ambiguous, log only.

## Posting Command Shape
Preflight first, then submit only if preflight passes cleanly.

- Warrington/Dad CDP: `127.0.0.1:18802`
- Franconia CDP: `127.0.0.1:18803`
- Submit requires `NEXTDOOR_SUBMIT_UNLOCK=shaquille-approved-after-harness`

## Decisions / Notes
- 2026-06-15 14:38 CDT: Initial PA reopening started as scan/log-only.
- 2026-06-15 16:24 CDT: Gate 1 clean; opened one guarded text-only canary for Dad/Warrington.
- 2026-06-16 10:37 CDT: Shaquille Oatmeal approved PA scale-up to guarded posting for Dad/Warrington and scan/log-only for Franconia.
- 2026-06-16 20:35 CDT: Watchdog found Dad submit rejection and one clean Franconia HVAC canary reply visible as Chester Rutherford.
- 2026-06-18 15:23 CDT: Updated PA/IL Nextdoor jobs to 8 baseline + 2 premium overflow semantics. Paid-model audit passed.
- 2026-06-19 12:05 CDT: Tracker had stale scan/log-only language after branch restoration, causing config mismatch and conservative scan/log-only summaries.
- 2026-06-19 12:44 CDT: Shaquille Oatmeal approved clearing the stale scan-only brake. PA Warrington and PA Franconia are now normal guarded posting again, with strict preflight and wrong-thread/location/duplicate checks preserved.

## Do Not Regress
- Do not reintroduce vague “scan/log-only lock active” language unless Shaquille Oatmeal explicitly pauses posting again.
- Do not remove strict preflight. The fix is clearing stale locks, not weakening safety.
- Do not post images/cards/brand/link/630 numbers in PA unless explicitly approved.
