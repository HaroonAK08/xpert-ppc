import { cn } from '@/lib/utils';

export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300/90',
        className
      )}
    >
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-sky-400/70" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  subtitle,
  className,
  id,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn('mx-auto mb-12 max-w-2xl text-center', className)}>
      <h2 id={id} className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-slate-300/80 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function AcademyPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition duration-300 hover:border-sky-400/25 hover:bg-white/[0.05]',
        className
      )}
    >
      {children}
    </div>
  );
}
