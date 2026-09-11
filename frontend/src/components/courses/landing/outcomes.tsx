import { Briefcase, Building2, Rocket } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';

const icons = [Rocket, Briefcase, Building2];

export function LandingOutcomes() {
  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-300">Your future</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Imagine your life 6 months from now
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Master these skills and opportunities come to you. Three doors this academy opens:
          </p>
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-10 grid gap-5 md:grid-cols-3">
          {coursesLanding.outcomes.map((o, i) => {
            const Icon = icons[i];
            return (
              <RevealItem
                key={o.title}
                className="rounded-2xl border border-border bg-card/50 p-6 text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-sky-400/20 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-foreground">{o.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{o.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Start learning today</ApplyCta>
        </div>
      </div>
    </section>
  );
}
