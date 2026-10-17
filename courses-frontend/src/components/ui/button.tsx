import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-brand text-brand-foreground shadow-pop hover:bg-brand/90',
        variant === 'outline' && 'border border-border bg-white text-ink hover:border-brand/40 hover:text-brand',
        variant === 'ghost' && 'text-ink hover:bg-brand-soft',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
