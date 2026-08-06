import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { caseStudies } from '@shared/content/case-studies';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies | Xpert PPC',
  description:
    'Real PPC and SEO results from Xpert PPC — eCommerce, legal, local services, healthcare, and more.',
  path: '/case-study',
  keywords: [
    'PPC case studies',
    'Google Ads case studies',
    'SEO case studies',
    'Meta Ads results',
    'Xpert PPC',
  ],
});

export default function CaseStudiesIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Xpert PPC Case Studies',
          description: 'Performance marketing case studies across industries.',
          url: absoluteUrl('/case-study'),
          isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url },
        }}
      />

      <section className="border-b border-border/50 bg-card py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Case Studies' }]} />
          <h1 className="mt-6 max-w-3xl text-balance text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
            Case Studies
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Real accounts. Real metrics. See how we grow eCommerce, legal, local services, and
            healthcare brands with Google Ads, Meta Ads, and SEO.
          </p>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((cs) => (
              <RevealItem key={cs.slug} className="h-full">
                <Link
                  href={`/case-study/${cs.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={`/case-studies/covers/${cs.slug}.jpg`}
                      alt={cs.client}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                      {cs.channels.slice(0, 3).map((ch) => (
                        <span
                          key={ch}
                          className="rounded-full border border-primary/30 bg-background/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {cs.industry}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-foreground group-hover:text-primary">
                      {cs.client}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary">{cs.subtitle}</p>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {cs.excerpt}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                      {cs.metrics.slice(0, 2).map((m) => (
                        <div key={m.label}>
                          <div className="text-lg font-extrabold text-foreground">{m.value}</div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <span className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                      View case study <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Want results like these?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Book a free audit and we&apos;ll show you where the wasted spend is — and how to fix it.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-background px-8 text-sm font-bold text-foreground hover:bg-accent"
          >
            Get a Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
