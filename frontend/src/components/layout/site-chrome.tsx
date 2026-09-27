'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { Header } from './header';
import { Footer } from './footer';
import { WhatsAppFab } from './whatsapp-fab';

/**
 * The admin panel is a separate application surface (its own sidebar,
 * its own light theme) — it never wears the public marketing header/footer.
 * Embeddable widgets (/embed/*) are bare for the same reason: they're meant
 * to render inside an iframe on someone else's page, not as a standalone site page.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');
  const isEmbed = pathname.startsWith('/embed');

  if (isEmbed) {
    return <main id="main">{children}</main>;
  }

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
