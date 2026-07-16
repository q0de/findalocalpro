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
};

export const PartnerDesignReviewContext = createContext<PartnerDesignReviewValue | null>(null);

export function usePartnerDesignReview() {
  const context = useContext(PartnerDesignReviewContext);
  if (!context) throw new Error('usePartnerDesignReview must be used within PartnerDesignReviewProvider');
  return context;
}
