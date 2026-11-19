import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Check, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHead } from '@/components/home/section-head';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { buildMetadata, professionalServiceSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us - Get Your Free PPC Consultation',
  description:
    'Contact Xpert PPC for a free consultation. Our PPC specialists are ready to help you maximize your advertising ROI.',
  path: '/contact',
  keywords: ['contact PPC agency', 'free PPC consultation', 'Google Ads consultation'],
});

/** Direct lines, ordered by how quickly they get answered. */
const channels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: siteConfig.contact.whatsappDisplay,
    href: siteConfig.contact.whatsapp,
    note: 'Fastest route — usually answered the same day',
    external: true,
    accent: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    note: 'Best for account access and audit material',
  },
  {
    icon: Phone,
    label: 'UAE',
    value: siteConfig.contact.phonePrimary,
    href: `tel:${siteConfig.contact.phonePrimaryRaw}`,
    note: 'Gulf Standard Time',
  },
  {
    icon: Phone,
    label: 'Canada',
    value: siteConfig.contact.phoneCanada,
    href: `tel:${siteConfig.contact.phoneCanadaRaw}`,
    note: 'Mountain Time',
  },
];

const hours = [
  { days: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { days: 'Saturday', time: '10:00 AM – 4:00 PM' },
  { days: 'Sunday', time: 'Closed' },
];

/** What actually happens after the form is sent. */
const nextSteps = [
  {
    title: 'We reply within one working day',
    body: 'A real response from the person who would run your account — not an automated sequence.',
  },
  {
    title: 'You send read-only account access',
    body: 'Enough to review structure, search terms and conversion tracking. No changes are made.',
  },
  {
    title: 'You get written findings',
    body: 'Where budget is being wasted and what to fix first, prioritized. Yours to keep either way.',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          ...professionalServiceSchema(),
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '16:00',
            },
          ],
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero + form                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-background pb-14 pt-8 md:pb-20 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
              backgroundSize: '68px 68px',
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 75% 65% at 50% 0%, #000 35%, transparent 100%)',
            }}
          />
          <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Contact' }]} />

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <LoadGroup className="lg:col-span-5 lg:pt-4">
              <LoadItem className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-semibold text-[#c6d2e6]">
                <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-success/15 px-2 text-[11px] font-bold uppercase tracking-wider text-success">
                  Free audit
                </span>
                No obligation, no lock-in
              </LoadItem>

              <LoadItem
                as="h1"
                y={16}
                duration={0.7}
                className="mb-6 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
              >
                Let&apos;s look at your{' '}
                <span className="bg-gradient-to-r from-[#4d9bff] to-[#38bdf8] bg-clip-text text-transparent">
                  actual account
                </span>
              </LoadItem>

              <LoadItem
                as="p"
                y={14}
                className="mb-8 max-w-lg text-base leading-relaxed text-[#9fb0cc] md:text-lg"
              >
                Tell us what you&apos;re running and what it needs to do. We&apos;ll review
                structure, tracking and wasted spend, then come back with prioritized actions —
                before anyone talks about a retainer.
              </LoadItem>

              <LoadItem as="ul" className="space-y-3.5">
                {[
                  'Written findings you keep, whether or not we work together',
                  'Tracking verified before any budget recommendation',
                  'A senior specialist on the call, not a salesperson',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-[#c6d2e6]">{b}</span>
                  </li>
                ))}
              </LoadItem>
            </LoadGroup>

            <LoadFade y={18} delay={0.3} className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.09] bg-[#0e1a38] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] md:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-success">
                  <ShieldCheck className="h-3.5 w-3.5" /> Replies within one working day
                </span>

                <h2 className="mb-1.5 mt-4 text-xl font-bold tracking-tight text-white">
                  Send us a message
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-[#9fb0cc]">
                  The more you tell us about the account, the more specific the audit comes back.
                </p>

                <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
                  <LeadForm source="contact-page" />
                </Suspense>
              </div>
            </LoadFade>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Direct channels                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-white/[0.07] bg-[#060c1d] py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Direct lines"
            title="Prefer to skip the form?"
            description="Reach whoever is on the account directly. WhatsApp is the fastest."
            className="mb-10 md:mb-12"
          />

          <RevealGroup
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {channels.map((c) => (
              <RevealItem key={c.label + c.value} className="h-full">
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-[#122047]"
                >
                  <span
                    className={
                      c.accent
                        ? 'mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-success/25 bg-success/10'
                        : 'mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10'
                    }
                  >
                    <c.icon className={c.accent ? 'h-5 w-5 text-success' : 'h-5 w-5 text-primary'} />
                  </span>

                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d7f9e]">
                    {c.label}
                  </span>
                  <span className="mt-1.5 break-words text-[15px] font-bold text-white">
                    {c.value}
                  </span>
                  <span className="mt-2.5 flex-1 text-[12px] leading-relaxed text-[#8e9fbc]">
                    {c.note}
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal y={14} amount={0.2}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-white">Business hours</h3>
                  <dl className="mt-3 space-y-1.5">
                    {hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-4 text-[13px]">
                        <dt className="text-[#8e9fbc]">{h.days}</dt>
                        <dd className="font-semibold text-[#c6d2e6]">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>

            <Reveal y={14} amount={0.2} delay={0.08}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-white">Where we are</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#9fb0cc]">
                    {siteConfig.contact.address}
                  </p>
                  <p className="mt-2 text-[12px] text-[#6d7f9e]">
                    {siteConfig.contact.location} — we work across UAE, Canada and the US.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What happens next                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="What happens next"
            title="Three steps, no surprises"
            description="So you know exactly what you're agreeing to before you send anything over."
            className="mb-10 md:mb-14"
          />

          <RevealGroup
            as="ol"
            stagger={0.1}
            amount={0.15}
            className="relative mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block"
            />

            {nextSteps.map((step, i) => (
              <RevealItem key={step.title} as="li" className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0e1a38] p-6">
                  <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9fb0cc]">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal y={12} amount={0.2} className="mt-10 text-center">
            <p className="text-sm text-[#8e9fbc]">
              Not ready to share account access?{' '}
              <Link href="/faq" className="font-bold text-primary hover:text-[#5ba6ff]">
                Read the FAQ
              </Link>{' '}
              or{' '}
              <Link href="/case-study" className="font-bold text-primary hover:text-[#5ba6ff]">
                see published results
              </Link>{' '}
              first.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-background pb-20 pt-4 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal
            y={20}
            amount={0.25}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-[#0b1733] px-6 py-12 text-center sm:px-10 md:py-16"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[110px]"
            />

            <div className="relative z-10">
              <h2 className="mx-auto max-w-2xl text-balance text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-[2.5rem]">
                Faster on WhatsApp
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.975rem] leading-relaxed text-[#9fb0cc] md:text-base">
                Send the question, get a straight answer. No call required and no pitch attached.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hover-effect inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-14px_hsl(var(--primary))] transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Message us now
                </a>
                <Link
                  href="/services"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.14] px-8 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] sm:w-auto"
                >
                  Browse services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
