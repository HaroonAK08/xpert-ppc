import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}
      aria-label="Xpert PPC — home"
    >
      <span className="text-2xl font-extrabold tracking-tighter text-primary">
        XPERT<span className="text-foreground">PPC</span>
      </span>
    </Link>
  );
}
