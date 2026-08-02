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

      <section className="relative overflow-hidden bg-background pb-20 pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card to-background" />
        <LoadFade
          y={20}
          duration={0.5}
          className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <Breadcrumbs items={[{ label: 'About Us' }]} />
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Aggressive Growth
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We are a syndicate of elite media buyers deploying next-generation strategies across
            Google, Meta, and TikTok to scale brands past their plateaus.
          </p>
        </LoadFade>
      </section>

      <section className="border-t border-primary/10 bg-card py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
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
                className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-md border-2 border-primary bg-transparent px-8 text-base font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Partner With Us
              </Link>
            </Reveal>

            <RevealGroup className="grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <RevealItem
                  key={s.label}
                  x={30}
                  className="rounded-2xl border border-primary/20 bg-background transition-colors hover:border-primary hover-glow-primary"
                >
                  <div className="p-6 text-center">
                    <s.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                    <div className="mb-1 text-3xl font-extrabold text-foreground">
                      {s.value}
                      {s.unit ? <span className="text-xl">{s.unit}</span> : null}
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
