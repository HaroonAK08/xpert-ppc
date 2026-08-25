'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';

type Applicant = {
  id: string;
  name: string;
  email: string;
  interest: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const me = await api.get('/api/auth/me');
    if (!me.ok) {
      router.replace('/admin/login');
      return;
    }
    const res = await api.get<{ items: Applicant[] }>('/api/admin/portal/students');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setItems(res.data.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function decide(id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    const res = await api.patch(`/api/admin/portal/students/${id}`, { status });
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const pending = items.filter((s) => s.status === 'pending');
  const others = items.filter((s) => s.status !== 'pending');

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm text-primary hover:underline">
          ← Leads
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Course applications</h1>
        <p className="mb-8 mt-1 text-sm text-muted-foreground">
          Accept someone so they can sign in with the password they chose.
        </p>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Waiting ({pending.length})
        </h2>
        <div className="mb-10 space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending applications.</p>
          ) : (
            pending.map((s) => (
              <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.email}</p>
                {s.interest ? (
                  <p className="mt-2 text-sm text-foreground/90">{s.interest}</p>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => void decide(s.id, 'approved')}
                    className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => void decide(s.id, 'rejected')}
                    className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Reviewed ({others.length})
        </h2>
        <div className="space-y-3">
          {others.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.email}</p>
                </div>
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  {s.status}
                </span>
              </div>
              {s.interest ? <p className="mt-2 text-sm text-foreground/90">{s.interest}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
