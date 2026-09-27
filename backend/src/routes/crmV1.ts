import { Router } from 'express';

import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS } from '../../../shared/crm/constants';
import crmLeadsRouter from './crmLeads';
import crmDashboardRouter from './crmDashboard';
import crmGoogleSheetsRouter from './crmGoogleSheets';
import crmClientsRouter from './crmClients';
import crmMetaRouter from './crmMeta';
import crmCustomFieldsRouter from './crmCustomFields';
import crmReportsRouter from './crmReports';
import crmAutomationsRouter from './crmAutomations';
import crmTeamRouter from './crmTeam';
import crmFormsRouter from './crmForms';
import crmSequencesRouter from './crmSequences';

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
router.use('/integrations/meta', crmMetaRouter);
router.use('/custom-fields', crmCustomFieldsRouter);
router.use('/reports', crmReportsRouter);
router.use('/automations', crmAutomationsRouter);
router.use('/team', crmTeamRouter);
router.use('/forms', crmFormsRouter);
router.use('/sequences', crmSequencesRouter);
router.use('/clients', crmClientsRouter);

export default router;
