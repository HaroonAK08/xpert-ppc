import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Mail, Phone } from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import { WhatsAppNumberButton } from '@/components/layout/whatsapp-number-button';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal } from '@/components/motion';
import { buildMetadata, professionalServiceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Xpert PPC | Get Your Free PPC Consultation',
  description:
    'Contact Xpert PPC for a free consultation. Our PPC specialists are ready to help you maximize your advertising ROI.',
  path: '/contact',
  keywords: ['contact PPC agency', 'free PPC consultation', 'Google Ads consultation'],
});

const contactBlocks = [
  {
    title: 'Phone',
    icon: Phone,
    details: [siteConfig.contact.phonePrimary, siteConfig.contact.phoneSecondary],
    type: 'phone' as const,
  },
  {
    title: 'Email',
    icon: Mail,
    details: [siteConfig.contact.email],
    type: 'email' as const,
  },
];

const hours = [
  'Monday - Friday: 9:00 AM - 6:00 PM',
  'Saturday: 10:00 AM - 4:00 PM',
  'Sunday: Closed',
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          ...professionalServiceSchema(),
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '16:00',
            },
          ],
        }}
      />

      <section className="relative overflow-hidden bg-background pb-12 pt-16 md:pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <LoadFade
          y={20}
          duration={0.5}
          className="container relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <h1
            className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            Get in touch
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ready to take your digital advertising to the next level? Contact us today to discuss
            how we can help grow your business.
          </p>
        </LoadFade>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal x={-20} duration={0.5}>
              <h2 className="mb-6 text-2xl font-semibold leading-snug text-foreground md:text-3xl">
                Contact information
              </h2>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Reach out to our team through any of the following channels. We typically respond
                within 24 hours during business days.
              </p>

              <div className="space-y-6">
                {contactBlocks.map((block) => (
                  <div key={block.title} className="flex items-start space-x-4">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <block.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">{block.title}</h3>
                      {block.details.map((detail) =>
                        block.type === 'phone' ? (
                          <p key={detail} className="mb-2 last:mb-0">
                            <WhatsAppNumberButton
                              size="sm"
                              phone={detail}
                              phoneRaw={detail.replace(/\s/g, '')}
                            />
                          </p>
                        ) : (
                          <p key={detail} className="text-muted-foreground">
                            <a
                              href={`mailto:${detail}`}
                              className="transition-colors hover:text-primary"
                            >
                              {detail}
                            </a>
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-muted p-6">
                <h3 className="mb-3 font-semibold text-foreground">Business hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {hours.map((h) => (
                    <p key={h}>{h}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal
              x={20}
              duration={0.5}
              className="rounded-2xl bg-card p-5 shadow-lg sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-semibold leading-snug text-foreground md:text-3xl">
                Send us a message
              </h2>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/40" />}>
                <LeadForm source="contact-page" />
              </Suspense>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
