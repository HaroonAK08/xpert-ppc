import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const inputClasses =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted/80 focus:border-brand focus:ring-4 focus:ring-brand/10';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClasses, className)} {...props} />
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => <select ref={ref} className={cn(inputClasses, 'pr-8', className)} {...props} />
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted/80 focus:border-brand focus:ring-4 focus:ring-brand/10',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
