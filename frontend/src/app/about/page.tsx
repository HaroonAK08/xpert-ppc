import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, Check, MessageCircle } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { services } from '@shared/content/services';
import { caseStudies } from '@shared/content/case-studies';
import { industries } from '@shared/content/industries';
import { umerKhan, waseemNazir } from '@shared/content/team';
import { buildMetadata, organizationSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'About Us - Professional PPC Advertising Agency',
  description:
    'Learn about Xpert PPC, our mission, expertise, and how we help businesses maximize ROI through expert PPC advertising management.',
  path: '/about',
  keywords: ['about Xpert PPC', 'PPC agency', 'performance marketing agency', 'media buying team'],
});

const yearsRunning = new Date().getFullYear() - Number(siteConfig.founded);

/** Figures that can be checked against this site's own content. */
const stats = [
  {
    value: `${yearsRunning}+`,
    label: 'Years running paid media',
    note: `Trading since ${siteConfig.founded}`,
  },
  {
    value: `${services.length}`,
    label: 'Ad platforms in-house',
    note: 'No channel outsourced',
    href: '/services',
  },
  {
    value: 'Named',
    label: 'Accounts, not averages',
    note: 'Every case study names its client and scope',
    href: '/case-study',
  },
  {
    value: '600%',
    label: 'Peak documented ROAS',
    note: 'eCommerce brand, 12 months',
    href: '/case-study/google-ads-roas-600',
  },
];

/** How we work — the commitments behind the case studies. */
const principles = [
  {
    title: 'Tracking before spend',
    body: 'No budget recommendation until conversion tracking is verified against your CRM or store. A number nobody trusts is worse than no number.',
  },
  {
    title: 'Scope stated, always',
    body: 'Every figure we publish carries its channel, timeframe and measurement limits. You can judge the result in context instead of taking it on faith.',
  },
  {
    title: 'A specialist on the account',
    body: 'You work with the person running your channel, not an account manager relaying questions to someone you never meet.',
  },
  {
    title: 'Your account, your data',
    body: 'We work inside your account on your billing. You keep full admin access during the engagement and after it ends.',
  },
];

const team = [umerKhan, waseemNazir];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />

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
          <Breadcrumbs items={[{ label: 'About Us' }]} />

          <LoadGroup className="mt-6 max-w-3xl">
            <LoadItem className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
              <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-primary/15 px-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                Since {siteConfig.founded}
              </span>
              A performance marketing team, not a reseller
            </LoadItem>

            <LoadItem
              as="h1"
              y={16}
              duration={0.7}
              className="mb-6 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              We are judged on{' '}
              <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                cost per result
              </span>
            </LoadItem>

            <LoadItem
              as="p"
              y={14}
              className="mb-8 max-w-2xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
            >
              Xpert PPC has been buying paid media since {siteConfig.founded}, across six platforms
              and more than a dozen published accounts. We run campaigns against the numbers that
              decide whether a business grows — qualified leads, sales and what each one costs.
            </LoadItem>

            <LoadItem className="flex flex-col gap-3 sm:flex-row">
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
          </LoadGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                      See for yourself
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
                      className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
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
      {/* How we work                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How we work"
            title="Four commitments we hold to"
            description="These are the things that make the case studies on this site checkable rather than decorative."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.08}
            amount={0.12}
            className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
          >
            {principles.map((p, i) => (
              <RevealItem key={p.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mb-2 text-base font-bold tracking-tight text-white">{p.title}</h2>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Team                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Who runs the work"
            title="The people on your account"
            description="Small, senior and hands-on. You deal with the specialist managing your channel."
            className="mb-10 md:mb-14"
          />

          <RevealGroup stagger={0.1} className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {team.map((member) => (
              <RevealItem key={member.slug} className="h-full">
                <Link
                  href={`/team/${member.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047] md:p-7"
                >
                  <div className="flex items-center gap-4">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-primary/25 bg-[#0b1733]">
                      <Image
                        src={member.photo}
                        alt={`${member.name}, ${member.role} at Xpert PPC`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-bold tracking-tight text-white">
                        {member.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-[#8e9fbc]">
                        {member.role}
                      </span>
                    </span>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {member.expertise.slice(0, 4).map((e) => (
                      <li
                        key={e}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[12px] font-semibold text-[#c6d2e6]"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-white/[0.07] pt-5">
                    {member.achievements.slice(0, 3).map((a) => (
                      <li key={a} className="flex items-start gap-2.5">
                        <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-[13px] leading-relaxed text-[#9fb0cc]">{a}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read the full profile
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Reach                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <Reveal y={16} amount={0.2}>
              <SectionHead
                align="left"
                eyebrow="Where we work"
                title="Six platforms, six sectors"
                description="We run every channel in-house on the same measurement stack, and each sector on its own playbook — because search intent and lead value are not the same across markets."
              />

              <div className="mt-7">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d7f9e]">
                  Platforms
                </p>
                <ul className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[12px] font-semibold text-[#c6d2e6] transition-colors hover:border-primary/40 hover:text-white"
                      >
                        <Icon name={s.icon} className="h-3.5 w-3.5 text-primary" />
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-7 border-t border-white/[0.07] pt-6 text-[13px] leading-relaxed text-[#8e9fbc]">
                {siteConfig.contact.location} · Calgary office · {caseStudies.length}+ published
                accounts across eCommerce, legal, local services, healthcare and hospitality.
              </p>
            </Reveal>

            <RevealGroup
              stagger={0.07}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {industries.map((item) => (
                <RevealItem key={item.slug} className="h-full">
                  <Link
                    href={`/industries/${item.slug}`}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                      <Icon name={item.icon} className="h-5 w-5 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[15px] font-bold text-white">
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
                Start with the audit, not the pitch
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                Send us the account you already run. We&apos;ll review structure, tracking and
                wasted spend, then come back with prioritized actions.
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
