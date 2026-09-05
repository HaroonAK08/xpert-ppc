/**
 * Single source of truth for company details.
 * Imported by both the Next.js frontend and the Express backend, so it must
 * stay free of framework-specific imports.
 */
export const siteConfig = {
  name: 'Xpert PPC',
  shortName: 'XpertPPC',
  legalName: 'Xpert PPC',
  tagline: 'Performance Marketing & Digital Growth Agency',
  description:
    'Expert PPC agency for Google, Meta, TikTok, Amazon, LinkedIn & Microsoft Ads. Free audit, clear reporting, and campaigns built for ROAS.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xpertppc.com',
  ogImage: '/og-image.png',
  locale: 'en_US',
  founded: '2012',
  contact: {
    phonePrimary: '+971 58 674 0167',
    phonePrimaryRaw: '+971586740167',
    phoneSecondary: '+92 300 683 4017',
    phoneSecondaryRaw: '+923006834017',
    email: 'umer@xpertppc.com',
    location: 'Global Remote Team',
    /** Click-to-chat link (0300 4021417 / +92 300 402 1417). */
    whatsapp: 'https://api.whatsapp.com/message/SLXP4R7SEDWWG1?autoload=1&app_absent=0',
    whatsappDisplay: '+92 300 402 1417',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/in/umerkhan381/',
    linkedinCompany: 'https://www.linkedin.com/company/xpertppc',
    facebook: 'https://www.facebook.com/XpertPPC',
    youtube: 'https://www.youtube.com/@xpertppc',
    upwork: 'https://www.upwork.com/freelancers/umerkhan381',
    upworkAgency: 'https://www.upwork.com/agencies/425244618658050048/',
  },
} as const;

export type SiteConfig = typeof siteConfig;
