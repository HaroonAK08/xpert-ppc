import { cn } from '@/lib/utils';

export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1d6ff2]',
        className
      )}
    >
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#1d6ff2]/70" aria-hidden />
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
      <h2
        id={id}
        className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
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
        'rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-sm transition duration-300 hover:border-[#1d6ff2]/35 hover:shadow-md hover:shadow-[#1d6ff2]/10',
        className
      )}
    >
      {children}
    </div>
  );
}
