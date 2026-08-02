import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

import { Icon } from '@/components/icon';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
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
import { heroBullets, heroTrustLine, homeFaqs, processSteps } from '@shared/content/home';
import { buildMetadata, faqSchema, professionalServiceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Xpert PPC | Google, Meta & TikTok Ads Agency',
  description: siteConfig.description,
  path: '/',
});

function AuditCard() {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="mb-1 text-xl font-bold text-foreground">Get a Free PPC Audit</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        We&apos;ll review your account and show where you&apos;re losing budget, free of charge and
        with no obligation.
      </p>
      <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-muted/40" />}>
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
      {/* Hero — staggered entrance on load                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background py-12 md:py-20">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[-6rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
            <LoadGroup className="order-1 lg:col-span-7">
              <LoadItem className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground">
                PPC Agency for Measurable Growth
              </LoadItem>

              <LoadItem
                as="h1"
                y={16}
                duration={0.7}
                className="mb-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
              >
                We Grow Revenue With{' '}
                <span className="text-primary">High-Performance PPC Ads</span>
              </LoadItem>

              <LoadItem
                as="p"
                y={14}
                className="mb-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                Google, Meta, TikTok, Amazon, LinkedIn and Microsoft Ads, managed for ROAS, clear
                reporting, and weekly optimization. No vanity metrics.
              </LoadItem>

              {/* Form appears inline on small screens, in the sidebar on large */}
              <LoadItem className="mb-8 lg:hidden">
                <AuditCard />
              </LoadItem>

              <LoadItem as="ul" className="mb-8 space-y-3">
                {heroBullets.map((b) => (
                  <li key={b} className="flex items-start">
                    <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </LoadItem>

              <LoadItem
                as="p"
                y={10}
                className="border-t border-border pt-5 text-sm text-muted-foreground"
              >
                {heroTrustLine}
              </LoadItem>
            </LoadGroup>

            <LoadFade delay={0.35} className="order-2 hidden lg:col-span-5 lg:block">
              <AuditCard />
            </LoadFade>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Services grid — staggered scroll reveal                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Ads On Every Platform That Matters
            </h2>
            <p className="text-muted-foreground">
              We build acquisition systems around each platform&apos;s algorithm, not generic
              one-size campaigns.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem
                key={s.slug}
                as="article"
                className="flex h-full flex-col rounded-2xl border border-primary/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_12px_30px_-10px_hsla(var(--primary),0.45)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background">
                  <Icon name={s.icon} className="h-7 w-7 text-primary" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-foreground">{s.name}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {s.homeDescription}
                </p>

                <ul className="mb-6 space-y-2.5">
                  {s.homeTags.map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                      <span className="text-sm text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${s.slug}`}
                  className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-xl border border-primary/40 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Learn More <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border px-8 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
            >
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured case study                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-border bg-card py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={24} duration={0.65} className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Featured Case Study
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
              Desert Farms, 12+ Years of Compounding Growth
            </h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              For over a decade, Xpert PPC helped Desert Farms scale camel milk eCommerce through
              SEO, Google Ads, and Meta Ads, building a durable acquisition engine, not short-term
              spikes.
            </p>
            <Link
              href="/case-study"
              className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Process — steps slide in from the left                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
              How We Work
            </h2>
            <p className="text-muted-foreground">
              A clear process from first audit to scaled spend.
            </p>
          </Reveal>

          <RevealGroup
            as="ol"
            stagger={0.12}
            amount={0.2}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {processSteps.map((p, i) => (
              <RevealItem
                key={p.title}
                as="li"
                x={-24}
                className="relative rounded-2xl border border-border bg-card p-5"
              >
                <span className="text-xs font-bold text-primary">STEP {i + 1}</span>
                <div className="my-4 w-fit rounded-xl bg-primary/10 p-2.5">
                  <Icon name={p.icon} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ — accordion items stagger in                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-border bg-card py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal
              as="h2"
              y={14}
              amount={0.5}
              className="mb-8 text-center text-3xl font-extrabold text-foreground md:text-4xl"
            >
              Frequently Asked Questions
            </Reveal>

            <RevealGroup stagger={0.08} amount={0.1} className="space-y-3">
              <Accordion type="single" collapsible className="space-y-3">
                {homeFaqs.map((f, i) => (
                  <RevealItem key={f.question} y={10} duration={0.45}>
                    <AccordionItem
                      value={`item-${i}`}
                      className="rounded-xl border border-border bg-background px-5 data-[state=open]:border-primary/40"
                    >
                      <AccordionTrigger className="px-0 text-left font-semibold text-foreground hover:no-underline">
                        <span className="min-w-0 flex-1 text-balance">{f.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 leading-relaxed text-muted-foreground">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </RevealItem>
                ))}
              </Accordion>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA — scales in                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal
            scale={0.98}
            className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 text-center sm:p-8 md:p-10"
          >
            <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
              Ready to scale with cleaner ad spend?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Stop paying for generic strategies. Get a free audit and a clear plan to improve ROAS.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Book a Strategy Call
              </Link>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-bold text-success transition-colors hover:text-success/80"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Or WhatsApp us now
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
