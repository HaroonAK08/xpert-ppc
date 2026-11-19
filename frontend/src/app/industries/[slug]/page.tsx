import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Quote, ShieldCheck, Star } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { caseStudyCoverSrc } from '@/components/case-studies/case-study-cover';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getIndustry, industries } from '@shared/content/industries';
import { getCaseStudy } from '@shared/content/case-studies';
import { absoluteUrl, buildMetadata, faqSchema, serviceSchema } from '@/lib/seo';
import { industryImageSrc } from '@/lib/industry-images';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return buildMetadata({
    title: industry.seo.title,
    description: industry.seo.description,
    path: `/industries/${industry.slug}`,
    keywords: industry.seo.keywords,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const relatedStudies = industry.relatedCaseStudies
    .map((s) => getCaseStudy(s))
    .filter((cs): cs is NonNullable<typeof cs> => Boolean(cs));
  const otherIndustries = industries.filter((i) => i.slug !== industry.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `${industry.name} Marketing`,
            description: industry.seo.description,
            path: `/industries/${industry.slug}`,
          }),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${industry.name} marketing packages`,
            itemListElement: industry.packages.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Offer',
                name: p.name,
                description: p.description,
                price: p.price.replace(/[^0-9.]/g, ''),
                priceCurrency: 'USD',
                url: absoluteUrl(`/industries/${industry.slug}`),
              },
            })),
          },
          faqSchema(industry.faqs),
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section id="top" className="relative overflow-hidden bg-background pb-14 pt-8 md:pb-20 md:pt-12">
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
          <Breadcrumbs items={[{ label: 'Industries' }, { label: industry.name }]} />

          <div className="mt-6 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
            <LoadGroup className="lg:col-span-7">
              <LoadItem className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Icon name={industry.icon} className="h-4 w-4 text-primary" />
                </span>
                {industry.eyebrow}
              </LoadItem>

              <LoadItem
                as="h1"
                y={16}
                duration={0.7}
                className="mb-5 text-balance text-[2rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]"
              >
                {industry.heroTitle}{' '}
                <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                  {industry.heroHighlight}
                </span>
              </LoadItem>

              <LoadItem
                as="p"
                y={14}
                className="mb-7 max-w-xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
              >
                {industry.heroDescription}
              </LoadItem>

              <LoadItem as="ul" className="mb-8 space-y-3.5">
                {industry.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{b}</span>
                  </li>
                ))}
              </LoadItem>

              <LoadItem className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#audit-form"
                  className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
                >
                  Get a free growth audit <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#results"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
                >
                  See the results
                </a>
              </LoadItem>
            </LoadGroup>

            <LoadFade
              y={18}
              delay={0.3}
              className="w-full lg:col-span-5 lg:sticky lg:top-28"
            >
              <div
                id="audit-form"
                className="scroll-mt-24 rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] md:p-7"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-success">
                  <ShieldCheck className="h-3.5 w-3.5" /> No obligation
                </span>

                <h2 className="mb-1.5 mt-4 text-xl font-bold tracking-tight text-white">
                  Book a free growth audit
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-[#9fb0cc]">{industry.formIntro}</p>

                <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
                  <LeadForm source="industry" />
                </Suspense>
              </div>
            </LoadFade>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Pillars                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup
            stagger={0.08}
            amount={0.15}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {industry.pillars.map((p) => (
              <RevealItem key={p.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={p.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <h2 className="mb-2 text-base font-bold tracking-tight text-white">{p.title}</h2>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{p.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Challenges                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Sound familiar?"
            title={industry.challengesHeading}
            description={industry.challengesIntro}
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.08}
            amount={0.12}
            className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
          >
            {industry.challenges.map((c, i) => (
              <RevealItem key={c.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{c.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Process                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How we work"
            title={industry.processHeading}
            description={industry.processIntro}
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            as="ol"
            stagger={0.1}
            amount={0.15}
            className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block"
            />

            {industry.process.map((step, i) => (
              <RevealItem key={step.title} as="li" className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                      <Icon name={step.icon} className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{step.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Results                                                           */}
      {/* ---------------------------------------------------------------- */}
      {relatedStudies.length > 0 ? (
        <section id="results" className="scroll-mt-24 bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Proof"
              title={`${industry.name} results we can point at`}
              description="Named accounts with the channel, timeframe and measurement scope published alongside every figure."
              className="mb-10 md:mb-14"
            />

            <RevealGroup stagger={0.08} className="grid gap-5 md:grid-cols-3">
              {relatedStudies.map((cs) => (
                <RevealItem key={cs.slug} className="h-full">
                  <Link
                    href={`/case-study/${cs.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38] transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={caseStudyCoverSrc(cs.slug)}
                        alt={`${cs.client} case study`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d7f9e]">
                        {cs.channels[0]}
                      </span>
                      <h3 className="mt-2 text-base font-bold tracking-tight text-white">
                        {cs.client}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9fb0cc] line-clamp-2">
                        {cs.excerpt}
                      </p>

                      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                        {cs.metrics.slice(0, 2).map((m) => (
                          <div key={m.label} className="min-w-0">
                            <dd className="text-lg font-extrabold leading-tight tracking-tight text-white">
                              {m.value}
                            </dd>
                            <dt className="mt-0.5 text-[11px] leading-snug text-[#8e9fbc]">
                              {m.label}
                            </dt>
                          </div>
                        ))}
                      </dl>

                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                        Read the case study
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Testimonials                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="In their words"
            title={industry.testimonialsHeading}
            description={industry.testimonialsSubheading}
            className="mb-10 md:mb-14"
          />

          <RevealGroup stagger={0.1} amount={0.12} className="grid gap-5 md:grid-cols-3">
            {industry.testimonials.map((t) => (
              <RevealItem key={t.name + t.role} as="figure" className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Quote className="h-7 w-7 shrink-0 text-primary/40" aria-hidden="true" />
                    <div
                      className="flex gap-0.5"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[#dbe4f2]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-5 border-t border-white/[0.07] pt-5">
                    <p className="text-[13px] font-bold text-white">{t.name}</p>
                    <p className="mt-0.5 text-[12px] text-[#8e9fbc]">{t.role}</p>
                  </figcaption>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Portfolio                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Our work"
            title="Designs and campaigns built for this market"
            description={`Websites, ad creative and performance campaigns crafted for ${industry.name.toLowerCase()}.`}
            className="mb-10 md:mb-14"
          />

          <RevealGroup stagger={0.08} className="grid gap-5 md:grid-cols-3">
            {industry.portfolio.map((p, i) => (
              <RevealItem as="figure" key={p.title} className="h-full">
                <div className="group h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={industryImageSrc(industry.slug, i, p.image)}
                      alt={`${p.title} — ${p.category} work by Xpert PPC for ${industry.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#070d1c] via-[#070d1c]/30 to-transparent"
                    />
                  </div>

                  <figcaption className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                      {p.category}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold tracking-tight text-white">
                      {p.title}
                    </h3>
                  </figcaption>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Packages                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Packages"
            title="Management that scales with your spend"
            description={industry.packagesIntro}
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.1}
            className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-3"
          >
            {industry.packages.map((p) => (
              <RevealItem key={p.name} className="h-full">
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300 md:p-7',
                    p.popular
                      ? 'border-primary/40 bg-[#0b1733]'
                      : 'border-white/[0.08] bg-[#0e1a38] hover:border-primary/30'
                  )}
                >
                  {p.popular ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                      Most popular
                    </span>
                  ) : null}

                  <h3 className="text-lg font-bold tracking-tight text-white">{p.name}</h3>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                      {p.price}
                    </span>
                    <span className="text-sm text-[#8e9fbc]">{p.period}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#9fb0cc]">{p.description}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3.5} />
                        </span>
                        <span className="text-[13px] leading-relaxed text-[#c6d2e6]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#audit-form"
                    className={cn(
                      'mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-bold transition-colors',
                      p.popular
                        ? 'btn-hover-effect bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-white/[0.14] text-white hover:border-primary/50 hover:bg-white/[0.06] hover:text-primary'
                    )}
                  >
                    Get started <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal y={10} amount={0.2}>
            <p className="mt-6 text-center text-xs text-[#6d7f9e]">
              Management fee only — your ad spend is paid directly to the platforms.
            </p>
          </Reveal>
        </div>
      </section>

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
                title={`${industry.name} marketing questions`}
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
                  {industry.faqs.map((f, i) => (
                    <RevealItem key={f.question} y={10} duration={0.45}>
                      <AccordionItem
                        value={`faq-${i}`}
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
      {/* Other industries                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Other sectors"
            title="We run the same playbook elsewhere"
            description="Search intent, lead value and sales cycles differ by market. Each of these gets its own approach."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {otherIndustries.map((item) => (
              <RevealItem key={item.slug} className="h-full">
                <Link
                  href={`/industries/${item.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={item.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-base font-bold text-white">
                      {item.name}
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                      {item.navDescription}
                    </span>
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
      <section className="bg-background pb-20 pt-16 md:pb-28 md:pt-24">
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
                Ready to grow your {industry.name.toLowerCase()} business?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                We&apos;ll review your account, check tracking and send prioritized next actions —
                before anyone talks about a retainer.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#audit-form"
                  className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  Get a free audit <ArrowRight className="ml-2 h-4 w-4" />
                </a>
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
