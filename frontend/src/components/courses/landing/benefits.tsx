import {
  BookOpenCheck,
  GraduationCap,
  Laptop,
  MessageCircle,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

const icons = [ShieldCheck, MessageCircle, BookOpenCheck, Rocket, GraduationCap, Laptop];

export function LandingBenefits() {
  return (
    <section className="border-b border-slate-200/80 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Why this portal</SectionEyebrow>
          <SectionHeading
            title="A study system that starts with listening"
            subtitle="We don’t sell you a random bundle. We interview you, then build the plan."
          />
        </Reveal>

        <RevealGroup stagger={0.06} className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coursesLanding.benefits.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem key={b.title}>
                <AcademyPanel className="h-full p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1d6ff2]/10 text-[#1d6ff2] ring-1 ring-[#1d6ff2]/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{b.description}</p>
                </AcademyPanel>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Book a discovery meeting</ApplyCta>
        </div>
      </div>
    </section>
  );
}
