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

const deferredMediaSelectors = [
  '.partner-economics-section',
  '.partner-how-section',
  '.partner-report-section',
  '.partner-pricing-section',
];

export function PartnerScrollAnimator() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(deferredMediaSelectors.join(',')));
    if (!sections.length) return undefined;

    const markReady = (section: HTMLElement) => section.classList.add('is-media-ready');

    if (!('IntersectionObserver' in window)) {
      sections.forEach(markReady);
      return () => sections.forEach((section) => section.classList.remove('is-media-ready'));
    }

    const mediaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markReady(entry.target as HTMLElement);
          mediaObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: '240px 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => mediaObserver.observe(section));

    return () => {
      mediaObserver.disconnect();
      sections.forEach((section) => section.classList.remove('is-media-ready'));
    };
  }, []);

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

    const revealVisibleElements = () => {
      const revealLine = window.innerHeight * 0.88;

      elements.forEach((element) => {
        if (element.classList.contains('is-visible')) return;

        const rect = element.getBoundingClientRect();
        if (rect.top < revealLine && rect.bottom > window.innerHeight * 0.08) {
          element.classList.add('is-visible');
        }
      });
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
    const initialFrame = window.requestAnimationFrame(revealVisibleElements);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      page.classList.remove('is-reveal-ready', 'is-reveal-reduced');
      elements.forEach((element) => {
        element.classList.remove('partner-reveal', 'is-visible');
        element.style.removeProperty('--reveal-index');
      });
    };
  }, []);

  return null;
}
