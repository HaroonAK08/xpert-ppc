import * as React from 'react';
import { cn } from '@/lib/utils';

const fieldBase =
  'flex w-full rounded-xl border border-primary/20 bg-muted/40 px-4 text-sm text-foreground shadow-inner shadow-black/10 transition-[border,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-primary/40 focus-visible:border-primary focus-visible:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input type={type} className={cn(fieldBase, 'h-12', className)} ref={ref} {...props} />
  )
);
Input.displayName = 'Input';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(fieldBase, 'min-h-[108px] resize-y py-3', className)}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(fieldBase, 'h-12 cursor-pointer appearance-none pr-10', className)}
      // Chevron is drawn as a background image. Position/size/repeat live here
      // rather than in classes so tailwind-merge can't drop `bg-background`
      // as a conflicting `bg-*` utility.
      style={{
        backgroundColor: 'hsl(var(--muted) / 0.4)',
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23c7d3e6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.9rem center',
        backgroundSize: '16px',
      }}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-xs font-semibold tracking-wide text-muted-foreground', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

/** Field wrapper matching the site's `space-y-1.5` grouping. */
function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

export { Input, Textarea, Select, Label, Field, fieldBase };
