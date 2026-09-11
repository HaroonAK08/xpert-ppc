import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Application received | Digital Academy',
  robots: { index: false, follow: false },
};

export default function CourseAppliedPage() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--primary),0.14),_transparent_55%)]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Application received</h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            We&apos;ll review it and email you if you&apos;re accepted. After that you can sign in
            with the password you just created.
          </p>
          <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" />
            Check your inbox (and spam) for updates
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/courses/login"
              className="academy-cta inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-extrabold hover:opacity-95"
            >
              Go to sign in
            </Link>
            <Link
              href="/courses"
              className="text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              ← Back to academy home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
