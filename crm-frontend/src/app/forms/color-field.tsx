'use client';

import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

/** A labeled swatch that opens a real color picker popover — closes on outside click. */
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <p className="mb-1.5 text-[11px] font-semibold text-muted">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-ink"
      >
        <span className="h-4 w-4 shrink-0 rounded-full border border-border" style={{ backgroundColor: value }} />
        <span className="font-mono uppercase">{value}</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 rounded-xl border border-border bg-surface p-3 shadow-lg">
          <HexColorPicker color={value} onChange={onChange} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-canvas px-2 py-1 text-center text-xs font-mono uppercase text-ink outline-none focus:border-brand"
          />
        </div>
      ) : null}
    </div>
  );
}
