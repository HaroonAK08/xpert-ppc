const PRODUCTION_ORIGIN = 'https://xpertppc.com';
const PRODUCTION_BUILD = 'phase-production-build';

function isDeviceLocalUrl(value) {
  if (!value) return true;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost');
  } catch {
    return true;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Self-hosted on Hostinger as a plain Node process, not Vercel — standalone
  // bundles a minimal node_modules + server.js so no `next start` CLI is needed.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'horizons-cdn.hostinger.com' },
      { protocol: 'https', hostname: 'xpertppc.com' },
    ],
  },
  async headers() {
    return [
      {
        // Every path except the embeddable widgets below, which must be frameable
        // on other domains — X-Frame-Options: SAMEORIGIN would otherwise blank them out.
        source: '/:path((?!embed\\/|embed$).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/embed/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Static image/font assets served straight from /public — Next.js
        // gives these no cache headers by default (unlike hashed /_next/static
        // files), so repeat visits were re-downloading every image from
        // scratch. Content here doesn't change without a filename change in
        // practice, so cache for a week client-side, longer at the edge.
        source: '/:path*(png|jpg|jpeg|webp|avif|svg|gif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy / alternate paths -> canonical
      { source: '/industries', destination: '/industries/dermatologists', permanent: false },
      { source: '/lp/dermatologists', destination: '/ads/dermatologists', permanent: true },
      { source: '/lp/dermatologist/', destination: '/lp/dermatologist', permanent: true },
      { source: '/xpert-ppc-digital-academy', destination: '/xpert-ppc-digital-academy/sem', permanent: false },
    ];
  },
};

export default function nextConfigExport(phase) {
  if (phase !== PRODUCTION_BUILD) return nextConfig;

  // frontend/.env.local is for `next dev`. A production build on that machine
  // must not publish localhost URLs: the tracker then calls the visitor's computer.
  const env = { ...nextConfig.env };
  if (isDeviceLocalUrl(process.env.NEXT_PUBLIC_SITE_URL)) {
    env.NEXT_PUBLIC_SITE_URL = PRODUCTION_ORIGIN;
  }
  if (isDeviceLocalUrl(process.env.NEXT_PUBLIC_API_URL)) {
    env.NEXT_PUBLIC_API_URL = PRODUCTION_ORIGIN;
  }
  return { ...nextConfig, env };
};
