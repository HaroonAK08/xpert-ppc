import type { IconName } from '../types';

export const heroBullets = [
  'Full-funnel PPC across Google, Meta, TikTok, Amazon, LinkedIn and Microsoft Ads',
  'Transparent dashboards and weekly performance reviews',
  'Proven long-term growth systems, including the Desert Farms case study',
  'UAE and global remote team with fast WhatsApp response',
];

export const heroTrustLine =
  'Google Partner expertise · Top-Rated Plus on Upwork · Meta Ads specialists';

export const processSteps: {
  step: string;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    step: 'STEP 1',
    title: 'Audit',
    description: 'Find wasted spend, tracking gaps, and quick wins.',
    icon: 'ClipboardCheck',
  },
  {
    step: 'STEP 2',
    title: 'Strategy',
    description: 'Build channel plan, KPIs, and creative/testing roadmap.',
    icon: 'Target',
  },
  {
    step: 'STEP 3',
    title: 'Launch',
    description: 'Deploy clean campaign structures with conversion tracking.',
    icon: 'Rocket',
  },
  {
    step: 'STEP 4',
    title: 'Optimize',
    description: 'Weekly iteration on bids, creatives, audiences, and landing paths.',
    icon: 'LineChart',
  },
];

/** The five FAQs surfaced on the homepage (distinct from the full /faq set). */
export const homeFaqs = [
  {
    question: 'How soon can I see results from PPC?',
    answer:
      'Most accounts show clearer efficiency signals within 2–4 weeks. Stronger ROAS or CPA improvements usually compound over 60–90 days depending on offer, tracking, and budget.',
  },
  {
    question: 'What budget do I need to start?',
    answer:
      'It depends on your market and goals. After the free audit, we recommend a practical starting range so spend is not wasted.',
  },
  {
    question: 'Do you manage more than Google and Meta?',
    answer:
      'Yes. We manage Google, Meta, TikTok, Amazon, LinkedIn, and Microsoft Ads as needed for your growth plan.',
  },
  {
    question: 'Will I get transparent reporting?',
    answer:
      'Yes. You get clear dashboards and weekly notes focused on revenue metrics, not vanity clicks.',
  },
  {
    question: 'Can you audit my existing account first?',
    answer:
      'Yes. Start with the free PPC audit and we will show what is working, what is wasting money, and what to fix first.',
  },
];
