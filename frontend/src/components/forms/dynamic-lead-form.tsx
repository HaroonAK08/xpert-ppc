'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

import { Field, Label } from '@/components/ui/input';
import { API_URL, api } from '@/lib/api';
import { getVisitorId } from '@/lib/visitor';
import { cn } from '@/lib/utils';

type RemoteField = {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  options: string[];
};

type RemoteForm = {
  id: string;
  name: string;
  description: string;
  badgeText: string;
  submitLabel: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  cornerRadius: number;
  spacing: number;
  fontSize: 'sm' | 'md' | 'lg';
  successMessage: string;
  successRedirectUrl: string;
  fields: RemoteField[];
};

const STANDARD_KEYS = new Set(['name', 'email', 'phone', 'company', 'message']);
const FONT_SIZE_CLASS: Record<RemoteForm['fontSize'], string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/** Neutral fields that match the CRM form-builder preview (not the marketing site dark theme). */
const fieldClass =
  'w-full border border-black/10 bg-black/[0.03] px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-black/25 focus:bg-white';


/** Renders whatever fields the admin picked in the form builder — see backend/src/routes/publicForms.ts. */
export function DynamicLeadForm({ formId, className }: { formId: string; className?: string }) {
  const uid = useId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RemoteForm | null>(null);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/forms/${formId}`)
      .then((r) => r.json())
      .then((body) => {
        if (body?.data) setForm(body.data);
        else setLoadError(body?.error || 'This form is not available.');
      })
      .catch(() => setLoadError('This form is not available.'));
  }, [formId]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    setStatus('sending');
    setError('');

    const fd = new FormData(e.currentTarget);
    const honeypot = String(fd.get('companyWebsite') || '').trim();

    const customFields: Record<string, string> = {};
    const payload: Record<string, unknown> = {
      companyWebsite: honeypot,
      visitorId: getVisitorId(),
      formId: form.id,
      source: 'embed',
      sourcePath: pathname,
      utm: {
        source: searchParams.get('utm_source') ?? '',
        medium: searchParams.get('utm_medium') ?? '',
        campaign: searchParams.get('utm_campaign') ?? '',
        term: searchParams.get('utm_term') ?? '',
        content: searchParams.get('utm_content') ?? '',
      },
    };

    for (const field of form.fields) {
      const value = String(fd.get(field.key) || '');
      if (STANDARD_KEYS.has(field.key)) {
        payload[field.key] = value;
      } else {
        customFields[field.key] = value;
      }
    }
    payload.customFields = customFields;

    const formEl = e.currentTarget;
    const result = await api.post('/api/leads', payload);

    if (!result.ok) {
      setError(result.error);
      setStatus('error');
      return;
    }

    formEl.reset();
    setStatus('done');

    const redirect = (form.successRedirectUrl || '').trim();
    if (redirect) {
      const target = /^https?:\/\//i.test(redirect) ? redirect : redirect.startsWith('/') ? redirect : `/${redirect}`;
      window.setTimeout(() => {
        window.location.assign(target);
      }, 900);
    }
  }

  if (loadError) {
    return <p className={cn('text-sm text-destructive', className)}>{loadError}</p>;
  }

  if (!form) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const radius = form.cornerRadius;
  const cardRadius = radius + 8;

  if (status === 'done') {
    return (
      <div
        className={cn(
          'border border-emerald-200/80 bg-emerald-50 p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.08)]',
          className
        )}
        style={{ borderRadius: cardRadius }}
        role="status"
      >
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          {form.successMessage || "Thank you — we've got it."}
        </h3>
        {form.successRedirectUrl ? (
          <p className="text-sm text-slate-500">Taking you to the next step…</p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        'flex flex-col shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]',
        FONT_SIZE_CLASS[form.fontSize],
        className
      )}
      style={{
        backgroundColor: form.backgroundColor,
        borderRadius: cardRadius,
        padding: 24,
      }}
    >
      <div className="mb-4">
        {form.badgeText ? (
          <span
            className="mb-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${form.buttonColor}1a`, color: form.buttonColor }}
          >
            {form.badgeText}
          </span>
        ) : null}
        <h2 className="text-lg font-extrabold tracking-tight" style={{ color: form.textColor }}>
          {form.name}
        </h2>
        {form.description ? (
          <p className="mt-1 opacity-70" style={{ color: form.textColor }}>
            {form.description}
          </p>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor={`hp-${uid}`}>Leave blank</label>
        <input id={`hp-${uid}`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col" style={{ gap: form.spacing }}>
        {form.fields.map((field) => (
          <Field key={field.key} className="space-y-1.5">
            <Label htmlFor={`${field.key}-${uid}`} className="text-xs font-semibold" style={{ color: form.textColor }}>
              {field.label}{' '}
              {field.required ? <span style={{ color: form.buttonColor }}>*</span> : null}
            </Label>
            {field.type === 'textarea' ? (
              <textarea
                id={`${field.key}-${uid}`}
                name={field.key}
                required={field.required}
                placeholder={field.placeholder || `${field.label}…`}
                className={cn(fieldClass, 'min-h-[64px] resize-y')}
                style={{ borderRadius: radius }}
              />
            ) : field.type === 'select' ? (
              <select
                id={`${field.key}-${uid}`}
                name={field.key}
                required={field.required}
                defaultValue=""
                className={cn(fieldClass, 'h-10 cursor-pointer appearance-none')}
                style={{ borderRadius: radius }}
              >
                <option value="" disabled>
                  {field.placeholder || 'Select…'}
                </option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`${field.key}-${uid}`}
                name={field.key}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder || field.label}
                autoComplete={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'on'}
                className={cn(fieldClass, 'h-10')}
                style={{ borderRadius: radius }}
              />
            )}
          </Field>
        ))}
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{ backgroundColor: form.buttonColor, borderRadius: radius }}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {form.submitLabel} <Send className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default DynamicLeadForm;
