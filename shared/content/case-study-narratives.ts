/** Longer narrative copy pulled from the original case-study PDFs. */
export type CaseStudyNarrative = {
  challenge: string[];
  strategy: string[];
  results: string[];
  galleryNote?: string;
};

export const caseStudyNarratives: Record<string, CaseStudyNarrative> = {
  'desert-farms': {
    challenge: [
      'Desert Farms had an innovative camel-milk product but struggled to reach the right audience online. Website traffic was low and conversion rate was not meeting expectations.',
      'The niche required education as much as acquisition — shoppers needed to understand benefits before they would buy.',
    ],
    strategy: [
      'Google Ads: precise audience targeting, high-intent keywords, engaging ad copy, Performance Max for reach, and dedicated landing pages.',
      'SEO: in-depth keyword research (“camel milk benefits”, “buy camel milk online”), on-page optimization, educational content marketing, strategic link building, and mobile-first UX.',
      'Paid + organic worked as one system — SEO authority improved Quality Score and brand search, while ads captured demand SEO created.',
    ],
    results: [
      'Google Ads delivered an 8× increase in sales, stronger brand awareness via display, and about 25% more new customers within six months.',
      'SEO grew website traffic roughly 30–41%, improved rankings for core camel-milk queries, and contributed to about 10× sales growth of camel-milk products.',
      'Conversion rate improvements and compounding brand search made the account more efficient year after year across a 12+ year partnership.',
    ],
  },
  'ecommerce-growth': {
    challenge: [
      'A U.S. eCommerce store had steady traffic and sales, but Google Ads were inefficient — rising cost per conversion, unstable ROAS, and weak conversion value relative to spend.',
      'Bidding and audience targeting lacked structure, so the account could not scale profitably.',
    ],
    strategy: [
      'Switched to Target ROAS bidding for efficiency.',
      'Optimized the product feed and added high-performing custom labels.',
      'Implemented dynamic remarketing to recover cart abandoners.',
      'Refined audiences by device, location, and in-market interests; refreshed seasonal creatives; paused underperforming SKUs and focused on high-margin products.',
    ],
    results: [
      'Post-optimization (last 30 days): 1.73K clicks, $32.7K conversion value, $23.85 cost per conversion, and 553.47% ROAS.',
      'That is roughly a 5.5× return on ad spend with strong revenue from a relatively small click volume — proof the funnel, not just traffic, was fixed.',
    ],
  },
  'google-ads-roas-600': {
    challenge: [
      'An established eCommerce brand was stuck around 150% ROAS and needed a significant lift in online sales and campaign profitability.',
      'Existing campaigns needed a full audit across keywords, ad copy, shopping structure, landing pages, and budget allocation.',
    ],
    strategy: [
      'Comprehensive campaign audit to find waste and conversion leaks.',
      'Advanced keyword research for higher-value, lower-competition terms.',
      'Targeted Search and Shopping campaigns by product category and intent.',
      'Data-driven budget increases only after performance proved out; continuous A/B testing of ads; landing-page CRO; and retargeting for non-purchasers.',
    ],
    results: [
      'ROAS grew from 150% to 600% within 12 months — about a 4× improvement in efficiency.',
      'Online sales grew beyond initial targets while brand awareness expanded through better-qualified traffic.',
      'The account became a scalable growth channel instead of a break-even cost center.',
    ],
  },
  'galadari-law-seo': {
    challenge: [
      'GaladariLaw.com (personal injury) had almost no organic visibility — roughly 3–5 clicks per day and minimal Search impressions.',
      'Competitive legal keywords, thin content, and weak internal linking limited growth.',
    ],
    strategy: [
      'Full-spectrum SEO: gap analysis, technical crawl fixes, and content rebuilt around city + service intents.',
      'Long-form pages (3,600+ words) with strong on-page SEO scores, schema, alt text, and 150+ contextual internal links.',
      'Tooling stack included Ahrefs, SEMrush, Surfer SEO, Google Search Console, Analytics, Yoast, and Screaming Frog.',
    ],
    results: [
      'Organic performance surged to 102,000+ clicks and 6.41 million impressions.',
      'Daily clicks scaled from ~3 to 2,500+; bounce rate dropped from 30% to 8%; 50+ keywords moved onto page one.',
      'Visibility for competitive personal-injury queries became a durable lead source.',
    ],
  },
  'online-blackmail-law-firm': {
    challenge: [
      'The firm was spending heavily on Google Ads with lots of impressions and clicks but almost no meaningful business.',
      'Before optimization: ~35.8K clicks, ~3.5K conversions, $162 cost per conversion, and $565K total spend — efficiency was broken.',
    ],
    strategy: [
      'Refined targeting: phrase/exact match, buyer-intent audiences, and aggressive negative keywords.',
      'Revamped ads and landing pages for message match, trust, and clearer CTAs.',
      'Enabled Target CPA bidding, redistributed budget to winners, and fixed conversion tracking + remarketing.',
    ],
    results: [
      'After 4–6 weeks with nearly the same click volume: conversions 3.5K → 3.9K (+11.4%), CPA $162 → $126 (−22%), spend $565K → $493K (about $72K saved).',
      'Client feedback: leads finally flowed at a cost that made sense — same budget, real results.',
    ],
  },
  'edward-smith-seo': {
    challenge: [
      'edsmithlaw.com needed organic growth in a competitive legal category and was effectively invisible in search.',
    ],
    strategy: [
      'White-hat SEO only: technical audits (Screaming Frog), keyword research (Ahrefs/Ubersuggest), deep content (3,000+ words), Yoast green scores, and 150+ internal-link fixes.',
      'Continuous Search Console monitoring for CTR, impressions, and query opportunities.',
    ],
    results: [
      '102,000 organic clicks and 6.41 million impressions in the campaign window (Sept 2021–Jan 2022).',
      'Daily clicks rose from ~3 to 2,500+; bounce rate fell from 30% to 8%; average position and CTR improved with intent-matched titles.',
    ],
  },
  'peoples-firm': {
    challenge: [
      'The People’s Firm PLLC serves veterans with disability and VA appeals work — a competitive legal niche with trust and compliance sensitivity.',
      'Ranking and running ads was difficult against established firms; traffic and conversion expectations were not being met.',
    ],
    strategy: [
      'Keyword refinement toward high-intent veteran/disability queries; monthly ad creative testing; geo/device bid controls.',
      'Content and email touchpoints to educate veterans; Search + Performance Max structure; accurate GA4 and Google Ads tracking.',
    ],
    results: [
      'Website traffic grew about 30% over six months with a measured conversion rate around 2.54%.',
      'Improved keyword rankings and brand awareness for veterans actively searching for legal help.',
    ],
  },
  'locks-around-the-clock': {
    challenge: [
      '24/7 locksmith lead gen started with high CPL ($27.43 in Dec 2024), low click/conversion volume, weak segmentation, and messy keyword structure.',
    ],
    strategy: [
      'Maximize Conversions bidding with CPC guardrails; scale budgets only while protecting CPL.',
      'Exact-match and long-tail query focus; monthly ad refreshes and extensions; campaigns segmented by device and intent.',
    ],
    results: [
      'Dec 2024 → Mar 2025: conversions 138 → 338 (+145%); cost/conv $27.43 → $18.87.',
      'Clicks more than doubled to 1K+/month while efficiency held as spend scaled through Apr 2025.',
    ],
  },
  'locksmith-plumbing-leads': {
    challenge: [
      'Locksmith & plumbing search campaigns had fluctuating conversion rates and inconsistent cost per conversion despite solid demand for emergency services.',
    ],
    strategy: [
      'High-intent keywords (“24/7 locksmith near me”, “car lockout”), negatives for waste, Maximize Conversions / tCPA, urgency-led ad copy, call/location extensions, and faster landing pages with trust signals.',
    ],
    results: [
      'Jul–Sep 2025: 1,059 conversions in 90 days; average conversion rate near 30%+; average cost per conversion under $25.',
      'Monthly leads stayed strong (350 / 346 / 363) with stable efficiency in a competitive local market.',
    ],
  },
  'jj-gold-buyers': {
    challenge: [
      'J&J Gold Buyers (Palm Desert) faced high cost per conversion and low lead volume early in the period, despite offering specialized gold/silver buying services.',
    ],
    strategy: [
      'Removed low-intent keywords; introduced bottom-funnel terms; monthly ad A/B tests; bid adjustments on converting segments; geo/device limits; GA4 + Google Ads tracking fixes; Search structure by service then Performance Max expansion.',
    ],
    results: [
      'Over five months, strategic optimization cut cost per conversion by about 63% and roughly tripled lead volume.',
      'The account moved from expensive, scarce leads to a repeatable local demand engine.',
    ],
  },
  'meta-ads-ardnamurchan': {
    challenge: [
      'Ardnamurchan Distillery (premium Scotch) had underwhelming Meta results: low conversions, inefficient budget use, generic creatives, no funnel/retargeting, and weak ROAS.',
    ],
    strategy: [
      'Product-centric creative highlighting heritage and limited editions; audiences for whisky lovers, collectors, and purchaser lookalikes.',
      'Conversion campaigns for purchases, add-to-cart, and checkout; lean test budgets; scale only winners; tight pixel monitoring.',
    ],
    results: [
      'Purchase campaigns generated meaningful revenue (including ~$25K+ website purchase value on a top campaign) with strong ROAS on controlled spend.',
      'Add-to-cart and checkout campaigns created warm funnel data; retargeting recaptured interested buyers efficiently.',
    ],
  },
  rafplay: {
    challenge: [
      'Rafplay.com needed profitable acquisition for outdoor play / kids ride-on toys — a researched purchase where parents compare safety, durability, and value.',
    ],
    strategy: [
      'Parent-focused audience targeting; high-intent keywords (“kids ride-on cars”, “electric ride-on toys”); benefit-led creatives; Performance Max across Search, Display, YouTube, and Shopping; category landing pages.',
    ],
    results: [
      'Built a full-funnel Google Ads system aligned to parent intent instead of broad toy traffic.',
      'Clearer product-category landers and PMax coverage improved reach while keeping messaging matched to purchase decisions.',
    ],
  },
  'dental-physiotherapy-clinics': {
    challenge: [
      'Dental and physiotherapy clinics needed qualified appointment leads locally while keeping cost per lead under control as traffic scaled.',
    ],
    strategy: [
      'Separate campaigns for dental vs physiotherapy; geo-radius targeting; high-intent queries (“best dental clinic near me”, “physiotherapy for back pain”); trust/urgency ad copy; call & location extensions; Maximize Conversions bidding.',
    ],
    results: [
      'Jun–Sep 2025 performance matured to 33 conversions in September at $41.98 cost per conversion.',
      'Service segmentation and local intent kept lead quality high while spend scaled responsibly.',
    ],
  },
};
