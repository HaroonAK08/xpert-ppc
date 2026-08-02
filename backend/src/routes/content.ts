import { Router } from 'express';

import { Service } from '../models/Service';
import { Faq } from '../models/Faq';
import { Course } from '../models/Course';
import { Industry } from '../models/Industry';
import { CaseStudy } from '../models/CaseStudy';
import { TeamMember } from '../models/TeamMember';
import { Testimonial } from '../models/Testimonial';
import { ApiError, asyncHandler } from '../middleware/error';

const router = Router();

/**
 * Read-only content endpoints. The frontend renders from shared/content at
 * build time for SEO, and can call these to pick up edits without a redeploy.
 */

router.get(
  '/services',
  asyncHandler(async (_req, res) => {
    const items = await Service.find({ published: true }).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/services/:slug',
  asyncHandler(async (req, res) => {
    const item = await Service.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) throw new ApiError(404, 'Service not found.');
    res.json({ item });
  })
);

router.get(
  '/faqs',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { published: true };
    if (typeof req.query.category === 'string') filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;

    const items = await Faq.find(filter).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/courses',
  asyncHandler(async (_req, res) => {
    const items = await Course.find({ published: true }).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/courses/:slug',
  asyncHandler(async (req, res) => {
    const item = await Course.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) throw new ApiError(404, 'Course not found.');
    res.json({ item });
  })
);

router.get(
  '/industries',
  asyncHandler(async (_req, res) => {
    const items = await Industry.find({ published: true }).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/industries/:slug',
  asyncHandler(async (req, res) => {
    const item = await Industry.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) throw new ApiError(404, 'Industry not found.');
    res.json({ item });
  })
);

router.get(
  '/case-studies',
  asyncHandler(async (_req, res) => {
    const items = await CaseStudy.find({ published: true }).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/case-studies/:slug',
  asyncHandler(async (req, res) => {
    const item = await CaseStudy.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) throw new ApiError(404, 'Case study not found.');
    res.json({ item });
  })
);

router.get(
  '/team',
  asyncHandler(async (_req, res) => {
    const items = await TeamMember.find({ published: true }).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

router.get(
  '/team/:slug',
  asyncHandler(async (req, res) => {
    const item = await TeamMember.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) throw new ApiError(404, 'Team member not found.');
    res.json({ item });
  })
);

router.get(
  '/testimonials',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { published: true };
    if (req.query.featured === 'true') filter.featured = true;

    const items = await Testimonial.find(filter).sort({ order: 1 }).lean();
    res.json({ items });
  })
);

export default router;
