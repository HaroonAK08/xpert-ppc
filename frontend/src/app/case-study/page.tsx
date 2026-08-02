import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, CheckCircle2, Lightbulb } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { desertFarms as cs } from '@shared/content/case-studies';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: cs.seo.title,
  description: cs.seo.description,
  path: '/case-study',
  keywords: cs.seo.keywords,
  type: 'article',
});

export default function CaseStudyPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: cs.title,
          description: cs.seo.description,
          url: absoluteUrl('/case-study'),
          author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
          },
          about: cs.client,
          articleSection: 'Case Study',
        }}
      />

      {/* Hero — camel/dashboard background + orange CTA */}
      <section className="relative flex min-h-[70dvh] items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={cs.heroImage}
            alt="Desert Farms Case Study Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumbs
              items={[{ label: 'Case Studies', href: '/case-study' }, { label: cs.client }]}
            />
          </div>

          <LoadFade y={30} duration={0.6} className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-1.5 text-sm font-bold text-[#f97316]">
              Success Story
            </div>

            <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              {cs.title}
            </h1>

            <p className="mb-8 text-xl font-medium text-muted-foreground md:text-2xl">
              {cs.subtitle}
            </p>

            <a
              href="#overview"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#f97316] px-8 text-base font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-105 hover:bg-[#ea580c] active:scale-95"
            >
              View Full Case Study <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </LoadFade>
        </div>
      </section>

      {/* About */}
      <section id="overview" className="border-y border-border/50 bg-card py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              About {cs.client}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{cs.intro}</p>
          </div>
        </div>
      </section>

      {/* Impact metrics with orange icons */}
      <section className="relative overflow-hidden bg-background py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">The Impact</h2>
            <p className="text-muted-foreground">
              Compounding growth across all major acquisition channels.
            </p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cs.metrics.map((m) => (
              <RevealItem
                key={m.label}
                className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
                  <Icon name={m.icon} className="h-8 w-8" />
                </div>
                <div className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">
                  {m.value}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Pillars — bright blue section */}
      <section className="bg-secondary py-24 text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl">
                What It Takes to Succeed in Camel Milk
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-secondary-foreground/80">
                {cs.pillarsIntro}
              </p>
              <div className="hidden h-1 w-24 rounded-full bg-[#f97316] lg:block" />
            </div>

            <div className="lg:col-span-7">
              <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {cs.pillars.map((p) => (
                  <RevealItem
                    key={p.title}
                    x={20}
                    duration={0.4}
                    className="flex items-start space-x-4 rounded-xl border border-white/10 bg-background/5 p-6"
                  >
                    <Icon name={p.icon} className="mt-1 h-6 w-6 shrink-0 text-[#f97316]" />
                    <div>
                      <h3 className="mb-1 text-lg font-bold">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-secondary-foreground/70">
                        {p.description}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Takeaways */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Lightbulb className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              The Power of Integrated Marketing
            </h2>
            <p className="text-lg text-muted-foreground">
              Key takeaways from over a decade of continuous optimization.
            </p>
          </div>

          <RevealGroup className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {cs.takeaways.map((t) => (
              <RevealItem
                key={t.title}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8"
              >
                <div className="absolute left-0 top-0 h-full w-1 origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                <h3 className="mb-4 text-xl font-bold text-foreground">{t.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{t.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Approach + services */}
      <section className="border-t border-border/50 bg-card py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <Reveal x={-30} duration={0.6}>
              <Briefcase className="mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Our Approach at Xpert PPC
              </h2>
              {cs.approach.map((p) => (
                <p key={p} className="mb-6 text-lg leading-relaxed text-muted-foreground last:mb-0">
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal
              x={30}
              duration={0.6}
              className="rounded-2xl border border-primary/20 bg-background p-8 shadow-[0_0_30px_rgba(0,255,255,0.05)]"
            >
              <h3 className="mb-6 border-b border-border pb-4 text-xl font-bold text-foreground">
                Services Deployed
              </h3>
              <ul className="space-y-4">
                {cs.servicesDeployed.map((s) => (
                  <li key={s} className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="mr-3 h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Full-bleed primary CTA */}
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-extrabold md:text-5xl">Ready to Grow Your Business?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-foreground/90">
            Let&apos;s work together to build long-term success. Discover what a dedicated growth
            partner can do for your brand.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-14 items-center justify-center rounded-md bg-background px-8 text-lg font-bold text-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground active:scale-95"
          >
            Start Your Case Study
          </Link>
        </div>
      </section>
    </>
  );
}
