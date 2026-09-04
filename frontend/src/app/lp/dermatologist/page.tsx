import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Globe,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Search,
  Stethoscope,
  Target,
  Users,
} from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import {
  Float,
  LoadFade,
  LoadGroup,
  LoadItem,
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/components/motion';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Marketing for Dermatologists & Aesthetic Clinics | Xpert PPC',
  description:
    'Get more patient appointments for your dermatology and aesthetic clinic with Google Ads, Meta Ads, landing pages, local search, and accurate conversion tracking.',
  path: '/lp/dermatologist',
  image: '/og-dermatologists.png',
  keywords: [
    'dermatologist marketing',
    'aesthetic clinic ads',
    'dermatology Google Ads',
    'skin clinic ads',
    'aesthetic clinic marketing',
  ],
  noIndex: true,
});

const SITE = 'https://xpertppc.com';
const WHATSAPP =
  'https://wa.me/923004021417?text=' +
  encodeURIComponent("Hi Xpert PPC, I'd like a free clinic marketing audit.");

const challenges = [
  {
    title: 'Low Google Visibility',
    body: 'Patients search for dermatologists and aesthetic clinics nearby — but competitors appear first.',
  },
  {
    title: 'Inconsistent Appointments',
    body: 'Referrals alone don’t create a predictable stream of new patients.',
  },
  {
    title: 'Poor Social Advertising',
    body: 'Boosting posts isn’t a patient-acquisition strategy.',
  },
  {
    title: 'No Proper Tracking',
    body: 'You don’t know which campaigns generated calls or WhatsApp messages.',
  },
];

const journey = [
  { icon: Users, label: 'Needs Derm / Aesthetic Care' },
  { icon: Search, label: 'Searches Google / Browses Instagram' },
  { icon: Megaphone, label: 'Sees Your Clinic' },
  { icon: Globe, label: 'Visits Landing Page' },
  { icon: MessageCircle, label: 'Calls / WhatsApp / Form' },
  { icon: CalendarCheck, label: 'Books Appointment' },
  { icon: Stethoscope, label: 'Visits Clinic' },
];

const services = [
  {
    icon: Search,
    title: 'Google Ads',
    body: 'Appear when patients search for dermatologists, aesthetic clinics, lasers, injectables, and more.',
    href: `${SITE}/services/google-ads`,
  },
  {
    icon: Megaphone,
    title: 'Facebook & Instagram Ads',
    body: 'Reach patients researching skin, laser, and aesthetic treatments before they search Google.',
    href: `${SITE}/services/meta-ads`,
  },
  {
    icon: MapPin,
    title: 'Local SEO & Google Presence',
    body: 'Improve your clinic’s visibility in Google Maps and local search results.',
    href: `${SITE}/services`,
  },
  {
    icon: Globe,
    title: 'Landing Pages & Websites',
    body: 'High-converting pages designed to turn clinic visitors into appointment requests.',
    href: `${SITE}/services`,
  },
  {
    icon: Target,
    title: 'Conversion Tracking',
    body: 'Track phone calls, WhatsApp messages, and form submissions from every campaign.',
    href: `${SITE}/services`,
  },
  {
    icon: ClipboardList,
    title: 'Content Strategy',
    body: 'Educational content that builds trust and attracts patients researching treatments.',
    href: `${SITE}/services`,
  },
];

const treatments = [
  {
    title: 'General Dermatology',
    body: 'Attract patients searching for skin consultations and dermatologist appointments.',
    image: '/lp/dermatologist/lp-treatment-general.png',
  },
  {
    title: 'Acne Care',
    body: 'Reach patients looking for acne treatments at dermatology and aesthetic clinics.',
    image: '/lp/dermatologist/lp-treatment-acne.png',
  },
  {
    title: 'Hair & Scalp',
    body: 'Capture demand for hair loss consultations and scalp treatments.',
    image: '/lp/dermatologist/lp-treatment-hair.png',
  },
  {
    title: 'Laser & Aesthetic',
    body: 'Promote lasers, skin rejuvenation, and aesthetic packages with clear landing pages.',
    image: '/lp/dermatologist/lp-treatment-laser.png',
  },
  {
    title: 'Cosmetic Procedures',
    body: 'Drive enquiries for injectables, cosmetic dermatology, and clinic procedures.',
    image: '/lp/dermatologist/lp-treatment-procedures.png',
  },
  {
    title: 'Clinic Consultations',
    body: 'Fill the appointment book with patients ready to book a derm or aesthetic consult.',
    image: '/lp/dermatologist/lp-treatment-consult.png',
  },
];

const metrics = [
  { icon: Phone, label: 'Phone Call', value: '+24' },
  { icon: MessageCircle, label: 'WhatsApp Inquiry', value: '+36' },
  { icon: ClipboardList, label: 'Form Submission', value: '+18' },
  { icon: Users, label: 'New Patients', value: '+27' },
];

const platforms = [
  'Google Ads',
  'Meta Ads',
  'Microsoft Ads',
  'TikTok Ads',
  'LinkedIn Ads',
  'YouTube Ads',
];

function FormCard({ id = 'audit-form' }: { id?: string }) {
  return (
    <div
      id={id}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-6"
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1d6ff2]">
        Free clinic audit
      </p>
      <h2 className="mb-4 text-xl font-extrabold text-[#0b1f4d]">Grow your derm & aesthetic clinic</h2>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
        <LeadForm
          variant="audit"
          source="industry"
          compact
          submitLabel="Get My Free Audit"
          className="[&_button]:rounded-full [&_button]:bg-[#1d6ff2] [&_button]:hover:bg-[#1558c7]"
        />
      </Suspense>
    </div>
  );
}

export default function DermatologistLpPage() {
  return (
    <div className="lp-light -mt-20 bg-white text-slate-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef5ff] via-white to-white pb-16 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 animate-pulse rounded-full bg-[#1d6ff2]/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <LoadGroup className="min-w-0">
            <LoadItem>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1d6ff2]">
                Digital marketing for dermatologists & aesthetic clinics
              </p>
            </LoadItem>
            <LoadItem as="h1" y={18}>
              <span className="mb-5 block text-3xl font-extrabold leading-tight text-[#0b1f4d] sm:text-4xl lg:text-[2.75rem]">
                Get More Patient Appointments for Your Dermatology & Aesthetic Clinic
              </span>
            </LoadItem>
            <LoadItem as="p">
              <span className="mb-7 block max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                We help dermatologists and aesthetic clinics attract more qualified patients through
                Google Ads, Meta Ads, high-converting landing pages, local search, and accurate
                conversion tracking.
              </span>
            </LoadItem>
            <LoadItem>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#audit-form"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1d6ff2] px-6 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#1558c7]"
                >
                  Get a Free Clinic Marketing Audit →
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#1d6ff2] px-6 text-sm font-bold text-[#1d6ff2] transition-all duration-300 hover:scale-[1.03] hover:bg-[#1d6ff2]/5"
                >
                  Book a Strategy Call
                </a>
              </div>
            </LoadItem>
            <LoadItem as="ul">
              <span className="mb-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
                {[
                  'No long-term contract',
                  'Transparent reporting',
                  'Clinic growth specialists',
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </span>
            </LoadItem>
            <LoadFade delay={0.18}>
              <FormCard />
            </LoadFade>
          </LoadGroup>

          <LoadFade delay={0.15} y={24} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#dbeafe] shadow-[0_30px_80px_rgba(15,23,42,0.18)] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/lp/dermatologist/lp-derm-hero-doctor.png"
                alt="Dermatologist consulting a patient in a modern clinic"
                width={900}
                height={1100}
                className="h-full w-full object-cover object-top"
                priority
              />
            </div>

            <Float
              delay={0.35}
              amplitude={7}
              duration={4.5}
              className="absolute -left-3 top-8 max-w-[220px] sm:-left-6"
            >
              <div className="rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-xs font-semibold text-slate-500">New Appointments</p>
                <p className="text-2xl font-extrabold text-[#1d6ff2]">+78%</p>
                <p className="text-xs text-slate-500">vs. previous 3 months</p>
                <div className="mt-3 flex h-10 items-end gap-1">
                  {[40, 55, 48, 70, 62, 85, 78].map((h, i) => (
                    <span
                      key={i}
                      className="w-3 origin-bottom rounded-t bg-[#1d6ff2]/80 transition-all duration-700"
                      style={{
                        height: `${h}%`,
                        animation: `lp-bar-grow 0.7s ease-out ${0.45 + i * 0.07}s both`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </Float>

            <Float
              delay={0.55}
              amplitude={6}
              duration={5}
              className="absolute -right-2 bottom-28 hidden w-44 sm:block"
            >
              <div className="rounded-2xl bg-white p-3 shadow-xl">
                {metrics.map((m) => (
                  <div key={m.label} className="mb-2 flex items-center gap-2 last:mb-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef5ff] text-[#1d6ff2]">
                      <m.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                      <p className="text-sm font-extrabold text-[#0b1f4d]">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Float>

            <Float
              delay={0.7}
              amplitude={5}
              duration={4.8}
              className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs"
            >
              <div className="rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <p className="text-sm italic text-slate-600">
                  “Our appointment calendar finally stays full — and we know which ads bring
                  patients.”
                </p>
                <p className="mt-2 text-xs font-bold text-[#0b1f4d]">
                  Dr. Ayesha Malik · Dermatology & Aesthetics
                </p>
              </div>
            </Float>
          </LoadFade>
        </div>
      </section>

      {/* Platforms */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl overflow-hidden px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              One team. Every major advertising platform.
            </p>
          </Reveal>
          <RevealGroup className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" stagger={0.06}>
            {platforms.map((p) => (
              <RevealItem key={p} y={10}>
                <span className="text-sm font-bold text-slate-400 transition-colors hover:text-[#1d6ff2]">
                  {p}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Challenge */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" y={20} className="mx-auto mb-10 max-w-3xl text-center text-3xl font-extrabold text-[#0b1f4d] sm:text-4xl">
            Your Clinic May Be Excellent. But Can New Patients{' '}
            <span className="text-[#1d6ff2]">Find You Online?</span>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {challenges.map((c) => (
              <RevealItem key={c.title} as="article" y={24}>
                <div className="h-full rounded-2xl border border-[#1d6ff2]/25 bg-[#f7fbff] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <h3 className="mb-2 text-lg font-bold text-[#0b1f4d]">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{c.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.15} className="mt-8">
            <div className="rounded-2xl bg-[#1d6ff2] px-6 py-5 text-center text-sm font-bold text-white shadow-lg shadow-[#1d6ff2]/25 sm:text-base">
              We Connect Marketing Spend to Real Patient Enquiries.
            </div>
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-[#f5f8fc] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="mb-10 text-center text-3xl font-extrabold text-[#0b1f4d] sm:text-4xl">
            Turn Online Searches Into Appointments
          </Reveal>
          <RevealGroup className="flex flex-wrap items-start justify-center gap-3 sm:gap-2" stagger={0.07}>
            {journey.map((step, i) => (
              <RevealItem key={step.label} y={18} className="flex items-center gap-2">
                <div className="flex w-28 flex-col items-center text-center sm:w-32">
                  <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1d6ff2] text-white shadow-lg shadow-[#1d6ff2]/25 transition-transform duration-300 hover:scale-110">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <p className="text-xs font-semibold text-slate-700">{step.label}</p>
                </div>
                {i < journey.length - 1 ? (
                  <span className="hidden text-[#1d6ff2] sm:inline">→</span>
                ) : null}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="mb-10 text-center text-3xl font-extrabold text-[#0b1f4d] sm:text-4xl">
            Everything Your Clinic Needs to Grow Online
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {services.map((s) => (
              <RevealItem key={s.title} as="article" y={22}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef5ff] text-[#1d6ff2] transition-transform duration-300 group-hover:scale-110">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-[#0b1f4d]">{s.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600">{s.body}</p>
                  <a href={s.href} className="text-sm font-bold text-[#1d6ff2] hover:underline">
                    Learn More →
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Treatments */}
      <section className="bg-[#0b1f4d] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="mb-10 text-center text-3xl font-extrabold text-white sm:text-4xl">
            Built Around the Treatments Your Clinic Offers
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {treatments.map((t) => (
              <RevealItem key={t.title} as="article" y={24}>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-bold text-[#0b1f4d]">{t.title}</h3>
                    <p className="mb-4 text-sm text-slate-600">{t.body}</p>
                    <a
                      href="#audit-form"
                      className="text-sm font-bold text-[#1d6ff2] hover:underline"
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Google Ads */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-24}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
              Google Ads
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0b1f4d]">
              Be There When Patients Are Searching
            </h2>
            <p className="mb-6 text-base leading-relaxed text-slate-600">
              Show up for high-intent searches like “dermatologist near me”, “aesthetic clinic”,
              “acne treatment”, and “laser pigmentation” — then send them to a page built to book.
            </p>
            <ul className="space-y-3">
              {[
                'Local visibility in search & Maps',
                'Qualified enquiries, not random clicks',
                'Treatment-level campaigns',
                'Call & WhatsApp tracking',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal x={24} delay={0.1}>
            <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 shadow-lg transition-transform duration-500 hover:-translate-y-1">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl font-bold text-[#4285F4]">G</span>
                <span className="text-2xl font-bold text-[#EA4335]">o</span>
                <span className="text-2xl font-bold text-[#FBBC05]">o</span>
                <span className="text-2xl font-bold text-[#4285F4]">g</span>
                <span className="text-2xl font-bold text-[#34A853]">l</span>
                <span className="text-2xl font-bold text-[#EA4335]">e</span>
              </div>
              <div className="mb-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                dermatologist near me
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase text-slate-400">Sponsored</p>
                <p className="text-lg font-bold text-[#1a0dab]">
                  Radiant Skin & Aesthetic Clinic | Book a Consult
                </p>
                <p className="text-xs text-emerald-700">www.radiantskin.example/book</p>
                <p className="mt-2 text-sm text-slate-600">
                  Dermatology, lasers, injectables & hair. Same-week appointments. Call or WhatsApp today.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meta Ads */}
      <section className="bg-[#f5f8fc] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-24} className="order-2 mx-auto w-full max-w-xs lg:order-1">
            <div className="rounded-[2rem] border-8 border-slate-900 bg-white p-3 shadow-2xl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-1deg]">
              <div className="overflow-hidden rounded-[1.4rem] border border-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                  <span className="h-8 w-8 rounded-full bg-[#1d6ff2]/20" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Radiant Aesthetic Clinic</p>
                    <p className="text-[10px] text-slate-400">Sponsored</p>
                  </div>
                </div>
                <div className="relative h-56 bg-slate-100">
                  <Image
                    src="/lp/dermatologist/lp-meta-ad-skin.png"
                    alt="Aesthetic skin treatment Instagram ad"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-sm text-slate-700">
                    Clearer skin & aesthetic results start with the right consult. Book this week.
                  </p>
                  <button
                    type="button"
                    className="h-9 w-full rounded-lg bg-[#1d6ff2] text-xs font-bold text-white"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal x={24} className="order-1 lg:order-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1d6ff2]">
              Meta Ads
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0b1f4d]">
              Build Trust Before Patients Search
            </h2>
            <p className="mb-8 text-base leading-relaxed text-slate-600">
              Use Instagram and Facebook to educate, remarket, and turn warm interest into clinic
              enquiries — especially for lasers, injectables, and visual aesthetic treatments.
            </p>
            <RevealGroup className="flex flex-wrap gap-2" stagger={0.08}>
              {[
                'Educational Content',
                'Engaged Audience',
                'Remarketing',
                'Clinic Enquiry',
                'Appointment',
              ].map((step, i, arr) => (
                <RevealItem key={step} y={12} className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0b1f4d] shadow-sm">
                    {step}
                  </span>
                  {i < arr.length - 1 ? <span className="text-[#1d6ff2]">→</span> : null}
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-20}>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0b1f4d] sm:text-4xl">
              Ready to Fill More Appointment Slots?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-slate-600">
              Tell us about your dermatology or aesthetic clinic. We’ll review your ads, website, and
              tracking — then show you where the next patients can come from.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#1d6ff2] px-6 text-sm font-bold text-[#1d6ff2] transition-all duration-300 hover:scale-[1.03] hover:bg-[#1d6ff2]/5"
            >
              Or message us on WhatsApp
            </a>
          </Reveal>
          <Reveal x={20} delay={0.1} scale={0.98}>
            <FormCard id="bottom-audit-form" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
