import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Building2, DollarSign, TrendingUp } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { buildMetadata, organizationSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Xpert PPC | Professional PPC Advertising Agency',
  description:
    'Learn about Xpert PPC, our mission, expertise, and how we help businesses maximize ROI through expert PPC advertising management.',
  path: '/about',
  keywords: ['about Xpert PPC', 'PPC agency', 'performance marketing agency', 'media buying team'],
});

const stats = [
  {
    value: 'Agency',
    label: 'Top-Rated Plus',
    description: 'Elite platform status',
    icon: Award,
  },
  {
    value: '20+',
    unit: 'years',
    label: 'Experience',
    description: 'Performance marketing',
    icon: TrendingUp,
  },
  {
    value: '300+',
    label: 'Businesses Scaled',
    description: 'Active global partners',
    icon: Building2,
  },
  {
    value: '$50M+',
    label: 'Ad Spend Managed',
    description: 'Total capital deployed',
    icon: DollarSign,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />

      <section className="relative overflow-hidden bg-background pb-12 pt-12 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card to-background" />
        <LoadFade
          y={20}
          duration={0.5}
          className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Breadcrumbs items={[{ label: 'About Us' }]} />
          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-6xl">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Aggressive Growth
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            We are a syndicate of elite media buyers deploying next-generation strategies across
            Google, Meta, and TikTok to scale brands past their plateaus.
          </p>
        </LoadFade>
      </section>

      <section className="border-t border-primary/10 bg-card py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal x={-30} duration={0.6}>
              <h2 className="mb-6 text-3xl font-bold text-primary drop-shadow-sm">
                The Xpert Advantage
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-foreground/80">
                With over two decades in the trenches of digital advertising, we&apos;ve
                reverse-engineered the core algorithms that dictate success. We don&apos;t rely on
                guesswork; we rely on rigorous testing, data pipelines, and creative velocity.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-foreground/80">
                Our methodology combines aggressive prospecting structures with precision
                retargeting to capture high-intent users while they are cheapest to acquire.
              </p>
              <Link
                href="/contact"
                className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-primary bg-transparent px-8 text-base font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                Partner With Us
              </Link>
            </Reveal>

            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {stats.map((s) => (
                <RevealItem
                  key={s.label}
                  x={30}
                  className="rounded-2xl border border-primary/20 bg-background transition-colors hover:border-primary hover-glow-primary"
                >
                  <div className="p-4 text-center sm:p-6">
                    <s.icon className="mx-auto mb-4 h-8 w-8 text-primary sm:h-10 sm:w-10" />
                    <div className="mb-1 text-2xl font-extrabold text-foreground sm:text-3xl">
                      {s.value}
                      {s.unit ? <span className="text-lg sm:text-xl">{s.unit}</span> : null}
                    </div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      {s.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>
    </>
  );
}
