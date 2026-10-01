import { Router } from 'express';

import { AdminUser } from '../models/AdminUser';
import { requireAuth, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { resolveUserFieldId } from '../utils/ownerScope';

const router = Router();

router.use(requireAuth, requireRole('admin', 'client'));

/** Active teammates for assignment pickers — clients only see their company. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { active: true };
    if (req.admin?.role === 'client') {
      const fieldId = await resolveUserFieldId(req.admin.sub);
      if (fieldId) filter.fieldId = fieldId;
      else filter._id = req.admin.sub;
    }

    const users = await AdminUser.find(filter).select('name email role').sort({ name: 1 }).lean();
    res.json(
      ok(
        users.map((u) => ({
          id: String(u._id),
          name: u.name,
          email: u.email,
          role: u.role,
        }))
      )
    );
  })
);

export default router;
