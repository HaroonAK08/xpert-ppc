'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Timer, X } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';

function nextCohortDateLabel() {
  const now = new Date();
  const day = now.getDate();
  const target = new Date(now);
  if (day <= 9) target.setDate(10);
  else if (day <= 19) target.setDate(20);
  else {
    target.setDate(30);
    if (target.getMonth() !== now.getMonth()) {
      target.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
    }
  }
  return target.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function OfferModal() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { offer } = coursesLanding;

  useEffect(() => {
    setDateLabel(nextCohortDateLabel());
    if (pathname === '/' || pathname === '/courses') setOpen(true);

    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const claim = () => {
    setOpen(false);
    window.setTimeout(() => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020617]/75 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(165deg,hsl(222_42%_14%),hsl(223_55%_9%))] text-foreground shadow-2xl shadow-black/50"
            initial={{ scale: 0.92, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-400/15 to-transparent" />
            <div className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close offer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 p-7 pt-9 text-center sm:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                {offer.badge}
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Xpert PPC Digital Academy
              </p>
              <h2 id="offer-modal-title" className="text-balance text-2xl font-extrabold leading-tight sm:text-3xl">
                Unlock <span className="academy-text-gradient">all 3 academy tracks</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/85">{offer.headline}</p>

              <div className="my-6 flex items-end justify-center gap-3">
                <span className="pb-1 text-base text-slate-500 line-through">{offer.strikePrice}</span>
                <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {offer.offerPrice}
                </span>
              </div>
              <p className="mb-5 text-xs text-slate-400">{offer.priceNote}</p>

              <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-left text-[12px] leading-snug text-slate-300">
                <Timer className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                <span>
                  {offer.urgencyPrefix}{' '}
                  <strong className="font-semibold text-white">{offer.strikePrice}</strong> on{' '}
                  <strong className="font-semibold text-white">{dateLabel || '…'}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={claim}
                className="academy-cta w-full rounded-full py-3.5 text-base font-extrabold transition"
              >
                {offer.cta}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 text-sm text-slate-500 transition hover:text-slate-300"
              >
                {offer.dismiss}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
