'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Native modal supplies focus containment, Escape handling and focus restoration. */
export function StudentDialog({ title, children, onClose, busy = false, wide = false }: {
  title: string; children: ReactNode; onClose: () => void; busy?: boolean; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog ref={ref} aria-label={title} onCancel={(event) => { event.preventDefault(); if (!busy) closeRef.current(); }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-border bg-white p-5 text-ink shadow-2xl backdrop:bg-slate-950/50 sm:p-6 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <h2 className="pt-2 text-xl font-extrabold">{title}</h2>
        <button type="button" autoFocus aria-label={`Close ${title}`} disabled={busy} onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-slate-100 focus-visible:outline-brand disabled:opacity-50"><X className="h-5 w-5" /></button>
      </div>
      {children}
    </dialog>
  );
}
