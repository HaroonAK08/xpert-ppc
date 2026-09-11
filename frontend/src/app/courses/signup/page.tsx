import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';
import { coursesLanding } from '@shared/content/courses-landing';

export const metadata: Metadata = {
  title: 'Apply | Digital Academy',
  robots: { index: false, follow: false },
};

export default function CourseSignupPage() {
  const { offer } = coursesLanding;

  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--accent),0.16),_transparent_55%)]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-accent/30 bg-card shadow-xl shadow-accent/10">
          <div className="border-b border-border bg-gradient-to-r from-accent/20 via-orange-500/10 to-transparent px-5 py-4 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
              {offer.badge}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="line-through opacity-60">{offer.strikePrice}</span>{' '}
              <span className="font-extrabold text-accent">{offer.offerPrice}</span> cohort
            </p>
          </div>
          <div className="p-5 sm:p-8">
            <h1 className="mb-2 text-2xl font-extrabold text-foreground">Apply for the academy</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              Tell us your name, email, and what you want to learn. If we accept you, sign in with
              the password you set here.
            </p>
            <CourseAuthForm mode="signup" />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link href="/courses" className="font-semibold hover:text-primary">
                ← Back to academy home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
