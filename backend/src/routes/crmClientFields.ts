import { Router } from 'express';

import { ClientField } from '../models/ClientField';
import { AdminUser } from '../models/AdminUser';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { clientFieldCreateSchema } from '../validation/crm';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const fields = await ClientField.find().sort({ name: 1 }).lean();
    const counts = await AdminUser.aggregate<{ _id: unknown; n: number }>([
      { $match: { role: 'client', fieldId: { $ne: null } } },
      { $group: { _id: '$fieldId', n: { $sum: 1 } } },
    ]);
    const countById = new Map(counts.map((c) => [String(c._id), c.n]));

    res.json(
      ok(
        fields.map((f) => ({
          id: String(f._id),
          name: f.name,
          userCount: countById.get(String(f._id)) || 0,
          createdAt: f.createdAt,
        }))
      )
    );
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = clientFieldCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid field name.');
    }

    const existing = await ClientField.findOne({
      name: new RegExp(`^${parsed.data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });
    if (existing) throw new ApiError(409, 'A company/field with this name already exists.');

    const field = await ClientField.create({ name: parsed.data.name });
    res.status(201).json(
      ok({
        id: String(field._id),
        name: field.name,
        userCount: 0,
        createdAt: field.createdAt,
      })
    );
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const inUse = await AdminUser.countDocuments({ role: 'client', fieldId: req.params.id });
    if (inUse > 0) {
      throw new ApiError(400, 'Move or remove users from this company/field before deleting it.');
    }
    const deleted = await ClientField.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Company/field not found.');
    res.json(ok({ id: req.params.id }));
  })
);

export default router;
