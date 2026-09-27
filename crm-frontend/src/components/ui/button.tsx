import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-foreground shadow-sm shadow-brand/30 hover:bg-[#155fd6]',
  secondary: 'bg-brand-soft text-brand hover:bg-[#d7e7fd]',
  outline:
    'border border-border bg-surface text-ink shadow-sm hover:border-brand/30 hover:bg-brand-soft/60',
  ghost: 'text-muted hover:bg-brand-soft/70 hover:text-ink',
  danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
};

export function buttonVariants(
  opts: { variant?: Variant; size?: Size; className?: string } = {}
) {
  const { variant = 'primary', size = 'md', className } = opts;
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15 disabled:pointer-events-none disabled:opacity-40',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
  )
);
Button.displayName = 'Button';
