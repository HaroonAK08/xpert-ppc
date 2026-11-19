import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, ShieldCheck } from 'lucide-react';

import { Icon } from '@/components/icon';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { IndustriesGrid } from '@/components/home/industries-grid';
import { ResultsBand } from '@/components/home/results-band';
import { SectionHead } from '@/components/home/section-head';
import { Testimonials } from '@/components/home/testimonials';
import { TrustStrip } from '@/components/home/trust-strip';
import {
  LoadFade,
  LoadGroup,
  LoadItem,
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { services } from '@shared/content/services';
import { heroBullets, homeFaqs, processSteps } from '@shared/content/home';
import { getFeaturedCaseStudies } from '@shared/content/case-studies';
import { buildMetadata, faqSchema, professionalServiceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Xpert PPC | Google, Meta & TikTok Ads Agency',
  description: siteConfig.description,
  path: '/',
});

/** Deliverable promised at the end of each process step. */
const processDeliverables = [
  'Opportunity and tracking summary',
  'Channel plan with agreed KPIs',
  'Approved campaigns, measurement live',
  'Weekly learning and optimization report',
];

function AuditCard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] md:p-7">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-success">
        <ShieldCheck className="h-3.5 w-3.5" /> No obligation
      </span>

      <h2 className="mb-1.5 mt-4 text-xl font-bold tracking-tight text-white">
        Get a free PPC audit
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-[#9fb0cc]">
        We review your account and show exactly where budget is leaking — usually within two
        working days.
      </p>

      <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-white/5" />}>
        <LeadForm variant="audit" source="hero-audit" />
      </Suspense>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={[professionalServiceSchema(), faqSchema(homeFaqs)]} />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-14 pt-10 md:pb-20 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {/* Faint grid, faded out toward the edges so it never competes
              with the copy sitting on top of it. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
              backgroundSize: '68px 68px',
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
            }}
          />
          <div className="absolute left-1/2 top-[-18rem] h-[40rem] w-[64rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
            <LoadGroup className="order-1 lg:col-span-7 lg:pt-6">
              <LoadItem className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
                <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-primary/15 px-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                  Since {siteConfig.founded}
                </span>
                Performance marketing, not vanity metrics
              </LoadItem>

              <LoadItem
                as="h1"
                y={16}
                duration={0.7}
                className="mb-6 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]"
              >
                Turn ad spend into{' '}
                <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                  predictable revenue
                </span>
              </LoadItem>

              <LoadItem
                as="p"
                y={14}
                className="mb-7 max-w-xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
              >
                A senior PPC team running Google, Meta and four other channels against the only
                numbers that matter to you — qualified leads, sales and cost per result.
              </LoadItem>

              <LoadItem as="ul" className="mb-8 space-y-3.5">
                {heroBullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{b}</span>
                  </li>
                ))}
              </LoadItem>

              <LoadItem className="mb-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
                >
                  Book a strategy call <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/case-study"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
                >
                  See the results
                </Link>
              </LoadItem>

              <LoadItem
                as="p"
                y={10}
                className="border-t border-white/[0.07] pt-6 text-[13px] leading-relaxed text-[#8e9fbc]"
              >
                Six ad platforms under one roof · UAE, Canada and global remote team · Replies on
                WhatsApp the same day
              </LoadItem>

              <LoadItem className="mt-8 lg:hidden">
                <AuditCard />
              </LoadItem>
            </LoadGroup>

            <LoadFade delay={0.3} className="order-2 hidden lg:col-span-5 lg:block">
              <AuditCard />
            </LoadFade>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* ---------------------------------------------------------------- */}
      {/* Services                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="What we run"
            title="Capture demand that converts"
            description="Six channels, one strategy. We pick the mix your margins can carry and connect every click to a measurable next step."
            className="mb-10 md:mb-14"
          />

          <RevealGroup className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem
                key={s.slug}
                as="article"
                className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-[#122047]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon name={s.icon} className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mb-2 text-lg font-bold tracking-tight text-white">{s.name}</h3>
                <p className="mb-5 text-sm leading-relaxed text-[#9fb0cc]">{s.homeDescription}</p>

                <ul className="mb-6 flex flex-wrap gap-2">
                  {s.homeTags.slice(0, 3).map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[12px] font-semibold text-[#9fb0cc]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${s.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-[#5ba6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0e1a38]"
                >
                  Explore {s.name}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal y={12} amount={0.3} className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-8 text-sm font-bold text-white transition-colors hover:border-primary/50 hover:bg-white/[0.06] hover:text-primary sm:w-auto"
            >
              See all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ResultsBand />

      {/* ---------------------------------------------------------------- */}
      {/* Featured case studies                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Case studies"
            title="Proven results across industries"
            description="From camel-milk eCommerce to law firms and local services — real accounts, real metrics, written up in full."
            className="mb-10 md:mb-14"
          />

          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {getFeaturedCaseStudies(3).map((cs) => (
              <RevealItem key={cs.slug} className="h-full">
                <Link
                  href={`/case-study/${cs.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-[#122047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {cs.channels.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-primary/12 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3.5 text-lg font-bold tracking-tight text-white">
                    {cs.client}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9fb0cc] line-clamp-3">
                    {cs.excerpt}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                    {cs.metrics.slice(0, 2).map((m) => (
                      <div key={m.label}>
                        <div className="text-xl font-extrabold tracking-tight text-white">
                          {m.value}
                        </div>
                        <div className="mt-0.5 text-[11px] leading-snug text-[#8e9fbc]">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read case study
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal y={12} amount={0.3} className="mt-10 text-center">
            <Link
              href="/case-study"
              className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              View all case studies <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <IndustriesGrid />

      {/* ---------------------------------------------------------------- */}
      {/* Process                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How we work"
            title="A clear path from first audit to scaled spend"
            description="Four steps, each ending in something you can actually hold — no month of silence before the first report."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            as="ol"
            stagger={0.12}
            amount={0.2}
            className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Connecting rail, desktop only. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block"
            />

            {processSteps.map((p, i) => (
              <RevealItem
                key={p.title}
                as="li"
                y={20}
                className="relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={p.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                    Step {i + 1}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold tracking-tight text-white">{p.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-[#9fb0cc]">{p.description}</p>

                <p className="mt-5 border-t border-white/[0.07] pt-4 text-[12px] leading-relaxed text-[#8e9fbc]">
                  <span className="font-bold text-primary">Deliverable: </span>
                  {processDeliverables[i]}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Testimonials />

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionHead
                align="left"
                eyebrow="FAQ"
                title="Questions worth asking any agency"
                description="If something here is missing, send it over on WhatsApp — you'll get a straight answer before any call."
              />
              <Reveal y={12} amount={0.3} className="mt-7">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-success/30 bg-success/10 px-5 text-sm font-bold text-success transition-colors hover:bg-success/15"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp
                </a>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <RevealGroup stagger={0.08} amount={0.1}>
                <Accordion type="single" collapsible className="space-y-3">
                  {homeFaqs.map((f, i) => (
                    <RevealItem key={f.question} y={10} duration={0.45}>
                      <AccordionItem
                        value={`item-${i}`}
                        className="rounded-xl border border-white/[0.08] bg-[#0e1a38] px-1 data-[state=open]:border-primary/40 data-[state=open]:bg-[#122047]"
                      >
                        <AccordionTrigger className="text-left text-[0.95rem] font-semibold text-white hover:text-primary hover:no-underline">
                          <span className="min-w-0 flex-1 text-balance">{f.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="leading-relaxed text-[#9fb0cc]">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </RevealItem>
                  ))}
                </Accordion>
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background pb-20 pt-4 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal
            y={20}
            amount={0.25}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-[#0b1733] px-6 py-12 text-center sm:px-10 md:py-16"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[110px]"
            />

            <div className="relative z-10">
              <h2 className="mx-auto max-w-2xl text-balance text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-[2.5rem]">
                Ready to scale with cleaner ad spend?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                We&apos;ll review the account, check tracking and send prioritized next actions —
                not a generic package.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  Book a strategy call <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-8 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-success" /> WhatsApp us now
                </a>
              </div>

              <p className="mt-6 text-[13px] text-[#6d7f9e]">
                Free audit · No lock-in contract · Reply within one working day
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
