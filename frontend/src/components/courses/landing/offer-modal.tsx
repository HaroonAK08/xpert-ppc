'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Timer, X } from 'lucide-react';
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card text-foreground shadow-2xl"
            initial={{ scale: 0.88, y: 36, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-foreground transition hover:bg-white/20"
              aria-label="Close offer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 p-7 pt-8 text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-red-200">
                <Flame className="h-3.5 w-3.5 text-yellow-400" />
                {offer.badge}
              </div>

              <h2 id="offer-modal-title" className="text-2xl font-extrabold leading-tight md:text-3xl">
                Unlock{' '}
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  3 money-making skills
                </span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{offer.headline}</p>

              <div className="my-5 flex items-center justify-center gap-4">
                <span className="text-lg text-muted-foreground line-through opacity-70">
                  {offer.strikePrice}
                </span>
                <span className="text-3xl font-black text-accent md:text-4xl">{offer.offerPrice}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">{offer.priceNote}</p>

              <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-[13px] text-muted-foreground">
                <Timer className="h-4 w-4 shrink-0 text-accent" />
                <span>
                  {offer.urgencyPrefix}{' '}
                  <strong className="text-foreground">{offer.strikePrice}</strong> on{' '}
                  <strong className="text-foreground">{dateLabel || '…'}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={claim}
                className="w-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 py-3.5 text-lg font-extrabold text-white shadow-lg shadow-orange-500/40 transition hover:opacity-95"
              >
                {offer.cta}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 text-sm text-muted-foreground transition hover:text-foreground"
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
