"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ExamReview } from "@/components/dashboard/exam-review";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { adminApi } from "@/lib/admin-api";
import type { AdminAttemptList, ExamDetail } from "@/lib/exams";

function formatSubmitted(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submission time not available";
  return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function AdminExamResultsPage() {
  const params = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [data, setData] = useState<AdminAttemptList | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ page: String(page), search });
    adminApi
      .get<AdminAttemptList>(`/api/admin/academy/exams/${params.id}/attempts?${query}`)
      .then((result) => {
        if (!active) return;
        if (!result.ok) setError(result.error);
        else if (result.data.total > 0 && result.data.items.length === 0 && page > 1) {
          setPage(Math.max(1, Math.ceil(result.data.total / Math.max(result.data.pageSize, 1))));
        } else setData(result.data);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id, page, search]);

  useEffect(() => {
    let active = true;
    adminApi.get<{ item: ExamDetail }>(`/api/admin/academy/exams/${params.id}`).then((result) => {
      if (active && result.ok) setExam(result.data.item);
    });
    return () => {
      active = false;
    };
  }, [params.id]);

  function searchAttempts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / Math.max(data.pageSize, 1))) : 1;

  return (
    <>
      <AdminPageHeader
        title="Quiz results"
        subtitle={exam?.title || "Student submissions"}
        actions={
          <Link href="/admin/exams" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand">
            Back to quizzes
          </Link>
        }
      />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        <form onSubmit={searchAttempts} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="attempt-search">Search students</Label>
            <Input
              id="attempt-search"
              type="search"
              maxLength={160}
              placeholder="Name or email address"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" className="min-h-11" disabled={loading}>
            Search
          </Button>
        </form>
        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p role="status" className="inline-flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading results…
          </p>
        ) : null}
        {!loading && data && data.items.length === 0 ? (
          <div className="panel p-6 text-sm text-muted">
            {search ? "No submissions match this search." : "No submissions yet."}
          </div>
        ) : null}
        <div className="space-y-4">
          {data?.items.map((attempt) => (
            <article key={attempt.id} className="panel space-y-4 p-5">
              <div className="min-w-0">
                <h2 className="break-words text-base font-extrabold text-ink">{attempt.studentName || "Student"}</h2>
                <p className="mt-1 break-words text-sm text-muted">{attempt.studentEmail}</p>
                <p className="mt-2 text-sm text-ink">
                  Score: {attempt.score} of {attempt.total} · {attempt.percent}%
                </p>
                <p className="mt-1 text-xs text-muted">Submitted {formatSubmitted(attempt.submittedAt)}</p>
              </div>
              {attempt.questions?.length ? <ExamReview questions={attempt.questions} /> : (
                <p className="text-sm text-muted">Answer review is not available for this submission.</p>
              )}
            </article>
          ))}
        </div>
        {data && data.total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Page {page} of {pages}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="min-h-11" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>
                Previous
              </Button>
              <Button type="button" variant="outline" className="min-h-11" disabled={page >= pages || loading} onClick={() => setPage((value) => value + 1)}>
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
