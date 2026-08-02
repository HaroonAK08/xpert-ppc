import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { services } from '@shared/content/services';
import { buildMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'PPC Services | Xpert PPC - Google Ads, Meta, TikTok, Amazon, LinkedIn',
  description:
    'Comprehensive PPC advertising services including Google Search Ads, Display Ads, Meta Ads, TikTok Ads, Amazon Ads, LinkedIn Ads and Microsoft Ads management.',
  path: '/services',
  keywords: [
    'PPC services',
    'Google Ads management',
    'Meta Ads management',
    'TikTok Ads agency',
    'Amazon Ads management',
    'LinkedIn Ads agency',
    'Microsoft Ads management',
  ],
});

const stats = [
  { value: '8+ Years', label: 'Industry Experience' },
  { value: '200+', label: 'Successful Campaigns' },
  { value: 'Certified', label: 'Platform Partners' },
  { value: '250%+', label: 'Average ROI' },
];

const comparison = [
  {
    platform: 'Google Ads',
    slug: 'google-ads',
    bestFor: 'High-intent search, direct response',
    cpc: '$1.00 - $2.00',
    audience: 'Active searchers, all demographics',
  },
  {
    platform: 'Meta Ads',
    slug: 'meta-ads',
    bestFor: 'Brand awareness, visual products',
    cpc: '$0.50 - $1.50',
    audience: 'Broad consumer base, B2C',
  },
  {
    platform: 'TikTok Ads',
    slug: 'tiktok-ads',
    bestFor: 'Viral growth, Gen Z targeting',
    cpc: '$0.20 - $1.00',
    audience: 'Gen Z, Millennials (18-35)',
  },
  {
    platform: 'Amazon Ads',
    slug: 'amazon-ads',
    bestFor: 'E-commerce sales, product visibility',
    cpc: '$0.80 - $1.20',
    audience: 'High-intent shoppers',
  },
  {
    platform: 'LinkedIn Ads',
    slug: 'linkedin-ads',
    bestFor: 'B2B lead gen, account-based marketing',
    cpc: '$5.00 - $8.00',
    audience: 'Professionals, decision-makers',
  },
  {
    platform: 'Microsoft Ads',
    slug: 'microsoft-ads',
    bestFor: 'Cost-effective search, older demographic',
    cpc: '$0.50 - $1.50',
    audience: 'Older, affluent professionals',
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={services.map((s) =>
          serviceSchema({
            name: `${s.name} Management`,
            description: s.description,
            path: `/services/${s.slug}`,
          })
        )}
      />

      {/* Hero — centered, dashboard bg, gradient title */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-background py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?auto=format&fit=crop&w=2000&q=60"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-10 mix-blend-luminosity"
          />
          <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 mix-blend-screen blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Services' }]} />

          <LoadFade y={20} duration={0.5} className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Our PPC{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Expert advertising management across all major platforms. We build sophisticated
              acquisition funnels tailored to unique algorithms.
            </p>
            <a
              href="#services-grid"
              className="btn-hover-effect inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            >
              Explore Our Services <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </LoadFade>
        </div>
      </section>

      {/* Service cards — 2-column grid */}
      <section id="services-grid" className="border-t border-primary/10 bg-card py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((s) => (
              <RevealItem
                as="article"
                key={s.slug}
                className="group flex h-full flex-col rounded-2xl border border-primary/20 bg-background p-8 transition-all duration-300 hover:border-primary/50"
              >
                <div className="mb-6 flex items-center">
                  <div className="mr-4 rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <Icon name={s.icon} className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{s.name}</h2>
                </div>

                <p className="mb-6 leading-relaxed text-muted-foreground">{s.shortDescription}</p>

                <ul className="mb-8 flex-grow space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start">
                      <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="font-medium text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-primary/10 pt-6">
                  <a
                    href={`#${s.slug}-details`}
                    className="inline-flex items-center font-bold text-primary transition-colors hover:text-accent"
                  >
                    View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Per-service detail + case study */}
      {services.map((s, idx) => {
        const even = idx % 2 === 0;
        return (
          <section
            key={s.slug}
            id={`${s.slug}-details`}
            className={`border-t border-primary/10 py-24 ${even ? 'bg-background' : 'bg-card'}`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <Reveal x={-30} duration={0.6}>
                  <div className="mb-6 flex items-center">
                    <Icon name={s.icon} className="mr-4 h-10 w-10 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">{s.name}</h2>
                  </div>

                  <p className="mb-8 text-xl font-medium text-primary">{s.description}</p>

                  <div className="mb-8 space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-foreground">What we offer:</h3>
                      <p className="leading-relaxed text-muted-foreground">{s.whatWeOffer}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-foreground">Our approach:</h3>
                      <p className="leading-relaxed text-muted-foreground">{s.approach}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-foreground">Average results:</h3>
                      <p className="text-xl font-bold text-accent">{s.results}</p>
                    </div>
                  </div>

                  <Link
                    href={`/services/${s.slug}`}
                    className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-md border-2 border-primary bg-transparent px-8 text-base font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    Learn More About {s.name}
                  </Link>
                </Reveal>

                <Reveal
                  x={30}
                  duration={0.6}
                  delay={0.2}
                  className={`relative overflow-hidden rounded-2xl border border-primary/20 p-8 shadow-xl ${
                    even ? 'bg-card' : 'bg-background'
                  }`}
                >
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />

                  <div className="mb-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                    Case Study
                  </div>

                  <h3 className="mb-2 text-2xl font-bold text-foreground">{s.caseStudy.client}</h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Timeline: {s.caseStudy.timeline}
                  </p>

                  <div className="mb-8 space-y-4">
                    <p>
                      <span className="font-bold text-foreground">Challenge: </span>
                      <span className="text-muted-foreground">{s.caseStudy.challenge}</span>
                    </p>
                    <p>
                      <span className="font-bold text-foreground">Solution: </span>
                      <span className="text-muted-foreground">{s.caseStudy.solution}</span>
                    </p>
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4">
                    {s.caseStudy.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-lg border border-primary/10 bg-primary/5 p-4"
                      >
                        <p className="mb-1 text-xs font-medium text-muted-foreground">{m.label}</p>
                        <p className="text-sm font-bold text-primary">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <blockquote className="relative rounded-xl border-l-4 border-accent bg-muted/50 p-6 italic text-foreground/90">
                    <Quote className="absolute right-4 top-4 h-6 w-6 text-accent/20" />
                    &ldquo;{s.caseStudy.testimonial}&rdquo;
                  </blockquote>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* Why Choose */}
      <section className="border-t border-primary/10 bg-background py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl">
            Why Choose Xpert PPC
          </h2>
          <RevealGroup
            as="dl"
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((s) => (
              <RevealItem
                key={s.label}
                className="rounded-2xl border border-primary/10 bg-card p-6 transition-colors hover:border-primary/30"
              >
                <dd className="mb-2 text-3xl font-extrabold text-primary md:text-4xl">{s.value}</dd>
                <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="overflow-hidden border-t border-primary/10 bg-card py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
            Platform Comparison
          </h2>

          <div className="overflow-x-auto rounded-xl border border-primary/20 shadow-lg">
            <table className="min-w-full divide-y divide-primary/20 text-left">
              <caption className="sr-only">
                Comparison of advertising platforms by best use case, average cost per click, and
                ideal audience
              </caption>
              <thead className="bg-background">
                <tr>
                  {['Platform', 'Best For', 'Average CPC', 'Ideal Audience'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 bg-card">
                {comparison.map((row) => (
                  <tr key={row.platform} className="transition-colors hover:bg-background/50">
                    <th scope="row" className="px-6 py-4 font-bold text-primary">
                      <Link href={`/services/${row.slug}`} className="hover:underline">
                        {row.platform}
                      </Link>
                    </th>
                    <td className="px-6 py-4 text-muted-foreground">{row.bestFor}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.cpc}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="border-t border-primary/10 bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
              Ready to grow your business?
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Schedule a free consultation with our PPC specialists to discuss your growth strategy.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/40" />}>
              <LeadForm source="service-page" />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
