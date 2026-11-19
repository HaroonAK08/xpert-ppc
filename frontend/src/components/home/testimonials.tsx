import { Quote } from 'lucide-react';

import { Icon } from '@/components/icon';
import { RevealGroup, RevealItem } from '@/components/motion';
import { services } from '@shared/content/services';
import { SectionHead } from './section-head';

/**
 * Quotes come straight from the per-service case studies in shared content,
 * attributed exactly as they are stored (client type + channel) rather than
 * dressed up with names we don't have.
 */
const quotes = ['google-ads', 'meta-ads', 'amazon-ads']
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s): s is NonNullable<typeof s> => Boolean(s))
  .map((s) => ({
    slug: s.slug,
    quote: s.caseStudy.testimonial,
    client: s.caseStudy.client,
    channel: s.name,
    icon: s.icon,
    headline: s.caseStudy.metrics[0],
  }));

export function Testimonials() {
  return (
    <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="In their words"
          title="What changes once the account is clean"
          description="Three accounts, three channels, one pattern: fewer wasted impressions and a cost per result the finance team can live with."
          className="mb-10 md:mb-14"
        />

        <RevealGroup
          stagger={0.1}
          amount={0.12}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {quotes.map((t) => (
            <RevealItem key={t.slug} as="figure" className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6">
                <Quote className="h-7 w-7 shrink-0 text-primary/40" aria-hidden="true" />

                <blockquote className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-[#dbe4f2]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {t.headline ? (
                  <p className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-xs text-[#9fb0cc]">
                    <span className="font-bold text-white">{t.headline.value}</span>{' '}
                    {t.headline.label.toLowerCase()}
                  </p>
                ) : null}

                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                    <Icon name={t.icon} className="h-4 w-4 text-primary" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold text-white">
                      {t.client}
                    </span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#6d7f9e]">
                      {t.channel}
                    </span>
                  </span>
                </figcaption>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
