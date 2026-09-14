import Image from 'next/image';
import { coursesLanding } from '@shared/content/courses-landing';
import { LoadFade } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHero() {
  const { hero } = coursesLanding;

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200/80">
      <div className="academy-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f4f8ff] via-white/95 to-white"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] sm:h-[44%]" aria-hidden>
        <Image
          src="/study-portal/study-portal-hero-v2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-45 saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-[#eef4ff]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f8ff] via-transparent to-transparent" />
      </div>

      <LoadFade
        y={16}
        duration={0.55}
        className="container relative z-10 mx-auto px-4 pb-24 pt-10 sm:px-6 sm:pb-32 sm:pt-14 lg:px-8"
      >
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
            <ApplyCta href="#how-it-works" variant="outline" className="min-w-[160px] w-full sm:w-auto">
              See the 4 steps
            </ApplyCta>
          </div>

          <ol className="mx-auto grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {hero.storySteps.map((s) => (
              <li
                key={s.step}
                className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-sm"
              >
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1d6ff2]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d6ff2] text-[11px] font-black text-white">
                    {s.step}
                  </span>
                  Step {s.step}
                </p>
                <p className="text-sm font-extrabold text-slate-900">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </LoadFade>
    </section>
  );
}
