import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ApplyCta({
  href = '#meeting',
  children,
  className,
  variant = 'primary',
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'warm';
}) {
  const classes = cn(
    'inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-extrabold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]',
    variant === 'primary' &&
      'bg-[#1d6ff2] text-white shadow-lg shadow-[#1d6ff2]/25 hover:bg-[#1558c7]',
    variant === 'warm' && 'academy-cta',
    variant === 'outline' &&
      'border border-slate-300 bg-white text-slate-700 hover:border-[#1d6ff2] hover:text-[#1d6ff2]',
    className
  );

  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
