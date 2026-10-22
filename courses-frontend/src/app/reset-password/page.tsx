'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token') || '';
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') || '');
    const confirm = String(form.get('confirm') || '');

    if (password !== confirm) {
      setError('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');

    const res = await api.post<{ ok: boolean }>('/api/student/auth/reset-password', { token, password });

    if (!res.ok) {
      setError(res.error);
      setStatus('error');
      return;
    }

    setStatus('done');
    setTimeout(() => router.replace('/login'), 2000);
  }

  if (!token) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-700">
        This reset link is missing or invalid. Request a new one from the{' '}
        <Link href="/forgot-password" className="underline">
          forgot password
        </Link>{' '}
        page.
      </p>
    );
  }

  if (status === 'done') {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700">
        Password updated. Redirecting you to sign in…
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="••••••••"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          name="confirm"
          type={showPassword ? 'text' : 'password'}
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'loading'} className="h-12 w-full rounded-full font-bold">
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set new password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f7fc]">
      <SiteHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border/70 bg-white p-8 shadow-panel">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">Set a new password</h1>
            <p className="mt-1 text-sm text-muted">Choose a new password for your student account.</p>

            <Suspense fallback={null}>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
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
