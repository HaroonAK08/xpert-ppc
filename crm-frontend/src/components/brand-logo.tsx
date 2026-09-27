import Link from 'next/link';

import { cn } from '@/lib/utils';

type BrandLogoProps = {
  size?: number;
  showWordmark?: boolean;
  href?: string | null;
  className?: string;
  dark?: boolean;
};

export function BrandLogo({
  size = 36,
  showWordmark = true,
  href = '/',
  className,
  dark = false,
}: BrandLogoProps) {
  const mark = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* Plain img — avoids next/image optimizer work on every shell paint. */}
      <img
        src="/favicon-192.png"
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover ring-1 ring-brand/40"
        decoding="async"
      />
      {showWordmark ? (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              'block text-[15px] font-extrabold tracking-tight',
              dark ? 'text-white' : 'text-[#0b1f4d]'
            )}
          >
            Xpert <span className="text-brand">PPC</span>
          </span>
          <span
            className={cn(
              'block text-[10px] font-semibold uppercase tracking-[0.16em]',
              dark ? 'text-white/45' : 'text-muted'
            )}
          >
            CRM
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} prefetch className="inline-flex shrink-0 transition-opacity hover:opacity-90" aria-label="Xpert PPC CRM">
      {mark}
    </Link>
  );
}
