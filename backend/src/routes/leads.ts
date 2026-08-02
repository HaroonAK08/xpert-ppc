import { Router, type Request } from 'express';
import rateLimit from 'express-rate-limit';

import { Lead } from '../models/Lead';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { createLeadSchema, updateLeadSchema, LEAD_STATUSES } from '../validation/lead';

const router = Router();

/** Public submissions: 5 per 10 minutes per IP. */
const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again in a few minutes.' },
});

/* -------------------------------------------------------------------------- */
/* POST /api/leads — public                                                    */
/* -------------------------------------------------------------------------- */
router.post(
  '/',
  submitLimiter,
  asyncHandler(async (req: Request, res) => {
    const parsed = createLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Please check the form.');
    }

    const { companyWebsite, ...data } = parsed.data;

    // Honeypot tripped — accept silently so the bot doesn't learn it was caught.
    if (companyWebsite) {
      return res.status(201).json({ ok: true });
    }

    const lead = await Lead.create({
      ...data,
      meta: {
        ip: req.ip ?? '',
        userAgent: req.get('user-agent') ?? '',
        referer: req.get('referer') ?? '',
      },
    });

    res.status(201).json({ ok: true, id: String(lead._id) });
  })
);

/* -------------------------------------------------------------------------- */
/* GET /api/leads — admin                                                      */
/* -------------------------------------------------------------------------- */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const filter =
      status && LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])
        ? { status }
        : {};

    const [items, total, grouped] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
      Lead.aggregate<{ _id: string; n: number }>([
        { $group: { _id: '$status', n: { $sum: 1 } } },
      ]),
    ]);

    const counts: Record<string, number> = {};
    for (const g of grouped) counts[g._id] = g.n;

    res.json({
      items: items.map((l) => ({ ...l, id: String(l._id) })),
      total,
      page,
      limit,
      counts,
    });
  })
);

/* -------------------------------------------------------------------------- */
/* PATCH /api/leads/:id — admin                                                */
/* -------------------------------------------------------------------------- */
router.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = updateLeadSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const lead = await Lead.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!lead) throw new ApiError(404, 'Lead not found.');

    res.json({ ok: true, lead: { ...lead.toObject(), id: String(lead._id) } });
  })
);

/* -------------------------------------------------------------------------- */
/* DELETE /api/leads/:id — admin                                               */
/* -------------------------------------------------------------------------- */
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Lead not found.');
    res.json({ ok: true });
  })
);

export default router;
