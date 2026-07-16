import type { CSSProperties } from 'react';

const words = [
  ['Catch', false],
  ['homeowner', false],
  ['demand', false],
  ['before', true],
  ['your', true],
  ['competitors', true],
  ['do.', true],
] as const;

export function PartnerHeroTitle() {
  return (
    <h1
      aria-label="Catch homeowner demand before your competitors do."
      className="partner-hero-title"
      data-copy-key="heroTitle"
    >
      {words.map(([word, isGreen], index) => (
        <span
          className={`partner-hero-title-word${isGreen ? ' is-green' : ''}`}
          data-word={word}
          key={word}
          style={{ '--word-index': index } as CSSProperties}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}
