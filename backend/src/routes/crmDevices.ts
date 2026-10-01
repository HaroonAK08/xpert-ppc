import { Router } from 'express';
import { z } from 'zod';

import { PushToken } from '../models/PushToken';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';

const router = Router();

router.use(requireAuth);

const registerSchema = z.object({
  token: z.string().trim().min(10).max(300),
  platform: z.enum(['ios', 'android', 'web']).optional().default('android'),
});

/** Registers (or re-owns) an Expo push token for the signed-in user's device. */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid device payload.');
    }
    if (!req.admin?.sub) throw new ApiError(401, 'Authentication required.');

    await PushToken.findOneAndUpdate(
      { token: parsed.data.token },
      { token: parsed.data.token, platform: parsed.data.platform, userId: req.admin.sub },
      { upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(ok({ registered: true }));
  })
);

const unregisterSchema = z.object({
  token: z.string().trim().min(10).max(300),
});

/** Removes a push token, e.g. on sign-out, so a stale session stops receiving pushes. */
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = unregisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid device payload.');
    }

    await PushToken.deleteOne({ token: parsed.data.token });
    res.status(200).json(ok({ registered: false }));
  })
);

export default router;
