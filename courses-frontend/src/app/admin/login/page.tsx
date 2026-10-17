'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { adminApi, setAdminToken } from '@/lib/admin-api';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('loading');
    setError('');

    const res = await adminApi.post<{ ok: boolean; token?: string }>('/api/auth/login', {
      email: String(form.get('email') || '').trim(),
      password: String(form.get('password') || ''),
    });

    if (!res.ok) {
      setError(res.error);
      setStatus('error');
      return;
    }

    if (res.data.token) setAdminToken(res.data.token);
    router.replace('/admin/applications');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f7fc]">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border/70 bg-white p-8 shadow-panel">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Academy admin</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted">
              Review student applications and approve verified enrollments.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="username" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
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

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={status === 'loading'} className="h-12 w-full rounded-full font-bold">
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Student?{' '}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Go to student login
            </Link>
          </p>
        </div>
      </div>
      <SiteFooter variant="legal" />
    </div>
  );
}
