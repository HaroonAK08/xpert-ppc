export type CaseStudyClientAsset = {
  src: string;
  alt: string;
  context: string;
  sourceUrl: string;
  logoSrc?: string;
  logoAlt?: string;
};

export const caseStudyClientAssets: Record<string, CaseStudyClientAsset> = {
  'desert-farms': {
    src: '/case-studies/clients/desert-farms.jpg',
    alt: 'Desert Farms camel milk bottle on a white background',
    context: 'Camel-milk and specialty food eCommerce brand.',
    sourceUrl: 'https://desertfarms.com/',
    logoSrc: '/case-studies/clients/desert-farms-logo.webp',
    logoAlt: 'Desert Farms logo',
  },
  'galadari-law-seo': {
    src: '/case-studies/clients/galadari-law.webp',
    alt: 'Galadari Advocates and Legal Consultants logo',
    context: 'UAE advocates and legal consultants serving domestic and global clients.',
    sourceUrl: 'https://galadarilaw.com/',
    logoSrc: '/case-studies/clients/galadari-law.webp',
    logoAlt: 'Galadari Advocates and Legal Consultants logo',
  },
  'edward-smith-seo': {
    src: '/case-studies/clients/edward-smith-law.jpeg',
    alt: 'Car accident scene image from the Edward Smith Law website',
    context: 'Personal injury law firm serving clients in Colorado.',
    sourceUrl: 'https://www.edsmithlaw.com/',
    logoSrc: '/case-studies/clients/edward-smith-law-logo.svg',
    logoAlt: 'Edward Smith Law logo',
  },
  'peoples-firm': {
    src: '/case-studies/clients/peoples-firm.webp',
    alt: 'Family consultation image from The People’s Firm website',
    context: 'Estate planning, asset protection and probate attorneys serving Michigan and Washington, DC.',
    sourceUrl: 'https://thepeoplesfirmpllc.com/',
    logoSrc: '/case-studies/clients/peoples-firm-logo.webp',
    logoAlt: 'The People’s Firm logo',
  },
  'locks-around-the-clock': {
    src: '/case-studies/clients/locks-around-the-clock.webp',
    alt: 'Locks Around the Clock locksmith team outside its storefront',
    context: 'Family-owned Palm Desert locksmith with storefront and mobile service teams.',
    sourceUrl: 'https://locksaroundtheclockinc.com/',
    logoSrc: '/case-studies/clients/locks-around-the-clock-logo.webp',
    logoAlt: 'Locks Around the Clock logo',
  },
  'jj-gold-buyers': {
    src: '/case-studies/clients/jj-gold-buyers.png',
    alt: 'J and J Gold Buyers logo',
    context: 'Palm Desert precious-metals buyer serving gold, silver, diamonds, jewelry and coins.',
    sourceUrl: 'https://jjgoldbuyers.com/',
    logoSrc: '/case-studies/clients/jj-gold-buyers.png',
    logoAlt: 'J and J Gold Buyers logo',
  },
  'meta-ads-ardnamurchan': {
    src: '/case-studies/clients/ardnamurchan-distillery.jpg',
    alt: 'Ardnamurchan Distillery building and landscape',
    context: 'West Highland whisky distillery established on the Ardnamurchan peninsula.',
    sourceUrl: 'https://ardnamurchandistillery.com/',
    logoSrc: '/case-studies/clients/ardnamurchan-distillery-logo.png',
    logoAlt: 'Ardnamurchan Distillery logo',
  },
  rafplay: {
    src: '/case-studies/clients/rafplay.jpg',
    alt: 'Rafplay product banner featuring ride-on and recreation products',
    context: 'UAE eCommerce retailer for electric scooters, golf carts, ride-on products and play equipment.',
    sourceUrl: 'https://rafplay.com/',
    logoSrc: '/case-studies/clients/rafplay-logo.png',
    logoAlt: 'Rafplay logo',
  },
};

export function getCaseStudyClientAsset(slug: string) {
  return caseStudyClientAssets[slug];
}
