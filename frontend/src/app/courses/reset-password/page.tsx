'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { PasswordField } from '@/components/courses/auth-forms';
import { api } from '@/lib/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError('This reset link is invalid or expired.');
      return;
    }

    setBusy(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get('password') || '');

    const result = await api.post<{ message?: string }>('/api/student/auth/reset-password', {
      token,
      password,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setDone(true);
  }

  if (!token) {
    return (
      <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        This reset link is invalid or expired. Request a new one from the{' '}
        <Link href="/courses/forgot-password" className="font-semibold underline">
          forgot password
        </Link>{' '}
        page.
      </p>
    );
  }

  if (done) {
    return (
      <>
        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          Password updated. You can now sign in with your new password.
        </p>
        <Link
          href="/courses/login"
          className="academy-cta inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold transition hover:opacity-95"
        >
          Go to sign in
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordField id="password" autoComplete="new-password" minLength={6} />

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
        Update password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
              Student portal
            </p>
            <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-slate-900">
              Set a new password
            </h1>
            <Suspense
              fallback={
                <div className="flex min-h-[20vh] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
