import type { Metadata } from 'next';
import { Libre_Baskerville, Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import { Suspense } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  KeyRound,
  MapPin,
  Megaphone,
  MessageCircle,
  Search,
  Target,
} from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import { LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const display = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-property-display',
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-property-body',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata({
  title: 'Marketing for Property Dealers & Real Estate Agents | Xpert PPC',
  description:
    'Get more serious property inquiries and site visits for your real estate business with Google Ads, Meta Ads, landing pages, local search, and conversion tracking.',
  path: '/lp/property-dealer',
  image: '/lp/property-dealer/lp-property-hero.png',
  keywords: [
    'property dealer marketing',
    'real estate ads',
    'real estate Google Ads',
    'property marketing agency',
    'real estate Meta ads',
  ],
});

const WHATSAPP = siteConfig.contact.whatsapp;
const INK = '#071428';
const GOLD = '#C9A227';
const PAPER = '#F7F5F0';

const listings = [
  {
    title: 'Residential Plots',
    tag: 'For Sale',
    price: 'PKR 85 Lac',
    area: 'DHA Phase 6, Lahore',
    beds: null as number | null,
    baths: null as number | null,
    body: 'Buyers and investors hunting plots and new phases.',
    image: '/lp/property-dealer/lp-property-plots.png',
  },
  {
    title: 'Houses & Villas',
    tag: 'For Sale',
    price: 'PKR 3.2 Crore',
    area: 'Bahria Town, Karachi',
    beds: 5,
    baths: 4,
    body: 'Families ready to book a site visit this week.',
    image: '/lp/property-dealer/lp-property-house.png',
  },
  {
    title: 'Apartments & Flats',
    tag: 'For Rent',
    price: 'PKR 65,000/mo',
    area: 'Gulberg, Lahore',
    beds: 2,
    baths: 2,
    body: 'Renters and first-time buyers searching nearby.',
    image: '/lp/property-dealer/lp-property-apartment.png',
  },
  {
    title: 'Commercial Property',
    tag: 'For Sale',
    price: 'PKR 1.8 Crore',
    area: 'Blue Area, Islamabad',
    beds: null,
    baths: null,
    body: 'Offices, shops, and warehouses for serious tenants.',
    image: '/lp/property-dealer/lp-property-commercial.png',
  },
];

const pipeline = [
  {
    n: '01',
    icon: Megaphone,
    title: 'Listings go live on search & social',
    body: 'Google, Meta, and Maps campaigns built around your inventory and target societies.',
  },
  {
    n: '02',
    icon: MessageCircle,
    title: 'Serious buyers inquire',
    body: 'Calls, WhatsApp messages, and forms — every lead tagged to a campaign and listing type.',
  },
  {
    n: '03',
    icon: KeyRound,
    title: 'You book the site visit',
    body: 'Qualified inquiries hit your calendar ready to tour, negotiate, and close.',
  },
];

const services = [
  { n: '01', title: 'Google Ads', body: 'Capture plot, house, flat, and commercial searches in your exact areas.' },
  { n: '02', title: 'Meta Ads', body: 'Reach buyers and overseas investors before they open Google.' },
  { n: '03', title: 'Local SEO & Maps', body: 'Strengthen office and listing visibility where locals actually look.' },
  { n: '04', title: 'Listing Landing Pages', body: 'Pages built to turn browsers into site-visit requests.' },
  { n: '05', title: 'Conversion Tracking', body: 'Phone, WhatsApp, and form attribution on every rupee spent.' },
  { n: '06', title: 'Launch & Investor Campaigns', body: 'Demand generation for new phases and overseas buyers.' },
];

function FormCard({ id = 'audit-form' }: { id?: string }) {
  return (
    <div
      id={id}
      className="scroll-mt-28 border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(7,20,40,0.35)] sm:p-7"
    >
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
        Free property marketing audit
      </p>
      <h2 className={`${display.className} mb-5 text-2xl font-bold`} style={{ color: INK }}>
        Get more serious inquiries
      </h2>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-slate-100" />}>
        <LeadForm
          variant="audit"
          source="lp-property"
          compact
          submitLabel="Get My Free Audit"
          className="[&_button]:rounded-none [&_button]:bg-[#071428] [&_button]:hover:bg-[#0d2248]"
        />
      </Suspense>
    </div>
  );
}

export default function PropertyDealerLpPage() {
  return (
    <div className={`lp-light -mt-20 ${body.className} ${display.variable} ${body.variable} bg-white text-slate-800`}>
      {/* Hero — full-bleed estate photography */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="/lp/property-dealer/lp-property-hero.png"
          alt="Modern villa exterior at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(7,20,40,0.97) 0%, rgba(7,20,40,0.88) 42%, rgba(7,20,40,0.55) 70%, rgba(7,20,40,0.35) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071428] via-transparent to-[#071428]/50" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-8">
          <LoadGroup className="max-w-2xl">
            <LoadItem>
              <p
                className={`${display.className} mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl`}
              >
                Xpert<span style={{ color: GOLD }}>PPC</span>
              </p>
            </LoadItem>
            <LoadItem>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                Real estate &amp; property dealer growth
              </p>
            </LoadItem>
            <LoadItem as="h1" y={20}>
              <span
                className={`${display.className} mb-5 block text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl`}
              >
                More site visits.
                <br />
                Fewer tyre-kickers.
              </span>
            </LoadItem>
            <LoadItem as="p">
              <span className="mb-8 block max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
                Ads, listing pages, and tracking built so serious buyers and investors find your
                inventory — and book a visit.
              </span>
            </LoadItem>
            <LoadItem>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#audit-form"
                  className="inline-flex h-12 items-center justify-center gap-2 px-7 text-sm font-bold text-[#071428] transition-transform duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: GOLD }}
                >
                  Get a free property audit <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center border-2 border-white/70 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  WhatsApp strategy call
                </a>
              </div>
            </LoadItem>
          </LoadGroup>
        </div>
      </section>

      {/* Inventory board — grid on desktop, swipe on mobile */}
      <section className="border-b border-slate-200 py-16 sm:py-20" style={{ backgroundColor: PAPER }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <h2 className={`${display.className} text-3xl font-bold sm:text-4xl`} style={{ color: INK }}>
                Campaigns shaped around what you sell
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                Illustrative inventory types — not live listings. Targeting and creatives change with
                the asset.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600 lg:hidden">
              Swipe the board →
            </Reveal>
          </div>
          <RevealGroup
            className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
            stagger={0.08}
          >
            {listings.map((l) => (
              <RevealItem key={l.title} y={20} className="w-[78vw] max-w-[300px] shrink-0 sm:w-auto sm:max-w-none">
                <article className="h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative h-44">
                    <Image
                      src={l.image}
                      alt={l.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 78vw"
                      className="object-cover"
                    />
                    <span
                      className="absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: l.tag === 'For Rent' ? '#0f766e' : INK }}
                    >
                      {l.tag}
                    </span>
                  </div>
                  <div className="border-t-2 p-4" style={{ borderColor: GOLD }}>
                    <p className={`${display.className} text-lg font-bold`} style={{ color: INK }}>
                      {l.price}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {l.area}
                    </p>
                    {l.beds ? (
                      <div className="mt-2 flex gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5" /> {l.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" /> {l.baths}
                        </span>
                      </div>
                    ) : null}
                    <h3 className="mt-3 text-sm font-bold text-slate-800">{l.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{l.body}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Split pain — editorial, not card grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <Reveal x={-18}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              The real estate marketing gap
            </p>
            <h2 className={`${display.className} text-3xl font-bold leading-tight sm:text-4xl`} style={{ color: INK }}>
              Great inventory.
              <br />
              Invisible online.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Most dealers post on portals and boost a few photos. Serious buyers still search Google,
              scroll Instagram, and never see your best listings.
            </p>
          </Reveal>
          <RevealGroup className="space-y-0 border-l-2 border-slate-200" stagger={0.1}>
            {[
              {
                title: 'Portal posts without paid reach',
                body: 'Your listing competes with thousands — and dies on page three.',
              },
              {
                title: 'Boosted posts without tracking',
                body: 'You get likes. You don’t know which ad booked a site visit.',
              },
              {
                title: 'No page built to convert',
                body: 'Traffic lands on a WhatsApp number buried in a screenshot.',
              },
              {
                title: 'Tyre-kickers flooding the phone',
                body: 'Budget goes to curiosity clicks instead of buyers ready to tour.',
              },
            ].map((item) => (
              <RevealItem key={item.title} y={16} className="border-b border-slate-100 py-5 pl-6 last:border-b-0">
                <h3 className="mb-1 text-base font-bold" style={{ color: INK }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Vertical deal pipeline */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className={`${display.className} mb-12 text-center text-3xl font-bold text-white sm:text-4xl`}>
            From click to keys
          </Reveal>
          <RevealGroup className="relative space-y-0" stagger={0.12}>
            <div
              className="absolute bottom-8 left-[1.65rem] top-8 w-px sm:left-[1.9rem]"
              style={{ background: `linear-gradient(${GOLD}, transparent)` }}
            />
            {pipeline.map((s, i) => (
              <RevealItem key={s.n} y={22} className="relative flex gap-5 pb-10 last:pb-0">
                <span
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center text-white"
                  style={{ backgroundColor: GOLD, color: INK }}
                >
                  <s.icon className="h-6 w-6" />
                </span>
                <div className="pt-1">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                    Step {s.n}
                  </p>
                  <h3 className={`${display.className} mb-2 text-xl font-bold text-white`}>{s.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-white/65">{s.body}</p>
                  {i < pipeline.length - 1 ? (
                    <ArrowDown className="mt-4 h-4 w-4 opacity-40" style={{ color: GOLD }} />
                  ) : null}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Services — numbered editorial list, not icon cards */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 max-w-xl">
            <h2 className={`${display.className} text-3xl font-bold sm:text-4xl`} style={{ color: INK }}>
              What we run for dealers &amp; agencies
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-0 border-t border-slate-200 sm:grid-cols-2" stagger={0.06}>
            {services.map((s) => (
              <RevealItem
                key={s.n}
                y={16}
                className="group flex gap-4 border-b border-slate-200 px-1 py-6 transition-colors hover:bg-[#F7F5F0]/80 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"
              >
                <span className={`${display.className} text-2xl font-bold`} style={{ color: GOLD }}>
                  {s.n}
                </span>
                <div>
                  <h3 className="mb-1 text-lg font-bold" style={{ color: INK }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Google — full-width search stage */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: PAPER }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 max-w-2xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Google Ads
            </p>
            <h2 className={`${display.className} text-3xl font-bold sm:text-4xl`} style={{ color: INK }}>
              Be the listing they find when intent peaks
            </h2>
            <p className="mt-3 text-base text-slate-600">
              High-intent queries — plots near me, house for sale in DHA, commercial shop for rent —
              routed to pages that ask for a site visit.
            </p>
          </Reveal>
          <Reveal y={18} className="mx-auto max-w-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
            <div className="mb-4 flex items-center gap-1.5 text-xl font-bold">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
            <div className="mb-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
              <Search className="h-4 w-4" /> plots for sale near me
            </div>
            <div className="border border-slate-200 p-4">
              <p className="mb-1 text-[11px] font-semibold uppercase text-slate-400">Sponsored</p>
              <p className="text-lg font-bold text-[#1a0dab]">
                Prime Estates | Verified Listings &amp; Site Visits
              </p>
              <p className="text-xs text-emerald-700">www.primeestates.example/listings</p>
              <p className="mt-2 text-sm text-slate-600">
                Residential &amp; commercial plots, houses &amp; apartments. Book a free site visit today.
              </p>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                'Society & phase-level targeting',
                'Call & WhatsApp tracking',
                'Listing-type campaigns',
                'Maps + search coverage',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Meta — dark, phone-forward */}
      <section className="overflow-hidden py-16 sm:py-20" style={{ backgroundColor: INK }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <Reveal x={-16}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Meta Ads
            </p>
            <h2 className={`${display.className} mb-4 text-3xl font-bold text-white sm:text-4xl`}>
              Put the property in their feed before they search
            </h2>
            <p className="mb-6 max-w-lg text-base leading-relaxed text-white/65">
              Visual creatives for launches, plots, and premium homes — plus remarketing for anyone
              who browsed and didn’t inquire.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Lookalike buyers', 'Overseas investors', 'Remarketing', 'Site-visit CTA'].map((t) => (
                <span
                  key={t}
                  className="border px-3 py-1.5 text-xs font-bold text-white/80"
                  style={{ borderColor: `${GOLD}66` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal x={16} delay={0.1} className="mx-auto w-full max-w-[260px]">
            <div className="rounded-[2.4rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl">
              <div className="overflow-hidden rounded-[1.7rem] bg-white">
                <div className="flex items-center gap-2 border-b border-slate-100 px-3 pb-2 pt-6">
                  <span className="h-7 w-7 rounded-full" style={{ backgroundColor: `${GOLD}44` }} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Prime Estates</p>
                    <p className="text-[10px] text-slate-400">Sponsored</p>
                  </div>
                </div>
                <div className="relative h-52 bg-slate-100">
                  <Image
                    src="/lp/property-dealer/lp-property-meta-ad.png"
                    alt="Villa exterior Meta ad creative"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-[11px] text-slate-700">
                    New residential plots — limited units. Book a visit this week.
                  </p>
                  <button
                    type="button"
                    className="h-8 w-full text-[11px] font-bold text-[#071428]"
                    style={{ backgroundColor: GOLD }}
                  >
                    Book Site Visit
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <Image
          src="/lp/property-dealer/lp-property-house.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0" style={{ backgroundColor: `${INK}f2` }} />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-16}>
            <Target className="mb-4 h-8 w-8" style={{ color: GOLD }} />
            <h2 className={`${display.className} mb-4 text-3xl font-bold text-white sm:text-4xl`}>
              Ready for more serious property inquiries?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-white/90">
              Tell us about your listings and target areas. We’ll review ads, landing pages, and
              tracking — then show where the next buyers can come from.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center border-2 border-white/70 bg-white/10 px-6 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              Or message us on WhatsApp
            </a>
          </Reveal>
          <Reveal x={16} delay={0.1} scale={0.98}>
            <FormCard />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
