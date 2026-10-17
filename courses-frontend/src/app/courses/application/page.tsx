'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

function ApplicationReview() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [decision, setDecision] = useState<'approved' | 'rejected' | ''>('');
  const [already, setAlready] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setError('Missing review link.');
      return;
    }

    void (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/student/auth/application?token=${encodeURIComponent(token)}`,
          { credentials: 'include' }
        );
        const data = (await res.json().catch(() => null)) as {
          decision?: 'approved' | 'rejected';
          already?: boolean;
          name?: string;
          error?: string;
        } | null;
        if (!res.ok) {
          setError(data?.error || 'This accept/reject link is invalid or expired.');
          setState('error');
          return;
        }
        setDecision(data?.decision || '');
        setAlready(Boolean(data?.already));
        setName(data?.name || '');
        setState('ok');
      } catch {
        setError('Cannot reach the server. Please check your connection.');
        setState('error');
      }
    })();
  }, [token]);

  if (state === 'loading') {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-panel">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Link not valid</h1>
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  const accepted = decision === 'approved';

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-panel">
      <h1 className="mb-2 text-2xl font-extrabold text-ink">
        {accepted ? 'Student approved' : 'Student rejected'}
      </h1>
      <p className="mb-6 text-sm text-muted">
        {already ? 'This application was already reviewed. ' : null}
        {name ? `${name} ` : 'This student '}
        {accepted
          ? 'can now sign in with the password they chose.'
          : 'will not be able to sign in.'}
      </p>
      <Link href="/admin/applications" className="text-sm font-semibold text-brand hover:underline">
        Open applications admin
      </Link>
    </div>
  );
}

export default function CourseApplicationPage() {
  return (
    <section className="min-h-dvh bg-[#f4f7fc] py-16">
      <div className="mx-auto max-w-lg px-4">
        <Suspense
          fallback={
            <div className="flex min-h-[30vh] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            </div>
          }
        >
          <ApplicationReview />
        </Suspense>
      </div>
    </section>
  );
}
