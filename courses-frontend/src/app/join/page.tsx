'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setAuthToken } from '@/lib/api';
import { loginDestination } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

type Inspect = { email: string; expiresAt: string };
export default function JoinPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [invitation, setInvitation] = useState<Inspect | null>(null);
  const [inspectError, setInspectError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get('token') || '';
    setToken(current);
    if (!current) { setInspectError('This invitation link is incomplete. Ask your administrator for a new invitation.'); setLoading(false); return; }
    api.post<Inspect>('/api/student/auth/invitation/inspect', { token: current }).then((result) => {
      if (!result.ok) setInspectError(result.error); else setInvitation(result.data);
      setLoading(false);
    });
  }, []);
  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invitation || submitting) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    if (password !== String(form.get('confirm') || '')) { setError('Passwords do not match.'); return; }
    setSubmitting(true); setError('');
    const result = await api.post<{ ok: boolean; token?: string }>('/api/student/auth/invitation/accept', {
      token, name: String(form.get('name') || '').trim(), phone: String(form.get('phone') || '').trim(), password,
    });
    if (!result.ok || !result.data.token) { setError(result.ok ? 'The account was not created. Please try again.' : result.error); setSubmitting(false); return; }
    setAuthToken(result.data.token);
    window.history.replaceState(window.history.state, '', '/join');
    router.replace(loginDestination('/dashboard', '/dashboard'));
  }
  return <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
    <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold text-ink">Join XpertPPC</h1>
      {loading ? <p role="status" className="mt-5 text-sm text-muted">Checking invitation…</p> : inspectError ? <div className="mt-5 space-y-4"><p role="alert" className="text-sm text-red-700">{inspectError}</p><Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-brand">Go to sign in</Link></div> : invitation && <>
        <p className="mt-2 text-sm text-muted">Create your account with your name, phone number and password. Expires {new Date(invitation.expiresAt).toLocaleDateString()}.</p>
        <form onSubmit={accept} className="mt-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="join-email">Email address</Label><Input id="join-email" value={invitation.email} readOnly aria-readonly="true" /></div>
          <div className="space-y-2"><Label htmlFor="join-name">Full name</Label><Input id="join-name" name="name" required minLength={2} maxLength={80} autoComplete="name" disabled={submitting} /></div>
          <div className="space-y-2"><Label htmlFor="join-phone">Phone number</Label><Input id="join-phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" disabled={submitting} /></div>
          <div className="space-y-2"><Label htmlFor="join-password">Password</Label><Input id="join-password" name="password" type="password" required minLength={6} maxLength={100} autoComplete="new-password" disabled={submitting} /></div>
          <div className="space-y-2"><Label htmlFor="join-confirm">Confirm password</Label><Input id="join-confirm" name="confirm" type="password" required minLength={6} maxLength={100} autoComplete="new-password" disabled={submitting} /></div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="min-h-11 w-full" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</Button>
        </form>
      </>}
    </section>
  </main>;
}
