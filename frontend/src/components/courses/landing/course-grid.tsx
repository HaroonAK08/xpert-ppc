import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { courses } from '@shared/content/courses';
import { coursesLanding } from '@shared/content/courses-landing';
import { Icon } from '@/components/icon';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingCourseGrid() {
  return (
    <section id="courses" className="scroll-mt-28 border-b border-border bg-card/30 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-300">
            All included in one membership
          </p>
          <h2 id="courses-heading" className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            3 skills that actually pay you back
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Every track below is yours with a single academy application — from first lesson to first
            client-ready campaign.
          </p>
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-10 grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <RevealItem
              key={course.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={course.icon} className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-300">
                    Included
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-foreground">{course.shortName}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.tagline}
                </p>
                <Link
                  href={`/xpert-ppc-digital-academy/${course.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:gap-3"
                >
                  Explore course <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Why buy one track when you can apply for all of them at the cohort price?
          </p>
          <ApplyCta variant="warm">
            Get all tracks — {coursesLanding.offer.offerPrice}
          </ApplyCta>
        </div>
      </div>
    </section>
  );
}
