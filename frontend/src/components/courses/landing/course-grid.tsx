import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { academySkills, coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

const categoryColor: Record<string, string> = {
  Marketing: 'bg-sky-50 text-sky-700 border-sky-200',
  Creative: 'bg-violet-50 text-violet-700 border-violet-200',
  Development: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Growth: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function LandingCourseGrid() {
  return (
    <section id="courses" className="scroll-mt-28 border-b border-slate-200/80 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Skills catalog</SectionEyebrow>
          <SectionHeading
            id="courses-heading"
            title="Lots of skills — we pick the right ones after the interview"
            subtitle="SEM, SEO, social media, graphic design, video editing, frontend, backend, full-stack. Browse below. On the call we decide what you actually need."
          />
        </Reveal>

        <Reveal className="mb-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-md shadow-slate-200/50">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[220px] sm:min-h-[280px]">
              <Image
                src="/study-portal/study-portal-skills.jpg"
                alt="Creative and digital tools used across marketing, design, and development skills"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
                Marketing · Creative · Development
              </p>
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                You don’t buy everything. We choose with you.
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                After the interview we map only the skills that fit your background — then set
                pricing for that plan, not a one-size package.
              </p>
            </div>
          </div>
        </Reveal>

        <RevealGroup stagger={0.06} className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {academySkills.map((skill) => (
            <RevealItem key={skill.slug}>
              <AcademyPanel className="flex h-full flex-col p-5">
                <span
                  className={`mb-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${categoryColor[skill.category] || categoryColor.Marketing}`}
                >
                  {skill.category}
                </span>
                <h3 className="mb-2 text-base font-extrabold text-slate-900">{skill.name}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">{skill.tagline}</p>
                {skill.detailHref ? (
                  <Link
                    href={skill.detailHref}
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#1d6ff2] hover:gap-2"
                  >
                    View outline <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a href="#meeting" className="inline-flex items-center gap-1 text-sm font-bold text-[#1d6ff2]">
                    Ask on the call <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <p className="mb-4 text-sm text-slate-500">
            Not sure which skills? That&apos;s exactly what the discovery meeting is for.
          </p>
          <ApplyCta variant="warm">{coursesLanding.hero.primaryCta}</ApplyCta>
        </div>
      </div>
    </section>
  );
}
