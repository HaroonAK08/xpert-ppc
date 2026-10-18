'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Loader2,
  Video,
  Monitor,
  FileText,
  Users,
  CheckCircle2,
  Eye,
  EyeOff,
  BookOpen,
  UserRound,
  Upload,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { PublicCourse } from '@/lib/courses';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input, Select, Label } from '@/components/ui/input';

const REGISTRATION_FEE = 2000;
const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;

const BANK_DETAILS = {
  accountTitle: 'HAFIZ MUHAMMAD UMER KHAN',
  accountNumber: '09630010055941870015',
  iban: 'PK19ABPA0010055941870015',
};

const BENEFITS = [
  { icon: Video, title: 'Live online classes', body: 'Learn from industry experts in real time.' },
  { icon: Monitor, title: 'Practical learning', body: 'Work on real-world projects and build job-ready skills.' },
  { icon: FileText, title: 'Class recordings and resources', body: 'Revisit lessons anytime and access helpful materials.' },
  { icon: Users, title: 'A supportive learning community', body: 'Get help, ask questions and grow together.' },
];

const STEPS = [
  { step: 1, icon: BookOpen, title: 'Choose a course', detail: 'Pick the course you want to learn.' },
  { step: 2, icon: UserRound, title: 'Create your account', detail: 'Fill in your details in a few minutes.' },
  { step: 3, icon: Video, title: 'Join your live class', detail: 'Get ready and join the next batch.' },
];

export function SignupForm({ courses }: { courses: PublicCourse[] }) {
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get('course') ?? courses[0]?.slug ?? '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'accountNumber' | 'iban' | null>(null);

  async function copyBankValue(field: 'accountNumber' | 'iban', value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1600);
    } catch {
      setError('Could not copy. Please copy the bank detail manually.');
    }
  }

  useEffect(() => {
    if (!receiptFile) {
      setReceiptPreview(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  function onReceiptChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Transaction image must be an image file.');
      setStatus('error');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setError('Transaction image must be 10 MB or smaller.');
      setStatus('error');
      e.target.value = '';
      return;
    }
    setError('');
    setStatus('idle');
    setReceiptFile(file);
  }

  async function uploadReceipt(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload-image', { method: 'POST', body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Failed to upload transaction image');
    }
    return data.url;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const name = String(form.get('name') || '').trim();
    const emailValue = String(form.get('email') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();
    const country = String(form.get('country') || '').trim();
    const timezone = String(form.get('timezone') || '').trim();
    const courseSlug = String(form.get('course') || '').trim();
    const experience = String(form.get('experience') || '').trim();
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    const transactionId = String(form.get('transactionId') || '').trim();

    if (!name) {
      setError('Please enter your full name.');
      setStatus('error');
      return;
    }
    if (!emailValue) {
      setError('Please enter your email address.');
      setStatus('error');
      return;
    }
    if (!whatsapp) {
      setError('Please enter your WhatsApp number.');
      setStatus('error');
      return;
    }
    if (!country) {
      setError('Please select your country.');
      setStatus('error');
      return;
    }
    if (!timezone) {
      setError('Please select your time zone.');
      setStatus('error');
      return;
    }
    if (!courseSlug) {
      setError('Please choose a course.');
      setStatus('error');
      return;
    }
    if (!experience) {
      setError('Please select your experience level.');
      setStatus('error');
      return;
    }
    if (!transactionId) {
      setError('Please enter your transaction ID.');
      setStatus('error');
      return;
    }
    if (!receiptFile) {
      setError('Please upload an image of your payment transaction.');
      setStatus('error');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setStatus('error');
      return;
    }
    if (!form.get('terms')) {
      setError('Please agree to the Terms and Privacy Policy.');
      setStatus('error');
      return;
    }

    const courseName = courses.find((c) => c.slug === courseSlug)?.name || courseSlug;

    setStatus('loading');
    setError('');

    try {
      const receiptUrl = await uploadReceipt(receiptFile);
      const interest = [
        `Course: ${courseName}.`,
        `Experience level: ${experience}.`,
        `WhatsApp: +92 ${whatsapp}.`,
        `Timezone: ${timezone}.`,
        `Registration fee: PKR ${REGISTRATION_FEE}.`,
        `Transaction ID: ${transactionId}.`,
        `Transaction image: ${receiptUrl}.`,
      ].join(' ');

      const res = await api.post<{ ok: boolean; pending?: boolean }>('/api/student/auth/signup', {
        name,
        email: emailValue,
        password,
        country,
        interest,
        courseSlug,
      });

      if (!res.ok) {
        setError(res.error);
        setStatus('error');
        return;
      }

      setEmail(emailValue);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-dvh bg-[#f3f7fc]">
      <SiteHeader />

      <div className="page py-8 sm:py-10">
        <div className="overflow-hidden rounded-[24px] border border-[#e4ecf7] bg-white shadow-[0_20px_50px_-28px_rgba(10,27,63,0.28)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative overflow-hidden bg-[linear-gradient(160deg,#1a6ef0_0%,#1558d4_45%,#0f4bb8_100%)] px-7 py-8 text-white sm:px-9 lg:px-10 lg:py-9">
            <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.08]" />

            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">XpertPPC Digital Marketing Academy</p>
              <h1 className="mt-2 text-[1.75rem] font-extrabold leading-[1.15] tracking-tight sm:text-[2rem]">
                Your next skill starts here.
              </h1>
              <p className="mt-2 max-w-[320px] text-[14px] leading-relaxed text-white/85">
                Practical digital marketing skills to build your career, from anywhere.
              </p>
            </div>

            <div className="relative mx-auto mt-5 w-full max-w-[300px] sm:max-w-[320px]">
              <div className="absolute inset-5 rounded-full bg-white/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-b from-white/15 to-white/5 p-1.5 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.4)] ring-1 ring-white/25">
                <Image
                  src="/images/signup-illustration.jpg"
                  alt="Learning illustration"
                  width={1920}
                  height={1440}
                  priority
                  quality={95}
                  sizes="320px"
                  className="h-auto w-full rounded-[14px] object-cover"
                />
              </div>
            </div>

            <div className="relative mt-5 space-y-2">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex items-start gap-2.5 rounded-[12px] bg-white/[0.08] px-3 py-2.5 ring-1 ring-white/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1a6ef0] shadow-sm">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold leading-tight">{title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-white/75">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 py-9 sm:px-10 lg:py-12">
            {status === 'success' ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h2 className="mt-4 text-xl font-extrabold text-ink">Application received</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Thanks — our team will verify your payment and contact{' '}
                  <span className="font-semibold text-ink">{email}</span> after approval. You can sign in once
                  you&apos;re verified.
                </p>
                <Link href="/" className="mt-6 text-sm font-semibold text-brand">
                  Back to home
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-[1.65rem] font-extrabold tracking-tight text-ink">Create your account</h2>
                <p className="mt-1 text-sm text-muted">Choose your course and join the next batch.</p>

                <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
                  <Field label="Full name" htmlFor="name" required>
                    <Input id="name" name="name" required placeholder="Enter your full name" />
                  </Field>
                  <Field label="Email address" htmlFor="email" required>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </Field>
                  <Field label="WhatsApp number" htmlFor="whatsapp" required>
                    <div className="flex gap-2">
                      <span className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-[#f8fafc] px-3 text-sm font-semibold text-ink">
                        <span aria-hidden>🇵🇰</span>+92
                      </span>
                      <Input id="whatsapp" name="whatsapp" required placeholder="300 1234567" />
                    </div>
                  </Field>
                  <Field label="Country" htmlFor="country" required>
                    <Select id="country" name="country" required defaultValue="Pakistan">
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Field>
                  <Field label="Time zone" htmlFor="timezone" required>
                    <Select id="timezone" name="timezone" required defaultValue="Asia/Karachi (GMT+5)">
                      <option value="Asia/Karachi (GMT+5)">Asia/Karachi (GMT+5)</option>
                      <option value="Asia/Dubai (GMT+4)">Asia/Dubai (GMT+4)</option>
                      <option value="Europe/London (GMT+0/1)">Europe/London (GMT+0/1)</option>
                      <option value="America/New_York (GMT-5/4)">America/New_York (GMT-5/4)</option>
                    </Select>
                  </Field>
                  <Field label="Choose your course" htmlFor="course" required>
                    <Select id="course" name="course" required defaultValue={preselectedCourse}>
                      {courses.map((course) => (
                        <option key={course.slug} value={course.slug}>
                          {course.shortName || course.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Experience level" htmlFor="experience" required>
                    <Select id="experience" name="experience" required defaultValue="Beginner">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Select>
                  </Field>

                  <div className="rounded-[14px] border border-[#d7e6ff] bg-[#f3f8ff] px-4 py-3.5">
                    <p className="text-[13px] font-bold text-ink">Registration fee</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      A one-time fee of <span className="font-bold text-brand">PKR {REGISTRATION_FEE.toLocaleString()}</span>{' '}
                      is required. Transfer to the account below, then enter your transaction ID and upload a screenshot.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-[14px] border border-border bg-white">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Account Title</p>
                      <p className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">
                        {BANK_DETAILS.accountTitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Account Number</p>
                        <p className="mt-1 break-all text-[15px] font-extrabold tracking-tight text-ink">
                          {BANK_DETAILS.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyBankValue('accountNumber', BANK_DETAILS.accountNumber)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand transition hover:bg-brand-soft"
                        aria-label="Copy account number"
                      >
                        {copiedField === 'accountNumber' ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">IBAN</p>
                        <p className="mt-1 break-all text-[15px] font-extrabold tracking-tight text-ink">
                          {BANK_DETAILS.iban}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyBankValue('iban', BANK_DETAILS.iban)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand transition hover:bg-brand-soft"
                        aria-label="Copy IBAN"
                      >
                        {copiedField === 'iban' ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Field label="Transaction ID" htmlFor="transactionId" required>
                    <Input
                      id="transactionId"
                      name="transactionId"
                      required
                      placeholder="e.g. JazzCash / bank transfer reference"
                    />
                  </Field>

                  <div className="space-y-1.5">
                    <Label htmlFor="transactionImage">
                      Transaction image <span className="text-brand">*</span>
                    </Label>
                    {receiptPreview ? (
                      <div className="relative overflow-hidden rounded-[14px] border border-border bg-[#f8fafc]">
                        <img src={receiptPreview} alt="Transaction preview" className="max-h-48 w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setReceiptFile(null)}
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm ring-1 ring-border"
                          aria-label="Remove transaction image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="truncate px-3 py-2 text-[11px] text-muted">{receiptFile?.name}</p>
                      </div>
                    ) : (
                      <label
                        htmlFor="transactionImage"
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#b9d2f7] bg-[#f8fbff] px-4 py-7 text-center transition hover:border-brand hover:bg-[#eef5ff]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                          <Upload className="h-4 w-4" strokeWidth={2.25} />
                        </span>
                        <span className="text-[13px] font-semibold text-ink">Upload payment screenshot</span>
                        <span className="text-[11px] text-muted">PNG, JPG or WebP · max 10 MB · required</span>
                      </label>
                    )}
                    <input
                      key={receiptFile ? receiptFile.name : 'empty-receipt'}
                      id="transactionImage"
                      name="transactionImage"
                      type="file"
                      accept="image/*"
                      required={!receiptFile}
                      className="sr-only"
                      onChange={onReceiptChange}
                    />
                  </div>

                  <Field label="Password" htmlFor="password" required>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Create a password"
                        className="pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted"
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm password" htmlFor="confirmPassword" required>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Confirm your password"
                        className="pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted"
                        aria-label="Toggle password"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>

                  <label className="flex items-start gap-2.5 pt-1 text-xs text-muted">
                    <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 rounded border-border" />
                    <span>
                      I agree to the{' '}
                      <a href="#" className="font-semibold text-brand underline-offset-2 hover:underline">
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#" className="font-semibold text-brand underline-offset-2 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>

                  {error ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <Button type="submit" disabled={status === 'loading'} className="h-12 w-full rounded-xl text-sm font-bold">
                    {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                  </Button>

                  <p className="text-center text-sm text-muted">
                    Already registered?{' '}
                    <Link href="/login" className="font-semibold text-brand hover:underline">
                      Log in
                    </Link>
                  </p>
                </form>
              </>
            )}
          </section>
        </div>

        <div className="mt-12 pb-2">
          <div className="relative mx-auto grid max-w-3xl gap-10 sm:grid-cols-3">
            {STEPS.map(({ step, icon: Icon, title, detail }, index) => (
              <div key={step} className="relative flex flex-col items-center gap-2.5 text-center">
                {index < STEPS.length - 1 ? (
                  <div className="absolute left-[calc(50%+36px)] top-4 hidden w-[calc(100%-72px)] border-t-2 border-dotted border-brand/30 sm:block" />
                ) : null}
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {step}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="text-sm font-bold text-ink">{title}</h3>
                <p className="max-w-[200px] text-xs leading-relaxed text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter variant="legal" />
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  required,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}
