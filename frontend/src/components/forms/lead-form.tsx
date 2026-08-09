'use client';

import { useId, useState, type FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Field, Input, Label, Select, Textarea } from '@/components/ui/input';
import { trackLeadConversion } from '@/lib/analytics';
import { api } from '@/lib/api';
import { PLATFORMS, type LEAD_SOURCES } from '@/lib/validation';
import { cn } from '@/lib/utils';

type Variant = 'audit' | 'contact';

type Props = {
  variant?: Variant;
  source: (typeof LEAD_SOURCES)[number];
  /** Preselects the platform dropdown, e.g. on a service page. */
  defaultPlatform?: string;
  submitLabel?: string;
  className?: string;
};

const AUDIT_PLATFORMS = ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Amazon Ads', 'Other'] as const;

export function LeadForm({
  variant = 'contact',
  source,
  defaultPlatform,
  submitLabel,
  className,
}: Props) {
  const uid = useId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const isAudit = variant === 'audit';
  const platformOptions = isAudit ? AUDIT_PLATFORMS : PLATFORMS.filter((p) => p !== 'Other');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      platform: String(fd.get('platform') || 'Other'),
      message: String(fd.get('message') || ''),
      companyWebsite: String(fd.get('companyWebsite') || ''),
      source,
      sourcePath: pathname,
      utm: {
        source: searchParams.get('utm_source') ?? '',
        medium: searchParams.get('utm_medium') ?? '',
        campaign: searchParams.get('utm_campaign') ?? '',
        term: searchParams.get('utm_term') ?? '',
        content: searchParams.get('utm_content') ?? '',
      },
    };

    // Grab the form before awaiting — React clears currentTarget after the tick.
    const form = e.currentTarget;
    const result = await api.post('/api/leads', payload);

    if (!result.ok) {
      setError(result.error);
      setStatus('error');
      return;
    }

    trackLeadConversion({
      source,
      platform: payload.platform,
    });

    form.reset();
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div
        className={cn(
          'rounded-2xl border border-success/40 bg-success/10 p-8 text-center',
          className
        )}
        role="status"
      >
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-success" />
        <h3 className="mb-2 text-lg font-bold text-foreground">Thank you — we&apos;ve got it.</h3>
        <p className="text-sm text-muted-foreground">
          A specialist will reach out within one business day. Need it sooner? Message us on
          WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)} noValidate>
      {/* Honeypot: visually hidden, ignored by users, filled by bots. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`cw-${uid}`}>Company website</label>
        <input id={`cw-${uid}`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field>
        <Label htmlFor={`name-${uid}`}>{isAudit ? 'Full Name *' : 'Name *'}</Label>
        <Input
          id={`name-${uid}`}
          name="name"
          required
          autoComplete="name"
          placeholder={isAudit ? 'Jane Doe' : 'Your name'}
        />
      </Field>

      <Field>
        <Label htmlFor={`email-${uid}`}>{isAudit ? 'Work Email *' : 'Email *'}</Label>
        <Input
          id={`email-${uid}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={isAudit ? 'jane@company.com' : 'you@company.com'}
        />
      </Field>

      <Field>
        <Label htmlFor={`phone-${uid}`}>{isAudit ? 'Phone (optional)' : 'Phone *'}</Label>
        <Input
          id={`phone-${uid}`}
          name="phone"
          type="tel"
          required={!isAudit}
          autoComplete="tel"
          placeholder="+971 5X XXX XXXX"
        />
      </Field>

      <Field>
        <Label htmlFor={`platform-${uid}`}>
          {isAudit ? 'Platform Focus *' : 'Service interest *'}
        </Label>
        <Select
          id={`platform-${uid}`}
          name="platform"
          required
          defaultValue={defaultPlatform ?? ''}
        >
          <option value="" disabled>
            {isAudit ? 'Select a platform' : 'Select a service'}
          </option>
          {platformOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label htmlFor={`message-${uid}`}>
          {isAudit ? 'Goals / brief (optional)' : 'Message *'}
        </Label>
        <Textarea
          id={`message-${uid}`}
          name="message"
          required={!isAudit}
          placeholder={isAudit ? 'What are you trying to improve?' : 'Tell us about your goals'}
        />
      </Field>

      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-hover-effect inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          submitLabel ?? (isAudit ? 'Get My Free Audit' : 'Send Message')
        )}
      </button>
    </form>
  );
}

export default LeadForm;
