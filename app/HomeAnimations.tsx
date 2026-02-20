'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════
   AnimatedSection — Fade + slide in on scroll
   ═══════════════════════════════════════════════════════ */
export function AnimatedSection({ 
  children, 
  delay = 0, 
  direction = 'up' 
}: { 
  children: ReactNode; 
  delay?: number; 
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const transforms: Record<string, string> = {
    up: 'translateY(30px)',
    down: 'translateY(-30px)',
    left: 'translateX(30px)',
    right: 'translateX(-30px)',
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : transforms[direction],
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CountUpNumber — Animated counter on scroll
   ═══════════════════════════════════════════════════════ */
export function CountUpNumber({ 
  end, 
  suffix = '', 
  duration = 1500 
}: { 
  end: number; 
  suffix?: string; 
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════
   TrustScoreRing — Animated circular progress
   ═══════════════════════════════════════════════════════ */
export function TrustScoreRing({ score }: { score: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 300);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg ref={ref} viewBox="0 0 50 50" className="w-full h-full -rotate-90">
        <circle cx="25" cy="25" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
        <circle
          cx="25" cy="25" r={radius}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-black">{score}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   StaggeredGrid — Children animate in one by one
   ═══════════════════════════════════════════════════════ */
export function StaggeredGrid({ 
  children, 
  columns = 2 
}: { 
  children: ReactNode; 
  columns?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gridCols = columns === 4 
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
    : columns === 3 
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2';

  return (
    <div ref={ref} className={`grid ${gridCols} gap-4 md:gap-6`}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
          }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
}
