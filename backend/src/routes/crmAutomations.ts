import { Router } from 'express';

import { AutomationRule } from '../models/AutomationRule';
import { Lead } from '../models/Lead';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { automationCreateSchema, automationUpdateSchema } from '../validation/automations';

const router = Router();

router.use(requireAuth, requireRole('admin'));

function serializeRule(doc: Record<string, unknown> & { _id: unknown }) {
  return {
    id: String(doc._id),
    name: doc.name,
    trigger: doc.trigger,
    fromStatus: doc.fromStatus || '',
    toStatus: doc.toStatus || '',
    conditions: doc.conditions || [],
    actions: (doc.actions as Array<Record<string, unknown>>).map((a) => ({
      ...a,
      userId: a.userId ? String(a.userId) : undefined,
      sequenceId: a.sequenceId ? String(a.sequenceId) : undefined,
    })),
    enabled: Boolean(doc.enabled),
    order: doc.order,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rules = await AutomationRule.find().sort({ trigger: 1, order: 1 }).lean();
    res.json(ok(rules.map(serializeRule)));
  })
);

// Real, currently-seen values for a lead field — lets the condition builder
// suggest actual source/platform strings (e.g. real Meta campaign names)
// instead of the user having to guess or type them blind.
router.get(
  '/field-values',
  asyncHandler(async (req, res) => {
    const field =
      req.query.field === 'platform' ? 'platform' : req.query.field === 'sourcePath' ? 'sourcePath' : 'source';
    const values: string[] = await Lead.distinct(field);
    res.json(ok(values.filter(Boolean).sort((a, b) => a.localeCompare(b))));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = automationCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid automation rule.');
    }

    const count = await AutomationRule.countDocuments({ trigger: parsed.data.trigger });
    const rule = await AutomationRule.create({
      ...parsed.data,
      order: count,
      createdBy: req.admin?.sub,
    });

    res.status(201).json(ok(serializeRule(rule.toObject())));
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = automationUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid payload.');
    }

    const rule = await AutomationRule.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!rule) throw new ApiError(404, 'Automation rule not found.');

    res.json(ok(serializeRule(rule.toObject())));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await AutomationRule.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Automation rule not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
