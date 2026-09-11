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
  const { benefits, offer } = coursesLanding;

  return (
    <section className="border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Why the academy</SectionEyebrow>
          <SectionHeading
            title={`Built for results — not course-hopping`}
            subtitle={`One application unlocks SEM, Social, and SEO for ${offer.offerPrice} this cohort — with curriculum from working media buyers.`}
          />
        </Reveal>

        <RevealGroup stagger={0.06} className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem key={b.title}>
                <AcademyPanel className="h-full p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{b.description}</p>
                </AcademyPanel>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Apply for academy access</ApplyCta>
        </div>
      </div>
    </section>
  );
}
