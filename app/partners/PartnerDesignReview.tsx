'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import {
  PartnerDesignReviewContext,
  usePartnerDesignReview,
} from './PartnerDesignReviewContext';
import type {
  CopyVariant,
  HeroVisualMode,
  PartnerDesignReviewValue,
  PricingBorderMode,
  PricingUnitMode,
  PricingWidthMode,
  ReportBackdropMode,
  ScreenStartupMode,
} from './PartnerDesignReviewContext';

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

const isDevelopment = process.env.NODE_ENV === 'development';

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

const renderHeroTitle = (words: readonly (readonly [string, boolean])[]) => words
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
    pricingBody: 'Founding partners help us tune the service by trade and territory. You get the high-touch Neighborhood Demand Engine for a $500/mo founding pilot for 90 days before the $750/mo standard rate.',
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

const heroTitleLabels: Record<CopyVariant, string> = {
  current: 'Catch homeowner demand before your competitors do.',
  updated: 'Watch the neighborhood. Catch demand before competitors do.',
};

const pricingBorderClasses: Record<PricingBorderMode, string> = {
  classic: 'partner-pricing-border-classic',
  balanced: 'partner-pricing-border-balanced',
  specular: 'partner-pricing-border-specular',
  dark: 'partner-pricing-border-dark',
  reference: 'partner-pricing-border-reference',
};

const pricingUnitClasses: Record<PricingUnitMode, string> = {
  under: 'partner-pricing-unit-under',
  side: 'partner-pricing-unit-side',
  inline: 'partner-pricing-unit-inline',
};

export function PartnerDesignReviewProvider({ children }: PropsWithChildren) {
  const [heroVisualMode, setHeroVisualMode] = useState<HeroVisualMode>('signals');
  const [heroReplayCycle, setHeroReplayCycle] = useState(0);
  const [copyVariant, setCopyVariant] = useState<CopyVariant>('current');
  const [pricingWidthMode, setPricingWidthMode] = useState<PricingWidthMode>('current');
  const [pricingBorderMode, setPricingBorderMode] = useState<PricingBorderMode>('reference');
  const [pricingUnitMode, setPricingUnitMode] = useState<PricingUnitMode>('under');
  const [reportBackdropMode, setReportBackdropMode] = useState<ReportBackdropMode>('map');
  const [screenStartupMode, setScreenStartupMode] = useState<ScreenStartupMode>('fade');
  const [reportReplayCycle, setReportReplayCycle] = useState(0);

  const replayHero = useCallback(() => setHeroReplayCycle((cycle) => cycle + 1), []);
  const replayReport = useCallback(() => setReportReplayCycle((cycle) => cycle + 1), []);

  useEffect(() => {
    const selectedCopy = copyVariants[copyVariant];
    Object.entries(selectedCopy).forEach(([key, value]) => {
      document.querySelectorAll<HTMLElement>(`[data-copy-key="${key}"]`).forEach((element) => {
        if (key === 'heroTitle') {
          element.innerHTML = value;
        } else {
          element.textContent = value;
        }
      });
    });

    document
      .querySelector<HTMLElement>('[data-copy-key="heroTitle"]')
      ?.setAttribute('aria-label', heroTitleLabels[copyVariant]);
  }, [copyVariant]);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return undefined;

    page.classList.toggle('partner-pricing-rows-narrow', pricingWidthMode === 'narrow');
    Object.values(pricingBorderClasses).forEach((className) => page.classList.remove(className));
    Object.values(pricingUnitClasses).forEach((className) => page.classList.remove(className));
    page.classList.add(pricingBorderClasses[pricingBorderMode], pricingUnitClasses[pricingUnitMode]);

    return () => {
      page.classList.remove('partner-pricing-rows-narrow');
      Object.values(pricingBorderClasses).forEach((className) => page.classList.remove(className));
      Object.values(pricingUnitClasses).forEach((className) => page.classList.remove(className));
    };
  }, [pricingBorderMode, pricingUnitMode, pricingWidthMode]);

  const value = useMemo<PartnerDesignReviewValue>(() => ({
    heroVisualMode,
    setHeroVisualMode,
    heroReplayCycle,
    replayHero,
    copyVariant,
    setCopyVariant,
    pricingWidthMode,
    setPricingWidthMode,
    pricingBorderMode,
    setPricingBorderMode,
    pricingUnitMode,
    setPricingUnitMode,
    reportBackdropMode,
    setReportBackdropMode,
    screenStartupMode,
    setScreenStartupMode,
    reportReplayCycle,
    replayReport,
  }), [
    copyVariant,
    heroReplayCycle,
    heroVisualMode,
    pricingBorderMode,
    pricingUnitMode,
    pricingWidthMode,
    replayHero,
    replayReport,
    reportBackdropMode,
    reportReplayCycle,
    screenStartupMode,
  ]);

  return (
    <PartnerDesignReviewContext.Provider value={value}>
      {children}
      {isDevelopment ? <PartnerDesignReviewDrawer /> : null}
    </PartnerDesignReviewContext.Provider>
  );
}

function PartnerDesignReviewDrawer() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const preview = usePartnerDesignReview();

  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const firstControl = panelRef.current?.querySelector<HTMLElement>('select, button');
    firstControl?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeAndRestoreFocus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAndRestoreFocus, open]);

  return (
    <aside className={`partner-design-review${open ? ' is-open' : ''}`} aria-label="Design review controls">
      <button
        ref={toggleRef}
        className="partner-design-review-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="partner-design-review-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">tune</span>
        <span>Design review</span>
      </button>

      <div
        ref={panelRef}
        id="partner-design-review-panel"
        className="partner-design-review-panel"
        hidden={!open}
      >
        <div className="partner-design-review-heading">
          <div>
            <span>Local preview tools</span>
            <strong>Design review</strong>
          </div>
          <button type="button" onClick={closeAndRestoreFocus} aria-label="Close design review controls">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="partner-design-review-grid">
          <label>
            <span>Hero style</span>
            <select value={preview.heroVisualMode} onChange={(event) => preview.setHeroVisualMode(event.target.value as HeroVisualMode)}>
              <option value="signals">Signal cards</option>
              <option value="marker">Floating marker</option>
              <option value="clean">Neighborhood only</option>
            </select>
          </label>
          <button className="partner-design-review-replay" type="button" onClick={preview.replayHero}>
            <span className="material-symbols-outlined" aria-hidden="true">replay</span>
            Replay hero
          </button>

          <label>
            <span>Copy version</span>
            <select value={preview.copyVariant} onChange={(event) => preview.setCopyVariant(event.target.value as CopyVariant)}>
              <option value="current">Current copy</option>
              <option value="updated">Updated PRD copy</option>
            </select>
          </label>

          <label>
            <span>Pricing rows</span>
            <select value={preview.pricingWidthMode} onChange={(event) => preview.setPricingWidthMode(event.target.value as PricingWidthMode)}>
              <option value="current">Current width</option>
              <option value="narrow">Narrow rows</option>
            </select>
          </label>

          <label>
            <span>Pricing border</span>
            <select value={preview.pricingBorderMode} onChange={(event) => preview.setPricingBorderMode(event.target.value as PricingBorderMode)}>
              <option value="reference">Reference glow</option>
              <option value="balanced">Layered rim</option>
              <option value="specular">Specular path</option>
              <option value="classic">Classic glow</option>
              <option value="dark">Dark reference</option>
            </select>
          </label>

          <label>
            <span>Price unit</span>
            <select value={preview.pricingUnitMode} onChange={(event) => preview.setPricingUnitMode(event.target.value as PricingUnitMode)}>
              <option value="under">Under price</option>
              <option value="side">Side</option>
              <option value="inline">Inline low</option>
            </select>
          </label>

          <label>
            <span>Report backdrop</span>
            <select value={preview.reportBackdropMode} onChange={(event) => preview.setReportBackdropMode(event.target.value as ReportBackdropMode)}>
              <option value="map">Neighborhood map</option>
              <option value="abstract">Abstract signal field</option>
            </select>
          </label>

          <label>
            <span>Screen startup</span>
            <select
              value={preview.screenStartupMode}
              onChange={(event) => {
                preview.setScreenStartupMode(event.target.value as ScreenStartupMode);
                preview.replayReport();
              }}
            >
              <option value="fade">Soft screen fade</option>
              <option value="signal-line">Signal-line boot</option>
              <option value="wipe-down">Downward load</option>
            </select>
          </label>
          <button className="partner-design-review-replay" type="button" onClick={preview.replayReport}>
            <span className="material-symbols-outlined" aria-hidden="true">replay</span>
            Replay entrance
          </button>
        </div>
      </div>
    </aside>
  );
}
