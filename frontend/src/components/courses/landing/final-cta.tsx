import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingFinalCta() {
  const { finalCta, offer } = coursesLanding;

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(var(--accent),0.2),_transparent_60%)]" />
      <Reveal scale={0.98} className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-4 max-w-3xl text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
          {finalCta.title}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {finalCta.body}
        </p>
        <ApplyCta variant="warm" className="text-base">
          {finalCta.cta} — {offer.offerPrice}
        </ApplyCta>
      </Reveal>
    </section>
  );
}
