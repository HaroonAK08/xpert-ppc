'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { Header } from './header';
import { Footer } from './footer';
import { WhatsAppFab } from './whatsapp-fab';

/**
 * The admin panel is a separate application surface (its own sidebar,
 * its own light theme) — it never wears the public marketing header/footer.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <main id="main" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main id="main" className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
