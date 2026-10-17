export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-white px-5 py-4 sm:px-8">
      <div>
        <h1 className="text-lg font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
