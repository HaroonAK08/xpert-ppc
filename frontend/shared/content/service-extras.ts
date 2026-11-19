/**
 * Page content for /services/[slug] that does not belong in `services.ts`.
 *
 * `services.ts` is also consumed by `backend/src/seed/seed.ts`, which expects
 * `detail.process` to stay a `string[]`. Rather than change that contract, the
 * richer per-service copy lives here and the route merges the two. The process
 * titles below mirror `detail.process` on purpose — keep them in step if you
 * rename one there.
 */

export type ServiceExtras = {
  /** Replaces `detail.whyChooseUs`; kept free of unverifiable agency claims. */
  whyChooseUs: string[];
  /** "You probably need this if…" — symptoms a prospect recognises. */
  signals: string[];
  /** Same titles as `detail.process`, with what actually happens at each step. */
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  /** Alt text for the channel photo in `public/services/<slug>.webp`. */
  imageAlt: string;
  /** What the first 90 days actually look like, phase by phase. */
  firstNinetyDays: { window: string; title: string; description: string }[];
  /** Slugs from `case-studies.ts`. Empty where we have no published work yet. */
  relatedCaseStudies: string[];
};

export const serviceExtras: Record<string, ServiceExtras> = {
  'google-ads': {
    whyChooseUs: [
      'Google Partner expertise across Search, Shopping, Performance Max and YouTube',
      'Conversion tracking verified before a single bid is raised',
      'Documented outcomes, including a 150% → 600% ROAS rebuild',
    ],
    signals: [
      'Cost per conversion has climbed three months running',
      'Performance Max is absorbing budget and you cannot see where it goes',
      'Your search terms report shows traffic you would never buy on purpose',
      'Google Ads conversions do not match what your CRM or store records',
    ],
    process: [
      {
        title: 'Audit',
        description:
          'Account structure, search terms, conversion tracking and wasted spend reviewed before anything is recommended.',
      },
      {
        title: 'Strategy',
        description:
          'Campaign types, budget split and a target CPA or ROAS agreed in writing, sized against your margins.',
      },
      {
        title: 'Implementation',
        description:
          'Clean build: tight ad groups, negative keyword lists, correct conversion actions and offline import where it applies.',
      },
      {
        title: 'Optimization',
        description:
          'Weekly search term review, bid and budget shifts, plus ad copy and landing page tests that run one variable at a time.',
      },
      {
        title: 'Reporting',
        description:
          'A dashboard you can open whenever you like, and a written note on what changed and why it changed.',
      },
    ],
    faqs: [
      {
        question: 'How long before Google Ads performance changes?',
        answer:
          'Structural fixes show up in the search terms report within days. Meaningful CPA or ROAS movement usually takes two to four weeks, and smart bidding needs roughly 30 conversions in a 30-day window before it settles.',
      },
      {
        question: 'Do you rebuild the account or fix what I already have?',
        answer:
          'We start with what you have. A rebuild only makes sense when the existing structure blocks the data smart bidding needs — the audit tells you which case you are in before any work begins.',
      },
      {
        question: 'Who owns the Google Ads account?',
        answer:
          'You do. We work inside your account on your billing, and you keep full admin access during the engagement and after it ends.',
      },
      {
        question: 'Is Performance Max worth running?',
        answer:
          'Often, but only with a clean product feed, brand exclusions and proper conversion goals in place. Without those it tends to absorb budget from campaigns that were already converting and report the credit as its own.',
      },
      {
        question: 'What budget should I start with?',
        answer:
          'Enough to clear roughly 30 conversions a month at your current cost per conversion, otherwise automated bidding never gets reliable data. The free audit gives you that number for your market rather than a generic range.',
      },
    ],
    imageAlt:
      'A darkened desk workspace with monitors glowing blue',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Audit and stop the leaks',
        description:
          'Search terms cleaned, negatives applied, and conversion tracking reconciled against your CRM or store. Nothing gets scaled until the measurement is trustworthy.',
      },
      {
        window: 'Days 15–45',
        title: 'Rebuild the structure that earns',
        description:
          'Campaigns regrouped by intent, budget pulled off terms that never converted, and bidding moved onto goals that match your actual margin.',
      },
      {
        window: 'Days 46–90',
        title: 'Scale what holds its cost',
        description:
          'Winning themes expanded, ad copy and landing paths tested in sequence, and spend raised only while cost per conversion holds.',
      },
    ],
    relatedCaseStudies: ['google-ads-roas-600', 'ecommerce-growth', 'locksmith-plumbing-leads'],
  },

  'meta-ads': {
    whyChooseUs: [
      'Meta Ads specialists running Advantage+, retargeting and Reels in-house',
      'Pixel and Conversions API checked before spend is scaled',
      'A standing creative testing queue, so results survive ad fatigue',
    ],
    signals: [
      'Costs hold at low spend and fall apart the moment you scale',
      'The same creative has been running since last quarter',
      'Meta reports more purchases than your store actually recorded',
      'Retargeting outspends prospecting and the account keeps shrinking',
    ],
    process: [
      {
        title: 'Audience Research',
        description:
          'Customer data, pixel events and your existing best buyers reviewed before a single audience is built.',
      },
      {
        title: 'Creative Strategy',
        description:
          'Hooks, formats and angles planned as a testing queue — not one hero video and a hope.',
      },
      {
        title: 'Campaign Setup',
        description:
          'Clean structure with the Conversions API live, so signal loss does not leave the algorithm guessing.',
      },
      {
        title: 'A/B Testing',
        description:
          'Creative against creative, audience against audience, changing one variable at a time so the result means something.',
      },
      {
        title: 'Scaling',
        description:
          'Budget moved into whatever holds its cost per result as spend rises, with a refresh queue so winners do not fatigue.',
      },
    ],
    faqs: [
      {
        question: 'Why do Meta’s numbers not match my store?',
        answer:
          'Meta attributes on click and view windows; your store usually attributes last click. Some gap is normal. A large gap generally means the pixel or Conversions API is double counting or dropping events, which is the first thing we check.',
      },
      {
        question: 'How much creative do you need from us?',
        answer:
          'Whatever you already have is a starting point. We plan the testing queue and tell you which formats are missing, so most clients shoot to that brief rather than producing creative blind.',
      },
      {
        question: 'Does Advantage+ replace manual campaigns?',
        answer:
          'It replaces much of the manual audience work, not the judgement. It needs clean events, proper exclusions and enough creative variety — otherwise it finds your existing customers cheaply and reports that as growth.',
      },
      {
        question: 'How quickly can we scale spend?',
        answer:
          'In steps rather than jumps. Large daily budget changes reset the learning phase, so we raise budget while cost per result holds and pull back as soon as it does not.',
      },
      {
        question: 'Can you run Meta alongside Google Ads?',
        answer:
          'Yes, and we prefer to. Meta creates demand, search captures it, and keeping both in one measurement view stops the two channels claiming credit for the same conversion.',
      },
    ],
    imageAlt:
      'Hands holding a phone beside a laptop, scrolling a social feed',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Fix the signal first',
        description:
          'Pixel and Conversions API audited for duplicate and missing events, exclusions set, and your existing best buyers turned into seed audiences.',
      },
      {
        window: 'Days 15–45',
        title: 'Find the hooks that work',
        description:
          'A first batch of creative tested one variable at a time, so you learn which angle carries performance rather than which ad got lucky.',
      },
      {
        window: 'Days 46–90',
        title: 'Scale without breaking learning',
        description:
          'Budget stepped up on the winners, with a refresh queue replacing creative before fatigue shows up in cost per result.',
      },
    ],
    relatedCaseStudies: ['meta-ads-ardnamurchan', 'desert-farms'],
  },

  'tiktok-ads': {
    whyChooseUs: [
      'Creative-first: on TikTok the ad itself does most of the targeting',
      'Spark Ads run from creator handles rather than a cold brand account',
      'A weekly creative refresh planned in, not bolted on when results drop',
    ],
    signals: [
      'Your buyers are under 35 and you only buy search',
      'Creative that performs on Meta is flopping when you reuse it here',
      'Cost per result looks fine for a week, then collapses',
      'Organic posts get traction and you have no way to put budget behind them',
    ],
    process: [
      {
        title: 'Trend Analysis',
        description:
          'The sounds, formats and hooks working in your category right now — not the ones that worked last quarter.',
      },
      {
        title: 'Creative Development',
        description:
          'Native, shot-for-TikTok video. The polished brand film is usually the worst performer on this platform.',
      },
      {
        title: 'Influencer Partnerships',
        description:
          'Creator briefs and Spark Ads, so posts that already earned attention organically get paid reach.',
      },
      {
        title: 'Performance Tracking',
        description:
          'Hold rate, click-through and cost per result read per hook, so the next batch of creative is informed rather than guessed.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok work for anything other than consumer products?',
        answer:
          'It works wherever the offer can be shown in a few seconds. Considered and B2B purchases usually need it as a demand-creation channel that feeds search, rather than as a last-click sales channel.',
      },
      {
        question: 'Do we have to appear on camera?',
        answer:
          'No, though faces generally outperform product-only footage. Creators are the usual way around it, and Spark Ads let you run their post as your ad.',
      },
      {
        question: 'How often does creative need replacing?',
        answer:
          'Fatigue arrives quickly — often within two to three weeks at meaningful spend. We plan a rolling batch instead of waiting for performance to fall off.',
      },
      {
        question: 'Can you reuse our existing video?',
        answer:
          'Sometimes, re-cut around a vertical first-second hook. Reposting a finished widescreen brand film almost always underperforms.',
      },
      {
        question: 'What budget makes sense for a first test?',
        answer:
          'Enough to push several hooks past the learning threshold, rather than one ad trickling spend. We size that against your current cost per result during the audit.',
      },
    ],
    imageAlt:
      'A ring light and phone on a tripod set up to film short-form video',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Learn the category',
        description:
          'The hooks, sounds and formats currently working in your niche are catalogued, and the first creative brief is written against them.',
      },
      {
        window: 'Days 15–45',
        title: 'Test hooks, not ads',
        description:
          'Several openings run against the same offer, so you learn what stops the scroll before spending on polish.',
      },
      {
        window: 'Days 46–90',
        title: 'Build a creative engine',
        description:
          'Winning hooks handed to creators and run as Spark Ads, with a rolling batch replacing anything that fatigues.',
      },
    ],
    relatedCaseStudies: [],
  },

  'amazon-ads': {
    whyChooseUs: [
      'Judged on ACOS against margin, not on raw sales volume',
      'Listing and A+ content reviewed before any bid is raised',
      'Brand, competitor and discovery spend kept visibly separate',
    ],
    signals: [
      'ACOS keeps climbing while total sales stay flat',
      'Competitors are bidding on your brand name and winning',
      'You are profitable in aggregate but cannot say which ASIN carries it',
      'Your own campaigns are bidding against each other on the same keyword',
    ],
    process: [
      {
        title: 'Product Analysis',
        description:
          'Margin, review count, Buy Box health and listing quality checked first — ads cannot rescue a listing that does not convert.',
      },
      {
        title: 'Keyword Research',
        description:
          'Harvested from search term reports and competitor ASINs, then split into exact, phrase and discovery intent.',
      },
      {
        title: 'Campaign Strategy',
        description:
          'Sponsored Products, Brands and Display separated by intent so budgets stop competing with one another.',
      },
      {
        title: 'Bid Optimization',
        description:
          'Placement and keyword bids managed against a target ACOS, with negatives pruned every week.',
      },
      {
        title: 'Sales Growth',
        description:
          'Profitable terms scaled while discovery campaigns keep feeding new keywords into the exact-match core.',
      },
    ],
    faqs: [
      {
        question: 'What ACOS should I be targeting?',
        answer:
          'Whatever keeps you above break-even on contribution margin, which is a different number for every ASIN. We work backwards from your margin rather than quoting a category average.',
      },
      {
        question: 'Will ads fix a slow-selling listing?',
        answer:
          'Only if the listing already converts. Weak images, thin copy, few reviews or a lost Buy Box all cap conversion, and paid traffic simply makes that more expensive — so we check those first.',
      },
      {
        question: 'Do you manage Amazon DSP as well?',
        answer:
          'Yes, where the volume justifies it. Most accounts get further by fixing Sponsored Products structure first, so we rarely lead with DSP.',
      },
      {
        question: 'Can you run Amazon alongside our own store?',
        answer:
          'Yes. We report them separately so Amazon’s true cost per sale is not quietly subsidised by your direct channel, or the other way round.',
      },
      {
        question: 'How soon do bid changes show up?',
        answer:
          'Amazon’s reporting lags by roughly 48 hours and attribution windows run longer, so we judge changes over one to two weeks rather than reacting day to day.',
      },
    ],
    imageAlt:
      'Cardboard shipping boxes stacked on a warehouse shelf',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Audit the listing, not just the ads',
        description:
          'Margin, reviews, images, A+ content and Buy Box health checked per ASIN — paid traffic cannot rescue a listing that does not convert.',
      },
      {
        window: 'Days 15–45',
        title: 'Separate the spend',
        description:
          'Brand, competitor and discovery campaigns split apart so they stop bidding against each other, with negatives pruned every week.',
      },
      {
        window: 'Days 46–90',
        title: 'Scale against margin',
        description:
          'Profitable terms moved into exact match and funded properly, while discovery runs at a controlled budget to keep feeding the core.',
      },
    ],
    relatedCaseStudies: [],
  },

  'linkedin-ads': {
    whyChooseUs: [
      'Measured on qualified pipeline, not on raw lead count',
      'Lead Gen Forms wired into your CRM with source attribution attached',
      'Built for long B2B cycles, where last-click reporting misleads',
    ],
    signals: [
      'Lead volume looks healthy and sales says the quality is poor',
      'Your cost per lead is acceptable and your cost per opportunity is unknown',
      'You sell to a narrow job title no other channel can target',
      'Finance is asking what LinkedIn actually returned last quarter',
    ],
    process: [
      {
        title: 'Audience Targeting',
        description:
          'Job title, seniority, company size and firmographics narrowed to the people who can actually sign.',
      },
      {
        title: 'Content Strategy',
        description:
          'Offers worth a work email, rather than a "book a demo" button pointed at cold traffic.',
      },
      {
        title: 'Lead Nurturing',
        description:
          'Sequenced follow-up, so a lead who is not ready this quarter is still there next quarter.',
      },
      {
        title: 'CRM Integration',
        description:
          'Leads pushed into your CRM with campaign and source data attached, so sales can see where each one came from.',
      },
      {
        title: 'ROI Tracking',
        description:
          'Reported on qualified pipeline and closed revenue rather than on form fills.',
      },
    ],
    faqs: [
      {
        question: 'Why is LinkedIn so much more expensive per click?',
        answer:
          'You are paying for precision. A five-dollar click to an exact job title at an exact company size can beat a one-dollar click to nobody in particular — it is only expensive if you measure it on clicks instead of pipeline.',
      },
      {
        question: 'Lead Gen Forms, or send traffic to our site?',
        answer:
          'Forms convert far better but accept lower intent. We usually run both and judge them on what sales accepts, not on cost per lead.',
      },
      {
        question: 'What is a realistic minimum budget?',
        answer:
          'LinkedIn needs enough spend to clear meaningful impressions against a narrow audience. Thin budgets spread across several audiences deliver neither reach nor data, so we size it against your actual audience count at the audit.',
      },
      {
        question: 'Can you work with our existing CRM?',
        answer:
          'Yes. What matters is that campaign and source data arrive with the lead, so you can report on pipeline instead of guessing at it.',
      },
      {
        question: 'How long before we see pipeline, not just leads?',
        answer:
          'Leads arrive in the first few weeks; pipeline follows your sales cycle. For most B2B accounts a fair read takes one full cycle, commonly one to two quarters.',
      },
    ],
    imageAlt:
      'Two professionals in conversation across a table in a modern office',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Define who actually buys',
        description:
          'Job titles, seniority and company size narrowed with your sales team, and CRM fields prepared so source data survives the handoff.',
      },
      {
        window: 'Days 15–45',
        title: 'Earn the work email',
        description:
          'Offers tested against the audience, with Lead Gen Forms and site traffic run side by side and judged on what sales accepts.',
      },
      {
        window: 'Days 46–90',
        title: 'Report on pipeline',
        description:
          'Leads followed through to opportunities, so cost per lead stops being the headline number and cost per opportunity takes over.',
      },
    ],
    relatedCaseStudies: [],
  },

  'microsoft-ads': {
    whyChooseUs: [
      'Run as its own channel, not a copy-paste of your Google account',
      'LinkedIn company and job-title targeting layered onto search intent',
      'Usually the cheapest incremental search volume an account can add',
    ],
    signals: [
      'Google search is profitable but capped — you have run out of volume',
      'Your buyers skew older, or work on corporate Windows machines',
      'You imported from Google once and never touched it again',
      'You sell B2B and want search intent with firmographic targeting',
    ],
    process: [
      {
        title: 'Keyword Strategy',
        description:
          'Import from Google where it helps, then prune hard — search behaviour on this network is not identical.',
      },
      {
        title: 'Bid Management',
        description:
          'Bids set against this network’s own conversion data rather than inherited Google targets.',
      },
      {
        title: 'Audience Segmentation',
        description:
          'LinkedIn profile targeting layered on top of keywords, which no other search network offers.',
      },
      {
        title: 'Performance Analysis',
        description:
          'Reported separately from Google, so the lower cost per click stays visible instead of being averaged away.',
      },
    ],
    faqs: [
      {
        question: 'Is Microsoft Ads just Bing?',
        answer:
          'Bing is the largest part, alongside Yahoo, DuckDuckGo, AOL and Microsoft’s syndicated partners. Edge is also the default browser on most corporate Windows machines, which is where much of the B2B volume comes from.',
      },
      {
        question: 'Can I just import my Google campaigns?',
        answer:
          'Import is the starting point, not the finish. Volumes, match behaviour and competition all differ, so an untouched import usually overspends on terms that only made sense on Google.',
      },
      {
        question: 'How much volume should I expect?',
        answer:
          'Considerably less than Google in most markets, at a lower cost per click. It is additive volume rather than a replacement, which is precisely why it is worth running.',
      },
      {
        question: 'What makes it good for B2B?',
        answer:
          'It is the only search network where you can layer LinkedIn company, industry and job-function targeting on top of keyword intent.',
      },
      {
        question: 'Is it worth running on a small budget?',
        answer:
          'Often yes. Lower competition means a modest budget still clears meaningful impression share rather than disappearing into the auction.',
      },
    ],
    imageAlt:
      'A laptop on a dark desk with light leaking from the screen edge',
    firstNinetyDays: [
      {
        window: 'Days 1–14',
        title: 'Import, then prune',
        description:
          'Google structure brought across, then cut back to what this network’s own volume and match behaviour actually justify.',
      },
      {
        window: 'Days 15–45',
        title: 'Let it find its own bids',
        description:
          'Bidding moved onto this network’s conversion data instead of inherited Google targets, with LinkedIn profile targeting layered on where it fits.',
      },
      {
        window: 'Days 46–90',
        title: 'Prove the incremental volume',
        description:
          'Reported separately from Google, so you see the added conversions and the lower cost per click rather than an averaged blend.',
      },
    ],
    relatedCaseStudies: ['newport-beach-restaurant'],
  },
};

export function getServiceExtras(slug: string): ServiceExtras | undefined {
  return serviceExtras[slug];
}
