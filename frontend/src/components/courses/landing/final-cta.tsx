import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingFinalCta() {
  const { finalCta } = coursesLanding;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="academy-mesh pointer-events-none absolute inset-0 opacity-90" />
      <Reveal scale={0.98} className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1d6ff2]">
          Xpert PPC Study Portal
        </p>
        <h2 className="mx-auto mb-4 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          {finalCta.title}
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
          {finalCta.body}
        </p>
        <ApplyCta variant="warm" className="min-w-[220px] text-base">
          {finalCta.cta}
        </ApplyCta>
      </Reveal>
    </section>
  );
}
