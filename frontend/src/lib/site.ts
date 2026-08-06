import { siteConfig } from '@shared/site';

// Company details live in shared/ so the backend can use them too.
export { siteConfig };

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  {
    label: 'Industries',
    href: '/industries/dermatologists',
    children: [
      {
        label: 'Dermatologists',
        href: '/industries/dermatologists',
        description: 'Patient acquisition for skin & aesthetic clinics',
      },
      {
        label: 'Law Firms',
        href: '/industries/law-firms',
        description: 'Qualified case inquiries for competitive legal niches',
      },
      {
        label: 'eCommerce',
        href: '/industries/ecommerce',
        description: 'ROAS-focused Google, Shopping & Meta growth',
      },
      {
        label: 'Local Services',
        href: '/industries/local-services',
        description: 'High-intent leads for home & local businesses',
      },
      {
        label: 'Healthcare Clinics',
        href: '/industries/healthcare-clinics',
        description: 'Appointment leads for dental, physio & clinics',
      },
      {
        label: 'Food & Beverage',
        href: '/industries/food-beverage',
        description: 'Growth for specialty food, CPG & beverage brands',
      },
    ],
  },
  { label: 'Courses', href: '/courses' },
  { label: 'Case Studies', href: '/case-study' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  academy: {
    title: 'Digital Academy',
    links: [
      { label: 'Course portal', href: '/courses' },
      { label: 'SEM Course', href: '/xpert-ppc-digital-academy/sem' },
      {
        label: 'Social Media Marketing Course',
        href: '/xpert-ppc-digital-academy/social-media-marketing',
      },
      { label: 'Complete SEO Course', href: '/xpert-ppc-digital-academy/seo' },
    ],
  },
  company: {
    title: 'Company & Resources',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Case Studies', href: '/case-study' },
      { label: 'Meet Our Expert', href: '/team/umer-khan' },
      { label: 'Upwork Profile', href: '/google-ads-expert-upwork-umer-khan' },
    ],
  },
};

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Sitemap', href: '/sitemap.xml' },
];
