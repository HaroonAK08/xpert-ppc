import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight, CheckCircle2, Quote, Star } from 'lucide-react';

import { Icon } from '@/components/icon';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
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

      <section id="top" className="relative overflow-hidden bg-background pb-20 pt-12 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[-6rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
            <LoadGroup className="lg:col-span-7">
              <LoadItem
                y={30}
                className="mb-6 inline-flex items-center rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary shadow-[0_0_15px_rgba(0,102,204,0.25)]"
              >
                <Icon name={industry.icon} className="mr-2 h-4 w-4" />
                {industry.eyebrow}
              </LoadItem>

              <LoadItem
                as="h1"
                y={30}
                className="mb-6 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {industry.heroTitle}{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {industry.heroHighlight}
                </span>
              </LoadItem>

              <LoadItem
                as="p"
                y={30}
                className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              >
                {industry.heroDescription}
              </LoadItem>

              <LoadItem as="ul" className="mb-10 space-y-4">
                {industry.bullets.map((b) => (
                  <li key={b} className="flex items-start">
                    <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium text-foreground/90">{b}</span>
                  </li>
                ))}
              </LoadItem>

              <LoadItem className="grid grid-cols-1 gap-4 border-t border-primary/20 pt-6 sm:grid-cols-3">
                {industry.pillars.map((p) => (
                  <div key={p.title} className="rounded-xl border border-primary/20 bg-card p-4">
                    <Icon name={p.icon} className="glow-primary mb-3 h-7 w-7 text-primary" />
                    <h2 className="mb-1 font-bold text-foreground">{p.title}</h2>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </LoadItem>
            </LoadGroup>

            <LoadFade
              scale={0.95}
              delay={0.3}
              className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0 lg:sticky lg:top-28 lg:max-w-none"
            >
              <div
                id="audit-form"
                className="rounded-3xl border border-primary/30 bg-card p-6 shadow-[0_0_40px_rgba(0,102,204,0.12)] md:p-8"
              >
                <h2 className="mb-1 text-xl font-bold text-foreground">Book a Free Growth Audit</h2>
                <p className="mb-6 text-sm text-muted-foreground">{industry.formIntro}</p>
                <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/40" />}>
                  <LeadForm source="industry" />
                </Suspense>
              </div>
            </LoadFade>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-5xl">
              {industry.challengesHeading}
            </h2>
            <p className="text-lg text-muted-foreground">{industry.challengesIntro}</p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {industry.challenges.map((c) => (
              <RevealItem
                key={c.title}
                className="rounded-2xl border border-primary/20 bg-background p-6 sm:p-8"
              >
                <h3 className="mb-3 text-xl font-bold text-foreground">{c.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{c.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-5xl">
              {industry.processHeading}
            </h2>
            <p className="text-lg text-muted-foreground">{industry.processIntro}</p>
          </div>

          <RevealGroup
            as="ol"
            stagger={0.1}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {industry.process.map((step, i) => (
              <RevealItem
                key={step.title}
                as="li"
                className="relative rounded-2xl border border-primary/20 bg-card p-5"
              >
                <span className="text-xs font-bold text-primary">STEP {i + 1}</span>
                <div className="my-4 w-fit rounded-xl bg-primary/10 p-2.5">
                  <Icon name={step.icon} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {relatedStudies.length > 0 ? (
        <section className="border-y border-primary/10 bg-card py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-5xl">
                {industry.name} <span className="text-primary">Results</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Real campaigns we have run for brands in this space.
              </p>
            </div>

            <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedStudies.map((cs) => (
                <RevealItem key={cs.slug} className="h-full">
                  <Link
                    href={`/case-study/${cs.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary/20 bg-background transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,102,204,0.12)]"
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
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {cs.industry}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-foreground group-hover:text-primary">
                        {cs.client}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-primary">{cs.subtitle}</p>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {cs.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                        View case study <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <section className="border-y border-primary/10 bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-extrabold text-foreground md:text-5xl">
              {industry.testimonialsHeading}
            </h2>
            <p className="text-lg text-muted-foreground">{industry.testimonialsSubheading}</p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {industry.testimonials.map((t) => (
              <RevealItem
                key={t.name + t.role}
                as="figure"
                className="relative rounded-2xl border border-primary/20 bg-card p-5 transition-colors duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(0,102,204,0.15)] sm:p-8"
              >
                <Quote className="mb-4 h-10 w-10 text-primary/30" />
                <div className="mb-4 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mb-6 leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-primary">{t.role}</p>
                </figcaption>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-card py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-extrabold text-foreground md:text-5xl">
              Our <span className="text-primary">Designs &amp; Work</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Websites, ad creative, and performance campaigns crafted for{' '}
              {industry.name.toLowerCase()}.
            </p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {industry.portfolio.map((p) => (
              <RevealItem
                as="figure"
                key={p.title}
                className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-background"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={`${p.title} — ${p.category} work by Xpert PPC for ${industry.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                  <figcaption className="absolute bottom-0 left-0 p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {p.category}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-foreground">{p.title}</h3>
                  </figcaption>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-extrabold text-foreground md:text-5xl">
              Our <span className="text-primary">Packages</span>
            </h2>
            <p className="text-lg text-muted-foreground">{industry.packagesIntro}</p>
          </div>

          <RevealGroup
            stagger={0.1}
            className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3"
          >
            {industry.packages.map((p) => (
              <RevealItem
                key={p.name}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-5 transition-all duration-300 sm:p-8',
                  p.popular
                    ? 'z-10 border-primary bg-card shadow-[0_0_40px_rgba(0,102,204,0.2)] ring-1 ring-primary/40'
                    : 'border-primary/20 bg-card hover:border-primary/50'
                )}
              >
                {p.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    Most Popular
                  </span>
                ) : null}

                <h3 className="mb-2 text-2xl font-bold text-foreground">{p.name}</h3>
                <div className="mb-4 flex items-end">
                  <span className="text-4xl font-extrabold text-primary">{p.price}</span>
                  <span className="mb-1 ml-1 text-muted-foreground">{p.period}</span>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{p.description}</p>

                <ul className="mb-8 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start">
                      <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#audit-form"
                  className={cn(
                    'btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-md px-6 text-base font-bold transition-all duration-300',
                    p.popular
                      ? 'hover-glow-primary bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                      : 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-card py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal
              as="h2"
              y={14}
              className="mb-8 text-center text-3xl font-extrabold text-foreground md:text-4xl"
            >
              {industry.name} Marketing FAQ
            </Reveal>

            <Accordion type="single" collapsible className="space-y-3">
              {industry.faqs.map((f, i) => (
                <AccordionItem
                  key={f.question}
                  value={`faq-${i}`}
                  className="rounded-xl border border-primary/20 bg-background px-5"
                >
                  <AccordionTrigger className="px-0 text-left font-semibold text-foreground hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-0 leading-relaxed text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
