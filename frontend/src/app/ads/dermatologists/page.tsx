import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Code2,
  Globe,
  Megaphone,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import { AdPreviews } from '@/components/lp/ad-previews';
import { CityPreviewProvider } from '@/components/lp/city-preview-context';
import { ClinicWebsitePreview } from '@/components/lp/clinic-site-preview';
import { SearchPreview } from '@/components/lp/search-preview';
import { StickyLpCta } from '@/components/lp/sticky-cta';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { umerKhan } from '@shared/content/team';

export const metadata: Metadata = buildMetadata({
  title: 'Dermatologist Ads, SEO & Websites | Xpert PPC',
  description:
    'Free audit for dermatology clinics. Google, Meta and TikTok ads plus SEO, clinic websites and booking software. Talk to Umer Khan at Xpert PPC.',
  path: '/ads/dermatologists',
  image: '/og-dermatologists.png',
  keywords: [
    'dermatologist marketing',
    'dermatology Google Ads',
    'dermatology SEO',
    'skin clinic website',
    'dermatology patient acquisition',
  ],
  noIndex: true,
});

const trustHero = [
  { title: 'Google Premier Partner', detail: 'Official Google Ads partner status' },
  { title: 'Healthcare-safe ads', detail: 'No fake results or banned claims' },
  { title: 'Clinics worldwide', detail: 'We run campaigns in any country' },
  { title: 'No lock-in', detail: 'Free audit. 90-day plan if we work' },
];

const trust = [
  { title: 'Google Premier Partner', detail: 'Official Google Ads partner' },
  { title: 'Meta Blueprint certified', detail: 'Facebook & Instagram ads' },
  { title: 'Healthcare-safe copy', detail: 'No fake results or banned claims' },
  { title: 'Clinics worldwide', detail: 'Campaigns in any country' },
  { title: 'Google, Meta & TikTok', detail: 'The channels patients actually use' },
  { title: 'Treatment-level ads', detail: 'Acne, laser, hair, cosmetic — separate' },
  { title: 'Call & WhatsApp tracking', detail: 'Know which ad booked the consult' },
  { title: '20+ years in paid media', detail: 'Umer Khan leads the work' },
  { title: 'No lock-in to start', detail: 'Free audit. 90-day plan if we work' },
  { title: '90-day roadmap', detail: 'Clear milestones, not an open retainer' },
];

const journey = [
  { n: '1', title: 'Searches', body: '“dermatologist near me” or “acne clinic + city”' },
  { n: '2', title: 'Compares 3 clinics', body: 'Map pack, reviews, photos, ads' },
  { n: '3', title: 'Checks your site', body: 'Treatments, downtime, from-price, doctor' },
  { n: '4', title: 'WhatsApp or call', body: 'They want a slot this week' },
  { n: '5', title: 'Books the consult', body: 'Only if follow-up is fast' },
];

const treatments = [
  {
    title: 'Acne & scarring',
    query: 'acne treatment + city',
    body: 'Own the high-intent acne searches. Separate scarring content from active-acne so the right patient lands on the right page.',
  },
  {
    title: 'Laser & pigmentation',
    query: 'laser pigmentation + city',
    body: 'Device treatments need honest downtime copy. We structure ads around the concern, not banned brand claims.',
  },
  {
    title: 'Hair loss',
    query: 'hair loss clinic + city',
    body: 'Long research cycle. We capture “near me” plus education pages so you stay in the shortlist.',
  },
  {
    title: 'Injectables & cosmetic',
    query: 'botox / filler + city',
    body: 'Tight compliance. We advertise the consult and the concern — not prescription product names where rules forbid it.',
  },
];

const playbook = [
  {
    icon: Megaphone,
    step: 'Ads',
    title: 'Google, Meta & TikTok',
    body: 'Search for people ready to book. Meta and TikTok for visual treatments. Each campaign maps to one treatment, not a mixed clinic budget.',
  },
  {
    icon: Search,
    step: 'SEO',
    title: 'Rank for treatment + concern + city',
    body: 'Pages for acne, pigmentation, laser, and cosmetic consults so organic covers the same language ads buy.',
  },
  {
    icon: Globe,
    step: 'Website',
    title: 'A clinic site that books',
    body: 'Treatment pages, from-pricing, doctor trust, WhatsApp and a consult form. Built for ads — not a brochure.',
  },
  {
    icon: Code2,
    step: 'Software',
    title: 'Booking that does not leak',
    body: 'Forms, WhatsApp routing, and CRM follow-up so leads do not sit unread after hours.',
  },
];

const plans = [
  {
    name: 'Launch',
    price: '$500',
    period: '/month',
    description: 'One clinic, one platform. For practices starting paid acquisition.',
    features: [
      'Google or Meta',
      'Treatment campaign build',
      'Conversion tracking',
      'Monthly reporting',
    ],
  },
  {
    name: 'Growth',
    price: '$1,000',
    period: '/month',
    popular: true,
    description: 'Google + Meta, plus landing pages for the treatments you want to fill.',
    features: [
      'Google + Meta',
      'Treatment landing pages',
      'Call / WhatsApp tracking',
      'Bi-weekly optimisation',
    ],
  },
  {
    name: 'Scale',
    price: '$1,500',
    period: '/month',
    description: 'Ads, SEO, website, and booking stack for clinics that want the full system.',
    features: [
      'Google, Meta, TikTok as needed',
      'SEO + clinic website work',
      'Booking / CRM setup',
      'Dedicated account lead',
    ],
  },
];

const days = [
  {
    when: 'Days 1–14',
    title: 'Audit and baseline',
    body: 'We map ads, rankings, Google profile, site, and where enquiries leak. You get the numbers before we change spend.',
  },
  {
    when: 'Days 15–30',
    title: 'Fix the foundations',
    body: 'Tracking, treatment pages, and profile. No traffic until the booking path can convert.',
  },
  {
    when: 'Days 31–60',
    title: 'Go live',
    body: 'Campaigns live by treatment. First month of call and form data. We see what actually books.',
  },
  {
    when: 'Days 61–90',
    title: 'Optimise, then scale',
    body: 'Cut waste, put budget on treatments that book, make ads + SEO a weekly rhythm.',
  },
];

const faqs = [
  {
    q: 'Do you only run ads?',
    a: 'No. Ads fill the diary fastest. We also build clinic websites, SEO, Google Business Profiles, and booking software when those are why patients drop off.',
  },
  {
    q: 'Can you work with our current website?',
    a: 'Yes. We often start by fixing tracking and the treatment pages ads send people to. If the site cannot convert, we rebuild it.',
  },
  {
    q: 'Is the USD price the full cost?',
    a: 'That is our monthly management retainer. Ad spend is paid to Google, Meta, or TikTok on top. We work with clinics worldwide.',
  },
  {
    q: 'How do you advertise injectables without breaking the rules?',
    a: 'We do not invent clinical results. Copy stays on the consult, the concern, and what the clinic is allowed to say in your market. No fake before/after in ads.',
  },
  {
    q: 'How soon should we expect booked consults?',
    a: 'Most clinics see cleaner enquiry flow within 30–45 days after tracking, keywords, and landing paths are corrected. Speed depends on budget and how fast pages go live.',
  },
  {
    q: 'Is there a long contract?',
    a: 'The audit is free. If we work together, we agree a 90-day plan first — not an open retainer with no milestones.',
  },
];

function AuditCard() {
  return (
    <div
      id="audit-form"
      className="rounded-3xl border border-primary/30 bg-card p-6 shadow-[0_0_40px_rgba(0,102,204,0.14)] md:p-8"
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">Free 20-minute audit</p>
      <h2 className="mb-1 text-xl font-bold text-foreground">See the 3 searches stealing your patients</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Name, email, WhatsApp. We reply in one business day with what to fix first.
      </p>
      <Suspense fallback={<div className="h-[280px] animate-pulse rounded-xl bg-muted/40" />}>
        <LeadForm
          variant="audit"
          source="industry"
          submitLabel="Show me the 3 searches"
          whatsAppSubmit
          compact
        />
      </Suspense>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {siteConfig.contact.phonePrimary} · {siteConfig.contact.phoneSecondary}
      </p>
    </div>
  );
}

export default function DermatologistLandingPage() {
  return (
    <CityPreviewProvider>
      <section className="relative overflow-hidden bg-background pb-16 pt-10 md:pb-20 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[-6rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
            <LoadGroup className="lg:col-span-6">
              <LoadItem
                y={24}
                className="mb-6 inline-flex items-center rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                For dermatologists &amp; aesthetic clinics
              </LoadItem>

              <LoadItem
                as="h1"
                y={24}
                className="mb-6 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-[2.75rem]"
              >
                We’ll show you the 3 searches sending your dermatology patients to other clinics.
              </LoadItem>

              <LoadItem
                as="p"
                y={24}
                className="mb-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                In 20 minutes we pull up your city on Google, Meta and TikTok — then tell you
                exactly what’s leaking bookings. No fake ROAS. No pitch deck.
              </LoadItem>

              <LoadItem as="ul" className="mb-8 space-y-2">
                {[
                  'Live look at the searches filling competitors’ chairs',
                  'What to fix in ads, the Google listing, and your site',
                  'Talk to Umer Khan — Google Premier Partner, 20+ years',
                ].map((item) => (
                  <li key={item} className="flex items-start text-sm text-foreground/90">
                    <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </LoadItem>
            </LoadGroup>

            <LoadFade delay={0.12} className="lg:col-span-6 lg:sticky lg:top-24">
              <AuditCard />
            </LoadFade>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-primary">
            Why clinics trust Xpert PPC
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {trustHero.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-primary/15 bg-background px-4 py-3 text-center"
              >
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-primary">
            Real Google Ads results — not a demo
          </p>
          <h2 className="mb-3 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            A clinic account we actually ran
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            This is dental and physiotherapy — not dermatology. We show it because we will not
            fake skin-clinic numbers. Same playbook: local intent, tracking, booked visits.
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: '33', label: 'Booked-intent leads in one month' },
              { value: '$41.98', label: 'Cost per conversion on Google Ads' },
              { value: 'Dental + physio', label: 'The actual clinic types in this account' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-primary/20 bg-card p-5 text-center"
              >
                <p className="text-2xl font-extrabold text-primary">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            <Link
              href="/case-study/dental-physiotherapy-clinics"
              className="font-semibold text-primary hover:underline"
            >
              Read that Google Ads case study
            </Link>
          </p>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            How the ads look on Google and social
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Search captures people ready to book. Meta and TikTok capture treatment demand
            before they type. Illustrations — not live client ads.
          </p>
          <AdPreviews />
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
              See what a patient sees
            </p>
            <h2 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Type a city. Watch the search.
            </h2>
            <p className="text-muted-foreground">
              Patients type a treatment plus a location. The clinics in the top three get the
              call. Toggle unmanaged vs managed.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <SearchPreview />
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            How a patient decides
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            We design ads, pages, and follow-up around this path — not around vanity traffic.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((item) => (
              <RevealItem
                key={item.n}
                className="rounded-2xl border border-primary/20 bg-background p-5"
              >
                <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.n}
                </span>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                After they click
              </p>
              <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                Ranking is useless if the site cannot book
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                We build clinic websites around treatments patients search — with WhatsApp and a
                consult form on every page.
              </p>
              <a
                href="#audit-form"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                Get a free audit
              </a>
            </div>
            <div className="lg:col-span-7">
              <ClinicWebsitePreview />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            Campaigns by treatment — not one mixed clinic budget
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Acne money should not pay for cosmetic clicks. Each line has its own ads and page.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {treatments.map((item) => (
              <RevealItem
                key={item.title}
                className="rounded-2xl border border-primary/20 bg-background p-6"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.query}</p>
                <h3 className="mt-2 mb-2 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Complete services
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-5xl">
              Ads, SEO, website, and software
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for dermatology clinics. Traffic from Meta, Google, and TikTok lands on a
              page that can book.
            </p>
          </div>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {playbook.map((item) => (
              <RevealItem
                key={item.title}
                className="rounded-2xl border border-primary/20 bg-card p-6 sm:p-8"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                  {item.step}
                </p>
                <item.icon className="mb-4 h-7 w-7 text-primary" />
                <h3 className="mb-2 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            Transparent retainers (USD)
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Monthly management fee. Ad spend is paid to Google, Meta, or TikTok on top. We work
            with dermatology clinics worldwide.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <RevealItem
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  plan.popular
                    ? 'border-primary bg-background shadow-[0_0_40px_rgba(0,102,204,0.12)]'
                    : 'border-primary/20 bg-background'
                }`}
              >
                {plan.popular ? (
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    Most clinics start here
                  </p>
                ) : (
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </p>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-3 text-3xl font-extrabold text-foreground">
                  {plan.price}
                  <span className="text-base font-semibold text-muted-foreground">{plan.period}</span>
                </p>
                <p className="mt-2 mb-5 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start text-sm text-foreground/90">
                      <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#audit-form"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Get a free audit
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-foreground md:text-4xl">
            Your first 90 days
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            No guesswork. This is the order we work in for dermatology clinics.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {days.map((item) => (
              <RevealItem
                key={item.when}
                className="rounded-2xl border border-primary/20 bg-card p-6"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.when}</p>
                <h3 className="mt-2 mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="overflow-hidden border-y border-primary/10 bg-card py-8 md:py-10">
        <p className="mb-5 text-center text-xs font-bold uppercase tracking-wider text-primary">
          Also in the work
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent" />
          <div className="trust-marquee-track flex w-max gap-3 pr-3">
            {[...trust, ...trust].map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className="w-[220px] shrink-0 rounded-xl border border-primary/15 bg-background px-4 py-3"
              >
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-full border border-primary/20 bg-card lg:mx-0">
                <Image
                  src={umerKhan.photo}
                  alt={`${umerKhan.name}, ${umerKhan.role} at Xpert PPC`}
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
                Who you talk to
              </p>
              <h2 className="mb-2 text-3xl font-extrabold text-foreground">{umerKhan.name}</h2>
              <p className="mb-4 font-semibold text-primary">{umerKhan.role} · Xpert PPC</p>
              <p className="mb-6 max-w-2xl leading-relaxed text-muted-foreground">
                {umerKhan.bio}
              </p>
              <ul className="mb-6 space-y-2">
                {['Google Premier Partner Certified', 'Meta Blueprint Certified', '20+ years in performance marketing'].map(
                  (item) => (
                    <li key={item} className="flex items-start text-sm text-foreground/90">
                      <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <a
                href="#audit-form"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                Book an audit with the team
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6">
            <h2 className="mb-3 text-xl font-extrabold text-foreground">Healthcare-safe marketing</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We do not invent clinical outcomes, harvest patient photos for ads, or ask your
              clinic to over-claim. Copy is written for dermatology: consult-first, concern-based,
              and aligned with what you can legally say in your market.
            </p>
          </div>
          <Reveal
            as="h2"
            y={14}
            className="mb-8 text-center text-3xl font-extrabold text-foreground md:text-4xl"
          >
            Questions dermatology clinics ask
          </Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="px-5 text-left font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-card py-16 md:pb-32 md:pt-24 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Ready to see the 3 searches?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Use the form at the top. Takes under a minute.
            </p>
            <a
              href="#audit-form"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Go to the free audit
            </a>
          </div>
        </div>
      </section>

      <StickyLpCta />
    </CityPreviewProvider>
  );
}
