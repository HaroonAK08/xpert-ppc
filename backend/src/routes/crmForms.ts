import { Router } from 'express';

import { LeadFormDefinition, type LeadFormDefinitionDoc } from '../models/LeadFormDefinition';
import { CustomFieldDefinition } from '../models/CustomFieldDefinition';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { formCreateSchema, formUpdateSchema, hasRequiredIdentityFields } from '../validation/forms';
import { STANDARD_FORM_FIELDS } from '../../../shared/crm/constants';

const router = Router();

router.use(requireAuth, requireRole('admin'));

const STANDARD_KEYS = new Set(STANDARD_FORM_FIELDS.map((f) => f.key));

/** Every non-standard field key must be a real, currently-defined custom property. */
async function validateFieldKeys(fields: { key: string; standard: boolean }[]): Promise<void> {
  const customKeys = fields.filter((f) => !f.standard).map((f) => f.key);
  if (customKeys.length) {
    const found = await CustomFieldDefinition.find({ key: { $in: customKeys } }).select('key').lean();
    const foundKeys = new Set(found.map((d) => d.key));
    const missing = customKeys.filter((k) => !foundKeys.has(k));
    if (missing.length) throw new ApiError(400, `Unknown custom property key(s): ${missing.join(', ')}`);
  }
  const standardKeys = fields.filter((f) => f.standard).map((f) => f.key);
  const badStandard = standardKeys.filter((k) => !STANDARD_KEYS.has(k as never));
  if (badStandard.length) throw new ApiError(400, `Unknown standard field key(s): ${badStandard.join(', ')}`);
}

function serializeForm(doc: LeadFormDefinitionDoc & { _id: unknown; createdAt?: Date }) {
  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description,
    badgeText: doc.badgeText,
    fields: doc.fields,
    submitLabel: doc.submitLabel,
    buttonColor: doc.buttonColor,
    backgroundColor: doc.backgroundColor,
    textColor: doc.textColor,
    cornerRadius: doc.cornerRadius,
    spacing: doc.spacing,
    fontSize: doc.fontSize,
    successMessage: doc.successMessage || "Thank you — we've got it.",
    successRedirectUrl: doc.successRedirectUrl || '',
    tags: Array.isArray(doc.tags) ? doc.tags.map((t) => String(t)).filter(Boolean) : [],
    enabled: doc.enabled,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const forms = await LeadFormDefinition.find().sort({ createdAt: -1 }).lean();
    res.json(ok(forms.map(serializeForm)));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const form = await LeadFormDefinition.findById(req.params.id).lean();
    if (!form) throw new ApiError(404, 'Form not found.');
    res.json(ok(serializeForm(form)));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = formCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid form.');

    if (!hasRequiredIdentityFields(parsed.data.fields)) {
      throw new ApiError(400, 'Every form must include Name and Email.');
    }
    await validateFieldKeys(parsed.data.fields);

    const form = await LeadFormDefinition.create({ ...parsed.data, createdBy: req.admin?.sub });
    res.status(201).json(ok(serializeForm(form.toObject())));
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = formUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    if (parsed.data.fields) {
      if (!hasRequiredIdentityFields(parsed.data.fields)) {
        throw new ApiError(400, 'Every form must include Name and Email.');
      }
      await validateFieldKeys(parsed.data.fields);
    }

    const form = await LeadFormDefinition.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!form) throw new ApiError(404, 'Form not found.');
    res.json(ok(serializeForm(form.toObject())));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await LeadFormDefinition.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Form not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
