import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { siteConfig } from '@/lib/site';
import { NET_ORIGIN, isNetHost } from '@/lib/site-href';

/** Private paths only — public marketing pages must stay crawlable for indexing. */
const PRIVATE_DISALLOW = [
  '/admin',
  '/admin/',
  '/api/',
  '/courses/dashboard',
  '/courses/dashboard/',
  '/courses/learn',
  '/courses/learn/',
  '/courses/application',
  '/courses/application/',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') || '';
  const origin = isNetHost(host) ? NET_ORIGIN : siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_DISALLOW,
      },
    ],
    sitemap: new URL('/sitemap.xml', origin).toString(),
    host: origin.replace(/^https?:\/\//, ''),
  };
}
