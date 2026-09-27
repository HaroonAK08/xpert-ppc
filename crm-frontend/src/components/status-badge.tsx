import { LEAD_STATUS_LABELS, type CrmLeadStatus } from '@shared/crm/constants';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<CrmLeadStatus, string> = {
  new: 'bg-sky-50 text-sky-700 ring-sky-100',
  contacted: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  replied: 'bg-violet-50 text-violet-700 ring-violet-100',
  interested: 'bg-amber-50 text-amber-800 ring-amber-100',
  follow_up: 'bg-orange-50 text-orange-800 ring-orange-100',
  converted: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  not_interested: 'bg-slate-100 text-slate-600 ring-slate-200',
  closed: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status as CrmLeadStatus;
  const style = STATUS_STYLES[key] ?? 'bg-slate-100 text-slate-600 ring-slate-200';
  const label = LEAD_STATUS_LABELS[key] ?? status;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        style,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
