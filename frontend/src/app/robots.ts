import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { siteConfig } from '@/lib/site';
import { NET_ORIGIN, isNetHost } from '@/lib/site-href';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') || '';

  if (isNetHost(host)) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/admin/', '/api/', '/courses/dashboard', '/courses/learn'],
        },
      ],
      sitemap: new URL('/sitemap.xml', NET_ORIGIN).toString(),
      host: NET_ORIGIN,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/ads', '/ads/', '/lp', '/lp/', '/courses', '/courses/', '/xpert-ppc-digital-academy'],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
