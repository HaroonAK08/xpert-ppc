import { siteConfig } from '../site';

export type TeamMemberContent = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  expertise: string[];
  achievements: string[];
  socials: { linkedin: string; upwork: string };
  seo: { title: string; description: string; keywords: string[] };
};

export const umerKhan: TeamMemberContent = {
  slug: 'umer-khan',
  name: 'Umer Khan',
  role: 'Senior PPC Specialist / Account Manager',
  bio: 'With over 20+ years of rigorous experience in data-driven performance marketing, Umer engineers high-velocity ad campaigns for brands demanding aggressive growth. He specializes in bridging the gap between deep analytics and compelling creative to exploit platform algorithms across Google, Meta, and TikTok.',
  photo:
    'https://horizons-cdn.hostinger.com/63fcbc2b-b25a-4691-84cb-d8d88c4d6854/4fb1db486c2b087c186ea7f7fecf5c7b.png',
  expertise: [
    'Google Ads (Search, Display, PMax)',
    'Meta Ads (Facebook & Instagram)',
    'TikTok Ads & UGC Integration',
    'Amazon AMS Optimization',
    'Full-Funnel Campaign Optimization',
    'Advanced A/B Testing Protocols',
  ],
  achievements: [
    'Managed over $50M+ in profitable ad spend',
    'Google Premier Partner Certified',
    'Meta Blueprint Certified Buyer',
    'Scaled 30+ e-commerce brands past 7-figures',
    'Average client retention rate of 3.5 years',
    'Reduced target acquisition costs by 45% average',
  ],
  socials: {
    linkedin: siteConfig.socials.linkedin,
    upwork: siteConfig.socials.upwork,
  },
  seo: {
    title: 'Meet Our Team | Xpert PPC - PPC Specialists',
    description:
      'Meet Umer Khan and our team of certified PPC specialists with 8+ years of experience managing high-performing ad campaigns.',
    keywords: [
      'Umer Khan PPC',
      'Google Ads expert',
      'PPC specialist',
      'Meta Blueprint certified',
      'senior media buyer',
    ],
  },
};

/** Content for the Upwork landing page. */
export const upworkProfile = {
  headline: 'Hire Me on Upwork',
  subheadline: 'Google Ads Expert - PPC Specialist',
  intro:
    "I engineer high-velocity ad campaigns for brands demanding aggressive growth. Let's scale your revenue through precision data and elite media buying.",
  about:
    'With over 8 years of rigorous experience in data-driven performance marketing, I specialize in bridging the gap between deep analytics and compelling creative. I don’t just manage ads; I build sophisticated acquisition funnels tailored to the unique algorithms of each platform.',
  stats: [
    { value: 'Top Rated', label: 'Upwork Status' },
    { value: '100%', label: 'Job Success' },
    { value: '< 2 hrs', label: 'Response Time' },
    { value: '80%+', label: 'Repeat Clients' },
    { value: 'Fluent', label: 'English' },
    { value: '250%+', label: 'Avg ROI' },
  ],
  highlights: [
    { title: '8+ Years Experience', description: 'Deep expertise in performance marketing.' },
    { title: '200+ Campaigns', description: 'Successfully scaled across various industries.' },
    { title: 'Certified Expert', description: 'Google, Meta, and TikTok certified.' },
  ],
  services: [
    {
      title: 'Google Ads Management',
      description:
        'End-to-end management of Google Search, Display, Shopping, and YouTube campaigns to capture high-intent traffic.',
      items: ['Search & Display', 'Shopping Ads', 'YouTube Ads', 'Performance Max'],
    },
    {
      title: 'PPC Campaign Optimization',
      description:
        'Data-driven optimization of existing campaigns to lower CPA and maximize ROAS.',
      items: ['Bid management', 'Keyword research', 'Ad copy testing', 'Landing page optimization'],
    },
    {
      title: 'PPC Strategy & Consulting',
      description:
        'Strategic guidance on platform selection, budget allocation, and full-funnel acquisition.',
      items: [
        'Campaign strategy',
        'Platform selection',
        'Budget allocation',
        'Performance analysis',
      ],
    },
    {
      title: 'Meta Ads Management',
      description:
        'Aggressive prospecting and retargeting campaigns across Facebook and Instagram.',
      items: ['Facebook/Instagram', 'Audience targeting', 'Creative optimization', 'Lead generation'],
    },
    {
      title: 'TikTok Ads Management',
      description:
        'Engaging short-form video campaigns designed to capture Gen Z and millennial audiences.',
      items: [
        'Campaign setup',
        'Creative strategy',
        'Audience targeting',
        'Performance optimization',
      ],
    },
    {
      title: 'Amazon Ads Management',
      description:
        'Dominate the digital shelf with optimized Sponsored Products and Brands campaigns.',
      items: [
        'Sponsored Products/Brands',
        'Keyword optimization',
        'ACOS management',
        'Competitor targeting',
      ],
    },
  ],
  process: [
    {
      title: 'Send Message',
      description: 'Reach out with your project details and goals.',
      icon: 'Send',
    },
    {
      title: 'Review & Proposal',
      description: "I'll audit your current setup and provide a custom strategy.",
      icon: 'FileText',
    },
    {
      title: 'Discuss Strategy',
      description: 'We align on KPIs, budget, and timelines.',
      icon: 'MessageCircle',
    },
    {
      title: 'Execute & Optimize',
      description: 'Campaigns launch and continuous optimization begins.',
      icon: 'Rocket',
    },
    {
      title: 'Regular Reporting',
      description: 'Transparent updates on performance and next steps.',
      icon: 'BarChart3',
    },
  ],
  reviews: [
    {
      name: 'Sarah J., E-commerce Director',
      feedback:
        'Umer completely turned around our Google Ads account. Within 2 months, our ROAS went from 1.5x to 4x. His communication is excellent and he truly understands the platform algorithms.',
    },
    {
      name: 'Michael T., SaaS Founder',
      feedback:
        'We hired Umer for LinkedIn and Meta lead gen. He delivered high-quality SQLs at a fraction of our previous cost. Highly recommend his strategic approach to B2B marketing.',
    },
    {
      name: 'Elena R., Marketing Manager',
      feedback:
        'Fast, professional, and incredibly knowledgeable. Umer audited our messy account, restructured everything, and the results speak for themselves. A true PPC expert.',
    },
  ],
  seo: {
    title: 'Hire Me on Upwork | Umer Khan - PPC Expert',
    description:
      'Hire Umer Khan on Upwork. Top Rated Google Ads, Meta Ads, and TikTok Ads specialist with 8+ years of experience scaling brands.',
    keywords: [
      'hire Google Ads expert Upwork',
      'Umer Khan Upwork',
      'Top Rated PPC freelancer',
      'Google Ads freelancer',
    ],
  },
};
