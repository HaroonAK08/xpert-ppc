import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted sm:mt-2">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{children}</div> : null}
    </div>
  );
}
