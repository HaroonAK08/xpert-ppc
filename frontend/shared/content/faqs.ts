/** Full FAQ set, grouped by category — mirrors the /faq page. */
export const faqCategories = [
  "General PPC",
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Amazon Ads",
  "LinkedIn Ads",
  "Campaign Management",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type FaqItem = {
  category: FaqCategory;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    category: "General PPC",
    question: "What is PPC and how does it work?",
    answer:
      "Pay-Per-Click (PPC) is an advertising model where advertisers pay a fee each time one of their ads is clicked. Instead of organically earning visits, you buy visits to your site through platforms like Google, Meta, or TikTok.",
  },
  {
    category: "General PPC",
    question: "How long does it take to see results from PPC?",
    answer:
      "While PPC can drive immediate traffic as soon as campaigns launch, optimal results and high ROI typically take 30 to 90 days. This period allows our algorithms to gather data, A/B test creatives, and refine targeting.",
  },
  {
    category: "General PPC",
    question: "How do you determine the right budget?",
    answer:
      "Budget recommendations are based on your industry's average CPC, your customer lifetime value (LTV), target acquisition cost (CPA), and your specific revenue goals. We run a comprehensive audit to forecast required spend.",
  },
  {
    category: "Google Ads",
    question: "What is the difference between Search and Display networks?",
    answer:
      "The Search Network targets high-intent users actively looking for your keywords on Google. The Display Network serves visual ads across millions of websites to build awareness and retarget previous visitors.",
  },
  {
    category: "Google Ads",
    question: "What is a Quality Score and why does it matter?",
    answer:
      "Quality Score is Google's rating of the quality and relevance of your keywords and PPC ads. A higher Quality Score leads to lower costs per click (CPCs) and better ad positions.",
  },
  {
    category: "Google Ads",
    question: "Do you manage Performance Max (PMax) campaigns?",
    answer:
      "Yes. We leverage PMax campaigns by feeding them high-quality creative assets, precise audience signals, and strict ROAS targets to let Google's machine learning maximize conversions across all its channels.",
  },
  {
    category: "Meta Ads",
    question: "Should I advertise on Facebook, Instagram, or both?",
    answer:
      "We generally recommend starting with Advantage+ placements across both platforms. Meta's algorithm is excellent at finding where your converting audience currently resides, whether that's an IG Reel or FB Feed.",
  },
  {
    category: "Meta Ads",
    question: "How did iOS 14 updates affect your Meta tracking?",
    answer:
      "While iOS 14 reduced traditional pixel visibility, we implement Conversions API (CAPI) and advanced server-side tracking to ensure accurate data flow, allowing us to maintain high campaign performance.",
  },
  {
    category: "Meta Ads",
    question: "What are Lookalike Audiences?",
    answer:
      "Lookalike Audiences are targeting segments created by Meta that mirror the characteristics of your best customers (like a list of past buyers). They are highly effective for prospecting at scale.",
  },
  {
    category: "TikTok Ads",
    question: "Is my target audience really on TikTok?",
    answer:
      "TikTok's demographic has matured significantly. While it dominates Gen Z, a massive portion of Millennials and Gen X are highly active. If you sell consumer goods or digital products, your audience is likely there.",
  },
  {
    category: "TikTok Ads",
    question: "What type of creative works best on TikTok?",
    answer:
      "Native, authentic, user-generated content (UGC) heavily outperforms highly polished corporate commercials. TikTok ads need to feel like organic platform content to stop the scroll.",
  },
  {
    category: "TikTok Ads",
    question: "What are Spark Ads?",
    answer:
      "Spark Ads allow brands to boost organic TikTok videos (either their own or from creators) as ads. They maintain native interactions (likes, shares, follows) and generally see higher conversion rates.",
  },
  {
    category: "Amazon Ads",
    question: "Sponsored Products vs Sponsored Brands?",
    answer:
      "Sponsored Products promote individual listings and appear within search results. Sponsored Brands feature your logo, a custom headline, and up to three products, usually appearing at the very top of search results.",
  },
  {
    category: "Amazon Ads",
    question: "How do you lower ACOS (Advertising Cost of Sales)?",
    answer:
      "We lower ACOS through exhaustive negative keyword harvesting, bid optimization based on conversion times, and ensuring your product listings (A+ content) are highly optimized for conversion.",
  },
  {
    category: "Amazon Ads",
    question: "Do you manage Amazon DSP?",
    answer:
      "Yes, we handle Amazon Demand-Side Platform (DSP) campaigns to programmatically buy display and video ads both on and off Amazon to retarget audiences at scale.",
  },
  {
    category: "LinkedIn Ads",
    question: "Why are LinkedIn CPCs generally higher?",
    answer:
      "LinkedIn targets professionals based on precise firmographic data (job title, industry, company size, seniority). The traffic is exceptionally high-quality and B2B focused, which commands a premium but yields higher LTV.",
  },
  {
    category: "LinkedIn Ads",
    question: "What are Lead Gen Forms?",
    answer:
      "Lead Gen Forms are pre-filled forms that pop up natively within LinkedIn when a user clicks your ad. Because the friction is low, they typically convert significantly higher than landing pages.",
  },
  {
    category: "Campaign Management",
    question: "Do I own my ad accounts?",
    answer:
      "100%. You retain full ownership and administrative access to all your ad accounts, business managers, and data. We operate as authorized agency partners.",
  },
  {
    category: "Campaign Management",
    question: "How often do you report on performance?",
    answer:
      "We provide real-time dashboard access for daily tracking, along with comprehensive weekly updates and deep-dive monthly strategy calls to review metrics, learnings, and next steps.",
  },
  {
    category: "Campaign Management",
    question: "What is your management fee structure?",
    answer:
      "Our fees are transparent and typically based on either a flat monthly retainer or a percentage of ad spend, depending on the complexity of your omnichannel deployment. Contact us for a precise quote.",
  },
];
