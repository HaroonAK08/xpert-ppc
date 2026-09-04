import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { services } from '@shared/content/services';
import { courses } from '@shared/content/courses';
import { industries } from '@shared/content/industries';
import { caseStudies } from '@shared/content/case-studies';
import { siteConfig } from '@/lib/site';
import { NET_ORIGIN, isNetHost } from '@/lib/site-href';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const host = (await headers()).get('host') || '';

  if (isNetHost(host)) {
    const url = (path: string) => new URL(path, NET_ORIGIN).toString();
    return [
      { url: url('/'), changeFrequency: 'weekly', priority: 1, lastModified: now },
      { url: url('/courses'), changeFrequency: 'weekly', priority: 1, lastModified: now },
      { url: url('/courses/signup'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
      { url: url('/courses/login'), changeFrequency: 'monthly', priority: 0.7, lastModified: now },
      ...courses.map((c) => ({
        url: url(`/xpert-ppc-digital-academy/${c.slug}`),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
        lastModified: now,
      })),
    ];
  }

  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/services'), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/case-study'), changeFrequency: 'weekly', priority: 0.85 },
    { url: url('/about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contact'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/faq'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/team/umer-khan'), changeFrequency: 'monthly', priority: 0.6 },
    {
      url: url('/google-ads-expert-upwork-umer-khan'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { url: url('/privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: url('/terms-of-service'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: url(`/industries/${i.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: url(`/case-study/${c.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...caseStudyRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
