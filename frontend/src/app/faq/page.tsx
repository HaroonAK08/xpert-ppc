import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { FaqSearch } from './faq-search';
import { faqs } from '@shared/content/faqs';
import { services } from '@shared/content/services';
import { buildMetadata, faqSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'PPC FAQ - Frequently Asked Questions',
  description:
    'Find answers to common PPC advertising questions. Learn about Google Ads, Meta Ads, TikTok, Amazon, LinkedIn, and campaign optimization.',
  path: '/faq',
  keywords: [
    'PPC FAQ',
    'Google Ads questions',
    'Meta Ads questions',
    'what is PPC',
    'PPC management fees',
  ],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-14 pt-8 md:pb-16 md:pt-12">
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
          <Breadcrumbs items={[{ label: 'FAQ' }]} />

          <LoadGroup className="mt-6 max-w-3xl">
            <LoadItem className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
              <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-primary/15 px-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                {faqs.length} answers
              </span>
              Across every channel we run
            </LoadItem>

            <LoadItem
              as="h1"
              y={16}
              duration={0.7}
              className="mb-6 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              Questions worth asking{' '}
              <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                any agency
              </span>
            </LoadItem>

            <LoadItem
              as="p"
              y={14}
              className="max-w-2xl text-base leading-relaxed text-[#9fb0cc] md:text-lg"
            >
              Straight answers on budgets, timelines, reporting and what each platform is actually
              good at — including the parts most agencies would rather not put in writing.
            </LoadItem>
          </LoadGroup>
        </div>
      </section>

      <FaqSearch faqs={faqs} />

      {/* ---------------------------------------------------------------- */}
      {/* Per-channel questions live on the service pages                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Go deeper"
            title="Channel-specific questions"
            description="Each service page answers the questions that only come up on that platform — ACOS targets on Amazon, pipeline attribution on LinkedIn, creative fatigue on TikTok."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <RevealItem key={s.slug} className="h-full">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon name={s.icon} className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[15px] font-bold text-white">
                      {s.name}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                      {s.homeDescription}
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Still stuck                                                       */}
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
                Still have a question?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                Send it over on WhatsApp and you&apos;ll get a straight answer — no call required,
                no pitch attached.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-8 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] sm:w-auto"
                >
                  Get a free audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
