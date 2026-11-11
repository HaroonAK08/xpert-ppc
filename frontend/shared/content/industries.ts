import type { IconName } from '../types';

export type IndustryContent = {
  slug: string;
  name: string;
  icon: IconName;
  navDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  formIntro: string;
  bullets: string[];
  pillars: { title: string; description: string; icon: IconName }[];
  challengesHeading: string;
  challengesIntro: string;
  challenges: { title: string; description: string }[];
  processHeading: string;
  processIntro: string;
  process: { title: string; description: string; icon: IconName }[];
  testimonialsHeading: string;
  testimonialsSubheading: string;
  testimonials: { quote: string; name: string; role: string; rating: number }[];
  portfolio: { title: string; category: string; image: string }[];
  packagesIntro: string;
  packages: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
  }[];
  faqs: { question: string; answer: string }[];
  relatedCaseStudies: string[];
  seo: { title: string; description: string; keywords: string[] };
};

function defaultPackages(niche: string): IndustryContent['packages'] {
  return [
    {
      name: 'Launch',
      price: '$500',
      period: '/mo',
      description: `For ${niche} starting paid acquisition.`,
      features: [
        '1 Ad Platform (Google or Meta)',
        'Up to $5k ad spend managed',
        'Campaign build & tracking setup',
        'Monthly reporting',
      ],
    },
    {
      name: 'Growth',
      price: '$1,000',
      period: '/mo',
      description: `For ${niche} scaling qualified demand.`,
      features: [
        'Google + Meta Ads',
        'Up to $20k ad spend managed',
        'Conversion-optimized funnels',
        'Bi-weekly strategy calls',
        'Creative testing roadmap',
      ],
      popular: true,
    },
    {
      name: 'Domination',
      price: '$1,500',
      period: '/mo',
      description: `For multi-location or high-spend ${niche}.`,
      features: [
        'Omnichannel campaigns',
        'Unlimited ad spend management',
        'Dedicated account team',
        'Advanced analytics dashboard',
        'Priority creative production',
      ],
    },
  ];
}

function defaultProcess(focus: string): IndustryContent['process'] {
  return [
    {
      title: 'Audit',
      description: `We review your tracking, creatives, keywords, and competitive landscape for ${focus}.`,
      icon: 'Search',
    },
    {
      title: 'Strategy',
      description: 'A clear media plan with priorities, budgets, messaging, and conversion goals.',
      icon: 'ClipboardCheck',
    },
    {
      title: 'Launch',
      description: 'Campaigns, landing paths, and measurement go live with clean structure from day one.',
      icon: 'Rocket',
    },
    {
      title: 'Optimize',
      description: 'Weekly iteration on bids, creatives, and funnels so efficiency compounds over time.',
      icon: 'TrendingUp',
    },
  ];
}

export const dermatologists: IndustryContent = {
  slug: 'dermatologists',
  name: 'Dermatologists',
  icon: 'Stethoscope',
  navDescription: 'Patient acquisition for skin & aesthetic clinics',
  eyebrow: 'Marketing for Dermatology & Aesthetic Clinics',
  heroTitle: 'Fill Your Clinic With',
  heroHighlight: 'High-Value Patients',
  heroDescription:
    'We are a performance marketing agency dedicated to dermatologists and aesthetic practices. From acne treatments to laser and cosmetic procedures, we build data-driven campaigns that turn searches into booked consultations.',
  formIntro: 'Tell us about your clinic and we will map your patient-acquisition strategy.',
  bullets: [
    'Patient-acquisition funnels built for dermatology & aesthetic clinics',
    'Google & Meta Ads engineered for high-intent skincare searches',
    'HIPAA-conscious landing pages with medical-grade trust signals',
    'Average 3.4x increase in qualified consultation bookings',
  ],
  pillars: [
    {
      title: 'Precision Targeting',
      description:
        'Reach patients searching for acne, anti-aging, laser and cosmetic treatments in your service area.',
      icon: 'Target',
    },
    {
      title: 'Conversion Optimization',
      description: 'Landing pages and booking flows tuned to turn clicks into consultations.',
      icon: 'MousePointerClick',
    },
    {
      title: 'Reputation Growth',
      description:
        'Review-generation and retargeting systems that build lasting clinic authority.',
      icon: 'Star',
    },
  ],
  challengesHeading: 'What Dermatology Practices Struggle With',
  challengesIntro:
    'Most clinics do not need more traffic — they need the right patients booking the right procedures.',
  challenges: [
    {
      title: 'Broad traffic, weak bookings',
      description:
        'Generic beauty and skincare ads attract browsers instead of consultation-ready patients.',
    },
    {
      title: 'Expensive aesthetic keywords',
      description:
        'Laser, Botox, and cosmetic terms are competitive. Without structure, cost per consult climbs fast.',
    },
    {
      title: 'Trust gap online',
      description:
        'Patients compare clinics before calling. Weak landing pages and thin proof kill conversion rate.',
    },
    {
      title: 'Unclear attribution',
      description:
        'Calls, forms, and walk-ins are hard to connect back to ads — so budgets get cut for the wrong reasons.',
    },
  ],
  processHeading: 'How We Grow Dermatology Clinics',
  processIntro: 'A patient-acquisition system built around intent, trust, and booked consults.',
  process: defaultProcess('dermatology and aesthetic clinics'),
  testimonialsHeading: 'Trusted by Leading Clinics',
  testimonialsSubheading:
    'Dermatologists and aesthetic practices rely on Xpert PPC to grow booked consultations profitably.',
  testimonials: [
    {
      quote:
        'Xpert PPC filled our aesthetic treatment calendar within weeks. Our cost per booked consultation dropped by nearly half.',
      name: 'Dr. Sarah Whitman',
      role: 'Owner, Radiance Dermatology, Austin',
      rating: 5,
    },
    {
      quote:
        'The most data-driven agency we have worked with. Lead quality is dramatically higher and reporting is crystal clear.',
      name: 'Dr. Amir Haddad',
      role: 'Medical Director, Derma Lux Clinic, London',
      rating: 5,
    },
    {
      quote:
        'Their landing pages and ad creative feel truly premium and medical. Patient trust translated straight into revenue.',
      name: 'Dr. Elena Rossi',
      role: 'Founder, SkinLab Aesthetics, Milan',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Clinic Website Revamp',
      category: 'Web & Landing Pages',
      image:
        'https://images.unsplash.com/photo-1524221629551-6dd14def5ffd?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Skincare Ad Campaign',
      category: 'Social Creative',
      image:
        'https://images.unsplash.com/photo-1556217257-aa1d0c385e62?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Lead-Gen Performance',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1625296276703-3fbc924f07b5?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your clinic.',
  packages: defaultPackages('single-location clinics'),
  faqs: [
    {
      question: 'Which treatments do you advertise for?',
      answer:
        'Acne, anti-aging, injectables, laser, body contouring, medical dermatology, and other high-intent services your clinic offers.',
    },
    {
      question: 'Can you work with our existing website?',
      answer:
        'Yes. We often start by improving tracking and key landing pages, then expand into fuller site or funnel upgrades as results prove out.',
    },
    {
      question: 'How soon should we expect booked consultations?',
      answer:
        'Most clinics see clearer lead flow within the first 30–45 days once tracking, keywords, and landing paths are corrected.',
    },
    {
      question: 'Do you handle HIPAA-conscious marketing?',
      answer:
        'We avoid collecting unnecessary PHI in ads/forms and design patient journeys with medical trust and privacy in mind.',
    },
  ],
  relatedCaseStudies: [],
  seo: {
    title: 'Dermatology Marketing Agency | Xpert PPC',
    description:
      'Xpert PPC helps dermatology and aesthetic clinics attract high-intent patients through Google Ads, Meta Ads, and conversion-optimized landing pages.',
    keywords: [
      'dermatology marketing',
      'dermatologist PPC',
      'aesthetic clinic advertising',
      'patient acquisition',
    ],
  },
};

export const lawFirms: IndustryContent = {
  slug: 'law-firms',
  name: 'Law Firms',
  icon: 'Briefcase',
  navDescription: 'Qualified case inquiries for competitive legal niches',
  eyebrow: 'Performance Marketing for Law Firms',
  heroTitle: 'Win More',
  heroHighlight: 'Qualified Cases',
  heroDescription:
    'From personal injury and veterans law to specialized practices, we rebuild Google Ads and SEO so you stop paying for junk clicks and start booking real consultations.',
  formIntro: 'Tell us about your practice areas and we will outline a case-inquiry growth plan.',
  bullets: [
    'Legal search campaigns tuned for case quality — not vanity traffic',
    'SEO systems that grow organic authority in competitive practice areas',
    'Landing pages with trust, clarity, and intake-ready CTAs',
    'Proven CPA reductions and organic traffic lifts across legal accounts',
  ],
  pillars: [
    {
      title: 'Intent-First Keywords',
      description:
        'Phrase/exact structures, negatives, and practice-area ad groups that filter tire-kickers.',
      icon: 'Search',
    },
    {
      title: 'Intake Conversion',
      description: 'Message-matched ads and pages that push callers and form fills for viable cases.',
      icon: 'MousePointerClick',
    },
    {
      title: 'Authority SEO',
      description: 'Content, internal linking, and technical SEO for durable local/national rankings.',
      icon: 'FileText',
    },
  ],
  challengesHeading: 'What Law Firms Struggle With',
  challengesIntro:
    'Legal marketing fails when spend buys clicks that never become signed cases.',
  challenges: [
    {
      title: 'High CPC, low case quality',
      description:
        'Broad match and weak negatives burn budget on tire-kickers, job seekers, and out-of-area searches.',
    },
    {
      title: 'Intake friction',
      description:
        'Strong ads land on generic pages. Callers bounce before speaking with intake.',
    },
    {
      title: 'SEO that never compounds',
      description:
        'Thin practice-area pages and weak internal linking leave firms invisible for high-intent queries.',
    },
    {
      title: 'Unclear ROI by practice area',
      description:
        'Without practice-level tracking, partners cannot see which niches actually pay for themselves.',
    },
  ],
  processHeading: 'How We Grow Law Firm Pipelines',
  processIntro: 'From wasted legal spend to measurable consultation volume.',
  process: defaultProcess('law firms and practice areas'),
  testimonialsHeading: 'Trusted by Growing Law Firms',
  testimonialsSubheading:
    'Firms use Xpert PPC to lower CPA, lift organic authority, and fill intake with better cases.',
  testimonials: [
    {
      quote:
        'Same budget, better leads. Our cost per acquisition finally makes sense and intake volume is up.',
      name: 'Managing Partner',
      role: 'Consumer Law Practice',
      rating: 5,
    },
    {
      quote:
        'Organic traffic went from almost nothing to thousands of daily clicks. SEO became a real pipeline.',
      name: 'Marketing Director',
      role: 'Personal Injury Firm',
      rating: 5,
    },
    {
      quote:
        'They rebuilt our Google Ads from scratch. Qualified consultations rose while wasted spend disappeared.',
      name: 'Practice Owner',
      role: 'Specialized Legal Niche',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Legal Search Rebuild',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Practice-Area SEO',
      category: 'Organic Growth',
      image:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Intake Landing Pages',
      category: 'Conversion',
      image:
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your firm.',
  packages: defaultPackages('law firms'),
  faqs: [
    {
      question: 'Which practice areas do you support?',
      answer:
        'Personal injury, consumer protection, veterans/specialized niches, and other competitive legal categories with clear intake goals.',
    },
    {
      question: 'Do you only run Google Ads?',
      answer:
        'No. Many firms need Google Ads plus SEO and conversion-focused landing pages. We recommend the mix that matches your growth stage.',
    },
    {
      question: 'How do you improve lead quality?',
      answer:
        'Tight match types, aggressive negatives, geo filters, practice-area ad groups, and message-matched landing pages for intake.',
    },
    {
      question: 'Can you take over an underperforming account?',
      answer:
        'Yes. Account rebuilds are common — we audit structure, tracking, and creative, then relaunch with clearer economics.',
    },
  ],
  relatedCaseStudies: [
    'online-blackmail-law-firm',
    'edward-smith-seo',
    'galadari-law-seo',
    'peoples-firm',
  ],
  seo: {
    title: 'Law Firm Marketing Agency | Google Ads & SEO | Xpert PPC',
    description:
      'Xpert PPC helps law firms generate qualified case inquiries with Google Ads, SEO, and conversion-focused landing pages.',
    keywords: ['law firm Google Ads', 'legal SEO agency', 'attorney PPC', 'personal injury marketing'],
  },
};

export const ecommerce: IndustryContent = {
  slug: 'ecommerce',
  name: 'eCommerce',
  icon: 'ShoppingBag',
  navDescription: 'ROAS-focused Google, Shopping & Meta growth',
  eyebrow: 'Performance Marketing for Online Stores',
  heroTitle: 'Scale Revenue With',
  heroHighlight: 'Efficient ROAS',
  heroDescription:
    'We help eCommerce brands fix wasteful spend and scale profitably with Shopping, Search, Performance Max, remarketing, and Meta — measured on revenue, not vanity metrics.',
  formIntro: 'Tell us about your store, margins, and channels and we will map a ROAS growth plan.',
  bullets: [
    'Shopping & Search structures built around margin and product winners',
    'Target ROAS / smart bidding with feed and audience discipline',
    'Remarketing that recovers carts without burning budget',
    'Documented lifts from ~150% to 600% ROAS and 500%+ efficiency wins',
  ],
  pillars: [
    {
      title: 'Feed & Merchandising',
      description: 'Custom labels, product priorities, and SKU-level pause/scale decisions.',
      icon: 'Settings',
    },
    {
      title: 'Full-Funnel Paid',
      description: 'Prospecting + remarketing with clear purchase objectives on Google and Meta.',
      icon: 'Rocket',
    },
    {
      title: 'Measurement',
      description: 'Clean conversion tracking so every dollar maps to revenue and ROAS.',
      icon: 'BarChart3',
    },
  ],
  challengesHeading: 'What Online Stores Struggle With',
  challengesIntro: 'Growth stalls when spend scales faster than efficiency and product focus.',
  challenges: [
    {
      title: 'ROAS collapse at scale',
      description:
        'Campaigns look fine at low spend, then efficiency tanks the moment budgets increase.',
    },
    {
      title: 'Messy product feeds',
      description:
        'Weak titles, missing labels, and undifferentiated SKUs waste Shopping and PMax budget.',
    },
    {
      title: 'Remarketing that overpays',
      description:
        'Broad retargeting burns margin on low-intent visitors instead of recovering real carts.',
    },
    {
      title: 'Channel silos',
      description:
        'Google and Meta run in isolation with no shared view of contribution to revenue.',
    },
  ],
  processHeading: 'How We Scale eCommerce Profitably',
  processIntro: 'Feed discipline, bidding, and creative testing aimed at revenue efficiency.',
  process: defaultProcess('online stores and product catalogs'),
  testimonialsHeading: 'Trusted by Growing Online Brands',
  testimonialsSubheading:
    'DTC and catalog brands use Xpert PPC to lift ROAS while scaling paid media.',
  testimonials: [
    {
      quote:
        'ROAS jumped past 550% after the feed and bidding rebuild. We finally scaled without watching efficiency collapse.',
      name: 'Growth Lead',
      role: 'U.S. eCommerce Brand',
      rating: 5,
    },
    {
      quote: 'From stuck at 150% ROAS to 600% in a year. Clear reporting and no fluff.',
      name: 'Founder',
      role: 'DTC Online Store',
      rating: 5,
    },
    {
      quote:
        'Performance Max and Shopping finally made sense. Winners got budget; losers got paused.',
      name: 'Marketing Manager',
      role: 'Multi-SKU Retail Brand',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Shopping Efficiency',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Product Creative Tests',
      category: 'Meta Ads',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'ROAS Dashboards',
      category: 'Analytics',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your store.',
  packages: defaultPackages('online stores'),
  faqs: [
    {
      question: 'Do you manage Shopping and Performance Max?',
      answer:
        'Yes. Feed hygiene, custom labels, bidding, and audience signals are core to how we scale catalog brands.',
    },
    {
      question: 'What about Meta Ads for eCommerce?',
      answer:
        'We run prospecting and remarketing with purchase objectives, creative testing, and clear contribution to revenue.',
    },
    {
      question: 'How do you decide which products to push?',
      answer:
        'Margin, conversion rate, inventory, and historical efficiency — winners scale, weak SKUs get constrained or paused.',
    },
    {
      question: 'What tracking do you need?',
      answer:
        'Reliable purchase conversions (and ideally enhanced conversions / server-side where possible) so bidding optimizes to revenue.',
    },
  ],
  relatedCaseStudies: ['ecommerce-growth', 'google-ads-roas-600', 'rafplay'],
  seo: {
    title: 'eCommerce PPC Agency | ROAS Growth | Xpert PPC',
    description:
      'Xpert PPC scales eCommerce brands with Google Shopping, Search, Performance Max, and Meta Ads focused on profitable ROAS.',
    keywords: ['eCommerce Google Ads', 'Shopping ads agency', 'ROAS optimization', 'DTC PPC'],
  },
};

export const localServices: IndustryContent = {
  slug: 'local-services',
  name: 'Local Services',
  icon: 'MapPin',
  navDescription: 'High-intent leads for home & local service businesses',
  eyebrow: 'Lead Gen for Local & Home Services',
  heroTitle: 'Book More',
  heroHighlight: 'High-Intent Jobs',
  heroDescription:
    'Locksmiths, plumbing, precious-metals buyers, and other local operators — we build Google Ads that capture emergency and high-intent searches while protecting cost per lead.',
  formIntro: 'Tell us about your service area and we will map a local lead-generation plan.',
  bullets: [
    'Geo-radius and service-area campaigns for real local demand',
    'Urgency-led ad copy, call extensions, and mobile conversion paths',
    'Keyword hygiene that cuts junk queries and lowers CPL',
    'Case results including 1,000+ leads / 90 days and double-digit CPL cuts',
  ],
  pillars: [
    {
      title: 'Local Intent Capture',
      description: '“Near me” and emergency queries matched to the right service lines.',
      icon: 'Search',
    },
    {
      title: 'Call-Ready Funnels',
      description: 'Extensions, speed, and click-to-call experiences for mobile searchers.',
      icon: 'Megaphone',
    },
    {
      title: 'CPL Discipline',
      description: 'Bid strategies and negatives that scale volume without exploding cost.',
      icon: 'Target',
    },
  ],
  challengesHeading: 'What Local Operators Struggle With',
  challengesIntro: 'Local demand is high-intent — but only if geo, keywords, and calls are controlled.',
  challenges: [
    {
      title: 'Paying for the wrong zip codes',
      description:
        'Broad geos and weak location settings pull leads you cannot profitably serve.',
    },
    {
      title: 'Junk search queries',
      description:
        'DIY, DIY-jobs, employment, and competitor brand searches quietly inflate CPL.',
    },
    {
      title: 'Missed mobile calls',
      description:
        'Slow pages and weak call extensions lose emergency searchers in seconds.',
    },
    {
      title: 'Volume without margin',
      description:
        'Lead count climbs while booked jobs and close rates stay flat — because quality was never filtered.',
    },
  ],
  processHeading: 'How We Generate Local Leads',
  processIntro: 'Geo precision, query hygiene, and call-first conversion paths.',
  process: defaultProcess('local and home-service businesses'),
  testimonialsHeading: 'Trusted by Local Service Brands',
  testimonialsSubheading:
    'Locksmiths, home services, and local buyers use Xpert PPC to grow job-ready leads.',
  testimonials: [
    {
      quote:
        'Conversions grew over 140% while cost per lead dropped. We could finally scale spend with confidence.',
      name: 'Owner',
      role: '24/7 Locksmith Service',
      rating: 5,
    },
    {
      quote:
        'Over a thousand qualified leads in three months at a stable CPL. Reporting is clear every week.',
      name: 'Ops Manager',
      role: 'Home Services Company',
      rating: 5,
    },
    {
      quote:
        'Keyword cleanup alone changed the economics. We stopped paying for searches that never become jobs.',
      name: 'Owner',
      role: 'Precious Metals Buyer',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Emergency Search Ads',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Service-Area Landing Pages',
      category: 'Conversion',
      image:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Call Tracking Setup',
      category: 'Measurement',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your service area.',
  packages: defaultPackages('local service businesses'),
  faqs: [
    {
      question: 'Which local niches do you work with?',
      answer:
        'Locksmith, plumbing, home services, precious-metals buyers, and similar high-intent local categories.',
    },
    {
      question: 'Do you track phone calls?',
      answer:
        'Yes. Call tracking and call extensions are essential for local lead gen — we set measurement up as part of launch.',
    },
    {
      question: 'Can you run campaigns for multiple cities?',
      answer:
        'Yes. We structure by geo and service line so budgets and messaging stay controlled as you expand.',
    },
    {
      question: 'How fast can lead volume improve?',
      answer:
        'Many accounts see cleaner CPL and stronger call volume within the first month after keyword and geo cleanup.',
    },
  ],
  relatedCaseStudies: [
    'locks-around-the-clock',
    'jj-gold-buyers',
    'locksmith-plumbing-leads',
  ],
  seo: {
    title: 'Local Services Marketing Agency | Xpert PPC',
    description:
      'Xpert PPC generates high-intent local leads for locksmith, plumbing, and home service businesses with Google Ads.',
    keywords: [
      'local services Google Ads',
      'locksmith marketing',
      'home services PPC',
      'lead generation agency',
    ],
  },
};

export const healthcareClinics: IndustryContent = {
  slug: 'healthcare-clinics',
  name: 'Healthcare Clinics',
  icon: 'Heart',
  navDescription: 'Appointment leads for dental, physio & clinics',
  eyebrow: 'Patient Acquisition for Clinics',
  heroTitle: 'Fill The Schedule With',
  heroHighlight: 'Booked Appointments',
  heroDescription:
    'Dental, physiotherapy, and multi-service clinics need local, high-intent patients. We run service-segmented Google Ads that grow bookings while keeping cost per lead under control.',
  formIntro: 'Tell us about your clinic services and we will map an appointment-growth plan.',
  bullets: [
    'Separate campaigns per service line for cleaner intent and budgets',
    'Geo-targeted search for “near me” appointment demand',
    'Trust-led creatives, call extensions, and booking CTAs',
    'Proven clinic lead programs with optimized CPL as volume scales',
  ],
  pillars: [
    {
      title: 'Service Segmentation',
      description: 'Dental vs physio vs cosmetic structures so each offer gets the right query.',
      icon: 'Settings',
    },
    {
      title: 'Local Trust Ads',
      description: 'Copy and extensions that emphasize expertise, urgency, and easy booking.',
      icon: 'Megaphone',
    },
    {
      title: 'Appointment Focus',
      description: 'Tracking and optimization aimed at calls and form fills that become visits.',
      icon: 'Target',
    },
  ],
  challengesHeading: 'What Clinics Struggle With',
  challengesIntro: 'Appointment growth fails when every service shares one messy campaign.',
  challenges: [
    {
      title: 'Mixed-intent campaigns',
      description:
        'Dental, physio, and cosmetic queries compete in one budget — and the wrong services win spend.',
    },
    {
      title: 'Weak local visibility',
      description:
        'Patients searching “near me” never see a clear path to book with your clinic.',
    },
    {
      title: 'Leads that do not show',
      description:
        'Forms and calls look fine in ads, but appointment show rates stay low without trust and clarity.',
    },
    {
      title: 'No service-level ROI',
      description:
        'Owners cannot tell which treatments pay for acquisition and which drain the budget.',
    },
  ],
  processHeading: 'How We Fill Clinic Schedules',
  processIntro: 'Service-level campaigns built around booked appointments — not vanity clicks.',
  process: defaultProcess('dental, physio, and multi-service clinics'),
  testimonialsHeading: 'Trusted by Growing Clinics',
  testimonialsSubheading:
    'Dental, physiotherapy, and multi-service clinics use Xpert PPC to book more appointments.',
  testimonials: [
    {
      quote:
        'We finally see which services pay for themselves. Appointment volume is steadier and CPL is clearer.',
      name: 'Clinic Director',
      role: 'Multi-Service Healthcare Practice',
      rating: 5,
    },
    {
      quote:
        'Local search campaigns brought patients who were actually ready to book — not random traffic.',
      name: 'Practice Owner',
      role: 'Dental & Physiotherapy Clinic',
      rating: 5,
    },
    {
      quote:
        'Segmenting by service changed everything. Budgets stopped fighting each other and bookings rose.',
      name: 'Operations Lead',
      role: 'Outpatient Clinic Group',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Clinic Search Campaigns',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Service Landing Pages',
      category: 'Conversion',
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Call & Form Tracking',
      category: 'Measurement',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your clinic.',
  packages: defaultPackages('clinics'),
  faqs: [
    {
      question: 'Which clinic types do you support?',
      answer:
        'Dental, physiotherapy, cosmetic-adjacent, and multi-service outpatient clinics focused on appointment growth.',
    },
    {
      question: 'Should every service have its own campaign?',
      answer:
        'Usually yes for major service lines. Separate structures keep intent clean and make ROI visible per offer.',
    },
    {
      question: 'Do you help with booking pages?',
      answer:
        'Yes. Clear CTAs, trust signals, and mobile call paths are part of turning clicks into appointments.',
    },
    {
      question: 'How do you report results?',
      answer:
        'Leads, CPL, and service-level performance — so you can see which treatments deserve more budget.',
    },
  ],
  relatedCaseStudies: ['dental-physiotherapy-clinics'],
  seo: {
    title: 'Healthcare Clinic Marketing | Dental & Physio PPC | Xpert PPC',
    description:
      'Xpert PPC helps dental, physiotherapy, and healthcare clinics book more appointments with local Google Ads.',
    keywords: [
      'dental Google Ads',
      'physiotherapy marketing',
      'clinic patient acquisition',
      'healthcare PPC',
    ],
  },
};

export const foodBeverage: IndustryContent = {
  slug: 'food-beverage',
  name: 'Food & Beverage',
  icon: 'ShoppingCart',
  navDescription: 'Growth for specialty food, CPG & beverage brands',
  eyebrow: 'Growth Marketing for Food & Beverage Brands',
  heroTitle: 'Turn Niche Products Into',
  heroHighlight: 'Scalable Demand',
  heroDescription:
    'Specialty food, CPG, and premium beverage brands need education plus acquisition. We combine SEO, Google Ads, and Meta to build durable demand — from camel milk eCommerce to craft spirits.',
  formIntro: 'Tell us about your brand and channels and we will map a demand-generation plan.',
  bullets: [
    'Category education content that builds search authority',
    'Google + Meta funnels from awareness to purchase',
    'Creative that sells heritage, quality, and product benefits',
    'Long-term partnerships with compounding revenue lifts',
  ],
  pillars: [
    {
      title: 'Category SEO',
      description: 'Own the queries shoppers use when discovering specialty products.',
      icon: 'Search',
    },
    {
      title: 'Purchase Media',
      description: 'Search, Shopping, and Meta campaigns aimed at real orders — not vanity reach.',
      icon: 'Rocket',
    },
    {
      title: 'Brand Storytelling',
      description: 'Creatives that communicate quality, origin, and reasons to buy.',
      icon: 'Megaphone',
    },
  ],
  challengesHeading: 'What Food & Beverage Brands Struggle With',
  challengesIntro:
    'Niche products need education and acquisition working together — not random ads.',
  challenges: [
    {
      title: 'Category education gap',
      description:
        'Shoppers do not understand the product yet, so cold traffic converts poorly without content.',
    },
    {
      title: 'Paid media without brand lift',
      description:
        'Campaigns chase short-term sales while organic discovery and repeat demand stay weak.',
    },
    {
      title: 'Creative that does not sell',
      description:
        'Pretty lifestyle ads fail to communicate taste, origin, quality, or reasons to buy now.',
    },
    {
      title: 'Channel fragmentation',
      description:
        'SEO, Google Ads, and Meta run separately with no shared growth narrative.',
    },
  ],
  processHeading: 'How We Grow Food & Beverage Brands',
  processIntro: 'Education, acquisition, and creative that turn niche products into demand.',
  process: defaultProcess('specialty food, CPG, and beverage brands'),
  testimonialsHeading: 'Trusted by Specialty Food & Drink Brands',
  testimonialsSubheading:
    'CPG and beverage brands use Xpert PPC to compound organic and paid demand.',
  testimonials: [
    {
      quote:
        'Paid and organic finally worked together. Sales compounded year after year instead of resetting every quarter.',
      name: 'Brand Lead',
      role: 'Specialty Food eCommerce',
      rating: 5,
    },
    {
      quote:
        'Meta stopped being engagement theater and started driving purchases on a controlled budget.',
      name: 'Marketing Manager',
      role: 'Premium Beverage Brand',
      rating: 5,
    },
    {
      quote:
        'Category SEO put us in front of people already researching our niche. Ads then converted that demand.',
      name: 'Founder',
      role: 'Specialty CPG Brand',
      rating: 5,
    },
  ],
  portfolio: [
    {
      title: 'Specialty Product SEO',
      category: 'Organic Growth',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Beverage Meta Funnel',
      category: 'Meta Ads',
      image:
        'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Shopping Expansion',
      category: 'Google Ads',
      image:
        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packagesIntro: 'Transparent plans designed to scale with your brand.',
  packages: defaultPackages('food & beverage brands'),
  faqs: [
    {
      question: 'Do you work with alcohol brands?',
      answer:
        'Yes — including premium spirits — with platform-compliant Meta and Google strategies focused on efficient acquisition.',
    },
    {
      question: 'Is SEO useful for food brands?',
      answer:
        'Especially for specialty categories. Education content builds durable discovery that paid media can then convert.',
    },
    {
      question: 'Can you manage Google and Meta together?',
      answer:
        'Yes. We align messaging and measurement so both channels support the same revenue goals.',
    },
    {
      question: 'What results should we expect?',
      answer:
        'Clearer acquisition efficiency short term, and compounding organic + paid growth when the partnership runs long enough.',
    },
  ],
  relatedCaseStudies: ['desert-farms', 'meta-ads-ardnamurchan'],
  seo: {
    title: 'Food & Beverage Marketing Agency | Xpert PPC',
    description:
      'Xpert PPC grows specialty food, CPG, and beverage brands with SEO, Google Ads, and Meta performance campaigns.',
    keywords: [
      'food brand marketing',
      'beverage Google Ads',
      'CPG PPC agency',
      'specialty food SEO',
    ],
  },
};

export const industries = [
  dermatologists,
  lawFirms,
  ecommerce,
  localServices,
  healthcareClinics,
  foodBeverage,
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
