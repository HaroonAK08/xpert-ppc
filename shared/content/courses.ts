import type { IconName } from '../types';

export type CourseModule = { title: string; lessons: string[] };

export type Course = {
  slug: string;
  name: string;
  shortName: string;
  icon: IconName;
  tagline: string;
  description: string;
  overview: string;
  skills: string[];
  modules: CourseModule[];
  audience: string[];
  features: string[];
  tools: string[];
  requirements: { title: string; description: string }[];
  seo: { title: string; description: string };
};

export const courseRequirements = [
  { title: "Laptop or Desktop", description: "Required for hands-on campaign building." },
  { title: "Stable Internet", description: "To join live sessions without interruptions." },
  { title: "Google Meet", description: "Installed or accessible via browser." },
  { title: "Note-taking Material", description: "Digital or physical notebook to retain key strategies." },
];

export const courses: Course[] = [
  {
    slug: "sem",
    name: "Complete SEM Course (Google & Microsoft Ads)",
    shortName: "SEM Course",
    icon: "Search",
    tagline: "Master Search Engine Marketing from zero to advanced.",
    description:
      "Master Search Engine Marketing from zero to advanced. Learn how to launch profitable campaigns, scale businesses, track conversions, and land high-paying clients as a top-tier freelancer.",
    overview:
      "This intensive program bridges the gap between theory and real-world execution. We don't just teach you what buttons to click; we teach you the strategy, methodology, and optimization techniques used by top-tier agencies to scale accounts aggressively.",
    skills: ["Google Ads", "Microsoft Ads", "Search Campaigns", "Shopping Campaigns", "Performance Max", "YouTube Ads", "Display Ads", "Ecommerce Advertising", "Lead Generation", "Conversion Tracking", "AI & Automation", "Freelancing & Client Hunting"],
    modules: [
      {
        title: "Introduction to SEM & Ecosystem",
        lessons: ["What is Search Engine Marketing?", "Google Ads vs. Microsoft Ads", "Understanding Auction Dynamics", "Account Hierarchy & Setup"],
      },
      {
        title: "Comprehensive Keyword Research",
        lessons: ["Intent-based Keyword Targeting", "Google Keyword Planner", "Negative Keywords & Match Types", "Competitor Keyword Analysis"],
      },
      {
        title: "Google Search Campaigns",
        lessons: ["Campaign Creation Step-by-Step", "Bidding Strategies & Budget Allocation", "Ad Group Structuring", "Ad Extensions & Ad Rank"],
      },
      {
        title: "Advanced Ad Copywriting",
        lessons: ["Writing High-CTR Headlines", "Responsive Search Ads (RSAs)", "Dynamic Keyword Insertion (DKI)", "A/B Testing Ad Copy"],
      },
      {
        title: "Google Display Network (GDN)",
        lessons: ["Display Targeting Options", "Responsive Display Ads", "Remarketing Campaigns", "Placement & Audience Exclusions"],
      },
      {
        title: "YouTube Ads (Video Campaigns)",
        lessons: ["Skippable vs Non-Skippable Ads", "In-feed Video Ads", "YouTube Remarketing", "Cost-per-View (CPV) Bidding"],
      },
      {
        title: "Google Shopping & Merchant Center",
        lessons: ["Merchant Center Setup & Feeds", "Standard Shopping Campaigns", "Feed Optimization Strategies", "Fixing Disapprovals"],
      },
      {
        title: "Performance Max (PMax) Campaigns",
        lessons: ["Asset Groups & Audience Signals", "PMax for Ecommerce vs Lead Gen", "Optimizing PMax Campaigns", "Reporting & Insights"],
      },
      {
        title: "Microsoft Ads (Bing) Integration",
        lessons: ["Importing from Google Ads", "Microsoft Audience Network", "LinkedIn Profile Targeting", "Bing Specific Strategies"],
      },
      {
        title: "Lead Generation Mastery",
        lessons: ["B2B Lead Gen Strategies", "Local Service Ads", "Call-Only Campaigns", "Lead Form Extensions"],
      },
      {
        title: "Conversion Tracking & Analytics",
        lessons: ["Google Tag Manager (GTM) Setup", "GA4 Integration", "Offline Conversion Tracking", "Value-Based Bidding"],
      },
      {
        title: "Optimization & Scaling",
        lessons: ["Search Term Reports", "Quality Score Improvement", "Budget Scaling Rules", "Bid Adjustments"],
      },
      {
        title: "AI & Automation in SEM",
        lessons: ["Using ChatGPT for Ad Copy", "Automated Rules & Scripts", "Smart Bidding Strategies", "Predictive Audiences"],
      },
      {
        title: "Reporting & Looker Studio",
        lessons: ["Custom Dashboard Creation", "Client Reporting Metrics", "Data Visualization", "Automated Reports"],
      },
      {
        title: "Client Hunting & Proposals",
        lessons: ["Finding SEM Clients", "Crafting Winning Proposals", "Pricing Your Services", "Client Onboarding"],
      },
      {
        title: "Upwork & Freelancing Success",
        lessons: ["Optimizing Upwork Profile", "Writing Proposals & Cover Letters", "Getting Your First Order", "Top Rated Strategies"],
      },
    ],
    audience: ["Students", "Beginners", "Freelancers", "Ecommerce Businesses", "Local Businesses", "Marketing Professionals", "Business Owners"],
    features: [
      "Beginner Friendly",
      "Practical Learning",
      "Ecommerce Mastery",
      "Lead Generation",
      "Google Ads",
      "Microsoft Ads",
      "AI Strategies",
      "Freelancing Guidance",
      "Online Classes",
    ],
    tools: ["Google Ads", "Microsoft Ads", "Google Tag Manager", "GA4", "Google Merchant Center", "ChatGPT", "Canva", "Looker Studio", "Google Sheets"],
    requirements: courseRequirements,
    seo: {
      title: "Complete SEM Course (Google & Microsoft Ads) | Xpert PPC Digital Academy",
      description:
        "Master Search Engine Marketing with our comprehensive course covering Google Ads, Microsoft Ads, Analytics, and Freelancing by Xpert PPC.",
    },
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing Course",
    shortName: "Social Media Marketing Course",
    icon: "Megaphone",
    tagline: "Practical social media marketing, SEO basics, Canva design, and freelancing.",
    description:
      "Learn practical social media marketing, SEO basics, Canva design, and freelancing. Enroll in the Xpert PPC Digital Academy and build a career from home.",
    overview:
      "A practical, project-led program that takes you from zero presence to running paid and organic social campaigns that convert — plus the freelancing skills to sell those services.",
    skills: ["Social Media Marketing", "LinkedIn Lead Generation", "SEO Basics", "Canva Design", "Client Hunting", "Freelancing Basics", "AI Tools for Marketing"],
    modules: [
      {
        title: "Module 1: Introduction to Digital Marketing",
        lessons: ["Understanding the Digital Landscape", "Social Media vs Traditional Marketing", "Setting Goals and KPIs"],
      },
      {
        title: "Module 2: Building Your Brand Identity",
        lessons: ["Finding Your Niche", "Creating a Compelling Bio", "Visual Consistency and Branding"],
      },
      {
        title: "Module 3: Content Strategy & Planning",
        lessons: ["Content Pillars and Themes", "Creating a Content Calendar", "Understanding Algorithms"],
      },
      {
        title: "Module 4: Canva Design Masterclass",
        lessons: ["Canva Interface Basics", "Designing Posts & Stories", "Video Editing in Canva"],
      },
      {
        title: "Module 5: Facebook & Instagram Marketing",
        lessons: ["Page Optimization", "Organic Growth Strategies", "Meta Business Suite Basics"],
      },
      {
        title: "Module 6: Meta Ads Fundamentals",
        lessons: ["Setting up Ad Accounts", "Campaign Objectives", "Targeting & Audience Creation"],
      },
      {
        title: "Module 7: LinkedIn Lead Generation",
        lessons: ["Profile Optimization", "Networking Strategies", "Using Sales Navigator Fundamentals"],
      },
      {
        title: "Module 8: SEO Basics for Social Media",
        lessons: ["Keyword Research", "Hashtag Strategy", "Optimizing Profiles for Search"],
      },
      {
        title: "Module 9: AI Tools for Marketers",
        lessons: ["ChatGPT for Copywriting", "AI for Content Ideation", "Automating Workflows"],
      },
      {
        title: "Module 10: Freelancing & Client Hunting",
        lessons: ["Setting up Upwork/Fiverr", "Pitching to Clients", "Pricing Your Services"],
      },
      {
        title: "Module 11: Final Project & Certification",
        lessons: ["Live Campaign Execution", "Performance Reporting", "Course Certification"],
      },
    ],
    audience: ["Students", "Beginners", "Freelancers", "Business Owners", "Housewives", "Job Seekers"],
    features: [
      "Beginner Friendly Training",
      "Practical Learning",
      "Freelancing Guidance",
      "Live Assignments",
      "AI Tools Included",
      "Real-World Marketing Strategies",
      "Online Virtual Classes",
    ],
    tools: ["Meta Business Suite", "Canva", "LinkedIn", "ChatGPT", "Google Analytics"],
    requirements: courseRequirements,
    seo: {
      title: "Social Media Marketing Course | Xpert PPC Digital Academy",
      description:
        "Learn practical social media marketing, SEO basics, Canva design, and freelancing. Enroll in the Xpert PPC Digital Academy course starting June 1st.",
    },
  },
  {
    slug: "seo",
    name: "Complete SEO Course",
    shortName: "Complete SEO Course",
    icon: "TrendingUp",
    tagline: "Learn SEO from beginner to advanced.",
    description:
      "Learn SEO from beginner to advanced. Master On-Page, Off-Page, Technical SEO, and AI strategies with Xpert PPC Digital Academy.",
    overview:
      "From how search engines crawl and rank, to technical audits, content strategy, link acquisition, and the AI workflows modern SEOs use daily.",
    skills: ["On-Page SEO", "Off-Page SEO", "Local SEO", "Ecommerce SEO", "AI SEO", "Technical SEO Basics", "Keyword Research", "SEO Tools & Reporting", "Freelancing & Client Hunting"],
    modules: [
      {
        title: "Module 1: Introduction to SEO",
        lessons: ["How Search Engines Work", "SEO Fundamentals & Ranking Factors", "Setting SEO Goals"],
      },
      {
        title: "Module 2: Advanced Keyword Research",
        lessons: ["Understanding Search Intent", "Long-tail vs Short-tail Keywords", "Competitor Keyword Analysis"],
      },
      {
        title: "Module 3: On-Page SEO Mastery",
        lessons: ["Title Tags & Meta Descriptions", "URL Structure & Header Tags", "Content Optimization Strategies"],
      },
      {
        title: "Module 4: Technical SEO Basics",
        lessons: ["Site Architecture & Navigation", "XML Sitemaps & Robots.txt", "Core Web Vitals & Page Speed"],
      },
      {
        title: "Module 5: Off-Page SEO & Link Building",
        lessons: ["Understanding Backlinks", "Guest Posting & Outreach", "Digital PR Strategies"],
      },
      {
        title: "Module 6: Local SEO Strategies",
        lessons: ["Google Business Profile Setup", "Local Citations & Directories", "Review Management"],
      },
      {
        title: "Module 7: Ecommerce SEO",
        lessons: ["Optimizing Product Pages", "Category Page SEO", "Faceted Navigation Best Practices"],
      },
      {
        title: "Module 8: Content Marketing for SEO",
        lessons: ["Creating Topic Clusters", "Writing SEO-Friendly Blog Posts", "Content Refresh Strategies"],
      },
      {
        title: "Module 9: AI in SEO",
        lessons: ["Using ChatGPT for SEO Tasks", "Automating Keyword Grouping", "AI Content Guidelines"],
      },
      {
        title: "Module 10: SEO Tools & Analytics",
        lessons: ["Google Search Console Setup", "Google Analytics 4 Basics", "Tracking Conversions"],
      },
      {
        title: "Module 11: SEO Auditing",
        lessons: ["Running a Complete Site Audit", "Identifying Quick Wins", "Creating Action Plans"],
      },
      {
        title: "Module 12: Reporting & Client Management",
        lessons: ["Creating SEO Reports", "Communicating ROI to Clients", "Setting Expectations"],
      },
      {
        title: "Module 13: Freelancing & Client Hunting",
        lessons: ["Creating Your Upwork Profile", "Pitching SEO Services", "Pricing Your Projects"],
      },
    ],
    audience: ["Students", "Beginners", "Freelancers", "Ecommerce Store Owners", "Local Businesses", "Digital Marketers", "Business Owners"],
    features: [
      "Beginner Friendly Training",
      "Practical SEO Learning",
      "Local SEO Included",
      "Ecommerce SEO Included",
      "AI SEO Included",
      "Freelancing Guidance",
      "Real-World SEO Strategies",
      "Online Virtual Classes",
    ],
    tools: ["Google Search Console", "GA4", "Ahrefs", "Screaming Frog", "ChatGPT", "Looker Studio"],
    requirements: courseRequirements,
    seo: {
      title: "Complete SEO Course | Xpert PPC Digital Academy",
      description:
        "Learn SEO from beginner to advanced. Master On-Page, Off-Page, Technical SEO, and AI strategies with Xpert PPC's Complete SEO Course.",
    },
  },
];

export const courseSlugs = courses.map((c) => c.slug);

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
