import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { RevealGroup, RevealItem } from '@/components/motion';
import { SectionHead } from './section-head';

/**
 * Headline numbers. Every figure is lifted from a published case study and
 * carries its own source line + link, so nothing here is an unattributed
 * agency-wide claim.
 */
const stats = [
  {
    value: '600%',
    label: 'Final ROAS',
    source: 'Established eCommerce brand · 12-month program',
    href: '/case-study/google-ads-roas-600',
  },
  {
    value: '$72K',
    label: 'Ad spend saved',
    source: 'Law firm · cost per acquisition down 22%',
    href: '/case-study/online-blackmail-law-firm',
  },
  {
    value: '8×',
    label: 'Google Ads sales lift',
    source: 'Desert Farms · 12+ year partnership',
    href: '/case-study/desert-farms',
  },
  {
    value: '1,059',
    label: 'Leads in 90 days',
    source: 'Home services · under $25 per lead',
    href: '/case-study/locksmith-plumbing-leads',
  },
];

export function ResultsBand() {
  return (
    <section className="relative overflow-hidden bg-[#060c1d] py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="The numbers"
          title="Performance we can point at"
          description="Every figure below comes from a named account with a written case study behind it. Tap any number to read how it happened."
          className="mb-10 md:mb-14"
        />

        <RevealGroup
          stagger={0.09}
          amount={0.15}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <RevealItem key={s.href} className="h-full">
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-white/[0.09] bg-white/[0.035] p-6 transition-colors duration-300 hover:border-primary/45 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#060c1d]"
              >
                <span className="bg-gradient-to-br from-white to-[#7fb4ff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-[2.75rem]">
                  {s.value}
                </span>
                <span className="mt-2 text-sm font-bold text-white">{s.label}</span>
                <span className="mt-3 flex-1 text-xs leading-relaxed text-[#8e9fbc]">
                  {s.source}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  Read the case study
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
