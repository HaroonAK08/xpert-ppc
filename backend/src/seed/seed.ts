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
import { caseStudies } from '../../../shared/content/case-studies';
import { umerKhan } from '../../../shared/content/team';

import { Service } from '../models/Service';
import { Faq } from '../models/Faq';
import { Course } from '../models/Course';
import { Industry } from '../models/Industry';
import { CaseStudy } from '../models/CaseStudy';
import { TeamMember } from '../models/TeamMember';
import { Testimonial } from '../models/Testimonial';
import { AdminUser } from '../models/AdminUser';
import { Student } from '../models/Student';
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
        icon: ind.icon || 'Briefcase',
        order: i,
        published: true,
        hero: {
          eyebrow: ind.eyebrow,
          title: `${ind.heroTitle} ${ind.heroHighlight}`,
          subtitle: ind.heroDescription,
        },
        challenges: ind.challenges.map((c) => ({
          title: c.title,
          description: c.description,
        })),
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
        faqs: ind.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
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
  let csOrder = 0;
  for (const cs of caseStudies) {
    await CaseStudy.findOneAndUpdate(
      { slug: cs.slug },
      {
        slug: cs.slug,
        client: cs.client,
        title: cs.title,
        excerpt: cs.excerpt,
        industry: cs.industry,
        duration: cs.duration,
        channels: cs.channels,
        heroImage: cs.heroImage,
        featured: Boolean(cs.featured),
        published: true,
        order: csOrder++,
        metrics: cs.metrics.map((m) => ({
          label: m.label,
          value: m.value,
          description: '',
        })),
        challenge: cs.intro,
        solution: cs.approach.join('\n\n'),
        results: cs.takeaways.map((t) => `${t.title}: ${t.description}`).join('\n\n'),
        sections: cs.takeaways.map((t) => ({ title: t.title, body: t.description })),
        seo: {
          title: cs.seo.title,
          description: cs.seo.description,
          keywords: cs.seo.keywords,
        },
      },
      upsert
    );
  }
  console.log(`✓ case studies: ${caseStudies.length}`);

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

  /* ---------------------------- admin users ---------------------------- */
  const admins = [
    {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      name: process.env.SEED_ADMIN_NAME || 'Admin',
    },
    {
      email: process.env.SEED_ADMIN_EMAIL_2,
      password: process.env.SEED_ADMIN_PASSWORD_2,
      name: process.env.SEED_ADMIN_NAME_2 || 'Admin',
    },
  ].filter((a): a is { email: string; password: string; name: string } =>
    Boolean(a.email && a.password)
  );

  if (admins.length) {
    for (const admin of admins) {
      const passwordHash = await hashPassword(admin.password);
      await AdminUser.findOneAndUpdate(
        { email: admin.email.toLowerCase() },
        {
          email: admin.email.toLowerCase(),
          name: admin.name,
          passwordHash,
          role: 'admin',
          active: true,
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
      console.log(`✓ admin user ready: ${admin.email}`);
    }
  } else {
    console.log('• skipped admin user (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)');
  }

  /* --------------------------- student user ---------------------------- */
  const studentEmail = process.env.SEED_STUDENT_EMAIL;
  const studentPassword = process.env.SEED_STUDENT_PASSWORD;

  if (studentEmail && studentPassword) {
    const passwordHash = await hashPassword(studentPassword);
    await Student.findOneAndUpdate(
      { email: studentEmail.toLowerCase() },
      {
        email: studentEmail.toLowerCase(),
        name: process.env.SEED_STUDENT_NAME || 'Student',
        passwordHash,
        emailVerified: true,
        active: true,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ student user ready: ${studentEmail}`);
  } else {
    console.log(
      '• skipped student user (set SEED_STUDENT_EMAIL and SEED_STUDENT_PASSWORD to create one)'
    );
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
