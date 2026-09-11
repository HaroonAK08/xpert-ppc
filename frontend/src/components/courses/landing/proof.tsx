import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

export function LandingProof() {
  return (
    <section className="border-b border-white/[0.06] bg-white/[0.015] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Credibility</SectionEyebrow>
          <SectionHeading
            title="Taught from live accounts — not theory decks"
            subtitle="The same team that runs campaigns for clients designed this curriculum."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.proof.map((p) => (
            <RevealItem key={p.title}>
              <AcademyPanel className="h-full px-5 py-7 text-center">
                <p className="academy-text-gradient mb-2 text-3xl font-black tracking-tight">{p.value}</p>
                <h3 className="mb-2 text-sm font-bold text-white">{p.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{p.description}</p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
