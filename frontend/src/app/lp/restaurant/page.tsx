import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  MousePointerClick,
  Search,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Video,
} from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import JsonLd from "@/components/seo/json-ld";
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { NewportCaseStudy } from "./newport-case-study";
import { RestaurantStickyCta } from "./sticky-cta";

import heroImage from "../../../../public/lp/restaurant/lp-restaurant-hero.png";
import fineImage from "../../../../public/lp/restaurant/lp-restaurant-fine.png";
import burgerImage from "../../../../public/lp/restaurant/lp-restaurant-burger.png";
import familyImage from "../../../../public/lp/restaurant/lp-restaurant-family.png";
import deliveryImage from "../../../../public/lp/restaurant/lp-restaurant-delivery.png";
import metaAdImage from "../../../../public/lp/restaurant/lp-restaurant-meta-ad.png";
import newportCover from "../../../../public/case-studies/covers/newport-beach-restaurant.jpg";

const WHATSAPP = "https://wa.me/15878935511";
const SAFFRON = "#F5A524";

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
  ["What do I receive after submitting the audit?", "We review your local acquisition paths, offer and destination clarity, and tracking gaps, then share prioritized next actions. Outcomes and scope are confirmed after the review; no result is guaranteed."],
  ["Is advertising spend separate from management work?", "Yes, management scope, media budget, creative, and landing-page work are scoped separately after the audit. Exact scope is confirmed in the proposal."],
  ["Who owns the ad account and customer data?", "Account, data, and creative ownership should be confirmed in the proposal for your engagement. We do not want you to rely on an assumption."],
  ["How often do you report?", "Reporting is designed around the metrics and review needs agreed for the engagement. The Newport case study shows the type of owner reporting and measurement context we use."],
  ["Do you replace our delivery aggregator?", "Not automatically. We can keep useful aggregator demand while building direct paths for calls, WhatsApp orders, reservations, and repeat customers."],
  ["Can you work with our existing website?", "Usually. We can improve the current journey or recommend a focused menu, booking, or event page when the next step is unclear."],
  ["What do you track?", "Depending on your setup, we can track calls, WhatsApp conversations, forms, reservation requests, menu visits, and campaign-level enquiry sources."],
  ["How quickly can campaigns start?", "After access, tracking, creative, offer, and destination approvals are ready. Timing depends on the account, location, booking system, and scope."],
] as const;

const services = [
  { icon: BarChart3, image: deliveryImage, title: "Google Ads", body: "Be visible when hungry customers search for delivery, dining, bookings, and events.", includes: "Search campaigns · Local intent · Call tracking" },
  { icon: MousePointerClick, image: metaAdImage, title: "Meta Ads & social advertising", body: "Reach food lovers with campaigns built for enquiries, visits, and direct-order demand—not only likes.", includes: "Facebook · Instagram · Audiences · Remarketing" },
  { icon: Search, image: fineImage, title: "Restaurant SEO", body: "Get found on Google, Maps, and local search when people nearby look for what you serve.", includes: "Local SEO · Maps · Listings" },
  { icon: Target, image: heroImage, title: "Restaurant websites & landing pages", body: "Mobile-first pages that make menus, calls, bookings, and direct orders easy to complete.", includes: "Websites · Menus · Booking paths" },
  { icon: BarChart3, image: familyImage, title: "Conversion tracking & reporting", body: "See which campaigns create calls, messages, forms, orders, and bookings so decisions are based on useful evidence.", includes: "GA4 · Tracking · Owner reporting" },
  { icon: Target, image: burgerImage, title: "Content and creative", body: "Food-first creative direction, ad assets, and messages that make people want to visit or order.", includes: "Ad creative · Offers · Campaign assets" },
  { icon: Video, image: metaAdImage, title: "TikTok Ads", body: "Reach new local audiences with short-form food creative, creator-style campaigns, and remarketing built for discovery.", includes: "Short-form video · Spark-style creative · Audiences" },
  { icon: TrendingUp, image: heroImage, title: "Microsoft / Bing Ads", body: "Capture additional search demand across Microsoft search for restaurants, catering, bookings, and local services.", includes: "Bing Search · Local intent · Conversion tracking" },
  { icon: UtensilsCrossed, image: familyImage, title: "Social media management", body: "Keep your restaurant visible with a consistent feed, offers, and content that feels like your best service.", includes: "Content planning · Offers · Creative" },
  { icon: Target, image: familyImage, title: "Events and launches", body: "Build demand for openings, private dining, family events, and seasonal offers before the date arrives.", includes: "Launch plans · Event promotion · Lead capture" },
  { icon: BarChart3, image: deliveryImage, title: "Full-service marketing", body: "A connected growth system across search, social, website journeys, tracking, and reporting.", includes: "Strategy · Campaigns · Reporting" },
];

const audiences = [
  ["Fine dining", "Ambience, premium occasions, reservations"],
  ["Quick service", "Near-me demand, offers, delivery windows"],
  ["Family dining", "Groups, weekends, celebrations, events"],
  ["Delivery brands", "Direct orders, repeat visits, owned demand"],
] as const;

function FormCard({ id = "audit-form" }: { id?: string }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-[2rem] bg-white p-5 text-neutral-900 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-7">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SAFFRON }}>Free restaurant audit</p>
      <h2 className="restaurant-display text-4xl tracking-wide">Find your next growth lever</h2>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-neutral-100" />}>
        <LeadForm variant="audit" source="lp-restaurant" compact showClinicName businessLabel="Restaurant / brand name" phonePlaceholder="+1 587 893 5511" submitLabel="Get My Free Audit" className="[&_button]:rounded-full [&_button]:bg-[#0E0E0E] [&_button]:hover:bg-[#2a2a2a]" />
      </Suspense>
    </div>
  );
}

function SectionLabel({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: dark ? SAFFRON : "#9a650d" }}>{children}</p>;
}

const sectionLinks = [
  ["Services", "#services"],
  ["Proof", "#proof"],
  ["Process", "#process"],
  ["Fit", "#fit"],
  ["FAQs", "#faq"],
  ["Audit", "#audit-form"],
] as const;

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
            <LoadGroup className="max-w-2xl" stagger={0} showImmediately>
              <LoadItem showImmediately><p className="restaurant-display mb-5 text-5xl tracking-wide sm:text-7xl">Xpert<span style={{ color: SAFFRON }}>PPC</span></p></LoadItem>
              <LoadItem showImmediately><p className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SAFFRON }}><UtensilsCrossed className="h-4 w-4" /> Restaurant marketing agency</p></LoadItem>
              <LoadItem as="h1" showImmediately><span className="restaurant-display block text-5xl leading-[0.92] tracking-wide text-white sm:text-7xl">Restaurant<br /><span style={{ color: SAFFRON }}>Marketing Agency</span></span></LoadItem>
              <LoadItem as="p" showImmediately className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">Google Ads, Meta Ads, restaurant SEO, websites, creative, and conversion tracking—working together to bring you more bookings, calls, orders, and repeat customers.</LoadItem>
              <LoadItem showImmediately><div className="mt-6 flex max-w-xl flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-white/75"><span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">Google Ads</span><span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">Meta Ads</span><span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">Restaurant SEO</span><span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">Websites &amp; landing pages</span><span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">Tracking &amp; reporting</span></div></LoadItem>
              <LoadItem showImmediately><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#audit-form" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>Get the free restaurant audit <ArrowRight className="ml-2 h-4 w-4" /></a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur hover:bg-white/20"><MessageCircle className="mr-2 h-4 w-4" /> Message us on WhatsApp</a></div></LoadItem>
              <LoadItem showImmediately><p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">For fine dining · quick service · family restaurants · delivery brands</p></LoadItem>
            </LoadGroup>
            <LoadFade showImmediately delay={0.15} y={24} className="w-full max-w-md justify-self-end"><FormCard /></LoadFade>
          </div>
        </section>



        <nav aria-label="Restaurant page sections" className="sticky top-0 z-30 overflow-x-auto border-y border-neutral-200 bg-[#F7F4EE]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex min-w-max max-w-6xl items-center justify-center gap-2 sm:gap-3">
            {sectionLinks.map(([label, href]) => <a key={href} href={href} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition-colors hover:border-[#F5A524] hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A524]">{label}</a>)}
          </div>
        </nav>

        <section id="services" className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal><SectionLabel dark={false}>Our services · Restaurant marketing agency</SectionLabel><h2 className="restaurant-display max-w-3xl text-6xl tracking-wide text-neutral-900 sm:text-7xl">Restaurant marketing services, under one roof.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">Google Ads, Meta Ads, restaurant SEO, landing pages, and tracking—brought together under one restaurant-focused growth plan.</p></Reveal><div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500"><span className="rounded-full border border-neutral-300 bg-white px-3 py-2 text-neutral-800">Core acquisition · Google · Meta · SEO</span><span className="rounded-full border border-neutral-300 bg-white px-3 py-2">Conversion · Websites · Tracking</span><span className="rounded-full border border-neutral-300 bg-white px-3 py-2">Supporting growth · Creative · TikTok · Bing · Social</span></div><RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>{services.map(({ icon: ServiceIcon, image, title, body, includes }) => <RevealItem key={title} y={18} className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-colors hover:border-[#F5A524] hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden"><Image src={image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold text-neutral-900">{title}</h3><ServiceIcon className="mt-1 h-5 w-5 shrink-0" style={{ color: SAFFRON }} /></div><p className="mt-3 text-sm leading-relaxed text-neutral-600">{body}</p><p className="mt-5 border-t border-neutral-200 pt-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{includes}</p></div></RevealItem>)}</RevealGroup><Reveal className="mt-10 flex flex-wrap items-center gap-4"><a href="#audit-form" className="inline-flex min-h-12 items-center rounded-full px-7 text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>Show me the right mix <ArrowRight className="ml-2 h-4 w-4" /></a><p className="text-xs text-neutral-500">Management scope, media budget, creative, and landing-page work are scoped separately after the audit.</p></Reveal></div></section>

        <section id="proof" className="bg-[#171717] py-16 text-white sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mb-10 max-w-3xl"><SectionLabel>Selected proof from a restaurant engagement</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Show the work. Explain the numbers.</h2><p className="mt-4 text-base leading-relaxed text-white/65">This Newport Beach restaurant case study is presented with its challenge, work delivered, reporting evidence, and measurement limits—not just a headline result.</p></div><div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={newportCover} alt="Newport Beach restaurant case study cover" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" /></div><div className="p-2 sm:p-5"><p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: SAFFRON }}>Newport Beach restaurant · name kept private</p><h3 className="restaurant-display mt-3 text-4xl tracking-wide sm:text-5xl">A reported growth story, with the evidence beside it.</h3><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["+45%", "Estimated order growth (one month)"],["+55%", "Reported website traffic (one month)"],["2,399", "Google Ads actions (rounded)"],["$28.06", "Average cost per action"]].map(([value, label]) => <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-xl font-extrabold" style={{ color: SAFFRON }}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45">{label}</p></div>)}</div><a href="#case-study" className="mt-7 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>Read the full case study <ArrowRight className="ml-2 h-4 w-4" /></a></div></div></div></section>

        <NewportCaseStudy />



        <section className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><Reveal><SectionLabel dark={false}>The commercial problem</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Your next customer is already looking.</h2></Reveal><Reveal delay={0.08}><p className="max-w-2xl text-lg leading-relaxed text-neutral-600">The gap is usually not awareness. It is the path between a search, a menu, a call, a booking system, and the team that turns demand into a great visit.</p></Reveal></div><RevealGroup className="mt-12 grid gap-4 md:grid-cols-2" stagger={0.05}>{[["Demand is scattered", "Google, Maps, social, aggregators, and word of mouth each tell a different story."],["The best offer is unclear", "People see a menu or ad but do not know what to do next, especially for groups and events."],["Good enquiries disappear", "Calls, WhatsApp conversations, forms, and bookings are often measured in separate places."],["Quiet windows stay quiet", "Campaigns can be planned around the hours, margins, locations, and occasions that matter most."]].map(([title, body], i) => <RevealItem key={title} y={12} className="rounded-3xl border border-neutral-200 bg-white p-6"><span className="text-sm font-bold" style={{ color: "#B87400" }}>0{i + 1}</span><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section className="bg-white py-20 text-neutral-900 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center"><Reveal><SectionLabel dark={false}>The demand path</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">From hungry search to a trackable next step.</h2><p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">Every part of the journey has a job. We make the hand-offs visible so you can improve what happens after the click.</p></Reveal><RevealGroup className="space-y-3" stagger={0.06}>{[["1", "Intent", "A customer searches, browses Maps, or sees an offer."],["2", "Message", "The ad and landing page make the right next step obvious."],["3", "Conversation", "They call, message, book, or order through the destination you choose."],["4", "Learning", "Tracking and reporting show what to improve next."]].map(([n, title, body]) => <RevealItem key={String(n)} y={12} className="flex gap-4 rounded-2xl border border-neutral-200 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-[#0E0E0E]" style={{ backgroundColor: SAFFRON }}>{n as string}</span><div><h3 className="font-bold">{title as string}</h3><p className="mt-1 text-sm leading-relaxed text-neutral-600">{body as string}</p></div></RevealItem>)}</RevealGroup></div></div></section>

        <section id="process" className="bg-[#151515] py-20 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="max-w-3xl"><SectionLabel>How the engagement works</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">A clear first 30 days.</h2><p className="mt-4 text-base leading-relaxed text-white/60">No vague hand-off after the proposal. The first phase is about finding the opportunity, making measurement useful, and getting the next actions live.</p></Reveal><RevealGroup className="mt-12 grid gap-4 md:grid-cols-3" stagger={0.07}>{[["01", "Audit & prioritise", "We review the location, offers, account structure, landing pages, tracking, and customer destinations."],["02", "Prepare & launch", "We agree the message, destinations, audiences, and measurement before campaigns go live."],["03", "Optimise & report", "We review search intent, actions, cost, quality signals, and the next test with you."]].map(([n, title, body]) => <RevealItem key={n} y={16} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><p className="restaurant-display text-6xl text-white/10">{n}</p><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p></RevealItem>)}</RevealGroup></div></section>

        <section id="fit" className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Reveal className="text-center"><SectionLabel dark={false}>Is this a fit?</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Good marketing needs a workable destination.</h2></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-2"><Reveal x={-12} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7"><h3 className="text-xl font-bold text-emerald-950">A strong fit when</h3><ul className="mt-5 space-y-3 text-sm text-emerald-900/80">{["You know the locations and service windows you want to grow", "There is a clear menu, offer, booking or order destination", "The team can approve creative and share the access needed for measurement", "You want a repeatable source of demand, not only one promotion"].map(x => <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{x}</li>)}</ul></Reveal><Reveal x={12} className="rounded-3xl border border-neutral-200 bg-white p-7"><h3 className="text-xl font-bold">Not ready yet when</h3><ul className="mt-5 space-y-3 text-sm text-neutral-600">{["There is no agreed destination for a call, order, or booking", "Nobody can approve changes or respond to qualified enquiries", "The expectation is guaranteed results without testing the offer and market", "Tracking and reporting access cannot be provided"].map(x => <li key={x} className="flex gap-2"><ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />{x}</li>)}</ul></Reveal></div></div></section>



        <section className="bg-white py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><Reveal><SectionLabel dark={false}>Restaurant-specific thinking</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">The plan changes with what you serve.</h2><p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">A restaurant is not one audience. We match the page, offer, creative, and timing to the way people choose your business.</p></Reveal><RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.05}>{audiences.map(([title, body]) => <RevealItem key={title} y={10} className="rounded-2xl border border-neutral-200 bg-[#FAFAF8] p-5"><p className="font-bold">{title}</p><p className="mt-2 text-sm text-neutral-500">{body}</p></RevealItem>)}</RevealGroup></div></div></section>

        <section id="faq" className="bg-[#F7F4EE] py-20 text-neutral-900 sm:py-24"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><Reveal className="mb-8 text-center"><SectionLabel dark={false}>Before service starts</SectionLabel><h2 className="restaurant-display text-5xl tracking-wide sm:text-6xl">Questions restaurant owners ask</h2></Reveal><RevealGroup className="space-y-3" stagger={0.05}>{faqs.map(([question, answer]) => <RevealItem key={question} as="article"><details className="group rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"><summary className="cursor-pointer list-none text-sm font-bold marker:hidden"><span className="flex items-center justify-between gap-4">{question}<span className="text-xl font-normal text-neutral-400 transition-transform group-open:rotate-45">+</span></span></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">{answer}</p></details></RevealItem>)}</RevealGroup></div></section>

        <section className="relative overflow-hidden py-20 sm:py-28"><Image src={familyImage} alt="Restaurant table prepared for a group meal" fill placeholder="blur" sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-black/70" /><div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8"><Reveal><SectionLabel>Start with clarity</SectionLabel><h2 className="restaurant-display max-w-2xl text-5xl tracking-wide text-white sm:text-6xl">Find the next customers your restaurant can actually serve.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">Submit the audit form and we will review your local demand, offer, customer path, and tracking opportunities, then share prioritized next actions—not a generic package.</p><div className="mt-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-white/60"><span className="rounded-full border border-white/20 px-3 py-2">Opportunity summary</span><span className="rounded-full border border-white/20 px-3 py-2">Next actions</span><span className="rounded-full border border-white/20 px-3 py-2">No guarantee claims</span></div></Reveal><Reveal x={16}><FormCard id="bottom-audit-form" /></Reveal></div></section>
      </div>
      <RestaurantStickyCta />
    </>
  );
}
