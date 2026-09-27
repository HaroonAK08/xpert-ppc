import { Router } from 'express';

import { LeadFormDefinition } from '../models/LeadFormDefinition';
import { CustomFieldDefinition } from '../models/CustomFieldDefinition';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { STANDARD_FORM_FIELDS } from '../../../shared/crm/constants';

const router = Router();

const STANDARD_BY_KEY = new Map(STANDARD_FORM_FIELDS.map((f) => [f.key, f]));

/** Public: resolves a form's field list into render-ready metadata (label, type, options). */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const form = await LeadFormDefinition.findOne({ _id: req.params.id, enabled: true }).lean();
    if (!form) throw new ApiError(404, 'This form is not available.');

    const customKeys = form.fields.filter((f) => !f.standard).map((f) => f.key);
    const customDefs = customKeys.length
      ? await CustomFieldDefinition.find({ key: { $in: customKeys } }).lean()
      : [];
    const customByKey = new Map(customDefs.map((d) => [d.key, d]));

    const fields = form.fields
      .map((f) => {
        if (f.standard) {
          const std = STANDARD_BY_KEY.get(f.key as never);
          if (!std) return null;
          return {
            key: std.key,
            label: f.label || std.label,
            placeholder: f.placeholder,
            type: std.type,
            required: f.required,
            options: [] as string[],
          };
        }
        const custom = customByKey.get(f.key);
        if (!custom) return null;
        return {
          key: custom.key,
          label: f.label || custom.label,
          placeholder: f.placeholder,
          type: custom.type === 'select' ? 'select' : custom.type,
          required: f.required,
          options: custom.options || [],
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    res.json(
      ok({
        id: String(form._id),
        name: form.name,
        description: form.description,
        badgeText: form.badgeText,
        submitLabel: form.submitLabel,
        buttonColor: form.buttonColor,
        backgroundColor: form.backgroundColor,
        textColor: form.textColor,
        cornerRadius: form.cornerRadius,
        spacing: form.spacing,
        fontSize: form.fontSize,
        successMessage: form.successMessage || "Thank you — we've got it.",
        successRedirectUrl: form.successRedirectUrl || '',
        fields,
      })
    );
  })
);

export default router;
