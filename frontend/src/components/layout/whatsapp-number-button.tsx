import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.45-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.83c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.58.66.2 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
      <path d="M12.04 2.02C6.5 2.02 2 6.47 2 11.94c0 1.75.46 3.45 1.34 4.95L2 22l5.25-1.37a10.1 10.1 0 0 0 4.79 1.22h.01c5.54 0 10.04-4.45 10.04-9.92 0-5.47-4.5-9.91-10.05-9.91zm0 18.12h-.01a8.4 8.4 0 0 1-4.28-1.17l-.31-.25-3.12.81.83-3.04-.25-.31a8.32 8.32 0 0 1-1.28-4.45c0-4.58 3.77-8.31 8.42-8.31 4.64 0 8.42 3.73 8.42 8.31 0 4.58-3.78 8.31-8.42 8.31z" />
    </svg>
  );
}

type Props = {
  phone?: string;
  phoneRaw?: string;
  size?: 'sm' | 'md';
  className?: string;
};

export function WhatsAppNumberButton({
  phone = siteConfig.contact.phonePrimary,
  phoneRaw = siteConfig.contact.phonePrimaryRaw,
  size = 'md',
  className,
}: Props) {
  const href = `https://wa.me/${phoneRaw.replace(/\D/g, '')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${phone}`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-bold text-white shadow-md shadow-[#25D366]/30 transition-transform hover:scale-[1.03] hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        size === 'sm' ? 'h-10 px-3.5 text-xs sm:text-sm' : 'h-12 px-5 text-sm',
        className
      )}
    >
      <WhatsAppIcon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      {phone}
    </a>
  );
}
