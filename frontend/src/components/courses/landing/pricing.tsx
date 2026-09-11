import { CheckCircle2 } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingPricing() {
  const { pricing, offer } = coursesLanding;

  return (
    <section id="pricing" className="scroll-mt-28 border-b border-border bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-xl rounded-3xl border border-primary/40 bg-gradient-to-b from-card to-background p-8 text-center shadow-xl shadow-primary/10 sm:p-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-300">
            {pricing.eyebrow}
          </p>
          <h2 className="mb-4 text-3xl font-extrabold text-foreground sm:text-4xl">{pricing.title}</h2>
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="text-lg text-muted-foreground line-through">{pricing.strikePrice}</span>
            <span className="text-4xl font-black text-primary sm:text-5xl">{pricing.offerPrice}</span>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">{offer.priceNote}</p>

          <ul className="mx-auto mb-8 max-w-sm space-y-3 text-left">
            {pricing.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {b}
              </li>
            ))}
          </ul>

          <ApplyCta variant="warm" className="w-full sm:w-auto">
            {pricing.cta}
          </ApplyCta>
          <p className="mt-4 text-xs text-muted-foreground">{pricing.finePrint}</p>
        </Reveal>
      </div>
    </section>
  );
}
