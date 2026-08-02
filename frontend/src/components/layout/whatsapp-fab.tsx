'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export function WhatsAppFab() {
  const href = `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hi Xpert PPC, I'd like a free PPC audit."
  )}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      // Pops in a second after load so it doesn't compete with the hero.
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
