export type AcademySkill = {
  slug: string;
  name: string;
  category: 'Marketing' | 'Creative' | 'Development' | 'Growth';
  tagline: string;
  detailHref?: string;
};

/** Skills shown on the study portal — path decided after the interview call. */
export const academySkills: AcademySkill[] = [
  {
    slug: 'sem',
    name: 'Search Engine Marketing',
    category: 'Marketing',
    tagline: 'Google Ads & Microsoft Ads — campaigns that convert.',
    detailHref: '/xpert-ppc-digital-academy/sem',
  },
  {
    slug: 'seo',
    name: 'Search Engine Optimization',
    category: 'Marketing',
    tagline: 'Organic rankings, technical SEO, and content that ranks.',
    detailHref: '/xpert-ppc-digital-academy/seo',
  },
  {
    slug: 'social-media-marketing',
    name: 'Social Media Marketing',
    category: 'Marketing',
    tagline: 'Meta, TikTok & social ads plus organic growth systems.',
    detailHref: '/xpert-ppc-digital-academy/social-media-marketing',
  },
  {
    slug: 'graphic-designing',
    name: 'Graphic Designing',
    category: 'Creative',
    tagline: 'Brand visuals, ads creatives, and portfolio-ready design.',
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    category: 'Creative',
    tagline: 'Short-form & long-form edits for ads, Reels, and YouTube.',
  },
  {
    slug: 'web-frontend',
    name: 'Frontend Web Development',
    category: 'Development',
    tagline: 'Modern UI with HTML, CSS, JavaScript / React fundamentals.',
  },
  {
    slug: 'web-backend',
    name: 'Backend Web Development',
    category: 'Development',
    tagline: 'APIs, databases, and server logic for real products.',
  },
  {
    slug: 'full-stack',
    name: 'Full-Stack Web Development',
    category: 'Development',
    tagline: 'Ship complete web apps — frontend + backend together.',
  },
];

export const coursesLanding = {
  brand: 'Xpert PPC Study Portal',
  offer: {
    liveLabel: 'Open for interviews',
    badge: 'Start with a free discovery call',
    headline:
      'Book a short meeting. We learn your background and goals — then we map the right skills and pricing for you.',
    cta: 'Book my interview call',
    dismiss: 'Browse skills first',
  },
  marquee: [
    'Book a discovery call — we design your learning path with you',
    'SEM · SEO · Social · Design · Video · Web development',
    'Initial interview first — then skills & pricing',
    'Agency mentors who work on real client projects',
    'Study portal access after we agree your track',
  ],
  hero: {
    eyebrow: 'Xpert PPC Study Portal',
    title: 'Learn the skills that fit your background — not a one-size course.',
    subtitle:
      'First we meet you. On a short interview call we hear where you are, what you already know, and where you want to go. Then we recommend the right skills and a fair plan to get there.',
    primaryCta: 'Book a discovery meeting',
    secondaryCta: 'Sign in to portal',
    trust: ['Interview-first onboarding', 'Custom skill path', 'Pricing after we meet'],
  },
  stats: [
    { value: '8+', label: 'Skills available' },
    { value: '1:1', label: 'Discovery call' },
    { value: '7+', label: 'Years mentoring' },
    { value: '$4.5M+', label: 'Ads managed by team' },
  ],
  testimonials: [
    {
      quote:
        'They didn’t push a package — the call helped me pick SEM first, then social later.',
      name: 'Ahmed R.',
      role: 'Freelance media buyer',
    },
    {
      quote:
        'I came from a non-tech background. The interview made the path feel realistic.',
      name: 'Sara K.',
      role: 'Career switcher',
    },
    {
      quote:
        'Clear lessons and someone who actually runs campaigns, not only teaching slides.',
      name: 'Bilal M.',
      role: 'Agency junior',
    },
    {
      quote:
        'Started with design + social. Pricing and scope only after they understood my goals.',
      name: 'Hina T.',
      role: 'Creator marketer',
    },
  ],
  benefits: [
    {
      title: 'Interview before you pay',
      description:
        'We learn your background and skillset first — then decide what you actually need.',
    },
    {
      title: 'Wide skill catalog',
      description:
        'Marketing, creative, and web development tracks — matched to your goals.',
    },
    {
      title: 'Custom pricing',
      description:
        'No flash price list. After the call we propose what to learn and what it costs.',
    },
    {
      title: 'Mentor feedback',
      description: 'Guidance from people who ship real client and product work.',
    },
    {
      title: 'Study portal access',
      description: 'Once your path is set, learn in the portal at your pace.',
    },
    {
      title: 'Career or freelance ready',
      description: 'Build skills you can sell, use in a job, or apply to your own brand.',
    },
  ],
  outcomes: [
    {
      title: 'Freelancing',
      description: 'Offer services clients pay for — ads, design, video, or web.',
    },
    {
      title: 'Career',
      description: 'Walk into interviews with a clear skill stack and portfolio language.',
    },
    {
      title: 'Your own projects',
      description: 'Build and market your own products, stores, or local business.',
    },
  ],
  proof: [
    {
      value: 'Call-first',
      title: 'Human onboarding',
      description: 'Every learner starts with a real conversation — not a checkout page.',
    },
    {
      value: '$4.5M+',
      title: 'Ad spend managed',
      description: 'Marketing tracks taught from live campaign experience.',
    },
    {
      value: 'Multi-skill',
      title: 'One portal',
      description: 'Marketing, creative, and development under one study system.',
    },
    {
      value: '7+ yrs',
      title: 'In the field',
      description: 'Mentors who work on real briefs, not theory alone.',
    },
  ],
  howItWorks: [
    {
      step: 1,
      time: '~2 min',
      title: 'Book a discovery meeting',
      description: 'Share your name, contact, background, and which skills interest you.',
    },
    {
      step: 2,
      time: 'Call',
      title: 'Initial interview',
      description:
        'We talk through your experience, goals, and current skillset — honest and practical.',
    },
    {
      step: 3,
      time: 'Plan',
      title: 'Skills & pricing decided',
      description:
        'We recommend what you should learn, in what order, and what the investment will be.',
    },
    {
      step: 4,
      time: 'Learn',
      title: 'Access the study portal',
      description: 'Start your path in the portal with lessons, tasks, and mentor support.',
    },
  ],
  meeting: {
    eyebrow: 'Start here',
    title: 'Book your discovery meeting',
    subtitle:
      'This is not a sales checkout. Tell us a bit about yourself — we will schedule a short interview call, then decide skills and pricing together.',
    cta: 'Request my interview call',
    finePrint: 'We usually reply within one business day to confirm a meeting time.',
  },
  faq: [
    {
      q: 'Do I pay before the call?',
      a: 'No. First we meet. After the interview we decide which skills fit you and what the plan costs.',
    },
    {
      q: 'What skills can I learn?',
      a: 'Search engine marketing, SEO, social media marketing, graphic design, video editing, frontend, backend, and full-stack web development — plus combinations based on your goals.',
    },
    {
      q: 'I am a complete beginner. Is that okay?',
      a: 'Yes. The interview helps us place you correctly — beginners and career switchers are welcome.',
    },
    {
      q: 'How long is the discovery call?',
      a: 'Usually a short interview — enough to understand your background and recommend a clear next step.',
    },
    {
      q: 'When do I get portal access?',
      a: 'After we agree your learning path and plan. Then you can sign in and start.',
    },
    {
      q: 'Can I talk on WhatsApp instead?',
      a: 'Yes. You can also message us on WhatsApp — but the form helps us prepare for your interview.',
    },
  ],
  finalCta: {
    title: 'Your next skill path starts with a conversation',
    body: 'Book a discovery meeting. We listen first — then we build the right study plan with you.',
    cta: 'Book a discovery meeting',
  },
} as const;
