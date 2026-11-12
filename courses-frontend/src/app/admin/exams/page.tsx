"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ClipboardCheck, Loader2, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { parseExamImport, type ImportIssue } from "@/lib/parse-exam-import";
import { adminApi } from "@/lib/admin-api";
import type { ExamListItem } from "@/lib/exams";

type Question = { prompt: string; options: string[]; correctIndex: number };
const blankQuestion = (): Question => ({
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

export default function AdminExamsPage() {
  const [items, setItems] = useState<ExamListItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [importText, setImportText] = useState("");
  const [importIssues, setImportIssues] = useState<ImportIssue[]>([]);
  const [importWarnings, setImportWarnings] = useState<ImportIssue[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const result = await adminApi.get<{ items: ExamListItem[] }>(
      "/api/admin/academy/exams",
    );
    if (result.ok) setItems(result.data.items);
    else setError(result.error);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function updateQuestion(index: number, update: Partial<Question>) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === index ? { ...question, ...update } : question,
      ),
    );
  }
  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    );
  }
  function importQuestions(text: string) {
    const parsed = parseExamImport(text);
    setImportIssues(parsed.errors);
    setImportWarnings(parsed.warnings);
    if (parsed.errors.length) return;
    if (
      (title.trim() || questions.some((question) => question.prompt.trim())) &&
      !window.confirm(
        `Replace the current draft with ${parsed.questions.length} imported questions?`,
      )
    )
      return;
    setTitle(parsed.title);
    setQuestions(parsed.questions);
    setImportText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus(
      `Imported ${parsed.questions.length} questions. Review them, then publish.`,
    );
  }
  function readImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setImportIssues([{ message: "Upload a .txt or .md file." }]);
      return;
    }
    if (file.size > 200 * 1024) {
      setImportIssues([
        { message: "The import file must be 200 KB or smaller." },
      ]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => importQuestions(String(reader.result || ""));
    reader.readAsText(file);
  }
  async function createExam(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setStatus("");
    const result = await adminApi.post("/api/admin/academy/exams", {
      title: title.trim(),
      description: description.trim(),
      questions,
      published: true,
    });
    if (result.ok) {
      setTitle("");
      setDescription("");
      setQuestions([blankQuestion()]);
      setStatus("Quiz published for approved students.");
      await load();
    } else setError(result.error);
    setBusy(false);
  }
  async function toggle(exam: ExamListItem) {
    const result = await adminApi.patch(`/api/admin/academy/exams/${exam.id}`, {
      published: !exam.published,
    });
    if (result.ok) await load();
    else setError(result.error);
  }
  async function remove(exam: ExamListItem) {
    if (!window.confirm(`Delete “${exam.title}”?`)) return;
    const result = await adminApi.delete(`/api/admin/academy/exams/${exam.id}`);
    if (result.ok) await load();
    else setError(result.error);
  }

  return (
    <>
      <AdminPageHeader
        title="Quizzes"
        subtitle="Create MCQ quizzes and review student scores."
      />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
        {status ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {status}
          </p>
        ) : null}
        <form onSubmit={createExam} className="panel space-y-5 p-6 sm:p-7">
          <div>
            <h2 className="text-xl font-extrabold text-ink">Create a quiz</h2>
            <p className="mt-1 text-sm text-muted">
              All approved students can take published quizzes once.
            </p>
          </div>
          <div className="rounded-xl border border-brand/20 bg-[#f5f8ff] p-4 space-y-3">
            <div>
              <h3 className="font-bold text-ink">Import questions</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Paste text like “Q1… A)… Correct Answer: B)” or upload a
                .txt/.md file. The questions will fill the editor for review
                before publishing.
              </p>
            </div>
            <Textarea
              id="exam-import"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              rows={6}
              placeholder={
                "Digital Marketing & Freelancing – MCQs\n\nQ1. Which platform is used for SEM?\nA) Google Ads\nB) Facebook\nC) Upwork\nD) WhatsApp\nCorrect Answer: A) Google Ads"
              }
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => importQuestions(importText)}
                disabled={!importText.trim()}
              >
                Fill form from text
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={readImportFile}
                className="max-w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand"
              />
            </div>
            {importIssues.length ? (
              <div role="alert" className="space-y-1 text-xs text-red-700">
                {importIssues.map((issue, index) => (
                  <p key={`${issue.question}-${index}`}>
                    {issue.question ? `Question ${issue.question}: ` : ""}
                    {issue.message}
                  </p>
                ))}
              </div>
            ) : null}
            {importWarnings.length ? (
              <div role="status" className="space-y-1 text-xs text-amber-700">
                {importWarnings.map((issue, index) => (
                  <p key={`${issue.question}-${index}`}>
                    {issue.question ? `Question ${issue.question}: ` : ""}
                    {issue.message}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-title">Title *</Label>
              <Input
                id="exam-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Google Ads fundamentals quiz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-description">Instructions</Label>
              <Input
                id="exam-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Read each question carefully."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">Questions</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setQuestions((current) => [...current, blankQuestion()])
                }
              >
                <Plus className="h-4 w-4" />
                Add question
              </Button>
            </div>
            {questions.map((question, index) => (
              <fieldset
                key={index}
                className="rounded-xl border border-border p-4"
              >
                <legend className="px-2 text-sm font-bold text-ink">
                  Question {index + 1}
                </legend>
                <div className="space-y-3">
                  <Input
                    value={question.prompt}
                    onChange={(e) =>
                      updateQuestion(index, { prompt: e.target.value })
                    }
                    required
                    placeholder="Question text"
                  />
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctIndex === optionIndex}
                        onChange={() =>
                          updateQuestion(index, { correctIndex: optionIndex })
                        }
                      />
                      <Input
                        value={option}
                        onChange={(e) =>
                          updateOption(index, optionIndex, e.target.value)
                        }
                        required
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </label>
                  ))}
                  {questions.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs font-bold text-red-600"
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove question
                    </button>
                  ) : null}
                </div>
              </fieldset>
            ))}
          </div>
          <Button type="submit" disabled={busy || !title.trim()}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardCheck className="h-4 w-4" />
            )}
            Publish quiz
          </Button>
        </form>
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-ink">Quiz library</h2>
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : items.length === 0 ? (
            <div className="panel p-6 text-sm text-muted">
              No quizzes created yet.
            </div>
          ) : (
            items.map((exam) => (
              <article
                key={exam.id}
                className="panel flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <h3 className="font-bold text-ink">{exam.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {exam.questionCount} questions · {exam.attemptCount || 0}{" "}
                    submissions · {exam.published ? "Published" : "Hidden"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-brand/40 hover:text-brand"
                  >
                    Results
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggle(exam)}
                  >
                    {exam.published ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(exam)}
                    disabled={(exam.attemptCount || 0) > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}
