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
    badge: 'No payment before the call',
    headline:
      'Fill the form → we meet you → short interview about your background & skillset → then we decide which skills you need and what it will cost.',
    cta: 'Book my meeting',
    dismiss: 'See how it works first',
  },
  marquee: [
    'Step 1: Book a meeting — no payment yet',
    'Step 2: Initial interview — your background & skillset',
    'Step 3: We decide skills + pricing together',
    'Skills: SEM · SEO · Social · Design · Video · Frontend · Backend · Full-stack',
    'Study portal access only after your path is agreed',
  ],
  hero: {
    eyebrow: 'Xpert PPC Study Portal',
    title: 'Meet us first. Then we decide your skills and price.',
    subtitle:
      'This is not a ready-made course checkout. Book a meeting, complete a short interview about your background and skillset, and we will tell you what to learn and how much it will cost.',
    primaryCta: 'Book a meeting with us',
    secondaryCta: 'Sign in to portal',
    storySteps: [
      {
        step: '1',
        title: 'Book a meeting',
        detail: 'Use the form. No payment yet.',
      },
      {
        step: '2',
        title: 'Initial interview',
        detail: 'We hear your background & skillset.',
      },
      {
        step: '3',
        title: 'Skills + pricing',
        detail: 'We decide what you need and the cost.',
      },
    ],
  },
  stats: [
    { value: '8+', label: 'Skills available' },
    { value: '1:1', label: 'Interview call' },
    { value: '0', label: 'Payment before call' },
    { value: '7+', label: 'Years mentoring' },
  ],
  testimonials: [
    {
      quote:
        'They didn’t push a package — after the interview they put me on SEM first, then social later.',
      name: 'Ahmed R.',
      role: 'Freelance media buyer',
    },
    {
      quote:
        'I was a beginner. The call was about my background first — then they told me what I actually needed.',
      name: 'Sara K.',
      role: 'Career switcher',
    },
    {
      quote:
        'Clear path and fair pricing only after they understood my skillset. Felt honest.',
      name: 'Bilal M.',
      role: 'Agency junior',
    },
    {
      quote:
        'I wanted design + social. They decided the order and price on the call — not from a price list.',
      name: 'Hina T.',
      role: 'Creator marketer',
    },
  ],
  benefits: [
    {
      title: 'Meeting before money',
      description:
        'You talk to us first. We never ask you to buy a package before the interview.',
    },
    {
      title: 'Interview about you',
      description:
        'We listen to your background, experience, and current skillset — then place you correctly.',
    },
    {
      title: 'Skills chosen for you',
      description:
        'SEM, SEO, social, graphic design, video editing, frontend, backend, or full-stack — only what you need.',
    },
    {
      title: 'Pricing after the call',
      description:
        'Cost depends on the skills and plan we agree together. No flash price list.',
    },
    {
      title: 'Then portal access',
      description: 'Once the path is set, you sign in and learn inside the study portal.',
    },
    {
      title: 'Built for real work',
      description: 'Mentors who run client and product work — not theory-only teaching.',
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
      value: 'Meet first',
      title: 'Human onboarding',
      description: 'Every learner starts with a meeting and interview — not a checkout page.',
    },
    {
      value: 'You + us',
      title: 'Custom decision',
      description: 'Skills and pricing are decided together after we hear your background.',
    },
    {
      value: '8+',
      title: 'Skill tracks',
      description: 'Marketing, creative, and development in one study portal.',
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
      time: 'Form',
      title: 'Book a meeting with us',
      description:
        'Fill the call-to-action form. Tell us who you are and which skills you are curious about. No payment at this step.',
    },
    {
      step: 2,
      time: 'Interview',
      title: 'Initial interview call',
      description:
        'We hear your background, experience, and current skillset. This is how we understand what you truly need.',
    },
    {
      step: 3,
      time: 'Decide',
      title: 'We decide skills + pricing',
      description:
        'Together we choose what you will learn (and what you can skip) — then we set a fair price for that plan.',
    },
    {
      step: 4,
      time: 'Learn',
      title: 'Start in the study portal',
      description:
        'After you agree, you get portal access and begin the path we built for you.',
    },
  ],
  meeting: {
    eyebrow: 'Your first step',
    title: 'Book a meeting with us',
    subtitle:
      'This form starts the process. Next we schedule your initial interview, listen to your background and skillset, then decide which skills you need and how much it will cost.',
    cta: 'Request my meeting',
    finePrint: 'No payment to book. We usually confirm a call time within one business day.',
  },
  faq: [
    {
      q: 'Do I pay before the call?',
      a: 'No. First you book a meeting. After the initial interview we decide which skills fit you and what the plan costs.',
    },
    {
      q: 'What happens on the initial interview?',
      a: 'We ask about your background, experience, and skillset. Then we recommend what you should learn — and only then talk pricing.',
    },
    {
      q: 'What skills can I learn?',
      a: 'Search engine marketing, SEO, social media marketing, graphic design, video editing, frontend, backend, and full-stack web development — or a mix based on your goals.',
    },
    {
      q: 'I am a complete beginner. Is that okay?',
      a: 'Yes. The interview is exactly for that — so we place beginners and career switchers correctly.',
    },
    {
      q: 'When do I get portal access?',
      a: 'After we agree your skills path and pricing. Then you can sign in and start learning.',
    },
    {
      q: 'Can I talk on WhatsApp instead?',
      a: 'Yes. WhatsApp is fine — but the form helps us prepare for your interview faster.',
    },
  ],
  finalCta: {
    title: 'Ready for the meeting?',
    body: 'Book the call. We listen to your background first — then we decide the skills and the price with you.',
    cta: 'Book a meeting with us',
  },
} as const;
