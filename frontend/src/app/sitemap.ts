import type { MetadataRoute } from 'next';
import { services } from '@shared/content/services';
import { courses } from '@shared/content/courses';
import { industries } from '@shared/content/industries';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/services'), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/case-study'), changeFrequency: 'monthly', priority: 0.8 },
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

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: url(`/xpert-ppc-digital-academy/${c.slug}`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...courseRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
