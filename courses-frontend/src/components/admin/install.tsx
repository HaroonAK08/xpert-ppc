'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function AdminInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [standalone, setStandalone] = useState(true);
  const [instructions, setInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const display = window.matchMedia('(display-mode: standalone)');
    const update = () => setStandalone(display.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const available = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const installed = () => {
      setStandalone(true);
      setPrompt(null);
      setInstructions(false);
    };
    update();
    display.addEventListener('change', update);
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', installed);
    return () => {
      display.removeEventListener('change', update);
      window.removeEventListener('beforeinstallprompt', available);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  if (standalone) return null;

  async function install() {
    if (!prompt) {
      setInstructions((value) => !value);
      return;
    }
    setInstalling(true);
    setError('');
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome !== 'accepted') setInstructions(true);
      setPrompt(null);
    } catch {
      setError('Use your browser menu to add the admin to your home screen.');
      setInstructions(true);
    } finally {
      setInstalling(false);
    }
  }

  return (
    <section aria-label="Admin home-screen shortcut" className="rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Smartphone className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">Keep admin on your home screen</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">A shortcut to this panel. An internet connection is still required.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" disabled={installing} onClick={install} aria-expanded={instructions} aria-controls="admin-install-help" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-ink disabled:opacity-50">
            <Download className="h-4 w-4" aria-hidden="true" />
            {installing ? 'Opening…' : prompt ? 'Install admin' : 'How to add'}
          </button>
          {prompt ? <button type="button" aria-expanded={instructions} aria-controls="admin-install-help" onClick={() => setInstructions((value) => !value)} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted underline underline-offset-4">Instructions</button> : null}
        </div>
      </div>
      {instructions ? (
        <div id="admin-install-help" className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p><strong className="text-ink">iPhone/iPad:</strong> open this admin page in Safari, tap Share, then Add to Home Screen.</p>
              <p><strong className="text-ink">Android:</strong> open this page in Chrome, tap the menu, then Install app or Add to Home screen.</p>
              <p>If your browser does not offer installation, bookmark this page instead. You may need to sign in again after adding it.</p>
            </div>
            <button type="button" aria-label="Close installation instructions" onClick={() => setInstructions(false)} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border"><X className="h-4 w-4" /></button>
          </div>
        </div>
      ) : null}
      {error ? <p role="alert" className="mt-3 text-sm text-muted">{error}</p> : null}
    </section>
  );
}
