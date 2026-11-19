# XpertPPC Website — Full Page-by-Page Design Brief

Prepared for handoff to the redesign designer. Covers every public-facing page on xpertppc.com (and the xpertppc.net "Study Portal" skin), what each page is for, its content sections, actual copy highlights, CTAs/forms, and media notes.

---

## 0. Site overview & architecture

The codebase runs two brands off one Next.js app: **xpertppc.com**, the PPC agency site (every page below unless noted), and **xpertppc.net "Study Portal"**, a separate dark-themed skin covering `/courses` and `/xpert-ppc-digital-academy/*`. A third app (`courses-frontend`) is an unrelated LMS product, and `crm-frontend`/`admin/*` are internal tools — none of these three are in scope for a public-site redesign.

**There are four different header/footer designs live today** — worth deciding upfront whether to unify them or keep them deliberately separate:

| Variant | Where | Header contents |
| --- | --- | --- |
| Main site | Home, About, Services, Industries, Case Studies, FAQ, Contact, Team | Logo, nav (Home / Services / Industries dropdown / Case Studies / About / FAQ / Contact), WhatsApp button, "Book a Call" CTA |
| Campaign landers | `/lp/*` | Stripped nav (Home/Services/Results/About/FAQs), "Book a Strategy Call" + "Get a Free Audit", all links hardcoded to `https://xpertppc.com` so the page can stand alone from ad traffic |
| Ads pages | `/ads/*` | Minimal — logo, WhatsApp, one CTA button |
| Study Portal | `/courses`, `/xpert-ppc-digital-academy/*` | Dark theme, "Study Portal" branding, separate nav (Home/Skills/How it works/Book a call/FAQ/Sign in), link back to the agency site |

**Main navigation:** Home, Services, Industries (dropdown: Dermatologists, Law Firms, eCommerce, Local Services, Healthcare Clinics, Food & Beverage), Case Studies, About, FAQ, Contact — plus a persistent WhatsApp button and "Book a Call" CTA.

**Footer (main site):** Company column (Home, About Us, Case Studies, "Meet Our Expert" → `/team/umer-khan`, Upwork profile link), Contact column (two WhatsApp numbers, a Canada phone line, email, "Global Remote Team" + Calgary AB address), social icons (LinkedIn, Facebook, YouTube, two Upwork links), legal row (Privacy Policy, Terms of Service, Sitemap).

**Contact info used sitewide:** `+971 58 674 0167` (UAE), `+92 300 683 4017`, `+1 587-893-5511` (Canada — used on the restaurant lander), `umer@xpertppc.com`, a WhatsApp deep link, and a Calgary, AB mailing address alongside "Global Remote Team."

**Structural gaps worth flagging up front:** `/industries` and `/team` have no index/listing page — they're reachable only through the nav dropdown or footer links, never a browsable gallery. Same for `/xpert-ppc-digital-academy` (only its `[slug]` detail pages exist). A redesign is a natural place to add proper index pages for these.

---

## 1. Homepage (`/`)

**Purpose:** the primary conversion page for every ad platform — establish credibility fast and capture a free-audit lead.

**Sections, top to bottom:**
1. **Hero** — H1 "We Grow Revenue With **High-Performance PPC Ads**," subhead "Google, Meta, TikTok, Amazon, LinkedIn and Microsoft Ads, managed for ROAS, clear reporting, and weekly optimization. No vanity metrics." Eyebrow pill "PPC Agency for Measurable Growth." A 4-item bullet list (full-funnel PPC across 6 platforms; transparent dashboards/weekly reviews; proven long-term growth, citing Desert Farms; UAE/global remote team with fast WhatsApp response). Trust line: "Google Partner expertise · Top-Rated Plus on Upwork · Meta Ads specialists." A lead-gen form card ("Get a Free PPC Audit") sits beside the hero on desktop, inline on mobile.
2. **Services grid** — H2 "Ads On Every Platform That Matters." Six cards (one per platform), each with icon, name, one-line description, three tag chips, "Learn More →" link into `/services/[slug]`. "See All Services" button → `/services`.
3. **Featured case studies** — H2 "Proven results across industries." Three cards pulled from the case studies flagged `featured: true` (currently Desert Farms, an eCommerce growth story, and a law-firm case), each with a channel tag, client name, excerpt, two metrics, "Read case study →". "View All Case Studies" → `/case-study`.
4. **Process** — H2 "How We Work," four steps in a row: Audit → Strategy → Launch → Optimize, each with an icon and a one-line description. (This same four-step sequence repeats, reused near-verbatim, on the services and industries pages.)
5. **FAQ accordion** — H2 "Frequently Asked Questions," five homepage-specific Q&As (shorter than the full `/faq` page): how fast results come, budget needed, managing multiple platforms at once, reporting transparency, and the free-audit offer.
6. **Closing CTA** — H2 "Ready to scale with cleaner ad spend?" — "Book a Strategy Call" button → `/contact`, plus a "Or WhatsApp us now" text link.

**Forms:** the lead form (name/email/phone + platform interest, tagged `source="hero-audit"`) appears in the hero.

**Media:** no real photography on this page — purely CSS gradient glows/blobs and a Lucide icon set. A redesign could introduce real hero imagery/video here, since right now it's decoration-only.

---

## 2. About (`/about`)

**Purpose:** brand credibility / agency positioning, no lead form.

1. **Hero** — H1 "Engineered for **Aggressive Growth**." Subhead: "We are a syndicate of elite media buyers deploying next-generation strategies across Google, Meta, and TikTok to scale brands past their plateaus."
2. **"The Xpert Advantage"** — two columns. Left: narrative copy ("With over two decades in the trenches of digital advertising, we've reverse-engineered the core algorithms...") + a "Partner With Us" CTA → `/contact`. Right: a 2×2 stat grid — **Top-Rated Plus** (elite platform status), **20+ years** experience, **300+** businesses scaled, **$50M+** ad spend managed — each with its own icon.

No photography — purely an icon-driven stat layout.

---

## 3. Contact (`/contact`)

**Purpose:** standard contact/conversion page.

1. **Hero** — H1 "Get in touch," subhead about taking advertising to the next level.
2. **Two columns.** Left: contact-info blocks — Phone (three numbers, via a WhatsApp-button component plus a plain Canada tel link), Email (`umer@xpertppc.com`), Office address block, and a Business Hours box (Mon–Fri 9–6, Sat 10–4, Sun closed). Right: the full lead form ("Send us a message," tagged `source="contact-page"`).

---

## 4. Services: index (`/services`) + 6 detail pages (`/services/[slug]`)

**Services index purpose:** full platform comparison/overview feeding the six detail pages.

1. **Hero** — H1 "Our PPC **Services**" over a dimmed stock dashboard photo (10% opacity) with glow blobs. CTA "Explore Our Services →" (anchor scroll).
2. **Service cards grid** (2-col) — 6 cards, icon + name + short description + 4 feature bullets + "View Case Study →".
3. **Per-service detail block**, repeated 6× down the page (alternating background): icon+name heading, description, "What we offer" paragraph, "Our approach" paragraph, a bolded "Average results" stat (e.g. "250%+ ROI, 3–5x ROAS"), a "Learn More About [X]" button into the dedicated `/services/[slug]` page — paired with a mini case-study card (client, timeline, Challenge/Solution text, a 4-metric grid, a pull-quote testimonial).
4. **"Why Choose Xpert PPC"** stat strip — 8+ Years Industry Experience, 200+ Successful Campaigns, Certified Platform Partners, 250%+ Average ROI.
5. **Platform comparison table** — 6 rows × 3 columns (Best For / Average CPC / Ideal Audience), each platform name linking to its detail page.
6. **Contact form** — "Ready to grow your business?" + embedded lead form, `source="service-page"`.

**Service detail page template** (same structure for all six, content pulled from `shared/content/services.ts`):
1. Hero: icon, SEO-style hero title (e.g. "Google Ads Management – Maximize Your Search Visibility"), subheading, "Get [X] Consultation →" CTA (anchor to the form).
2. Four sub-service rows, alternating image/text, each with a title + paragraph + a stock Unsplash photo (e.g. for Google Ads: Search Ads / Display Ads / Shopping Ads / YouTube Ads).
3. Two checklist columns — Core Capabilities ("what we offer," 5 items) vs. Why Xpert PPC (3 items, e.g. "Certified Google Partner," "15+ years Google Ads experience," "Average 250% ROI increase").
4. Process — 4–5 step row (Audit → Strategy → Implementation → Optimization → Reporting).
5. Consultation form, pre-filled with that platform as the default interest.
6. "Want to work directly with a senior specialist?" → links to `/team/umer-khan`.

**Full roster of the 6 services** (each has its own 4 sub-service images, its own case-study snippet with testimonial, and its own hero copy — the sub-service photos are generic stock, a strong candidate for replacement with branded creative):

| Service | Platform |
| --- | --- |
| Google Ads Management | Search, Display, Shopping, YouTube |
| Meta Ads | Facebook & Instagram |
| TikTok Ads | TikTok |
| Amazon Ads | Amazon marketplace |
| LinkedIn Ads | LinkedIn (B2B) |
| Microsoft Ads | Bing/Microsoft network |

---

## 5. Industries (`/industries/[slug]`) — 6 pages, no index page

This is the longest, richest page template on the whole site. Each industry page runs:

1. **Hero** (2-col) — eyebrow pill, H1 with a colored highlight phrase (e.g. "Fill Your Clinic With **High-Value Patients**"), description paragraph, 4 bullets, 3 "pillar" mini-cards (icon/title/description) — plus a sticky lead-gen form card ("Book a Free Growth Audit") in the right column.
2. **Challenges section** — H2 (e.g. "What Dermatology Practices Struggle With"), a 4-card grid of pain points.
3. **Process** — the same generic 4-step Audit/Strategy/Launch/Optimize sequence reused across every industry.
4. **Related case studies** — 2–3 cards linking to real `/case-study/[slug]` pages relevant to that industry (only renders when populated).
5. **Testimonials** — 3 star-rated quote cards (name/role, 5-star icons).
6. **"Our Designs & Work" portfolio** — 3 image cards (category + title captions). These are currently generic stock photography captioned as "our work," not real client output — a strong candidate for replacement.
7. **Pricing packages** — 3 tiers: **Launch $500/mo, Growth $1,000/mo ("Most Popular"), Domination $1,500/mo**, each with feature bullets and a "Get Started" anchor to the form. These three price points and tier names repeat nearly identically across all 6 industries — templated, not bespoke per industry.
8. **Industry-specific FAQ accordion** — 4 Q&As.

**Full roster of the 6 industries** (each has fully distinct hero copy, challenges, testimonials and FAQs):

| Industry | Hero angle |
| --- | --- |
| Dermatologists | Filling the clinic with high-value patients |
| Law Firms | Personal-injury / legal lead generation |
| eCommerce | Scaling online store revenue |
| Local Services | Local-area lead capture |
| Healthcare Clinics | Patient acquisition |
| Food & Beverage | Restaurant/brand order growth |

---

## 6. Case Studies: index (`/case-study`) + 14 detail pages (`/case-study/[slug]`)

**Index page:**
1. Hero — H1 "Case Studies," subhead about real accounts across industries.
2. Grid of all 14 case-study cards (3-col) — cover photo, channel-tag chips, industry label, client name, subtitle, excerpt, 2 metrics, "View case study →".
3. CTA band (blue background) — "Want results like these?" → "Get a Free Audit" → `/contact`.

**Detail page template:** full-bleed cover photo hero (title/subtitle/industry/duration), a 4-metric strip, an "About [Client]" intro block, a 3-part narrative (Challenge / Strategy & Execution / Results — only present for case studies that have a `narrative` entry; not all 14 do), an optional "proof" screenshot gallery (currently only one case study has this), a "Pillars" section (4 strategy cards), "Takeaways" (4 cards), "Our Approach" + a Services Deployed checklist, and a closing CTA.

**Full roster of the 14 case studies:**

| # | Client / Case | Industry | Headline result |
| --- | --- | --- | --- |
| 1 | Desert Farms (featured) | eCommerce — camel milk | 12+ yr SEO+Google+Meta; 8× Google sales lift, 10× organic growth |
| 2 | eCommerce Growth (unnamed US brand, featured) | eCommerce | 553% ROAS via Shopping/Target ROAS/remarketing |
| 3 | Google Ads ROAS 600% (unnamed, featured) | eCommerce | ROAS 150% → 600% over 12 months |
| 4 | Galadari Law (featured) | Legal — personal injury | SEO took them from 3 to 2,500+ daily clicks |
| 5 | Online Blackmail Law Firm (featured) | Legal | Google Ads turnaround, CPA $162→$126, saved $72K |
| 6 | Edward Smith Law | Legal | SEO — 102K organic clicks, 6.41M impressions |
| 7 | The People's Firm | Legal — veterans | SEO+Ads+content, +30% traffic |
| 8 | Locks Around The Clock | Local services — locksmith | +145% conversions, CPL $27→$19 |
| 9 | Locksmith & Plumbing Leads | Local services | 1,059 conversions/90 days, <$25 CPL |
| 10 | J&J Gold Buyers | Local services — precious metals | -63% CPA, 3× leads |
| 11 | Meta Ads Ardnamurchan | Food & beverage — Scottish whisky distillery | Meta purchase campaigns, $25K+ revenue |
| 12 | Rafplay | eCommerce — outdoor/ride-on toys | Google + Performance Max, parent-targeted |
| 13 | Dental & Physiotherapy Clinics | Healthcare | Service-segmented Google Ads |
| 14 | Newport Beach Restaurant (anonymous) | Food & beverage | +45% order growth / +55% traffic (estimated), 4-yr engagement |

Case study #14 (Newport Beach Restaurant) is written noticeably more cautiously than the rest — it includes redacted account-screenshot "proof" images and an explicit disclaimer about what Google Ads "conversions" do and don't mean. It's also embedded directly inside the `/lp/restaurant` landing page as social proof. Worth preserving that careful, non-overpromising tone in any redesign of that specific page.

---

## 7. FAQ (`/faq`)

Full FAQ page with a live search component, organized into 7 categories: General PPC, Google Ads, Meta Ads, TikTok Ads, Amazon Ads, LinkedIn Ads, Campaign Management — 21 total Q&As. Closes with "Still have questions?" → Contact CTA.

---

## 8. Get Started (`/get-started`)

Minimal standalone quick-capture page — H1 "Let's get started," one compact lead form (`source="quick-form"`). No other content. Likely used as an ad-campaign destination URL.

---

## 9. Team pages (`/team/umer-khan`, `/team/waseem-nazir`) — no index page

Both pages use an identical layout: a profile-photo card (with contact methods) + a two-column bio/expertise/achievements block.

- **Umer Khan** — Senior PPC Specialist/Account Manager, 20+ years, bio emphasizes "$50M+ ad spend," Google Premier Partner, Meta Blueprint Certified, "30+ e-commerce brands past 7-figures." Photo `/team/umer-khan.png`. Core Expertise (6 items) / Key Achievements (6 items) two-column. CTA: "Hire Me on Upwork" → `/google-ads-expert-upwork-umer-khan`, plus "Back to About Us."
- **Waseem Nazir** — Google/Microsoft/Meta Ads Specialist, GA4/GTM focus, "229 jobs / 25K hours / 4.9 rating / 157 reviews" on Upwork. Note: his bio lists him as "Waseem Niazi" on the Academy — a naming inconsistency worth fixing in the redesign. Photo `/team/waseem-nazir.png`. Links out directly to his own Upwork profile.

---

## 10. Upwork landing page (`/google-ads-expert-upwork-umer-khan`)

**Purpose:** SEO/referral landing page for Umer Khan's personal Upwork hire page — a hybrid personal-brand + agency page.

**Sections:** Hero ("Top Rated" badge, headline "Hire Me on Upwork," subhead "Google Ads Expert - PPC Specialist," intro paragraph) → 6-stat strip (Top Rated / 100% Job Success / <2hrs Response / 80%+ Repeat Clients / Fluent English / 250%+ Avg ROI) → "About My Upwork Services" + 3 highlight cards → 6 "Specialized Services" cards (Google/PPC Optimization/Strategy Consulting/Meta/TikTok/Amazon, each with 4 sub-bullets) → 5-step "How to Work With Me" process → 3 client testimonial cards (Sarah J., Michael T., Elena R.) → final CTA (Upwork button + "Schedule Free Consultation" → `/contact`).

---

## 11. Legal pages (`/privacy-policy`, `/terms-of-service`) + embed lead form

Both legal pages use a shared `<LegalPage>` component (title, "updated" date, intro, array of heading+body sections) — plain long-form legal text, last updated 2 Aug 2026. Privacy Policy covers: info collected (forms, UTM tracking), usage, GA/GTM analytics cookies, etc. Standard legal styling — low design priority but should stay readable/on-brand.

`/embed/lead-form` isn't a real "page" — it's a `noindex` iframe-embeddable bare lead form (used to embed the form elsewhere, e.g. inside landing pages hosted off-platform). No chrome. Supports a dynamic form-by-ID variant.

---

## 12. Campaign landing pages — a distinct design-system family

These are fundamentally different in design language from the rest of the site — built as isolated, self-contained, high-conversion campaign pages (own color palettes, own fonts in some cases, sticky mobile CTA bars, animated floating stat cards, fake ad-preview mockups). **Treat these as a separate design system, not a reskin of the main site.**

### `/ads/dermatologists`
Long-form, dark "dashboard" aesthetic matching the main site's primary-blue theme. Sections: Hero w/ sticky audit form ("See the 3 searches stealing your patients"), trust badges row, a real case-study callout (honestly discloses it's showing a dental/physio case study, not actual dermatology, for integrity), an interactive AdPreviews component (mocked Google/Meta/TikTok ad units), an interactive SearchPreview (city-input toggle "managed vs unmanaged" demo), a patient-journey 5-step funnel, an interactive ClinicWebsitePreview mockup, 4 treatment-specific campaign cards (Acne/Laser/Hair loss/Injectables), a 4-part "playbook" (Ads/SEO/Website/Software), the same 3-tier pricing ($500/$1,000/$1,500), a 90-day roadmap (4 phases), a scrolling trust-logo marquee, an Umer Khan bio block, a healthcare-compliance disclaimer box, an FAQ accordion (6 Qs), and a sticky mobile CTA bar.

### `/lp/dermatologist`
A **second, simpler** dermatologist landing page — light blue/white palette, its own isolated header/footer (hardcoded absolute URLs back to the main site). Sections: hero with floating animated stat cards (+78% appointments, mini bar chart, testimonial bubble) over a hero photo, platform logos strip, 4 "challenge" cards, a 7-step patient journey icon row, 6 services cards, 6 treatment cards w/ real custom photography, a Google Ads mockup section, a Meta/Instagram ad mockup (phone frame), final CTA. **Note the redundancy:** two separate dermatologist landers exist (`/ads/dermatologists` and `/lp/dermatologist`) with different designs and overlapping purpose — worth raising whether to consolidate.

### `/lp/property-dealer`
Luxury real-estate aesthetic — custom fonts (serif display + sans body), ink-navy/gold/paper color palette, real custom photography for 4 listing types (Residential Plots, Houses & Villas, Apartments & Flats, Commercial — with PKR pricing, Pakistani locations: DHA Lahore, Bahria Town Karachi, Gulberg, Blue Area Islamabad). A 3-step pipeline (listings go live → buyers inquire → book site visit), 6 services. Distinct visual identity from every other page on the site.

### `/lp/restaurant`
The moodiest, most premium of the landers — near-black background with a saffron accent, a custom display headline font, full-bleed food photography, sticky in-page anchor nav (Services/Proof/Process/Fit/FAQs/Audit). 12 services cards (far more than the other landers — includes TikTok, Bing, social management, events). Features the Newport Beach Restaurant case study embedded directly in-page as social proof, with its own sticky CTA. 4 audience segments (fine dining/quick service/family/delivery). The FAQ section notably hedges results language carefully — no overpromising.

---

## 13. Academy / Study Portal (xpertppc.net skin)

### `/courses` (academy landing)
Composed of many sub-sections: hero, how-it-works, course grid, trust strip, benefits, testimonials, outcomes, proof, meeting-booking CTA, FAQ, final CTA. Positioning is deliberate: **"Meet us first. Then we decide your skills and price."** — explicitly not a self-serve course checkout. Flow: book a meeting (no payment) → interview about background → mentors decide skill path + price → portal access. 8 skill tracks offered: SEM, SEO, Social Media Marketing, Graphic Design, Video Editing, Frontend Dev, Backend Dev, Full-Stack Dev — but only SEM/SEO/Social have dedicated detail pages (Design/Video/Dev tracks have no detail page yet — a content gap to flag). 4 testimonials, 6 benefits, 3 outcomes (Freelancing/Career/Own projects), FAQ (6 Qs), final CTA.

### `/xpert-ppc-digital-academy/[slug]` — 3 pages (sem, seo, social-media-marketing)
Course detail template: hero (name, description, "Book a discovery meeting" + "View Curriculum" + WhatsApp CTAs), "Who Can Join?" audience cards (Students/Beginners/Freelancers/Business Owners/etc.), Course Overview + skills chip list + Course Features grid, Tools Covered grid, an accordion curriculum (SEM has 10 modules, each with detailed lesson lists), Course Requirements (laptop/internet/Google Meet/notes), closing CTA.

### Courses app utility pages (not marketing, low design priority)
`/courses/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify`, `/application`, `/applied`, `/dashboard`, `/learn/[slug]` — the actual LMS/portal screens behind auth, not public marketing content.

---

## 14. Excluded from scope

`/admin/*` — internal CRM/dashboard tool (clients, courses, students, login). Not public-facing, not part of a marketing-site redesign.

---

## 15. Key things to flag to the designer before starting

1. **Four separate header/footer design systems** currently coexist (main / lp / ads / academy). Decide: unify them, or intentionally keep campaign pages visually separate (common practice for paid-traffic landers that need to stand alone from brand nav).
2. **Two competing dermatologist landing pages** (`/ads/dermatologists` vs `/lp/dermatologist`) — redundant, different quality/depth, worth consolidating.
3. **No index pages** for `/industries` and `/team` — only reachable via nav dropdown/footer links, no browsable gallery.
4. Most service/industry imagery is **generic stock photography**, not branded/real — a good opportunity to replace with real or custom-illustrated assets, especially the industries "portfolio" sections which currently show unrelated stock photos captioned as "our work."
5. Pricing packages are **templated identically** ($500/$1,000/$1,500) across all 6 industries — not visually or substantively differentiated per industry today.
6. The Newport Beach Restaurant case study has unusually careful "estimated/reported" disclaimer language compared to other case studies' confident headline-metric style — intentional, keep that tone in any redesign of that specific page.
7. The Academy/Study Portal section only has 3 of 8 advertised skill tracks with real detail pages (Design, Video, Frontend, Backend, Full-Stack have no page yet).
