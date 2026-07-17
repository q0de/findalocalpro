'use client';

import { useEffect, useState } from 'react';

type PricingWidthMode = 'current' | 'narrow';

export function PartnerPricingWidthControl() {
  const [mode, setMode] = useState<PricingWidthMode>('current');

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    page?.classList.toggle('partner-pricing-rows-narrow', mode === 'narrow');

    return () => {
      page?.classList.remove('partner-pricing-rows-narrow');
    };
  }, [mode]);

  return (
    <div className="partner-pricing-width-control" aria-label="Pricing row width">
      <span>Pricing rows</span>
      <select value={mode} onChange={(event) => setMode(event.target.value as PricingWidthMode)} aria-label="Pricing row width">
        <option value="current">Current width</option>
        <option value="narrow">Narrow rows</option>
      </select>
    </div>
  );
}
