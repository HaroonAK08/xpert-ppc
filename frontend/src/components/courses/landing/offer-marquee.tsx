'use client';

import { coursesLanding } from '@shared/content/courses-landing';

export function OfferMarquee() {
  const items = [...coursesLanding.marquee, ...coursesLanding.marquee];

  return (
    <div className="relative z-40 overflow-hidden border-b border-accent/30 bg-gradient-to-r from-accent via-orange-500 to-red-500 text-white">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider md:text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-300" />
          </span>
          <span className="hidden md:inline">{coursesLanding.offer.liveLabel}</span>
          <span className="md:hidden">Live</span>
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="trust-marquee-track flex w-max gap-8 whitespace-nowrap text-xs font-semibold md:text-sm">
            {items.map((item, i) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-8">
                <span>{item}</span>
                <span className="font-black opacity-80" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
