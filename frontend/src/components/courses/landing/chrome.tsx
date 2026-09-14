'use client';

import { OfferMarquee } from './offer-marquee';
import { OfferModal } from './offer-modal';

/** Client-only chrome for the study portal homepage. */
export function CoursesLandingChrome() {
  return (
    <>
      <OfferMarquee />
      <OfferModal />
    </>
  );
}
