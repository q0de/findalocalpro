'use client';

import { useEffect, useState } from 'react';

type PricingBorderMode = 'classic' | 'balanced' | 'specular' | 'dark' | 'reference';

const borderClasses: Record<PricingBorderMode, string> = {
  classic: 'partner-pricing-border-classic',
  balanced: 'partner-pricing-border-balanced',
  specular: 'partner-pricing-border-specular',
  dark: 'partner-pricing-border-dark',
  reference: 'partner-pricing-border-reference',
};

export function PartnerPricingBorderControl() {
  const [mode, setMode] = useState<PricingBorderMode>('reference');

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return;

    Object.values(borderClasses).forEach((className) => page.classList.remove(className));
    page.classList.add(borderClasses[mode]);

    return () => {
      Object.values(borderClasses).forEach((className) => page.classList.remove(className));
    };
  }, [mode]);

  return (
    <div className="partner-pricing-border-control" aria-label="Pricing border controls">
      <div className="partner-pricing-border-row">
        <span>Pricing border</span>
        <select value={mode} onChange={(event) => setMode(event.target.value as PricingBorderMode)} aria-label="Pricing border style">
          <option value="balanced">Layered rim</option>
          <option value="specular">Specular path</option>
          <option value="classic">Classic glow</option>
          <option value="dark">Dark reference</option>
          <option value="reference">Reference glow</option>
        </select>
      </div>
    </div>
  );
}
