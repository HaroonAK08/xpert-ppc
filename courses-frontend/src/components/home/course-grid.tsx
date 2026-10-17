import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PublicCourse } from '@/lib/courses';
import { CourseIcon, isBrandLogo } from '@/components/site/course-icon';
import { cn } from '@/lib/cn';

function Card({ course }: { course: PublicCourse }) {
  const brand = isBrandLogo(course.icon);
  const metaWordmark = (course.icon || '').toLowerCase().includes('meta');

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex w-full items-center gap-4 rounded-[16px] border border-[#e6eef8] bg-white px-[22px] py-[16px] shadow-[0_10px_28px_-16px_rgba(10,27,63,0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(26,110,240,0.28)]"
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-[14px]',
          metaWordmark
            ? 'h-[56px] w-[112px] bg-white p-1.5'
            : brand
              ? 'h-[56px] w-[56px] bg-white p-2'
              : 'h-[56px] w-[56px] bg-[#e8f1ff]'
        )}
      >
        <CourseIcon name={course.icon} className={brand ? 'h-full w-full' : 'h-[32px] w-[32px]'} />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] font-bold leading-[1.2] text-[#0a1b3f]">{course.shortName || course.name}</h3>
        <p className="mt-[4px] text-[13px] leading-[1.35] text-[#5b6d89]">{course.tagline}</p>
        <span className="mt-[10px] inline-flex items-center gap-1 text-[13px] font-bold text-[#1a6ef0] transition group-hover:gap-1.5">
          View Course <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

export function CourseGrid({ courses, title, subtitle }: { courses: PublicCourse[]; title: string; subtitle: string }) {
  return (
    <section id="courses" className="bg-[linear-gradient(165deg,#dcefff_0%,#eaf5ff_40%,#ffffff_85%)] pb-[64px] pt-[56px]">
      <div className="page">
        <div className="text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#1a6ef0]">
            Courses for a brighter future
          </p>
          <h2 className="mt-[10px] text-[30px] font-extrabold leading-[1.2] tracking-tight text-[#0a1b3f] sm:text-[34px]">
            {title}
          </h2>
          <p className="mx-auto mt-[10px] max-w-xl text-[15px] text-[#5b6d89] sm:text-[16.5px]">{subtitle}</p>
        </div>

        {courses.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#5b6d89]">Courses are being prepared — check back soon.</p>
        ) : (
          <div className="mt-[44px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.slug} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
