import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Icon } from '@/components/icon';
import { RevealGroup, RevealItem } from '@/components/motion';
import { industries } from '@shared/content/industries';
import { SectionHead } from './section-head';

/**
 * The six industry pages already exist but the homepage never linked to them.
 * This is the "is this agency for me?" answer, one card per vertical.
 */
export function IndustriesGrid() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Who we do this for"
          title="Built around how your market actually buys"
          description="Search intent, cost per lead and sales cycles look nothing alike across these verticals. We run each one on its own playbook."
          className="mb-10 md:mb-14"
        />

        <RevealGroup
          stagger={0.07}
          amount={0.12}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {industries.map((industry) => (
            <RevealItem key={industry.slug} className="h-full">
              <Link
                href={`/industries/${industry.slug}`}
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon name={industry.icon} className="h-5 w-5 text-primary" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-base font-bold text-white">
                    {industry.name}
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-relaxed text-[#9fb0cc]">
                    {industry.navDescription}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
