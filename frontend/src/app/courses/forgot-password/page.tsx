'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, Mail } from 'lucide-react';

import { Field, Input, Label } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();

    const result = await api.post<{ message?: string }>('/api/student/auth/forgot-password', {
      email,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
              Student portal
            </p>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
              Reset your password
            </h1>

            {sent ? (
              <>
                <p className="mb-8 text-sm leading-relaxed text-slate-600">
                  If an account exists for that email, a reset link is on its way.
                </p>
                <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5 text-[#1d6ff2]" />
                  Check inbox and spam for the link
                </div>
              </>
            ) : (
              <>
                <p className="mb-8 text-sm leading-relaxed text-slate-600">
                  Enter the email you applied with and we&apos;ll send you a link to set a new
                  password.
                </p>
                <form onSubmit={onSubmit} className="space-y-4">
                  <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                    />
                  </Field>

                  {error ? (
                    <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={busy}
                    className="academy-cta inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold transition hover:opacity-95 disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send reset link
                  </button>
                </form>
              </>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              <Link href="/courses/login" className="font-semibold text-[#1d6ff2]">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
