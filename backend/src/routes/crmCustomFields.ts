import { Router } from 'express';

import { CustomFieldDefinition } from '../models/CustomFieldDefinition';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { customFieldCreateSchema, customFieldUpdateSchema } from '../validation/customFields';

const router = Router();

router.use(requireAuth);

function serializeDefinition(doc: {
  _id: unknown;
  key: string;
  label: string;
  type: string;
  options: string[];
  order: number;
}) {
  return {
    id: String(doc._id),
    key: doc.key,
    label: doc.label,
    type: doc.type,
    options: doc.options || [],
    order: doc.order,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const defs = await CustomFieldDefinition.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(ok(defs.map(serializeDefinition)));
  })
);

router.post(
  '/',
  requireRole('admin', 'client'),
  asyncHandler(async (req, res) => {
    const parsed = customFieldCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid custom field.');
    }

    const existing = await CustomFieldDefinition.findOne({ key: parsed.data.key });
    if (existing) throw new ApiError(409, `A property with key "${parsed.data.key}" already exists.`);

    const count = await CustomFieldDefinition.countDocuments();
    const def = await CustomFieldDefinition.create({
      ...parsed.data,
      order: count,
      createdBy: req.admin?.sub,
    });

    res.status(201).json(ok(serializeDefinition(def.toObject())));
  })
);

router.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = customFieldUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const def = await CustomFieldDefinition.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!def) throw new ApiError(404, 'Property not found.');

    res.json(ok(serializeDefinition(def.toObject())));
  })
);

router.delete(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const deleted = await CustomFieldDefinition.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Property not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
