import { CheckCircle2 } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { LoadFade } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHero() {
  const { hero, stats } = coursesLanding;

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="academy-mesh pointer-events-none absolute inset-0" />

      <LoadFade y={16} duration={0.55} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1d6ff2]">
            {hero.eyebrow}
          </p>

          <h1 className="mb-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-[3.15rem]">
            {hero.title}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ApplyCta variant="warm" className="min-w-[220px] w-full sm:w-auto">
              {hero.primaryCta}
            </ApplyCta>
            <ApplyCta
              href="/courses/login"
              variant="outline"
              className="min-w-[160px] w-full sm:w-auto"
            >
              {hero.secondaryCta}
            </ApplyCta>
          </div>

          <ul className="mb-14 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-6">
            {hero.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-[#1d6ff2]" />
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
