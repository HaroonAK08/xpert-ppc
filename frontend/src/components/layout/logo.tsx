import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2.5 transition-opacity hover:opacity-80', className)}
      aria-label="Xpert PPC — home"
    >
      <img
        src="/favicon-192.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-primary/40"
      />
      <span className="text-xl font-extrabold tracking-tighter text-primary sm:text-2xl">
        XPERT<span className="text-foreground">PPC</span>
      </span>
    </Link>
  );
}
