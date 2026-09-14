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
  return (
    <section id="success-stories" className="scroll-mt-28 border-b border-slate-200/80 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Learner voices</SectionEyebrow>
          <SectionHeading
            title="Built around real people — not packages"
            subtitle="The call-first approach helps each person start in the right place."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.testimonials.map((t) => (
            <RevealItem key={t.name}>
              <AcademyPanel className="flex h-full flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d6ff2]/10 text-xs font-bold text-[#1558c7] ring-1 ring-[#1d6ff2]/15">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
