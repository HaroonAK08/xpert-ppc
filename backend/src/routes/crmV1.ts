import { Router } from 'express';

import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS } from '../../../shared/crm/constants';
import crmLeadsRouter from './crmLeads';
import crmDashboardRouter from './crmDashboard';
import crmGoogleSheetsRouter from './crmGoogleSheets';

const router = Router();

router.get(
  '/meta/statuses',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(
      ok(
        CRM_LEAD_STATUSES.map((value) => ({
          value,
          label: LEAD_STATUS_LABELS[value],
        }))
      )
    );
  })
);

router.use('/leads', crmLeadsRouter);
router.use('/dashboard', crmDashboardRouter);
router.use('/integrations/google-sheets', crmGoogleSheetsRouter);

export default router;
