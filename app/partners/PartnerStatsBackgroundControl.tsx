'use client';

import { useEffect, useState } from 'react';

type StatsBackground = 'signal' | 'current' | 'custom';

const statsBackgrounds: Record<StatsBackground, string> = {
  signal: '#07111d',
  current: '#040d1e',
  custom: '#07111d',
};

type PartnerStatsBackgroundControlProps = {
  placement?: 'hero' | 'inline';
};

export function PartnerStatsBackgroundControl({ placement = 'hero' }: PartnerStatsBackgroundControlProps) {
  const [background, setBackground] = useState<StatsBackground>('signal');
  const [customColor, setCustomColor] = useState(statsBackgrounds.signal);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    page?.style.setProperty('--partner-stats-bg', background === 'custom' ? customColor : statsBackgrounds[background]);

    return () => {
      page?.style.removeProperty('--partner-stats-bg');
    };
  }, [background, customColor]);

  function handlePresetChange(value: StatsBackground) {
    setBackground(value);

    if (value !== 'custom') {
      setCustomColor(statsBackgrounds[value]);
    }
  }

  return (
    <div className={`partner-stats-bg-control partner-stats-bg-control--${placement}`} aria-label="Recent week background">
      <span>Recent week bg</span>
      <select value={background} onChange={(event) => handlePresetChange(event.target.value as StatsBackground)} aria-label="Recent week background preset">
        <option value="signal">Selected blue</option>
        <option value="current">Current dark navy</option>
        <option value="custom">Custom</option>
      </select>
      <label className="partner-stats-bg-picker" aria-label="Choose recent week background color">
        <input
          type="color"
          value={customColor}
          onChange={(event) => {
            setCustomColor(event.target.value);
            setBackground('custom');
          }}
          aria-label="Choose recent week background color"
        />
      </label>
    </div>
  );
}
