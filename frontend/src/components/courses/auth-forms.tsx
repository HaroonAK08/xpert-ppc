'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Field, Input, Label } from '@/components/ui/input';
import { api } from '@/lib/api';

type Mode = 'signup' | 'login';

export function CourseAuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    const name = String(fd.get('name') || '').trim();
    const password = String(fd.get('password') || '');

    if (mode === 'signup') {
      const result = await api.post<{
        email: string;
        purpose: string;
        emailed?: boolean;
        previewCode?: string;
        message?: string;
      }>('/api/student/auth/signup', {
        name,
        email,
        password,
      });

      setBusy(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data.previewCode) {
        sessionStorage.setItem(
          'xppc_otp_preview',
          JSON.stringify({
            email: result.data.email,
            code: result.data.previewCode,
            message: result.data.message,
          })
        );
      } else {
        sessionStorage.removeItem('xppc_otp_preview');
      }

      const params = new URLSearchParams({
        email: result.data.email,
        purpose: result.data.purpose,
      });
      if (name) params.set('name', name);
      router.push(`/courses/verify?${params.toString()}`);
      return;
    }

    const result = await api.post<{ user: { id: string } }>('/api/student/auth/login', {
      email,
      password,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.replace('/courses/dashboard');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === 'signup' ? (
        <Field>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Your name" />
        </Field>
      ) : null}

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

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          placeholder="••••••••"
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
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href="/courses/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link href="/courses/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

export function CourseOtpForm({
  email,
  purpose,
}: {
  email: string;
  purpose: 'signup' | 'login';
}) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ code: string; message?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('xppc_otp_preview');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { email?: string; code?: string; message?: string };
      if (parsed.email === email && parsed.code) {
        setPreview({ code: parsed.code, message: parsed.message });
      }
    } catch {
      // ignore
    }
  }, [email]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const result = await api.post('/api/student/auth/verify-otp', {
      email,
      code,
      purpose,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    sessionStorage.removeItem('xppc_otp_preview');
    router.replace('/courses/dashboard');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {preview ? (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm text-foreground">
          <p className="mb-1 font-semibold text-accent">Email not configured (dev mode)</p>
          <p className="text-muted-foreground">
            {preview.message || 'Use this preview code to continue:'}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-[0.35em] text-primary">{preview.code}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
          Check your inbox (and spam folder).
        </p>
      )}

      <Field>
        <Label htmlFor="code">Verification code</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="tracking-[0.4em]"
        />
      </Field>

      {error ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Verify & continue
      </button>
    </form>
  );
}

export function useStudentSession() {
  const [user, setUser] = useState<import('@/lib/api').StudentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await api.get<{ user: import('@/lib/api').StudentUser }>('/api/student/auth/me');
      if (cancelled) return;
      setUser(res.ok ? res.data.user : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, setUser };
}
