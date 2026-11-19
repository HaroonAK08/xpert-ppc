import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Quote } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { caseStudyCoverSrc } from '@/components/case-studies/case-study-cover';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { caseStudies, getCaseStudy } from '@shared/content/case-studies';
import { caseStudyNarratives } from '@shared/content/case-study-narratives';
import { getCaseStudyExtras } from '@shared/content/case-study-extras';
import { services } from '@shared/content/services';
import { industries } from '@shared/content/industries';
import { absoluteUrl, buildMetadata, faqSchema } from '@/lib/seo';
import { getCaseStudyClientAsset } from '@/lib/case-study-client-assets';
import { siteConfig } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  return buildMetadata({
    title: caseStudy.seo.title,
    description: caseStudy.seo.description,
    path: `/case-study/${caseStudy.slug}`,
    keywords: caseStudy.seo.keywords,
    image: caseStudyCoverSrc(caseStudy.slug),
    type: 'article',
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const narrative = caseStudyNarratives[caseStudy.slug];
  const clientAsset = getCaseStudyClientAsset(caseStudy.slug);
  const related = caseStudies.filter((c) => c.slug !== caseStudy.slug).slice(0, 3);
  const headline = caseStudy.metrics[0];
  const extras = getCaseStudyExtras(caseStudy.slug);
  const relatedServices = (extras?.relatedServices ?? [])
    .map((slugName) => services.find((service) => service.slug === slugName))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const relatedIndustry = extras?.relatedIndustry
    ? industries.find((industry) => industry.slug === extras.relatedIndustry)
    : undefined;
  // `duration` holds everything from "12 months" to "About four years of
  // ongoing support", so build the sentence around it rather than inside it.
  const scopeSentence = `Every figure below is taken from the client's own account reporting. Scope: ${caseStudy.duration}.`;

  return (
    <>
      <JsonLd
        data={[
          {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: caseStudy.title,
          description: caseStudy.seo.description,
          url: absoluteUrl(`/case-study/${caseStudy.slug}`),
          image: absoluteUrl(caseStudyCoverSrc(caseStudy.slug)),
          author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
          },
          about: caseStudy.client,
          articleSection: 'Case Study',
          },
          ...(extras?.faqs.length ? [faqSchema(extras.faqs)] : []),
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-12 pt-8 md:pb-16 md:pt-12">
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
          <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Case Studies', href: '/case-study' }, { label: caseStudy.client }]}
          />

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
            <div>
              <ul className="mb-6 flex flex-wrap gap-2">
                {caseStudy.channels.map((channel) => (
                  <li
                    key={channel}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[12px] font-semibold text-[#c6d2e6]"
                  >
                    {channel}
                  </li>
                ))}
              </ul>

              <h1 className="text-balance text-[2rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                {caseStudy.client}
              </h1>

              <p className="mt-4 text-base font-semibold text-primary md:text-lg">
                {caseStudy.subtitle}
              </p>

              <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                {caseStudy.excerpt}
              </p>

              {extras?.brief ? (
                <p className="mt-5 max-w-xl border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-[#c6d2e6]">
                  {extras.brief}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
                >
                  Get my free audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#results"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
                >
                  Jump to the results
                </a>
              </div>
            </div>

            {/* Headline metric + scope */}
            <div className="rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 md:p-7">
              {headline ? (
                <>
                  <span className="block bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
                    {headline.value}
                  </span>
                  <span className="mt-2 block text-sm font-bold uppercase tracking-[0.14em] text-primary">
                    {headline.label}
                  </span>
                </>
              ) : null}

              <dl className="mt-6 space-y-3.5 border-t border-white/[0.07] pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-[#8e9fbc]">Industry</dt>
                  <dd className="text-right font-semibold text-[#c6d2e6]">{caseStudy.industry}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-[#8e9fbc]">Reporting period</dt>
                  <dd className="text-right font-semibold text-[#c6d2e6]">{caseStudy.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-[#8e9fbc]">Channels</dt>
                  <dd className="text-right font-semibold text-[#c6d2e6]">
                    {caseStudy.channels.join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Metric strip */}
          <Reveal y={14} amount={0.2} className="mt-10">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
              {caseStudy.metrics.slice(0, 4).map((metric) => (
                <div key={metric.label} className="bg-[#0e1a38] p-5">
                  <dd className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                    {metric.value}
                  </dd>
                  <dt className="mt-1.5 text-[11px] font-semibold uppercase leading-snug tracking-wider text-[#8e9fbc]">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The client                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid items-start gap-10 ${clientAsset ? 'lg:grid-cols-[.8fr_1.2fr] lg:gap-14' : ''}`}
          >
            {clientAsset ? (
              <Reveal y={16} amount={0.15}>
                <figure className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={clientAsset.src}
                      alt={clientAsset.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="border-t border-white/[0.07] px-4 py-3 text-xs leading-relaxed text-[#8e9fbc]">
                    Public client context from{' '}
                    <span className="font-semibold text-[#c6d2e6]">
                      {new URL(clientAsset.sourceUrl).hostname}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ) : null}

            <Reveal y={16} amount={0.15}>
              {clientAsset?.logoSrc ? (
                <span className="mb-5 inline-flex h-11 items-center rounded-lg bg-white/95 px-3">
                  <Image
                    src={clientAsset.logoSrc}
                    alt={clientAsset.logoAlt ?? ''}
                    width={180}
                    height={48}
                    className="max-h-7 w-auto max-w-[150px] object-contain"
                  />
                </span>
              ) : null}

              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                The client
              </h2>

              <p className="mt-5 text-[1.0625rem] leading-relaxed text-[#dbe4f2]">
                {caseStudy.intro}
              </p>

              {clientAsset ? (
                <p className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-relaxed text-[#9fb0cc]">
                  {clientAsset.context}
                </p>
              ) : null}

              {extras?.profile.length ? (
                <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
                  {extras.profile.map((item) => (
                    <div key={item.label} className="bg-[#060c1d] p-4">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#6d7f9e]">
                        {item.label}
                      </dt>
                      <dd className="mt-1.5 text-[13px] font-semibold leading-snug text-[#c6d2e6]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                  Services deployed
                </p>
                <ul className="flex flex-wrap gap-2">
                  {caseStudy.servicesDeployed.slice(0, 6).map((service) => (
                    <li
                      key={service}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[12px] font-semibold text-[#c6d2e6]"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The problem                                                       */}
      {/* ---------------------------------------------------------------- */}
      {narrative?.challenge.length ? (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="The problem"
              title="Where the account started"
              className="mb-10 md:mb-14"
            />

            <RevealGroup
              stagger={0.09}
              amount={0.15}
              className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
            >
              {narrative.challenge.map((paragraph, i) => (
                <RevealItem key={paragraph} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{paragraph}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* What we did — pillars carry their own title + description          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The work"
            title={caseStudy.pillarsHeading}
            description={caseStudy.pillarsIntro}
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            amount={0.12}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {caseStudy.pillars.map((pillar) => (
              <RevealItem key={pillar.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={pillar.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{pillar.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Narrative strategy paragraphs, as prose rather than mislabelled cards */}
          {narrative?.strategy.length ? (
            <Reveal y={16} amount={0.1} className="mx-auto mt-10 max-w-3xl md:mt-14">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 md:p-8">
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  How it came together
                </p>
                <ul className="space-y-4">
                  {narrative.strategy.map((paragraph) => (
                    <li key={paragraph} className="flex gap-3.5">
                      <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">
                        {paragraph}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Results                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="results" className="scroll-mt-24 bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The results"
            title="What the reporting showed"
            description={scopeSentence}
            className="mb-10 md:mb-14"
          />

          <div className="mx-auto max-w-4xl">
            <Reveal y={16} amount={0.1}>
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
                {caseStudy.metrics.map((metric) => (
                  <div key={metric.label} className="flex items-start gap-4 bg-[#0e1a38] p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                      <Icon name={metric.icon} className="h-5 w-5 text-primary" />
                    </span>
                    <span className="min-w-0">
                      <dd className="text-2xl font-extrabold leading-tight tracking-tight text-white">
                        {metric.value}
                      </dd>
                      <dt className="mt-1 text-[13px] leading-snug text-[#8e9fbc]">
                        {metric.label}
                      </dt>
                    </span>
                  </div>
                ))}
              </dl>
            </Reveal>

            {narrative?.results.length ? (
              <Reveal y={16} amount={0.1} className="mt-6">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 md:p-8">
                  {narrative.results.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mb-4 text-[0.95rem] leading-relaxed text-[#c6d2e6] last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <Reveal y={12} amount={0.2} className="mt-6">
              <div className="rounded-2xl border border-primary/25 bg-[#0b1733] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  How we measure
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#9fb0cc]">
                  {caseStudy.measurementNote ??
                    'Figures come from the client\u2019s own account reporting for the period stated above. Platform-reported conversions are not always equivalent to confirmed orders or bookings.'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof                                                             */}
      {/* ---------------------------------------------------------------- */}
      {caseStudy.proof?.length ? (
        <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Evidence"
              title="The reporting behind the results"
              description="Redacted screenshots from the account, with the scope note kept beside each one."
              className="mb-10 md:mb-14"
            />

            <RevealGroup stagger={0.1} amount={0.1} className="grid gap-5 md:grid-cols-2">
              {caseStudy.proof.map((proof) => (
                <RevealItem key={proof.src} as="figure" className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38]">
                    <Image
                      src={proof.src}
                      alt={proof.alt}
                      width={1200}
                      height={760}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-auto w-full"
                    />
                    <figcaption className="flex-1 border-t border-white/[0.07] p-5 text-[13px] leading-relaxed text-[#9fb0cc]">
                      {proof.caption}
                    </figcaption>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Takeaways + approach                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="What we learned"
            title={caseStudy.takeawaysHeading}
            description={caseStudy.takeawaysIntro}
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.08}
            amount={0.12}
            className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
          >
            {caseStudy.takeaways.map((takeaway) => (
              <RevealItem key={takeaway.title} className="h-full">
                <div className="h-full rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <h3 className="mb-2.5 text-base font-bold tracking-tight text-white">
                    {takeaway.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{takeaway.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {caseStudy.approach.length ? (
            <Reveal y={16} amount={0.1} className="mx-auto mt-10 max-w-3xl md:mt-14">
              <div className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 md:p-8">
                <Quote className="h-7 w-7 shrink-0 text-primary/40" aria-hidden="true" />
                <div>
                  {caseStudy.approach.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mb-4 text-[0.95rem] leading-relaxed text-[#dbe4f2] last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      {extras?.faqs.length ? (
        <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <SectionHead
                  align="left"
                  eyebrow="Questions"
                  title="What people ask about this kind of account"
                  description="If your situation is close to this one, these are usually the first things raised on a call."
                />
                <Reveal y={12} amount={0.3} className="mt-7">
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-success/30 bg-success/10 px-5 text-sm font-bold text-success transition-colors hover:bg-success/15"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Ask about your account
                  </a>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <RevealGroup stagger={0.08} amount={0.1}>
                  <Accordion type="single" collapsible className="space-y-3">
                    {extras.faqs.map((faq, i) => (
                      <RevealItem key={faq.question} y={10} duration={0.45}>
                        <AccordionItem
                          value={`faq-${i}`}
                          className="rounded-xl border border-white/[0.08] bg-[#0e1a38] px-1 data-[state=open]:border-primary/40 data-[state=open]:bg-[#122047]"
                        >
                          <AccordionTrigger className="text-left text-[0.95rem] font-semibold text-white hover:text-primary hover:no-underline">
                            <span className="min-w-0 flex-1 text-balance">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="leading-relaxed text-[#9fb0cc]">
                            {faq.answer}
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
      {/* Where to go next                                                  */}
      {/* ---------------------------------------------------------------- */}
      {relatedServices.length || relatedIndustry ? (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Explore further"
              title="The work behind this result"
              description="How we run these channels day to day, and what the same approach looks like in this sector."
              className="mb-10 md:mb-14"
            />

            <RevealGroup
              stagger={0.08}
              className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
            >
              {relatedServices.map((service) => (
                <RevealItem key={service.slug} className="h-full">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                      <Icon name={service.icon} className="h-5 w-5 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-base font-bold text-white">
                        {service.name}
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                        {service.homeDescription}
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              ))}

              {relatedIndustry ? (
                <RevealItem className="h-full">
                  <Link
                    href={`/industries/${relatedIndustry.slug}`}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                      <Icon name={relatedIndustry.icon} className="h-5 w-5 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-base font-bold text-white">
                        {relatedIndustry.name}
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                        {relatedIndustry.navDescription}
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              ) : null}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Related                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Keep reading"
            title="More results like this"
            className="mb-10 md:mb-14"
          />

          <RevealGroup stagger={0.08} className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <RevealItem key={item.slug} className="h-full">
                <Link
                  href={`/case-study/${item.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d7f9e]">
                    {item.channels[0]}
                  </span>
                  <span className="mt-3 block bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                    {item.metrics[0]?.value}
                  </span>
                  <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8e9fbc]">
                    {item.metrics[0]?.label}
                  </span>
                  <span className="mt-4 flex-1 text-sm font-bold text-white">{item.client}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read case study
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section id="audit" className="scroll-mt-24 bg-background pb-20 pt-16 md:pb-28 md:pt-24">
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
                Want a result like this on your account?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                We review your ad account for free and show where budget is being wasted — with the
                same scope notes you see above.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  Get my free audit <ArrowRight className="ml-2 h-4 w-4" />
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
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
