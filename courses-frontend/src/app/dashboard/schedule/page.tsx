'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Globe2, Video } from 'lucide-react';
import { fetchStudentHub, type HubSession } from '@/lib/student-hub';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

function formatWhen(value: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-PK', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone || 'Asia/Karachi',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<HubSession[] | null>(null);
  const [nextSession, setNextSession] = useState<HubSession | null>(null);

  useEffect(() => {
    fetchStudentHub().then((res) => {
      if (!res.ok) {
        setSessions([]);
        return;
      }
      setSessions(res.data.sessions);
      setNextSession(res.data.nextSession);
    });
  }, []);

  return (
    <>
      <DashboardPageHeader title="Class Schedule" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Upcoming sessions</h2>
        <p className="mt-1 text-sm text-muted">Live class times and Meet links from your instructor.</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="panel p-6">
            <h3 className="text-base font-extrabold text-ink">Schedule</h3>
            {sessions === null ? (
              <p className="mt-4 text-sm text-muted">Loading…</p>
            ) : sessions.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-2 py-6 text-center">
                <CalendarDays className="h-14 w-14 text-border" strokeWidth={1.25} />
                <p className="text-sm font-bold text-ink">No sessions scheduled yet</p>
                <p className="max-w-xs text-xs text-muted">
                  When your instructor adds class times, they will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded-2xl border border-border/80 p-4">
                    <p className="text-sm font-bold text-ink">{session.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{session.courseTitle}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/80">
                      <Clock className="h-3.5 w-3.5 text-brand" />
                      {formatWhen(session.startsAt, session.timezone)}
                    </p>
                    {session.meetLink ? (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand text-xs font-bold text-white"
                      >
                        <Video className="h-4 w-4" />
                        Join Google Meet
                      </a>
                    ) : (
                      <p className="mt-3 text-xs text-muted">Meet link pending</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-base font-extrabold text-ink">Next class</h3>
            {nextSession ? (
              <div className="mt-5">
                <p className="text-lg font-bold text-ink">{nextSession.title}</p>
                <p className="mt-1 text-sm text-muted">{nextSession.courseTitle}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/80">
                  <Clock className="h-3.5 w-3.5 text-brand" />
                  {formatWhen(nextSession.startsAt, nextSession.timezone)}
                </p>
                {nextSession.meetLink ? (
                  <a
                    href={nextSession.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white"
                  >
                    <Video className="h-4 w-4" />
                    Join Google Meet
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#eef2f8] text-sm font-semibold text-muted"
                  >
                    <Video className="h-4 w-4" />
                    Google Meet link pending
                  </button>
                )}
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
                  <Globe2 className="h-3.5 w-3.5" />
                  Time zone: {nextSession.timezone}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Your next session will appear here once scheduled.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
