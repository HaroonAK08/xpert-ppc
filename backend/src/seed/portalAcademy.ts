/**
 * Seeds PortalCourse curriculum + LearningResource documents for the academy.
 *
 *   cd backend && npx tsx --env-file=.env src/seed/portalAcademy.ts
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import { PortalCourse } from '../models/PortalCourse';
import { LearningResource } from '../models/LearningResource';
import { UPLOAD_DIR, publicUploadPath } from '../middleware/upload';

type LessonSeed = {
  title: string;
  type: 'lecture' | 'video' | 'assignment' | 'task';
  summary: string;
  body: string;
  durationMinutes: number;
};

type ModuleSeed = {
  title: string;
  description: string;
  lessons: LessonSeed[];
};

type CourseSeed = {
  slug: string;
  title: string;
  description: string;
  level: string;
  modules: ModuleSeed[];
  documents: { title: string; kind: 'notes' | 'assignment' | 'template'; filename: string; content: string }[];
};

function lecture(title: string, summary: string, body: string, durationMinutes = 25): LessonSeed {
  return { title, type: 'lecture', summary, body, durationMinutes };
}

function assignment(title: string, summary: string, body: string): LessonSeed {
  return { title, type: 'assignment', summary, body, durationMinutes: 45 };
}

function task(title: string, summary: string, body: string): LessonSeed {
  return { title, type: 'task', summary, body, durationMinutes: 30 };
}

const COURSES: CourseSeed[] = [
  {
    slug: 'google-ads',
    title: 'Google Ads — Live Course',
    description:
      'Learn to plan, launch and improve Google Ads campaigns that drive real leads and sales.',
    level: 'Beginner',
    modules: [
      {
        title: 'Getting started with Google Ads',
        description: 'Platform overview and account basics.',
        lessons: [
          lecture(
            'What is Google Ads',
            'How paid search works and when to use Google Ads.',
            `Google Ads puts your offer in front of people actively searching.\n\nIn this lesson you will learn:\n- Search vs Display vs Performance Max\n- How auctions and Quality Score affect cost\n- The difference between clicks, leads, and revenue\n\nOutcome: you can explain why Google Ads is a demand-capture channel.`
          ),
          lecture(
            'Account structure',
            'Clean account, campaign, and ad group hierarchy.',
            `A clean structure makes optimization easy.\n\nRecommended hierarchy:\n1. Account → billing, conversions, linking\n2. Campaign → budget + goal\n3. Ad group → tight theme\n4. Ads + keywords\n\nTask: sketch your first account map on paper before opening Ads.`
          ),
          task(
            'Create your Google Ads account checklist',
            'Set up billing, timezone, and conversion readiness.',
            `Checklist:\n- Business / website URL ready\n- Billing profile\n- Timezone = Asia/Karachi (or your market)\n- Google Analytics linked (or planned)\n- Conversion action defined (lead form, call, purchase)`
          ),
        ],
      },
      {
        title: 'Keyword research fundamentals',
        description: 'Find and organize keywords.',
        lessons: [
          lecture(
            'Intent types',
            'Informational, commercial, and transactional intent.',
            `Match keywords to buyer intent.\n\n- Informational: “how to run google ads”\n- Commercial: “best google ads agency”\n- Transactional: “hire google ads expert pakistan”\n\nFor lead-gen, prioritize commercial + transactional.`
          ),
          lecture(
            'Match types',
            'Broad, phrase, and exact — when to use each.',
            `Match types control reach:\n- Broad: discovery (watch waste)\n- Phrase: balanced\n- Exact: control\n\nStart tighter for beginners, then expand with search terms.`
          ),
          assignment(
            'Build a 30-keyword starter list',
            'Map 10 keywords per intent bucket for one offer.',
            `Pick one offer (course, service, or product).\nCreate a sheet with columns: keyword, intent, match type, landing page.\nSubmit at least 30 rows.`
          ),
        ],
      },
      {
        title: 'Search campaign setup',
        description: 'Launch your first search campaign.',
        lessons: [
          lecture(
            'Ad groups',
            'Theme keywords tightly so ads stay relevant.',
            `One ad group = one clear theme.\nExample themes: “google ads training”, “ppc freelancing”, “ecommerce google ads”.\nAvoid dumping all keywords into one ad group.`
          ),
          lecture(
            'Ads',
            'Responsive search ads that speak to intent.',
            `Write RSA assets:\n- 8–12 headlines\n- 3–4 descriptions\n- Include keyword themes + clear CTA\nPin only when necessary.`
          ),
          lecture(
            'Bidding',
            'Manual CPC vs Maximize Conversions basics.',
            `Beginners: start with Maximize Clicks (capped CPC) or Manual CPC while learning.\nOnce conversions are tracked, move toward Maximize Conversions.`
          ),
          task(
            'Draft your first Search campaign brief',
            'Campaign goal, budget, locations, ad groups.',
            `Document:\n- Daily budget\n- Locations/languages\n- 2–3 ad groups\n- Primary conversion\n- Landing page URL`
          ),
        ],
      },
      {
        title: 'Ad copy that converts',
        description: 'Write stronger headlines and descriptions.',
        lessons: [
          lecture(
            'RSA tips',
            'Hooks, benefits, proof, and CTA formulas.',
            `Headline formulas:\n- {Keyword} + benefit\n- Social proof\n- Offer / urgency\n- CTA\n\nKeep claims honest and specific.`
          ),
          lecture(
            'Extensions',
            'Sitelinks, callouts, structured snippets, calls.',
            `Extensions improve CTR and Quality Score signals.\nAdd sitelinks to key pages and callouts with differentiators.`
          ),
          assignment(
            'Write one RSA pack',
            '12 headlines + 4 descriptions for your offer.',
            `Deliver a copy pack ready to paste into Google Ads.`
          ),
        ],
      },
      {
        title: 'Tracking and measurement',
        description: 'Conversion tracking essentials.',
        lessons: [
          lecture(
            'Tags',
            'Google tag / gtag and Tag Manager overview.',
            `Conversions must be reliable before you optimize.\nChoose: Google tag on site or GTM.\nTest with Tag Assistant.`
          ),
          lecture(
            'Goals',
            'Primary vs secondary conversions.',
            `Primary: lead submit, purchase, qualified call.\nSecondary: page view, button click (observe only).\nNever optimize to vanity events.`
          ),
        ],
      },
      {
        title: 'Optimization & reporting',
        description: 'Improve performance weekly.',
        lessons: [
          lecture(
            'Search terms',
            'Add negatives and promote winners.',
            `Weekly ritual:\n1. Pull search terms\n2. Negate junk\n3. Add strong queries as keywords\n4. Pause waste`
          ),
          lecture(
            'Reports',
            'CTR, CPC, conv. rate, CPA — what to act on.',
            `Read the story, not one metric.\nHigh CTR + low conv = landing/offer issue.\nLow CTR = ad/keyword mismatch.`
          ),
          assignment(
            'Weekly optimization checklist',
            'Run one optimization pass on a practice account or audit.',
            `Use the course checklist document and note 5 actions you would take.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'Google Ads account setup checklist',
        kind: 'notes',
        filename: 'google-ads-account-setup-checklist.txt',
        content: `XpertPPC — Google Ads Account Setup Checklist\n\n1. Create / access Google Ads account\n2. Set timezone and currency\n3. Add billing\n4. Link Analytics / Tag Manager\n5. Define primary conversion\n6. Verify conversion fires with a test\n7. Draft campaign structure (campaign → ad groups)\n8. Prepare landing page\n9. Set daily budget and geo targeting\n10. Launch with tracking live\n`,
      },
      {
        title: 'Keyword research worksheet',
        kind: 'template',
        filename: 'google-ads-keyword-worksheet.txt',
        content: `Keyword | Intent | Match type | Ad group | Landing page | Notes\n--------|--------|------------|----------|--------------|------\n        |        |            |          |              |\n`,
      },
      {
        title: 'Weekly optimization checklist',
        kind: 'assignment',
        filename: 'google-ads-weekly-optimization.txt',
        content: `Weekly Google Ads Optimization\n\n- [ ] Review search terms → add negatives\n- [ ] Check CTR by ad group\n- [ ] Review conversion rate / CPA\n- [ ] Pause wasted keywords\n- [ ] Refresh weakest RSA assets\n- [ ] Confirm tracking still works\n- [ ] Note 3 learnings for next week\n`,
      },
    ],
  },
  {
    slug: 'meta-ads',
    title: 'Meta Ads — Live Course',
    description:
      'Learn to create and optimize Meta Ads for Facebook and Instagram that grow brands and sales.',
    level: 'Beginner',
    modules: [
      {
        title: 'Meta Ads overview',
        description: 'How Meta advertising works.',
        lessons: [
          lecture(
            'Why Meta Ads',
            'Demand creation vs search intent.',
            `Meta finds people who match your audience signals — even if they are not searching yet.\nGreat for awareness, leads, and ecom when creative is strong.`
          ),
          lecture(
            'Campaign objectives',
            'Awareness, traffic, engagement, leads, sales.',
            `Pick the objective that matches the business goal.\nLeads ≠ traffic. Sales ≠ engagement.`
          ),
        ],
      },
      {
        title: 'Business Manager & pixels',
        description: 'Setup essentials.',
        lessons: [
          lecture(
            'Business Manager setup',
            'Pages, ad accounts, people, and permissions.',
            `Create a clean BM structure so assets are not stuck on personal profiles.`
          ),
          lecture(
            'Pixel & events',
            'Install Pixel and define key events.',
            `Core events: PageView, Lead, Purchase, AddToCart.\nUse Events Manager test tools before spending.`
          ),
          task(
            'BM readiness checklist',
            'Confirm page, ad account, and Pixel ownership.',
            `List your BM ID, ad account ID, page, and Pixel status.`
          ),
        ],
      },
      {
        title: 'Audiences & placements',
        description: 'Targeting and delivery.',
        lessons: [
          lecture(
            'Custom & lookalike audiences',
            'Build from website, engagers, and customer lists.',
            `Start with warm audiences when possible, then expand with lookalikes.`
          ),
          lecture(
            'Interest targeting basics',
            'When broad vs detailed targeting makes sense.',
            `Advantage+ / broader targeting works better with strong creative + Pixel data.`
          ),
        ],
      },
      {
        title: 'Creative that stops the scroll',
        description: 'Hooks, formats, and copy.',
        lessons: [
          lecture(
            'Hook formulas',
            'First 3 seconds decide the scroll.',
            `Patterns: problem, result, curiosity, proof, offer.\nDesign for sound-off + captions.`
          ),
          assignment(
            'Create 3 ad concepts',
            'Hook, visual idea, primary text, CTA.',
            `Deliver 3 concepts in a simple table.`
          ),
        ],
      },
      {
        title: 'Campaign structure',
        description: 'Objectives, budgets, and testing.',
        lessons: [
          lecture(
            'Testing structure',
            'One variable at a time.',
            `Test creative first for most beginners.\nKeep audiences stable while creatives rotate.`
          ),
          lecture(
            'Budgets & learning',
            'Avoid killing ads too early.',
            `Give ads enough delivery before judging.\nWatch CPC, CTR, and cost per result together.`
          ),
        ],
      },
      {
        title: 'Optimization & scaling',
        description: 'Grow winners without waste.',
        lessons: [
          lecture(
            'Kill / keep / scale',
            'Decision framework from Ads Manager.',
            `Kill: expensive + no results\nKeep: learning / early signal\nScale: stable CPA with room to grow`
          ),
          assignment(
            'Ads Manager audit',
            'Review a sample account or screenshots and recommend actions.',
            `Write 5 recommendations with the metric that justifies each.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'Meta Business Manager setup guide',
        kind: 'notes',
        filename: 'meta-ads-bm-setup.txt',
        content: `Meta BM Setup\n\n1. Create Business Manager\n2. Add Facebook Page\n3. Create Ad Account\n4. Add Pixel / Dataset\n5. Install Pixel via GTM or partner\n6. Verify domain\n7. Assign team permissions\n8. Run Events Manager test event\n`,
      },
      {
        title: 'Ad creative brief template',
        kind: 'template',
        filename: 'meta-ads-creative-brief.txt',
        content: `Concept name:\nObjective:\nAudience:\nHook (3 sec):\nVisual idea:\nPrimary text:\nHeadline:\nCTA:\nOffer:\n`,
      },
    ],
  },
  {
    slug: 'tiktok-ads',
    title: 'TikTok Ads — Live Course',
    description:
      'Learn TikTok Ads creative strategy and campaign setup to turn short-form video into growth.',
    level: 'Beginner',
    modules: [
      {
        title: 'Intro to TikTok Ads',
        description: 'Why TikTok works for performance.',
        lessons: [
          lecture(
            'TikTok advertising model',
            'Native creative wins.',
            `TikTok rewards content that feels organic.\nHard-sell static creatives usually underperform.`
          ),
          lecture(
            'Ads Manager overview',
            'Campaign → Ad group → Ad.',
            `Learn the hierarchy before launching.`
          ),
        ],
      },
      {
        title: 'Creative that performs',
        description: 'Hooks and UGC-style formats.',
        lessons: [
          lecture(
            'Hook library',
            'Patterns that stop the scroll.',
            `Use pattern interrupts, POV, before/after, and native captions.`
          ),
          assignment(
            'Film / script 2 native ads',
            '15–30 second concepts.',
            `Script two ads with hook, body, CTA.`
          ),
        ],
      },
      {
        title: 'Campaign structure',
        description: 'Traffic and conversion setups.',
        lessons: [
          lecture(
            'Objectives & optimization events',
            'Match event to funnel stage.',
            `Do not optimize for clicks if you need leads.`
          ),
          lecture(
            'Targeting & bidding basics',
            'Start simple, expand with data.',
            `Begin with broad + strong creative when possible.`
          ),
          task(
            'Launch checklist',
            'Pixel/events, creative, offer, landing page.',
            `Confirm all four are ready before spend.`
          ),
        ],
      },
      {
        title: 'Optimization basics',
        description: 'Find winners and scale.',
        lessons: [
          lecture(
            'Creative testing system',
            'Iterate hooks weekly.',
            `Keep a swipe file of winning hooks and angles.`
          ),
          assignment(
            'Testing plan',
            'Plan 5 creatives across 2 angles.',
            `Document hypothesis, metric, and kill rule.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'TikTok ad script template',
        kind: 'template',
        filename: 'tiktok-ads-script-template.txt',
        content: `Hook (0–3s):\nProblem:\nProof / demo:\nOffer:\nCTA:\nCaption text on screen:\n`,
      },
      {
        title: 'TikTok launch checklist',
        kind: 'notes',
        filename: 'tiktok-ads-launch-checklist.txt',
        content: `- Pixel / events ready\n- Offer clear in first 3 seconds\n- Captions on\n- Landing page mobile-ready\n- Budget set\n- Creative variations uploaded\n`,
      },
    ],
  },
  {
    slug: 'seo',
    title: 'SEO — Live Course',
    description: 'Learn SEO fundamentals to grow organic traffic, rankings, and long-term visibility.',
    level: 'Beginner',
    modules: [
      {
        title: 'How SEO works',
        description: 'Crawl, index, rank.',
        lessons: [
          lecture(
            'Search fundamentals',
            'How Google evaluates pages.',
            `Relevance, usefulness, experience, and authority all matter.\nSEO is a system — not a one-time trick.`
          ),
          lecture(
            'Intent first',
            'Match content to what people want.',
            `If intent is wrong, rankings will not convert.`
          ),
        ],
      },
      {
        title: 'Keyword research',
        description: 'Find topics worth ranking for.',
        lessons: [
          lecture(
            'Keyword research process',
            'Seed terms → clusters → priorities.',
            `Prioritize: demand × relevance × ability to rank.`
          ),
          assignment(
            'Build a keyword map',
            '20 keywords mapped to page types.',
            `Include primary keyword, intent, and target URL.`
          ),
        ],
      },
      {
        title: 'On-page optimization',
        description: 'Titles, content, internal links.',
        lessons: [
          lecture(
            'On-page blueprint',
            'Title, H1, sections, FAQs, internal links.',
            `Write for humans first. Use keywords naturally.`
          ),
          task(
            'Optimize one page outline',
            'Rewrite title + H2 structure for one target keyword.',
            `Deliver before/after outline.`
          ),
        ],
      },
      {
        title: 'Technical SEO basics',
        description: 'Crawl, index, speed.',
        lessons: [
          lecture(
            'Technical starter audit',
            'Indexation, sitemap, mobile, speed basics.',
            `Use Search Console + PageSpeed as starting tools.`
          ),
        ],
      },
      {
        title: 'Content strategy',
        description: 'Plan what to publish.',
        lessons: [
          lecture(
            '90-day content plan',
            'What to publish and why.',
            `Mix money pages, supporting articles, and trust content.`
          ),
        ],
      },
      {
        title: 'Reporting & next steps',
        description: 'Measure organic growth.',
        lessons: [
          lecture(
            'SEO reporting',
            'Impressions, clicks, positions, conversions.',
            `Track leading indicators before revenue moves.`
          ),
          assignment(
            'Write a 90-day SEO plan',
            'Prioritized actions for one website.',
            `Include technical, on-page, and content tasks.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'SEO on-page checklist',
        kind: 'notes',
        filename: 'seo-onpage-checklist.txt',
        content: `On-page SEO Checklist\n\n- Primary keyword in title + H1\n- Clear search intent match\n- Helpful intro in first 100 words\n- Logical H2/H3 structure\n- Internal links to related pages\n- Image alt text\n- Fast mobile experience\n- FAQ / unique value section\n`,
      },
      {
        title: 'Keyword-to-content map template',
        kind: 'template',
        filename: 'seo-keyword-map.txt',
        content: `Primary keyword | Intent | Page type | Target URL | Priority | Notes\n----------------|--------|-----------|------------|----------|------\n`,
      },
    ],
  },
  {
    slug: 'client-acquisition',
    title: 'Client Acquisition — Live Course',
    description: 'Learn how to find, pitch, and win paying clients on Upwork, Fiverr and LinkedIn.',
    level: 'Beginner',
    modules: [
      {
        title: 'Freelancing mindset',
        description: 'Positioning and niche clarity.',
        lessons: [
          lecture(
            'Pick a niche offer',
            'Who you help + what result you sell.',
            `Clarity beats “I do everything digital marketing”.`
          ),
        ],
      },
      {
        title: 'Upwork profile setup',
        description: 'Trust signals that convert.',
        lessons: [
          lecture(
            'Profile that wins interviews',
            'Photo, title, overview, portfolio.',
            `Lead with outcomes and niche. Remove fluff.`
          ),
          task(
            'Rewrite your Upwork overview',
            '150–300 words focused on results.',
            `Use: who you help → proof → process → CTA.`
          ),
        ],
      },
      {
        title: 'Winning proposals',
        description: 'Proposals that get replies.',
        lessons: [
          lecture(
            'Proposal framework',
            'Hook, understanding, plan, CTA.',
            `Never send a generic template without job-specific lines.`
          ),
          assignment(
            'Write 3 tailored proposals',
            'For 3 real or sample job posts.',
            `Each must mention a specific detail from the job.`
          ),
        ],
      },
      {
        title: 'Fiverr gigs',
        description: 'Gig packaging and positioning.',
        lessons: [
          lecture(
            'Gig structure',
            'Title, packages, FAQ, gallery.',
            `Sell a clear deliverable, not vague “marketing help”.`
          ),
        ],
      },
      {
        title: 'LinkedIn for clients',
        description: 'Profile + outreach.',
        lessons: [
          lecture(
            'LinkedIn outbound without spam',
            'Value-first messaging.',
            `Start conversations; do not pitch in message one.`
          ),
        ],
      },
      {
        title: 'Closing and delivery',
        description: 'Price, objections, reviews.',
        lessons: [
          lecture(
            'Pricing & closing',
            'Quote with confidence.',
            `Anchor on outcome and scope. Put deliverables in writing.`
          ),
          assignment(
            'Create your offer one-pager',
            'Package, price range, process, proof.',
            `One page you can send after a discovery call.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'Upwork proposal template',
        kind: 'template',
        filename: 'client-acquisition-upwork-proposal.txt',
        content: `Hi {Name},\n\nI noticed you need {specific need from job post}.\nI help {ideal client} get {result} using {method}.\n\nFor your project I would:\n1. ...\n2. ...\n3. ...\n\nRecent relevant result: {proof}\n\nIf useful, I can share a short plan on a quick call.\n\nThanks,\n{Your name}\n`,
      },
      {
        title: 'Client offer one-pager',
        kind: 'notes',
        filename: 'client-acquisition-offer-onepager.txt',
        content: `Offer name:\nWho it's for:\nProblem:\nResult:\nDeliverables:\nTimeline:\nInvestment:\nProcess:\nProof:\nNext step:\n`,
      },
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development — Live Course',
    description:
      'Learn to build modern, responsive websites with HTML, CSS and JavaScript — and publish real projects.',
    level: 'Beginner',
    modules: [
      {
        title: 'Intro to the web',
        description: 'How websites work.',
        lessons: [
          lecture(
            'HTML, CSS, JS roles',
            'Structure, style, behavior.',
            `HTML = structure, CSS = look, JS = interactivity.`
          ),
        ],
      },
      {
        title: 'HTML structure',
        description: 'Semantic pages.',
        lessons: [
          lecture(
            'Semantic HTML',
            'header, main, section, footer, forms.',
            `Accessible structure helps users and SEO.`
          ),
          task(
            'Build a semantic homepage skeleton',
            'Nav, hero, services, contact, footer.',
            `No CSS required yet — clean HTML only.`
          ),
        ],
      },
      {
        title: 'CSS styling & layouts',
        description: 'Flexbox and visual hierarchy.',
        lessons: [
          lecture(
            'CSS fundamentals',
            'Box model, typography, color, spacing.',
            `Consistency beats fancy effects.`
          ),
          lecture(
            'Flexbox layouts',
            'Navbars, cards, and hero rows.',
            `Practice aligning and distributing items.`
          ),
        ],
      },
      {
        title: 'Responsive design',
        description: 'Mobile-first pages.',
        lessons: [
          lecture(
            'Media queries',
            'Breakpoints that feel natural.',
            `Design mobile first, then enhance for desktop.`
          ),
          assignment(
            'Make a responsive landing section',
            'Works on phone and desktop.',
            `Submit screenshots or a live link.`
          ),
        ],
      },
      {
        title: 'JavaScript essentials',
        description: 'Interactive UI.',
        lessons: [
          lecture(
            'JS basics for websites',
            'DOM, events, simple state.',
            `Build mobile menus, tabs, and form validation.`
          ),
          task(
            'Add a mobile menu',
            'Toggle open/close with JS.',
            `Accessible button + keyboard friendly if possible.`
          ),
        ],
      },
      {
        title: 'Build and publish a site',
        description: 'Ship a real project.',
        lessons: [
          lecture(
            'Publishing basics',
            'GitHub Pages / Netlify / host overview.',
            `A published site beats unfinished local files.`
          ),
          assignment(
            'Ship your portfolio site',
            'Publish a 1–3 page site.',
            `Include home, about/services, and contact.`
          ),
        ],
      },
    ],
    documents: [
      {
        title: 'HTML page starter template',
        kind: 'template',
        filename: 'web-dev-html-starter.txt',
        content: `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Your Site</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <header></header>\n  <main></main>\n  <footer></footer>\n  <script src="script.js"></script>\n</body>\n</html>\n`,
      },
      {
        title: 'Responsive launch checklist',
        kind: 'notes',
        filename: 'web-dev-responsive-checklist.txt',
        content: `- Readable on mobile without zoom\n- Buttons easy to tap\n- Images scale\n- No horizontal scroll\n- Forms usable on phone\n- Fast enough on 4G\n`,
      },
    ],
  },
];

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function writeDoc(filename: string, content: string) {
  ensureUploadsDir();
  const full = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(full, content, 'utf8');
  return publicUploadPath(filename);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri);
  console.log('→ connected');

  for (const course of COURSES) {
    const modules = course.modules.map((mod, mi) => ({
      title: mod.title,
      description: mod.description,
      order: mi,
      lessons: mod.lessons.map((lesson, li) => ({
        title: lesson.title,
        type: lesson.type,
        summary: lesson.summary,
        body: lesson.body,
        videoUrl: '',
        fileUrl: '',
        fileName: '',
        durationMinutes: lesson.durationMinutes,
        order: li,
        published: true,
      })),
    }));

    const saved = await PortalCourse.findOneAndUpdate(
      { slug: course.slug },
      {
        $set: {
          title: course.title,
          description: course.description,
          level: course.level,
          published: true,
          timezone: 'Asia/Karachi',
          modules,
        },
        $setOnInsert: {
          slug: course.slug,
          thumbnailUrl: '',
          meetLink: '',
          nextClassAt: null,
        },
      },
      { upsert: true, new: true }
    );

    if (!saved) throw new Error(`Failed to upsert ${course.slug}`);

    await LearningResource.deleteMany({ courseId: saved._id });

    for (const doc of course.documents) {
      const fileUrl = writeDoc(doc.filename, doc.content);
      await LearningResource.create({
        courseId: saved._id,
        title: doc.title,
        kind: doc.kind,
        description: `Downloadable ${doc.kind} for ${course.title}.`,
        fileUrl,
        published: true,
      });
    }

    const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
    console.log(
      `✓ ${course.slug}: ${modules.length} modules, ${lessonCount} lessons, ${course.documents.length} docs`
    );
  }

  await mongoose.disconnect();
  console.log('→ done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
