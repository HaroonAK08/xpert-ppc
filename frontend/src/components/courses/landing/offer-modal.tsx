'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, X } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';

export function OfferModal() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { offer } = coursesLanding;

  useEffect(() => {
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
      document.getElementById('meeting')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm"
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
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-slate-900 shadow-2xl"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#1d6ff2]/10 to-transparent" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 p-7 pt-9 text-center sm:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1d6ff2]/20 bg-[#1d6ff2]/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1558c7]">
                <CalendarCheck className="h-3.5 w-3.5" />
                {offer.badge}
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Xpert PPC Study Portal
              </p>
              <h2 id="offer-modal-title" className="text-balance text-2xl font-extrabold leading-tight sm:text-3xl">
                Meet us first. <span className="academy-text-gradient">Then skills & price.</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{offer.headline}</p>

              <button
                type="button"
                onClick={claim}
                className="academy-cta mt-7 w-full rounded-full py-3.5 text-base font-extrabold transition"
              >
                {offer.cta}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 text-sm text-slate-500 transition hover:text-slate-800"
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
