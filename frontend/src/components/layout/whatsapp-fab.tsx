'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export function WhatsAppFab() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/ads')) return null;

  return (
    <motion.a
      href={siteConfig.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6 md:right-6 md:h-[60px] md:w-[60px]"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
    </motion.a>
  );
}

export default WhatsAppFab;
