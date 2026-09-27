import { Router } from 'express';

import { MetaIntegration, type MetaIntegrationDoc } from '../models/MetaIntegration';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { metaSelectPageSchema } from '../validation/crm';
import { env } from '../config/env';
import { decryptToken, encryptToken } from '../services/meta/crypto';
import { createOAuthState, verifyOAuthState } from '../services/meta/state';
import {
  buildOAuthUrl,
  exchangeCodeForUserToken,
  exchangeForLongLivedToken,
  isMetaConfigured,
  listLeadForms,
  listPages,
  subscribePageToLeadgen,
} from '../services/meta/client';

const router = Router();

function serializeIntegration(doc: (MetaIntegrationDoc & { _id?: unknown }) | null) {
  return {
    configured: isMetaConfigured(),
    connected: Boolean(doc?.connected),
    pageId: doc?.pageId || null,
    pageName: doc?.pageName || null,
    forms: (doc?.forms || []).map((f) => ({ id: f.formId, name: f.name })),
    pendingPages: (doc?.pendingPages || []).map((p) => ({ id: p.id, name: p.name })),
    lastLeadAt: doc?.lastLeadAt ? new Date(doc.lastLeadAt).toISOString() : null,
    lastError: doc?.lastError || '',
  };
}

router.get(
  '/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const doc = await MetaIntegration.findOne({ ownerUserId: req.admin?.sub }).lean();
    res.json(ok(serializeIntegration(doc)));
  })
);

router.get(
  '/oauth-url',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!isMetaConfigured()) {
      throw new ApiError(503, 'Meta integration is not configured on the server.');
    }
    const state = createOAuthState(req.admin!.sub);
    res.json(ok({ url: buildOAuthUrl(state) }));
  })
);

// Public: Meta redirects the browser here after the OAuth dialog — a cross-site
// top-level navigation, so identity comes from the signed `state`, not the session cookie.
router.get(
  '/oauth-callback',
  asyncHandler(async (req, res) => {
    const redirectBase = `${env.crmAppUrl}/meta`;

    if (!isMetaConfigured()) {
      return res.redirect(
        `${redirectBase}?meta_error=${encodeURIComponent('Meta integration is not configured on the server.')}`
      );
    }

    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const ownerUserId = code && state ? verifyOAuthState(state) : null;

    if (!ownerUserId) {
      return res.redirect(
        `${redirectBase}?meta_error=${encodeURIComponent('Sign-in link expired. Please try connecting again.')}`
      );
    }

    try {
      const shortLivedToken = await exchangeCodeForUserToken(code);
      const longLivedToken = await exchangeForLongLivedToken(shortLivedToken);
      const pages = await listPages(longLivedToken);

      if (!pages.length) {
        throw new Error(
          'No Facebook Pages found for this account. You need to be an admin of at least one Page.'
        );
      }

      await MetaIntegration.findOneAndUpdate(
        { ownerUserId },
        {
          ownerUserId,
          createdBy: ownerUserId,
          pendingPages: pages.map((p) => ({
            id: p.id,
            name: p.name,
            accessTokenEnc: encryptToken(p.access_token),
          })),
          lastError: '',
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      return res.redirect(`${redirectBase}?meta_connected=pending`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Meta.';
      await MetaIntegration.findOneAndUpdate(
        { ownerUserId },
        { ownerUserId, lastError: message },
        { upsert: true, setDefaultsOnInsert: true }
      );
      return res.redirect(`${redirectBase}?meta_error=${encodeURIComponent(message)}`);
    }
  })
);

router.post(
  '/select-page',
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = metaSelectPageSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'A pageId is required.');

    const doc = await MetaIntegration.findOne({ ownerUserId: req.admin?.sub });
    if (!doc) throw new ApiError(404, 'No pending Meta connection found. Start the connect flow again.');

    const page = (doc.pendingPages || []).find((p) => p.id === parsed.data.pageId);
    if (!page) {
      throw new ApiError(404, 'That Page was not found in your pending connection. Reconnect and try again.');
    }

    const pageAccessToken = decryptToken(page.accessTokenEnc);

    let forms: { id: string; name: string }[] = [];
    try {
      forms = await listLeadForms(page.id, pageAccessToken);
      await subscribePageToLeadgen(page.id, pageAccessToken);
    } catch (err) {
      throw new ApiError(
        502,
        err instanceof Error
          ? `Connected the Page but couldn't finish setup: ${err.message}`
          : "Connected the Page but couldn't finish setup."
      );
    }

    doc.connected = true;
    doc.pageId = page.id;
    doc.pageName = page.name;
    doc.pageAccessTokenEnc = encryptToken(pageAccessToken);
    doc.forms = forms.map((f) => ({ formId: f.id, name: f.name })) as typeof doc.forms;
    doc.pendingPages = [] as unknown as typeof doc.pendingPages;
    doc.lastError = '';
    await doc.save();

    res.json(ok(serializeIntegration(doc.toObject())));
  })
);

router.post(
  '/forms/refresh',
  requireAuth,
  asyncHandler(async (req, res) => {
    const doc = await MetaIntegration.findOne({ ownerUserId: req.admin?.sub, connected: true });
    if (!doc) throw new ApiError(404, 'No connected Meta Page.');

    const pageAccessToken = decryptToken(doc.pageAccessTokenEnc);
    const forms = await listLeadForms(doc.pageId, pageAccessToken);
    doc.forms = forms.map((f) => ({ formId: f.id, name: f.name })) as typeof doc.forms;
    await doc.save();

    res.json(ok(serializeIntegration(doc.toObject())));
  })
);

router.delete(
  '/disconnect',
  requireAuth,
  asyncHandler(async (req, res) => {
    await MetaIntegration.findOneAndUpdate(
      { ownerUserId: req.admin?.sub },
      { connected: false, pageAccessTokenEnc: '', pendingPages: [] }
    );
    res.json(ok({ disconnected: true }));
  })
);

export default router;
