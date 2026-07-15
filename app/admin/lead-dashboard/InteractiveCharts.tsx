'use client';

import { useMemo, useState } from 'react';

type SeriesPoint = {
  label: string;
  demand: number;
  replies: number;
  calls: number;
};

type ChartKey = 'demand' | 'replies' | 'calls';

type ChartLine = {
  key: ChartKey;
  label: string;
  color: string;
};

const ALL_LINES: ChartLine[] = [
  { key: 'demand', label: 'Demand', color: '#020617' },
  { key: 'replies', label: 'Replies', color: '#2563eb' },
  { key: 'calls', label: 'Calls', color: '#059669' },
];

const FOCUS_LINES: ChartLine[] = [
  { key: 'replies', label: 'Replies', color: '#2563eb' },
  { key: 'calls', label: 'Calls', color: '#059669' },
];

function dateLabel(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function InteractiveLineChart({
  title,
  description,
  values,
  lines,
  rangeDays,
  focus = false,
}: {
  title: string;
  description: string;
  values: SeriesPoint[];
  lines: ChartLine[];
  rangeDays?: number;
  focus?: boolean;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 900;
  const height = focus ? 220 : 240;
  const padding = 28;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const activeIndex = hoverIndex ?? values.length - 1;
  const active = values[activeIndex];
  const max = Math.max(...values.flatMap((v) => lines.map((line) => v[line.key])), 1);

  const helpers = useMemo(() => {
    const x = (idx: number) => padding + (idx / Math.max(values.length - 1, 1)) * plotWidth;
    const y = (value: number) => height - padding - (value / max) * plotHeight;
    const path = (key: ChartKey) => values.map((v, idx) => `${idx === 0 ? 'M' : 'L'} ${x(idx)} ${y(v[key])}`).join(' ');
    return { x, y, path };
  }, [height, max, plotHeight, plotWidth, values]);

  function handleMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relative = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const idx = Math.round(relative * Math.max(values.length - 1, 0));
    setHoverIndex(idx);
  }

  return (
    <div className={`overflow-hidden rounded-3xl border bg-white p-5 shadow-sm ${focus ? 'border-blue-100' : 'border-slate-200'}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">{rangeDays ? `${rangeDays}-day ${title}` : title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide">
          {lines.map((line) => (
            <span key={line.key} style={{ color: line.color }}>● {line.label}</span>
          ))}
        </div>
      </div>

      <div className="relative">
        {active ? (
          <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-xl backdrop-blur">
            <div className="font-black text-slate-950">{dateLabel(active.label)}</div>
            <div className="mt-2 space-y-1">
              {lines.map((line) => (
                <div key={line.key} className="flex items-center justify-between gap-8">
                  <span className="font-semibold" style={{ color: line.color }}>{line.label}</span>
                  <span className="font-black tabular-nums text-slate-950">{active[line.key]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={focus ? 'h-60 w-full cursor-crosshair' : 'h-64 w-full cursor-crosshair'}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
          role="img"
          aria-label={title}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1={padding}
              x2={width - padding}
              y1={padding + tick * plotHeight}
              y2={padding + tick * plotHeight}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {hoverIndex !== null ? (
            <g>
              <rect
                x={Math.max(padding, helpers.x(hoverIndex) - Math.max(6, plotWidth / Math.max(values.length, 1) / 2))}
                y={padding}
                width={Math.max(12, plotWidth / Math.max(values.length, 1))}
                height={plotHeight}
                fill="#e0f2fe"
                opacity="0.55"
                rx="6"
              />
              <line x1={helpers.x(hoverIndex)} x2={helpers.x(hoverIndex)} y1={padding} y2={height - padding} stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 4" />
            </g>
          ) : null}

          {lines.map((line) => (
            <path key={line.key} d={helpers.path(line.key)} fill="none" stroke={line.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {values.map((v, idx) => (
            <g key={v.label} opacity={hoverIndex === null || hoverIndex === idx ? 1 : 0.38}>
              {lines.map((line) => (
                <circle
                  key={line.key}
                  cx={helpers.x(idx)}
                  cy={helpers.y(v[line.key])}
                  r={hoverIndex === idx ? 5 : 3}
                  fill={line.color}
                  stroke="white"
                  strokeWidth={hoverIndex === idx ? 2 : 0}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-1 grid grid-cols-3 text-xs font-semibold text-slate-400 sm:grid-cols-6">
        {values.filter((_, idx) => idx % Math.max(1, Math.ceil(values.length / 6)) === 0 || idx === values.length - 1).map((v) => (
          <span key={v.label}>{v.label.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

export function InteractiveCharts({ values, rangeDays }: { values: SeriesPoint[]; rangeDays: number }) {
  return (
    <div className="space-y-6">
      <InteractiveLineChart
        title="trend"
        description="Hover the graph for exact date values. Demand, public replies, and eLocal calls/leads."
        values={values}
        lines={ALL_LINES}
        rangeDays={rangeDays}
      />
      <InteractiveLineChart
        title="Reply + call focus"
        description="Same dates, separate scale. This is the zoomed-in view for the tiny lines."
        values={values}
        lines={FOCUS_LINES}
        focus
      />
    </div>
  );
}
