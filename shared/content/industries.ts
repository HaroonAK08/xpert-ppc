import type { IconName } from '../types';

export type IndustryContent = {
  slug: string;
  name: string;
  eyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  bullets: string[];
  pillars: { title: string; description: string; icon: IconName }[];
  testimonials: { quote: string; name: string; role: string; rating: number }[];
  portfolio: { title: string; category: string; image: string }[];
  packages: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
  }[];
  seo: { title: string; description: string; keywords: string[] };
};

export const dermatologists: IndustryContent = {
  slug: 'dermatologists',
  name: 'Dermatologists',
  eyebrow: 'Marketing for Dermatology & Aesthetic Clinics',
  heroTitle: 'Fill Your Clinic With',
  heroHighlight: 'High-Value Patients',
  heroDescription:
    'We are a performance marketing agency dedicated to dermatologists and aesthetic practices. From acne treatments to laser and cosmetic procedures, we build data-driven campaigns that turn searches into booked consultations.',
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
      image: 'https://images.unsplash.com/photo-1524221629551-6dd14def5ffd?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Skincare Ad Campaign',
      category: 'Social Creative',
      image: 'https://images.unsplash.com/photo-1556217257-aa1d0c385e62?w=1216&h=896&fit=crop&q=80',
    },
    {
      title: 'Lead-Gen Performance',
      category: 'Google Ads',
      image: 'https://images.unsplash.com/photo-1625296276703-3fbc924f07b5?w=1216&h=896&fit=crop&q=80',
    },
  ],
  packages: [
    {
      name: 'Launch',
      price: '$500',
      period: '/mo',
      description: 'For single-location clinics starting paid acquisition.',
      features: [
        '1 Ad Platform (Google or Meta)',
        'Up to $5k ad spend managed',
        '2 Landing pages',
        'Monthly reporting',
      ],
    },
    {
      name: 'Growth',
      price: '$1,000',
      period: '/mo',
      description: 'For established clinics scaling patient volume.',
      features: [
        'Google + Meta Ads',
        'Up to $20k ad spend managed',
        'Conversion-optimized funnels',
        'Bi-weekly strategy calls',
        'Review-generation system',
      ],
      popular: true,
    },
    {
      name: 'Domination',
      price: '$1,500',
      period: '/mo',
      description: 'For multi-location groups and aesthetic franchises.',
      features: [
        'Omnichannel campaigns',
        'Unlimited ad spend management',
        'Dedicated account team',
        'Advanced analytics dashboard',
        'Priority creative production',
      ],
    },
  ],
  seo: {
    title: 'Dermatology Marketing Agency | Xpert PPC - Patient Acquisition',
    description:
      'Xpert PPC helps dermatology and aesthetic clinics attract high-intent patients through data-driven Google Ads, Meta Ads, and conversion-optimized landing pages.',
    keywords: [
      'dermatology marketing',
      'dermatologist PPC',
      'aesthetic clinic advertising',
      'skincare Google Ads',
      'patient acquisition',
    ],
  },
};

export const industries = [dermatologists];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
