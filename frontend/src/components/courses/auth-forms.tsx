'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Field, Input, Label, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';

type Mode = 'signup' | 'login';

function PasswordField({
  id,
  autoComplete,
  minLength,
}: {
  id: string;
  autoComplete: string;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);

  return (
    <Field>
      <Label htmlFor={id}>Password</Label>
      <div className="relative">
        <Input
          id={id}
          name="password"
          type={show ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

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
    const interest = String(fd.get('interest') || '').trim();

    if (mode === 'signup') {
      const result = await api.post<{ pending?: boolean; email: string; message?: string }>(
        '/api/student/auth/signup',
        { name, email, password, interest }
      );

      setBusy(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      window.location.assign('/courses/applied');
      return;
    }

    const result = await api.post<{ user: { id: string } }>('/api/student/auth/login', {
      email,
      password,
    });

    if (result.ok) {
      setBusy(false);
      router.replace('/courses/dashboard');
      return;
    }

    const adminResult = await api.post<{ user: { id: string; role?: string } }>(
      '/api/auth/login',
      { email, password }
    );

    setBusy(false);

    if (adminResult.ok) {
      window.location.assign('/admin');
      return;
    }

    setError(result.error || adminResult.error || 'Invalid email or password.');
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

      <PasswordField
        id="password"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        minLength={6}
      />

      {mode === 'signup' ? (
        <Field>
          <Label htmlFor="interest">What do you want to learn?</Label>
          <Textarea
            id="interest"
            name="interest"
            required
            minLength={8}
            maxLength={500}
            placeholder="Google Ads, Meta Ads, landing pages…"
          />
        </Field>
      ) : null}

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
        {mode === 'signup' ? 'Apply for access' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'signup' ? (
          <>
            Already accepted?{' '}
            <Link href="/courses/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link href="/courses/signup" className="font-semibold text-primary hover:underline">
              Apply
            </Link>
          </>
        )}
      </p>
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
