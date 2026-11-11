'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/page-header';
import { api } from '@/lib/api';
import type { ExamListItem } from '@/lib/exams';

export default function ExamsPage() {
  const [items, setItems] = useState<ExamListItem[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get<{ items: ExamListItem[] }>('/api/student/exams').then((result) => {
      if (result.ok) setItems(result.data.items);
      else setError(result.error);
    });
  }, []);

  return <>
    <DashboardPageHeader title="Exams" />
    <main className="px-5 py-8 sm:px-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-ink">MCQ exams</h2>
      <p className="mt-1 text-sm text-muted">Test your knowledge and see your score immediately.</p>
      {error ? <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {items === null && !error ? <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Loading exams…</p> : null}
      {items?.length === 0 ? <div className="panel mt-6 flex flex-col items-center gap-3 p-10 text-center"><ClipboardCheck className="h-12 w-12 text-border" /><p className="font-bold text-ink">No exams available yet</p><p className="text-sm text-muted">Published exams from your instructor will appear here.</p></div> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items?.map((exam) => (
          <Link key={exam.id} href={`/dashboard/exams/${exam.id}`} className="panel block p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4"><div><h3 className="font-extrabold text-ink">{exam.title}</h3><p className="mt-1 text-sm text-muted">{exam.questionCount} questions</p></div><ClipboardCheck className="h-5 w-5 shrink-0 text-brand" /></div>
            {exam.description ? <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{exam.description}</p> : null}
            <div className="mt-5 border-t border-border pt-4 text-sm font-bold text-brand">{exam.attempted ? `Score: ${exam.score}/${exam.total} (${exam.percent}%)` : 'Start exam →'}</div>
          </Link>
        ))}
      </div>
    </main>
  </>;
}
