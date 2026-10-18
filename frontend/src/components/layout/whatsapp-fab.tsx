'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export function WhatsAppFab() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/ads')) return null;

  return (
    <a
      href={siteConfig.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.65)] transition hover:scale-110 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6 md:right-6 md:h-[60px] md:w-[60px]"
    >
      <MessageCircle className="h-7 w-7 fill-white md:h-8 md:w-8" strokeWidth={1.75} />
    </a>
  );
}

export default WhatsAppFab;
