import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Sign in | Study Portal',
  robots: { index: false, follow: false },
};

export default function CourseLoginPage() {
  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
              Student portal
            </p>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-slate-600">
              Sign in after your learning path has been set with us.
            </p>
            <CourseAuthForm mode="login" />
            <p className="mt-6 text-center text-xs text-slate-500">
              New here?{' '}
              <Link href="/courses#meeting" className="font-semibold text-[#1d6ff2]">
                Book a discovery meeting
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
