'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Field, Input, Label } from '@/components/ui/input';
import { api } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const result = await api.post('/api/auth/login', {
      email: String(fd.get('email') || ''),
      password: String(fd.get('password') || ''),
    });

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    router.replace('/admin');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>

      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </button>
    </form>
  );
}
