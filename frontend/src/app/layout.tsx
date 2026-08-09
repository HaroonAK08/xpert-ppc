import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

import { GoogleTags } from '@/components/analytics/google-tags';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { JsonLd } from '@/components/seo/json-ld';
import { MotionProvider } from '@/components/motion';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Xpert PPC | Google, Meta & TikTok Ads Agency',
    template: '%s | Xpert PPC',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: 'Next.js',
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    'PPC agency',
    'Google Ads management',
    'Meta Ads agency',
    'TikTok Ads agency',
    'Amazon Ads management',
    'LinkedIn Ads',
    'Microsoft Ads',
    'performance marketing',
    'ROAS',
    'free PPC audit',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Xpert PPC | Google, Meta & TikTok Ads Agency',
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xpert PPC | Google, Meta & TikTok Ads Agency',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon-192.png',
  },
  formatDetection: { telephone: true, email: true, address: false },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#0a1329',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        {/*
          Entrance animations start at opacity:0 and are revealed by JS. If JS
          never runs, that would leave the page blank — so force everything
          visible when scripting is unavailable.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <GoogleTags />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <MotionProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <main id="main" className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
          </div>

          <WhatsAppFab />
        </MotionProvider>
      </body>
    </html>
  );
}
