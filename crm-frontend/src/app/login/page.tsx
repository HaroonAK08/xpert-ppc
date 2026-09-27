'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const fd = new FormData(e.currentTarget);
    const res = await api.post<{ ok: boolean }>('/api/auth/login', {
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || ''),
    });

    if (!res.ok) {
      setError(res.error);
      setStatus('error');
      return;
    }

    router.replace('/');
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-sidebar px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,111,242,0.35),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,92,53,0.22),transparent_40%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />

        <div className="relative">
          <BrandLogo size={44} dark href={null} />
        </div>

        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Smart ads. Real results.
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
            Every inquiry, follow-up, and close in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Pipeline, sequences, and Meta Lead Ads for the Xpert PPC team — and a quieter view for each client.
          </p>
        </div>

        <p className="relative text-xs text-white/35">Internal CRM · not indexed</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandLogo size={40} href={null} />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted">Use the email and password for your CRM account.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-ink">
                Email
              </label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@xpertppc.com" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-ink">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={status === 'loading'} className="h-11 w-full">
              {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
