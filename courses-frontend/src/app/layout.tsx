import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { WhatsAppFab } from '@/components/site/whatsapp-fab';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'XpertPPC Digital Marketing Academy',
    template: '%s | XpertPPC Digital Marketing Academy',
  },
  description: 'Live online classes in Google Ads, SEO, social media marketing, and client acquisition.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#071833',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-ink antialiased">
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
