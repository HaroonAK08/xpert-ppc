import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

export function LandingProof() {
  return (
    <section className="border-b border-slate-200/80 bg-white/60 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>How we work</SectionEyebrow>
          <SectionHeading
            title="A study portal with agency DNA"
            subtitle="Marketing tracks come from live campaigns. Creative and web tracks are built for real deliverables."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.proof.map((p) => (
            <RevealItem key={p.title}>
              <AcademyPanel className="h-full px-5 py-7 text-center">
                <p className="academy-text-gradient mb-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {p.value}
                </p>
                <h3 className="mb-2 text-sm font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{p.description}</p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
