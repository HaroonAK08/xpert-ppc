import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Award,
  Monitor,
  Video,
  CalendarClock,
  ArrowRight,
  Users,
  FileText,
  Settings2,
  Search,
  BarChart3,
  TrendingUp,
  Sprout,
  CheckCircle2,
  Target,
  Rocket,
  Briefcase,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { Accordion } from '@/components/courses/accordion';
import { getCourse, getCourses } from '@/lib/courses';

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return { title: course.shortName || course.name, description: course.description };
}

const OUTCOME_ICONS = [Settings2, Search, BarChart3, TrendingUp];
const RESULT_ICONS = [Target, Rocket, CheckCircle2, Briefcase];

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const displayName = course.shortName || course.name;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#e8eef8] bg-gradient-to-b from-[#eaf3ff] to-white">
          <div className="page py-10 sm:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr_300px]">
              <div className="max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  <Sprout className="h-3.5 w-3.5" />
                  {course.level || 'Beginner friendly'}
                </span>
                <h1 className="mt-4 text-[2.1rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem]">
                  {displayName} —<br />
                  <span className="text-brand">Live Course</span>
                </h1>
                <p className="mt-4 text-[16px] leading-relaxed text-muted">{course.description || course.tagline}</p>
              </div>

              <div className="relative mx-auto hidden w-full max-w-[420px] lg:block">
                <Image
                  src={`/images/courses/${course.slug}.jpg`}
                  alt={`${displayName} course illustration`}
                  width={840}
                  height={630}
                  className="h-auto w-full rounded-[20px] object-cover shadow-[0_20px_40px_-24px_rgba(26,110,240,0.45)]"
                  priority
                />
              </div>

              <div className="rounded-[18px] border border-[#e8eef8] bg-white p-6 shadow-card lg:self-start">
                <div className="space-y-4">
                  {[
                    { icon: Award, title: 'Expert-led training', body: 'Learn practical skills from working professionals.' },
                    { icon: Monitor, title: 'Live online classes', body: 'Interactive and doubt clearing sessions.' },
                    { icon: Video, title: 'Google Meet', body: 'Classes will be held on Google Meet.' },
                    { icon: CalendarClock, title: 'Schedule to be announced', body: 'Dates and timings will be shared soon.' },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{title}</p>
                        <p className="text-xs text-muted">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/signup?course=${course.slug}`}
                  className="btn-primary mt-6 h-12 w-full"
                >
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {course.outcomes.length > 0 ? (
          <section className="bg-white py-14 sm:py-16">
            <div className="page">
              <h2 className="text-[1.85rem] font-extrabold tracking-tight text-ink">What you will learn</h2>
              <p className="mt-1 text-sm text-muted">Build practical skills with a structured, hands-on approach.</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {course.outcomes.map((outcome, i) => {
                  const Icon = OUTCOME_ICONS[i % OUTCOME_ICONS.length];
                  const [title, ...rest] = outcome.split('.');
                  const body = rest.join('.').trim();
                  return (
                    <div key={outcome} className="rounded-[16px] border border-[#e8eef8] bg-white p-5 shadow-sm">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-[15px] font-bold leading-snug text-ink">{title}</h3>
                      {body ? <p className="mt-2 text-[13px] leading-relaxed text-muted">{body}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {(course.results?.length ?? 0) > 0 ? (
          <section className="bg-[#f7faff] py-14 sm:py-16">
            <div className="page">
              <div className="text-center">
                <h2 className="text-[1.85rem] font-extrabold tracking-tight text-ink">Results you&apos;ll walk away with</h2>
                <p className="mt-1 text-sm text-muted">Concrete outputs — not just theory — you can use or show after the course.</p>
              </div>
              <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
                {course.results.map((result, i) => {
                  const Icon = RESULT_ICONS[i % RESULT_ICONS.length];
                  const [title, ...rest] = result.split('.');
                  const body = rest.join('.').trim();
                  return (
                    <div
                      key={result}
                      className="flex gap-4 rounded-[16px] border border-[#e8eef8] bg-white p-5 shadow-[0_8px_24px_-18px_rgba(10,27,63,0.2)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-bold leading-snug text-ink">{title}</h3>
                        {body ? <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-[#eef5ff] py-14 sm:py-16">
          <div className="page">
            <div className="text-center">
              <h2 className="text-[1.85rem] font-extrabold tracking-tight text-ink">How classes work</h2>
              <p className="mt-1 text-sm text-muted">A simple and flexible learning experience.</p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: 'Join your batch',
                  body: 'Enroll and join the batch when the schedule is announced.',
                },
                {
                  icon: Video,
                  title: 'Attend live sessions',
                  body: 'Learn through live online classes with interactive Q&A.',
                },
                {
                  icon: FileText,
                  title: 'Access notes and recordings',
                  body: 'Get class notes and recordings to revise at your own pace.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-pop">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-base font-bold text-ink">{title}</h3>
                  <p className="max-w-[260px] text-sm leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="page">
            <h2 className="text-[1.85rem] font-extrabold tracking-tight text-ink">Frequently asked questions</h2>
            <p className="mt-1 text-sm text-muted">Quick answers to common questions about the course.</p>
            <div className="mt-7 max-w-3xl">
              <Accordion
                items={(course.faqs.length
                  ? course.faqs
                  : [
                      {
                        question: 'Do I need previous experience?',
                        answer: 'No. This course is beginner friendly and starts from the fundamentals.',
                      },
                      {
                        question: 'Where will classes take place?',
                        answer: 'Live classes are held online over Google Meet.',
                      },
                      {
                        question: 'How do I access recordings?',
                        answer: 'Recordings and notes are shared with enrolled students after each class.',
                      },
                    ]
                ).map((faq) => ({ key: faq.question, title: faq.question, body: faq.answer }))}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="course" />
    </>
  );
}
