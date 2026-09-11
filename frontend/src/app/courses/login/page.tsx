import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Sign in | Digital Academy',
  robots: { index: false, follow: false },
};

export default function CourseLoginPage() {
  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(165deg,hsl(222_40%_14%),hsl(223_55%_9%))] p-5 shadow-2xl shadow-black/40 sm:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300">
              Student portal
            </p>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Sign in with the email and password from your accepted application.
            </p>
            <CourseAuthForm mode="login" />
            <p className="mt-6 text-center text-xs text-slate-500">
              <Link href="/courses" className="font-semibold text-sky-300/80 hover:text-sky-200">
                ← Back to academy home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
