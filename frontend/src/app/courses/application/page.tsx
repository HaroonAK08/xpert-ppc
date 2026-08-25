'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';

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
      const res = await api.get<{
        decision: 'approved' | 'rejected';
        already?: boolean;
        name?: string;
      }>(`/api/student/auth/application?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        setError(res.error);
        setState('error');
        return;
      }
      setDecision(res.data.decision);
      setAlready(Boolean(res.data.already));
      setName(res.data.name || '');
      setState('ok');
    })();
  }, [token]);

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

  const accepted = decision === 'approved';

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h1 className="mb-2 text-2xl font-extrabold">
        {accepted ? 'Student accepted' : 'Student rejected'}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {already ? 'This application was already reviewed. ' : null}
        {name ? `${name} ` : 'This student '}
        {accepted
          ? 'can now sign in with the password they chose.'
          : 'will not be able to sign in.'}
      </p>
      <Link href="/admin/students" className="text-sm font-semibold text-primary hover:underline">
        Open applications in admin
      </Link>
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
