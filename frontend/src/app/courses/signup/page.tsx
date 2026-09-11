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
    <div className="academy-shell">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="academy-mesh pointer-events-none absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(165deg,hsl(222_40%_14%),hsl(223_55%_9%))] shadow-2xl shadow-black/40">
            <div className="border-b border-white/[0.06] bg-gradient-to-r from-sky-400/15 via-transparent to-transparent px-5 py-5 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300">
                {offer.badge}
              </p>
              <p className="mt-1.5 text-sm text-slate-400">
                <span className="line-through opacity-60">{offer.strikePrice}</span>{' '}
                <span className="font-extrabold text-white">{offer.offerPrice}</span>
                <span className="text-slate-500"> · current cohort</span>
              </p>
            </div>
            <div className="p-5 sm:p-8">
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                Apply for the academy
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-slate-400">
                Share your details. If we accept you, sign in with the password you set here and open
                the portal.
              </p>
              <CourseAuthForm mode="signup" />
              <p className="mt-6 text-center text-xs text-slate-500">
                <Link href="/courses" className="font-semibold text-sky-300/80 hover:text-sky-200">
                  ← Back to academy home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
