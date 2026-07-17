'use client';

import { useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

type FlowItem = {
  number: string;
  icon: string;
  kicker: string;
  title: string;
  body: string;
};

type ActiveStep = 0 | 1 | 2 | 3 | 4;

export function PartnerHowStage({ flow }: { flow: FlowItem[] }) {
  const [activeStep, setActiveStep] = useState<ActiveStep>(0);

  const toggleStep = (step: ActiveStep) => {
    setActiveStep((current) => current === step ? 0 : step);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, step: ActiveStep) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleStep(step);
    } else if (event.key === 'Escape') {
      setActiveStep(0);
    }
  };

  return (
    <div className="partner-how-stage" data-how-active-step={activeStep || undefined}>
      <div className="partner-how-illustration" aria-hidden="true" />
      <div className="partner-how-focus-shade" aria-hidden="true" />
      <div className="partner-how-hotspots" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="partner-flow-grid">
        {flow.map(({ number, icon, kicker, title, body }, index) => {
          const step = (index + 1) as ActiveStep;
          const isActive = activeStep === step;
          return (
            <article
              key={title}
              className={isActive ? 'is-touch-active' : undefined}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`${number}. ${title}`}
              onClick={() => toggleStep(step)}
              onKeyDown={(event) => handleKeyDown(event, step)}
              style={{ '--partner-flow-index': index } as CSSProperties}
            >
              <div className="partner-flow-card-top">
                <span>{number}</span>
                <i className="material-symbols-outlined" aria-hidden="true">{icon}</i>
              </div>
              <small>{kicker}</small>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          );
        })}
      </div>
      <p className="partner-how-stage-note">
        <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
        One connected loop — from signal found to action taken.
      </p>
    </div>
  );
}
