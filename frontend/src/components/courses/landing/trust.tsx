import Image from 'next/image';
import { BadgeCheck, Handshake, ShieldCheck, Sparkles } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

const trustPoints = [
  {
    icon: Handshake,
    title: 'Talk before you pay',
    body: 'Discovery call and interview first. Pricing only after we understand your goals.',
  },
  {
    icon: Sparkles,
    title: 'Path built for you',
    body: 'SEM, SEO, social, design, video, or web — we match skills to your background.',
  },
  {
    icon: ShieldCheck,
    title: 'Agency-backed mentors',
    body: 'Guidance from people who run real client work, not slide-only theory.',
  },
  {
    icon: BadgeCheck,
    title: 'Clear next step',
    body: 'After the call you know what to learn, in what order, and what it costs.',
  },
];

export function LandingTrust() {
  const { stats } = coursesLanding;

  return (
    <section className="border-b border-slate-200/80 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Why this feels fair</SectionEyebrow>
          <SectionHeading
            title="We don’t sell you a package before we know you"
            subtitle="First a meeting. Then an interview about your background and skillset. Only after that — skills, plan, and price."
          />
        </Reveal>

        <div className="mb-10 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <Image
                src="/study-portal/study-portal-interview.jpg"
                alt="Friendly discovery interview on a video call"
                width={960}
                height={720}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-4">
            <AcademyPanel className="flex items-center gap-4 p-5">
              <Image
                src="/team/umer-khan.png"
                alt="Xpert PPC mentor"
                width={64}
                height={64}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-[#1d6ff2]/20"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Mentored by working practitioners</p>
                <p className="text-sm leading-relaxed text-slate-600">
                  On the call we listen first. Then we decide which skills fit you — marketing,
                  creative, or web — and what that plan should cost.
                </p>
              </div>
            </AcademyPanel>

            <RevealGroup stagger={0.06} className="grid gap-3 sm:grid-cols-2">
              {trustPoints.map((item) => (
                <RevealItem key={item.title}>
                  <AcademyPanel className="h-full p-4">
                    <item.icon className="mb-2 h-5 w-5 text-[#1d6ff2]" />
                    <h3 className="mb-1 text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600">{item.body}</p>
                  </AcademyPanel>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>

        <RevealGroup stagger={0.05} className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <AcademyPanel className="px-4 py-5 text-center">
                <p className="academy-text-gradient text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
