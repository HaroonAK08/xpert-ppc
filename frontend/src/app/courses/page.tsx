import type { Metadata } from 'next';

import {
  LandingBenefits,
  LandingComparison,
  LandingCourseGrid,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingHowItWorks,
  LandingOutcomes,
  LandingPricing,
  LandingProof,
  LandingTestimonials,
  OfferMarquee,
  OfferModal,
} from '@/components/courses/landing';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Xpert PPC Digital Academy | SEM, Social Media & SEO Courses',
  description:
    'Apply for Xpert PPC Digital Academy — SEM, Social Media Marketing, and SEO tracks taught by media buyers who scale real accounts. Current cohort pricing.',
  path: '/courses',
  keywords: [
    'PPC courses',
    'digital academy',
    'SEM training',
    'SEO course',
    'Meta Ads course',
    'Xpert PPC Academy',
  ],
});

export default function CoursesLandingPage() {
  return (
    <div className="academy-shell">
      <OfferMarquee />
      <OfferModal />
      <LandingHero />
      <LandingTestimonials />
      <LandingBenefits />
      <LandingCourseGrid />
      <LandingOutcomes />
      <LandingProof />
      <LandingComparison />
      <LandingHowItWorks />
      <LandingPricing />
      <LandingFaq />
      <LandingFinalCta />
    </div>
  );
}
