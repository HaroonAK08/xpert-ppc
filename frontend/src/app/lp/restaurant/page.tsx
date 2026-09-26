import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import Image from 'next/image';
import { Suspense } from 'react';
import {
  CheckCircle2,
  Clock,
  Megaphone,
  MessageCircle,
  Phone,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-resto-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-resto-body',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata({
  title: 'Marketing for Restaurants & Fast Food Brands | Xpert PPC',
  description:
    'Get more table bookings, walk-ins, and online orders for your restaurant or fast food business with Google Ads, Meta Ads, local search, and conversion tracking.',
  path: '/lp/restaurant',
  image: '/lp/restaurant/lp-restaurant-hero.png',
  keywords: [
    'restaurant marketing',
    'fast food ads',
    'restaurant Google Ads',
    'food business marketing',
    'restaurant Meta ads',
  ],
});

const WHATSAPP = siteConfig.contact.whatsapp;
const CHAR = '#0E0E0E';
const SAFFRON = '#F5A524';
const SMOKE = '#161616';

const menuBoard = [
  'Fine Dining',
  'Fast Food',
  'Cafés',
  'BBQ & Grills',
  'Family Restaurants',
  'Cloud Kitchens',
  'Dessert Bars',
  'Delivery Brands',
];

const dishes = [
  {
    title: 'Fine Dining',
    body: 'Plated presentation and ambience that justify a premium check and a special-occasion booking.',
    image: '/lp/restaurant/lp-restaurant-fine.png',
  },
  {
    title: 'Fast Food & Quick Bites',
    body: 'High-intent near-me searches at peak hunger hours — built for volume, not just awareness.',
    image: '/lp/restaurant/lp-restaurant-burger.png',
  },
  {
    title: 'Family & Group Dining',
    body: 'Weekend offers and group deals that fill tables instead of two-seaters.',
    image: '/lp/restaurant/lp-restaurant-family.png',
  },
  {
    title: 'Delivery & Takeout',
    body: 'Direct orders through your own number and WhatsApp — not routed through an aggregator’s cut.',
    image: '/lp/restaurant/lp-restaurant-delivery.png',
  },
];

const peakHours = [
  { slot: '12–2 PM', label: 'Lunch rush', fill: '72%' },
  { slot: '4–6 PM', label: 'Snack window', fill: '38%' },
  { slot: '7–10 PM', label: 'Dinner peak', fill: '94%' },
  { slot: 'Late night', label: 'Delivery surge', fill: '61%' },
];

const services = [
  { title: 'Google Ads', body: 'Appear when hungry customers search cuisine, deals, or delivery nearby.' },
  { title: 'Facebook & Instagram Ads', body: 'Show dishes and offers to food lovers before they decide.' },
  { title: 'Local SEO & Maps', body: 'Rank higher where nearby diners look first.' },
  { title: 'Menu Landing Pages', body: 'Pages built to convert into reservations, calls, and orders.' },
  { title: 'Conversion Tracking', body: 'Track calls, WhatsApp orders, and forms from every campaign.' },
  { title: 'Offer Strategy', body: 'Combos and promos that fill empty covers and drive repeats.' },
];

function FormCard({ id = 'audit-form' }: { id?: string }) {
  return (
    <div
      id={id}
      className="scroll-mt-28 rounded-3xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-7"
    >
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: SAFFRON }}>
        Free restaurant audit
      </p>
      <h2 className={`${display.className} mb-1 text-3xl tracking-wide text-[#0E0E0E]`}>
        Fill more tables
      </h2>
      <p className="mb-5 text-sm text-neutral-500">Orders and bookings that skip the aggregator cut.</p>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-neutral-100" />}>
        <LeadForm
          variant="audit"
          source="lp-restaurant"
          compact
          submitLabel="Get My Free Audit"
          className="[&_button]:rounded-full [&_button]:bg-[#0E0E0E] [&_button]:hover:bg-[#2a2a2a]"
        />
      </Suspense>
    </div>
  );
}

export default function RestaurantLpPage() {
  return (
    <div className={`lp-light -mt-20 ${body.className} ${display.variable} ${body.variable} bg-[#0E0E0E] text-neutral-100`}>
      {/* Hero — food-first, no form */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="/lp/restaurant/lp-restaurant-hero.png"
          alt="Gourmet plated dish under warm restaurant light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-8">
          <LoadGroup className="max-w-2xl">
            <LoadItem>
              <p className={`${display.className} mb-3 text-5xl tracking-wide text-white sm:text-6xl`}>
                Xpert<span style={{ color: SAFFRON }}>PPC</span>
              </p>
            </LoadItem>
            <LoadItem>
              <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SAFFRON }}>
                <UtensilsCrossed className="h-3.5 w-3.5" /> Restaurants &amp; fast food brands
              </p>
            </LoadItem>
            <LoadItem as="h1" y={18}>
              <span className={`${display.className} mb-5 block text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl lg:text-7xl`}>
                Full tables.
                <br />
                Direct orders.
                <br />
                <span style={{ color: SAFFRON }}>No middleman tax.</span>
              </span>
            </LoadItem>
            <LoadItem as="p">
              <span className="mb-8 block max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                We turn nearby hunger into reservations, calls, and orders that land on your number —
                not an aggregator’s.
              </span>
            </LoadItem>
            <LoadItem>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#audit-form"
                  className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-[#0E0E0E] transition-transform duration-300 hover:scale-[1.03]"
                  style={{ backgroundColor: SAFFRON }}
                >
                  Get a free restaurant audit →
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white/70 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Book a strategy call
                </a>
              </div>
            </LoadItem>
          </LoadGroup>
        </div>
      </section>

      {/* Marquee menu board */}
      <section className="overflow-hidden border-y border-white/10 py-4" style={{ backgroundColor: SMOKE }}>
        <div className="flex animate-[lp-marquee_28s_linear_infinite] gap-8 whitespace-nowrap">
          {[...menuBoard, ...menuBoard].map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex items-center gap-8">
              <span className={`${display.className} text-2xl tracking-wide text-white/85`}>{item}</span>
              <span className="text-lg" style={{ color: SAFFRON }}>
                ·
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* Margin story — bold comparison bars */}
      <section className="bg-white py-16 text-neutral-900 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className={`${display.className} text-4xl tracking-wide sm:text-5xl`} style={{ color: CHAR }}>
              Stop tipping the delivery apps
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-neutral-600">
              Every aggregator order costs commission and hands them your customer. Direct ads flip that.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal x={-14}>
              <div className="h-full rounded-3xl bg-neutral-100 p-6 sm:p-8">
                <div className="mb-6 flex items-baseline justify-between">
                  <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">Via apps</p>
                  <p className={`${display.className} text-5xl text-neutral-400`}>−28%</p>
                </div>
                <div className="mb-6 h-3 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full w-[72%] rounded-full bg-neutral-400" />
                </div>
                <ul className="space-y-3">
                  {[
                    '20–30% commission every order',
                    'They own the customer data',
                    'No path to repeat business',
                    'Race to the bottom on price',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal x={14} delay={0.08}>
              <div
                className="h-full rounded-3xl p-6 sm:p-8"
                style={{ backgroundColor: CHAR, boxShadow: `0 0 0 2px ${SAFFRON}` }}
              >
                <div className="mb-6 flex items-baseline justify-between">
                  <p className="text-sm font-bold uppercase tracking-wide" style={{ color: SAFFRON }}>
                    Direct ads
                  </p>
                  <p className={`${display.className} text-5xl`} style={{ color: SAFFRON }}>
                    100%
                  </p>
                </div>
                <div className="mb-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full rounded-full" style={{ backgroundColor: SAFFRON }} />
                </div>
                <ul className="space-y-3">
                  {[
                    'Keep the full order value',
                    'Phone & WhatsApp stay yours',
                    'Retarget for the next offer',
                    'Win on experience, not discounts',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-medium text-white/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: SAFFRON }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dish features — large photo panels */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: CHAR }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 max-w-lg">
            <h2 className={`${display.className} text-4xl tracking-wide text-white sm:text-5xl`}>
              Built around what you serve
            </h2>
            <p className="mt-3 text-base text-white/55">
              Different kitchens convert differently. Campaigns and pages should match how diners decide.
            </p>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.1}>
            {dishes.map((d, i) => (
              <RevealItem key={d.title} y={24} className={i === 0 ? 'sm:col-span-2' : ''}>
                <article className={`group relative overflow-hidden rounded-3xl ${i === 0 ? 'min-h-[320px] sm:min-h-[380px]' : 'min-h-[280px]'}`}>
                  <Image
                    src={d.image}
                    alt={d.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className={`${display.className} text-3xl tracking-wide text-white`}>{d.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">{d.body}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Peak hours — unique restaurant angle */}
      <section className="bg-white py-16 text-neutral-900 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: SAFFRON }}>
                <Clock className="h-3.5 w-3.5" /> Peak hunger windows
              </p>
              <h2 className={`${display.className} text-4xl tracking-wide sm:text-5xl`} style={{ color: CHAR }}>
                Ads that fire when stomachs do
              </h2>
            </div>
            <p className="max-w-xs text-sm text-neutral-500">
              We schedule spend around lunch, dinner, and late-night delivery — not a flat daily drip.
            </p>
          </Reveal>
          <RevealGroup className="space-y-4" stagger={0.08}>
            {peakHours.map((h) => (
              <RevealItem key={h.slot} y={14}>
                <div className="grid items-center gap-3 sm:grid-cols-[120px_1fr_100px]">
                  <p className={`${display.className} text-2xl tracking-wide`} style={{ color: CHAR }}>
                    {h.slot}
                  </p>
                  <div className="h-10 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="flex h-full items-center rounded-full px-4 text-xs font-bold text-[#0E0E0E]"
                      style={{ width: h.fill, backgroundColor: SAFFRON }}
                    >
                      {h.label}
                    </div>
                  </div>
                  <p className="text-right text-sm font-bold text-neutral-400">{h.fill} intent</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How it works — ticket stubs */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: SMOKE }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className={`${display.className} mb-10 text-center text-4xl tracking-wide text-white sm:text-5xl`}>
            Order of operations
          </Reveal>
          <RevealGroup className="grid gap-4 md:grid-cols-3" stagger={0.1}>
            {[
              {
                icon: Megaphone,
                n: '01',
                title: 'We run the ads',
                body: 'Google, Meta, and Maps aimed at your menu, radius, and peak hours.',
              },
              {
                icon: MessageCircle,
                n: '02',
                title: 'They call or order',
                body: 'Every inquiry hits a page built to convert — no dead ends.',
              },
              {
                icon: Phone,
                n: '03',
                title: 'You get the customer',
                body: 'Tracked from click to cover or order so you know what paid off.',
              },
            ].map((s) => (
              <RevealItem key={s.n} y={20}>
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/20 bg-[#1a1a1a] p-6">
                  <span className={`${display.className} absolute -right-1 -top-2 text-7xl text-white/5`}>
                    {s.n}
                  </span>
                  <span
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: SAFFRON, color: CHAR }}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className={`${display.className} mb-2 text-2xl tracking-wide text-white`}>{s.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Services — receipt / ticket strip */}
      <section className="bg-white py-16 text-neutral-900 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 text-center">
            <h2 className={`${display.className} text-4xl tracking-wide sm:text-5xl`} style={{ color: CHAR }}>
              The kitchen ticket
            </h2>
            <p className="mt-2 text-sm text-neutral-500">Everything on the board to grow your restaurant online.</p>
          </Reveal>
          <Reveal
            y={16}
            className="overflow-hidden rounded-sm border border-neutral-200 bg-[#FAFAF8] font-mono shadow-lg"
          >
            <div className="border-b border-dashed border-neutral-300 px-5 py-4 text-center">
              <p className={`${display.className} text-2xl tracking-wide text-[#0E0E0E]`}>XpertPPC · Kitchen</p>
              <p className="text-[11px] text-neutral-400">*** OPEN TICKET ***</p>
            </div>
            <RevealGroup className="divide-y divide-dashed divide-neutral-200" stagger={0.05}>
              {services.map((s, i) => (
                <RevealItem key={s.title} y={10} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Item {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="text-sm font-bold text-neutral-900">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{s.body}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold" style={{ color: SAFFRON }}>
                    INCL
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="border-t border-dashed border-neutral-300 px-5 py-4 text-center text-[11px] text-neutral-400">
              Thank you — see you at service
            </div>
          </Reveal>
        </div>
      </section>

      {/* Google sequential */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: CHAR }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-16}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: SAFFRON }}>
              Google Ads
            </p>
            <h2 className={`${display.className} mb-4 text-4xl tracking-wide text-white sm:text-5xl`}>
              Show up when they&apos;re hungry now
            </h2>
            <p className="mb-6 text-base leading-relaxed text-white/60">
              “Fast food near me”, “BBQ delivery”, “family restaurant” — high-intent searches sent to a
              page that takes the order or books the table.
            </p>
            <ul className="space-y-2">
              {['Radius & Maps coverage', 'Cuisine & deal keywords', 'Call & WhatsApp tracking', 'Menu-level landing pages'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/75">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: SAFFRON }} />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
          <Reveal x={16} delay={0.08}>
            <div className="rounded-3xl bg-white p-5 text-neutral-900 shadow-2xl sm:p-6">
              <div className="mb-3 flex items-center gap-1 text-xl font-bold">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <div className="mb-3 flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-500">
                <Search className="h-4 w-4" /> fast food near me
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase text-neutral-400">Sponsored</p>
                <p className="text-lg font-bold text-[#1a0dab]">Grill House Diner | Order or Reserve Now</p>
                <p className="text-xs text-emerald-700">www.grillhouse.example/order</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Fresh, fast, and delivered hot. Family combos &amp; weekend offers.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meta */}
      <section className="bg-white py-16 text-neutral-900 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-16} className="order-2 mx-auto w-full max-w-[250px] lg:order-1">
            <div className="rounded-[2.4rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl">
              <div className="overflow-hidden rounded-[1.7rem] bg-white">
                <div className="flex items-center gap-2 border-b border-neutral-100 px-3 pb-2 pt-6">
                  <span className="h-7 w-7 rounded-full" style={{ backgroundColor: `${SAFFRON}55` }} />
                  <div>
                    <p className="text-[11px] font-bold text-neutral-800">Grill House Diner</p>
                    <p className="text-[10px] text-neutral-400">Sponsored</p>
                  </div>
                </div>
                <div className="relative h-52 bg-neutral-100">
                  <Image
                    src="/lp/restaurant/lp-restaurant-meta-ad.png"
                    alt="Food Meta ad creative"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-[11px] text-neutral-700">Weekend combo — 20% off. Order direct.</p>
                  <button
                    type="button"
                    className="h-8 w-full rounded-full text-[11px] font-bold text-[#0E0E0E]"
                    style={{ backgroundColor: SAFFRON }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal x={16} className="order-1 lg:order-2">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: SAFFRON }}>
              Meta Ads
            </p>
            <h2 className={`${display.className} mb-4 text-4xl tracking-wide sm:text-5xl`} style={{ color: CHAR }}>
              Make the dish unmissable
            </h2>
            <p className="mb-6 max-w-md text-base leading-relaxed text-neutral-600">
              Scroll-stopping food creatives, offer campaigns, and remarketing for anyone who visited
              but didn’t order.
            </p>
            <LoadFade>
              <div className="flex flex-wrap gap-2">
                {['Dish creatives', 'Offer ads', 'Lookalikes', 'Remarketing', 'Direct order'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-[#0E0E0E]"
                    style={{ backgroundColor: `${SAFFRON}33` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </LoadFade>
          </Reveal>
        </div>
      </section>

      {/* Final CTA — food photo back, text sits on a local scrim */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <Image
          src="/lp/restaurant/lp-restaurant-family.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal x={-16}>
            <div className="rounded-3xl bg-black/55 p-6 backdrop-blur-sm sm:p-8">
              <h2 className={`${display.className} mb-4 text-4xl tracking-wide text-white sm:text-5xl`}>
                Ready to fill more tables &amp; orders?
              </h2>
              <p className="mb-6 max-w-md text-base leading-relaxed text-white/95">
                Tell us about your restaurant or fast food brand. We’ll review ads, menu pages, and
                tracking — then show where the next customers can come from.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 px-6 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                Or message us on WhatsApp
              </a>
            </div>
          </Reveal>
          <Reveal x={16} delay={0.1} scale={0.98}>
            <FormCard />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
