'use client';

import { coursesLanding } from '@shared/content/courses-landing';

export function OfferMarquee() {
  const items = [...coursesLanding.marquee, ...coursesLanding.marquee];

  return (
    <div className="academy-marquee relative z-40 overflow-hidden border-b text-slate-100">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300/70 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-300" />
          </span>
          <span className="hidden sm:inline">{coursesLanding.offer.liveLabel}</span>
          <span className="sm:hidden">Live</span>
        </span>
        <div className="min-w-0 flex-1 overflow-hidden mask-image-linear">
          <div className="trust-marquee-track flex w-max gap-10 whitespace-nowrap text-[11px] font-medium text-slate-200/90 sm:text-xs">
            {items.map((item, i) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-10">
                <span>{item}</span>
                <span className="text-sky-400/50" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
