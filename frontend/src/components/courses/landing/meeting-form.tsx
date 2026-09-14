'use client';

import { useId, useState, type FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { academySkills, coursesLanding } from '@shared/content/courses-landing';
import { Field, Input, Label, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const INTEREST_OPTIONS = academySkills.map((s) => s.name);

export function MeetingForm({ className }: { className?: string }) {
  const uid = useId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  function toggleInterest(name: string) {
    setInterests((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const fd = new FormData(e.currentTarget);
    const honeypot = String(fd.get('companyWebsite') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const name = String(fd.get('name') || '').trim();
    const background = String(fd.get('background') || '').trim();
    const looksLikeAutofill =
      honeypot.length > 0 &&
      (honeypot === phone || honeypot === email || honeypot === name || honeypot.includes('@'));

    const interestLine =
      interests.length > 0 ? interests.join(', ') : 'Not specified yet — discuss on call';

    const payload = {
      name,
      email,
      phone,
      platform: 'Other' as const,
      message: [
        'STUDY PORTAL — Discovery meeting request',
        `Skills interested in: ${interestLine}`,
        `Background / skillset: ${background || '—'}`,
      ].join('\n'),
      companyWebsite: looksLikeAutofill ? '' : honeypot,
      source: 'academy-meeting' as const,
      sourcePath: pathname,
      utm: {
        source: searchParams.get('utm_source') ?? '',
        medium: searchParams.get('utm_medium') ?? '',
        campaign: searchParams.get('utm_campaign') ?? '',
        term: searchParams.get('utm_term') ?? '',
        content: searchParams.get('utm_content') ?? '',
      },
    };

    const form = e.currentTarget;
    const result = await api.post('/api/leads', payload);

    if (!result.ok) {
      setError(result.error);
      setStatus('error');
      return;
    }

    form.reset();
    setInterests([]);
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div
        className={cn(
          'rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center',
          className
        )}
        role="status"
      >
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
        <h3 className="mb-2 text-lg font-bold text-slate-900">Request received</h3>
        <p className="text-sm text-slate-600">
          We&apos;ll review your background and reach out to schedule your discovery interview —
          usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)} noValidate>
      <div
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor={`hp-${uid}`}>Leave blank</label>
        <input id={`hp-${uid}`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor={`name-${uid}`} className="text-slate-700">
            Full name *
          </Label>
          <Input
            id={`name-${uid}`}
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="border-slate-200 bg-white text-slate-900"
          />
        </Field>
        <Field>
          <Label htmlFor={`email-${uid}`} className="text-slate-700">
            Email *
          </Label>
          <Input
            id={`email-${uid}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="border-slate-200 bg-white text-slate-900"
          />
        </Field>
      </div>

      <Field>
        <Label htmlFor={`phone-${uid}`} className="text-slate-700">
          WhatsApp / phone *
        </Label>
        <Input
          id={`phone-${uid}`}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+92 300 0000000"
          className="border-slate-200 bg-white text-slate-900"
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Skills you&apos;re curious about</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((name) => {
            const on = interests.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleInterest(name)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  on
                    ? 'border-[#1d6ff2] bg-[#1d6ff2]/10 text-[#1558c7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <Field>
        <Label htmlFor={`bg-${uid}`} className="text-slate-700">
          Background & current skillset *
        </Label>
        <Textarea
          id={`bg-${uid}`}
          name="background"
          required
          minLength={20}
          placeholder="What have you done so far? Student, job, freelance, tools you know, goals…"
          className="min-h-[110px] border-slate-200 bg-white text-slate-900"
        />
      </Field>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="academy-cta inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          coursesLanding.meeting.cta
        )}
      </button>
      <p className="text-center text-xs text-slate-500">{coursesLanding.meeting.finePrint}</p>
    </form>
  );
}
