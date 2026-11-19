import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { CaseStudiesIndex } from '@/components/case-studies/case-studies-index';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { caseStudies } from '@shared/content/case-studies';

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies | Xpert PPC',
  description:
    'Real PPC and SEO results from Xpert PPC — eCommerce, legal, local services, healthcare, and more.',
  path: '/case-study',
  keywords: [
    'PPC case studies',
    'Google Ads case studies',
    'SEO case studies',
    'Meta Ads results',
    'Xpert PPC',
  ],
});

export default function CaseStudiesIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Xpert PPC Case Studies',
          description: 'Performance marketing case studies across industries.',
          url: absoluteUrl('/case-study'),
          isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: caseStudies.map((study, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: study.client,
              url: absoluteUrl(`/case-study/${study.slug}`),
            })),
          },
        }}
      />
      <CaseStudiesIndex caseStudies={caseStudies} />
    </>
  );
}
