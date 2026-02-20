# Task: Fix FindALocalPro Homepage Layout & Chat Parity

## Context
We migrated from Tailwind CDN (v3 runtime) to Tailwind v4 build-time (`@tailwindcss/postcss`). The migration broke visual spacing/layout. We also redesigned the homepage but the user wants the **chat experience to match exactly what it was before**.

## Problems to Fix

### 1. Homepage Spacing is Broken
- Everything is "smushed together" — no visual breathing room between sections
- Need proper section spacing, consistent padding, visual hierarchy
- The site should feel airy, playful, premium — not cramped

### 2. Chat Must Match Previous Version Exactly
- The chat flow (ChatFlow.tsx component) used to look great with the Tailwind CDN
- Now with v4 build-time, visual parity is lost
- The chat needs to look IDENTICAL to how it looked at commit `2130073`
- Reference: `git show 2130073:app/layout.tsx` had the old Tailwind CDN config with all the styles
- The chat appears in two places now:
  - Desktop: Modal overlay (ChatModal.tsx) 
  - Mobile: Full page at /get-matched/page.tsx

### 3. Design System Consistency
- Colors: brand-purple (#8b5cf6), brand-pink (#ff6b9d), brand-yellow (#ffcf2d), brand-teal (#2dd4bf), primary (#6366f1)
- Fonts: Fredoka (headings), Outfit (body) — loaded via Google Fonts in layout.tsx
- Icons: Material Symbols Outlined — loaded via Google Fonts in layout.tsx
- Border radius: 2xl (1rem) and 3xl (1.5rem) predominant
- Aesthetic: Light, airy, playful, soft gradients. NO dark sections except the final CTA (solid brand-purple)

## Reference Files
- `/tmp/old-layout.tsx` — The old layout with Tailwind CDN config (shows all the style definitions)
- `/tmp/old-page.tsx` — The old homepage at commit 2130073
- `~/clawd/skills/web-design-review/SKILL.md` — Design review framework
- `~/clawd/directory-research/skills/dopamine-mechanics.md` — UX engagement patterns
- `~/clawd/directory-research/skills/visual-effects.md` — Animation reference

## Current File Structure
- `app/globals.css` — Tailwind v4 @theme + custom classes
- `app/layout.tsx` — Root layout with Google Fonts, structured data
- `app/page.tsx` — New homepage (verification-first design)
- `app/HomeAnimations.tsx` — Scroll animation components
- `app/ChatModal.tsx` — Desktop chat modal wrapper
- `app/ChatSection.tsx` — Chat section wrapper
- `app/get-matched/page.tsx` — Mobile chat full page
- `components/ChatFlow.tsx` — The main 937-line chat component
- `components/Header.tsx` — Site header
- `components/Footer.tsx` — Site footer

## What to Do

1. **Read the old layout** (`/tmp/old-layout.tsx`) to understand what Tailwind CDN was providing
2. **Compare** the old Tailwind config/styles with what's in `app/globals.css` now
3. **Fix any class differences** between Tailwind v3 CDN and v4 build
4. **Fix homepage spacing** — sections need breathing room, consistent vertical rhythm
5. **Verify chat visual parity** — compare ChatFlow.tsx classes with old style definitions
6. **Test build** — run `npm run build` and verify no errors
7. **Deploy** — run `npx vercel --prod` to deploy

## DO NOT
- Change the homepage content/structure (verification-first messaging stays)
- Change the chat flow logic
- Remove any functionality
- Add any new dependencies
- Change the Tailwind v4 setup back to CDN
