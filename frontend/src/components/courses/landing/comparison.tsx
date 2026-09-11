import { Check, X } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingComparison() {
  const { comparison } = coursesLanding;

  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Do the math</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            The smart way vs the expensive way
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-card/30 p-6 sm:p-8">
            <h3 className="mb-1 text-lg font-bold text-muted-foreground">{comparison.badTitle}</h3>
            <p className="mb-6 text-2xl font-extrabold text-foreground/70">{comparison.badPrice}</p>
            <ul className="space-y-3">
              {comparison.badPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative rounded-2xl border border-accent/50 bg-gradient-to-b from-accent/10 to-card p-6 shadow-lg shadow-accent/10 sm:p-8"
          >
            <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
              Best value
            </span>
            <h3 className="mb-1 text-lg font-bold text-foreground">{comparison.goodTitle}</h3>
            <p className="mb-6 text-2xl font-extrabold text-accent">{comparison.goodPrice}</p>
            <ul className="mb-8 space-y-3">
              {comparison.goodPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {p}
                </li>
              ))}
            </ul>
            <ApplyCta variant="warm" className="w-full">
              Choose the smart way
            </ApplyCta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
