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
            title="Many skills. Your path is decided after the call."
            subtitle="Browse what we teach. On the interview we pick what fits your background — you don’t have to buy everything."
          />
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
