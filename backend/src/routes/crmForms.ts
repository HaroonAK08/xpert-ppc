import { Router } from 'express';

import { LeadFormDefinition, type LeadFormDefinitionDoc } from '../models/LeadFormDefinition';
import { CustomFieldDefinition } from '../models/CustomFieldDefinition';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { resourceFieldScope } from '../utils/ownerScope';
import { formCreateSchema, formUpdateSchema, hasRequiredIdentityFields } from '../validation/forms';
import { STANDARD_FORM_FIELDS } from '../../../shared/crm/constants';

const router = Router();

router.use(requireAuth, requireRole('admin', 'client'));

const STANDARD_KEYS = new Set(STANDARD_FORM_FIELDS.map((f) => f.key));

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
  asyncHandler(async (req, res) => {
    const { scope } = await resourceFieldScope(req.admin);
    const forms = await LeadFormDefinition.find(scope).sort({ createdAt: -1 }).lean();
    res.json(ok(forms.map(serializeForm)));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { scope } = await resourceFieldScope(req.admin);
    const form = await LeadFormDefinition.findOne({ _id: req.params.id, ...scope }).lean();
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

    const { fieldId } = await resourceFieldScope(req.admin);
    if (req.admin?.role === 'client' && !fieldId) {
      throw new ApiError(400, 'Assign this user to a company/field before creating forms.');
    }

    const form = await LeadFormDefinition.create({
      ...parsed.data,
      createdBy: req.admin?.sub,
      fieldId,
    });
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

    const { scope } = await resourceFieldScope(req.admin);
    const form = await LeadFormDefinition.findOneAndUpdate(
      { _id: req.params.id, ...scope },
      parsed.data,
      { new: true }
    );
    if (!form) throw new ApiError(404, 'Form not found.');
    res.json(ok(serializeForm(form.toObject())));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { scope } = await resourceFieldScope(req.admin);
    const deleted = await LeadFormDefinition.findOneAndDelete({ _id: req.params.id, ...scope });
    if (!deleted) throw new ApiError(404, 'Form not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
