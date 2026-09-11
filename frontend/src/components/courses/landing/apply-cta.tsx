import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ApplyCta({
  href = '/courses/signup',
  children,
  className,
  variant = 'primary',
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'warm';
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-extrabold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]',
        variant === 'primary' &&
          'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90',
        variant === 'warm' && 'academy-cta',
        variant === 'outline' &&
          'border border-white/15 bg-white/[0.03] text-slate-200 hover:border-sky-400/40 hover:text-white',
        className
      )}
    >
      {children}
    </Link>
  );
}
