'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/socials';

export function WhatsAppFab() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return null;

  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.65)] transition hover:scale-110 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-6 md:right-6 md:h-[60px] md:w-[60px]"
    >
      <MessageCircle className="h-7 w-7 fill-white" strokeWidth={1.75} />
    </a>
  );
}
