import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Quote } from 'lucide-react';

import type { CaseStudyContent } from '@shared/content/case-studies';
import { Icon } from '@/components/icon';
import { services } from '@shared/content/services';
import { industries } from '@shared/content/industries';
import { siteConfig } from '@/lib/site';
import { SectionHead } from '@/components/home/section-head';
import { CaseStudyCover } from '@/components/case-studies/case-study-cover';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';

/* ------------------------------------------------------------------ */
/* Before / after ledger                                               */
/* ------------------------------------------------------------------ */

/** Each row is traceable to a published study, so the link is shown. */
const ledger = [
  {
    metric: 'eCommerce ROAS · 12 months',
    before: '150%',
    after: '600%',
    slug: 'google-ads-roas-600',
  },
  {
    metric: 'Law firm cost per acquisition',
    before: '$162',
    after: '$126',
    slug: 'online-blackmail-law-firm',
  },
  {
    metric: 'Organic clicks · per day',
    before: '~3',
    after: '2,500+',
    slug: 'galadari-law-seo',
  },
];

function ResultLedger() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0e1a38]">
      <p className="border-b border-white/[0.07] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8e9fbc]">
        Verified from client accounts · scope varies
      </p>

      <ul className="divide-y divide-white/[0.07]">
        {ledger.map((row) => (
          <li key={row.metric}>
            <Link
              href={`/case-study/${row.slug}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035]"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{row.metric}</span>
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#8e9fbc]">
                  <span>from</span>
                  <span className="font-semibold line-through">{row.before}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>

              <span className="shrink-0 bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                {row.after}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function CaseCard({ study, priority }: { study: CaseStudyContent; priority?: boolean }) {
  return (
    <article className="group h-full">
      <Link
        href={`/case-study/${study.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38] transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="aspect-[16/10]">
          <CaseStudyCover study={study} priority={priority} />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d7f9e]">
            {study.industry}
          </p>

          <h3 className="mt-2 text-lg font-bold tracking-tight text-white">{study.client}</h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9fb0cc] line-clamp-2">
            {study.excerpt}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
            {study.metrics.slice(0, 2).map((metric) => (
              <div key={metric.label} className="min-w-0">
                <dd className="text-xl font-extrabold leading-tight tracking-tight text-white">
                  {metric.value}
                </dd>
                <dt className="mt-0.5 text-[11px] leading-snug text-[#8e9fbc]">{metric.label}</dt>
              </div>
            ))}
          </dl>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            Read the case study
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CaseStudiesIndex({ caseStudies }: { caseStudies: CaseStudyContent[] }) {
  const featured =
    caseStudies.find((study) => study.slug === 'google-ads-roas-600') ??
    caseStudies.find((study) => study.featured) ??
    caseStudies[0];
  const rest = caseStudies.filter((study) => study.slug !== featured?.slug);
  const proofStudy = caseStudies.find((study) => study.proof?.length);

  const sectors = Array.from(
    new Set(caseStudies.map((s) => s.industry.split('—')[0].trim()))
  );

  /** Channel frequency across the published library, most-used first. */
  const channelCounts = caseStudies
    .flatMap((study) => study.channels)
    .reduce<Record<string, number>>((acc, channel) => {
      acc[channel] = (acc[channel] ?? 0) + 1;
      return acc;
    }, {});
  const topChannels = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  /** Sector counts, so the "who we do this for" band is factual. */
  const sectorCounts = caseStudies.reduce<Record<string, number>>((acc, study) => {
    const sector = study.industry.split('—')[0].trim();
    acc[sector] = (acc[sector] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-14 pt-10 md:pb-20 md:pt-14">
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
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
            <div>
              <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
                <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-primary/15 px-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                  Results library
                </span>
                Named accounts, published in full
              </p>

              <h1 className="text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Real accounts.{' '}
                <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                  Check them yourself.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#9fb0cc] md:text-lg">
                eCommerce brands, law firms and local businesses turning paid traffic into
                measurable growth — with the account context and reporting scope beside every
                number.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-hover-effect inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
                >
                  Get my free audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#all"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.14] px-7 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
                >
                  Browse the library
                </a>
              </div>
            </div>

            <ResultLedger />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How to read the proof                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How to read the proof"
            title="Every number here has its scope attached"
            description="Agencies quote their best month. These are named accounts with the channel, timeframe and measurement limits published alongside the result — so you can judge it in context."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.09}
            amount={0.15}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {[
              {
                n: '01',
                title: 'Client context',
                body: 'Who the business serves, what it sells and what it needed when we started.',
              },
              {
                n: '02',
                title: 'Work delivered',
                body: 'The channels, the strategy and the specific changes made to the account.',
              },
              {
                n: '03',
                title: 'Reporting scope',
                body: 'The timeframe, the data source and the measurement limits behind the figure.',
              },
            ].map((item) => (
              <RevealItem key={item.n} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {item.n}
                  </span>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What the library covers                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <Reveal y={16} amount={0.2}>
              <SectionHead
                align="left"
                eyebrow="What's in here"
                title="Different markets, different playbooks"
                description="These accounts have little in common beyond the measurement discipline. An emergency locksmith and a premium spirits brand need opposite things from paid media — the library reflects that rather than hiding it."
              />

              <div className="mt-8">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                  Channels across the library
                </p>
                <ul className="flex flex-wrap gap-2">
                  {topChannels.map(([channel, count]) => (
                    <li
                      key={channel}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[12px] font-semibold text-[#c6d2e6]"
                    >
                      {channel}
                      <span className="text-[11px] text-[#6d7f9e]">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-7 border-t border-white/[0.07] pt-6 text-[13px] leading-relaxed text-[#8e9fbc]">
                Engagements run from a four-week restructure to a twelve-year partnership. Each
                case study states which, because a 30-day result and a decade-long one are not the
                same claim.
              </p>
            </Reveal>

            <RevealGroup stagger={0.07} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {industries.map((industry) => {
                const sector = industry.name;
                const count =
                  sectorCounts[sector] ??
                  sectorCounts[sector.replace(' Clinics', '')] ??
                  0;
                return (
                  <RevealItem key={industry.slug} className="h-full">
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                        <Icon name={industry.icon} className="h-5 w-5 text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-[15px] font-bold text-white">
                          {industry.name}
                          <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                          {industry.navDescription}
                        </span>
                        {count > 0 ? (
                          <span className="mt-2.5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                            {count} published {count === 1 ? 'account' : 'accounts'}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured                                                          */}
      {/* ---------------------------------------------------------------- */}
      {featured ? (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Start here"
              title="The full account story"
              description="One partnership, twelve months, and the rebuild that took return on ad spend from 150% to 600%."
              className="mb-10 md:mb-14"
            />

            <Reveal y={20} amount={0.1}>
              <Link
                href={`/case-study/${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1a38] transition-colors duration-300 hover:border-primary/45 lg:grid-cols-[.9fr_1.1fr]"
              >
                <div className="min-h-[260px] lg:min-h-full">
                  <CaseStudyCover
                    study={featured}
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                    Featured account
                  </p>

                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {featured.client}
                  </h3>

                  <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#9fb0cc]">
                    {featured.excerpt}
                  </p>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
                    {featured.metrics.slice(0, 4).map((metric) => (
                      <div key={metric.label} className="bg-[#0e1a38] p-4">
                        <dd className="text-lg font-extrabold leading-tight tracking-tight text-white">
                          {metric.value}
                        </dd>
                        <dt className="mt-1 text-[11px] leading-snug text-[#8e9fbc]">
                          {metric.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read the full case study
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Evidence wall — real redacted reporting                           */}
      {/* ---------------------------------------------------------------- */}
      {proofStudy?.proof?.length ? (
        <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Evidence wall"
              title="The reporting behind the numbers"
              description={`Redacted screenshots from the ${proofStudy.client} account, with the scope note kept beside the evidence.`}
              className="mb-10 md:mb-14"
            />

            <RevealGroup stagger={0.1} amount={0.1} className="grid gap-5 md:grid-cols-2">
              {proofStudy.proof.map((proof) => (
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
      {/* Full library                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="all" className="scroll-mt-24 bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Results library"
            title="Every published case study"
            description="Across eCommerce, legal, local services, healthcare and hospitality — each with the client context, the work and the reporting scope."
            className="mb-8 md:mb-10"
          />

          <Reveal y={10} amount={0.2} className="mb-10 md:mb-12">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {sectors.map((industry) => (
                <li
                  key={industry}
                  className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-1.5 text-[12px] font-semibold text-[#9fb0cc]"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </Reveal>

          <RevealGroup
            stagger={0.06}
            amount={0.05}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {rest.map((study) => (
              <RevealItem key={study.slug} className="h-full">
                <CaseCard study={study} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What a case study contains                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Inside each write-up"
            title="What you get when you open one"
            description="Not a headline and a logo. Each case study is structured the same way so you can compare them against each other — and against whatever your current agency reports."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            amount={0.12}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: 'The account as we found it',
                body: 'What the business sells, who it sells to, and what was actually wrong when we started — not a generic problem statement.',
              },
              {
                title: 'The work, specifically',
                body: 'Which campaigns were rebuilt, which bidding strategy changed, what tracking was fixed. Enough detail to judge whether it was competent.',
              },
              {
                title: 'Numbers with their period',
                body: 'Every figure carries the timeframe it covers. A 30-day window and a twelve-month programme are labelled as such.',
              },
              {
                title: 'The measurement note',
                body: 'Where platform-reported conversions differ from confirmed orders, we say so rather than letting the bigger number stand.',
              },
              {
                title: 'What we would do differently',
                body: 'Takeaways written after the fact, including the parts that took longer than expected or needed a second attempt.',
              },
              {
                title: 'Questions this raises',
                body: 'The things prospects in that situation actually ask, answered on the page instead of saved for a sales call.',
              },
            ].map((item, i) => (
              <RevealItem key={item.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Honest limits                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionHead
                align="left"
                eyebrow="Read this first"
                title="What these numbers do not prove"
                description="Case studies are the most over-claimed thing on an agency website. Here is what ours can and cannot tell you."
              />
            </div>

            <div className="lg:col-span-7">
              <RevealGroup stagger={0.08} amount={0.12} className="space-y-4">
                {[
                  {
                    q: 'Your account will not behave like these',
                    a: 'Margin, average order value, competition and market size differ. A 600% return on ad spend in one category is unprofitable in another. Treat these as evidence of method, not a forecast.',
                  },
                  {
                    q: 'Platform conversions are not confirmed sales',
                    a: 'Google and Meta count what they can attribute. A tracked conversion may be a form fill that never became an order. Where the gap matters, the case study says so.',
                  },
                  {
                    q: 'Paid media was rarely the only variable',
                    a: 'Several of these accounts ran SEO, content or site changes at the same time. Attributing all growth to ads would overstate what we did, so we do not.',
                  },
                  {
                    q: 'We publish what the client allows',
                    a: 'Some accounts appear under a description rather than a name, and some figures are withheld at the client\u2019s request. Nothing here is inflated to fill the gap.',
                  },
                ].map((item) => (
                  <RevealItem key={item.q}>
                    <div className="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 md:p-6">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-bold text-primary">
                        !
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold tracking-tight text-white">
                          {item.q}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9fb0cc]">{item.a}</p>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Channels behind the work                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The channels"
            title="How we run each platform"
            description="Every result above came from one of these. Each service page covers the method, the first ninety days and the questions specific to that channel."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <RevealItem key={service.slug} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={service.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[15px] font-bold text-white">
                      {service.name}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                      {service.homeDescription}
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
      <section id="audit" className="bg-background pb-20 pt-4 md:pb-28">
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
                Want a result worth publishing?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                We review your account for free and show where budget is being wasted — with the
                same scope notes you see on every case study above.
              </p>

              <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
                {['No obligation', 'Written findings you keep', 'Reply within one working day'].map(
                  (b) => (
                    <li
                      key={b}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#9fb0cc]"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
                      {b}
                    </li>
                  )
                )}
              </ul>

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
