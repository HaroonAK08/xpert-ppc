import { CheckCircle2, Lock, Shield } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { SectionEyebrow } from './section';

export function LandingPricing() {
  const { pricing, offer } = coursesLanding;

  return (
    <section id="pricing" className="scroll-mt-28 border-b border-white/[0.06] py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-lg">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-400/25 bg-[linear-gradient(165deg,hsl(222_40%_14%),hsl(223_55%_8%))] p-8 text-center shadow-[0_30px_80px_-40px_hsla(215,100%,50%,0.55)] sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-400/15 to-transparent" />

            <div className="relative">
              <SectionEyebrow className="justify-center">{pricing.eyebrow}</SectionEyebrow>
              <h2 className="mb-6 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {pricing.title}
              </h2>

              <div className="mb-2 flex items-end justify-center gap-3">
                <span className="pb-1 text-lg text-slate-500 line-through">{pricing.strikePrice}</span>
                <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                  {pricing.offerPrice}
                </span>
              </div>
              <p className="mb-8 text-sm text-slate-400">{offer.priceNote}</p>

              <ul className="mx-auto mb-8 max-w-sm space-y-3 text-left">
                {pricing.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {b}
                  </li>
                ))}
              </ul>

              <ApplyCta variant="warm" className="w-full">
                {pricing.cta}
              </ApplyCta>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-sky-400" /> Acceptance-based access
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-sky-400" /> Secure student portal
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">{pricing.finePrint}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
