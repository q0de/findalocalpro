'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { usePartnerDesignReview } from './PartnerDesignReviewContext';

type HeroIntroPhase = 'background' | 'targeting' | 'entering' | 'landed' | 'signals' | 'settled';

const heroPhaseOrder: Record<HeroIntroPhase, number> = {
  background: 0,
  targeting: 1,
  entering: 2,
  landed: 3,
  signals: 4,
  settled: 5,
};

const signalCards = [
  {
    className: 'is-nextdoor',
    icon: 'n',
    title: 'Nextdoor',
    body: 'New post in Oakwood',
    quote: '"Anyone know a good plumber?"',
    time: '2m ago',
  },
  {
    className: 'is-search',
    icon: 'G',
    title: 'Search Signal',
    body: '"emergency HVAC"',
    quote: 'repair near me',
    time: '8m ago',
  },
  {
    className: 'is-facebook',
    icon: 'f',
    title: 'Facebook Group',
    body: 'Looking for reliable',
    quote: 'electrician ASAP!',
    time: '15m ago',
  },
  {
    className: 'is-review',
    icon: '★',
    title: 'New Review',
    body: 'Terrible service from',
    quote: 'my last contractor.',
    time: '1h ago',
  },
  {
    className: 'is-call',
    icon: '☎',
    title: 'Tracked Call',
    body: 'Call from',
    quote: '571-555-0134',
    time: '25m ago',
  },
  {
    className: 'is-mention',
    icon: '◢',
    title: 'Competitor Mention',
    body: 'ABC Plumbing',
    quote: 'recommended again',
    time: '1h ago',
  },
];

const serviceIcons = ['home', 'plumbing', 'mode_fan', 'electric_bolt', 'handyman'];
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const subscribeToReducedMotion = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};

const getReducedMotionSnapshot = () => window.matchMedia(reducedMotionQuery).matches;
const getReducedMotionServerSnapshot = () => false;

export function PartnerHeroVisual() {
  const { heroVisualMode, heroReplayCycle } = usePartnerDesignReview();
  const [introPhase, setIntroPhase] = useState<HeroIntroPhase>('background');
  const [activeServiceIcon, setActiveServiceIcon] = useState(0);
  const [exitingServiceIcon, setExitingServiceIcon] = useState<number | null>(null);
  const activeServiceIconRef = useRef(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const markerIsVisible = heroVisualMode !== 'clean';
  const phaseIsAtLeast = (phase: HeroIntroPhase) => (
    markerIsVisible && heroPhaseOrder[introPhase] >= heroPhaseOrder[phase]
  );
  const pinReady = phaseIsAtLeast('entering');
  const pinSettled = phaseIsAtLeast('landed');
  const iconReady = phaseIsAtLeast('landed');
  const iconSettled = phaseIsAtLeast('signals');
  const signalsReady = phaseIsAtLeast('signals');

  useEffect(() => {
    const hero = document.querySelector('.partner-standalone-hero');
    const neighborhood = hero?.querySelector<HTMLElement>('.partner-neighborhood-bg');
    let timelineActive = true;
    let timers: number[] = [];

    const setNeighborhoodFinal = (priority: '' | 'important' = '') => {
      neighborhood?.style.setProperty('opacity', '1', priority);
      neighborhood?.style.setProperty('clip-path', 'ellipse(112% 92% at 70% 58%)', priority);
      neighborhood?.style.setProperty('filter', 'saturate(1) brightness(1) blur(0)', priority);
      neighborhood?.style.setProperty('transform', 'scale(1) translate3d(0, 0, 0)', priority);
    };

    const resetNeighborhood = () => {
      hero?.classList.remove('is-neighborhood-ready', 'is-neighborhood-settled');
      neighborhood?.style.removeProperty('opacity');
      neighborhood?.style.removeProperty('clip-path');
      neighborhood?.style.removeProperty('filter');
      neighborhood?.style.removeProperty('transform');
    };

    const clearTimeline = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [];
    };

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (timelineActive) callback();
      }, delay);
      timers.push(timer);
    };

    const resetIntro = () => {
      clearTimeline();
      resetNeighborhood();
      setIntroPhase('background');
      setActiveServiceIcon(0);
      activeServiceIconRef.current = 0;
      setExitingServiceIcon(null);
    };

    const settleImmediately = () => {
      hero?.classList.add('is-neighborhood-ready', 'is-neighborhood-settled');
      setNeighborhoodFinal('important');
      setIntroPhase('settled');
    };

    const startTimeline = () => {
      resetIntro();

      if (!markerIsVisible || reducedMotion) {
        settleImmediately();
        return;
      }

      hero?.classList.add('is-neighborhood-ready');
      schedule(() => setIntroPhase('targeting'), 700);
      schedule(() => setIntroPhase('entering'), 1100);
      schedule(() => setIntroPhase('landed'), 1950);
      schedule(() => setIntroPhase('signals'), 2300);
      schedule(() => {
        hero?.classList.add('is-neighborhood-settled');
        setNeighborhoodFinal('important');
      }, 2450);
      schedule(() => {
        setNeighborhoodFinal('important');
        setIntroPhase('settled');
      }, 3150);
    };

    startTimeline();

    return () => {
      timelineActive = false;
      clearTimeline();
      resetNeighborhood();
    };
  }, [heroReplayCycle, heroVisualMode, markerIsVisible, reducedMotion]);

  useEffect(() => {
    if (!iconReady || reducedMotion) return undefined;

    let nextIcon = 1;
    let iconInterval: number | undefined;
    let exitTimer: number | undefined;

    const swapIcon = () => {
      const targetIcon = nextIcon;
      setExitingServiceIcon(activeServiceIconRef.current);
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(() => setExitingServiceIcon(null), 620);
      activeServiceIconRef.current = targetIcon;
      setActiveServiceIcon(targetIcon);
      nextIcon = (nextIcon + 1) % serviceIcons.length;
    };

    const firstSwap = window.setTimeout(() => {
      swapIcon();
      iconInterval = window.setInterval(() => {
        swapIcon();
      }, 2200);
    }, 2200);

    return () => {
      window.clearTimeout(firstSwap);
      window.clearTimeout(exitTimer);
      if (iconInterval) window.clearInterval(iconInterval);
    };
  }, [iconReady, reducedMotion]);

  const visualClasses = [
    'partner-hero-visual',
    `is-${heroVisualMode}`,
    `is-phase-${introPhase}`,
    pinReady && 'is-pin-ready',
    pinSettled && 'is-pin-settled',
    iconReady && 'is-icon-ready',
    iconSettled && 'is-icon-settled',
    signalsReady && 'is-signals-ready',
  ].filter(Boolean).join(' ');

  return (
    <div className={visualClasses} aria-hidden="true">
      <span className="partner-map-reveal-glow" />

      <span className="partner-signal-hub">
        <span />
        <span />
        <span />
      </span>

      <svg className="partner-signal-connectors" viewBox="0 0 720 500" focusable="false">
        <path className="partner-signal-route is-route-nextdoor" d="M410 260 C388 178 348 104 308 78" />
        <path className="partner-signal-route is-route-search" d="M410 260 C442 178 494 106 594 84" />
        <path className="partner-signal-route is-route-facebook" d="M410 260 C362 238 322 230 286 244" />
        <path className="partner-signal-route is-route-review" d="M410 260 C452 236 504 232 608 248" />
        <path className="partner-signal-route is-route-call" d="M410 260 C382 330 346 394 310 426" />
        <path className="partner-signal-route is-route-mention" d="M410 260 C444 334 494 394 590 424" />
      </svg>

      <div className="partner-signal-cards">
        {signalCards.map((card) => (
          <span className={`partner-signal-card ${card.className}`} key={card.title}>
            <span className="partner-signal-icon">{card.icon}</span>
            <span className="partner-signal-copy">
              <b>{card.title}</b>
              <span>{card.body}</span>
              <strong>{card.quote}</strong>
              <small>{card.time}</small>
            </span>
            <i />
          </span>
        ))}
      </div>

      <span className="partner-marker-target">
        <span />
        <span />
      </span>

      <span className="partner-marker-impact">
        <span />
        <span />
      </span>

      <span className="partner-map-pin-stage">
        <span className="partner-map-pin-float">
          <span className="partner-map-pin">
            <span className="partner-map-pin-body">
              <span className="partner-map-pin-face">
                <span className="partner-marker-icon-stack">
                  {serviceIcons.map((icon, index) => (
                    <span
                      className={`partner-marker-icon material-symbols-outlined${index === activeServiceIcon ? ' is-active' : ''}${index === exitingServiceIcon ? ' is-exiting' : ''}`}
                      key={icon}
                    >
                      {icon}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
