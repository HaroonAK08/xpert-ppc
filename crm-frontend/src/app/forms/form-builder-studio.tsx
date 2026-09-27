'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  SlidersHorizontal,
  Trash2,
  User,
} from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STANDARD_FORM_FIELDS } from '@shared/crm/constants';
import { ColorField } from './color-field';
import { FormLivePreview } from './form-preview';
import {
  DEFAULT_BUILDER_STATE,
  FORM_TAG_PRESETS,
  leadFormToBuilder,
  snippetFor,
  MARKETING_SITE_URL,
  type BuilderField,
  type BuilderState,
  type CustomFieldDefinition,
  type LeadForm,
} from './types';

const RADIUS_PRESETS = [0, 4, 8, 12, 16];
const FONT_SIZES = [
  { key: 'sm', label: 'S' },
  { key: 'md', label: 'M' },
  { key: 'lg', label: 'L' },
] as const;

const FIELD_ICONS: Record<string, typeof User> = {
  name: User,
  email: Mail,
  phone: Phone,
  company: Building2,
  message: MessageSquare,
};

type StudioTab = 'fields' | 'design' | 'publish';

function slugify(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return /^[a-z]/.test(base) ? base : `f_${base}`;
}

export function FormBuilderStudio({
  mode,
  formId,
}: {
  mode: 'create' | 'edit';
  formId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === 'edit');
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);
  const [state, setState] = useState<BuilderState>(DEFAULT_BUILDER_STATE);
  const [enabled, setEnabled] = useState(true);
  const [tab, setTab] = useState<StudioTab>('fields');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [creatingField, setCreatingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'date' | 'select'>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [savedId, setSavedId] = useState<string | null>(formId ?? null);
  const [customTag, setCustomTag] = useState('');

  const locked = useMemo(() => state.fields.filter((f) => f.locked), [state.fields]);
  const unlocked = useMemo(() => state.fields.filter((f) => !f.locked), [state.fields]);
  const selected = state.fields.find((f) => f.key === selectedKey) || null;
  const paletteStandard = STANDARD_FORM_FIELDS.filter((f) => !f.locked);

  useEffect(() => {
    let active = true;
    (async () => {
      const fieldsRes = await api.get<CustomFieldDefinition[]>('/api/v1/custom-fields');
      if (!active) return;
      if (fieldsRes.ok) setCustomFields(fieldsRes.data);

      if (mode === 'edit' && formId) {
        const formRes = await api.get<LeadForm>(`/api/v1/forms/${formId}`);
        if (!active) return;
        if (!formRes.ok) {
          setError(formRes.error);
          setLoading(false);
          return;
        }
        const customs = fieldsRes.ok ? fieldsRes.data : [];
        setState(leadFormToBuilder(formRes.data, customs));
        setEnabled(formRes.data.enabled);
        setSavedId(formRes.data.id);

        try {
          const justCreated = sessionStorage.getItem('xpertppc:form-created');
          if (justCreated === formRes.data.id) {
            sessionStorage.removeItem('xpertppc:form-created');
            setTab('publish');
            setSuccess('Form created. Copy the embed snippet below to put it on your site.');
          }
        } catch {
          /* sessionStorage unavailable */
        }
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mode, formId]);

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(''), 4000);
    return () => window.clearTimeout(t);
  }, [success]);

  function patch(partial: Partial<BuilderState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function isAdded(key: string) {
    return state.fields.some((f) => f.key === key);
  }

  function addPaletteField(key: string, standard: boolean, label: string, type: string) {
    if (isAdded(key)) {
      setState((prev) => ({
        ...prev,
        fields: prev.fields.filter((f) => f.key !== key),
      }));
      if (selectedKey === key) setSelectedKey(null);
      return;
    }
    setState((prev) => ({
      ...prev,
      fields: [...prev.fields, { key, standard, locked: false, label, placeholder: '', type, required: false }],
    }));
  }

  function updateField(key: string, fieldPatch: Partial<BuilderField>) {
    setState((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.key === key ? { ...f, ...fieldPatch } : f)),
    }));
  }

  function removeField(key: string) {
    setState((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.key !== key) }));
    if (selectedKey === key) setSelectedKey(null);
  }

  function moveField(key: string, dir: -1 | 1) {
    setState((prev) => {
      const idx = prev.fields.findIndex((f) => f.key === key);
      const lockedCount = prev.fields.filter((f) => f.locked).length;
      const target = idx + dir;
      if (target < lockedCount || target >= prev.fields.length) return prev;
      const next = [...prev.fields];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...prev, fields: next };
    });
  }

  async function createCustomField() {
    if (!newFieldLabel.trim()) return;
    const key = slugify(newFieldLabel);
    const options =
      newFieldType === 'select' ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean) : [];
    const res = await api.post<CustomFieldDefinition>('/api/v1/custom-fields', {
      key,
      label: newFieldLabel.trim(),
      type: newFieldType,
      options,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCustomFields((prev) => [...prev, res.data]);
    addPaletteField(res.data.key, false, res.data.label, newFieldType);
    setNewFieldLabel('');
    setNewFieldOptions('');
    setCreatingField(false);
  }

  async function save(andStay = true) {
    if (!state.name.trim()) {
      setError('Give this form a name first.');
      setTab('fields');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      name: state.name.trim(),
      description: state.description.trim(),
      badgeText: state.badgeText.trim() || 'Contact',
      submitLabel: state.submitLabel.trim() || 'Send',
      buttonColor: state.buttonColor,
      backgroundColor: state.backgroundColor,
      textColor: state.textColor,
      cornerRadius: state.cornerRadius,
      spacing: state.spacing,
      fontSize: state.fontSize,
      successMessage: state.successMessage.trim() || DEFAULT_BUILDER_STATE.successMessage,
      successRedirectUrl: state.successRedirectUrl.trim(),
      tags: state.tags,
      enabled,
      fields: state.fields.map((f) => ({
        key: f.key,
        standard: f.standard,
        required: f.required,
        label: f.label,
        placeholder: f.placeholder,
      })),
    };

    try {
      const res =
        mode === 'edit' && formId
          ? await api.patch<LeadForm>(`/api/v1/forms/${formId}`, payload)
          : await api.post<LeadForm>('/api/v1/forms', payload);

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSavedId(res.data.id);
      if (!andStay) {
        router.push('/forms');
        return;
      }
      if (mode === 'create') {
        try {
          sessionStorage.setItem('xpertppc:form-created', res.data.id);
        } catch {
          /* ignore */
        }
        router.replace(`/forms/${res.data.id}`);
        return;
      }
      setSuccess('Changes saved.');
    } finally {
      setSaving(false);
    }
  }

  async function copySnippet() {
    if (!savedId) return;
    await navigator.clipboard.writeText(snippetFor(savedId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-col">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-5 py-3 sm:px-8">
          <Link
            href="/forms"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted hover:bg-surface hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Forms
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {mode === 'create' ? 'Create form' : state.name || 'Edit form'}
            </p>
            <p className="truncate text-xs text-muted">
              {savedId ? (
                <>
                  Form ID <span className="font-mono text-ink/70">{savedId}</span>
                </>
              ) : (
                'Fields, design, and what happens after someone submits.'
              )}
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setEnabled((v) => !v)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                enabled ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-canvas text-muted ring-1 ring-border'
              }`}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </button>
            <Button variant="outline" size="sm" onClick={() => router.push('/forms')}>
              {mode === 'create' ? 'Cancel' : 'Back'}
            </Button>
            <Button size="sm" disabled={saving || !state.name.trim()} onClick={() => void save(true)}>
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : success && mode === 'edit' ? (
                <Check className="h-3.5 w-3.5" />
              ) : null}
              {saving
                ? 'Saving…'
                : success && mode === 'edit'
                  ? 'Saved'
                  : mode === 'create'
                    ? 'Create form'
                    : 'Save changes'}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 gap-0 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <aside className="border-b border-border bg-surface lg:border-b-0 lg:border-r">
          <div className="p-5 sm:p-6">
            <div className="mb-5 space-y-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Form name
                </label>
                <Input
                  value={state.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Project inquiry"
                  className="bg-canvas"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Subheading
                </label>
                <Input
                  value={state.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="Tell us a little about your project"
                  className="bg-canvas"
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Tags <span className="font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <span className="text-[10px] text-muted">CRM only — not on the public form</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FORM_TAG_PRESETS.map((tag) => {
                    const active = state.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          patch({
                            tags: active
                              ? state.tags.filter((t) => t !== tag)
                              : [...state.tags, tag].slice(0, 12),
                          })
                        }
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                          active
                            ? 'bg-brand/10 text-brand ring-1 ring-brand/25'
                            : 'bg-canvas text-muted ring-1 ring-border hover:text-ink'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  {state.tags
                    .filter((t) => !(FORM_TAG_PRESETS as readonly string[]).includes(t))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => patch({ tags: state.tags.filter((t) => t !== tag) })}
                        className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand ring-1 ring-brand/25"
                      >
                        {tag} ×
                      </button>
                    ))}
                </div>
                <div className="mt-2 flex gap-1.5">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      const next = customTag.trim();
                      if (!next || state.tags.includes(next)) return;
                      patch({ tags: [...state.tags, next].slice(0, 12) });
                      setCustomTag('');
                    }}
                    placeholder="Custom tag…"
                    className="bg-canvas"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!customTag.trim()}
                    onClick={() => {
                      const next = customTag.trim();
                      if (!next || state.tags.includes(next)) return;
                      patch({ tags: [...state.tags, next].slice(0, 12) });
                      setCustomTag('');
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-5 flex gap-1 rounded-xl border border-border bg-canvas p-1">
              {(
                [
                  ['fields', 'Fields'],
                  ['design', 'Design'],
                  ['publish', 'Submit & embed'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold ${
                    tab === key ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {error ? (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                {success}
              </p>
            ) : null}

            {tab === 'fields' ? (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Add fields</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {paletteStandard.map((f) => {
                      const Icon = FIELD_ICONS[f.key] || SlidersHorizontal;
                      const active = isAdded(f.key);
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => addPaletteField(f.key, true, f.label, f.type)}
                          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                            active
                              ? 'border-brand bg-brand/10 text-brand'
                              : 'border-border bg-canvas text-ink hover:border-brand/40'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{f.label}</span>
                        </button>
                      );
                    })}
                    {customFields.map((f) => {
                      const active = isAdded(f.key);
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => addPaletteField(f.key, false, f.label, f.type)}
                          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                            active
                              ? 'border-brand bg-brand/10 text-brand'
                              : 'border-border bg-canvas text-ink hover:border-brand/40'
                          }`}
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{f.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {creatingField ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <div className="space-y-2 rounded-xl border border-dashed border-brand/40 bg-brand/5 p-2.5">
                          <input
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            placeholder="New property, e.g. Budget"
                            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
                          />
                          <div className="flex gap-1.5">
                            <select
                              value={newFieldType}
                              onChange={(e) => setNewFieldType(e.target.value as typeof newFieldType)}
                              className="flex-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Dropdown</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => void createCustomField()}
                              disabled={!newFieldLabel.trim()}
                              className="rounded-lg bg-brand px-2.5 text-xs font-bold text-brand-foreground disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                          {newFieldType === 'select' ? (
                            <input
                              value={newFieldOptions}
                              onChange={(e) => setNewFieldOptions(e.target.value)}
                              placeholder="Options, comma separated"
                              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
                            />
                          ) : null}
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCreatingField(true)}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted hover:border-brand/40 hover:text-brand"
                      >
                        <Plus className="h-3.5 w-3.5" /> New property
                      </button>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Form fields</p>
                  <div className="space-y-1.5">
                    {locked.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setSelectedKey(f.key)}
                        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                          selectedKey === f.key ? 'border-brand bg-brand/5' : 'border-transparent bg-canvas'
                        }`}
                      >
                        <Lock className="h-3 w-3 shrink-0 text-muted" />
                        <span className="flex-1 truncate text-ink">{f.label}</span>
                        <span className="text-[10px] text-muted">Required</span>
                      </button>
                    ))}

                    <Reorder.Group
                      axis="y"
                      values={unlocked}
                      onReorder={(newOrder) => patch({ fields: [...locked, ...newOrder] })}
                      className="space-y-1.5"
                    >
                      {unlocked.map((f) => {
                        const Icon = f.standard ? FIELD_ICONS[f.key] || SlidersHorizontal : SlidersHorizontal;
                        return (
                          <Reorder.Item
                            key={f.key}
                            value={f}
                            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm ${
                              selectedKey === f.key ? 'border-brand bg-brand/5' : 'border-border bg-canvas'
                            }`}
                          >
                            <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted" />
                            <button
                              type="button"
                              onClick={() => setSelectedKey(f.key)}
                              className="flex flex-1 items-center gap-2 truncate text-left text-ink"
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{f.label}</span>
                            </button>
                            {f.required ? <span className="text-[10px] font-bold text-brand">*</span> : null}
                            <button
                              type="button"
                              onClick={() => removeField(f.key)}
                              className="shrink-0 text-muted hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </Reorder.Item>
                        );
                      })}
                    </Reorder.Group>

                    {unlocked.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted">
                        Add a field above to include it.
                      </p>
                    ) : null}
                  </div>
                </div>

                <AnimatePresence>
                  {selected ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-border bg-canvas p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wide text-muted">Field settings</p>
                          {!selected.locked ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveField(selected.key, -1)}
                                className="rounded p-1 text-muted hover:bg-surface hover:text-ink"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveField(selected.key, 1)}
                                className="rounded p-1 text-muted hover:bg-surface hover:text-ink"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <label className="mb-1 block text-[11px] font-semibold text-muted">Label</label>
                        <input
                          value={selected.label}
                          onChange={(e) => updateField(selected.key, { label: e.target.value })}
                          className="mb-2 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand"
                        />

                        <label className="mb-1 block text-[11px] font-semibold text-muted">Placeholder</label>
                        <input
                          value={selected.placeholder}
                          onChange={(e) => updateField(selected.key, { placeholder: e.target.value })}
                          className="mb-3 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand"
                        />

                        <label className="flex items-center justify-between text-sm">
                          <span className="text-ink">Required</span>
                          <button
                            type="button"
                            disabled={selected.locked}
                            onClick={() => updateField(selected.key, { required: !selected.required })}
                            className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                              selected.required ? 'bg-brand' : 'bg-border'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                selected.required ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </label>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            {tab === 'design' ? (
              <div className="space-y-5">
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-muted">Badge text</p>
                  <Input
                    value={state.badgeText}
                    onChange={(e) => patch({ badgeText: e.target.value })}
                    placeholder="Contact"
                    className="bg-canvas"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-muted">Submit button label</p>
                  <Input
                    value={state.submitLabel}
                    onChange={(e) => patch({ submitLabel: e.target.value })}
                    className="bg-canvas"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ColorField label="Button" value={state.buttonColor} onChange={(v) => patch({ buttonColor: v })} />
                  <ColorField
                    label="Background"
                    value={state.backgroundColor}
                    onChange={(v) => patch({ backgroundColor: v })}
                  />
                  <ColorField label="Text" value={state.textColor} onChange={(v) => patch({ textColor: v })} />
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-muted">Corner radius</p>
                  <div className="flex gap-1.5">
                    {RADIUS_PRESETS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => patch({ cornerRadius: r })}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                          state.cornerRadius === r
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-border bg-canvas text-muted'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-muted">Spacing</p>
                    <p className="text-[11px] font-semibold text-muted">{state.spacing}px</p>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={32}
                    step={2}
                    value={state.spacing}
                    onChange={(e) => patch({ spacing: Number(e.target.value) })}
                    className="w-full accent-brand"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-muted">Type scale</p>
                  <div className="flex gap-1.5">
                    {FONT_SIZES.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => patch({ fontSize: s.key })}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                          state.fontSize === s.key
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-border bg-canvas text-muted'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {tab === 'publish' ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-canvas p-4">
                  <p className="mb-1 text-sm font-semibold text-ink">After someone submits</p>
                  <p className="mb-4 text-xs text-muted">
                    Show a thank-you message, and optionally send them to a page or URL.
                  </p>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted">Success message</label>
                  <textarea
                    value={state.successMessage}
                    onChange={(e) => patch({ successMessage: e.target.value })}
                    rows={3}
                    className="mb-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted">
                    Redirect path or URL (optional)
                  </label>
                  <Input
                    value={state.successRedirectUrl}
                    onChange={(e) => patch({ successRedirectUrl: e.target.value })}
                    placeholder="/thank-you or https://…"
                    className="bg-surface"
                  />
                  <p className="mt-1.5 text-[11px] text-muted">
                    Leave blank to stay on the form. Relative paths work on your site.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-canvas p-4">
                  <p className="mb-1 text-sm font-semibold text-ink">Embed on any page</p>
                  <p className="mb-3 text-xs text-muted">
                    Paste this snippet where you want the form. Submissions land in Leads.
                  </p>
                  {savedId ? (
                    <>
                      <div className="mb-3 flex items-start gap-2 rounded-xl border border-border bg-surface p-3">
                        <code className="flex-1 overflow-x-auto whitespace-pre-wrap break-all text-[11px] text-ink">
                          {snippetFor(savedId)}
                        </code>
                        <button
                          type="button"
                          onClick={() => void copySnippet()}
                          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[11px] font-bold text-brand-foreground"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <a
                        href={`${MARKETING_SITE_URL}/embed/lead-form?form=${savedId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                      >
                        Open live preview <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </>
                  ) : (
                    <p className="rounded-xl border border-dashed border-border bg-surface p-3 text-xs text-muted">
                      Save the form once to generate the embed snippet.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex gap-2 sm:hidden">
              <Button variant="outline" className="flex-1" onClick={() => router.push('/forms')}>
                {mode === 'create' ? 'Cancel' : 'Back'}
              </Button>
              <Button className="flex-1" disabled={saving || !state.name.trim()} onClick={() => void save(true)}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success && mode === 'edit' ? (
                  <Check className="h-4 w-4" />
                ) : null}
                {saving
                  ? 'Saving…'
                  : success && mode === 'edit'
                    ? 'Saved'
                    : mode === 'create'
                      ? 'Create'
                      : 'Save'}
              </Button>
            </div>
          </div>
        </aside>

        <section className="min-h-[520px] p-5 sm:p-8">
          <FormLivePreview
            name={state.name}
            description={state.description}
            badgeText={state.badgeText}
            submitLabel={state.submitLabel}
            buttonColor={state.buttonColor}
            backgroundColor={state.backgroundColor}
            textColor={state.textColor}
            cornerRadius={state.cornerRadius}
            spacing={state.spacing}
            fontSize={state.fontSize}
            fields={state.fields}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
            className="h-full"
          />
        </section>
      </div>
    </div>
  );
}
