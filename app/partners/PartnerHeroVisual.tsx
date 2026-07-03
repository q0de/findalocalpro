'use client';

import { useEffect, useState } from 'react';

type HeroVisualMode = 'signals' | 'marker' | 'clean';

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

export function PartnerHeroVisual() {
  const [mode, setMode] = useState<HeroVisualMode>('signals');
  const [pinReady, setPinReady] = useState(false);
  const [iconReady, setIconReady] = useState(false);
  const [pinSettled, setPinSettled] = useState(false);
  const [iconSettled, setIconSettled] = useState(false);
  const [activeServiceIcon, setActiveServiceIcon] = useState(0);
  const [exitingServiceIcon, setExitingServiceIcon] = useState<number | null>(null);

  useEffect(() => {
    const getHero = () => document.querySelector('.partner-standalone-hero');
    const getNeighborhood = () => getHero()?.querySelector<HTMLElement>('.partner-neighborhood-bg');
    const setNeighborhoodFinal = (priority: '' | 'important' = '') => {
      const neighborhood = getNeighborhood();
      neighborhood?.style.setProperty('opacity', '1', priority);
      neighborhood?.style.setProperty('clip-path', 'ellipse(112% 92% at 70% 58%)', priority);
      neighborhood?.style.setProperty('filter', 'saturate(1) brightness(1) blur(0)', priority);
      neighborhood?.style.setProperty('transform', 'scale(1) translate3d(0, 0, 0)', priority);
    };
    const neighborhoodTimer = window.setTimeout(() => {
      const hero = getHero();
      hero?.classList.add('is-neighborhood-ready');
    }, 140);
    const neighborhoodSettledTimer = window.setTimeout(() => {
      const hero = getHero();
      hero?.classList.add('is-neighborhood-settled');
      setNeighborhoodFinal('important');
    }, 2450);
    const pinTimer = window.setTimeout(() => setPinReady(true), 2200);
    const iconTimer = window.setTimeout(() => setIconReady(true), 2580);
    const pinSettledTimer = window.setTimeout(() => setPinSettled(true), 2920);
    const iconSettledTimer = window.setTimeout(() => setIconSettled(true), 3120);

    return () => {
      const hero = getHero();
      const neighborhood = getNeighborhood();
      hero?.classList.remove('is-neighborhood-ready', 'is-neighborhood-settled');
      neighborhood?.removeAttribute('style');
      window.clearTimeout(neighborhoodTimer);
      window.clearTimeout(neighborhoodSettledTimer);
      window.clearTimeout(pinTimer);
      window.clearTimeout(iconTimer);
      window.clearTimeout(pinSettledTimer);
      window.clearTimeout(iconSettledTimer);
    };
  }, []);

  useEffect(() => {
    if (!iconReady) return undefined;

    let nextIcon = 1;
    let iconInterval: number | undefined;
    let exitTimer: number | undefined;

    const swapIcon = () => {
      const targetIcon = nextIcon;
      setActiveServiceIcon((currentIcon) => {
        setExitingServiceIcon(currentIcon);
        window.clearTimeout(exitTimer);
        exitTimer = window.setTimeout(() => setExitingServiceIcon(null), 620);
        return targetIcon;
      });
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
  }, [iconReady]);

  return (
    <>
      <div className="partner-hero-style-control" aria-label="Hero style">
        <span>Hero style</span>
        <select value={mode} onChange={(event) => setMode(event.target.value as HeroVisualMode)} aria-label="Hero style">
          <option value="signals">Signal cards</option>
          <option value="marker">Floating marker</option>
          <option value="clean">Neighborhood only</option>
        </select>
      </div>

      <div
        className={`partner-hero-visual is-${mode}${pinReady ? ' is-pin-ready' : ''}${iconReady ? ' is-icon-ready' : ''}${pinSettled ? ' is-pin-settled' : ''}${iconSettled ? ' is-icon-settled' : ''}`}
        aria-hidden="true"
      >
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
      </div>
    </>
  );
}
