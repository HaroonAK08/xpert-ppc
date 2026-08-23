/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
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
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy / alternate paths -> canonical
      { source: '/industries', destination: '/industries/dermatologists', permanent: false },
      { source: '/lp/dermatologists', destination: '/ads/dermatologists', permanent: true },
      { source: '/lp/:slug*', destination: '/ads/:slug*', permanent: true },
      { source: '/xpert-ppc-digital-academy', destination: '/xpert-ppc-digital-academy/sem', permanent: false },
    ];
  },
};

export default nextConfig;
