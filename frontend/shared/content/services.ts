import type { IconName } from '../types';

export type ServiceMetric = { label: string; value: string };

export type Service = {
  slug: string;
  name: string;
  icon: IconName;
  /** Card copy on /services */
  shortDescription: string;
  /** Card copy on the homepage grid */
  homeDescription: string;
  homeTags: string[];
  features: string[];
  description: string;
  whatWeOffer: string;
  approach: string;
  results: string;
  caseStudy: {
    client: string;
    challenge: string;
    solution: string;
    timeline: string;
    testimonial: string;
    metrics: ServiceMetric[];
  };
  detail: {
    heroTitle: string;
    subheading: string;
    detailedServices: { title: string; description: string; image: string }[];
    whatWeOffer: string[];
    whyChooseUs: string[];
    process: string[];
  };
  seo: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "google-ads",
    name: "Google Ads",
    icon: "Search",
    shortDescription:
      "Capture high-intent search traffic with dynamic bidding and responsive ad copy.",
    homeDescription: "High-intent search, Performance Max, YouTube & Shopping.",
    homeTags: ["Search", "Performance Max", "Shopping"],
    features: ["Search Network", "Performance Max", "YouTube Ads", "Shopping Ads"],
    description:
      "Maximize visibility on Google Search, Display Network, Shopping, and YouTube",
    whatWeOffer:
      "Search Ads, Display Ads, Shopping Ads, YouTube Ads, Remarketing.",
    approach:
      "Keyword research, bid management, A/B testing, continuous optimization.",
    results: "250%+ ROI, 3-5x ROAS.",
    caseStudy: {
      client: "E-commerce Fashion Brand",
      challenge: "Low conversion rate, high CPC",
      solution:
        "Implemented smart bidding, improved ad copy, optimized landing pages",
      timeline: "3 months",
      testimonial:
        "Xpert PPC transformed our Google Ads performance. We're now getting 3x more conversions at half the cost!",
      metrics: [
        { label: "Conversion Rate", value: "1.2% → 3.8% (+216%)" },
        { label: "Cost per Conversion", value: "$45 → $18 (-60%)" },
        { label: "Monthly Revenue", value: "$50K → $180K (+260%)" },
        { label: "ROI", value: "400%" },
      ],
    },
    detail: {
      heroTitle: "Google Ads Management - Maximize Your Search Visibility",
      subheading:
        "Expert Google Search, Display, Shopping, and YouTube advertising tailored to drive high-intent traffic and conversions.",
      detailedServices: [
        {
          title: "Google Search Ads",
          description:
            "Capture high-intent users actively searching for your products or services. We optimize keywords, ad copy, and bidding strategies to ensure maximum visibility and ROI. Drive qualified traffic directly to your landing pages.",
          image: "https://images.unsplash.com/photo-1663090859310-97a1af639a29",
        },
        {
          title: "Google Display Ads",
          description:
            "Build brand awareness and retarget past visitors across millions of websites and apps. Our visually compelling banner ads capture attention and keep your brand top-of-mind. We use advanced audience targeting to reach the right demographics.",
          image: "https://images.unsplash.com/photo-1688235142578-c4e1523c6347",
        },
        {
          title: "Google Shopping Ads",
          description:
            "Showcase your products directly in search results with high-quality images and pricing. We optimize your product feed and campaign structure to maximize e-commerce sales. Dominate the digital shelf and outshine competitors.",
          image: "https://images.unsplash.com/photo-1674027392842-29f8354e236c",
        },
        {
          title: "Google YouTube Ads",
          description:
            "Engage audiences with powerful video storytelling on the world's second-largest search engine. From skippable in-stream ads to bumper ads, we drive brand consideration and conversions. Capture attention where your customers spend their time.",
          image: "https://images.unsplash.com/photo-1653753336046-72a1d70bb9f7",
        },
      ],
      whatWeOffer: ["Google Search Ads", "Display Network", "Shopping Ads", "YouTube Ads", "Remarketing"],
      whyChooseUs: ["Certified Google Partner", "15+ years Google Ads experience", "Average 250% ROI increase"],
      process: ["Audit", "Strategy", "Implementation", "Optimization", "Reporting"],
    },
    seo: {
      title: "Google Ads Management - Xpert PPC",
      description:
        "Expert Google Search, Display, Shopping, and YouTube advertising tailored to drive high-intent traffic and conversions.",
    },
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    icon: "Facebook",
    shortDescription:
      "Scale aggressive prospecting campaigns across Facebook and Instagram feeds.",
    homeDescription: "Prospecting and retargeting on Facebook & Instagram.",
    homeTags: ["Advantage+", "Retargeting", "Reels"],
    features: ["Advantage+ Shopping", "Custom Audiences", "Reels Ads", "Lead Generation"],
    description:
      "Reach your audience on Facebook, Instagram, and Reels with targeted campaigns",
    whatWeOffer:
      "Feed ads, Stories ads, Reels ads, Carousel ads, Collection ads, Lead generation ads.",
    approach:
      "Audience segmentation, creative testing, lookalike audiences, retargeting.",
    results: "200%+ ROI, 2-4x ROAS.",
    caseStudy: {
      client: "SaaS B2B Software Company",
      challenge: "Low lead quality, high CAC",
      solution:
        "Implemented lead gen forms, created lookalike audiences, A/B tested creatives",
      timeline: "2 months",
      testimonial:
        "The quality of leads improved dramatically. Our sales team is closing deals faster than ever!",
      metrics: [
        { label: "Leads", value: "50 → 250/month (+400%)" },
        { label: "Cost per Lead", value: "$35 → $12 (-66%)" },
        { label: "Lead Quality", value: "6/10 → 9/10" },
        { label: "SQL", value: "15 → 85/month (+467%)" },
      ],
    },
    detail: {
      heroTitle: "Meta Ads (Facebook & Instagram) - Reach Your Target Audience",
      subheading:
        "Precision targeting on Facebook, Instagram, Messenger, and Audience Network to build brand awareness and drive sales.",
      detailedServices: [
        {
          title: "Facebook Feed Ads",
          description:
            "Reach your ideal customers right where they scroll. We craft highly targeted campaigns using Meta's rich demographic and behavioral data. Drive engagement, leads, and sales with compelling creative and precise audience segmentation.",
          image: "https://images.unsplash.com/photo-1648134859182-98df6e93ef58",
        },
        {
          title: "Instagram Feed Ads",
          description:
            "Showcase your brand's visual identity to a highly engaged audience. Our stunning imagery and persuasive copy turn scrollers into loyal customers. Leverage advanced targeting to connect with users most likely to convert.",
          image: "https://images.unsplash.com/photo-1647964186073-51a605191343",
        },
        {
          title: "Instagram Stories Ads",
          description:
            "Capture attention with immersive, full-screen vertical video ads. We design short, impactful stories that drive immediate action and swipe-ups. Capitalize on the urgency and authenticity of the Stories format.",
          image: "https://images.unsplash.com/photo-1663236757079-5909ac571f74",
        },
        {
          title: "Instagram Reels Ads",
          description:
            "Tap into the viral potential of short-form video content. Our creative team produces engaging Reels ads that blend seamlessly with organic content. Reach new audiences and boost brand awareness rapidly.",
          image: "https://images.unsplash.com/photo-1647964186073-51a605191343",
        },
      ],
      whatWeOffer: ["Feed Ads", "Stories", "Reels", "Carousel Ads", "Collection Ads", "Conversion Tracking"],
      whyChooseUs: ["Meta Certified Partner", "12+ years Meta advertising experience", "300% average ROAS"],
      process: ["Audience Research", "Creative Strategy", "Campaign Setup", "A/B Testing", "Scaling"],
    },
    seo: {
      title: "Meta Ads Management - Xpert PPC",
      description:
        "Precision targeting on Facebook, Instagram, Messenger, and Audience Network to build brand awareness and drive sales.",
    },
  },
  {
    slug: "tiktok-ads",
    name: "TikTok Ads",
    icon: "Video",
    shortDescription:
      "Dominate short-form video with high-converting creative structures.",
    homeDescription: "Short-form creative built to stop the scroll and convert.",
    homeTags: ["In-Feed", "Spark Ads", "Creators"],
    features: ["In-Feed Ads", "Spark Ads", "Creator Marketplace", "TopView Ads"],
    description:
      "Engage Gen Z and younger audiences with creative TikTok advertising",
    whatWeOffer:
      "In-feed ads, Branded hashtag challenges, TopView ads, Spark ads, Collection ads.",
    approach:
      "Authentic creative content, trend-based campaigns, influencer partnerships.",
    results: "180%+ ROI, 2-3x ROAS.",
    caseStudy: {
      client: "Fashion & Lifestyle Brand (Target: 18-35 year-olds)",
      challenge: "Low brand awareness among Gen Z, high competition",
      solution:
        "Created viral-worthy content, used trending sounds, partnered with micro-influencers",
      timeline: "2.5 months",
      testimonial:
        "Our TikTok campaigns went viral! The engagement and sales growth exceeded all expectations.",
      metrics: [
        { label: "Video Views", value: "500K → 5M+ (+900%)" },
        { label: "Brand Awareness", value: "15% → 62% (+313%)" },
        { label: "Website Traffic", value: "2K → 45K/month (+2150%)" },
        { label: "Sales", value: "$20K → $120K/month (+500%)" },
      ],
    },
    detail: {
      heroTitle: "TikTok Ads - Engage Gen Z & Younger Audiences",
      subheading:
        "Creative, viral-worthy campaigns that drive engagement and conversions on the world's fastest-growing social platform.",
      detailedServices: [
        {
          title: "In-Feed Ads",
          description:
            "Seamlessly integrate your brand into the 'For You' page with native-feeling video ads. We create authentic, trend-driven content that resonates with TikTok's unique audience. Drive massive engagement and direct response.",
          image: "https://images.unsplash.com/photo-1596346599094-4dfa5c61fd0d",
        },
        {
          title: "TopView Ads",
          description:
            "Command immediate attention with premium placement upon app opening. This high-impact format guarantees maximum visibility and brand recall. Perfect for major product launches and large-scale awareness campaigns.",
          image: "https://images.unsplash.com/photo-1596346599094-4dfa5c61fd0d",
        },
        {
          title: "Branded Hashtag Ads",
          description:
            "Spark viral trends and encourage user-generated content. We design engaging hashtag challenges that multiply your brand's reach organically. Build a vibrant community around your products and services.",
          image: "https://images.unsplash.com/photo-1648007985579-b0d3877478a6",
        },
        {
          title: "Spark Ads",
          description:
            "Amplify the reach of high-performing organic videos. We turn authentic creator content into powerful advertising assets. Leverage social proof and existing engagement for significantly better conversion rates.",
          image: "https://images.unsplash.com/photo-1648007985579-b0d3877478a6",
        },
      ],
      whatWeOffer: ["In-Feed Ads", "TopView", "Branded Hashtags", "Creator Marketplace", "Spark Ads"],
      whyChooseUs: ["TikTok Certified Partner", "Expertise in viral content", "280% average ROI"],
      process: ["Trend Analysis", "Creative Development", "Influencer Partnerships", "Performance Tracking"],
    },
    seo: {
      title: "TikTok Ads Management - Xpert PPC",
      description:
        "Creative, viral-worthy campaigns that drive engagement and conversions on the world's fastest-growing social platform.",
    },
  },
  {
    slug: "amazon-ads",
    name: "Amazon Ads",
    icon: "ShoppingCart",
    shortDescription:
      "Defend your digital shelf and accelerate product sales velocity on Amazon.",
    homeDescription: "Sponsored Products, Brands & DSP growth for sellers.",
    homeTags: ["Sponsored Products", "DSP", "Keyword Bids"],
    features: ["Sponsored Products", "Sponsored Brands", "DSP", "Keyword Optimization"],
    description:
      "Dominate Amazon search results and increase product sales",
    whatWeOffer:
      "Sponsored Products, Sponsored Brands, Sponsored Display, Video ads, Keyword optimization.",
    approach:
      "Keyword research, bid optimization, ACOS management, listing optimization.",
    results: "300%+ ROI, 4-6x ROAS.",
    caseStudy: {
      client: "Health & Wellness Product Seller",
      challenge: "Lost market share to competitors, low product visibility",
      solution:
        "Optimized product listings, implemented smart bidding, expanded keyword targeting",
      timeline: "2 months",
      testimonial:
        "Our products are now dominating Amazon search results. The ROI is incredible!",
      metrics: [
        { label: "Product Visibility", value: "Page 5 → Page 1 (top 3)" },
        { label: "Monthly Sales", value: "$15K → $95K (+533%)" },
        { label: "ACOS", value: "45% → 18% (-60%)" },
        { label: "Profit Margin", value: "25% → 52%" },
      ],
    },
    detail: {
      heroTitle: "Amazon Ads (AMS) - Drive Product Sales",
      subheading:
        "Strategic Amazon advertising to increase product visibility, dominate your category, and scale your e-commerce revenue.",
      detailedServices: [
        {
          title: "Sponsored Products",
          description:
            "Boost the visibility of individual listings right in Amazon search results. We conduct exhaustive keyword research and bid optimization to win the Buy Box. Drive direct sales for your highest-margin items effortlessly.",
          image: "https://images.unsplash.com/photo-1539278383962-a7774385fa02",
        },
        {
          title: "Sponsored Brands",
          description:
            "Elevate your entire product portfolio with custom headline search ads. We design compelling brand stores and banner placements to increase brand loyalty. Capture shoppers early in their purchasing journey.",
          image: "https://images.unsplash.com/photo-1679327676630-a2d7c3e438e5",
        },
        {
          title: "Display Ads",
          description:
            "Reach relevant shoppers both on and off Amazon. We utilize product and audience targeting to engage users who viewed your items or similar products. Stay top-of-mind and drive repeat purchases reliably.",
          image: "https://images.unsplash.com/photo-1648091855145-73b112984e19",
        },
        {
          title: "Video Ads",
          description:
            "Stand out in search results with auto-playing video content. We produce concise, product-focused videos that demonstrate value instantly. Increase click-through rates and conversions significantly against static listings.",
          image: "https://images.unsplash.com/photo-1662466767355-bdda21f993fc",
        },
      ],
      whatWeOffer: ["Sponsored Products", "Sponsored Brands", "Display Ads", "Video Ads", "A+ Content Optimization"],
      whyChooseUs: ["Amazon Certified Partner", "8+ years e-commerce expertise", "320% average ACOS improvement"],
      process: ["Product Analysis", "Keyword Research", "Campaign Strategy", "Bid Optimization", "Sales Growth"],
    },
    seo: {
      title: "Amazon Ads Management - Xpert PPC",
      description:
        "Strategic Amazon advertising to increase product visibility, dominate your category, and scale your e-commerce revenue.",
    },
  },
  {
    slug: "linkedin-ads",
    name: "LinkedIn Ads",
    icon: "Linkedin",
    shortDescription:
      "Generate high-LTV B2B leads through precision professional targeting.",
    homeDescription: "B2B leads with precision job-title and firmographic targeting.",
    homeTags: ["Lead Gen Forms", "InMail", "ABM"],
    features: ["Sponsored Content", "InMail", "Lead Gen Forms", "Retargeting"],
    description:
      "Generate high-quality B2B leads and build professional brand awareness",
    whatWeOffer:
      "Sponsored content, Lead generation forms, Sponsored InMail, Text ads, Retargeting campaigns.",
    approach:
      "Decision-maker targeting, lead nurturing, account-based marketing.",
    results: "250%+ ROI, 3-5x ROAS.",
    caseStudy: {
      client: "B2B Enterprise Software Company",
      challenge: "Long sales cycle, difficulty reaching decision-makers",
      solution:
        "Implemented lead gen forms, targeted C-level executives, created nurture sequences",
      timeline: "3 months",
      testimonial:
        "LinkedIn Ads helped us reach the right decision-makers. Our pipeline is stronger than ever!",
      metrics: [
        { label: "Qualified Leads", value: "20 → 120/month (+500%)" },
        { label: "Cost per Lead", value: "$80 → $25 (-69%)" },
        { label: "Sales Cycle", value: "6 → 3 months (-50%)" },
        { label: "Deal Value", value: "$50K → $75K average (+50%)" },
      ],
    },
    detail: {
      heroTitle: "LinkedIn Ads - B2B Lead Generation & Brand Awareness",
      subheading:
        "Reach decision-makers and generate high-quality B2B leads through precise professional targeting.",
      detailedServices: [
        {
          title: "Sponsored Content",
          description:
            "Deliver your message directly into the professional feeds of key decision-makers. We craft authoritative content that builds trust and drives B2B engagement. Target by job title, industry, company size, and more.",
          image: "https://images.unsplash.com/photo-1592181572975-1d0d8880d175",
        },
        {
          title: "InMail Ads",
          description:
            "Send personalized, direct messages to your most valuable prospects. Our high-converting InMail campaigns guarantee 100% deliverability to active LinkedIn members. Perfect for high-ticket B2B lead generation and outreach.",
          image: "https://images.unsplash.com/photo-1683201681334-f25eb7658958",
        },
        {
          title: "Lead Gen Forms",
          description:
            "Capture high-quality lead data seamlessly without users leaving the platform. We optimize pre-filled forms to maximize conversion rates and data accuracy. Streamline your B2B sales pipeline effortlessly.",
          image: "https://images.unsplash.com/photo-1693045181224-9fc2f954f054",
        },
        {
          title: "Retargeting",
          description:
            "Re-engage professionals who have previously interacted with your brand or website. We deploy tailored messaging to move prospects further down the funnel. Close more B2B deals with consistent, strategic follow-up.",
          image: "https://images.unsplash.com/photo-1592181572975-1d0d8880d175",
        },
      ],
      whatWeOffer: ["Sponsored Content", "InMail", "Lead Gen Forms", "Retargeting", "Account-Based Marketing"],
      whyChooseUs: ["LinkedIn Certified Partner", "10+ years B2B marketing", "400+ qualified leads per month average"],
      process: ["Audience Targeting", "Content Strategy", "Lead Nurturing", "CRM Integration", "ROI Tracking"],
    },
    seo: {
      title: "LinkedIn Ads Management - Xpert PPC",
      description:
        "Reach decision-makers and generate high-quality B2B leads through precise professional targeting.",
    },
  },
  {
    slug: "microsoft-ads",
    name: "Microsoft Ads",
    icon: "Globe",
    shortDescription:
      "Tap into an older, affluent demographic with lower CPCs on the Bing network.",
    homeDescription: "Lower-CPC search demand on the Bing network.",
    homeTags: ["Search", "Audience Ads", "Shopping"],
    features: ["Search Ads", "Audience Ads", "Shopping Ads", "Remarketing"],
    description:
      "Reach Bing users and expand your search advertising reach",
    whatWeOffer:
      "Search ads, Display ads, Shopping ads, Audience ads.",
    approach:
      "Keyword optimization, bid management, audience targeting.",
    results: "200%+ ROI, 2-4x ROAS.",
    caseStudy: {
      client: "B2B Consulting Services",
      challenge: "Limited budget, needed cost-effective lead generation",
      solution:
        "Leveraged lower CPC on Bing, optimized for high-intent keywords",
      timeline: "1.5 months",
      testimonial:
        "Bing Ads gave us a cost-effective way to scale. Great ROI!",
      metrics: [
        { label: "Cost per Click", value: "Google $2.50 → Bing $0.85 (-66%)" },
        { label: "Monthly Leads", value: "30 → 80 (+167%)" },
        { label: "Cost per Lead", value: "$50 → $18 (-64%)" },
        { label: "Lead Quality", value: "9/10" },
      ],
    },
    detail: {
      heroTitle: "Microsoft Ads (Bing) - Reach High-Intent Users",
      subheading:
        "Capture valuable traffic on Bing and partner networks with lower competition and highly targeted audiences.",
      detailedServices: [
        {
          title: "Search Ads",
          description:
            "Capture valuable, high-intent traffic on the Bing search engine. Often featuring lower competition and cheaper CPCs than Google, we maximize your budget efficiency. Reach an older, more affluent demographic ready to purchase.",
          image: "https://images.unsplash.com/photo-1683405800702-92b45d703722",
        },
        {
          title: "Audience Ads",
          description:
            "Extend your reach across the Microsoft Audience Network, including MSN, Outlook, and Edge. We use AI-driven audience intelligence to place native ads in brand-safe environments. Build awareness beyond traditional search intent.",
          image: "https://images.unsplash.com/photo-1537731121640-bc1c4aba9b80",
        },
        {
          title: "Shopping Ads",
          description:
            "Display your e-commerce products prominently in Bing search results. We optimize your Microsoft Merchant Center feed for maximum visibility and Return on Ad Spend (ROAS). Drive direct sales from highly motivated shoppers.",
          image: "https://images.unsplash.com/photo-1539278383962-a7774385fa02",
        },
        {
          title: "Remarketing",
          description:
            "Target users who have already visited your site but haven't converted. We tailor bids and ad copy specifically for these warm leads on the Microsoft network. Increase your overall conversion rate and lower acquisition costs.",
          image: "https://images.unsplash.com/photo-1537731121640-bc1c4aba9b80",
        },
      ],
      whatWeOffer: ["Search Ads", "Audience Ads", "Shopping Ads", "Remarketing", "LinkedIn Audience Targeting"],
      whyChooseUs: ["Microsoft Certified Partner", "9+ years Bing advertising", "Often lower CPC than Google"],
      process: ["Keyword Strategy", "Bid Management", "Audience Segmentation", "Performance Analysis"],
    },
    seo: {
      title: "Microsoft Ads Management - Xpert PPC",
      description:
        "Capture valuable traffic on Bing and partner networks with lower competition and highly targeted audiences.",
    },
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
