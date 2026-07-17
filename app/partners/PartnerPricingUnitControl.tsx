'use client';

import { useEffect, useState } from 'react';

type PricingUnitMode = 'under' | 'side' | 'inline';

const unitClasses: Record<PricingUnitMode, string> = {
  under: 'partner-pricing-unit-under',
  side: 'partner-pricing-unit-side',
  inline: 'partner-pricing-unit-inline',
};

export function PartnerPricingUnitControl() {
  const [mode, setMode] = useState<PricingUnitMode>('under');

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return;

    Object.values(unitClasses).forEach((className) => page.classList.remove(className));
    page.classList.add(unitClasses[mode]);

    return () => {
      Object.values(unitClasses).forEach((className) => page.classList.remove(className));
    };
  }, [mode]);

  return (
    <div className="partner-pricing-unit-control" aria-label="Price unit placement">
      <span>Price unit</span>
      <select value={mode} onChange={(event) => setMode(event.target.value as PricingUnitMode)} aria-label="Price unit placement">
        <option value="under">Under price</option>
        <option value="side">Side</option>
        <option value="inline">Inline low</option>
      </select>
    </div>
  );
}
