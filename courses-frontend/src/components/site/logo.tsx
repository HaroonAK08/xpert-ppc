import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Logo({ dark, href = '/' }: { dark?: boolean; href?: string | null }) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <img
        src="/favicon-192.png"
        alt=""
        width={34}
        height={34}
        className="h-[34px] w-[34px] shrink-0 rounded-full object-cover ring-1 ring-[#1a6ef0]/35"
        decoding="async"
      />
      <span className="min-w-0 leading-[1.15]">
        <span
          className={cn(
            'block text-[14px] font-extrabold tracking-tight',
            dark ? 'text-white' : 'text-[#0a1b3f]'
          )}
        >
          Xpert<span className={dark ? 'text-[#7eb6ff]' : 'text-[#1a6ef0]'}>PPC</span>
        </span>
        <span
          className={cn(
            'block text-[10px] font-semibold uppercase tracking-[0.08em]',
            dark ? 'text-white/70' : 'text-[#5b6d89]'
          )}
        >
          Digital Marketing Academy
        </span>
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="XpertPPC Digital Marketing Academy">
      {content}
    </Link>
  );
}
