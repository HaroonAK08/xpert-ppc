import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade } from '@/components/motion';
import { FaqSearch } from './faq-search';
import { faqs } from '@shared/content/faqs';
import { buildMetadata, faqSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'PPC FAQ | Xpert PPC - Frequently Asked Questions',
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

      <section className="relative overflow-hidden bg-background pb-16 pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <div className="container relative z-10 mx-auto px-4 text-left sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'FAQ' }]} />
          <LoadFade y={20} duration={0.5} className="max-w-3xl text-left">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Everything you need to know about our data-driven approach to performance marketing.
            </p>
          </LoadFade>
        </div>
      </section>

      <FaqSearch faqs={faqs} />

      <section className="relative overflow-hidden border-t border-primary/10 bg-card py-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Still have questions?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Our team of specialists is ready to
            help you formulate a winning strategy.
          </p>
          <Link
            href="/contact"
            className="btn-hover-effect inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          >
            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
