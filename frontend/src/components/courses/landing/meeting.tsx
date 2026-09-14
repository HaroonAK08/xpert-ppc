'use client';

import { Suspense } from 'react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import { MeetingForm } from './meeting-form';
import { SectionEyebrow } from './section';

export function LandingMeeting() {
  const { meeting } = coursesLanding;

  return (
    <section id="meeting" className="scroll-mt-28 border-b border-slate-200/80 bg-slate-50/80 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal className="lg:pt-4">
            <SectionEyebrow>{meeting.eyebrow}</SectionEyebrow>
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {meeting.title}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">{meeting.subtitle}</p>
            <ol className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d6ff2] text-xs font-bold text-white">
                  1
                </span>
                Book a meeting with the form — no payment yet
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d6ff2] text-xs font-bold text-white">
                  2
                </span>
                Initial interview — we hear your background & skillset
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d6ff2] text-xs font-bold text-white">
                  3
                </span>
                We decide which skills you need + what it will cost
              </li>
            </ol>
          </Reveal>

          <Reveal
            delay={0.08}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8"
          >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100" />}>
              <MeetingForm />
            </Suspense>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
