import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * Shared heading block for every homepage section, so eyebrow / title /
 * description keep one rhythm instead of each section inventing its own.
 */
export function SectionHead({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-[2.5rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
