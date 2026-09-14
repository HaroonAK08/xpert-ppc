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
  LandingTrust,
} from '@/components/courses/landing';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Xpert PPC Study Portal | Meet First, Then Skills & Pricing',
  description:
    'Book a meeting with Xpert PPC Study Portal. After an initial interview about your background and skillset, we decide which skills you need — SEM, SEO, social, design, video, web — and what it will cost.',
  path: '/courses',
  keywords: [
    'study portal',
    'digital skills interview',
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
      <LandingTrust />
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
