import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Sign in | Digital Academy',
  robots: { index: false, follow: false },
};

export default function CourseLoginPage() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--primary),0.14),_transparent_55%)]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-primary/25 bg-card p-5 shadow-xl shadow-primary/10 sm:p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Sign in to your portal</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Use your academy email and password after you&apos;ve been accepted.
          </p>
          <CourseAuthForm mode="login" />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/courses" className="font-semibold hover:text-primary">
              ← Back to academy home
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
