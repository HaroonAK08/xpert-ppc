import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apply | Study Portal',
  robots: { index: false, follow: false },
};

export default function CourseSignupPage() {
  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto max-w-lg px-4 text-center sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1d6ff2]">
            Study portal
          </p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Start with a discovery meeting
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-600">
            We no longer take blind applications. Book a short interview call — we learn your
            background, then decide skills and pricing with you.
          </p>
          <Link
            href="/courses#meeting"
            className="academy-cta inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-extrabold"
          >
            Book a discovery meeting
          </Link>
          <p className="mt-6 text-xs text-slate-500">
            Already accepted?{' '}
            <Link href="/courses/login" className="font-semibold text-[#1d6ff2]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
