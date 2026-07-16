'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  PartnerDesignReviewContext,
  usePartnerDesignReview,
} from './PartnerDesignReviewContext';
import type {
  CopyVariant,
  HeroVisualMode,
  HowFocusMode,
  HowHotspotPosition,
  HowHotspotPreview,
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
const howHotspotStorageKey = 'partner-how-hotspot-calibration-v1';
const designReviewPositionStorageKey = 'partner-design-review-position-v1';
type DesignReviewPosition = { x: number; y: number };
const defaultHowHotspotPositions: HowHotspotPosition[] = [
  { x: 18.65, y: 26.4, size: 100, perspective: 100, tilt: 1, skew: -8 },
  { x: 44.62, y: 23, size: 100, perspective: 100, tilt: -2, skew: -8 },
  { x: 71.62, y: 24.1, size: 100, perspective: 100, tilt: 2, skew: -8 },
  { x: 92.5, y: 24.35, size: 100, perspective: 100, tilt: -1, skew: -8 },
];

const loadHowHotspotPositions = () => {
  const defaults = defaultHowHotspotPositions.map((position) => ({ ...position }));
  if (!isDevelopment || typeof window === 'undefined') return defaults;

  const savedPositions = window.localStorage.getItem(howHotspotStorageKey);
  if (!savedPositions) return defaults;

  try {
    const parsed = JSON.parse(savedPositions) as HowHotspotPosition[];
    if (parsed.length === 4) {
      const normalized = parsed.map((position, index) => ({
        x: position.x,
        y: position.y,
        size: position.size,
        perspective: Number.isFinite(position.perspective)
          ? position.perspective
          : defaults[index].perspective,
        tilt: Number.isFinite(position.tilt) ? position.tilt : defaults[index].tilt,
        skew: Number.isFinite(position.skew) ? position.skew : defaults[index].skew,
      }));
      if (normalized.every((position) => Object.values(position).every(Number.isFinite))) return normalized;
    }
  } catch {
    window.localStorage.removeItem(howHotspotStorageKey);
  }

  return defaults;
};

const loadDesignReviewPosition = (): DesignReviewPosition => {
  if (!isDevelopment || typeof window === 'undefined') return { x: 0, y: 0 };
  const savedPosition = window.localStorage.getItem(designReviewPositionStorageKey);
  if (!savedPosition) return { x: 0, y: 0 };

  try {
    const parsed = JSON.parse(savedPosition) as DesignReviewPosition;
    if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) return parsed;
  } catch {
    window.localStorage.removeItem(designReviewPositionStorageKey);
  }

  return { x: 0, y: 0 };
};

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
    pricingBody: 'Founding partners help us tune the service by trade and territory. The first three monthly billing cycles are $500 before the ongoing $750/mo standard rate.',
    priceAnchorLabel: 'Premium service value',
    priceDropLabel: 'founding price drops to',
    includedHeading: 'One done-for-you local demand service.',
    applyHeading: 'Apply to protect your trade & territory.',
    applyBody: 'Apply and complete secure $500 checkout. We review your category, service area, and exclusivity immediately, with a full refund if we cannot approve it.',
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
    applyBody: 'Apply and complete secure $500 checkout. We review availability in your area and refund the payment in full if we cannot approve it.',
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
  const [howHotspotPreview, setHowHotspotPreview] = useState<HowHotspotPreview>(0);
  const [howHotspotPositions, setHowHotspotPositions] = useState<HowHotspotPosition[]>(loadHowHotspotPositions);
  const [howFocusMode, setHowFocusMode] = useState<HowFocusMode>('spotlight');

  const replayHero = useCallback(() => setHeroReplayCycle((cycle) => cycle + 1), []);
  const replayReport = useCallback(() => setReportReplayCycle((cycle) => cycle + 1), []);
  const saveHowHotspotPositions = useCallback(() => {
    if (!isDevelopment) return;
    window.localStorage.setItem(howHotspotStorageKey, JSON.stringify(howHotspotPositions));
  }, [howHotspotPositions]);
  const resetHowHotspotPositions = useCallback(() => {
    setHowHotspotPositions(defaultHowHotspotPositions.map((position) => ({ ...position })));
    if (isDevelopment) window.localStorage.removeItem(howHotspotStorageKey);
  }, []);

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

  useEffect(() => {
    if (!isDevelopment) return undefined;
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return undefined;

    howHotspotPositions.forEach((position, index) => {
      const step = index + 1;
      page.style.setProperty(`--partner-hotspot-${step}-x`, `${position.x}%`);
      page.style.setProperty(`--partner-hotspot-${step}-y`, `${position.y}cqw`);
      page.style.setProperty(`--partner-hotspot-${step}-size`, `${position.size / 100}`);
      const ringHeight = 60 * (position.perspective / 100);
      page.style.setProperty(`--partner-hotspot-${step}-ring-height`, `${ringHeight}%`);
      page.style.setProperty(`--partner-hotspot-${step}-ring-top`, `${(100 - ringHeight) / 2}%`);
      page.style.setProperty(`--partner-hotspot-${step}-tilt`, `${position.tilt}deg`);
      page.style.setProperty(`--partner-hotspot-${step}-skew`, `${position.skew}deg`);
    });
    page.dataset.howHotspotPreview = String(howHotspotPreview);

    return () => {
      howHotspotPositions.forEach((_, index) => {
        const step = index + 1;
        page.style.removeProperty(`--partner-hotspot-${step}-x`);
        page.style.removeProperty(`--partner-hotspot-${step}-y`);
        page.style.removeProperty(`--partner-hotspot-${step}-size`);
        page.style.removeProperty(`--partner-hotspot-${step}-ring-height`);
        page.style.removeProperty(`--partner-hotspot-${step}-ring-top`);
        page.style.removeProperty(`--partner-hotspot-${step}-tilt`);
        page.style.removeProperty(`--partner-hotspot-${step}-skew`);
      });
      delete page.dataset.howHotspotPreview;
    };
  }, [howHotspotPositions, howHotspotPreview]);

  useEffect(() => {
    if (!isDevelopment) return undefined;
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return undefined;
    page.classList.toggle('partner-how-focus-spotlight', howFocusMode === 'spotlight');
    return () => page.classList.remove('partner-how-focus-spotlight');
  }, [howFocusMode]);

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
    howHotspotPreview,
    setHowHotspotPreview,
    howHotspotPositions,
    setHowHotspotPositions,
    saveHowHotspotPositions,
    resetHowHotspotPositions,
    howFocusMode,
    setHowFocusMode,
  }), [
    copyVariant,
    heroReplayCycle,
    heroVisualMode,
    howHotspotPositions,
    howHotspotPreview,
    howFocusMode,
    pricingBorderMode,
    pricingUnitMode,
    pricingWidthMode,
    replayHero,
    replayReport,
    reportBackdropMode,
    reportReplayCycle,
    resetHowHotspotPositions,
    saveHowHotspotPositions,
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
  const [drawerPosition, setDrawerPosition] = useState<DesignReviewPosition>(loadDesignReviewPosition);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const drawerPositionRef = useRef(drawerPosition);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    rectLeft: number;
    rectTop: number;
    width: number;
    height: number;
  } | null>(null);
  const preview = usePartnerDesignReview();
  const selectedHotspot = preview.howHotspotPreview > 0
    ? preview.howHotspotPositions[preview.howHotspotPreview - 1]
    : null;

  const updateSelectedHotspot = useCallback((field: keyof HowHotspotPosition, value: number) => {
    if (preview.howHotspotPreview === 0) return;
    preview.setHowHotspotPositions((positions) => positions.map((position, index) => (
      index === preview.howHotspotPreview - 1 ? { ...position, [field]: value } : position
    )));
  }, [preview]);

  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  const updateDrawerPosition = useCallback((position: DesignReviewPosition) => {
    drawerPositionRef.current = position;
    setDrawerPosition(position);
  }, []);

  const handleDragStart = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const drawer = event.currentTarget.closest<HTMLElement>('.partner-design-review');
    if (!drawer) return;
    const rect = drawer.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: drawerPositionRef.current.x,
      originY: drawerPositionRef.current.y,
      rectLeft: rect.left,
      rectTop: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const handleDragMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rawX = drag.originX + event.clientX - drag.startX;
    const rawY = drag.originY + event.clientY - drag.startY;
    const minDeltaX = 8 - drag.rectLeft;
    const maxDeltaX = window.innerWidth - 8 - drag.rectLeft - drag.width;
    const minDeltaY = 8 - drag.rectTop;
    const maxDeltaY = window.innerHeight - 8 - drag.rectTop - drag.height;
    updateDrawerPosition({
      x: drag.originX + Math.min(Math.max(rawX - drag.originX, minDeltaX), maxDeltaX),
      y: drag.originY + Math.min(Math.max(rawY - drag.originY, minDeltaY), maxDeltaY),
    });
  }, [updateDrawerPosition]);

  const handleDragEnd = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    window.localStorage.setItem(designReviewPositionStorageKey, JSON.stringify(drawerPositionRef.current));
  }, []);

  const resetDrawerPosition = useCallback(() => {
    updateDrawerPosition({ x: 0, y: 0 });
    window.localStorage.removeItem(designReviewPositionStorageKey);
  }, [updateDrawerPosition]);

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
    <aside
      className={`partner-design-review${open ? ' is-open' : ''}`}
      aria-label="Design review controls"
      style={{ transform: `translate3d(${drawerPosition.x}px, ${drawerPosition.y}px, 0)` }}
    >
      <div className="partner-design-review-toolbar">
        <button
          className="partner-design-review-drag-handle"
          type="button"
          aria-label="Move design review controls. Double-click to reset position."
          title="Drag to move · double-click to reset"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onDoubleClick={resetDrawerPosition}
        >
          <span className="material-symbols-outlined" aria-hidden="true">drag_indicator</span>
        </button>
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
      </div>

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

          <fieldset className="partner-design-review-calibration">
            <legend>How it works targets</legend>
            <label>
              <span>Focus lighting</span>
              <select
                value={preview.howFocusMode}
                onChange={(event) => preview.setHowFocusMode(event.target.value as HowFocusMode)}
              >
                <option value="spotlight">Dim scene + spotlight</option>
                <option value="off">Radials only</option>
              </select>
            </label>
            <label>
              <span>Visible target</span>
              <select
                value={preview.howHotspotPreview}
                onChange={(event) => preview.setHowHotspotPreview(Number(event.target.value) as HowHotspotPreview)}
              >
                <option value={0}>Off</option>
                <option value={1}>Step 01 · Radar</option>
                <option value={2}>Step 02 · Alert</option>
                <option value={3}>Step 03 · Calls</option>
                <option value={4}>Step 04 · Report</option>
              </select>
            </label>

            {selectedHotspot ? (
              <div className="partner-design-review-sliders">
                <label>
                  <span>X position <output>{selectedHotspot.x.toFixed(2)}%</output></span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={selectedHotspot.x}
                    onChange={(event) => updateSelectedHotspot('x', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Y position <output>{selectedHotspot.y.toFixed(2)}</output></span>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="0.1"
                    value={selectedHotspot.y}
                    onChange={(event) => updateSelectedHotspot('y', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Ring size <output>{selectedHotspot.size}%</output></span>
                  <input
                    type="range"
                    min="60"
                    max="150"
                    step="1"
                    value={selectedHotspot.size}
                    onChange={(event) => updateSelectedHotspot('size', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Perspective <output>{selectedHotspot.perspective}%</output></span>
                  <input
                    type="range"
                    min="45"
                    max="145"
                    step="1"
                    value={selectedHotspot.perspective}
                    onChange={(event) => updateSelectedHotspot('perspective', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Tilt <output>{selectedHotspot.tilt.toFixed(1)}°</output></span>
                  <input
                    type="range"
                    min="-18"
                    max="18"
                    step="0.5"
                    value={selectedHotspot.tilt}
                    onChange={(event) => updateSelectedHotspot('tilt', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Skew <output>{selectedHotspot.skew.toFixed(1)}°</output></span>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="0.5"
                    value={selectedHotspot.skew}
                    onChange={(event) => updateSelectedHotspot('skew', Number(event.target.value))}
                  />
                </label>
              </div>
            ) : (
              <p className="partner-design-review-hint">Choose a step to hold its radial on screen while you align it.</p>
            )}

            <div className="partner-design-review-calibration-actions">
              <button type="button" onClick={preview.saveHowHotspotPositions}>Save locally</button>
              <button type="button" onClick={preview.resetHowHotspotPositions}>Reset</button>
            </div>
          </fieldset>
        </div>
      </div>
    </aside>
  );
}
