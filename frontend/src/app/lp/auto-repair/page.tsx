import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import { Suspense } from 'react';
import {
  ArrowRight,
  BarChart3,
  BatteryCharging,
  CalendarCheck,
  CheckCircle2,
  Cog,
  Disc3,
  Gauge,
  MapPin,
  PhoneCall,
  Search,
  Settings2,
  Truck,
  Wrench,
} from 'lucide-react';

import { LeadForm } from '@/components/forms/lead-form';
import JsonLd from '@/components/seo/json-ld';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { buildMetadata, faqSchema, serviceSchema } from '@/lib/seo';

import heroImage from '../../../../public/lp/auto-repair/lp-auto-repair-hero.png';
import diagnosticsImage from '../../../../public/lp/auto-repair/lp-auto-repair-diagnostics.png';
import shopImage from '../../../../public/lp/auto-repair/lp-auto-repair-shop.png';
import googleAdsImage from '../../../../public/lp/auto-repair/google-ads-for-repair-demand.png';
import mapsImage from '../../../../public/lp/auto-repair/google-business-profile-and-maps.png';
import metaImage from '../../../../public/lp/auto-repair/meta-ads-and-social-media.png';
import landingImage from '../../../../public/lp/auto-repair/landing-pages-and-booking-paths.png';
import callsImage from '../../../../public/lp/auto-repair/call-tracking-and-reporting.png';
import reviewsImage from '../../../../public/lp/auto-repair/reviews-and-reputation.png';
import retentionImage from '../../../../public/lp/auto-repair/retention-and-reactivation.png';
import fleetImage from '../../../../public/lp/auto-repair/fleet-and-b2b-accounts.png';
import microsoftImage from '../../../../public/lp/auto-repair/microsoft-and-bing-ads.png';
import { AutoRepairStickyCta } from './sticky-cta';

const ORANGE = '#F36B2B';
const ORANGE_DARK = '#B94C1C';

export const metadata: Metadata = buildMetadata({
  title: 'Automotive Repair Marketing Agency | XpertPPC',
  description:
    'XpertPPC helps auto repair shops grow through Google Ads, local SEO, automotive landing pages, paid social campaigns, and conversion tracking.',
  path: '/lp/auto-repair',
  image: '/lp/auto-repair/lp-auto-repair-hero.png',
  keywords: [
    'automotive repair marketing agency',
    'auto repair digital marketing',
    'marketing for auto repair shops',
    'auto repair Google Ads',
    'automotive local SEO',
    'auto repair lead generation',
  ],
});

const faqs = [
  ['What does XpertPPC do for auto repair shops?', 'XpertPPC is a digital marketing agency that helps repair businesses get found, turn local demand into calls and enquiries, and understand which marketing activity creates opportunities.'],
  ['Do you work with independent mechanics and small repair businesses?', 'Yes. We work around the services, locations, capacity, and customer mix of independent shops, specialists, fleet operators, and multi-location businesses.'],
  ['Can you help generate more calls for specific repair services?', 'Yes. Campaigns and landing pages can be organized around services such as brakes, diagnostics, tires, transmission, AC, maintenance, and other priorities you want to grow.'],
  ['Do you manage Google Ads and Google Business Profile?', 'Those are both part of the possible growth system. The right scope depends on your current visibility, account setup, service area, and the opportunities found in the initial review.'],
  ['Do you build dedicated automotive landing pages?', 'Yes. We can build or improve service-focused pages that make the next step clear for visitors who are ready to call, request a quote, or ask for an appointment.'],
  ['How do you track calls and marketing performance?', 'Depending on your setup, we can track calls, click-to-call actions, forms, booking requests, answered and missed calls, and campaign-level sources in a reporting view.'],
  ['Do you offer services for multiple shop locations?', 'Yes. Multi-location work can include location-aware campaigns, profiles, landing pages, reporting, and a clear way to compare opportunities across shops.'],
  ['How do we get started?', 'Start with the audit form on this page. We will review your local demand, customer path, and measurement opportunities, then explain the next practical steps without promising a fixed outcome.'],
] as const;

type Service = {
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  image: StaticImageData;
  alt: string;
};

const services: Service[] = [
  { number: '01', title: 'Google Ads for repair demand', description: 'Show up when drivers search for brake repair, engine diagnostics, transmission service, AC repair, and mechanics near them.', capabilities: ['Search campaigns', 'Service-level targeting', 'Call extensions', 'Conversion tracking'], image: googleAdsImage, alt: 'Illustrative Google Ads campaign interface for auto repair demand' },
  { number: '02', title: 'Google Business Profile & local SEO', description: 'Improve how your repair business appears in local search and Google Maps when nearby drivers need your services.', capabilities: ['Profile optimization', 'Maps visibility', 'Service and location pages', 'Local citations'], image: mapsImage, alt: 'Illustrative Google Business Profile and local search view' },
  { number: '03', title: 'Meta ads & social campaigns', description: 'Reach local drivers with seasonal promotions, service reminders, targeted offers, and remarketing campaigns.', capabilities: ['Facebook advertising', 'Instagram advertising', 'Local audiences', 'Remarketing'], image: metaImage, alt: 'Illustrative social advertising campaign for a repair business' },
  { number: '04', title: 'Landing pages & booking paths', description: 'Turn interested visitors into calls, quote requests, and appointments through dedicated mobile-first experiences.', capabilities: ['Service landing pages', 'Quote request forms', 'Booking paths', 'Conversion optimization'], image: landingImage, alt: 'Illustrative mobile landing page and booking path' },
  { number: '05', title: 'Call tracking & reporting', description: 'Understand which campaigns generate calls, which calls get answered, and which activities create real opportunities.', capabilities: ['Call tracking', 'GA4', 'Conversion attribution', 'Performance reporting'], image: callsImage, alt: 'Illustrative call tracking and marketing reporting dashboard' },
  { number: '06', title: 'Reviews & reputation management', description: 'Build a consistent review-generation process that helps establish trust and supports local visibility.', capabilities: ['Review workflows', 'Response support', 'Reputation monitoring', 'Customer feedback'], image: reviewsImage, alt: 'Illustrative reputation and customer review workflow' },
  { number: '07', title: 'Customer retention & reactivation', description: 'Bring customers back through maintenance reminders, lapsed-customer campaigns, and targeted service offers.', capabilities: ['Customer reactivation', 'Service reminders', 'Segmentation', 'Repeat-visit campaigns'], image: retentionImage, alt: 'Illustrative customer retention campaign for an auto repair business' },
  { number: '08', title: 'Fleet & B2B lead generation', description: 'Reach commercial accounts, fleet operators, and businesses that need recurring vehicle maintenance.', capabilities: ['Fleet targeting', 'B2B outreach support', 'Commercial campaigns', 'LinkedIn support'], image: fleetImage, alt: 'Illustrative fleet and commercial account marketing concept' },
  { number: '09', title: 'Microsoft & Bing Ads', description: 'Capture additional local search demand through Microsoft Advertising and diversify paid search opportunities.', capabilities: ['Bing search campaigns', 'Local search intent', 'Audience targeting', 'Conversion tracking'], image: microsoftImage, alt: 'Illustrative Microsoft Advertising campaign view' },
];

const problems = [
  ['01', 'Invisible when drivers search', 'Customers search for brake repair, engine diagnostics, and mechanics nearby. If your shop is not visible, someone else gets the call.'],
  ['02', 'Clicks without bookings', 'Website visits mean little when visitors cannot quickly understand your services, trust your business, or contact you.'],
  ['03', 'Leads you cannot measure', 'Without useful call tracking and reporting, it is difficult to know which campaigns create real business opportunities.'],
] as const;

const journey = [
  { number: '01', icon: Search, title: 'Get found', body: 'Google Ads, local SEO, Google Business Profile, and Microsoft Ads meet drivers searching for help.' },
  { number: '02', icon: MapPin, title: 'Earn the click', body: 'Relevant service pages, strong messaging, and local trust signals make the next step feel obvious.' },
  { number: '03', icon: PhoneCall, title: 'Turn interest into leads', body: 'Click-to-call, quote requests, booking paths, and follow-up give intent somewhere useful to go.' },
  { number: '04', icon: BarChart3, title: 'Measure and grow', body: 'Call tracking, analytics, retention, and reporting show what to improve or fund next.' },
] as const;

const specialties = [
  ['Brake repair', 'Reach drivers searching for inspections, pad replacements, and brake servicing.', Disc3],
  ['Engine diagnostics', 'Connect urgent symptom searches with a clear path to a trusted specialist.', Settings2],
  ['Transmission repair', 'Build confidence around high-value jobs where second opinions matter.', Cog],
  ['Tire services & alignment', 'Capture seasonal, convenience, and near-me demand with local intent.', Gauge],
  ['Auto AC repair', 'Show up when drivers need a fast answer to a comfort and safety problem.', BatteryCharging],
  ['Oil changes & maintenance', 'Keep routine service visible and create opportunities for repeat visits.', CalendarCheck],
  ['Diesel & truck repair', 'Support commercial demand where downtime, reliability, and capacity matter.', Truck],
  ['General auto repair', 'Create a useful front door for everyday maintenance and complex repairs alike.', Wrench],
] as const;

const process = [
  ['01', 'Discover', 'We learn about your services, service area, current marketing, capacity, and business goals.'],
  ['02', 'Build', 'We develop the campaign strategy, landing pages, tracking, and marketing foundations.'],
  ['03', 'Launch', 'We activate the relevant campaigns and improve the customer journey with the right measurement in place.'],
  ['04', 'Optimize', 'We analyze performance, improve campaigns, and identify the next useful opportunity.'],
] as const;

function FormCard({ id = 'audit-form' }: { id?: string }) {
  return (
    <div id={id} className="autoshop-form scroll-mt-28 rounded-[1.5rem] bg-white p-5 text-slate-900 shadow-[0_24px_70px_rgba(3,15,28,0.22)] sm:p-7">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ORANGE_DARK }}>Automotive growth audit</p>
      <h2 className="autoshop-title text-3xl font-extrabold tracking-tight text-slate-950">See where your next jobs can come from.</h2>
      <Suspense fallback={<div className="mt-5 h-48 animate-pulse rounded-xl bg-slate-100" />}>
        <LeadForm variant="audit" source="lp-auto-repair" compact showClinicName businessLabel="Shop name" submitLabel="Get My Growth Strategy" className="mt-5 [&_button]:rounded-full [&_button]:bg-[#111416] [&_button]:hover:bg-[#252D31]" />
      </Suspense>
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className="autoshop-label mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: light ? ORANGE : ORANGE_DARK }}>{children}</p>;
}

function DashboardIllustration() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-[#191E21] p-4 shadow-2xl sm:p-5" aria-label="Illustrative marketing reporting dashboard">
      <div className="flex items-center justify-between border-b border-white/10 pb-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F36B2B]">Illustrative only</p><p className="mt-1 text-sm font-bold text-white">Repair demand overview</p></div><BarChart3 className="h-5 w-5 text-[#F36B2B]" /></div>
      <div className="grid grid-cols-2 gap-2 py-4 sm:grid-cols-4">
        {[['Qualified calls', 'Tracked'], ['Booking requests', 'Visible'], ['Missed calls', 'Flagged'], ['Next action', 'Clear']].map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 bg-[#252D31] p-2.5"><p className="text-[9px] uppercase tracking-wide text-white/45">{label}</p><p className="mt-2 text-sm font-bold text-white">{value}</p></div>)}
      </div>
      <div className="rounded-lg border border-white/10 bg-[#111416] p-3"><div className="flex items-end gap-1.5" aria-hidden="true">{[34, 48, 42, 61, 55, 72, 64, 82, 74, 91, 78, 88].map((height, index) => <span key={index} className="h-20 flex-1 rounded-sm bg-[#F36B2B]/80" style={{ transform: `scaleY(${height / 100})`, transformOrigin: 'bottom' }} />)}</div><div className="mt-3 flex justify-between text-[9px] uppercase tracking-wider text-white/35"><span>Search demand</span><span>Campaign activity</span></div></div>
      <figcaption className="mt-3 text-[10px] leading-relaxed text-white/45">A sample interface showing the questions reporting should answer. It is not client performance data.</figcaption>
    </figure>
  );
}

export default function AutoRepairLpPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs.map(([question, answer]) => ({ question, answer }))), serviceSchema({ name: 'Automotive Repair Marketing', description: 'Digital marketing for auto repair businesses, including paid search, local SEO, landing pages, call tracking, and reporting.', path: '/lp/auto-repair' })]} />
      <div className="lp-light autoshop-body -mt-20 overflow-hidden bg-[#F4F3EF] text-[#111416]">
        <section className="relative isolate overflow-hidden bg-[#111416] text-white">
          <Image src={heroImage} alt="Professional auto repair workshop with open service bays" fill priority placeholder="blur" sizes="100vw" className="object-cover object-center opacity-25" />
          <div className="autoshop-grid absolute inset-0" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,20,22,.98),rgba(17,20,22,.9)_42%,rgba(17,20,22,.48))]" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#111416_0%,transparent_55%)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-32 sm:px-6 lg:min-h-[760px] lg:grid-cols-[1fr_.82fr] lg:gap-16 lg:px-8">
            <LoadGroup className="max-w-2xl" stagger={0} showImmediately>
              <LoadItem showImmediately><div className="mb-6 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.05] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE }} /> Automotive repair growth specialists</span><span className="text-xs font-semibold text-white/45">XpertPPC · Digital marketing agency</span></div></LoadItem>
              <LoadItem as="h1" showImmediately><span className="autoshop-title block text-[2.8rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.8rem]">Auto repair digital<br /><span style={{ color: ORANGE }}>marketing agency.</span></span></LoadItem>
              <LoadItem as="p" showImmediately className="mt-6 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">Marketing built for auto repair businesses. We turn local searches into qualified calls, enquiries, and booking opportunities through targeted advertising, local SEO, and conversion-focused marketing.</LoadItem>
              <LoadItem showImmediately><div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">{['Automotive focus', 'Lead generation strategy', 'Performance tracking'].map((item) => <span key={item} className="border border-white/12 bg-white/[0.04] px-3 py-2">{item}</span>)}</div></LoadItem>
              <LoadItem showImmediately><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#audit-form" className="inline-flex min-h-12 items-center justify-center px-7 text-sm font-bold text-[#111416] transition-colors hover:bg-[#ff945b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111416]" style={{ backgroundColor: ORANGE }}>Get Your Growth Strategy <ArrowRight className="ml-2 h-4 w-4" /></a><a href="#services" className="inline-flex min-h-12 items-center justify-center border border-white/20 bg-white/[0.05] px-7 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B2B]">Explore Our Services</a></div></LoadItem>
              <LoadItem showImmediately><p className="mt-6 max-w-lg text-xs font-semibold uppercase tracking-[0.12em] text-white/42">For independent shops · specialists · fleets · multi-location operators</p></LoadItem>
            </LoadGroup>
            <LoadFade showImmediately delay={0.12} y={22} className="w-full max-w-md justify-self-end"><FormCard /></LoadFade>
          </div>
        </section>

        <section className="border-b border-[#252D31]/10 bg-[#191E21] py-8 text-white"><div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F36B2B]">Built around how local repair businesses win customers</p>{[['Search visibility', Search], ['Qualified phone calls', PhoneCall], ['Booking opportunities', CalendarCheck], ['Measurable marketing', BarChart3]].map(([label, Icon]) => <div key={label as string} className="flex items-center gap-3 border-l border-white/15 pl-4 text-sm font-semibold text-white/75"><Icon className="h-4 w-4 text-[#F36B2B]" />{label as string}</div>)}</div></section>

        <section id="services" className="scroll-mt-20 bg-[#F4F3EF] py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="max-w-3xl"><SectionLabel>Services</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">Everything your repair business needs to win more local customers.</h2><p className="mt-4 text-base leading-relaxed text-[#343B3F]">One focused marketing partner. Every important part of your customer acquisition journey, scoped around your service area, capacity, and goals.</p></Reveal><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map((service, index) => <Reveal key={service.number} y={18} className={`group overflow-hidden border border-[#252D31]/15 bg-white ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}><div className={`grid ${index === 0 ? 'sm:grid-cols-[.9fr_1.1fr]' : ''}`}><div className="relative min-h-[190px] overflow-hidden"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#111416]/70 to-transparent" /><span className="absolute bottom-4 left-4 text-4xl font-extrabold text-white/60">{service.number}</span></div><div className="p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ORANGE_DARK }}>Growth service</p><h3 className="autoshop-title mt-2 text-xl font-bold">{service.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#343B3F]">{service.description}</p><ul className="mt-5 grid gap-2 text-xs font-semibold text-[#343B3F] sm:grid-cols-2">{service.capabilities.map((capability) => <li key={capability} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ORANGE_DARK }} />{capability}</li>)}</ul></div></div></Reveal>)}</div></div></section>

        <section className="bg-white py-20 text-[#111416] sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><SectionLabel>The problem</SectionLabel><h2 className="autoshop-title max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">Good mechanics should not have to chase their next customer.</h2></div><div><p className="max-w-2xl text-lg leading-relaxed text-[#343B3F]">Your team knows how to fix vehicles. Without consistent visibility and a reliable way to turn searches into bookings, even a great repair shop can struggle to keep its bays busy.</p></div></div><div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><Reveal className="relative min-h-[300px] overflow-hidden"><Image src={diagnosticsImage} alt="Technician working in an auto repair workshop" fill sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#111416]/75 to-transparent" /><p className="absolute bottom-5 left-5 max-w-xs text-2xl font-bold text-white">The work is out there. The path to your bay needs to be clearer.</p></Reveal><div className="grid gap-4">{problems.map(([number, title, body]) => <div key={title} className="border-t border-[#252D31]/20 py-5"><span className="text-sm font-bold" style={{ color: ORANGE_DARK }}>{number}</span><h3 className="autoshop-title mt-2 text-xl font-bold">{title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#343B3F]">{body}</p></div>)}</div></div></div></section>

        <section id="journey" className="scroll-mt-20 bg-[#252D31] py-20 text-white sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><Reveal><SectionLabel light>The XpertPPC growth system</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">From local search to the next repair job.</h2><p className="mt-5 max-w-md text-base leading-relaxed text-white/65">We connect the entire customer journey, from the moment a driver searches for help to the moment they call your shop or book an appointment.</p></Reveal><RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.06}>{journey.map(({ number, icon: Icon, title, body }) => <RevealItem key={number} y={14} className="border border-white/10 bg-[#191E21] p-5"><div className="flex items-center justify-between"><span className="text-3xl font-extrabold text-white/20">{number}</span><Icon className="h-5 w-5" style={{ color: ORANGE }} /></div><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/58">{body}</p></RevealItem>)}</RevealGroup></div></div></section>



        <section id="specialties" className="scroll-mt-20 bg-white py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><Reveal><SectionLabel>Industry-specific marketing</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">Marketing that understands what is happening inside your shop.</h2></Reveal><Reveal><p className="max-w-2xl text-lg leading-relaxed text-[#343B3F]">These are the service categories and business models we help market. XpertPPC does not repair vehicles—we help the businesses that do reach the right customers.</p></Reveal></div><RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.04}>{specialties.map(([title, body, Icon]) => <RevealItem key={title} y={10} className="border border-[#252D31]/15 bg-[#F4F3EF] p-5"><Icon className="h-5 w-5" style={{ color: ORANGE_DARK }} /><h3 className="mt-5 text-base font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#343B3F]">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section id="approach" className="scroll-mt-20 bg-[#111416] py-20 text-white sm:py-28"><div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:px-8"><Reveal><SectionLabel light>Why XpertPPC</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">Not another agency learning your industry on your budget.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">Automotive repair has its own customer behavior, service priorities, search intent, and conversion challenges. Your marketing should reflect that.</p><div className="mt-8 space-y-5">{[['01', 'Automotive-focused strategy', 'Campaigns designed around real repair services and customer search intent.'], ['02', 'Lead quality over vanity metrics', 'Focus on meaningful calls, enquiries, and booking opportunities—not impressions alone.'], ['03', 'Connected marketing channels', 'Bring advertising, local visibility, landing pages, and tracking into one coordinated system.'], ['04', 'Transparent performance', 'Understand what is working, what needs improvement, and where your opportunities are.']].map(([number, title, body]) => <div key={number} className="flex gap-4 border-t border-white/10 pt-4"><span className="text-sm font-bold text-[#F36B2B]">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p></div></div>)}</div></Reveal><Reveal><DashboardIllustration /></Reveal></div></section>

        <section id="process" className="scroll-mt-20 bg-[#F4F3EF] py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="max-w-3xl"><SectionLabel>How we work</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">A clear process. A marketing system built to improve.</h2><p className="mt-4 text-base leading-relaxed text-[#343B3F]">We start with fit and context, then build the measurement and customer path needed to make better decisions over time.</p></Reveal><RevealGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.06}>{process.map(([number, title, body]) => <RevealItem key={number} y={16} className="border border-[#252D31]/15 bg-white p-6 sm:p-7"><p className="text-5xl font-extrabold text-[#252D31]/15">{number}</p><h3 className="autoshop-title mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#343B3F]">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section className="bg-white py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-2"><Reveal className="border border-emerald-200 bg-emerald-50 p-7"><h2 className="text-xl font-bold text-emerald-950">A strong fit when</h2><ul className="mt-5 space-y-3 text-sm text-emerald-900/80">{['You have capacity or techs you want to keep busy', 'Someone reliably answers and follows up on calls', 'You know the services and locations you want more of', 'You can share the access needed for useful measurement'].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></Reveal><Reveal className="border border-[#252D31]/15 bg-[#F4F3EF] p-7"><h2 className="text-xl font-bold">Clear expectations matter</h2><p className="mt-4 text-sm leading-relaxed text-[#343B3F]">The right system depends on demand, capacity, response time, and measurement access. We scope those realities before recommending the next move.</p><a href="#audit-form" className="mt-6 inline-flex items-center text-sm font-bold text-[#111416] underline decoration-[#F36B2B] decoration-2 underline-offset-4">Discuss your shop <ArrowRight className="ml-2 h-4 w-4" /></a></Reveal></div></div></section>

        <section className="relative overflow-hidden bg-[#252D31] py-20 text-white sm:py-28"><Image src={shopImage} alt="Exterior of an automotive repair workshop" fill placeholder="blur" sizes="100vw" className="object-cover object-center opacity-20" /><div className="autoshop-grid absolute inset-0" aria-hidden /><div className="absolute inset-0 bg-[#111416]/80" aria-hidden /><div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.82fr] lg:px-8"><Reveal><SectionLabel light>Know what your marketing is producing</SectionLabel><h2 className="autoshop-title max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Reporting that helps you decide what to do next.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">A useful reporting system connects qualified inbound calls, cost per lead, booking enquiries, conversion rates, answered versus missed calls, and channel attribution. The exact metrics and cadence are agreed for the engagement.</p><div className="mt-7 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-white/55">{['Qualified calls', 'Cost per lead', 'Booking enquiries', 'Attribution'].map((item) => <span key={item} className="border border-white/15 px-3 py-2">{item}</span>)}</div></Reveal><Reveal x={16}><FormCard id="bottom-audit-form" /></Reveal></div></section>

        <section id="faq" className="scroll-mt-20 bg-[#F4F3EF] py-20 text-[#111416] sm:py-24"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><Reveal className="mb-8 text-center"><SectionLabel>Before we start</SectionLabel><h2 className="autoshop-title text-4xl font-extrabold tracking-tight sm:text-5xl">Questions shop owners ask.</h2></Reveal><RevealGroup className="space-y-3" stagger={0.04}>{faqs.map(([question, answer]) => <RevealItem key={question} as="article"><details className="group border border-[#252D31]/15 bg-white px-5 py-4"><summary className="cursor-pointer list-none text-sm font-bold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B2B]"><span className="flex items-center justify-between gap-4">{question}<span className="text-xl font-normal text-[#343B3F]/50 transition-transform group-open:rotate-45">+</span></span></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#343B3F]">{answer}</p></details></RevealItem>)}</RevealGroup></div></section>

        <section className="bg-[#F36B2B] py-16 text-[#111416] sm:py-20"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em]">Ready to grow with intention?</p><h2 className="autoshop-title mt-2 text-3xl font-extrabold sm:text-4xl">Put more cars on your calendar.</h2></div><a href="#audit-form" className="inline-flex min-h-12 items-center justify-center bg-[#111416] px-7 text-sm font-bold text-white transition-colors hover:bg-[#252D31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111416] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F36B2B]">Get Your Growth Strategy <ArrowRight className="ml-2 h-4 w-4" /></a></div></section>
      </div>
      <AutoRepairStickyCta />
    </>
  );
}
