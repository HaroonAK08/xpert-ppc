'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Accordion({
  items,
}: {
  items: { key: string; title: React.ReactNode; badge?: React.ReactNode; body: React.ReactNode }[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openKey === item.key;
        return (
          <div
            key={item.key}
            className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition hover:border-brand/25"
          >
            <button
              type="button"
              onClick={() => setOpenKey(open ? null : item.key)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                {item.badge}
                <span className="text-sm font-bold text-ink sm:text-base">{item.title}</span>
              </span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted transition', open && 'rotate-180 text-brand')} />
            </button>
            {open ? (
              <div className="border-t border-border/70 px-5 py-4 text-sm leading-relaxed text-muted">{item.body}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
