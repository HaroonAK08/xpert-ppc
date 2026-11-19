import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Quote, ShieldCheck } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { ClientLogos } from '@/components/services/client-logos';
import { caseStudyCoverSrc } from '@/components/case-studies/case-study-cover';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getService, services } from '@shared/content/services';
import { getServiceExtras } from '@shared/content/service-extras';
import { getCaseStudy } from '@shared/content/case-studies';
import { buildMetadata, faqSchema, serviceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    // Per-service share card, so a link to Google Ads doesn't preview
    // identically to a link to Amazon Ads.
    image: `/og/${service.slug}.png`,
    keywords: [
      `${service.name} management`,
      `${service.name} agency`,
      ...service.features.map((f) => f.toLowerCase()),
    ],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const { detail } = service;
  const extras = getServiceExtras(service.slug);

  const process = extras?.process ?? detail.process.map((title) => ({ title, description: '' }));
  const whyChooseUs = extras?.whyChooseUs ?? detail.whyChooseUs;
  const faqs = extras?.faqs ?? [];
  const timeline = extras?.firstNinetyDays ?? [];
  const related = (extras?.relatedCaseStudies ?? [])
    .map((s) => getCaseStudy(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const otherServices = services.filter((s) => s.slug !== service.slug);
  // "An Amazon Ads specialist" vs "A Google Ads specialist".
  const article = /^[aeiou]/i.test(service.name) ? 'An' : 'A';

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `${service.name} Management`,
            description: service.seo.description,
            path: `/services/${service.slug}`,
          }),
          ...(faqs.length ? [faqSchema(faqs)] : []),
        ]}
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
          <Breadcrumbs
            items={[{ label: 'Services', href: '/services' }, { label: service.name }]}
          />

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
            <LoadGroup className="lg:col-span-7 lg:pt-4">
              <LoadItem className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Icon name={service.icon} className="h-4 w-4 text-primary" />
                </span>
                {service.name} management
              </LoadItem>

              <LoadItem
                as="h1"
                y={16}
                duration={0.7}
                className="mb-5 text-balance text-[2rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]"
              >
                {detail.heroTitle}
              </LoadItem>

              <LoadItem
                as="p"
                y={14}
                className="mb-7 max-w-xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
              >
                {detail.subheading}
              </LoadItem>

              <LoadItem as="ul" className="mb-8 flex flex-wrap gap-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[13px] font-semibold text-[#c6d2e6]"
                  >
                    {f}
                  </li>
                ))}
              </LoadItem>

              <LoadItem className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#consultation"
                  className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
                >
                  Get a free {service.name} audit <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#case-study"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
                >
                  See the numbers
                </a>
              </LoadItem>
            </LoadGroup>

            {/* Results snapshot — the quickest proof we can put above the fold. */}
            <LoadFade y={18} delay={0.3} className="lg:col-span-5">
              <div className="rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    Recent account
                  </span>
                  <span className="text-xs font-semibold text-[#8e9fbc]">
                    {service.caseStudy.timeline}
                  </span>
                </div>

                <p className="mt-4 text-lg font-bold tracking-tight text-white">
                  {service.caseStudy.client}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08]">
                  {service.caseStudy.metrics.map((m) => (
                    <div key={m.label} className="bg-[#0e1a38] p-4">
                      <dt className="text-[11px] leading-snug text-[#8e9fbc]">{m.label}</dt>
                      <dd className="mt-1.5 text-[13px] font-bold leading-snug text-white">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 flex items-start gap-2.5 border-t border-white/[0.07] pt-5 text-[13px] leading-relaxed text-[#9fb0cc]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>
                    <span className="font-bold text-white">Typical results: </span>
                    {service.results}
                  </span>
                </p>
              </div>
            </LoadFade>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Signals — "you probably need this if…"                            */}
      {/* ---------------------------------------------------------------- */}
      {extras?.signals.length ? (
        <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Sound familiar?"
              title={`When ${service.name} needs a second pair of eyes`}
              description="If more than one of these is true, the free audit will pay for itself before anyone talks about a retainer."
              className="mb-10 md:mb-14"
            />

            <RevealGroup
              stagger={0.08}
              amount={0.15}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {extras.signals.map((sig) => (
                <RevealItem key={sig} className="h-full">
                  <div className="flex h-full items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-bold text-primary">
                      ?
                    </span>
                    <p className="text-[0.95rem] leading-relaxed text-[#dbe4f2]">{sig}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <ClientLogos channel={service.name} />

      {/* ---------------------------------------------------------------- */}
      {/* Capabilities                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="What we run"
            title={`Inside your ${service.name} engagement`}
            description={`${service.description}. Every campaign type below is built, managed and reported in-house.`}
            className="mb-10 md:mb-14"
          />

          {/* Photo + the working method, above the campaign-type cards, so the
              section answers "how do you work" and "what do you run" in one
              place rather than across two near-identical sections. */}
          <div className="mb-10 grid items-start gap-8 lg:grid-cols-[5fr_6fr] lg:gap-12 md:mb-14">
            <Reveal y={16} amount={0.15}>
              <figure className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38] lg:aspect-[4/3]">
                <Image
                  src={`/services/${service.slug}.webp`}
                  alt={extras?.imageAlt ?? ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                {/* Light scrim only — the photo now carries meaning, so it
                    should not be dimmed into decoration. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#060c1d]/55 via-transparent to-transparent"
                />
              </figure>
            </Reveal>

            <Reveal y={16} amount={0.15}>
              <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                How we work on the account
              </h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-[#c6d2e6]">
                {service.shortDescription}
              </p>

              {/* `approach` is a comma-separated list in the content file. Split
                  it rather than reflowing into a sentence, which would need a
                  lower-case pass and wreck acronyms like A/B and ACOS. */}
              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {service.approach
                  .replace(/\.$/, '')
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
                  // Source copy reads as one sentence, so every item after the
                  // first arrives lower-cased. Capitalise the first character
                  // only, leaving any acronym inside the string alone.
                  .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                  .map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5"
                    >
                      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3.5} />
                      </span>
                      <span className="text-[13px] leading-relaxed text-[#c6d2e6]">{item}</span>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {detail.detailedServices.map((d, i) => (
              <RevealItem key={d.title} as="article" className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-[#122047] md:p-7">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="mb-2.5 text-lg font-bold tracking-tight text-white">{d.title}</h4>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{d.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Core capabilities + why us                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal y={20} amount={0.2}>
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 md:p-8">
              <h2 className="mb-6 text-xl font-extrabold tracking-tight text-white">
                Core capabilities
              </h2>
              <ul className="space-y-3.5">
                {detail.whatWeOffer.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.1} amount={0.2}>
            <div className="h-full rounded-2xl border border-primary/25 bg-[#0b1733] p-6 md:p-8">
              <h2 className="mb-6 text-xl font-extrabold tracking-tight text-white">
                Why Xpert PPC
              </h2>
              <ul className="space-y-3.5">
                {whyChooseUs.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                      <Check className="h-3 w-3 text-success" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Process                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How it runs"
            title={`Our ${service.name} process`}
            description="Same sequence on every account, so you always know what stage you are at and what lands next."
            className="mb-10 md:mb-14"
          />

          <RevealGroup as="ol" stagger={0.1} amount={0.1} className="mx-auto max-w-3xl space-y-4">
            {process.map((step, i) => (
              <RevealItem key={step.title} as="li" y={16}>
                <div className="flex gap-5 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 md:p-6">
                  <div className="flex shrink-0 flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                      {i + 1}
                    </span>
                    {i < process.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-2 w-px flex-1 bg-gradient-to-b from-primary/25 to-transparent"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 pb-1">
                    <h3 className="text-base font-bold tracking-tight text-white">{step.title}</h3>
                    {step.description ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-[#9fb0cc]">
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* First 90 days                                                     */}
      {/* ---------------------------------------------------------------- */}
      {timeline.length ? (
        <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="What to expect"
              title="Your first 90 days"
              description="So you know what lands when, rather than waiting a month to find out whether anything happened."
              className="mb-10 md:mb-14"
            />

            <RevealGroup
              as="ol"
              stagger={0.1}
              amount={0.12}
              className="grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              {timeline.map((phase, i) => (
                <RevealItem key={phase.window} as="li" className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 md:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        {phase.window}
                      </span>
                      <span className="text-xs font-bold text-[#6d7f9e]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold tracking-tight text-white">
                      {phase.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#9fb0cc]">
                      {phase.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal y={10} amount={0.2}>
              <p className="mt-8 text-center text-xs text-[#6d7f9e]">
                Timings assume account access and tracking cooperation in week one.
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Case study                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="case-study"
        className="scroll-mt-24 border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Case study"
            title={`${service.name} in practice`}
            description="One account, the brief we were handed, what we changed and what moved as a result."
            className="mb-10 md:mb-14"
          />

          <Reveal y={20} amount={0.1} className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                  {service.caseStudy.client}
                </h3>
                <span className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-xs font-semibold text-[#9fb0cc]">
                  {service.caseStudy.timeline}
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <dt className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                    Challenge
                  </dt>
                  <dd className="text-sm leading-relaxed text-[#c6d2e6]">
                    {service.caseStudy.challenge}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <dt className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                    Solution
                  </dt>
                  <dd className="text-sm leading-relaxed text-[#c6d2e6]">
                    {service.caseStudy.solution}
                  </dd>
                </div>
              </dl>

              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
                {service.caseStudy.metrics.map((m) => (
                  <div key={m.label} className="bg-[#0e1a38] p-4">
                    <dt className="text-[11px] leading-snug text-[#8e9fbc]">{m.label}</dt>
                    <dd className="mt-1.5 text-[13px] font-bold leading-snug text-white">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <figure className="mt-6 flex gap-3.5 border-t border-white/[0.07] pt-6">
                <Quote className="h-6 w-6 shrink-0 text-primary/40" aria-hidden="true" />
                <blockquote className="text-[0.95rem] leading-relaxed text-[#dbe4f2]">
                  &ldquo;{service.caseStudy.testimonial}&rdquo;
                </blockquote>
              </figure>
            </div>
          </Reveal>

          {related.length ? (
            <div className="mx-auto mt-12 max-w-4xl">
              <Reveal y={12} amount={0.3}>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                  Published {service.name} work
                </p>
              </Reveal>

              <RevealGroup
                stagger={0.08}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {related.map((cs) => (
                  <RevealItem key={cs.slug} className="h-full">
                    <Link
                      href={`/case-study/${cs.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] transition-colors duration-300 hover:border-primary/45 hover:bg-white/[0.06]"
                    >
                      <span className="relative block aspect-[16/9] overflow-hidden bg-[#0b1733]">
                        <Image
                          src={caseStudyCoverSrc(cs.slug)}
                          alt={`${cs.client} case study`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#060c1d] via-[#060c1d]/35 to-transparent"
                        />
                      </span>

                      <span className="flex flex-1 flex-col p-5">
                      <span className="text-sm font-bold text-white">{cs.client}</span>
                      <span className="mt-2 flex-1 text-[13px] leading-relaxed text-[#9fb0cc] line-clamp-2">
                        {cs.excerpt}
                      </span>
                      <span className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold tracking-tight text-white">
                          {cs.metrics[0]?.value}
                        </span>
                        <span className="text-[11px] text-[#8e9fbc]">{cs.metrics[0]?.label}</span>
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                        Read it
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      </span>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      {faqs.length ? (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <SectionHead
                  align="left"
                  eyebrow="FAQ"
                  title={`${service.name} questions we get asked`}
                  description="Anything not covered here, send it over — you'll get a straight answer before any call."
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
                    {faqs.map((f, i) => (
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
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Lead form                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="consultation"
        className="scroll-mt-24 border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal y={20} amount={0.2} className="lg:col-span-5 lg:pt-4">
              <SectionHead
                align="left"
                eyebrow="Next step"
                title={`Start with a free ${service.name} audit`}
                description={`Send us the account you already run. We'll review structure, tracking and wasted spend, then come back with prioritized actions — before anyone talks about a retainer.`}
              />

              <ul className="mt-7 space-y-3.5">
                {[
                  `${article} ${service.name} specialist on the account, not an account-manager relay`,
                  'Tracking verified before any budget recommendation',
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
                <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
                  <LeadForm source="service-page" defaultPlatform={service.name} />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Other services — stop the page being a dead end                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Other channels"
            title="Most accounts need more than one"
            description="We run every platform below on the same measurement stack, so budget can follow results across channels rather than sitting where it was first allocated."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {otherServices.map((o) => (
              <RevealItem key={o.slug} className="h-full">
                <Link
                  href={`/services/${o.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                    <Icon name={o.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-base font-bold text-white">
                      {o.name}
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                      {o.homeDescription}
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
