'use client';

import { useState } from 'react';

type BarDatum = { label: string; value: number };

/** Single-measure horizontal bars — one hue, direct value labels, no legend needed. */
export function BarChart({ data, color = '#1d6ff2' }: { data: BarDatum[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {data.map((d, i) => {
        const pct = d.value > 0 ? Math.max(2, (d.value / max) * 100) : 0;
        return (
          <div key={d.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{d.label}</span>
              <span className="font-semibold tabular-nums text-ink">{d.value.toLocaleString()}</span>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-canvas"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="h-full rounded-full transition-opacity"
                style={{ width: `${pct}%`, backgroundColor: color, opacity: hovered === i ? 1 : 0.85 }}
              />
            </div>
          </div>
        );
      })}
      {data.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : null}
    </div>
  );
}
