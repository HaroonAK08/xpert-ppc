import type { IconName } from '../types';

export type CaseStudyContent = {
  slug: string;
  client: string;
  title: string;
  subtitle: string;
  excerpt: string;
  industry: string;
  duration: string;
  channels: string[];
  heroImage: string;
  metrics: { value: string; label: string; icon: IconName }[];
  intro: string;
  pillarsHeading: string;
  pillarsIntro: string;
  pillars: { title: string; description: string; icon: IconName }[];
  takeawaysHeading: string;
  takeawaysIntro: string;
  takeaways: { title: string; description: string }[];
  approach: string[];
  servicesDeployed: string[];
  featured?: boolean;
  seo: { title: string; description: string; keywords: string[] };
};

const HERO = {
  ecommerce:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
  legal:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
  local:
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
  health:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
  whisky:
    'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1600&q=80',
  toys:
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80',
  gold:
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80',
  desert:
    'https://horizons-cdn.hostinger.com/63fcbc2b-b25a-4691-84cb-d8d88c4d6854/4fb1db486c2b087c186ea7f7fecf5c7b.png',
};

export const desertFarms: CaseStudyContent = {
  slug: 'desert-farms',
  client: 'Desert Farms',
  title: 'Desert Farms Case Study',
  subtitle: '12+ Years of SEO, Google Ads & Meta Ads Growth',
  excerpt:
    'How Xpert PPC grew Desert Farms into a dominant camel-milk eCommerce brand with SEO, Google Ads, and Meta Ads.',
  industry: 'eCommerce — Specialty Food & Beverages',
  duration: '12+ years',
  channels: ['SEO', 'Google Ads', 'Meta Ads'],
  heroImage: HERO.desert,
  featured: true,
  metrics: [
    { value: '8×', label: 'Google Ads Sales Lift', icon: 'TrendingUp' },
    { value: '10×', label: 'Organic Sales Growth', icon: 'BarChart3' },
    { value: '+41%', label: 'Website Traffic', icon: 'MousePointerClick' },
    { value: '+25%', label: 'New Customers (6 mo)', icon: 'Target' },
  ],
  intro:
    'For over a decade, Xpert PPC has partnered with Desert Farms (desertfarms.com) to pioneer the camel milk market online. What started as a niche product offering became a dominant eCommerce brand through technical SEO, Google Ads scaling, and targeted Meta campaigns.',
  pillarsHeading: 'What It Takes to Succeed in Camel Milk',
  pillarsIntro:
    'Scaling a specialized product needs a full-funnel strategy that educates, captures intent, and retargets effectively.',
  pillars: [
    {
      title: 'In-depth Keyword Research',
      description: 'High-intent terms like “camel milk benefits” and “buy camel milk online”.',
      icon: 'Search',
    },
    {
      title: 'Content Strategy',
      description: 'Educational content that builds trust in a niche category.',
      icon: 'FileText',
    },
    {
      title: 'Technical SEO',
      description: 'Mobile-first UX, site architecture, and crawl health.',
      icon: 'Settings',
    },
    {
      title: 'Google Ads Management',
      description: 'Search, Shopping, and Performance Max for bottom-funnel demand.',
      icon: 'Rocket',
    },
    {
      title: 'Meta Ads Campaigns',
      description: 'Awareness and retargeting across Facebook & Instagram.',
      icon: 'Megaphone',
    },
    {
      title: 'Conversion Tracking',
      description: 'Precise measurement for every paid and organic touchpoint.',
      icon: 'Target',
    },
  ],
  takeawaysHeading: 'The Power of Integrated Marketing',
  takeawaysIntro: 'Key takeaways from a long-term SEO + paid partnership.',
  takeaways: [
    {
      title: 'Google Ads as a Growth Engine',
      description:
        'Restructuring around high-LTV customers and Performance Max drove an 8× sales lift through paid search.',
    },
    {
      title: 'SEO as the Foundation',
      description:
        'Keyword research, on-page work, content, and link building established Desert Farms as the camel-milk authority.',
    },
    {
      title: 'Compounding Brand Awareness',
      description:
        'Display and social visibility helped win 25% more new customers in six months.',
    },
    {
      title: 'Long-term Partnership',
      description:
        '12+ years of continuous optimization produced compounding returns short-term tactics cannot match.',
    },
  ],
  approach: [
    'We act as an extension of the client team — deeply invested in long-term profitability, not churn-and-burn retainers.',
    'SEO feeds paid search efficiency, and social prospecting fuels search demand across the full funnel.',
  ],
  servicesDeployed: [
    'Google Ads Management',
    'Meta Ads (Facebook & Instagram)',
    'Search Engine Optimization (SEO)',
    'Google Shopping & Performance Max',
    'Advanced Conversion Tracking',
  ],
  seo: {
    title: 'Desert Farms Case Study | Xpert PPC',
    description:
      'Discover how Xpert PPC drove massive growth for Desert Farms using SEO, Google Ads, and Meta Ads.',
    keywords: ['Desert Farms case study', 'camel milk marketing', 'eCommerce PPC case study'],
  },
};

export const ecommerceGrowth: CaseStudyContent = {
  slug: 'ecommerce-growth',
  client: 'U.S. eCommerce Brand',
  title: 'eCommerce Growth Case Study',
  subtitle: '553% ROAS with smarter Google Ads bidding & feed optimization',
  excerpt:
    'A U.S. eCommerce store cut wasteful spend and hit 553% ROAS with Target ROAS bidding, feed labels, and remarketing.',
  industry: 'eCommerce — Consumer Products',
  duration: '30-day optimization window',
  channels: ['Google Ads', 'Shopping', 'Remarketing'],
  heroImage: HERO.ecommerce,
  featured: true,
  metrics: [
    { value: '553%', label: 'ROAS', icon: 'TrendingUp' },
    { value: '$32.7K', label: 'Conversion Value', icon: 'BarChart3' },
    { value: '$23.85', label: 'Cost per Conversion', icon: 'Target' },
    { value: '1.73K', label: 'Qualified Clicks', icon: 'MousePointerClick' },
  ],
  intro:
    'The client had steady traffic but inefficient Google Ads — high acquisition costs and unstable ROAS. They partnered with Xpert PPC to lower cost per conversion and grow revenue without raising spend.',
  pillarsHeading: 'Optimization Playbook',
  pillarsIntro: 'Every dollar was pointed at profitable products and high-intent audiences.',
  pillars: [
    {
      title: 'Target ROAS Bidding',
      description: 'Switched bidding to prioritize efficiency over raw volume.',
      icon: 'Target',
    },
    {
      title: 'Product Feed Labels',
      description: 'Custom labels highlighted high-margin, high-performing SKUs.',
      icon: 'Settings',
    },
    {
      title: 'Dynamic Remarketing',
      description: 'Recovered cart abandoners with product-level ads.',
      icon: 'Megaphone',
    },
    {
      title: 'Audience Segmentation',
      description: 'Device, location, and in-market refinements reduced waste.',
      icon: 'Search',
    },
  ],
  takeawaysHeading: 'Key Wins',
  takeawaysIntro: 'Results from the post-optimization window.',
  takeaways: [
    {
      title: 'Dramatic ROAS Surge',
      description: 'ROAS reached 553.47% — roughly 5.5× return on ad spend.',
    },
    {
      title: 'Strong Revenue Impact',
      description: 'Generated $32,700 in sales from only 1.73K clicks.',
    },
    {
      title: 'Low Cost per Sale',
      description: 'Cost per conversion held at $23.85, below typical eCommerce averages.',
    },
    {
      title: 'Smarter Spend',
      description: 'Paused weak SKUs and focused budget on products that actually convert.',
    },
  ],
  approach: [
    'We rebuilt the account around profitable products, not vanity traffic.',
    'Remarketing and intent audiences closed the loop so spend scaled only where ROAS held.',
  ],
  servicesDeployed: [
    'Google Shopping Ads',
    'Target ROAS Bidding',
    'Product Feed Optimization',
    'Dynamic Remarketing',
  ],
  seo: {
    title: 'eCommerce Google Ads Case Study | Xpert PPC',
    description: 'How Xpert PPC drove 553% ROAS for a U.S. eCommerce brand with Google Ads.',
    keywords: ['eCommerce Google Ads case study', 'ROAS optimization', 'Shopping ads'],
  },
};

export const onlineBlackmailLaw: CaseStudyContent = {
  slug: 'online-blackmail-law-firm',
  client: 'Online Blackmail Law Firm',
  title: 'Google Ads Turnaround for a Law Firm',
  subtitle: 'From wasted budget to profitable conversions',
  excerpt:
    'Same click volume, better leads: CPA dropped from $162 to $126 while saving $72K in ad spend.',
  industry: 'Legal Services',
  duration: '4–6 weeks',
  channels: ['Google Ads'],
  heroImage: HERO.legal,
  featured: true,
  metrics: [
    { value: '-22%', label: 'Cost per Acquisition', icon: 'TrendingUp' },
    { value: '+11.4%', label: 'Conversions', icon: 'BarChart3' },
    { value: '$72K', label: 'Ad Spend Saved', icon: 'Target' },
    { value: '$126', label: 'New CPA', icon: 'MousePointerClick' },
  ],
  intro:
    'The firm was spending heavily on Google Ads with impressions and clicks — but almost no real business. An audit showed $565K spent at $162 per conversion with inefficient traffic.',
  pillarsHeading: 'What We Fixed',
  pillarsIntro: 'A multi-layered rebuild of targeting, ads, bidding, and tracking.',
  pillars: [
    {
      title: 'Refined Targeting',
      description: 'Phrase/exact match, intent audiences, and aggressive negatives.',
      icon: 'Search',
    },
    {
      title: 'Ad Structure Rebuild',
      description: 'Relevant copy aligned with landing pages and DKI.',
      icon: 'FileText',
    },
    {
      title: 'Smart Bidding',
      description: 'Target CPA with budget shifted to winning ad groups.',
      icon: 'Rocket',
    },
    {
      title: 'Landing & Tracking',
      description: 'Faster pages, clearer CTAs, and proper conversion tracking.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: 'After Optimization',
  takeawaysIntro: 'Nearly the same clicks — far better efficiency.',
  takeaways: [
    {
      title: 'Spend Down, Results Up',
      description: 'Budget fell from $565K to $493K while conversions rose 3.5K → 3.9K.',
    },
    {
      title: 'CPA Cut by 22%',
      description: 'Cost per lead dropped from $162 to $126.',
    },
    {
      title: 'Quality Over Volume',
      description: 'Click volume stayed flat (~35.9K) while conversion efficiency jumped.',
    },
    {
      title: 'Client Confidence Restored',
      description:
        '“It feels like we’re finally running real ads… Same budget — but we’re seeing results.”',
    },
  ],
  approach: [
    'We treated the account like a turnaround: stop the leaks first, then scale what converts.',
    'Every change was measured against CPA and lead quality — not vanity metrics.',
  ],
  servicesDeployed: [
    'Google Ads Audit',
    'Search Campaign Restructuring',
    'Target CPA Bidding',
    'Landing Page & Tracking Fixes',
  ],
  seo: {
    title: 'Law Firm Google Ads Case Study | Xpert PPC',
    description: 'How Xpert PPC cut a law firm’s Google Ads CPA by 22% and saved $72K.',
    keywords: ['law firm Google Ads', 'CPA reduction case study', 'legal PPC'],
  },
};

export const edwardSmith: CaseStudyContent = {
  slug: 'edward-smith-seo',
  client: 'Edward Smith Law',
  title: 'Edward Smith SEO Case Study',
  subtitle: 'From invisible to 102K organic clicks',
  excerpt:
    'Strategic SEO for edsmithlaw.com drove 102K clicks and 6.41M impressions with white-hat, sustainable growth.',
  industry: 'Legal Services',
  duration: 'Sept 2021 – Jan 2022',
  channels: ['SEO'],
  heroImage: HERO.legal,
  metrics: [
    { value: '102K', label: 'Organic Clicks', icon: 'MousePointerClick' },
    { value: '6.41M', label: 'Impressions', icon: 'BarChart3' },
    { value: '2,500+', label: 'Daily Clicks (peak)', icon: 'TrendingUp' },
    { value: '8%', label: 'Bounce Rate (from 30%)', icon: 'Target' },
  ],
  intro:
    'Edward Smith Law (edsmithlaw.com) needed organic visibility in a competitive legal niche. Xpert PPC executed a full-spectrum SEO program spanning technical audits, content depth, and internal linking.',
  pillarsHeading: 'SEO Strategy Implemented',
  pillarsIntro: 'White-hat tactics only — built for lasting rankings.',
  pillars: [
    {
      title: 'Technical Audits',
      description: 'Screaming Frog crawls and crawl-health fixes.',
      icon: 'Settings',
    },
    {
      title: 'Keyword Research',
      description: 'Ahrefs & Ubersuggest for opportunity keywords.',
      icon: 'Search',
    },
    {
      title: 'Content Depth',
      description: '3,000+ word posts with full Yoast green scores.',
      icon: 'FileText',
    },
    {
      title: 'Internal Linking',
      description: '150+ contextual links audited and optimized.',
      icon: 'Rocket',
    },
  ],
  takeawaysHeading: 'Wins & Highlights',
  takeawaysIntro: 'Organic performance surge during the campaign window.',
  takeaways: [
    {
      title: 'Traffic Explosion',
      description: 'Grew from ~3 daily clicks to over 2,500/day at peak.',
    },
    {
      title: 'Engagement Improved',
      description: 'Bounce rate fell from 30% to 8%.',
    },
    {
      title: 'On-Page Excellence',
      description: '15/15 Yoast SEO checks passed across optimized content.',
    },
    {
      title: 'Sustainable Growth',
      description: 'Zero black-hat tactics — rankings built to last.',
    },
  ],
  approach: [
    'We combined Search Console data with content and linking systems that search engines reward long term.',
  ],
  servicesDeployed: [
    'Technical SEO',
    'Content Optimization',
    'Internal Linking',
    'Keyword Research',
  ],
  seo: {
    title: 'Edward Smith SEO Case Study | Xpert PPC',
    description: 'How SEO drove 102K organic clicks for Edward Smith Law.',
    keywords: ['legal SEO case study', 'Edward Smith Law', 'organic traffic growth'],
  },
};

export const galadariLaw: CaseStudyContent = {
  slug: 'galadari-law-seo',
  client: 'Galadari Law',
  title: 'Galadari Law SEO Case Study',
  subtitle: 'From 3 clicks/day to 2,500+ with full-spectrum SEO',
  excerpt:
    'Personal injury firm GaladariLaw.com scaled organic traffic to 102K clicks and 6.41M impressions in six months.',
  industry: 'Legal Services — Personal Injury',
  duration: '6 months',
  channels: ['SEO'],
  heroImage: HERO.legal,
  featured: true,
  metrics: [
    { value: '2,500+', label: 'Daily Organic Clicks', icon: 'TrendingUp' },
    { value: '102K', label: 'Total Clicks', icon: 'MousePointerClick' },
    { value: '50+', label: 'New Page-1 Keywords', icon: 'Search' },
    { value: '8%', label: 'Bounce Rate', icon: 'Target' },
  ],
  intro:
    'Galadari Law needed search visibility for competitive personal-injury queries. We closed SEO gaps, rebuilt content, and layered city + service internal links.',
  pillarsHeading: 'Full-Spectrum SEO',
  pillarsIntro: 'From gap analysis to content scoring and GSC monitoring.',
  pillars: [
    {
      title: 'SEO Gap Analysis',
      description: 'Identified missing topics, thin pages, and crawl issues.',
      icon: 'Search',
    },
    {
      title: 'Content Optimization',
      description: '3,600+ word pages with strong keyphrase density and schema.',
      icon: 'FileText',
    },
    {
      title: 'City + Service Links',
      description: 'Internal links like “Longmont Car Accident Lawyer”.',
      icon: 'Rocket',
    },
    {
      title: 'Measurement Stack',
      description: 'Ahrefs, SEMrush, Surfer, GSC, and Analytics.',
      icon: 'BarChart3',
    },
  ],
  takeawaysHeading: 'Before vs After',
  takeawaysIntro: 'Six months of disciplined SEO execution.',
  takeaways: [
    {
      title: 'From Invisible to Dominant',
      description: 'Daily clicks rose from 3–5 to 2,500+.',
    },
    {
      title: 'Massive Impression Share',
      description: '6.41 million impressions across the growth window.',
    },
    {
      title: 'Page-One Expansion',
      description: '50+ new keywords reached page one.',
    },
    {
      title: 'Better Engagement',
      description: 'Bounce rate dropped from 30% to 8%.',
    },
  ],
  approach: [
    'We treated SEO as a system: technical health, content depth, internal authority, and continuous GSC feedback.',
  ],
  servicesDeployed: [
    'Technical SEO',
    'Content Strategy',
    'Internal Linking',
    'Rank Tracking',
  ],
  seo: {
    title: 'Galadari Law SEO Case Study | Xpert PPC',
    description: 'How Xpert PPC grew Galadari Law from 3 to 2,500+ organic clicks per day.',
    keywords: ['Galadari Law SEO', 'personal injury SEO', 'legal SEO case study'],
  },
};

export const locksAroundTheClock: CaseStudyContent = {
  slug: 'locks-around-the-clock',
  client: 'Locks Around The Clock',
  title: 'Locks Around The Clock Case Study',
  subtitle: '145% more conversions with lower CPL in 4 months',
  excerpt:
    '24/7 locksmith lead growth: conversions up 145% while cost per conversion fell from $27.43 to $18.87.',
  industry: 'Local Services — Locksmith',
  duration: 'Dec 2024 – Apr 2025',
  channels: ['Google Ads'],
  heroImage: HERO.local,
  metrics: [
    { value: '+145%', label: 'Conversions Growth', icon: 'TrendingUp' },
    { value: '$18.87', label: 'Best Cost/Conv', icon: 'Target' },
    { value: '338', label: 'Peak Monthly Conversions', icon: 'BarChart3' },
    { value: '2×+', label: 'Click Volume', icon: 'MousePointerClick' },
  ],
  intro:
    'Locks Around The Clock needed consistent high-quality leads without inflating CPL in a competitive local niche.',
  pillarsHeading: 'Optimization Strategies',
  pillarsIntro: 'Budget scaling with bid efficiency and cleaner query traffic.',
  pillars: [
    {
      title: 'Maximize Conversions',
      description: 'Bidding with manual CPC guardrails while scaling budgets.',
      icon: 'Rocket',
    },
    {
      title: 'Query Hygiene',
      description: 'Exact match focus and ongoing negative keyword cleanup.',
      icon: 'Search',
    },
    {
      title: 'Ad Extensions',
      description: 'Monthly copy refreshes, callouts, and snippets.',
      icon: 'Megaphone',
    },
    {
      title: 'Segmented Structure',
      description: 'Campaigns split by device and intent for control.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: 'Performance Highlights',
  takeawaysIntro: 'Dec 2024 → Mar/Apr 2025.',
  takeaways: [
    {
      title: 'Conversions Surged',
      description: 'Grew from 138 conversions in Dec to 338 in March (+145%).',
    },
    {
      title: 'CPL Improved',
      description: 'Cost per conversion dropped from $27.43 to $18.87.',
    },
    {
      title: 'Scaled Without Waste',
      description: 'Spend and clicks rose while efficiency held.',
    },
    {
      title: 'Stable Lead Engine',
      description: 'April maintained 300+ conversions at ~$20 CPL.',
    },
  ],
  approach: [
    'We scaled only after CPL proved stable — growth without protecting efficiency is just expensive noise.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Bid Strategy Optimization',
    'Keyword & Query Management',
    'Ad Copy Testing',
  ],
  seo: {
    title: 'Locksmith Google Ads Case Study | Xpert PPC',
    description: 'How Locks Around The Clock grew conversions 145% while cutting CPL.',
    keywords: ['locksmith Google Ads', 'local lead gen case study', 'CPL reduction'],
  },
};

export const jjGoldBuyers: CaseStudyContent = {
  slug: 'jj-gold-buyers',
  client: 'J&J Gold Buyers',
  title: 'J&J Gold Buyers Case Study',
  subtitle: '63% lower cost per conversion and 3× leads in 5 months',
  excerpt:
    'Strategic Google Ads optimization for a Palm Desert gold & silver buyer cut CPA sharply while tripling lead volume.',
  industry: 'Local Services — Precious Metals',
  duration: '5 months',
  channels: ['Google Ads'],
  heroImage: HERO.gold,
  metrics: [
    { value: '-63%', label: 'Cost per Conversion', icon: 'TrendingUp' },
    { value: '3×', label: 'Lead Volume', icon: 'BarChart3' },
    { value: '5 mo', label: 'Optimization Window', icon: 'Target' },
    { value: 'Search', label: 'Primary Channel', icon: 'Search' },
  ],
  intro:
    'J&J Gold Buyers faced high cost per conversion and low lead volume early on. Over five months, structured optimization turned the account into a reliable lead engine for selling gold and silver in Palm Desert.',
  pillarsHeading: 'What Drove the Turnaround',
  pillarsIntro: 'Keyword quality, creative testing, and bid discipline.',
  pillars: [
    {
      title: 'Keyword Refinement',
      description: 'Removed low-intent terms; focused on bottom-funnel queries.',
      icon: 'Search',
    },
    {
      title: 'Ad Copy Testing',
      description: 'Monthly A/B tests with urgency and benefit-led messaging.',
      icon: 'Megaphone',
    },
    {
      title: 'Bid Adjustments',
      description: 'Shifted spend toward converting segments and geos.',
      icon: 'Rocket',
    },
    {
      title: 'Tracking Integrity',
      description: 'GA4 + Google Ads conversion accuracy restored.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: 'Outcomes',
  takeawaysIntro: 'From expensive leads to scalable local demand.',
  takeaways: [
    {
      title: 'CPA Cut Dramatically',
      description: 'Cost per conversion reduced by approximately 63%.',
    },
    {
      title: 'Lead Volume Tripled',
      description: 'Qualified inquiries grew roughly 3× over five months.',
    },
    {
      title: 'Better Traffic Mix',
      description: 'Geo and device limits stopped budget leaks.',
    },
    {
      title: 'Repeatable Structure',
      description: 'Search ad groups by service, then PMax for expansion.',
    },
  ],
  approach: [
    'Local high-ticket services need ruthless query control — we bought intent, not curiosity.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Performance Max',
    'Conversion Tracking',
    'Creative Testing',
  ],
  seo: {
    title: 'J&J Gold Buyers Case Study | Xpert PPC',
    description: 'How Xpert PPC cut CPA 63% and tripled leads for J&J Gold Buyers.',
    keywords: ['gold buyers Google Ads', 'local PPC case study', 'CPA reduction'],
  },
};

export const locksmithPlumbing: CaseStudyContent = {
  slug: 'locksmith-plumbing-leads',
  client: 'Locksmith & Plumbing Services',
  title: 'Locksmith & Plumbing Lead Gen Case Study',
  subtitle: '1,059 conversions in 90 days under $25 CPL',
  excerpt:
    'Data-driven Google Ads for emergency locksmith & plumbing services delivered 1,000+ leads with ~30% conversion rates.',
  industry: 'Local Services — Home Services',
  duration: 'Jul – Sep 2025',
  channels: ['Google Ads'],
  heroImage: HERO.local,
  metrics: [
    { value: '1,059', label: 'Conversions (90 days)', icon: 'BarChart3' },
    { value: '30%+', label: 'Avg Conversion Rate', icon: 'TrendingUp' },
    { value: '<$25', label: 'Avg Cost per Lead', icon: 'Target' },
    { value: '350', label: 'Peak Monthly Leads', icon: 'MousePointerClick' },
  ],
  intro:
    'This home-services provider needed emergency locksmith and plumbing leads with stable CPL. Continuous keyword, bid, and landing-page optimization produced a consistent lead pipeline.',
  pillarsHeading: 'Strategy Implemented',
  pillarsIntro: 'High-intent local search with urgency-driven creatives.',
  pillars: [
    {
      title: 'Intent Keywords',
      description: 'Queries like “24/7 locksmith near me” and “car lockout”.',
      icon: 'Search',
    },
    {
      title: 'Smart Bidding',
      description: 'Maximize Conversions with target CPA and dayparting.',
      icon: 'Rocket',
    },
    {
      title: 'Urgency Creative',
      description: '“Locked Out? Get Help in 15 Minutes!” style messaging.',
      icon: 'Megaphone',
    },
    {
      title: 'Landing Speed',
      description: 'Faster forms, reviews, and click-to-call CTAs.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: '90-Day Results',
  takeawaysIntro: 'Consistent performance across July–September 2025.',
  takeaways: [
    {
      title: 'Four-Digit Lead Volume',
      description: '1,059 conversions generated in three months.',
    },
    {
      title: 'Elite Conversion Rates',
      description: 'Monthly conversion rates held near 27–35%.',
    },
    {
      title: 'Cost Discipline',
      description: 'Average cost per conversion stayed under $25.',
    },
    {
      title: 'Local Visibility',
      description: 'Stronger share of voice for “locksmith near me” queries.',
    },
  ],
  approach: [
    'Emergency services win on speed and intent — we matched ads, bids, and landing experience to that moment of need.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Call Extensions',
    'Landing Page Optimization',
    'Negative Keyword Management',
  ],
  seo: {
    title: 'Locksmith & Plumbing Ads Case Study | Xpert PPC',
    description: '1,059 Google Ads conversions in 90 days for locksmith & plumbing services.',
    keywords: ['locksmith PPC', 'plumbing Google Ads', 'local lead generation'],
  },
};

export const metaArdnamurchan: CaseStudyContent = {
  slug: 'meta-ads-ardnamurchan',
  client: 'Ardnamurchan Distillery',
  title: 'Meta Ads Case Study',
  subtitle: 'From low performance to high-impact Facebook & Instagram ROI',
  excerpt:
    'Premium Scottish whisky brand unlocked purchase-driven Meta campaigns with strong ROAS on lean budgets.',
  industry: 'eCommerce — Spirits & Beverage',
  duration: 'Multi-campaign rebuild',
  channels: ['Meta Ads'],
  heroImage: HERO.whisky,
  metrics: [
    { value: '$25K+', label: 'Purchase Revenue', icon: 'BarChart3' },
    { value: 'High', label: 'Campaign ROAS', icon: 'TrendingUp' },
    { value: '32', label: 'Initiate Checkouts', icon: 'MousePointerClick' },
    { value: '25', label: 'Add-to-Carts', icon: 'Target' },
  ],
  intro:
    'Ardnamurchan Distillery wanted Meta ads that drove purchases — not vanity engagement. Prior campaigns had low ROAS, generic creatives, and no funnel structure.',
  pillarsHeading: 'Our Approach',
  pillarsIntro: 'Creative storytelling plus conversion-focused structure.',
  pillars: [
    {
      title: 'Product-Centric Creative',
      description: 'Heritage, premium quality, and limited-edition appeal.',
      icon: 'Megaphone',
    },
    {
      title: 'Audience Segmentation',
      description: 'Whisky lovers, collectors, and purchaser lookalikes.',
      icon: 'Target',
    },
    {
      title: 'Funnel Campaigns',
      description: 'Purchase, ATC, checkout, and retargeting layers.',
      icon: 'Rocket',
    },
    {
      title: 'Lean Testing Budget',
      description: 'Scale only after pixel and ROAS proved out.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: 'Campaign Highlights',
  takeawaysIntro: 'Purchase-oriented actions at efficient cost.',
  takeaways: [
    {
      title: 'Real Revenue',
      description: 'Top purchase campaign generated $25,043+ in website purchases.',
    },
    {
      title: 'Full-Funnel Signal',
      description: 'ATC and checkout campaigns fed retargeting with warm intent.',
    },
    {
      title: 'Budget Discipline',
      description: 'Low daily spend still produced measurable sales outcomes.',
    },
    {
      title: 'Scalable Playbook',
      description: 'Clear funnel data for confident future scaling.',
    },
  ],
  approach: [
    'Alcohol eCommerce needs precise creative and targeting — we optimized for purchases, not likes.',
  ],
  servicesDeployed: [
    'Meta Ads Strategy',
    'Creative Development',
    'Conversion Campaigns',
    'Retargeting',
  ],
  seo: {
    title: 'Meta Ads Case Study | Ardnamurchan Distillery | Xpert PPC',
    description: 'How Meta Ads unlocked purchase ROI for Ardnamurchan Distillery.',
    keywords: ['Meta Ads case study', 'Facebook ads ROAS', 'whisky advertising'],
  },
};

export const googleAdsRoas: CaseStudyContent = {
  slug: 'google-ads-roas-600',
  client: 'Established eCommerce Brand',
  title: 'Google Ads ROAS Case Study',
  subtitle: 'From 150% ROAS to 600% in one year',
  excerpt:
    'Comprehensive Google Ads rebuild lifted ROAS from 150% to 600% while growing online sales.',
  industry: 'eCommerce',
  duration: '12 months',
  channels: ['Google Ads', 'Shopping'],
  heroImage: HERO.ecommerce,
  featured: true,
  metrics: [
    { value: '600%', label: 'Final ROAS', icon: 'TrendingUp' },
    { value: '4×', label: 'ROAS Improvement', icon: 'BarChart3' },
    { value: '150%→600%', label: 'Journey', icon: 'Rocket' },
    { value: '12 mo', label: 'Partnership', icon: 'Target' },
  ],
  intro:
    'An established eCommerce brand was stuck at ~150% ROAS. Xpert PPC audited campaigns, rebuilt Search & Shopping structure, and layered testing, CRO, and retargeting.',
  pillarsHeading: 'Solution Stack',
  pillarsIntro: 'Audit → research → structured campaigns → continuous optimization.',
  pillars: [
    {
      title: 'Campaign Audit',
      description: 'Found waste in keywords, ads, and landing paths.',
      icon: 'Search',
    },
    {
      title: 'Search & Shopping',
      description: 'Category-focused ad groups and shopping structure.',
      icon: 'Rocket',
    },
    {
      title: 'A/B Testing',
      description: 'Copy, visuals, and CTAs iterated weekly.',
      icon: 'Sparkles',
    },
    {
      title: 'Retargeting',
      description: 'Re-engaged visitors who didn’t purchase.',
      icon: 'Megaphone',
    },
  ],
  takeawaysHeading: 'Year-One Results',
  takeawaysIntro: 'Efficiency and sales grew together.',
  takeaways: [
    {
      title: 'ROAS ×4',
      description: 'Return on ad spend climbed from 150% to 600%.',
    },
    {
      title: 'Sales Growth',
      description: 'Online sales exceeded targets as efficiency improved.',
    },
    {
      title: 'Brand Reach',
      description: 'Targeted traffic expanded awareness with new customers.',
    },
    {
      title: 'Data Cadence',
      description: 'Budget increases followed proven performance — not hope.',
    },
  ],
  approach: [
    'We refused to scale a broken account. Efficiency first, then volume.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Shopping Campaigns',
    'Landing Page CRO',
    'Retargeting',
  ],
  seo: {
    title: 'Google Ads 600% ROAS Case Study | Xpert PPC',
    description: 'How Xpert PPC grew an eCommerce brand from 150% to 600% ROAS.',
    keywords: ['Google Ads ROAS case study', 'eCommerce PPC', 'Shopping ads'],
  },
};

export const rafplay: CaseStudyContent = {
  slug: 'rafplay',
  client: 'Rafplay',
  title: 'Rafplay Case Study',
  subtitle: 'Revolutionizing outdoor play & ride-on toy sales',
  excerpt:
    'Google Ads and Performance Max for rafplay.com targeted parents and families searching for kids’ ride-on toys.',
  industry: 'eCommerce — Outdoor Play / Toys',
  duration: 'Ongoing growth program',
  channels: ['Google Ads', 'Performance Max'],
  heroImage: HERO.toys,
  metrics: [
    { value: 'PMax', label: 'Full-Funnel Reach', icon: 'Rocket' },
    { value: 'Parents', label: 'Core Audience', icon: 'Target' },
    { value: 'High Intent', label: 'Keyword Focus', icon: 'Search' },
    { value: 'CRO', label: 'Landing Pages', icon: 'Settings' },
  ],
  intro:
    'Rafplay (rafplay.com) sells outdoor play and ride-on products. Xpert PPC built parent-focused Google Ads with Performance Max coverage and category landing pages.',
  pillarsHeading: 'Google Ads Strategy',
  pillarsIntro: 'Intent capture for families shopping kids’ ride-on toys.',
  pillars: [
    {
      title: 'Audience Targeting',
      description: 'Parents segmented by age and interest signals.',
      icon: 'Target',
    },
    {
      title: 'Keyword Focus',
      description: 'Queries like “kids ride-on cars” and “electric ride-on toys”.',
      icon: 'Search',
    },
    {
      title: 'Benefit Creatives',
      description: 'Durability, safety, and variety in ad messaging.',
      icon: 'Megaphone',
    },
    {
      title: 'Landing Pages',
      description: 'Category pages designed for clearer purchase paths.',
      icon: 'FileText',
    },
  ],
  takeawaysHeading: 'What Worked',
  takeawaysIntro: 'A playbook built for toy & outdoor eCommerce.',
  takeaways: [
    {
      title: 'Intent Over Broad Reach',
      description: 'Parent + product intent queries outperformed generic traffic.',
    },
    {
      title: 'Performance Max Lift',
      description: 'PMax extended reach across Search, Display, YouTube, and Shopping.',
    },
    {
      title: 'Creative Clarity',
      description: 'Safety and durability claims improved message match.',
    },
    {
      title: 'Page Experience',
      description: 'Dedicated category landers improved conversion paths.',
    },
  ],
  approach: [
    'Toy purchases are researched carefully — we matched ads and pages to that parent decision journey.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Performance Max',
    'Landing Page Optimization',
    'Audience Targeting',
  ],
  seo: {
    title: 'Rafplay Case Study | Xpert PPC',
    description: 'How Xpert PPC grew Rafplay ride-on toy sales with Google Ads.',
    keywords: ['Rafplay case study', 'toy Google Ads', 'Performance Max'],
  },
};

export const peoplesFirm: CaseStudyContent = {
  slug: 'peoples-firm',
  client: "The People's Firm",
  title: "The People's Firm Case Study",
  subtitle: 'Digital growth for a veteran-centric law practice',
  excerpt:
    'SEO, Google Ads, and content helped The People’s Firm PLLC reach veterans seeking disability and appeals support.',
  industry: 'Legal Services — Veterans Law',
  duration: '6+ months',
  channels: ['SEO', 'Google Ads', 'Content'],
  heroImage: HERO.legal,
  metrics: [
    { value: '+30%', label: 'Website Traffic', icon: 'TrendingUp' },
    { value: '2.54%', label: 'Conversion Rate', icon: 'Target' },
    { value: 'VA Law', label: 'Niche Focus', icon: 'Briefcase' },
    { value: 'Search', label: 'Primary Channel', icon: 'Search' },
  ],
  intro:
    "The People's Firm is a veteran-centric practice specializing in Veterans Law and Disability — including medical exams, asset protection, and VA appeal reviews. Competing in legal search required precision messaging and trustworthy content.",
  pillarsHeading: 'Growth Strategy',
  pillarsIntro: 'Reach heroes and families actively seeking VA legal help.',
  pillars: [
    {
      title: 'Keyword Refinement',
      description: 'High-intent veteran and disability legal queries.',
      icon: 'Search',
    },
    {
      title: 'Ad Testing',
      description: 'Benefit-driven and urgency-based creatives.',
      icon: 'Megaphone',
    },
    {
      title: 'Content Authority',
      description: 'Educational materials that build trust with veterans.',
      icon: 'FileText',
    },
    {
      title: 'Tracking Cleanup',
      description: 'Accurate GA4 and Google Ads conversion reporting.',
      icon: 'Settings',
    },
  ],
  takeawaysHeading: 'Results',
  takeawaysIntro: 'Visibility and conversion improvements for a specialized legal niche.',
  takeaways: [
    {
      title: 'Traffic Growth',
      description: 'Website traffic increased about 30% over six months.',
    },
    {
      title: 'Stronger Rankings',
      description: 'Improved positions for core veterans-law search terms.',
    },
    {
      title: 'Brand Awareness',
      description: 'Content and search visibility expanded firm recognition.',
    },
    {
      title: 'Paid + Organic Alignment',
      description: 'Search, PMax, and remarketing supported the same services.',
    },
  ],
  approach: [
    'Veteran legal marketing demands empathy and clarity — we optimized for qualified inquiries, not raw clicks.',
  ],
  servicesDeployed: [
    'Google Ads',
    'SEO',
    'Content Marketing',
    'Conversion Tracking',
  ],
  seo: {
    title: "The People's Firm Case Study | Xpert PPC",
    description: "How Xpert PPC grew traffic and leads for The People's Firm PLLC.",
    keywords: ['veterans law marketing', 'legal PPC case study', "People's Firm"],
  },
};

export const dentalPhysio: CaseStudyContent = {
  slug: 'dental-physiotherapy-clinics',
  client: 'Dental & Physiotherapy Clinics',
  title: 'Healthcare & Cosmetic Clinics Case Study',
  subtitle: 'Scalable patient leads via Google Ads',
  excerpt:
    'Service-segmented Google Ads for dental and physiotherapy clinics improved lead volume while keeping CPL optimized.',
  industry: 'Healthcare — Dental & Physiotherapy',
  duration: 'Jul – Sep 2025',
  channels: ['Google Ads'],
  heroImage: HERO.health,
  metrics: [
    { value: '33', label: 'Sep Conversions', icon: 'BarChart3' },
    { value: '$41.98', label: 'Best Cost/Conv', icon: 'Target' },
    { value: '2', label: 'Service Campaigns', icon: 'Settings' },
    { value: 'Local', label: 'Geo Targeting', icon: 'Search' },
  ],
  intro:
    'This program generated appointment inquiries for dental and physiotherapy services through highly targeted Google Search Ads over a three-month optimization cycle.',
  pillarsHeading: 'Ads Strategy',
  pillarsIntro: 'Separate campaigns for each clinical service line.',
  pillars: [
    {
      title: 'Service Segmentation',
      description: 'Dedicated dental vs physiotherapy campaign structures.',
      icon: 'Settings',
    },
    {
      title: 'Local Intent Keywords',
      description: '“Best dental clinic near me”, “physiotherapy for back pain”.',
      icon: 'Search',
    },
    {
      title: 'Trust-Led Copy',
      description: 'Expertise, urgency, and same-day booking CTAs.',
      icon: 'Megaphone',
    },
    {
      title: 'Smart Bidding',
      description: 'Maximize Conversions with device and daypart insights.',
      icon: 'Rocket',
    },
  ],
  takeawaysHeading: 'Campaign Highlights',
  takeawaysIntro: 'June–September performance trajectory.',
  takeaways: [
    {
      title: 'Lead Volume Up',
      description: 'September delivered 33 conversions as structure matured.',
    },
    {
      title: 'CPL Efficiency',
      description: 'Cost per conversion improved to $41.98 in September.',
    },
    {
      title: 'Quality Traffic',
      description: 'Geo-radius targeting kept spend local and relevant.',
    },
    {
      title: 'Extension Lift',
      description: 'Call, location, and sitelink extensions boosted engagement.',
    },
  ],
  approach: [
    'Healthcare leads convert when intent is local and urgent — we mirrored that in keywords, copy, and extensions.',
  ],
  servicesDeployed: [
    'Google Search Ads',
    'Call Extensions',
    'Geo Targeting',
    'Conversion Optimization',
  ],
  seo: {
    title: 'Dental & Physiotherapy Google Ads Case Study | Xpert PPC',
    description: 'How Xpert PPC generated clinic appointment leads with Google Ads.',
    keywords: ['dental Google Ads', 'physiotherapy PPC', 'healthcare lead generation'],
  },
};

export const caseStudies: CaseStudyContent[] = [
  desertFarms,
  ecommerceGrowth,
  googleAdsRoas,
  galadariLaw,
  onlineBlackmailLaw,
  edwardSmith,
  peoplesFirm,
  locksAroundTheClock,
  locksmithPlumbing,
  jjGoldBuyers,
  metaArdnamurchan,
  rafplay,
  dentalPhysio,
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCaseStudies(limit = 3) {
  const featured = caseStudies.filter((c) => c.featured);
  return (featured.length ? featured : caseStudies).slice(0, limit);
}
