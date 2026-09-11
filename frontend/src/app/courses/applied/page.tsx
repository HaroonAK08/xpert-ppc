import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Application received | Digital Academy',
  robots: { index: false, follow: false },
};

export default function CourseAppliedPage() {
  return (
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[linear-gradient(165deg,hsl(222_40%_14%),hsl(223_55%_9%))] p-5 text-center shadow-2xl shadow-black/40 sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/25">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
              Application received
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              We&apos;ll review it and email you if you&apos;re accepted. After that, sign in with
              the password you just created.
            </p>
            <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-black/20 px-4 py-2.5 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5 text-sky-300" />
              Check inbox and spam for updates
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/courses/login"
                className="academy-cta inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-extrabold"
              >
                Go to sign in
              </Link>
              <Link href="/courses" className="text-sm font-semibold text-slate-500 hover:text-sky-300">
                ← Back to academy home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
