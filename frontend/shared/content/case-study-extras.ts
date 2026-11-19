/**
 * Extra per-case-study page content that does not belong in `case-studies.ts`.
 *
 * `case-studies.ts` is shared with the backend seed, so its shape is kept
 * stable. Everything here is page copy: the brief that frames the engagement,
 * the service and industry pages a reader should go to next, and a short FAQ
 * answering what prospects actually ask about this kind of account.
 */

export type CaseStudyExtras = {
  /** One-line framing shown under the hero: who this was for and what changed. */
  brief: string;
  /** "Is this like my business?" — concrete traits of the account. */
  profile: { label: string; value: string }[];
  /** Service pages relevant to the work done here. Slugs from services.ts. */
  relatedServices: string[];
  /** Industry page slug from industries.ts, where one fits. */
  relatedIndustry?: string;
  faqs: { question: string; answer: string }[];
};

/** Shared questions, reworded per study where the specifics differ. */
export const caseStudyExtras: Record<string, CaseStudyExtras> = {
  'desert-farms': {
    brief:
      'A specialty food brand selling a product most shoppers had never tried. The work had to create demand and capture it at the same time, which is why paid and organic ran as one system rather than two budgets.',
    profile: [
      { label: 'Business model', value: 'Direct-to-consumer eCommerce' },
      { label: 'Main constraint', value: 'Category awareness — shoppers needed educating first' },
      { label: 'Engagement type', value: 'Long-term retainer, 12+ years' },
    ],
    relatedServices: ['google-ads', 'meta-ads'],
    relatedIndustry: 'food-beverage',
    faqs: [
      {
        question: 'Does a niche product need a different approach?',
        answer:
          'Yes. Where demand already exists you can buy it directly. Where it does not, content has to create the search in the first place — which is why SEO and paid ran together here rather than as separate programmes.',
      },
      {
        question: 'Why did this take years rather than months?',
        answer:
          'The early gains came from fixing tracking and campaign structure. The compounding gains — brand search, organic authority, repeat purchase — only accumulate with time in a category that starts with almost no search volume.',
      },
    ],
  },

  'ecommerce-growth': {
    brief:
      'An established store with healthy traffic and unprofitable ads. Nothing was wrong with demand — the account structure and bidding could not convert that demand efficiently.',
    profile: [
      { label: 'Business model', value: 'Consumer products eCommerce' },
      { label: 'Main constraint', value: 'Rising cost per conversion, unstable ROAS' },
      { label: 'Engagement type', value: 'Focused optimization window' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'ecommerce',
    faqs: [
      {
        question: 'Can results like this come from one month of work?',
        answer:
          'The reporting window was 30 days, but it followed a structural rebuild. The figure reflects what the account did once the feed, bidding and audiences were corrected — not what a month of management does on an untouched account.',
      },
      {
        question: 'Does Target ROAS bidding always help?',
        answer:
          'Only with enough clean conversion data behind it. On a low-volume account or one with broken tracking it will underperform manual bidding, which is why tracking gets verified first.',
      },
    ],
  },

  'google-ads-roas-600': {
    brief:
      'A twelve-month partnership rather than a quick fix. Return on ad spend moved in stages as structure, landing pages and retargeting were each addressed in turn.',
    profile: [
      { label: 'Business model', value: 'Established eCommerce brand' },
      { label: 'Main constraint', value: 'Spend scaling faster than return' },
      { label: 'Engagement type', value: 'Ongoing retainer, 12 months' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'ecommerce',
    faqs: [
      {
        question: 'How quickly did ROAS move?',
        answer:
          'In steps, not a jump. Structural fixes showed within weeks; the move from a moderate return to a strong one took the full twelve months as landing pages and retargeting compounded.',
      },
      {
        question: 'Is 600% ROAS a realistic target for my account?',
        answer:
          'It depends entirely on margin, average order value and competition. A healthy target for one business is unprofitable for another — the audit works backwards from your numbers rather than quoting this one.',
      },
    ],
  },

  'galadari-law-seo': {
    brief:
      'A competitive legal market where paid clicks are expensive and organic authority compounds. The work targeted the queries that bring instructed cases, not raw traffic.',
    profile: [
      { label: 'Business model', value: 'Professional services, high case value' },
      { label: 'Main constraint', value: 'Almost no organic visibility at the start' },
      { label: 'Engagement type', value: 'Six-month SEO programme' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'law-firms',
    faqs: [
      {
        question: 'Is organic traffic worth more than paid for a law firm?',
        answer:
          'Not inherently — but legal keywords are among the most expensive in paid search, so organic rankings for the same terms keep delivering after the budget stops.',
      },
      {
        question: 'How long before SEO shows results in legal?',
        answer:
          'Expect movement on long-tail queries within a couple of months and competitive terms over six or more. Legal is one of the slowest categories to rank in because the competition is well funded.',
      },
    ],
  },

  'edward-smith-seo': {
    brief:
      'A personal injury firm competing against national advertisers. Technical fixes and content depth did the work that budget alone could not.',
    profile: [
      { label: 'Business model', value: 'Personal injury law' },
      { label: 'Main constraint', value: 'Outspent by larger national firms' },
      { label: 'Engagement type', value: 'Multi-month SEO programme' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'law-firms',
    faqs: [
      {
        question: 'Can a smaller firm outrank national competitors?',
        answer:
          'On local and specific queries, often yes. On broad national terms it is far harder. The strategy targets where the firm can realistically win rather than the highest-volume keyword.',
      },
      {
        question: 'What does a falling bounce rate indicate?',
        answer:
          'That arriving visitors are finding what the search promised. It is a quality signal rather than a business outcome, which is why it is read alongside enquiries rather than on its own.',
      },
    ],
  },

  'online-blackmail-law-firm': {
    brief:
      'The account was already spending heavily and generating clicks. The problem was not volume but what the clicks cost and who they brought in.',
    profile: [
      { label: 'Business model', value: 'Specialist legal services' },
      { label: 'Main constraint', value: 'High spend, poor lead quality' },
      { label: 'Engagement type', value: 'Audit and restructure, 4–6 weeks' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'law-firms',
    faqs: [
      {
        question: 'How is it possible to save spend and raise conversions at once?',
        answer:
          'Because most wasted spend buys clicks that were never going to convert. Removing those frees budget for the queries that do, so the totals move in opposite directions.',
      },
      {
        question: 'Does a lower cost per acquisition mean lower quality leads?',
        answer:
          'Not here — the restructure targeted higher-intent queries, so lead quality rose alongside efficiency. It is worth checking, though, because chasing cheap conversions can do the opposite.',
      },
    ],
  },

  'peoples-firm': {
    brief:
      'A niche legal practice serving veterans, where the audience searches in very specific language. Content and paid had to speak that language precisely.',
    profile: [
      { label: 'Business model', value: 'Veterans disability and appeals law' },
      { label: 'Main constraint', value: 'Narrow, highly specific audience' },
      { label: 'Engagement type', value: 'Ongoing, 6+ months' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'law-firms',
    faqs: [
      {
        question: 'Does a narrow niche limit growth?',
        answer:
          'It limits volume, not profitability. A smaller audience searching with clear intent usually converts better than a broad one, provided the messaging matches how they actually describe their situation.',
      },
      {
        question: 'Why combine SEO, ads and content?',
        answer:
          'Because a considered decision involves several visits. Content answers the early questions, organic captures research, and paid is there at the point someone is ready to act.',
      },
    ],
  },

  'locks-around-the-clock': {
    brief:
      'An emergency service where the customer is searching once, urgently, and calls whoever answers first. Speed and local relevance decide the result.',
    profile: [
      { label: 'Business model', value: 'Emergency locksmith, local service area' },
      { label: 'Main constraint', value: 'Urgent, one-shot searches' },
      { label: 'Engagement type', value: 'Ongoing management, ~5 months' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'local-services',
    faqs: [
      {
        question: 'What matters most for emergency services?',
        answer:
          'Appearing for the right geography at the moment of need, and making the call as easy as possible. Ad position and call extensions matter far more here than in a considered purchase.',
      },
      {
        question: 'Is cost per conversion the right metric?',
        answer:
          'Only alongside job value. A higher cost per lead is fine if those jobs are worth more — which is why average job value is agreed before setting any target.',
      },
    ],
  },

  'locksmith-plumbing-leads': {
    brief:
      'Two home-service trades run in one account, where lead volume matters but cost per lead decides whether the work is worth taking.',
    profile: [
      { label: 'Business model', value: 'Home services — locksmith and plumbing' },
      { label: 'Main constraint', value: 'Lead cost against job value' },
      { label: 'Engagement type', value: 'Ongoing management, 90-day window' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'local-services',
    faqs: [
      {
        question: 'Can two trades share one account?',
        answer:
          'They can share a budget but not a campaign. Search intent and job value differ, so each needs its own structure and its own target — otherwise one quietly subsidises the other.',
      },
      {
        question: 'Is a 30% conversion rate normal?',
        answer:
          'For urgent local services it is achievable, because the searcher already intends to hire. It would be an unusual figure for a considered or B2B purchase.',
      },
    ],
  },

  'jj-gold-buyers': {
    brief:
      'A local precious-metals buyer where every enquiry has real value, so the work focused on cutting the cost of each one rather than chasing volume.',
    profile: [
      { label: 'Business model', value: 'Local precious-metals buyer' },
      { label: 'Main constraint', value: 'Cost per conversion too high to scale' },
      { label: 'Engagement type', value: 'Ongoing management, ~5 months' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'local-services',
    faqs: [
      {
        question: 'How does cost per conversion fall that far?',
        answer:
          'Usually by removing spend that was never going to convert — wrong geography, wrong intent, wrong device — and concentrating budget on the queries that already worked.',
      },
      {
        question: 'Does lead volume suffer when costs are cut?',
        answer:
          'It did not here; volume rose. Cutting waste is not the same as cutting budget, and the freed spend went back into the terms that convert.',
      },
    ],
  },

  'meta-ads-ardnamurchan': {
    brief:
      'A premium spirits brand where the product sells on story and craft. Creative carried the campaign; targeting only decided who saw it.',
    profile: [
      { label: 'Business model', value: 'Premium spirits eCommerce' },
      { label: 'Main constraint', value: 'Considered, high-value purchase' },
      { label: 'Engagement type', value: 'Multi-campaign rebuild' },
    ],
    relatedServices: ['meta-ads'],
    relatedIndustry: 'food-beverage',
    faqs: [
      {
        question: 'Does Meta work for premium products?',
        answer:
          'It does when the creative carries the craft and the story. Premium buyers respond to how the product is shown far more than to a discount, so the creative brief matters more than the audience build.',
      },
      {
        question: 'How do you handle a longer consideration window?',
        answer:
          'By treating add-to-cart and checkout starts as real signals, not just purchases, and keeping retargeting running long enough to cover how long people genuinely take to decide.',
      },
    ],
  },

  rafplay: {
    brief:
      'An outdoor play and ride-on retailer selling to parents, where the purchase is seasonal, considered and often researched across several visits.',
    profile: [
      { label: 'Business model', value: 'Outdoor play and ride-on eCommerce' },
      { label: 'Main constraint', value: 'Seasonal demand, considered purchase' },
      { label: 'Engagement type', value: 'Ongoing growth programme' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'ecommerce',
    faqs: [
      {
        question: 'How do you handle seasonal demand?',
        answer:
          'By building budget around the peak rather than spreading it evenly, and keeping a reduced presence off-season so the account holds its conversion data and does not restart learning each year.',
      },
      {
        question: 'Why Performance Max for this kind of catalogue?',
        answer:
          'It reaches parents across Search, Shopping, YouTube and Display from one product feed — useful when the purchase is researched in several places. It needs a clean feed and brand exclusions to behave.',
      },
    ],
  },

  'dental-physiotherapy-clinics': {
    brief:
      'Two clinic types run as separate service campaigns, because a dental enquiry and a physiotherapy enquiry are not worth the same and do not search alike.',
    profile: [
      { label: 'Business model', value: 'Private healthcare clinics' },
      { label: 'Main constraint', value: 'Appointment cost against treatment value' },
      { label: 'Engagement type', value: 'Ongoing management, quarterly window' },
    ],
    relatedServices: ['google-ads'],
    relatedIndustry: 'healthcare-clinics',
    faqs: [
      {
        question: 'Why split campaigns by service?',
        answer:
          'Because a routine check-up and a high-value treatment justify very different bids. Combined in one campaign, the cheaper enquiry absorbs the budget and the valuable one never scales.',
      },
      {
        question: 'How is a clinic enquiry measured?',
        answer:
          'Through form submissions and tracked calls. Platform-reported conversions are not confirmed appointments, which is why the cost per conversion is read against the clinic’s own booking data.',
      },
    ],
  },

  'newport-beach-restaurant': {
    brief:
      'A restaurant where discovery happens locally — maps, listings and search — and the result shows up as covers rather than as online checkouts.',
    profile: [
      { label: 'Business model', value: 'Independent restaurant, single location' },
      { label: 'Main constraint', value: 'Offline outcome, hard to attribute' },
      { label: 'Engagement type', value: 'Long-term support, several years' },
    ],
    relatedServices: ['google-ads', 'microsoft-ads'],
    relatedIndustry: 'local-services',
    faqs: [
      {
        question: 'How do you measure ads for a restaurant?',
        answer:
          'Imperfectly, and we say so. Clicks, calls and direction requests are trackable; a walk-in diner is not. The reported order growth comes from the business, not from the ad account.',
      },
      {
        question: 'Is local SEO more important than ads for restaurants?',
        answer:
          'Usually the Google Business Profile does the heaviest lifting, because that is where people look. Ads support it at peak times and for specific occasions rather than replacing it.',
      },
    ],
  },
};

export function getCaseStudyExtras(slug: string): CaseStudyExtras | undefined {
  return caseStudyExtras[slug];
}
