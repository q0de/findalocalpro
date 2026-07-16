'use client';

import { useEffect } from 'react';

const revealSelectors = [
  '.partner-stats-heading',
  '.partner-stats-grid > article',
  '.partner-section:not(.partner-report-section) > .partner-shell',
  '.partner-section-heading',
  '.partner-economics-grid > article',
  '.partner-flow-grid > article',
  '.partner-report-section .partner-sticky-copy',
  '.partner-pricing-section .partner-split > div:first-child',
  '.partner-pricing-box',
  '.partner-included',
  '.partner-included-grid > article',
  '.partner-apply-grid > div:first-child',
  '.partner-form-shell',
  '.partner-faq-list > details',
  '.partner-final-cta',
];

export function PartnerScrollAnimator() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.partner-standalone');
    if (!page) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      page.classList.add('is-reveal-ready', 'is-reveal-reduced');
      return undefined;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(',')));

    elements.forEach((element, index) => {
      element.classList.add('partner-reveal');
      element.style.setProperty('--reveal-index', String(index % 6));
    });

    page.classList.add('is-reveal-ready');

    let revealTimer = 0;
    let revealInterval = 0;
    const revealVisibleElements = () => {
      revealTimer = 0;
      const revealLine = window.innerHeight * 0.88;
      let visibleCount = 0;

      elements.forEach((element) => {
        if (element.classList.contains('is-visible')) {
          visibleCount += 1;
          return;
        }

        const rect = element.getBoundingClientRect();
        if (rect.top < revealLine && rect.bottom > window.innerHeight * 0.08) {
          element.classList.add('is-visible');
          visibleCount += 1;
        }
      });

      if (visibleCount >= elements.length && revealInterval) {
        window.clearInterval(revealInterval);
        revealInterval = 0;
      }
    };

    const scheduleRevealCheck = () => {
      if (revealTimer) return;
      revealTimer = window.setTimeout(revealVisibleElements, 40);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14,
      },
    );

    elements.forEach((element) => observer.observe(element));
    window.addEventListener('scroll', scheduleRevealCheck, { passive: true });
    window.addEventListener('resize', scheduleRevealCheck);
    window.setTimeout(revealVisibleElements, 80);
    revealInterval = window.setInterval(revealVisibleElements, 300);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearInterval(revealInterval);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleRevealCheck);
      window.removeEventListener('resize', scheduleRevealCheck);
      page.classList.remove('is-reveal-ready', 'is-reveal-reduced');
      elements.forEach((element) => {
        element.classList.remove('partner-reveal', 'is-visible');
        element.style.removeProperty('--reveal-index');
      });
    };
  }, []);

  return null;
}
