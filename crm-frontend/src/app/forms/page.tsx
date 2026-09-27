'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  FilePlus2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { MARKETING_SITE_URL, snippetFor, type LeadForm } from './types';

export default function FormsListPage() {
  const [forms, setForms] = useState<LeadForm[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  async function load() {
    const res = await api.get<LeadForm[]>('/api/v1/forms');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setForms(res.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggle(form: LeadForm) {
    setBusyId(form.id);
    await api.patch(`/api/v1/forms/${form.id}`, { enabled: !form.enabled });
    await load();
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this form? Embeds using it will stop working.')) return;
    setBusyId(id);
    await api.delete(`/api/v1/forms/${id}`);
    if (previewId === id) setPreviewId(null);
    await load();
    setBusyId(null);
  }

  async function copy(formId: string) {
    await navigator.clipboard.writeText(snippetFor(formId));
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!forms) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const enabledCount = forms.filter((f) => f.enabled).length;

  return (
    <div className="page">
      <PageHeader
        title="Form builder"
        description="Your lead capture forms — design once, embed anywhere, every submission lands in Leads."
      >
        <Link
          href="/forms/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-[#155fd6]"
        >
          <Plus className="h-4 w-4" /> Create new
        </Link>
      </PageHeader>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="text-xs font-medium text-muted">Forms</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{forms.length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs font-medium text-muted">Live now</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{enabledCount}</p>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Embed-ready</p>
            <p className="text-xs text-muted">One snippet per form</p>
          </div>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      {forms.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <FilePlus2 className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Create your first lead form</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Pick fields, style the form, set what happens after submit, then paste the embed code on any page.
          </p>
          <Link
            href="/forms/new"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 hover:bg-[#155fd6]"
          >
            <Plus className="h-4 w-4" /> Create new form
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {forms.map((form) => (
            <article key={form.id} className="panel overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: form.buttonColor }} />
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold tracking-tight text-ink">{form.name}</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      {form.fields.length} field{form.fields.length === 1 ? '' : 's'}
                      {form.description ? ` · ${form.description}` : ''}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted" title={form.id}>
                      ID {form.id}
                    </p>
                    {form.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {form.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={busyId === form.id}
                      onClick={() => void toggle(form)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        form.enabled
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                          : 'bg-canvas text-muted ring-1 ring-border'
                      }`}
                    >
                      {form.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <Link
                      href={`/forms/${form.id}`}
                      className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-brand"
                      aria-label="Edit form"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === form.id}
                      onClick={() => void remove(form.id)}
                      className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-red-600"
                      aria-label="Delete form"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-canvas p-2.5">
                  <code className="flex-1 overflow-x-auto whitespace-nowrap text-[11px] text-ink">
                    {snippetFor(form.id)}
                  </code>
                  <button
                    type="button"
                    onClick={() => void copy(form.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-[11px] font-bold text-brand-foreground"
                  >
                    {copiedId === form.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === form.id ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/forms/${form.id}`} className="text-xs font-semibold text-brand hover:underline">
                    Open in studio
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPreviewId(previewId === form.id ? null : form.id)}
                    className="text-xs font-semibold text-muted hover:text-ink"
                  >
                    {previewId === form.id ? 'Hide preview' : 'Show preview'}
                  </button>
                  <a
                    href={`${MARKETING_SITE_URL}/embed/lead-form?form=${form.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink"
                  >
                    Live page <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {previewId === form.id ? (
                  <iframe
                    src={`${MARKETING_SITE_URL}/embed/lead-form?form=${form.id}`}
                    title={`${form.name} preview`}
                    className="mt-4 w-full rounded-xl border border-border bg-white"
                    style={{ height: 460 }}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
