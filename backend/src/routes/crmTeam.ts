import { Router } from 'express';

import { AdminUser } from '../models/AdminUser';
import { requireAuth, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';

const router = Router();

router.use(requireAuth, requireRole('admin'));

/** Every active team member — used for assignment pickers (automations, etc). */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await AdminUser.find({ active: true }).select('name email role').sort({ name: 1 }).lean();
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
