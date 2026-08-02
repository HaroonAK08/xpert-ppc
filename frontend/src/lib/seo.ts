import type { Metadata } from 'next';
import { siteConfig } from './site';

type SeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

/** Builds a complete, canonical-correct Metadata object for a page. */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image = siteConfig.ogImage,
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const imageUrl = new URL(image, siteConfig.url).toString();

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

/* ---------------------------------------------------------------------- */
/* Structured data builders                                               */
/* ---------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl('/logo.png'),
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phonePrimary,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phonePrimary,
        contactType: 'sales',
        email: siteConfig.contact.email,
        availableLanguage: ['English', 'Urdu'],
        areaServed: 'Worldwide',
      },
    ],
    sameAs: [
      siteConfig.socials.linkedin,
      siteConfig.socials.linkedinCompany,
      siteConfig.socials.facebook,
      siteConfig.socials.youtube,
      siteConfig.socials.upwork,
      siteConfig.socials.upworkAgency,
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en',
  };
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    image: absoluteUrl('/logo.png'),
    url: siteConfig.url,
    telephone: siteConfig.contact.phonePrimary,
    email: siteConfig.contact.email,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressCountry: 'AE' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    serviceType: [
      'Google Ads Management',
      'Meta Ads Management',
      'TikTok Ads Management',
      'Amazon Ads Management',
      'LinkedIn Ads Management',
      'Microsoft Ads Management',
      'Search Engine Optimization',
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
  };
}

export function courseSchema(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: {
      '@type': 'Organization',
      name: 'Xpert PPC Digital Academy',
      sameAs: siteConfig.url,
    },
  };
}

export function personSchema(opts: {
  name: string;
  role: string;
  description: string;
  path: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    jobTitle: opts.role,
    description: opts.description,
    url: absoluteUrl(opts.path),
    ...(opts.image ? { image: opts.image } : {}),
    worksFor: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    sameAs: opts.sameAs ?? [siteConfig.socials.linkedin, siteConfig.socials.upwork],
  };
}
