import { Briefcase, Building2, Rocket } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

const icons = [Rocket, Briefcase, Building2];

export function LandingOutcomes() {
  return (
    <section className="border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Outcomes</SectionEyebrow>
          <SectionHeading
            title="Where these skills take you"
            subtitle="Whether you freelance, join a team, or grow your own brand — the same foundations apply."
          />
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-12 grid gap-5 md:grid-cols-3">
          {coursesLanding.outcomes.map((o, i) => {
            const Icon = icons[i];
            return (
              <RevealItem key={o.title}>
                <AcademyPanel className="h-full px-6 py-8 text-center">
                  <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/15 to-primary/20 text-sky-300 ring-1 ring-white/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-extrabold text-white">{o.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{o.description}</p>
                </AcademyPanel>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Start your application</ApplyCta>
        </div>
      </div>
    </section>
  );
}
