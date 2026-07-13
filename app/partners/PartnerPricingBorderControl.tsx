'use client';

import { useEffect, useState } from 'react';

type PricingBorderMode = 'classic' | 'balanced' | 'specular' | 'dark';

const borderClasses: Record<PricingBorderMode, string> = {
  classic: 'partner-pricing-border-classic',
  balanced: 'partner-pricing-border-balanced',
  specular: 'partner-pricing-border-specular',
  dark: 'partner-pricing-border-dark',
};

type ClassicKnob = {
  label: string;
  max: number;
  min: number;
  property: string;
  step: number;
  value: number;
};

const classicKnobs: ClassicKnob[] = [
  { label: 'Corner', property: '--classic-corner-hot', min: 0.25, max: 1.2, step: 0.05, value: 0.95 },
  { label: 'Size', property: '--classic-corner-w', min: 260, max: 780, step: 10, value: 520 },
  { label: 'Left rim', property: '--classic-left-rim', min: 0.05, max: 0.7, step: 0.05, value: 0.36 },
  { label: 'Edge', property: '--classic-edge', min: 0.14, max: 0.7, step: 0.02, value: 0.44 },
  { label: 'Bloom', property: '--classic-bloom-alpha', min: 0.05, max: 0.75, step: 0.05, value: 0.45 },
  { label: 'Blur', property: '--classic-bloom-blur', min: 2, max: 22, step: 1, value: 10 },
];

export function PartnerPricingBorderControl() {
  const [mode, setMode] = useState<PricingBorderMode>('balanced');
  const [classicValues, setClassicValues] = useState(() => Object.fromEntries(classicKnobs.map((knob) => [knob.property, knob.value])));

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return;

    Object.values(borderClasses).forEach((className) => page.classList.remove(className));
    page.classList.add(borderClasses[mode]);

    return () => {
      Object.values(borderClasses).forEach((className) => page.classList.remove(className));
    };
  }, [mode]);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return;

    Object.entries(classicValues).forEach(([property, value]) => {
      page.style.setProperty(property, String(value));
    });

    return () => {
      classicKnobs.forEach((knob) => page.style.removeProperty(knob.property));
    };
  }, [classicValues]);

  function updateClassicValue(property: string, value: number) {
    setMode('classic');
    setClassicValues((current) => ({ ...current, [property]: value }));
  }

  return (
    <div className="partner-pricing-border-control" aria-label="Pricing border controls">
      <div className="partner-pricing-border-row">
        <span>Pricing border</span>
        <select value={mode} onChange={(event) => setMode(event.target.value as PricingBorderMode)} aria-label="Pricing border style">
          <option value="balanced">Layered rim</option>
          <option value="specular">Specular path</option>
          <option value="classic">Classic glow</option>
          <option value="dark">Dark reference</option>
        </select>
      </div>
      <div className="partner-pricing-classic-controls" aria-label="Classic glow tuning">
        {classicKnobs.map((knob) => (
          <label key={knob.property}>
            <span>{knob.label}</span>
            <input
              type="range"
              min={knob.min}
              max={knob.max}
              step={knob.step}
              value={classicValues[knob.property]}
              onChange={(event) => updateClassicValue(knob.property, Number(event.target.value))}
            />
            <output>{classicValues[knob.property]}</output>
          </label>
        ))}
      </div>
    </div>
  );
}
