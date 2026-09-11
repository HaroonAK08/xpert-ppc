import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Simple process</SectionEyebrow>
          <SectionHeading
            title="From this page to your first lesson"
            subtitle="No checkout maze — apply, get accepted, then learn in the portal."
          />
        </Reveal>

        <RevealGroup stagger={0.1} className="relative mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.howItWorks.map((s) => (
            <RevealItem key={s.step}>
              <AcademyPanel className="relative h-full p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-primary text-sm font-black text-white shadow-lg shadow-primary/30">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {s.time}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-extrabold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.description}</p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Start step 1 — apply now</ApplyCta>
        </div>
      </div>
    </section>
  );
}
