import { Router } from 'express';

import { MetaIntegration } from '../models/MetaIntegration';
import { Lead } from '../models/Lead';
import { asyncHandler } from '../middleware/error';
import { recordLeadActivity } from '../utils/activity';
import { runLeadCreatedAutomations } from '../utils/automations';
import { notifyNewLead } from '../utils/push';
import { sendLeadNotification } from '../utils/mail';
import { markLeadDirty } from '../services/googleSheets/sheetsService';
import { env } from '../config/env';
import { decryptToken } from '../services/meta/crypto';
import { fetchLeadFields } from '../services/meta/client';
import { mapMetaFields } from '../services/meta/mapLeadFields';
import { verifyMetaSignature } from '../services/meta/webhookVerify';
import { normalizeEmail, normalizePhone } from '../../../shared/crm/normalize';

const router = Router();

/** GET — Meta's one-time webhook verification handshake (done once, from the App dashboard). */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.meta.webhookVerifyToken && typeof challenge === 'string') {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

/** POST — a new leadgen event notification. Always ack 2xx fast; Meta retries aggressively otherwise. */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const signature = req.get('x-hub-signature-256');
    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;

    if (!rawBody || !verifyMetaSignature(rawBody, signature)) {
      console.error('[meta-webhook] invalid signature — dropping payload');
      return res.sendStatus(403);
    }

    res.sendStatus(200);

    const entries: unknown[] = Array.isArray(req.body?.entry) ? req.body.entry : [];
    for (const entry of entries as Array<Record<string, unknown>>) {
      const changes: unknown[] = Array.isArray(entry?.changes) ? (entry.changes as unknown[]) : [];
      for (const change of changes as Array<Record<string, unknown>>) {
        if (change?.field !== 'leadgen') continue;
        const value = change?.value as Record<string, unknown> | undefined;
        const leadgenId = value?.leadgen_id;
        const pageId = value?.page_id || entry?.id;
        if (!leadgenId || !pageId) continue;

        try {
          await importMetaLead(String(pageId), String(leadgenId));
        } catch (err) {
          console.error('[meta-webhook] failed to import lead', leadgenId, err);
        }
      }
    }
  })
);

async function importMetaLead(pageId: string, leadgenId: string) {
  const integration = await MetaIntegration.findOne({ pageId, connected: true });
  if (!integration) {
    console.error('[meta-webhook] no connected integration for page', pageId);
    return;
  }

  const existing = await Lead.findOne({ source: 'meta_ads', externalId: leadgenId });
  if (existing) return; // Meta may resend the same event — already imported.

  const pageAccessToken = decryptToken(integration.pageAccessTokenEnc);
  const { fieldData } = await fetchLeadFields(leadgenId, pageAccessToken);
  const mapped = mapMetaFields(fieldData);
  const email = mapped.email ? normalizeEmail(mapped.email) : '';

  const lead = await Lead.create({
    name: mapped.name,
    email: email || `lead-${leadgenId}@placeholder.local`,
    phone: mapped.phone,
    phoneNormalized: normalizePhone(mapped.phone),
    company: mapped.company,
    businessName: mapped.company,
    platform: 'Meta Ads',
    source: 'meta_ads',
    externalId: leadgenId,
    metaRaw: { fieldData, pageId },
    ownerUserId: integration.ownerUserId,
  });

  integration.lastLeadAt = new Date();
  await integration.save();

  await recordLeadActivity({
    leadId: String(lead._id),
    action: 'lead_created',
    metadata: { via: 'meta_ads', pageId },
  });
  await runLeadCreatedAutomations(lead.toObject());
  void notifyNewLead(lead);

  await markLeadDirty(String(lead._id)).catch(() => {});

  try {
    await sendLeadNotification({
      name: mapped.name,
      email,
      phone: mapped.phone,
      company: mapped.company,
      website: '',
      platform: 'Meta Ads',
      monthlyBudget: '',
      source: 'other',
      sourcePath: 'Meta Lead Ads webhook',
      message: '',
      id: String(lead._id),
    });
  } catch (err) {
    console.error('[mail] Failed to send Meta lead notification:', err);
  }
}

export default router;
