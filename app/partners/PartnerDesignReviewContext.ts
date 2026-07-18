'use client';

import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type HeroVisualMode = 'signals' | 'marker' | 'clean';
export type CopyVariant = 'current' | 'updated';
export type PricingWidthMode = 'current' | 'narrow';
export type PricingBorderMode = 'classic' | 'balanced' | 'specular' | 'dark' | 'reference';
export type PricingUnitMode = 'under' | 'side' | 'inline';
export type ReportBackdropMode = 'map' | 'abstract';
export type ScreenStartupMode = 'signal-line' | 'wipe-down' | 'fade';
export type HowHotspotPreview = 0 | 1 | 2 | 3 | 4;
export type HowFocusMode = 'off' | 'spotlight';
export type HowIllustrationMode = 'integrated' | 'layered';
export type HowHotspotPosition = {
  x: number;
  y: number;
  size: number;
  perspective: number;
  tilt: number;
  skew: number;
};

export type PartnerDesignReviewValue = {
  heroVisualMode: HeroVisualMode;
  setHeroVisualMode: Dispatch<SetStateAction<HeroVisualMode>>;
  heroReplayCycle: number;
  replayHero: () => void;
  copyVariant: CopyVariant;
  setCopyVariant: Dispatch<SetStateAction<CopyVariant>>;
  pricingWidthMode: PricingWidthMode;
  setPricingWidthMode: Dispatch<SetStateAction<PricingWidthMode>>;
  pricingBorderMode: PricingBorderMode;
  setPricingBorderMode: Dispatch<SetStateAction<PricingBorderMode>>;
  pricingUnitMode: PricingUnitMode;
  setPricingUnitMode: Dispatch<SetStateAction<PricingUnitMode>>;
  reportBackdropMode: ReportBackdropMode;
  setReportBackdropMode: Dispatch<SetStateAction<ReportBackdropMode>>;
  screenStartupMode: ScreenStartupMode;
  setScreenStartupMode: Dispatch<SetStateAction<ScreenStartupMode>>;
  reportReplayCycle: number;
  replayReport: () => void;
  howHotspotPreview: HowHotspotPreview;
  setHowHotspotPreview: Dispatch<SetStateAction<HowHotspotPreview>>;
  howHotspotPositions: HowHotspotPosition[];
  setHowHotspotPositions: Dispatch<SetStateAction<HowHotspotPosition[]>>;
  saveHowHotspotPositions: () => void;
  resetHowHotspotPositions: () => void;
  howFocusMode: HowFocusMode;
  setHowFocusMode: Dispatch<SetStateAction<HowFocusMode>>;
  howIllustrationMode: HowIllustrationMode;
  setHowIllustrationMode: Dispatch<SetStateAction<HowIllustrationMode>>;
};

export const PartnerDesignReviewContext = createContext<PartnerDesignReviewValue | null>(null);

export function usePartnerDesignReview() {
  const context = useContext(PartnerDesignReviewContext);
  if (!context) throw new Error('usePartnerDesignReview must be used within PartnerDesignReviewProvider');
  return context;
}
