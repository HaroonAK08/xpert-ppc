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
  pillarsIntro: string;
  pillars: { title: string; description: string; icon: IconName }[];
  takeaways: { title: string; description: string }[];
  approach: string[];
  servicesDeployed: string[];
  seo: { title: string; description: string; keywords: string[] };
};

export const desertFarms: CaseStudyContent = {
  slug: 'desert-farms',
  client: 'Desert Farms',
  title: 'Desert Farms Case Study',
  subtitle: '12+ Years of SEO, Google Ads & Meta Ads Growth',
  excerpt:
    'Discover how Xpert PPC drove massive growth for Desert Farms over a 12+ year partnership using SEO, Google Ads, and Meta Ads.',
  industry: 'eCommerce — Health & Wellness',
  duration: '12+ years',
  channels: ['SEO', 'Google Ads', 'Meta Ads'],
  heroImage:
    'https://horizons-cdn.hostinger.com/63fcbc2b-b25a-4691-84cb-d8d88c4d6854/4fb1db486c2b087c186ea7f7fecf5c7b.png',
  metrics: [
    { value: '+178%', label: 'Organic Visibility', icon: 'TrendingUp' },
    { value: '+312%', label: 'Keywords in Top 10', icon: 'Search' },
    { value: '+165%', label: 'Google Ads Conversions', icon: 'MousePointerClick' },
    { value: '+214%', label: 'Meta Ads ROAS', icon: 'BarChart3' },
  ],
  intro:
    "For over a decade, Xpert PPC has partnered with Desert Farms to pioneer the camel milk market online. What started as a niche product offering has transformed into a dominant e-commerce brand. Through a relentless, integrated approach combining technical SEO, aggressive Google Ads scaling, and highly targeted Meta Ads, we've built a sustainable growth engine that continues to break revenue records year after year.",
  pillarsIntro:
    'Scaling a highly specialized product requires more than just turning on ads. It demands a full-funnel strategy that educates, captures intent, and retargets effectively.',
  pillars: [
    {
      title: 'In-depth Keyword Research',
      description: 'Identifying high-intent search terms for niche products.',
      icon: 'Search',
    },
    {
      title: 'Content Strategy',
      description: 'Creating authoritative, educational content to build trust.',
      icon: 'FileText',
    },
    {
      title: 'Technical SEO',
      description: 'Ensuring flawless site architecture and fast load times.',
      icon: 'Settings',
    },
    {
      title: 'Google Ads Management',
      description: 'Capturing bottom-of-funnel demand efficiently.',
      icon: 'Rocket',
    },
    {
      title: 'Meta Ads Campaigns',
      description: 'Driving awareness and retargeting across social platforms.',
      icon: 'Megaphone',
    },
    {
      title: 'Conversion Tracking',
      description: 'Implementing precise measurement for every touchpoint.',
      icon: 'Target',
    },
    {
      title: 'Continuous Testing',
      description: 'A/B testing creatives, copy, and landing pages.',
      icon: 'Sparkles',
    },
  ],
  takeaways: [
    {
      title: 'Google Ads as a Growth Engine',
      description:
        'By restructuring campaigns to focus on high-LTV customers and utilizing Performance Max, we significantly lowered CPA while scaling volume.',
    },
    {
      title: 'SEO as the Foundation',
      description:
        'A robust technical SEO overhaul combined with a targeted content strategy established Desert Farms as the undisputed authority in the camel milk niche.',
    },
    {
      title: 'Flawless Tracking',
      description:
        'Implementing advanced server-side tracking ensured that every dollar spent was accounted for, allowing for aggressive but safe scaling.',
    },
    {
      title: 'The Power of Consistency',
      description:
        '12+ years of continuous optimization proves that long-term partnerships yield compounding returns that short-term tactics simply cannot match.',
    },
  ],
  approach: [
    "We don't believe in churn-and-burn agency models. Our 12+ year relationship with Desert Farms is a testament to our philosophy: we act as an extension of your team, deeply invested in your long-term profitability.",
    'By managing the entire digital ecosystem, we ensure that SEO efforts feed into paid search efficiencies, and social prospecting fuels search volume.',
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
      'Discover how Xpert PPC drove massive growth for Desert Farms over a 12+ year partnership using SEO, Google Ads, and Meta Ads.',
    keywords: [
      'Desert Farms case study',
      'eCommerce PPC case study',
      'camel milk marketing',
      'Google Ads case study',
      'SEO case study',
    ],
  },
};

export const caseStudies = [desertFarms];
