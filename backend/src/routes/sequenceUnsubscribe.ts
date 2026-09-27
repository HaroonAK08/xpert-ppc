import { Router } from 'express';

import { Lead } from '../models/Lead';
import { SequenceEnrollment } from '../models/SequenceEnrollment';
import { asyncHandler } from '../middleware/error';
import { verifyUnsubscribeToken } from '../utils/unsubscribeToken';

const router = Router();

function page(message: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribe</title>
    <style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#0f172a}</style>
    </head><body><p>${message}</p></body></html>`;
}

/** Public — clicked directly from an email, never an API call from the CRM UI. */
router.get(
  '/unsubscribe/:leadId',
  asyncHandler(async (req, res) => {
    const { leadId } = req.params;
    const token = typeof req.query.token === 'string' ? req.query.token : '';

    if (!verifyUnsubscribeToken(leadId, token)) {
      return res.status(403).send(page('This unsubscribe link is invalid.'));
    }

    const lead = await Lead.findByIdAndUpdate(leadId, { emailOptOut: true });
    if (!lead) {
      return res.status(404).send(page('We couldn’t find that subscription.'));
    }

    await SequenceEnrollment.updateMany({ lead: leadId, status: 'active' }, { status: 'stopped' });

    res.send(page('You’ve been unsubscribed and won’t receive further emails from us.'));
  })
);

export default router;
