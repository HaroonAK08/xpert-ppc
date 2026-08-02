import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Mail } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Courses | Xpert PPC Digital Academy',
  description:
    'Sign up with email OTP to access Xpert PPC courses — videos, lectures, assignments, and tasks.',
  path: '/courses',
  keywords: ['PPC courses', 'digital academy', 'SEM training', 'SEO course'],
});

const steps = [
  'Create an account with your name and email',
  'Verify the 6-digit OTP sent to your Gmail',
  'Enroll and learn with videos, lectures, and assignments',
];

export default function CoursesLandingPage() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
            Xpert PPC <span className="text-primary">Courses</span>
          </h1>
          <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Access training content built by our media buying team. Sign up with your email, verify
            via OTP, then unlock videos, lectures, assignments, and tasks.
          </p>

          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/courses/signup"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Sign up free
            </Link>
            <Link
              href="/courses/login"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border px-8 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          <ul className="mx-auto max-w-xl space-y-4 text-left">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-foreground/90">
                  <span className="font-bold text-primary">Step {i + 1}.</span> {step}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" /> OTP codes are sent to your email (Gmail supported)
          </p>
        </div>
      </div>
    </section>
  );
}
