import type { Metadata } from 'next';

import {
  CoursesLandingChrome,
  LandingBenefits,
  LandingCourseGrid,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingHowItWorks,
  LandingMeeting,
  LandingOutcomes,
  LandingProof,
  LandingTestimonials,
} from '@/components/courses/landing';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Xpert PPC Study Portal | Skills, Interview & Custom Learning Path',
  description:
    'Book a discovery meeting with Xpert PPC. After an initial interview we map the right skills — SEM, SEO, social, design, video, web development — and pricing for you.',
  path: '/courses',
  keywords: [
    'study portal',
    'digital skills',
    'SEM training',
    'SEO course',
    'web development course',
    'graphic design course',
    'video editing course',
    'Xpert PPC Academy',
  ],
});

export default function CoursesLandingPage() {
  return (
    <div className="academy-shell">
      <CoursesLandingChrome />
      <LandingHero />
      <LandingHowItWorks />
      <LandingCourseGrid />
      <LandingBenefits />
      <LandingTestimonials />
      <LandingOutcomes />
      <LandingProof />
      <LandingMeeting />
      <LandingFaq />
      <LandingFinalCta />
    </div>
  );
}
