import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LandingTestimonials() {
  const items = coursesLanding.testimonials;

  return (
    <section id="success-stories" className="scroll-mt-28 border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Student voices</SectionEyebrow>
          <SectionHeading
            title="Trusted by people building real careers"
            subtitle="Honest feedback from learners who started with the same questions you have now."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <RevealItem key={t.name}>
              <AcademyPanel className="flex h-full flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/30 to-primary/40 text-xs font-bold text-sky-100 ring-1 ring-white/10">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-slate-300/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
