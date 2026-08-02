/**
 * Seeds MongoDB from shared/content and creates the first admin user.
 *
 *   cd backend && npm run seed
 *
 * Safe to re-run: every document is upserted by its natural key.
 */
import mongoose from 'mongoose';

import { services as serviceContent } from '../../../shared/content/services';
import { faqs as faqContent } from '../../../shared/content/faqs';
import { courses as courseContent } from '../../../shared/content/courses';
import { industries as industryContent } from '../../../shared/content/industries';
import { desertFarms } from '../../../shared/content/case-studies';
import { umerKhan } from '../../../shared/content/team';

import { Service } from '../models/Service';
import { Faq } from '../models/Faq';
import { Course } from '../models/Course';
import { Industry } from '../models/Industry';
import { CaseStudy } from '../models/CaseStudy';
import { TeamMember } from '../models/TeamMember';
import { Testimonial } from '../models/Testimonial';
import { AdminUser } from '../models/AdminUser';
import { hashPassword } from '../utils/password';

const upsert = { upsert: true, setDefaultsOnInsert: true };

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env');

  await mongoose.connect(uri);
  console.log('→ connected to MongoDB');

  /* ------------------------------ services ----------------------------- */
  for (const [i, s] of serviceContent.entries()) {
    await Service.findOneAndUpdate(
      { slug: s.slug },
      {
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        description: s.description,
        icon: s.icon,
        tags: s.features,
        order: i,
        published: true,
        hero: { eyebrow: 'Services', title: s.detail.heroTitle, subtitle: s.detail.subheading },
        features: s.detail.detailedServices.map((d) => ({
          title: d.title,
          description: d.description,
          icon: 'Check',
        })),
        process: s.detail.process.map((p, idx) => ({
          step: `Step ${idx + 1}`,
          title: p,
          description: '',
        })),
        seo: { title: s.seo.title, description: s.seo.description, keywords: [] },
      },
      upsert
    );
  }
  console.log(`✓ services: ${serviceContent.length}`);

  /* -------------------------------- faqs ------------------------------- */
  for (const [i, f] of faqContent.entries()) {
    await Faq.findOneAndUpdate(
      { question: f.question },
      {
        question: f.question,
        answer: f.answer,
        // The Faq model's enum uses "General" where the page copy says "General PPC".
        category: f.category === 'General PPC' ? 'General' : f.category,
        order: i,
        published: true,
      },
      upsert
    );
  }
  console.log(`✓ faqs: ${faqContent.length}`);

  /* ------------------------------- courses ----------------------------- */
  for (const [i, c] of courseContent.entries()) {
    await Course.findOneAndUpdate(
      { slug: c.slug },
      {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        tagline: c.tagline,
        description: c.description,
        icon: c.icon,
        order: i,
        published: true,
        outcomes: c.skills,
        modules: c.modules.map((m) => ({ title: m.title, description: '', lessons: m.lessons })),
        audience: c.audience,
        features: c.features,
        tools: c.tools,
        seo: { title: c.seo.title, description: c.seo.description, keywords: [] },
      },
      upsert
    );
  }
  console.log(`✓ courses: ${courseContent.length}`);

  /* ------------------------------ industries --------------------------- */
  for (const [i, ind] of industryContent.entries()) {
    await Industry.findOneAndUpdate(
      { slug: ind.slug },
      {
        slug: ind.slug,
        name: ind.name,
        tagline: ind.eyebrow,
        description: ind.heroDescription,
        icon: 'Stethoscope',
        order: i,
        published: true,
        hero: {
          eyebrow: ind.eyebrow,
          title: `${ind.heroTitle} ${ind.heroHighlight}`,
          subtitle: ind.heroDescription,
        },
        solutions: ind.pillars.map((p) => ({
          title: p.title,
          description: p.description,
          icon: p.icon,
        })),
        packages: ind.packages.map((p) => ({
          name: p.name,
          price: p.price,
          period: p.period,
          description: p.description,
          features: p.features,
          popular: Boolean(p.popular),
        })),
        seo: {
          title: ind.seo.title,
          description: ind.seo.description,
          keywords: ind.seo.keywords,
        },
      },
      upsert
    );

    for (const [ti, t] of ind.testimonials.entries()) {
      await Testimonial.findOneAndUpdate(
        { author: t.name },
        {
          quote: t.quote,
          author: t.name,
          role: t.role,
          rating: t.rating,
          featured: ti === 0,
          order: ti,
          published: true,
        },
        upsert
      );
    }
  }
  console.log(`✓ industries: ${industryContent.length}`);

  /* ----------------------------- case studies -------------------------- */
  await CaseStudy.findOneAndUpdate(
    { slug: desertFarms.slug },
    {
      slug: desertFarms.slug,
      client: desertFarms.client,
      title: desertFarms.title,
      excerpt: desertFarms.excerpt,
      industry: desertFarms.industry,
      duration: desertFarms.duration,
      channels: desertFarms.channels,
      featured: true,
      published: true,
      metrics: desertFarms.metrics.map((m) => ({
        label: m.label,
        value: m.value,
        description: '',
      })),
      challenge: desertFarms.intro,
      solution: desertFarms.approach.join('\n\n'),
      results: desertFarms.takeaways.map((t) => `${t.title}: ${t.description}`).join('\n\n'),
      sections: desertFarms.takeaways.map((t) => ({ title: t.title, body: t.description })),
      seo: {
        title: desertFarms.seo.title,
        description: desertFarms.seo.description,
        keywords: desertFarms.seo.keywords,
      },
    },
    upsert
  );
  console.log('✓ case studies: 1');

  /* ------------------------------- team -------------------------------- */
  await TeamMember.findOneAndUpdate(
    { slug: umerKhan.slug },
    {
      slug: umerKhan.slug,
      name: umerKhan.name,
      role: umerKhan.role,
      bio: umerKhan.bio,
      longBio: umerKhan.bio,
      photo: umerKhan.photo,
      order: 0,
      published: true,
      expertise: umerKhan.expertise,
      certifications: umerKhan.achievements,
      socials: { linkedin: umerKhan.socials.linkedin, upwork: umerKhan.socials.upwork },
      seo: {
        title: umerKhan.seo.title,
        description: umerKhan.seo.description,
        keywords: umerKhan.seo.keywords,
      },
    },
    upsert
  );
  console.log('✓ team: 1');

  /* ---------------------------- admin user ----------------------------- */
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (email && password) {
    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`• admin user ${email} already exists — left unchanged`);
    } else {
      await AdminUser.create({
        email: email.toLowerCase(),
        name: process.env.SEED_ADMIN_NAME || 'Admin',
        passwordHash: await hashPassword(password),
        role: 'admin',
      });
      console.log(`✓ admin user created: ${email}`);
    }
  } else {
    console.log('• skipped admin user (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)');
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
