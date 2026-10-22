'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setStatus('loading');
    setError('');

    const res = await api.post<{ ok: boolean }>('/api/student/auth/forgot-password', {
      email: String(form.get('email') || '').trim(),
    });

    if (!res.ok) {
      setError(res.error);
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f7fc]">
      <SiteHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border/70 bg-white p-8 shadow-panel">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">Reset your password</h1>
            <p className="mt-1 text-sm text-muted">
              Enter the email on your student account and we’ll send you a reset link.
            </p>

            {status === 'sent' ? (
              <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700">
                If an account exists for that email, a reset link is on its way. Check your inbox.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </div>

                {error ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" disabled={status === 'loading'} className="h-12 w-full rounded-full font-bold">
                  {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
                </Button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Remembered it?{' '}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>

      <SiteFooter variant="legal" />
    </div>
  );
}
