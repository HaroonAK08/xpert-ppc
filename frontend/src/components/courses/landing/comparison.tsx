import { Check, X } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { SectionEyebrow, SectionHeading } from './section';

export function LandingComparison() {
  const { comparison } = coursesLanding;

  return (
    <section className="border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Clear choice</SectionEyebrow>
          <SectionHeading title="Scattered courses vs one academy" />
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {comparison.badTitle}
            </h3>
            <p className="mb-6 text-2xl font-extrabold text-slate-400">{comparison.badPrice}</p>
            <ul className="space-y-3">
              {comparison.badPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-slate-500">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative rounded-2xl border border-sky-400/30 bg-gradient-to-b from-sky-400/10 to-[#0b1220] p-6 shadow-[0_20px_60px_-30px_hsla(215,100%,45%,0.5)] sm:p-8"
          >
            <span className="absolute -top-3 left-6 rounded-full bg-sky-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
              Recommended
            </span>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-sky-200">
              {comparison.goodTitle}
            </h3>
            <p className="mb-6 text-2xl font-extrabold text-white">{comparison.goodPrice}</p>
            <ul className="mb-8 space-y-3">
              {comparison.goodPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {p}
                </li>
              ))}
            </ul>
            <ApplyCta variant="warm" className="w-full">
              Choose the academy path
            </ApplyCta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
