import { CheckCircle2 } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { LoadFade } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHero() {
  const { hero, stats, offer } = coursesLanding;

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="academy-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

      <LoadFade y={16} duration={0.55} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300/90">
            Xpert PPC Digital Academy
          </p>

          <h1 className="mb-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.4rem]">
            {hero.title}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-pretty text-base leading-relaxed text-slate-300/85 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mb-8 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-slate-300">
            <span className="text-slate-500 line-through">{offer.strikePrice}</span>
            <span className="text-lg font-extrabold text-white">{offer.offerPrice}</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
            <span className="text-xs text-slate-400 sm:text-sm">current cohort · all 3 tracks</span>
          </div>

          <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ApplyCta variant="warm" className="min-w-[200px] w-full sm:w-auto">
              {hero.primaryCta}
            </ApplyCta>
            <ApplyCta
              href="/courses/login"
              variant="outline"
              className="min-w-[140px] w-full border-white/15 bg-white/[0.03] sm:w-auto"
            >
              {hero.secondaryCta}
            </ApplyCta>
          </div>

          <ul className="mb-14 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-6">
            {hero.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                {t}
              </li>
            ))}
          </ul>

          <div className="academy-divider mb-10" />

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="academy-text-gradient text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </LoadFade>
    </section>
  );
}
