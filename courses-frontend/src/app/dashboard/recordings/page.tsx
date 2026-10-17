'use client';

import { useEffect, useState } from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { fetchStudentHub, type HubRecording } from '@/lib/student-hub';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

function recordingUrl(url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function RecordingsPage() {
  const [items, setItems] = useState<HubRecording[] | null>(null);

  useEffect(() => {
    fetchStudentHub().then((res) => {
      setItems(res.ok ? res.data.recordings : []);
    });
  }, []);

  return (
    <>
      <DashboardPageHeader title="Recordings" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Class recordings</h2>
        <p className="mt-1 text-sm text-muted">Replays published by your instructor.</p>

        <div className="mt-6 panel p-6">
          {items === null ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <PlayCircle className="h-12 w-12 text-border" strokeWidth={1.25} />
              <p className="text-sm font-bold text-ink">No recordings available yet</p>
              <p className="max-w-sm text-xs text-muted">
                After your instructor publishes a session replay, you can watch it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={recordingUrl(item.videoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 p-4 transition hover:border-brand/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <PlayCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{item.courseTitle}</p>
                      {item.durationMinutes ? (
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="h-3 w-3" />
                          {item.durationMinutes} min
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand">
                    Watch
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
