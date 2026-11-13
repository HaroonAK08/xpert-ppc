import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Search,
  Target,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import JsonLd from "@/components/seo/json-ld";
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { NewportCaseStudy } from "./newport-case-study";
import { RestaurantStickyCta } from "./sticky-cta";

import heroImage from "../../../../public/lp/restaurant/lp-restaurant-hero.png";
import burgerImage from "../../../../public/lp/restaurant/lp-restaurant-burger.png";
import familyImage from "../../../../public/lp/restaurant/lp-restaurant-family.png";
import deliveryImage from "../../../../public/lp/restaurant/lp-restaurant-delivery.png";
import metaAdImage from "../../../../public/lp/restaurant/lp-restaurant-meta-ad.png";

const WHATSAPP = "https://wa.me/15878935511";
const CHAR = "#0E0E0E";
const SAFFRON = "#F5A524";
const SMOKE = "#151515";

export const metadata: Metadata = buildMetadata({
  title: "Restaurant Marketing That Drives Orders & Bookings | Xpert PPC",
  description:
    "Xpert PPC helps restaurants turn local search, social ads, and direct-order pages into more calls, bookings, and orders. Start with a free restaurant audit.",
  path: "/lp/restaurant",
  image: "/lp/restaurant/lp-restaurant-hero.png",
  keywords: [
    "restaurant marketing",
    "restaurant Google Ads",
    "restaurant Meta ads",
    "restaurant PPC agency",
    "restaurant booking marketing",
  ],
});

const faqs = [
  ["Do you replace our delivery aggregator?", "Not automatically. We can keep useful aggregator demand while building direct paths for calls, WhatsApp orders, reservations, and repeat customers."],
  ["What happens after the free audit?", "You receive a clear view of the biggest acquisition opportunities, tracking gaps, and the next practical actions. You decide whether to continue."],
  ["Can you work with our existing website?", "Usually. We can improve the current journey or recommend a focused menu, booking, or event page when the next step is unclear."],
  ["What do you track?", "Depending on your setup, we can track calls, WhatsApp conversations, forms, reservation requests, menu visits, and campaign-level enquiry sources."],
  ["How quickly can campaigns start?", "After access, tracking, creative, offer, and destination approvals are ready. Timing depends on the account, location, booking system, and scope."],
] as const;

const services = [
  { icon: Search, title: "Capture local demand", body: "Google Ads, Maps, local search, and location targeting for people already looking for food, delivery, tables, or events.", includes: "Search campaigns · Local intent · Call tracking" },
  { icon: UtensilsCrossed, title: "Make the offer convert", body: "Menu-led landing pages and clear paths that turn a hungry visit into an order, call, booking, or event enquiry.", includes: "Landing pages · Offers · Booking journeys" },
  { icon: Target, title: "Create demand on social", body: "Food creative, Meta campaigns, remarketing, and audience work that keep the restaurant in consideration before the next visit.", includes: "Creative direction · Meta Ads · Remarketing" },
  { icon: BarChart3, title: "Know what paid off", body: "Tracking and reporting that separates clicks and account actions from the completed orders or bookings that matter to the owner.", includes: "GA4 · Conversion tracking · Owner reporting" },
];

const audiences = [
  ["Fine dining", "Ambience, premium occasions, reservations"],
  ["Quick service", "Near-me demand, offers, delivery windows"],
  ["Family dining", "Groups, weekends, celebrations, events"],
  ["Delivery brands", "Direct orders, repeat visits, owned demand"],
] as const;

const proof = [
  ["+45%", "Estimated order growth", "One-month management report"],
  ["+55%", "Reported website traffic", "One-month management report"],
  ["2,399", "Google Ads actions", "Rounded from 2,398.56"],
  ["$28.06", "Average cost per action", "Supplied reporting period"],
] as const;

function FormCard({ id = "audit-form" }: { id?: string }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-[2rem] bg-white p-5 text-neutral-900 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-7">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SAFFRON }}>Free restaurant audit</p>
      <h2 className="restaurant-display text-4xl tracking-wide">Find your next growth lever</h2>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-neutral-500">Tell us where you trade and what you want more of. We will review the path from search to order or booking.</p>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-neutral-100" />}>
        <LeadForm variant="audit" source="lp-restaurant" compact showClinicName businessLabel="Restaurant / brand name" phonePlaceholder="+1 587 893 5511" submitLabel="Get My Free Audit" className="[&_button]:rounded-full [&_button]:bg-[#0E0E0E] [&_button]:hover:bg-[#2a2a2a]" />
      </Suspense>
    </div>
  );
}

function SectionLabel({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: dark ? SAFFRON : "#9a650d" }}>{children}</p>;
}

export default function RestaurantLpPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs.map(([question, answer]) => ({ question, answer }))), serviceSchema({ name: "Restaurant Marketing", description: "Performance marketing for restaurants and fast food brands, including Google Ads, Meta Ads, local search, landing pages, and conversion tracking.", path: "/lp/restaurant" })]} />
      <div className="lp-light restaurant-body -mt-20 overflow-hidden bg-[#0E0E0E] text-neutral-100">
        <section className="relative isolate overflow-hidden">
          <Image src={heroImage} alt="Warmly lit restaurant dish" fill priority placeholder="blur" sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.52),rgba(0,0,0,.2))]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,14,14,.9),transparent_45%)]" />
          <div className="relative mx-auto grid min-h-[780px] max-w-6xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8">
            <LoadGroup className="max-w-2xl" stagger={0}>
              <LoadItem><p className="restaurant-display mb-5 text-5xl tracking-wide sm:text-7xl">Xpert<span style={{ color: SAFFRON }}>PPC</span></p></LoadItem>
              <LoadItem><p className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SAFFRON }}><UtensilsCrossed className="h-4 w-4" /> Restaurant growth marketing</p></LoadItem>
              <LoadItem as="h1"><span className="restaurant-display block text-5xl leading-[0.92] tracking-wide text-white sm:text-7xl">More covers.<br />More orders.<br /><span style={{ color: SAFFRON }}>More control.</span></span></LoadItem>
              <LoadItem as="p" className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">We help restaurants turn local intent, strong offers, and better customer journeys into calls, bookings, and direct orders.</LoadItem>
              <LoadItem><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#audit-form" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>Get the free restaurant audit <ArrowRight className="ml-2 h-4 w-4" /></a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur hover:bg-white/20"><MessageCircle className="mr-2 h-4 w-4" /> Message us on WhatsApp</a></div></LoadItem>
              <LoadItem><p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">For fine dining · quick service · family restaurants · delivery brands</p></LoadItem>
            </LoadGroup>
            <LoadFade delay={0.15} y={24} className="w-full max-w-md justify-self-end"><FormCard /></LoadFade>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#111111] py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><SectionLabel>Reported results · proof, not promises</SectionLabel><h2 className="restaurant-display text-3xl tracking-wide sm:text-4xl">A restaurant growth story, measured with context</h2><p className="mt-2 max-w-2xl text-sm text-white/55">Newport Beach reporting combines management-reported one-month growth with a separate supplied Google Ads reporting period. The restaurant name is kept private.</p></div><a href="#case-study" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-bold text-white hover:bg-white/10">See the full evidence <ArrowRight className="ml-2 h-4 w-4" /></a></div><div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{proof.map(([value, label, note]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-3xl font-extrabold" style={{ color: SAFFRON }}>{value}</p><p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/75">{label}</p><p className="mt-2 text-xs text-white/40">{note}</p></div>)}</div></div>
        </section>

        <section className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><Reveal><SectionLabel dark={false}>The commercial problem</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Your next customer is already looking.</h2></Reveal><Reveal delay={0.08}><p className="max-w-2xl text-lg leading-relaxed text-neutral-600">The gap is usually not awareness. It is the path between a search, a menu, a call, a booking system, and the team that turns demand into a great visit.</p></Reveal></div><RevealGroup className="mt-12 grid gap-4 md:grid-cols-2" stagger={0.05}>{[["Demand is scattered", "Google, Maps, social, aggregators, and word of mouth each tell a different story."],["The best offer is unclear", "People see a menu or ad but do not know what to do next, especially for groups and events."],["Good enquiries disappear", "Calls, WhatsApp conversations, forms, and bookings are often measured in separate places."],["Quiet windows stay quiet", "Campaigns can be planned around the hours, margins, locations, and occasions that matter most."]].map(([title, body], i) => <RevealItem key={title} y={12} className="rounded-3xl border border-neutral-200 bg-white p-6"><span className="text-sm font-bold" style={{ color: "#B87400" }}>0{i + 1}</span><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section className="bg-[#0E0E0E] py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal><SectionLabel>What we help you build</SectionLabel><h2 className="restaurant-display max-w-3xl text-5xl tracking-wide sm:text-6xl">One growth system, not a pile of disconnected campaigns.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">Choose the pieces that match your restaurant now. The audit shows where the biggest improvement is likely to come from.</p></Reveal><RevealGroup className="mt-12 grid gap-4 md:grid-cols-2" stagger={0.06}>{services.map(({ icon: Icon, title, body, includes }, i) => <RevealItem key={title} y={18} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#F5A524]/60 hover:bg-white/[0.07] sm:p-8"><div className="flex items-start justify-between gap-4"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${SAFFRON}22`, color: SAFFRON }}><Icon className="h-5 w-5" /></span><span className="text-xs font-bold text-white/30">0{i + 1}</span></div><h3 className="mt-7 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{body}</p><p className="mt-6 border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-wider text-white/45">{includes}</p></RevealItem>)}</RevealGroup><Reveal className="mt-10 flex flex-wrap items-center gap-4"><a href="#audit-form" className="inline-flex min-h-12 items-center rounded-full px-7 text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>Show me the right mix <ArrowRight className="ml-2 h-4 w-4" /></a><p className="text-xs text-white/45">Management scope, media budget, creative, and landing-page work are scoped separately after the audit.</p></Reveal></div></section>

        <section className="bg-white py-20 text-neutral-900 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center"><Reveal><SectionLabel dark={false}>The demand path</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">From hungry search to a trackable next step.</h2><p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">Every part of the journey has a job. We make the hand-offs visible so you can improve what happens after the click.</p></Reveal><RevealGroup className="space-y-3" stagger={0.06}>{[[Search, "1", "Intent", "A customer searches, browses Maps, or sees an offer."],[MousePointerClick, "2", "Message", "The ad and landing page make the right next step obvious."],[MessageCircle, "3", "Conversation", "They call, message, book, or order through the destination you choose."],[BarChart3, "4", "Learning", "Tracking and reporting show what to improve next."]].map(([Icon, n, title, body]) => <RevealItem key={String(n)} y={12} className="flex gap-4 rounded-2xl border border-neutral-200 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>{n as string}</span><div><h3 className="font-bold">{title as string}</h3><p className="mt-1 text-sm leading-relaxed text-neutral-600">{body as string}</p></div></RevealItem>)}</RevealGroup></div></div></section>

        <section className="bg-[#151515] py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="max-w-3xl"><SectionLabel>How the engagement works</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">A clear first 30 days.</h2><p className="mt-4 text-base leading-relaxed text-white/60">No vague hand-off after the proposal. The first phase is about finding the opportunity, making measurement useful, and getting the next actions live.</p></Reveal><RevealGroup className="mt-12 grid gap-4 md:grid-cols-3" stagger={0.07}>{[["01", "Audit & prioritise", "We review the location, offers, account structure, landing pages, tracking, and customer destinations."],["02", "Prepare & launch", "We agree the message, destinations, audiences, and measurement before campaigns go live."],["03", "Optimise & report", "We review search intent, actions, cost, quality signals, and the next test with you."]].map(([n, title, body]) => <RevealItem key={n} y={16} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><p className="restaurant-display text-6xl text-white/10">{n}</p><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="text-center"><SectionLabel dark={false}>Is this a fit?</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Good marketing needs a workable destination.</h2></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-2"><Reveal x={-12} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7"><h3 className="text-xl font-bold text-emerald-950">A strong fit when</h3><ul className="mt-5 space-y-3 text-sm text-emerald-900/80">{["You know the locations and service windows you want to grow", "There is a clear menu, offer, booking or order destination", "The team can approve creative and share the access needed for measurement", "You want a repeatable source of demand, not only one promotion"].map(x => <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{x}</li>)}</ul></Reveal><Reveal x={12} className="rounded-3xl border border-neutral-200 bg-white p-7"><h3 className="text-xl font-bold">Not ready yet when</h3><ul className="mt-5 space-y-3 text-sm text-neutral-600">{["There is no agreed destination for a call, order, or booking", "Nobody can approve changes or respond to qualified enquiries", "The expectation is guaranteed results without testing the offer and market", "Tracking and reporting access cannot be provided"].map(x => <li key={x} className="flex gap-2"><ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />{x}</li>)}</ul></Reveal></div></div></section>

        <NewportCaseStudy />

        <section className="bg-white py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><Reveal><SectionLabel dark={false}>Restaurant-specific thinking</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">The plan changes with what you serve.</h2><p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">A restaurant is not one audience. We match the page, offer, creative, and timing to the way people choose your business.</p></Reveal><RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.05}>{audiences.map(([title, body]) => <RevealItem key={title} y={10} className="rounded-2xl border border-neutral-200 bg-[#FAFAF8] p-5"><p className="font-bold">{title}</p><p className="mt-2 text-sm text-neutral-500">{body}</p></RevealItem>)}</RevealGroup></div></div></section>

        <section className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><Reveal className="mb-8 text-center"><SectionLabel dark={false}>Before service starts</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Questions restaurant owners ask</h2></Reveal><RevealGroup className="space-y-3" stagger={0.05}>{faqs.map(([question, answer]) => <RevealItem key={question} as="article"><details className="group rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"><summary className="cursor-pointer list-none text-sm font-bold marker:hidden"><span className="flex items-center justify-between gap-4">{question}<span className="text-xl font-normal text-neutral-400 transition-transform group-open:rotate-45">+</span></span></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">{answer}</p></details></RevealItem>)}</RevealGroup></div></section>

        <section className="relative overflow-hidden py-20 sm:py-28"><Image src={familyImage} alt="Restaurant table prepared for a group meal" fill placeholder="blur" sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-black/70" /><div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8"><Reveal><SectionLabel>Start with clarity</SectionLabel><h2 className="restaurant-display max-w-2xl text-5xl tracking-wide text-white sm:text-6xl">Find the next customers your restaurant can actually serve.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">Submit the audit form and we will start with your location, offer, customer path, and measurement—not a generic package.</p><div className="mt-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-white/60"><span className="rounded-full border border-white/20 px-3 py-2">Opportunity summary</span><span className="rounded-full border border-white/20 px-3 py-2">Next actions</span><span className="rounded-full border border-white/20 px-3 py-2">No guarantee claims</span></div></Reveal><Reveal x={16}><FormCard id="bottom-audit-form" /></Reveal></div></section>
      </div>
      <RestaurantStickyCta />
    </>
  );
}
