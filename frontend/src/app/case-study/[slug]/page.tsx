import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Briefcase, CheckCircle2, Lightbulb, Target } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade } from '@/components/motion';
import { caseStudies, getCaseStudy } from '@shared/content/case-studies';
import { caseStudyNarratives } from '@shared/content/case-study-narratives';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return buildMetadata({
    title: cs.seo.title,
    description: cs.seo.description,
    path: `/case-study/${cs.slug}`,
    keywords: cs.seo.keywords,
    type: 'article',
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const narrative = caseStudyNarratives[cs.slug];
  const coverSrc = `/case-studies/covers/${cs.slug}.jpg`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: cs.title,
          description: cs.seo.description,
          url: absoluteUrl(`/case-study/${cs.slug}`),
          image: absoluteUrl(coverSrc),
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

      <section className="relative flex min-h-[70dvh] items-end overflow-hidden pb-14 pt-28 sm:items-center sm:pb-20 sm:pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={coverSrc}
            alt={`${cs.client} case study`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Case Studies', href: '/case-study' }, { label: cs.client }]}
          />

          <LoadFade y={20} duration={0.5} className="mt-8 max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {cs.channels.map((ch) => (
                <span
                  key={ch}
                  className="rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur"
                >
                  {ch}
                </span>
              ))}
            </div>

            <h1 className="mb-4 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">
              {cs.title}
            </h1>
            <p className="mb-3 text-lg font-medium text-primary sm:text-xl">{cs.subtitle}</p>
            <p className="mb-8 text-sm text-muted-foreground">
              {cs.industry} · {cs.duration}
            </p>
            <a
              href="#story"
              className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Read the story <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </LoadFade>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cs.metrics.map((m) => (
              <div key={m.label} className="text-center sm:text-left">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name={m.icon} className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-foreground sm:text-3xl">{m.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={coverSrc}
                  alt={`${cs.client} overview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Overview</p>
              <h2 className="mb-5 text-3xl font-bold text-foreground md:text-4xl">
                About {cs.client}
              </h2>
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">{cs.intro}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{cs.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

      {narrative ? (
        <section className="border-y border-border/40 bg-card py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">How we got there</h2>
              <p className="mt-3 text-muted-foreground">
                Challenge, strategy, and outcomes from this engagement.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6">
              <article className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Target className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">The Challenge</h3>
                </div>
                {narrative.challenge.map((p) => (
                  <p
                    key={p}
                    className="mb-4 text-base leading-relaxed text-muted-foreground last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </article>

              <article className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Lightbulb className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Strategy & Execution</h3>
                </div>
                <ul className="space-y-4">
                  {narrative.strategy.map((p) => (
                    <li key={p} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Results</h3>
                </div>
                {narrative.results.map((p) => (
                  <p
                    key={p}
                    className="mb-4 text-base leading-relaxed text-muted-foreground last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </article>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-secondary py-16 text-secondary-foreground sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{cs.pillarsHeading}</h2>
              <p className="text-base leading-relaxed text-secondary-foreground/80">
                {cs.pillarsIntro}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              {cs.pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/10 bg-background/5 p-5"
                >
                  <Icon name={p.icon} className="mb-3 h-6 w-6 text-[#f97316]" />
                  <h3 className="mb-1.5 font-bold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-secondary-foreground/70">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              {cs.takeawaysHeading}
            </h2>
            <p className="text-muted-foreground">{cs.takeawaysIntro}</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {cs.takeaways.map((t, i) => (
              <div key={t.title} className="rounded-2xl border border-border/50 bg-card p-6 sm:p-7">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                  Takeaway {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{t.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="mb-5 text-3xl font-bold text-foreground">Our Approach</h2>
              {cs.approach.map((p) => (
                <p key={p} className="mb-4 text-lg leading-relaxed text-muted-foreground last:mb-0">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 sm:p-7">
              <h3 className="mb-5 text-xl font-bold text-foreground">Services Deployed</h3>
              <ul className="space-y-3">
                {cs.servicesDeployed.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Ready for results like these?</h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-foreground/90">
            Book a free audit and we&apos;ll map the same playbook to your accounts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-background px-7 text-sm font-bold text-foreground"
            >
              Get a Free Audit
            </Link>
            <Link
              href="/case-study"
              className="inline-flex h-12 items-center rounded-xl border border-primary-foreground/35 px-7 text-sm font-bold"
            >
              More Case Studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
