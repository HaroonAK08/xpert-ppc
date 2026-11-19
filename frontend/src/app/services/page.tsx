import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, Quote, ShieldCheck } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { services } from '@shared/content/services';
import { buildMetadata, serviceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'PPC Services - Google Ads, Meta, TikTok, Amazon & LinkedIn',
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

const yearsRunning = new Date().getFullYear() - Number(siteConfig.founded);

/** Every figure here is checkable against this site's own content. */
const stats = [
  { value: `${yearsRunning}+`, label: 'Years running paid media', note: `Since ${siteConfig.founded}` },
  { value: `${services.length}`, label: 'Ad platforms in-house', note: 'No channel outsourced' },
  {
    value: 'Named',
    label: 'Accounts, not averages',
    note: 'Every case study names the client and its scope',
    href: '/case-study',
  },
  {
    value: '600%',
    label: 'Peak documented ROAS',
    note: 'eCommerce brand, 12 months',
    href: '/case-study/google-ads-roas-600',
  },
];

const comparison = [
  {
    platform: 'Google Ads',
    slug: 'google-ads',
    bestFor: 'High-intent search, direct response',
    cpc: '$1.00 – $2.00',
    audience: 'Active searchers, all demographics',
  },
  {
    platform: 'Meta Ads',
    slug: 'meta-ads',
    bestFor: 'Brand awareness, visual products',
    cpc: '$0.50 – $1.50',
    audience: 'Broad consumer base, B2C',
  },
  {
    platform: 'TikTok Ads',
    slug: 'tiktok-ads',
    bestFor: 'Viral growth, Gen Z targeting',
    cpc: '$0.20 – $1.00',
    audience: 'Gen Z, Millennials (18–35)',
  },
  {
    platform: 'Amazon Ads',
    slug: 'amazon-ads',
    bestFor: 'eCommerce sales, product visibility',
    cpc: '$0.80 – $1.20',
    audience: 'High-intent shoppers',
  },
  {
    platform: 'LinkedIn Ads',
    slug: 'linkedin-ads',
    bestFor: 'B2B lead gen, account-based marketing',
    cpc: '$5.00 – $8.00',
    audience: 'Professionals, decision-makers',
  },
  {
    platform: 'Microsoft Ads',
    slug: 'microsoft-ads',
    bestFor: 'Cost-effective search, older demographic',
    cpc: '$0.50 – $1.50',
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

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-14 pt-8 md:pb-20 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
              backgroundSize: '68px 68px',
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
            }}
          />
          <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Services' }]} />

          <LoadGroup className="mx-auto max-w-3xl text-center">
            <LoadItem className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
              <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-primary/15 px-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                {services.length} platforms
              </span>
              One team, every channel that matters
            </LoadItem>

            <LoadItem
              as="h1"
              y={16}
              duration={0.7}
              className="mb-6 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              PPC services built around{' '}
              <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                cost per result
              </span>
            </LoadItem>

            <LoadItem
              as="p"
              y={14}
              className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
            >
              Each platform rewards a different structure, creative format and bidding signal. We
              run them in-house, on the same measurement stack, so budget moves to whatever is
              actually working.
            </LoadItem>

            <LoadItem className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Get a free account audit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#services-grid"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] sm:w-auto"
              >
                Compare the platforms
              </a>
            </LoadItem>
          </LoadGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Platform jump nav                                                 */}
      {/* ---------------------------------------------------------------- */}
      <nav
        aria-label="Jump to a platform"
        className="border-y border-white/[0.07] bg-[#060c1d] py-6"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadFade y={10} duration={0.5}>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`#${s.slug}-details`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-2 text-[13px] font-semibold text-[#c6d2e6] transition-colors hover:border-primary/45 hover:bg-white/[0.07] hover:text-white sm:px-4"
                  >
                    <Icon name={s.icon} className="h-4 w-4 shrink-0 text-primary" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </LoadFade>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Service cards                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section id="services-grid" className="scroll-mt-24 bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The channels"
            title="Six platforms, one accountable team"
            description="Pick the channel you already run — or tell us the goal and we'll recommend the mix your margins can carry."
            className="mb-10 md:mb-14"
          />

          <RevealGroup className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem
                as="article"
                key={s.slug}
                className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-[#122047]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon name={s.icon} className="h-6 w-6 text-primary" />
                </div>

                <h2 className="mb-2 text-lg font-bold tracking-tight text-white">{s.name}</h2>
                <p className="mb-5 text-sm leading-relaxed text-[#9fb0cc]">{s.shortDescription}</p>

                <ul className="mb-6 flex-grow space-y-2.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3.5} />
                      </span>
                      <span className="text-[13px] leading-relaxed text-[#c6d2e6]">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-[#5ba6ff]"
                  >
                    Full {s.name} page
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={`#${s.slug}-details`}
                    className="shrink-0 text-xs font-semibold text-[#8e9fbc] transition-colors hover:text-white"
                  >
                    Results ↓
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Per-platform detail + case study                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="border-t border-white/[0.07] bg-[#060c1d]">
        <div className="container mx-auto px-4 pt-16 sm:px-6 lg:px-8 md:pt-24">
          <SectionHead
            eyebrow="Platform by platform"
            title="What each channel is actually good at"
            description="One account we've run on every platform, with the brief, the fix and the numbers that followed."
            className="mb-4 md:mb-6"
          />
        </div>

        {services.map((s, idx) => {
          const flip = idx % 2 === 1;
          return (
            <section
              key={s.slug}
              id={`${s.slug}-details`}
              aria-labelledby={`${s.slug}-heading`}
              className="scroll-mt-24 border-b border-white/[0.07] py-14 last:border-b-0 md:py-20"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* ---- Copy column ---- */}
                  <Reveal
                    y={20}
                    amount={0.15}
                    className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}
                  >
                    <div className="mb-5 flex items-center gap-3.5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                        <Icon name={s.icon} className="h-6 w-6 text-primary" />
                      </span>
                      <h2
                        id={`${s.slug}-heading`}
                        className="text-2xl font-extrabold tracking-tight text-white md:text-3xl"
                      >
                        {s.name}
                      </h2>
                    </div>

                    <p className="mb-7 text-[0.975rem] leading-relaxed text-[#9fb0cc]">
                      {s.description}.
                    </p>

                    <dl className="mb-7 space-y-5">
                      <div>
                        <dt className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          What we offer
                        </dt>
                        <dd className="text-sm leading-relaxed text-[#c6d2e6]">{s.whatWeOffer}</dd>
                      </div>
                      <div>
                        <dt className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          Our approach
                        </dt>
                        <dd className="text-sm leading-relaxed text-[#c6d2e6]">{s.approach}</dd>
                      </div>
                    </dl>

                    <p className="mb-7 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-[#9fb0cc]">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                      <span>
                        <span className="font-bold text-white">Typical results: </span>
                        {s.results}
                      </span>
                    </p>

                    <div>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-6 text-sm font-bold text-white transition-colors hover:border-primary/50 hover:bg-white/[0.06] hover:text-primary sm:w-auto sm:px-7"
                      >
                        More on {s.name} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </Reveal>

                  {/* ---- Case study column ---- */}
                  <Reveal
                    y={20}
                    amount={0.1}
                    delay={0.1}
                    className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}
                  >
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 md:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-md bg-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                          Case study
                        </span>
                        <span className="text-xs font-semibold text-[#8e9fbc]">
                          {s.caseStudy.timeline}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                        {s.caseStudy.client}
                      </h3>

                      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                          <dt className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                            Challenge
                          </dt>
                          <dd className="text-[13px] leading-relaxed text-[#c6d2e6]">
                            {s.caseStudy.challenge}
                          </dd>
                        </div>
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                          <dt className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                            Solution
                          </dt>
                          <dd className="text-[13px] leading-relaxed text-[#c6d2e6]">
                            {s.caseStudy.solution}
                          </dd>
                        </div>
                      </dl>

                      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
                        {s.caseStudy.metrics.map((m) => (
                          <div key={m.label} className="bg-[#0e1a38] p-4">
                            <dt className="text-[11px] leading-snug text-[#8e9fbc]">{m.label}</dt>
                            <dd className="mt-1.5 text-[13px] font-bold leading-snug text-white">
                              {m.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <figure className="mt-5 flex gap-3.5 border-t border-white/[0.07] pt-5">
                        <Quote className="h-6 w-6 shrink-0 text-primary/40" aria-hidden="true" />
                        <blockquote className="text-sm leading-relaxed text-[#dbe4f2]">
                          &ldquo;{s.caseStudy.testimonial}&rdquo;
                        </blockquote>
                      </figure>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Why choose                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Why Xpert PPC"
            title="Numbers you can check on this site"
            description="No rounded-up agency claims — each figure below is backed by a page you can open."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            as="dl"
            stagger={0.09}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((s) => {
              const body = (
                <>
                  <dd className="bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-[2.75rem]">
                    {s.value}
                  </dd>
                  <dt className="mt-2 text-sm font-bold text-white">{s.label}</dt>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[#8e9fbc]">{s.note}</p>
                  {s.href ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                      See the proof
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  ) : null}
                </>
              );

              return (
                <RevealItem key={s.label} className="h-full">
                  {s.href ? (
                    <Link
                      href={s.href}
                      className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                      {body}
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Platform comparison                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Side by side"
            title="Which platform fits your offer"
            description="A starting point, not a quote. Real cost per click moves with your market, competition and quality score."
            className="mb-10 md:mb-14"
          />

          {/* Desktop: table */}
          <Reveal y={16} amount={0.1} className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              <table className="w-full text-left">
                <caption className="sr-only">
                  Comparison of advertising platforms by best use case, typical cost per click, and
                  ideal audience
                </caption>
                <thead className="bg-white/[0.04]">
                  <tr>
                    {['Platform', 'Best for', 'Typical CPC range', 'Ideal audience'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e9fbc]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.platform}
                      className="border-t border-white/[0.07] transition-colors hover:bg-white/[0.035]"
                    >
                      <th scope="row" className="px-6 py-4 align-top">
                        <Link
                          href={`/services/${row.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-primary"
                        >
                          {row.platform}
                          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                        </Link>
                      </th>
                      <td className="px-6 py-4 align-top text-sm text-[#9fb0cc]">{row.bestFor}</td>
                      <td className="whitespace-nowrap px-6 py-4 align-top text-sm font-semibold text-[#c6d2e6]">
                        {row.cpc}
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-[#9fb0cc]">{row.audience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Mobile: stacked cards, no horizontal scrolling */}
          <RevealGroup stagger={0.07} className="grid grid-cols-1 gap-4 md:hidden">
            {comparison.map((row) => (
              <RevealItem key={row.platform}>
                <Link
                  href={`/services/${row.slug}`}
                  className="block rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-bold text-white">{row.platform}</span>
                    <span className="shrink-0 rounded-md border border-primary/25 bg-primary/15 px-2 py-1 text-xs font-bold text-primary">
                      {row.cpc}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                        Best for
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-[#c6d2e6]">
                        {row.bestFor}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                        Ideal audience
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-[#c6d2e6]">
                        {row.audience}
                      </dd>
                    </div>
                  </dl>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal y={10} amount={0.2}>
            <p className="mt-6 text-center text-xs text-[#6d7f9e]">
              CPC ranges are typical benchmarks for English-language markets and are not a quote.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA + form                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal y={20} amount={0.2} className="lg:col-span-5 lg:pt-4">
              <SectionHead
                align="left"
                eyebrow="Next step"
                title="Ready to grow your business?"
                description="Send us the account you already run. We'll review structure, tracking and wasted spend, then come back with prioritized actions — before anyone talks about a retainer."
              />

              <ul className="mt-7 space-y-3.5">
                {[
                  'A named specialist on your channel, not an account manager relay',
                  'Tracking checked before any budget recommendation',
                  'Written findings you keep, whether or not we work together',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 border-t border-white/[0.07] pt-6 text-[13px] leading-relaxed text-[#8e9fbc]">
                Prefer to talk first? Reach us on WhatsApp at{' '}
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-success transition-colors hover:text-success/80"
                >
                  {siteConfig.contact.whatsappDisplay}
                </a>
                .
              </p>
            </Reveal>

            <Reveal y={20} amount={0.1} delay={0.1} className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] md:p-8">
                <Suspense
                  fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}
                >
                  <LeadForm source="service-page" />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
