'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

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
              style={{ '--partner-flow-index': index } as CSSProperties}
            >
              <button
                type="button"
                className="partner-flow-card-button"
                aria-pressed={isActive}
                onClick={() => toggleStep(step)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setActiveStep(0);
                }}
              >
                <span className="partner-flow-card-top">
                  <span>{number}</span>
                  <i className="material-symbols-outlined" aria-hidden="true">{icon}</i>
                </span>
                <span className="partner-flow-kicker">{kicker}</span>
                <span className="partner-flow-title">{title}</span>
                <span className="partner-flow-body">{body}</span>
              </button>
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
