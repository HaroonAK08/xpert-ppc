import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Hero } from '@/components/home/hero';
import { CourseGrid } from '@/components/home/course-grid';
import { LearningJourney } from '@/components/home/learning-journey';
import { StudentShowcase } from '@/components/home/student-showcase';
import { FinalCta } from '@/components/home/final-cta';
import { getCourses } from '@/lib/courses';

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CourseGrid
          courses={courses}
          title="Choose Your Course"
          subtitle="Practical skills, live classes and real world knowledge."
        />
        <LearningJourney />
        <StudentShowcase />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
