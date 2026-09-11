import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { courses } from '@shared/content/courses';
import { coursesLanding } from '@shared/content/courses-landing';
import { Icon } from '@/components/icon';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

export function LandingCourseGrid() {
  return (
    <section id="courses" className="scroll-mt-28 border-b border-white/[0.06] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Curriculum</SectionEyebrow>
          <SectionHeading
            id="courses-heading"
            title="Three tracks. One academy."
            subtitle="Every track below is included when you are accepted — explore the curriculum, then apply once."
          />
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-12 grid gap-5 md:grid-cols-3">
          {courses.map((course) => (
            <RevealItem key={course.slug}>
              <AcademyPanel className="group flex h-full flex-col overflow-hidden">
                <div className="relative border-b border-white/[0.06] bg-gradient-to-br from-sky-400/10 via-transparent to-primary/10 px-6 pb-5 pt-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1220] text-sky-300 ring-1 ring-white/10">
                      <Icon name={course.icon} className="h-5 w-5" />
                    </div>
                    <span className="rounded-md border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-200">
                      Included
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">{course.shortName}</h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400">{course.tagline}</p>
                  <ul className="mb-6 flex flex-wrap gap-1.5">
                    {course.skills.slice(0, 4).map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-slate-400"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/xpert-ppc-digital-academy/${course.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-300 transition group-hover:gap-2.5 group-hover:text-sky-200"
                  >
                    View curriculum <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <p className="mb-4 text-sm text-slate-500">
            Apply once for all tracks at the current cohort price.
          </p>
          <ApplyCta variant="warm">
            Get all tracks — {coursesLanding.offer.offerPrice}
          </ApplyCta>
        </div>
      </div>
    </section>
  );
}
