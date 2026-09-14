import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { LoadFade } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHero() {
  const { hero } = coursesLanding;

  return (
    <section className="relative isolate min-h-[min(92vh,820px)] overflow-hidden border-b border-slate-200/80">
      <Image
        src="/study-portal/study-portal-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/78 to-[#f4f8ff]/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_20%,_rgba(248,250,252,0.55)_100%)]"
        aria-hidden
      />

      <LoadFade
        y={16}
        duration={0.55}
        className="container relative z-10 mx-auto flex min-h-[min(92vh,820px)] flex-col justify-center px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
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
            <ApplyCta
              href="/courses/login"
              variant="outline"
              className="min-w-[160px] w-full sm:w-auto"
            >
              {hero.secondaryCta}
            </ApplyCta>
          </div>

          <ul className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-6">
            {hero.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d6ff2]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </LoadFade>
    </section>
  );
}
