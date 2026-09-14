import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-slate-200/80 bg-white/70 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>How it works</SectionEyebrow>
          <SectionHeading
            title="The story in four clear steps"
            subtitle="Meeting → interview about your background → skills & pricing decided → then you learn."
          />
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.howItWorks.map((s) => (
            <RevealItem key={s.step}>
              <AcademyPanel className="relative h-full p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-[#1d6ff2] text-sm font-black text-white shadow-md shadow-[#1d6ff2]/30">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {s.time}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-extrabold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{s.description}</p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <p className="mb-4 text-sm text-slate-500">Ready for step 1?</p>
          <ApplyCta variant="warm">Book a meeting with us</ApplyCta>
        </div>
      </div>
    </section>
  );
}
