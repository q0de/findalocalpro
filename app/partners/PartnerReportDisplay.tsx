'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Image from 'next/image';
import { usePartnerDesignReview } from './PartnerDesignReviewContext';

type ReportDisplayMode = 'report' | 'iphone';
type DeviceDisplayMode = Exclude<ReportDisplayMode, 'report'>;

type Point = readonly [number, number];
type StagePhase = 'pending' | 'introducing' | 'settled';

const reportPreviewModes: readonly {
  value: ReportDisplayMode;
  label: string;
  icon: 'description' | 'smartphone';
}[] = [
  { value: 'report', label: 'Full report', icon: 'description' },
  { value: 'iphone', label: 'iPhone', icon: 'smartphone' },
];

const deviceFrames: Record<DeviceDisplayMode, {
  path: string;
  width: number;
  height: number;
  plane: { width: number; height: number };
  screenQuad: readonly [Point, Point, Point, Point];
}> = {
  iphone: {
    path: '/partners/devices/generated-iphone-report-shell-final-v3.png',
    width: 1254,
    height: 1254,
    plane: { width: 430, height: 932 },
    screenQuad: [
      [370.72, 106.23],
      [776.34, 84.5],
      [946.04, 1087.03],
      [545.35, 1168.94],
    ],
  },
};

function solveLinearSystem(matrix: number[][], values: number[]) {
  const size = values.length;
  const augmented = matrix.map((row, rowIndex) => [...row, values[rowIndex]]);

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];

    const divisor = augmented[column][column];
    if (Math.abs(divisor) < 1e-10) return undefined;
    for (let index = column; index <= size; index += 1) augmented[column][index] /= divisor;

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let index = column; index <= size; index += 1) {
        augmented[row][index] -= factor * augmented[column][index];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

function perspectiveMatrix(sourceWidth: number, sourceHeight: number, target: readonly [Point, Point, Point, Point]) {
  const source: readonly [Point, Point, Point, Point] = [
    [0, 0],
    [sourceWidth, 0],
    [sourceWidth, sourceHeight],
    [0, sourceHeight],
  ];
  const matrix: number[][] = [];
  const values: number[] = [];

  source.forEach(([x, y], index) => {
    const [u, v] = target[index];
    matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    values.push(u);
    matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    values.push(v);
  });

  const solution = solveLinearSystem(matrix, values);
  if (!solution) return 'none';
  const [h11, h12, h13, h21, h22, h23, h31, h32] = solution;

  return `matrix3d(${[
    h11, h21, 0, h31,
    h12, h22, 0, h32,
    0, 0, 1, 0,
    h13, h23, 0, 1,
  ].map((value) => Number(value.toFixed(10))).join(',')})`;
}

const localOpportunities = [
  {
    temperature: 'Hot',
    area: 'Travis Heights',
    detail: 'Water heater leaking, wants same-day. 6 replies, no provider booked.',
    source: 'Nextdoor',
  },
  {
    temperature: 'Warm',
    area: 'Bouldin Creek',
    detail: 'Repeated "low water pressure" search activity in cluster.',
    source: 'Search signal',
  },
  {
    temperature: 'Warm',
    area: 'Zilker',
    detail: 'Homeowner asking for repipe recommendations after slab leak.',
    source: 'Nextdoor',
  },
];

function ReportDocument({ device = false }: { device?: boolean }) {
  return (
    <div className={`partner-report-document${device ? ' is-device-report' : ''}`}>
      <header>
        <div>
          <span>Neighborhood Demand Report</span>
          <b>Rivertown Plumbing &amp; Drain</b>
        </div>
        <p>Week of Jun 22-28<br />Territory · 78704 + 4 ZIPs</p>
      </header>

      <div className="partner-report-body">
        <section>
          <span>Executive snapshot</span>
          <p>Demand was up week-over-week, driven by heat-wave plumbing and water-heater chatter. Nine inbound calls were tracked and one reputation issue needs your sign-off.</p>
          <div className="partner-report-metrics">
            {[
              ['14', 'Opportunities'],
              ['9', 'Calls routed'],
              ['3', 'Reviews flagged'],
              ['5', 'Competitor refs'],
            ].map(([value, label]) => (
              <article key={label}><b>{value}</b><small>{label}</small></article>
            ))}
          </div>
        </section>

        <section>
          <span>New local opportunities</span>
          <div className="partner-opportunity-list">
            {localOpportunities.map((opportunity) => (
              <article key={`${opportunity.area}-${opportunity.source}`} className="partner-opportunity-row">
                <em className={opportunity.temperature === 'Hot' ? 'is-hot' : undefined}>{opportunity.temperature}</em>
                <strong>{opportunity.area}</strong>
                <p>{opportunity.detail}</p>
                <small>{opportunity.source}</small>
              </article>
            ))}
          </div>
        </section>

        <section>
          <span>Actions taken</span>
          <div className="partner-check-list">
            <p><b>✓</b> Sent 6 hot alerts; you responded to 4 within the hour.</p>
            <p><b>✓</b> Drafted 2 review responses for your approval.</p>
            <p><b>✓</b> Prepared 3 review-request messages in your company voice.</p>
          </div>
        </section>

        <section>
          <span>Calls &amp; lead outcomes</span>
          <div className="partner-call-table">
            <div><b>Tracked call</b><b>Length</b><b>Status</b></div>
            <div><span>Bouldin Creek — "no hot water"</span><span>4:12</span><strong>Qualified</strong></div>
            <div><span>South Lamar — quote request</span><span>2:48</span><strong>Booked</strong></div>
            <div><span>Missed — voicemail left</span><span>0:38</span><strong className="is-warn">Follow up</strong></div>
          </div>
        </section>

        <section>
          <span className="is-alert">Reputation alerts</span>
          <div className="partner-reputation-alert">
            <strong>New 3★ Google review</strong> mentioning a scheduling mix-up. A calm, professional response draft is ready — approve or edit in one tap.
          </div>
        </section>

        <section>
          <span>Competitor watch</span>
          <p>A nearby competitor was recommended in 5 threads this week, mostly for emergency response speed. Two of those threads are still open — see recommended moves.</p>
        </section>

        <section>
          <span>Recommended next moves</span>
          <div className="partner-check-list">
            <p><b>→</b> Reply to the 2 open Zilker repipe threads while they're warm.</p>
            <p><b>→</b> Approve the 3★ response draft to protect your rating.</p>
            <p><b>→</b> Consider a same-day emergency line — competitors are winning on speed.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function PartnerReportDisplay() {
  const {
    reportBackdropMode,
    screenStartupMode,
    reportReplayCycle,
  } = usePartnerDesignReview();
  const [mode, setMode] = useState<ReportDisplayMode>('iphone');
  const [stagePhase, setStagePhase] = useState<StagePhase>('pending');
  const [modeAnimationCycle, setModeAnimationCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scaledReportRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasIntroducedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const introductionFrameRef = useRef<number | null>(null);
  const lastReplayCycleRef = useRef(reportReplayCycle);

  const cancelStageSequence = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    if (introductionFrameRef.current !== null) {
      window.cancelAnimationFrame(introductionFrameRef.current);
      introductionFrameRef.current = null;
    }
  }, []);

  const beginStageSequence = useCallback((reducedMotion: boolean) => {
    cancelStageSequence();

    if (reducedMotion) {
      setStagePhase('settled');
      return;
    }

    setStagePhase('introducing');
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      setStagePhase('settled');
    }, 1550);
  }, [cancelStageSequence]);

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get('reportPreview');
    if (requestedMode !== 'report' && requestedMode !== 'iphone') {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => setMode(requestedMode));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    Object.values(deviceFrames).forEach(({ path }) => {
      const image = new window.Image();
      image.src = path;
    });

    ['/partners/devices/generated-iphone-screen-mask.png'].forEach((path) => {
      const image = new window.Image();
      image.src = path;
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const introduceStage = () => {
      if (hasIntroducedRef.current) return;
      hasIntroducedRef.current = true;
      beginStageSequence(reducedMotion);
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
      introduceStage();
      return () => {
        hasIntroducedRef.current = false;
        cancelStageSequence();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        introduceStage();
        observer.disconnect();
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12,
      },
    );

    observerRef.current = observer;
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (observerRef.current === observer) observerRef.current = null;
      hasIntroducedRef.current = false;
      cancelStageSequence();
    };
  }, [beginStageSequence, cancelStageSequence]);

  useEffect(() => {
    if (lastReplayCycleRef.current === reportReplayCycle) return undefined;
    lastReplayCycleRef.current = reportReplayCycle;
    hasIntroducedRef.current = true;
    observerRef.current?.disconnect();
    observerRef.current = null;
    cancelStageSequence();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      introductionFrameRef.current = window.requestAnimationFrame(() => {
        introductionFrameRef.current = null;
        setStagePhase('settled');
      });
      return cancelStageSequence;
    }

    introductionFrameRef.current = window.requestAnimationFrame(() => {
      setStagePhase('pending');
      introductionFrameRef.current = window.requestAnimationFrame(() => {
        introductionFrameRef.current = null;
        beginStageSequence(false);
      });
    });

    return cancelStageSequence;
  }, [beginStageSequence, cancelStageSequence, reportReplayCycle]);

  useLayoutEffect(() => {
    if (mode === 'report') return undefined;

    const shell = shellRef.current;
    const plane = planeRef.current;
    if (!shell || !plane) return undefined;

    const updateProjection = () => {
      const frameConfig = deviceFrames[mode];
      const shellScale = shell.clientWidth / frameConfig.width;
      const target = frameConfig.screenQuad.map(
        ([x, y]) => [x * shellScale, y * shellScale] as const,
      ) as unknown as readonly [Point, Point, Point, Point];

      plane.style.width = `${frameConfig.plane.width}px`;
      plane.style.height = `${frameConfig.plane.height}px`;
      plane.style.transform = perspectiveMatrix(
        frameConfig.plane.width,
        frameConfig.plane.height,
        target,
      );
    };

    updateProjection();

    const resizeObserver = new ResizeObserver(updateProjection);
    resizeObserver.observe(shell);
    return () => resizeObserver.disconnect();
  }, [mode]);

  useEffect(() => {
    if (mode === 'report') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      trackRef.current?.style.removeProperty('transform');
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      const plane = planeRef.current;
      const track = trackRef.current;
      const scaledReport = scaledReportRef.current;
      if (!root || !plane || !track || !scaledReport) return;

      const rootRect = root.getBoundingClientRect();
      const scrollableDistance = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rootRect.top / scrollableDistance));
      const scale = Number.parseFloat(getComputedStyle(scaledReport).getPropertyValue('--device-report-scale')) || 1;
      const contentHeight = scaledReport.scrollHeight * scale;
      const maxTravel = Math.max(contentHeight - plane.clientHeight, 0);

      track.style.transform = `translate3d(0, ${-(maxTravel * progress)}px, 0)`;
      root.style.setProperty('--device-scroll-progress', progress.toFixed(4));
      root.style.setProperty('--device-scroll-lift', `${(0.5 - progress) * 18}px`);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [mode]);

  const isDevice = mode !== 'report';
  const frame = deviceFrames[mode === 'report' ? 'iphone' : mode];
  const activeModeIndex = reportPreviewModes.findIndex((option) => option.value === mode);
  const modeSwitchClass = modeAnimationCycle > 0
    ? ` is-mode-switch-${modeAnimationCycle % 2 === 0 ? 'b' : 'a'}`
    : '';

  const selectMode = (nextMode: ReportDisplayMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setModeAnimationCycle((cycle) => cycle + 1);
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % reportPreviewModes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + reportPreviewModes.length) % reportPreviewModes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = reportPreviewModes.length - 1;
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    selectMode(reportPreviewModes[nextIndex].value);
  };

  return (
    <div
      ref={rootRef}
      className={`partner-report-display is-${mode}${isDevice ? ' is-device' : ''} is-stage-${stagePhase} is-screen-startup-${screenStartupMode}`}
    >
      <div className="partner-report-stage">
        <div className="partner-report-stage-backdrop" aria-hidden="true">
          <span
            className={`partner-report-stage-backdrop-layer is-map${reportBackdropMode === 'map' ? ' is-active' : ''}`}
          />
          <span
            className={`partner-report-stage-backdrop-layer is-abstract${reportBackdropMode === 'abstract' ? ' is-active' : ''}`}
          />
        </div>

        <div className="partner-report-display-control">
          <div className="partner-report-view-control">
            <span id="partner-report-preview-label" className="partner-report-display-label">Choose your view</span>
            <div
              className="partner-report-display-tabs"
              role="tablist"
              aria-labelledby="partner-report-preview-label"
            >
              {reportPreviewModes.map((option, index) => (
                <button
                  key={option.value}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`partner-report-tab-${option.value}`}
                  type="button"
                  role="tab"
                  aria-selected={mode === option.value}
                  aria-controls="partner-report-preview-panel"
                  tabIndex={mode === option.value ? 0 : -1}
                  onClick={() => selectMode(option.value)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          id="partner-report-preview-panel"
          className={`partner-report-mode-panel${modeSwitchClass}`}
          role="tabpanel"
          aria-labelledby={`partner-report-tab-${reportPreviewModes[activeModeIndex].value}`}
          tabIndex={0}
        >
          {mode === 'report' ? (
            <div className="partner-report-full-preview">
              <ReportDocument />
            </div>
          ) : (
            <div className="partner-device-preview">
              <div className="partner-device-motion">
                <div className="partner-device-entry">
                  <div className="partner-device-float">
                    <div ref={shellRef} className="partner-device-shell">
                      <Image
                        className="partner-device-frame"
                        src={frame.path}
                        alt=""
                        aria-hidden="true"
                        width={frame.width}
                        height={frame.height}
                        sizes="(max-width: 760px) 100vw, (max-width: 1200px) 72vw, 900px"
                        loading="eager"
                        unoptimized
                      />
                      <div className="partner-device-screen">
                        <span className="partner-device-screen-boot" aria-hidden="true" />
                        <span className="partner-device-boot-line" aria-hidden="true" />
                        <span className="partner-device-boot-wipe" aria-hidden="true" />
                        <div ref={planeRef} className="partner-device-report-plane">
                          <div ref={trackRef} className="partner-device-report-track">
                            <div ref={scaledReportRef} className="partner-device-report-content">
                              <ReportDocument device />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="partner-device-scroll-hint"><span aria-hidden="true">↕</span> Scroll to move through the live report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
