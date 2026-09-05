import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, MessageCircle } from 'lucide-react';

import { Icon, type LucideIconName } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { courses, getCourse } from '@shared/content/courses';
import { buildMetadata, courseSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

const audienceMeta: Record<string, { icon: LucideIconName; description: string }> = {
  Students: { icon: 'GraduationCap', description: 'Kickstart your career while studying.' },
  Beginners: { icon: 'BookOpen', description: 'No prior experience required.' },
  Freelancers: { icon: 'Briefcase', description: 'Add profitable skills to your arsenal.' },
  'Business Owners': {
    icon: 'Building2',
    description: 'Scale your business online independently.',
  },
  Housewives: { icon: 'Heart', description: 'Build a flexible career from home.' },
  'Job Seekers': { icon: 'Target', description: 'Become an in-demand digital marketer.' },
  'Ecommerce Businesses': {
    icon: 'ShoppingBag',
    description: 'Advertise and grow product sales profitably.',
  },
  'Ecommerce Store Owners': {
    icon: 'ShoppingBag',
    description: 'Drive organic traffic to your store.',
  },
  'Local Businesses': { icon: 'MapPin', description: 'Dominate local search and discovery.' },
  'Marketing Professionals': {
    icon: 'Megaphone',
    description: 'Upgrade your campaign skillset.',
  },
  'Digital Marketers': { icon: 'Megaphone', description: 'Upgrade your campaign skillset.' },
};

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};

  return buildMetadata({
    title: course.seo.title,
    description: course.seo.description,
    path: `/xpert-ppc-digital-academy/${course.slug}`,
    keywords: [
      `${course.shortName} online`,
      'digital marketing course',
      'Xpert PPC Digital Academy',
      ...course.skills.slice(0, 6).map((s) => s.toLowerCase()),
    ],
  });
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const enrollHref = siteConfig.contact.whatsapp;

  return (
    <>
      <JsonLd
        data={courseSchema({
          name: course.name,
          description: course.seo.description,
          path: `/xpert-ppc-digital-academy/${course.slug}`,
        })}
      />

      <section className="relative overflow-hidden bg-background pb-16 pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <LoadFade y={20} duration={0.5} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Digital Academy' }, { label: course.shortName }]}
          />

          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name={course.icon} className="h-6 w-6" />
          </div>

          <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            {course.name}
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {course.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={enrollHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect hover-glow-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-bold text-white transition-all hover:scale-105 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> Enroll on WhatsApp
            </a>
            <a
              href="#curriculum"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-muted/40 px-6 text-sm font-bold text-foreground transition-all duration-300 hover:scale-105 hover:bg-muted/80 active:scale-95 sm:w-auto"
            >
              View Curriculum
            </a>
          </div>
        </LoadFade>
      </section>

      <section className="border-y border-border bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-4xl">
              Who Can Join?
            </h2>
            <p className="text-muted-foreground">
              Our curriculum is designed to transform beginners into professionals, regardless of
              your background.
            </p>
          </div>

          <RevealGroup className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {course.audience.map((a) => {
              const meta = audienceMeta[a] ?? {
                icon: 'Users' as LucideIconName,
                description: 'Built for learners who want practical results.',
              };
              return (
                <RevealItem
                  key={a}
                  className="group rounded-2xl border border-border/50 bg-background p-5 text-center transition-colors duration-300 hover:border-primary/50 sm:p-6"
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon name={meta.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{a}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {meta.description}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section id="overview" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <Reveal x={-30} duration={0.6}>
              <h2 className="mb-6 text-2xl font-extrabold text-foreground md:text-4xl">
                Course Overview
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{course.overview}</p>
              <h3 className="mb-5 text-lg font-bold text-foreground">Students will master:</h3>
              <ul className="flex flex-wrap gap-3">
                {course.skills.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-background px-4 py-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              x={30}
              duration={0.6}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-8"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
              <h3 className="relative z-10 mb-8 text-2xl font-bold text-foreground">
                Course Features
              </h3>
              <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {course.features.map((f) => (
                  <div key={f} className="flex items-start">
                    <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium leading-snug text-muted-foreground">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-extrabold text-foreground sm:text-3xl">
              Tools Covered
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Master the industry-standard toolkit required to build, track, and optimize
              high-performance campaigns.
            </p>
          </div>

          <RevealGroup
            as="ul"
            stagger={0.05}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
          >
            {course.tools.map((t) => (
              <RevealItem
                as="li"
                key={t}
                className="rounded-xl border border-border bg-card px-4 py-4 text-center text-sm font-semibold text-muted-foreground transition-all duration-300 hover:border-primary"
              >
                {t}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="curriculum" className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-4xl">
              Comprehensive Curriculum
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {course.modules.length} detailed modules taking you from fundamentals to advanced
              agency-level strategies.
            </p>
          </Reveal>

          <Reveal y={20}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {course.modules.map((mod, i) => (
                <AccordionItem
                  key={mod.title}
                  value={`module-${i}`}
                  className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40"
                >
                  <AccordionTrigger className="px-0 text-left font-semibold text-foreground hover:no-underline">
                    <span className="min-w-0 flex-1 text-balance">
                      <span className="mr-3 text-primary">Module {i + 1}</span>
                      {mod.title.replace(/^Module \d+:\s*/, '')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <ul className="space-y-2 pb-2">
                      {mod.lessons.map((l) => (
                        <li
                          key={l}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-foreground sm:text-3xl">
            Course Requirements
          </h2>
          <RevealGroup
            stagger={0.1}
            className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {course.requirements.map((r) => (
              <RevealItem key={r.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-bold text-foreground">{r.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{r.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <Reveal scale={0.98} className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Seats are limited so every student gets hands-on feedback. Message us to reserve yours.
          </p>
          <a
            href={enrollHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover-effect hover-glow-accent inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-bold text-white transition-all hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" /> Enroll on WhatsApp
          </a>
        </Reveal>
      </section>
    </>
  );
}
