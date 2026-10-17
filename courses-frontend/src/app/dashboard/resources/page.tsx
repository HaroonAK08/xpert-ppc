'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, ChevronRight, FileText, FolderOpen } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { fetchStudentHub, type HubResource } from '@/lib/student-hub';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

function resourceUrl(url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function iconFor(kind: string) {
  if (kind === 'assignment') return { Icon: CheckSquare, tone: 'bg-amber-50 text-amber-600' };
  if (kind === 'template') return { Icon: FolderOpen, tone: 'bg-emerald-50 text-emerald-600' };
  return { Icon: FileText, tone: 'bg-brand-soft text-brand' };
}

export default function ResourcesPage() {
  const [items, setItems] = useState<HubResource[] | null>(null);

  useEffect(() => {
    fetchStudentHub().then((res) => {
      setItems(res.ok ? res.data.resources : []);
    });
  }, []);

  return (
    <>
      <DashboardPageHeader title="Resources" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Learning resources</h2>
        <p className="mt-1 text-sm text-muted">Notes, assignments, and assets for your enrolled courses.</p>

        {items === null ? (
          <p className="mt-6 text-sm text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-6 panel p-10 text-center">
            <p className="text-sm font-bold text-ink">No resources yet</p>
            <p className="mt-1 text-xs text-muted">Your instructor will publish notes and files here.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const { Icon, tone } = iconFor(item.kind);
              const inner = (
                <>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-base font-extrabold text-ink">{item.title}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">{item.courseTitle}</p>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">
                    {item.description || item.kind}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                    <span className="text-[11px] font-semibold capitalize text-muted">{item.kind}</span>
                    <ChevronRight className="h-4 w-4 text-muted/40" />
                  </div>
                </>
              );
              return item.fileUrl ? (
                <a
                  key={item.id}
                  href={resourceUrl(item.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel flex flex-col p-5 transition hover:border-brand/30"
                >
                  {inner}
                </a>
              ) : (
                <div key={item.id} className="panel flex flex-col p-5">
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
