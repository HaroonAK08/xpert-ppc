/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app has its own lockfile, independent from the sibling frontend/backend
  // workspaces — silences Next's "which project is this really part of" guess.
  outputFileTracingRoot: import.meta.dirname,
  // Soft navigations reuse the last RSC payload for a bit so sidebar clicks
  // don't wait on a round-trip every time (pages are client-fetched anyway).
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
