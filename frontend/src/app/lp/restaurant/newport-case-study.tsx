import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion';

const saffron = '#F5A524';
const charcoal = '#0E0E0E';

const challenges = [
  ['01', 'Hard to find online', 'The restaurant had a weak local presence. Its Google Business Profile, website, and local listings needed attention.'],
  ['02', 'No active ad campaigns', 'No campaigns were running when we started. The account needed a plan for food, bookings, private dining, and events.'],
  ['03', 'Pages needed a local focus', 'Website content, titles, headings, and descriptions needed to better match cuisine and Newport Beach searches.'],
  ['04', 'No website tracking setup', 'Tagging, conversion tracking, and Google Analytics 4 were needed to measure website activity and customer actions.'],
  ['05', 'Connect marketing with bookings', 'The work needed to cover ordering, OpenTable, reservation forms, and enquiries for family and graduation events.'],
  ['06', 'Make results easy to review', 'A simple Looker Studio report gave the owner a clearer way to review the marketing results.'],
] as const;

const actions = [
  ['Improved local SEO and the Google Business Profile', 'We checked the website, Google Business Profile, and local listings, improving name, address, phone, and citation consistency.'],
  ['Researched local searches and improved website content', 'We researched cuisine and Newport Beach search terms, then improved page content, titles, headings, and search descriptions.'],
  ['Launched locally targeted Google and Bing ads', 'We built campaigns around search terms, local targeting, and messages for orders, reservations, private dining, and events.'],
  ['Ran Facebook and Instagram campaigns', 'Social campaigns built interest in dining and event options, with YouTube included in the wider marketing work.'],
  ['Added tracking and a clear owner report', 'Google Analytics 4, website tags, conversion tracking, and Looker Studio brought activity and customer actions into view.'],
  ['Supported the website, ordering, and reservations', 'Landing-page recommendations, order management, OpenTable integration, and reservation forms made the next step clearer.'],
] as const;

const performance = [
  ['Actions recorded by Google Ads', '2,398.56'],
  ['Average ad cost for each recorded action', '$28.06'],
  ['Clicks on the ads', '37,912'],
  ['Times the ads were shown', '635,655'],
  ['Share of ad views that led to a click', '5.96%'],
  ['Total Google Ads spend', '$67,303 USD'],
] as const;

const goals = [
  'Ordering food online',
  'Booking a table',
  'Planning a dine-in visit',
  'Asking about private dining',
  'Booking family gatherings and graduation parties',
] as const;

const services = [
  'Local SEO and keyword research', 'Google Business Profile optimization',
  'Website and local listing checks', 'Business detail and citation cleanup',
  'Website content, page titles, and headings', 'Google Ads and Bing Ads management',
  'Facebook and Instagram campaigns', 'YouTube marketing',
  'Google Analytics 4 and website tagging', 'Conversion tracking setup',
  'Looker Studio reporting', 'Landing page recommendations',
  'Order management support', 'OpenTable integration and reservation forms',
  'Private dining and event promotion', 'Ongoing account reviews and support',
];

export function NewportCaseStudy() {
  return (
    <section id="case-study" className="bg-[#0E0E0E] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: saffron }}>Restaurant case study</p>
          <h2 className="restaurant-display text-4xl tracking-wide sm:text-6xl">Newport Beach restaurant growth, reported clearly</h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">A local restaurant wanted more people to find it online, order food, book tables, and enquire about private dining and events. Xpert PPC supported the restaurant for about four years.</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/50">Restaurant name kept private · Newport Beach, California · One-month growth comparison</p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {[
            ['+45%', 'Estimated overall order growth', 'One month'],
            ['+55%', 'Reported website traffic growth', 'One month'],
            ['2,399', 'Google Ads actions', 'June 2025–October 2026; rounded'],
            ['$28.06', 'Cost per recorded action', 'Google Ads reporting period'],
          ].map(([value, label, note]) => (
            <RevealItem key={label} y={14} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: saffron }}>{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/75">{label}</p>
              <p className="mt-2 text-xs text-white/45">{note}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: saffron }}>About the project</p>
            <h3 className="restaurant-display text-4xl tracking-wide">A local restaurant with room to grow</h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-base leading-relaxed text-white/75">The restaurant wanted more orders and bookings, including private dining, family gatherings, graduation parties, and groups. The work covered search engines, paid ads, social media, the website, booking tools, tracking, and reporting.</p>
            <div className="mt-5 grid gap-3 text-sm text-white/65 sm:grid-cols-2">
              {['Main goals: orders, table bookings, private dining, and events', 'Our role: local SEO, paid ads, social media, tracking, reporting, and booking support'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">{item}</div>)}
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal className="mb-8"><h3 className="restaurant-display text-4xl tracking-wide sm:text-5xl">The challenges</h3><p className="mt-3 max-w-2xl text-white/60">The main areas that needed attention before the marketing could connect with orders and bookings.</p></Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {challenges.map(([number, title, body]) => <RevealItem key={number} y={14} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-sm font-bold" style={{ color: saffron }}>{number}</p><h4 className="mt-3 text-base font-bold">{title}</h4><p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p></RevealItem>)}
          </RevealGroup>
        </div>

        <div className="mt-20">
          <Reveal className="mb-8"><h3 className="restaurant-display text-4xl tracking-wide sm:text-5xl">What we did</h3><p className="mt-3 max-w-2xl text-white/60">A connected plan across search, ads, social media, tracking, reporting, ordering, and reservations.</p></Reveal>
          <RevealGroup className="grid gap-3 md:grid-cols-2" stagger={0.05}>
            {actions.map(([title, body], i) => <RevealItem key={title} y={14} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="shrink-0 text-2xl font-bold" style={{ color: saffron }}>{String(i + 1).padStart(2, '0')}</span><div><h4 className="font-bold">{title}</h4><p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p></div></RevealItem>)}
          </RevealGroup>
        </div>

        <div className="mt-20">
          <Reveal><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: saffron }}>The results</p><h3 className="restaurant-display text-4xl tracking-wide sm:text-5xl">Estimated 45% more orders and 55% more website traffic</h3><p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">The restaurant reported this growth over one month. Order growth is an estimate based on management-reported performance and reflects wider marketing work across several channels.</p></Reveal>
          <Reveal className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="border-b border-white/10 px-5 py-4"><p className="font-bold">Google Ads results over the longer reporting period</p><p className="mt-1 text-xs text-white/50">June 1, 2025–October 31, 2026</p></div>
            <div className="divide-y divide-white/10">{performance.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 px-5 py-4 text-sm"><span className="text-white/65">{label}</span><strong className="text-right" style={{ color: saffron }}>{value}</strong></div>)}</div>
            <p className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-white/50">Google Ads calls these actions “conversions.” They are not an equal number of completed orders or confirmed bookings. Google can share credit for an action across several ad clicks, which is why the total includes decimals.</p>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['/case-studies/newport-beach-restaurant/account-overview.jpg', 'Redacted reporting overview from the supplied account view.'],
              ['/case-studies/newport-beach-restaurant/campaign-table.jpg', 'Redacted campaign performance table from the supplied reporting screenshots.'],
            ].map(([src, caption]) => <Reveal key={src} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"><div className="relative aspect-[16/9] bg-black"><Image src={src} alt={caption} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" /></div><p className="p-4 text-xs leading-relaxed text-white/55">{caption} Headline figures above use the supplied reporting period and should not be read as completed orders or bookings.</p></Reveal>)}
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: saffron }}>Beyond advertising</p>
            <h3 className="restaurant-display text-4xl tracking-wide">Support from the first search to the booking</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">The website, order process, and booking tools also need attention. The work covered everyday orders and table reservations, plus private dining and special occasions.</p>
          </Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.05}>
            {goals.map((goal) => <RevealItem key={goal} y={12} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: saffron }} />{goal}</RevealItem>)}
          </RevealGroup>
        </div>

        <div className="mt-20">
          <Reveal className="mb-8"><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: saffron }}>Services delivered</p><h3 className="restaurant-display text-4xl tracking-wide sm:text-5xl">The full scope of our work</h3></Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.03}>
            {services.map((service) => <RevealItem key={service} y={10} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: saffron }} />{service}</RevealItem>)}
          </RevealGroup>
        </div>

        <Reveal className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center"><a href="#audit-form" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold" style={{ backgroundColor: saffron, color: charcoal }}>Get a free restaurant marketing review</a><Link href="/case-study/newport-beach-restaurant" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-bold text-white hover:bg-white/10"><CheckCircle2 className="mr-2 h-4 w-4" /> Read the full case study</Link></Reveal>

        <Reveal className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-xs leading-relaxed text-white/55"><strong className="text-white/75">About these results:</strong> The one-month growth figures were reported by management. Order growth is estimated. Exact comparison dates and the traffic source breakdown were not provided. The Google Ads figures come from the supplied account screenshots. Business growth figures are not attributed to Google Ads alone. The restaurant name is kept private, and the header image is generic rather than a photograph of the client.</Reveal>

      </div>
    </section>
  );
}

export default NewportCaseStudy;
