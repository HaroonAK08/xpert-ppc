'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/page-header';
import { useStudent } from '@/lib/student-context';
import { api } from '@/lib/api';
import type { ExamAttempt, ExamDetail } from '@/lib/exams';

export default function ExamPage() {
  const params = useParams<{ id: string }>();
  const student = useStudent();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const result = await api.get<{ exam: ExamDetail; attempt: ExamAttempt | null }>(`/api/student/exams/${params.id}`);
    if (result.ok) { setExam(result.data.exam); setAttempt(result.data.attempt); } else setError(result.error);
    setLoading(false);
  }
  useEffect(() => { load(); }, [params.id]);

  const complete = exam ? exam.questions.every((question) => answers[question.id] !== undefined) : false;
  const selected = useMemo(() => exam?.questions.map((question) => answers[question.id] ?? -1) || [], [answers, exam]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete || submitting) return;
    setSubmitting(true); setError('');
    const result = await api.post<{ attempt: ExamAttempt }>(`/api/student/exams/${params.id}/submit`, { answers: selected });
    if (result.ok) setAttempt(result.data.attempt);
    else if (result.status === 409) await load();
    else setError(result.error);
    setSubmitting(false);
  }

  return <>
    <DashboardPageHeader title="Quiz" />
    <main className="px-5 py-8 sm:px-8">
      {loading ? <p className="inline-flex items-center gap-2 text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {exam ? <div className="mx-auto max-w-3xl">
        <div className="panel p-6 sm:p-8"><h1 className="text-2xl font-extrabold text-ink">{exam.title}</h1><p className="mt-2 text-sm leading-relaxed text-muted">{exam.description}</p>
          <div className="mt-5 rounded-xl bg-[#f5f8ff] p-4"><label htmlFor="exam-email" className="text-xs font-bold uppercase tracking-wide text-muted">Email</label><input id="exam-email" type="email" value={student?.email || ''} readOnly className="mt-2 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink" /><p className="mt-1 text-xs text-muted">This is linked to your account and cannot be changed.</p></div>
        </div>
        {attempt ? <div className="panel mt-5 p-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><p className="mt-4 text-sm font-bold uppercase tracking-wide text-muted">Your final score</p><p className="mt-1 text-5xl font-extrabold text-brand">{attempt.percent}%</p><p className="mt-3 text-sm text-muted">{attempt.score} out of {attempt.total} correct. This quiz allows one attempt.</p></div> : <form onSubmit={submit} className="mt-5 space-y-4">
          {exam.questions.map((question, index) => <section key={question.id} className="panel p-5 sm:p-6" aria-labelledby={`question-${question.id}`}><h2 id={`question-${question.id}`} className="text-base font-extrabold leading-6 text-ink">{index + 1}. {question.prompt}</h2><div className="mt-4 space-y-2">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm text-ink hover:bg-[#f5f8ff]"><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} />{option}</label>)}</div></section>)}
          <button type="submit" disabled={!complete || submitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit quiz'}</button>
        </form>}
      </div> : null}
    </main>
  </>;
}
