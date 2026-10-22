'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Field, Label, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';

type ApplicationInfo = {
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  email: string;
  country: string;
  interest: string;
};

function ApplicationReview() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, setState] = useState<'loading' | 'review' | 'rejecting' | 'done' | 'error'>(
    'loading'
  );
  const [info, setInfo] = useState<ApplicationInfo | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected' | ''>('');
  const [already, setAlready] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setError('Missing review link.');
      return;
    }

    void (async () => {
      const res = await api.get<ApplicationInfo>(
        `/api/student/auth/application?token=${encodeURIComponent(token)}`
      );
      if (!res.ok) {
        setError(res.error);
        setState('error');
        return;
      }
      setInfo(res.data);
      setState('review');
    })();
  }, [token]);

  async function submitDecision(nextDecision: 'approved' | 'rejected') {
    setBusy(true);
    setError('');

    const res = await api.post<{
      decision: 'approved' | 'rejected';
      already?: boolean;
      enrolled?: boolean;
      name?: string;
    }>('/api/student/auth/application', {
      token,
      decision: nextDecision,
      reason: nextDecision === 'rejected' ? reason.trim() : undefined,
    });

    setBusy(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setDecision(res.data.decision);
    setAlready(Boolean(res.data.already));
    setEnrolled(Boolean(res.data.enrolled));
    setState('done');
  }

  if (state === 'loading') {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">Link not valid</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (state === 'done') {
    const accepted = decision === 'approved';
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">
          {accepted ? 'Student accepted' : 'Student rejected'}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {already ? 'This application was already reviewed. ' : null}
          {info?.name ? `${info.name} ` : 'This student '}
          {accepted
            ? enrolled
              ? 'can now sign in with the password they chose.'
              : 'is approved, but no course matched automatically — assign one on the admin page so they can sign in.'
            : 'will not be able to sign in.'}
        </p>
        <Link href="/admin/students" className="text-sm font-semibold text-primary hover:underline">
          Open applications in admin
        </Link>
      </div>
    );
  }

  // state is 'review' or 'rejecting'
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8">
      <h1 className="mb-1 text-2xl font-extrabold">Review application</h1>
      {info?.status !== 'pending' ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Already marked {info?.status}
        </p>
      ) : null}

      <div className="mb-6 space-y-1 text-sm">
        <p className="font-bold">{info?.name}</p>
        <p className="text-muted-foreground">
          {info?.email}
          {info?.country ? ` · ${info.country}` : ''}
        </p>
        {info?.interest ? <p className="mt-2 text-foreground/90">{info.interest}</p> : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {state === 'rejecting' ? (
        <div className="space-y-3">
          <Field>
            <Label htmlFor="reason">Reason (optional, included in the student&apos;s email)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Not a fit for this cohort right now…"
            />
          </Field>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void submitDecision('rejected')}
              className="inline-flex h-11 items-center rounded-xl bg-destructive px-5 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setState('review')}
              className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void submitDecision('approved')}
            className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setState('rejecting')}
            className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function CourseApplicationPage() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <Suspense
          fallback={
            <div className="flex min-h-[30vh] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <ApplicationReview />
        </Suspense>
      </div>
    </section>
  );
}
