import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { siteConfig } from '@/lib/site';
import { COM_ORIGIN, NET_ORIGIN, isNetHost } from '@/lib/site-href';

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

function canonicalOrigin(hostHeader: string): { origin: string; host: string } {
  const host = (hostHeader || '').toLowerCase().split(':')[0];
  if (isNetHost(host)) {
    return { origin: NET_ORIGIN, host: 'xpertppc.net' };
  }
  // .com, www, localhost, preview — agency canonical
  return {
    origin: siteConfig.url || COM_ORIGIN,
    host: 'xpertppc.com',
  };
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerHost = (await headers()).get('host') || '';
  const { origin, host } = canonicalOrigin(headerHost);

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/lp/', '/ads/', '/industries/', '/services/', '/case-study/'],
        disallow: PRIVATE_DISALLOW,
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host,
  };
}
