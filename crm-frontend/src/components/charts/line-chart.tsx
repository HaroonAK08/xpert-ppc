'use client';

import { useRef, useState, type MouseEvent } from 'react';

type Point = { date: string; count: number };

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = { top: 16, right: 16, bottom: 24, left: 8 };

/** A day-by-day line with a crosshair + tooltip — the single-series form for change over time. */
export function LineChart({ data, color = '#1d6ff2' }: { data: Point[]; color?: string }) {
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(1, ...data.map((d) => d.count));

  const x = (i: number) => PADDING.left + (i / Math.max(1, data.length - 1)) * innerW;
  const y = (v: number) => PADDING.top + innerH - (v / max) * innerH;

  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.count)}`).join(' ');
  const gridY = [0, 0.5, 1].map((t) => PADDING.top + innerH * t);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function onMove(e: MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || data.length === 0) return;
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const relX = px - PADDING.left;
    const idx = Math.round((relX / innerW) * Math.max(1, data.length - 1));
    setHoverIdx(Math.min(data.length - 1, Math.max(0, idx)));
  }

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;
  const hoverLeftPct = hoverIdx !== null ? (x(hoverIdx) / WIDTH) * 100 : 0;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIdx(null)}
        role="img"
        aria-label="Leads over time"
      >
        {gridY.map((gy, i) => (
          <line
            key={i}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={gy}
            y2={gy}
            stroke="#e6e8ef"
            strokeWidth={1}
          />
        ))}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {hoverIdx !== null ? (
          <>
            <line
              x1={x(hoverIdx)}
              x2={x(hoverIdx)}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              stroke="#c8cdd8"
              strokeWidth={1}
            />
            <circle cx={x(hoverIdx)} cy={y(data[hoverIdx].count)} r={4} fill={color} stroke="#fcfcfb" strokeWidth={2} />
          </>
        ) : null}
      </svg>
      {hovered ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-[110%] rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-sm"
          style={{ left: `${hoverLeftPct}%` }}
        >
          <p className="font-semibold tabular-nums text-ink">{hovered.count} leads</p>
          <p className="text-muted">
            {new Date(hovered.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      ) : null}
    </div>
  );
}
