import { Router, type Request } from 'express';
import rateLimit from 'express-rate-limit';

import { Lead } from '../models/Lead';
import { Contact } from '../models/Contact';
import { LeadFormDefinition } from '../models/LeadFormDefinition';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { sendLeadNotification } from '../utils/mail';
import { runLeadCreatedAutomations } from '../utils/automations';
import { createLeadSchema, updateLeadSchema, LEAD_STATUSES } from '../validation/lead';
import { normalizeEmail } from '../../../shared/crm/normalize';
import mongoose from 'mongoose';

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

    const { companyWebsite, visitorId, formId, ...data } = parsed.data;

    // Honeypot tripped by a bot — accept silently. Ignore autofill dumping phone/email into the trap.
    const hp = (companyWebsite || '').trim();
    const autofilled =
      hp &&
      (hp === data.phone?.trim() ||
        hp === data.email?.trim() ||
        hp === data.name?.trim() ||
        hp.includes('@'));
    if (hp && !autofilled) {
      return res.status(201).json({ ok: true });
    }

    // If the tracking script saw this browser before, link the new lead to that
    // visitor's page-view history instead of losing it once they're identified.
    let contactId: string | null = null;
    if (visitorId) {
      const contact = await Contact.findOneAndUpdate(
        { anonymousId: visitorId },
        {
          $setOnInsert: { anonymousId: visitorId, firstSeenAt: new Date() },
          $set: {
            lastSeenAt: new Date(),
            ...(data.name ? { name: data.name } : {}),
            ...(data.email ? { email: normalizeEmail(data.email) } : {}),
            ...(data.phone ? { phone: data.phone } : {}),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      contactId = String(contact._id);
    }

    // Resolve the builder form (if any) so we store both its id and a name snapshot.
    let resolvedFormId: mongoose.Types.ObjectId | null = null;
    let resolvedFormName = '';
    let resolvedFormTags: string[] = [];
    if (formId) {
      if (!mongoose.Types.ObjectId.isValid(formId)) {
        throw new ApiError(400, 'Invalid form.');
      }
      const form = await LeadFormDefinition.findOne({ _id: formId, enabled: true })
        .select('name tags')
        .lean();
      if (!form) throw new ApiError(404, 'This form is not available.');
      resolvedFormId = form._id as mongoose.Types.ObjectId;
      resolvedFormName = String(form.name || '');
      resolvedFormTags = Array.isArray(form.tags) ? form.tags.map((t) => String(t)).filter(Boolean) : [];
    }

    const lead = await Lead.create({
      ...data,
      contactId,
      formId: resolvedFormId,
      formName: resolvedFormName,
      formTags: resolvedFormTags,
      meta: {
        ip: req.ip ?? '',
        userAgent: req.get('user-agent') ?? '',
        referer: req.get('referer') ?? '',
      },
    });

    if (contactId) {
      await Contact.findByIdAndUpdate(contactId, { convertedLeadId: lead._id });
    }

    await runLeadCreatedAutomations(lead.toObject());

    // Notify inbox — never fail the form if mail delivery has a hiccup.
    try {
      await sendLeadNotification({
        ...data,
        id: String(lead._id),
        formId: resolvedFormId ? String(resolvedFormId) : undefined,
        formName: resolvedFormName || undefined,
      });
    } catch (err) {
      console.error('[mail] Failed to send lead notification:', err);
    }

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

    // This endpoint backs the "Website Leads" admin view — leads submitted
    // directly through the site's own contact forms. Sheet-synced leads
    // live in the CRM (/api/v1/leads) and each client's own section instead.
    const filter: Record<string, unknown> = { source: { $ne: 'google-sheets' } };
    if (status && LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
      filter.status = status;
    }

    const [items, total, grouped] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
      Lead.aggregate<{ _id: string; n: number }>([
        { $match: filter },
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
