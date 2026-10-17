import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { CourseGrid } from '@/components/home/course-grid';
import { getCourses } from '@/lib/courses';

export const metadata: Metadata = { title: 'Courses' };

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <CourseGrid
          courses={courses}
          title="All Courses"
          subtitle="Browse every live course we currently offer and enroll today."
        />
      </main>
      <SiteFooter />
    </>
  );
}
