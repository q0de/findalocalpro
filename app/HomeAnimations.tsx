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
export function TrustScoreRing({ score, light = false }: { score: number; light?: boolean }) {
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
        <circle cx="25" cy="25" r={radius} fill="none" stroke={light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)'} strokeWidth="4" />
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
        <span className={`text-xs font-black ${light ? 'text-slate-800' : 'text-white'}`}>{score}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FloatingCard — Gentle float + 3D mouse-tracking tilt
   ═══════════════════════════════════════════════════════ */
export function FloatingCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 }); // max ±6deg
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: '800px',
      }}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
          animation: 'floatBob 4s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes floatBob {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -8px; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HeroAnimatedHeadline — Text animates in, paperwork gets
   yellow highlight → purple → green checkmark pops
   ═══════════════════════════════════════════════════════ */
export function HeroAnimatedHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  // 0=hidden, 1=text animating in, 2=yellow highlight sweeps, 3=turns purple, 4=green check pops

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase(1);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase === 0) return;
    const timers = [
      // phase 1 starts immediately (text fade in)
      // phase 2: yellow highlight sweeps after text is in
      setTimeout(() => setPhase(2), 800),
      // phase 3: yellow → purple
      setTimeout(() => setPhase(3), 1500),
      // phase 4: green check pops
      setTimeout(() => setPhase(4), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase >= 1]);

  const wordDelay = (i: number) => `${i * 120}ms`;

  // Highlight color transitions: transparent → yellow → purple
  const highlightColor =
    phase >= 3 ? 'rgba(139, 92, 246, 0.35)' :
    phase >= 2 ? 'rgba(250, 204, 21, 0.6)' :
    'rgba(250, 204, 21, 0)';

  // Highlight width: 0 → 100%
  const highlightWidth = phase >= 2 ? '100%' : '0%';

  // Paperwork text color: purple when highlight is purple
  const paperworkColor = phase >= 3 ? '#7c3aed' : '#7c3aed';

  return (
    <div ref={ref}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
        {/* Line 1: "We Checked Their" */}
        {['We', 'Checked', 'Their'].map((word, i) => (
          <span
            key={word}
            style={{
              display: 'inline-block',
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(i)}, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(i)}`,
              marginRight: '0.3em',
            }}
          >
            {word}
          </span>
        ))}
        <br />

        {/* Line 2: "Paperwork." with animated highlight + checkmark */}
        <span
          style={{
            display: 'inline-block',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(3)}, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(3)}`,
          }}
        >
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: paperworkColor }}>
              Paperwork.
            </span>
            {/* Animated highlight bar */}
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '0.05em',
                height: '0.35em',
                width: highlightWidth,
                backgroundColor: highlightColor,
                zIndex: 0,
                borderRadius: '2px',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease',
              }}
            />
          </span>
        </span>

        {' '}

        {/* Green checkmark — pops in */}
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.6em',
            verticalAlign: 'middle',
            color: '#10b981',
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'scale(1)' : 'scale(0)',
            transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          ✓
        </span>

        <br />

        {/* Line 3: "You Pick Your Pro." */}
        {['You', 'Pick', 'Your', 'Pro.'].map((word, i) => (
          <span
            key={word}
            style={{
              display: 'inline-block',
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(i + 4)}, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay(i + 4)}`,
              marginRight: '0.3em',
            }}
          >
            {word}
          </span>
        ))}
      </h1>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HeroCTAButtons — Animated entrance + dopamine hover/click
   ═══════════════════════════════════════════════════════ */
export function HeroCTAButtons({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay entrance until after headline animation finishes (~2.5s)
          setTimeout(() => setVisible(true), 2400);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
      <style>{`
        .hero-cta-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease;
        }
        .hero-cta-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 16px 40px rgba(124, 58, 237, 0.35),
                      0 0 0 0 rgba(124, 58, 237, 0);
        }
        .hero-cta-primary:active {
          transform: translateY(0) scale(0.97);
          transition-duration: 0.1s;
        }
        .hero-cta-primary::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .hero-cta-primary:hover::before {
          opacity: 1;
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2); }
          50% { box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4); }
        }
        .hero-cta-glow {
          animation: ctaGlow 2.5s ease-in-out infinite;
          animation-delay: 3s;
        }
        .hero-cta-secondary {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease,
                      border-color 0.2s ease;
        }
        .hero-cta-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
          border-color: #7c3aed;
        }
        .hero-cta-secondary:active {
          transform: translateY(0) scale(0.97);
          transition-duration: 0.1s;
        }
        .hero-cta-secondary .phone-ring {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .hero-cta-secondary:hover .phone-ring {
          animation: phoneRing 0.5s ease;
        }
        @keyframes phoneRing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(10deg); }
          80% { transform: rotate(-5deg); }
        }
      `}</style>
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
    ? 'grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4' 
    : columns === 3 
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2';

  return (
    <div ref={ref} className={`grid ${gridCols} gap-3 sm:gap-4 md:gap-6`}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
          }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
}
