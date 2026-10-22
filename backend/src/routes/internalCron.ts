import { Router, type Request } from 'express';
import { env } from '../config/env';
import { ApiError, asyncHandler } from '../middleware/error';
import { runAllScheduledSyncs } from '../services/googleSheets/scheduler';
import { runDueEnrollments } from '../services/sequences/scheduler';

const router = Router();

function requireCronSecret(req: Request) {
  const header = req.header('authorization') || req.header('x-cron-secret') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (!env.cronSecret || token !== env.cronSecret) {
    throw new ApiError(401, 'Unauthorized.');
  }
}

router.post(
  '/sheets',
  asyncHandler(async (req, res) => {
    requireCronSecret(req);
    await runAllScheduledSyncs();
    res.json({ ok: true, job: 'sheets' });
  })
);

router.post(
  '/sequences',
  asyncHandler(async (req, res) => {
    requireCronSecret(req);
    await runDueEnrollments();
    res.json({ ok: true, job: 'sequences' });
  })
);

router.post(
  '/all',
  asyncHandler(async (req, res) => {
    requireCronSecret(req);
    await runAllScheduledSyncs();
    await runDueEnrollments();
    res.json({ ok: true, job: 'all' });
  })
);

export default router;
