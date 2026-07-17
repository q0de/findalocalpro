'use client';

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

const START_PRICE = 1000;
const END_PRICE = 500;
const COUNTDOWN_DELAY_MS = 900;
const DURATION_MS = 860;
const SETTLE_MS = 700;

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function PartnerPriceCounter() {
  const [price, setPrice] = useState(START_PRICE);
  const [isIntroducing, setIsIntroducing] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const isPricingInViewRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      window.clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stopAnimation();
    const pricingBox = buttonRef.current?.closest('.partner-pricing-box');
    pricingBox?.classList.add('is-price-intro', 'is-price-counting');
    pricingBox?.classList.remove('is-price-settled');
    setIsIntroducing(true);
    setIsCounting(false);
    setIsPopping(false);
    setPrice(START_PRICE);

    countdownTimerRef.current = window.setTimeout(() => {
      setIsIntroducing(false);
      setIsCounting(true);
      const start = window.performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        const eased = easeInOutCubic(progress);
        const next = START_PRICE - (START_PRICE - END_PRICE) * eased;
        setPrice(Math.round(next / 5) * 5);

        if (progress < 1) {
          animationRef.current = window.requestAnimationFrame(tick);
          return;
        }

        setPrice(END_PRICE);
        setIsCounting(false);
        setIsPopping(true);
        animationRef.current = null;
        settleTimerRef.current = window.setTimeout(() => {
          setIsPopping(false);
          setIsIntroducing(false);
          setIsCounting(false);
          pricingBox?.classList.remove('is-price-intro', 'is-price-counting');
          pricingBox?.classList.add('is-price-settled');
          settleTimerRef.current = null;
        }, SETTLE_MS);
      };

      animationRef.current = window.requestAnimationFrame(tick);
      countdownTimerRef.current = null;
    }, COUNTDOWN_DELAY_MS);
  }, [stopAnimation]);

  const reset = useCallback(() => {
    stopAnimation();
    const pricingBox = buttonRef.current?.closest('.partner-pricing-box');
    pricingBox?.classList.add('is-price-intro');
    pricingBox?.classList.remove('is-price-counting', 'is-price-settled');
    setIsIntroducing(false);
    setIsCounting(false);
    setIsPopping(false);
    setPrice(START_PRICE);
  }, [stopAnimation]);

  useEffect(() => {
    const button = buttonRef.current;
    const pricingBox = button?.closest('.partner-pricing-box');

    if (!pricingBox) return () => stopAnimation();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.intersectionRatio >= 0.32 && !isPricingInViewRef.current) {
          isPricingInViewRef.current = true;
          play();
          return;
        }

        if (entry.intersectionRatio <= 0.08 && isPricingInViewRef.current) {
          isPricingInViewRef.current = false;
          reset();
        }
      },
      { rootMargin: '0px 0px -14% 0px', threshold: [0.08, 0.32] },
    );

    observer.observe(pricingBox);

    return () => {
      observer.disconnect();
      pricingBox.classList.remove('is-price-counting', 'is-price-settled');
      stopAnimation();
    };
  }, [play, reset, stopAnimation]);

  const countdownProgress = (START_PRICE - price) / (START_PRICE - END_PRICE);
  const countdownScaleX = 1 + (1 - countdownProgress) * 0.3;
  const countdownScaleY = countdownProgress < 0.75
    ? 1.22 - (countdownProgress / 0.75) * 0.3
    : 0.92 + ((countdownProgress - 0.75) / 0.25) * 0.08;
  const countdownStyle = {
    '--partner-price-scale-x': countdownScaleX.toFixed(3),
    '--partner-price-scale-y': countdownScaleY.toFixed(3),
  } as CSSProperties;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`partner-price-count${isIntroducing ? ' is-introducing' : ''}${isCounting ? ' is-counting' : ''}${isPopping ? ' is-popping' : ''}`}
      style={countdownStyle}
      aria-label="Replay founding price countdown to $500"
      onClick={play}
    >
      ${price.toLocaleString('en-US')}
    </button>
  );
}
