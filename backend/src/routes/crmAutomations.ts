import { Router } from 'express';

import { AutomationRule } from '../models/AutomationRule';
import { Lead } from '../models/Lead';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { leadOwnerScope, resourceFieldScope } from '../utils/ownerScope';
import { automationCreateSchema, automationUpdateSchema } from '../validation/automations';

const router = Router();

router.use(requireAuth, requireRole('admin', 'client'));

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
  asyncHandler(async (req, res) => {
    const { scope } = await resourceFieldScope(req.admin);
    const rules = await AutomationRule.find(scope).sort({ trigger: 1, order: 1 }).lean();
    res.json(ok(rules.map(serializeRule)));
  })
);

router.get(
  '/field-values',
  asyncHandler(async (req, res) => {
    const field =
      req.query.field === 'platform' ? 'platform' : req.query.field === 'sourcePath' ? 'sourcePath' : 'source';
    const leadScope = await leadOwnerScope(req.admin);
    const values: string[] = await Lead.distinct(field, leadScope);
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

    const { scope, fieldId } = await resourceFieldScope(req.admin);
    if (req.admin?.role === 'client' && !fieldId) {
      throw new ApiError(400, 'Assign this user to a company/field before creating automations.');
    }

    const count = await AutomationRule.countDocuments({ trigger: parsed.data.trigger, ...scope });
    const rule = await AutomationRule.create({
      ...parsed.data,
      order: count,
      createdBy: req.admin?.sub,
      fieldId,
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

    const { scope } = await resourceFieldScope(req.admin);
    const rule = await AutomationRule.findOneAndUpdate(
      { _id: req.params.id, ...scope },
      parsed.data,
      { new: true }
    );
    if (!rule) throw new ApiError(404, 'Automation rule not found.');

    res.json(ok(serializeRule(rule.toObject())));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { scope } = await resourceFieldScope(req.admin);
    const deleted = await AutomationRule.findOneAndDelete({ _id: req.params.id, ...scope });
    if (!deleted) throw new ApiError(404, 'Automation rule not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
