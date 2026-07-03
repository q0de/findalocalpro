'use client';

import { useEffect, useState } from 'react';

type CopyVariant = 'updated' | 'current';
type CopyKey =
  | 'heroTitle'
  | 'heroLede'
  | 'primaryCta'
  | 'secondaryCta'
  | 'recentWeekHelper'
  | 'howHeading'
  | 'howBody'
  | 'reportHeading'
  | 'reportBody'
  | 'pricingHeading'
  | 'pricingBody'
  | 'priceAnchorLabel'
  | 'priceDropLabel'
  | 'includedHeading'
  | 'applyHeading'
  | 'applyBody';

const heroTitleCurrent = [
  ['Catch', false],
  ['homeowner', false],
  ['demand', false],
  ['before', true],
  ['your', true],
  ['competitors', true],
  ['do.', true],
] as const;

const heroTitleUpdated = [
  ['Watch', false],
  ['the', false],
  ['neighborhood.', false],
  ['Catch', false],
  ['demand', true],
  ['before', true],
  ['competitors', true],
  ['do.', true],
] as const;

const renderHeroTitle = (words: readonly (readonly [string, boolean])[]) =>
  words
    .map(([word, isGreen], index) => (
      `<span class="partner-hero-title-word${isGreen ? ' is-green' : ''}" data-word="${word}" style="--word-index: ${index}">${word}${index < words.length - 1 ? ' ' : ''}</span>`
    ))
    .join('');

const copyVariants: Record<CopyVariant, Record<CopyKey, string>> = {
  updated: {
    heroTitle: renderHeroTitle(heroTitleUpdated),
    heroLede: 'We monitor local homeowner demand across neighborhood platforms, search signals, calls, reviews, and competitor mentions — then send you the alerts and weekly report that show where the money is.',
    primaryCta: 'Apply for a Founding Partner Spot',
    secondaryCta: 'See the Weekly Report',
    recentWeekHelper: 'Illustrative example · demand signals found, not guaranteed jobs',
    howHeading: "A high-touch local market watch that runs while you're on the job.",
    howBody: 'No dashboard to babysit. We watch the neighborhood, flag what matters, and bring you the opportunities worth acting on.',
    reportHeading: 'Every Monday, know what happened locally and what to do next.',
    reportBody: 'The weekly Neighborhood Demand Report is the v1 owner view: opportunities found, actions taken, calls routed, reputation alerts, competitor mentions, and recommended next moves.',
    pricingHeading: 'Founding pricing — discounted while we calibrate your market.',
    pricingBody: 'Founding partners help us tune the service by trade and territory. You get the high-touch Neighborhood Demand Engine for $497/month for your first 3 months before the $750/month standard rate.',
    priceAnchorLabel: 'Premium service value',
    priceDropLabel: 'founding price drops to',
    includedHeading: 'One done-for-you local demand service.',
    applyHeading: 'Apply to protect your trade & territory.',
    applyBody: 'Apply first — no payment today. We review your category, service area, and exclusivity before anything is charged.',
  },
  current: {
    heroTitle: renderHeroTitle(heroTitleCurrent),
    heroLede: 'We monitor local conversations, review signals, and tracked calls for your trade and territory — then send you the opportunities, alerts, and weekly reports that help turn local demand into booked work.',
    primaryCta: 'Apply for a Founding Partner Spot',
    secondaryCta: 'See the Weekly Report',
    recentWeekHelper: 'Illustrative example · signals found, not guaranteed jobs',
    howHeading: "A local market watch that runs while you're on the job.",
    howBody: "No dashboard to babysit. We do the watching and bring you what's worth your time.",
    reportHeading: 'One clear read on your local market — every Monday.',
    reportBody: 'A done-for-you briefing, not a dashboard you have to log into. Seven sections, written for a busy owner who has five minutes between jobs.',
    pricingHeading: 'Founding pricing — locked in while we open your territory.',
    pricingBody: "We're enrolling a first wave of partners by trade and territory. Founding partners help us calibrate the service in their market — so the price reflects that, and it's lower than the standard rate.",
    priceAnchorLabel: 'Full-service pilot value',
    priceDropLabel: 'founding price drops to',
    includedHeading: 'Everything in one done-for-you service.',
    applyHeading: 'Claim your trade & territory.',
    applyBody: "Apply first — there's no payment today. We review availability in your area and confirm before anything is charged.",
  },
};

export function PartnerCopyVersionControl() {
  const [variant, setVariant] = useState<CopyVariant>('current');

  useEffect(() => {
    const selectedCopy = copyVariants[variant];

    Object.entries(selectedCopy).forEach(([key, value]) => {
      document.querySelectorAll<HTMLElement>(`[data-copy-key="${key}"]`).forEach((element) => {
        if (key === 'heroTitle') {
          element.innerHTML = value;
          return;
        }

        element.textContent = value;
      });
    });
  }, [variant]);

  return (
    <div className="partner-copy-version-control" aria-label="Copy version">
      <span>Copy version</span>
      <select value={variant} onChange={(event) => setVariant(event.target.value as CopyVariant)} aria-label="Copy version">
        <option value="current">Current copy</option>
        <option value="updated">Updated PRD copy</option>
      </select>
    </div>
  );
}
