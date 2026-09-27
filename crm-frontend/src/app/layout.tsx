import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

import { AppShell } from '@/components/shell/app-shell';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Xpert PPC CRM',
    template: '%s | Xpert PPC CRM',
  },
  description: 'Lead and client management for Xpert PPC.',
  robots: { index: false, follow: false, nocache: true },
  icons: {
    icon: [
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
};

// Every page here is authenticated and personalized (dashboard stats, a specific
// user's leads) — there is no static content to prerender, and prerendering it
// anyway crashes at build time because the auth check only resolves in the browser.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
