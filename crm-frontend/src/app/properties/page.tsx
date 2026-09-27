'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

type FieldType = 'text' | 'number' | 'date' | 'select';

type CustomFieldDefinition = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  options: string[];
  order: number;
};

const TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  select: 'Dropdown',
};

export default function PropertiesSettingsPage() {
  const [defs, setDefs] = useState<CustomFieldDefinition[] | null>(null);
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [optionsText, setOptionsText] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get<CustomFieldDefinition[]>('/api/v1/custom-fields');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDefs(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!key.trim() || !label.trim()) return;
    setSaving(true);
    setError('');
    const options = type === 'select' ? optionsText.split(',').map((o) => o.trim()).filter(Boolean) : [];
    const res = await api.post('/api/v1/custom-fields', { key: key.trim(), label: label.trim(), type, options });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setKey('');
    setLabel('');
    setOptionsText('');
    setType('text');
    load();
  }

  async function remove(id: string) {
    setSaving(true);
    await api.delete(`/api/v1/custom-fields/${id}`);
    setSaving(false);
    load();
  }

  if (!defs) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title mb-2">Custom properties</h1>
      <p className="mb-8 text-sm text-muted">Extra fields that show up on every lead.</p>
      <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="mb-1 text-sm font-semibold text-ink">Custom lead properties</p>
        <p className="mb-4 text-sm text-muted">
          Extra fields shown on every lead — e.g. Industry, Deal size. Values are edited from the
          lead detail page.
        </p>

        <ul className="mb-4 space-y-2">
          {defs.map((def) => (
            <li
              key={def.id}
              className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3"
            >
              <div>
                <span className="text-sm font-semibold text-ink">{def.label}</span>
                <span className="ml-2 text-xs text-muted">
                  {def.key} · {TYPE_LABELS[def.type]}
                  {def.type === 'select' && def.options.length ? ` (${def.options.join(', ')})` : ''}
                </span>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => remove(def.id)}
                className="text-muted hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {defs.length === 0 ? <p className="text-sm text-muted">No custom properties yet.</p> : null}
        </ul>

        {error ? <p className="mb-3 text-sm font-medium text-red-600">{error}</p> : null}

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_140px_auto]">
          <Input
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              setKey(e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''));
            }}
            placeholder="Label, e.g. Industry"
            className="bg-canvas"
          />
          <Input
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder={type === 'select' ? 'Options, comma separated' : 'Not applicable'}
            disabled={type !== 'select'}
            className="bg-canvas"
          />
          <Select value={type} onChange={(e) => setType(e.target.value as FieldType)} className="bg-canvas">
            {(Object.keys(TYPE_LABELS) as FieldType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
          <Button disabled={saving || !label.trim()} onClick={create}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
