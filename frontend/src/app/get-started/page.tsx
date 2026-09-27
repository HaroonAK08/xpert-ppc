import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LeadForm } from '@/components/forms/lead-form';
import { LoadFade } from '@/components/motion';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Get Started',
  description: 'Tell us your name, email, and phone number — we’ll be in touch within one business day.',
  path: '/get-started',
});

export default function GetStartedPage() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
      <LoadFade y={20} duration={0.5} className="container relative z-10 mx-auto max-w-md px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1
            className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            Let&apos;s get started
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Leave your details and a specialist will reach out within one business day.
          </p>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-lg sm:p-8">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-muted/40" />}>
            <LeadForm source="quick-form" compact submitLabel="Get in touch" />
          </Suspense>
        </div>
      </LoadFade>
    </section>
  );
}
