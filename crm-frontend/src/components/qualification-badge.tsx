import { LEAD_QUALIFICATION_LABELS, type LeadQualification } from '@shared/crm/constants';
import { cn } from '@/lib/utils';

const QUALIFICATION_STYLES: Record<LeadQualification, string> = {
  unreviewed: 'bg-slate-100 text-slate-600 ring-slate-200',
  real: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  false_lead: 'bg-amber-50 text-amber-800 ring-amber-100',
  spam: 'bg-red-50 text-red-700 ring-red-100',
};

export function QualificationBadge({ qualification, className }: { qualification: string; className?: string }) {
  const key = qualification as LeadQualification;
  const style = QUALIFICATION_STYLES[key] ?? QUALIFICATION_STYLES.unreviewed;
  const label = LEAD_QUALIFICATION_LABELS[key] ?? qualification;

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
