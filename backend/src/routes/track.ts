import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { Contact } from '../models/Contact';
import { ContactActivity } from '../models/ContactActivity';
import { asyncHandler } from '../middleware/error';
import { trackPageViewSchema } from '../validation/track';

const router = Router();

/** A beacon fires on every page view — generous, but still a real ceiling per visitor. */
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

/**
 * Public, CORS-open page-view beacon (see app.ts — this path is exempt from the
 * strict origin allowlist, same as any real analytics collector). Always answers
 * 204 with no body: a tracking pixel/beacon must never surface an error to the
 * visitor's browser, and the caller never reads the response anyway.
 */
router.post(
  '/',
  trackLimiter,
  asyncHandler(async (req, res) => {
    const parsed = trackPageViewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(204).end();

    const { visitorId, url, referrer, utm } = parsed.data;

    const contact = await Contact.findOneAndUpdate(
      { anonymousId: visitorId },
      {
        $setOnInsert: { anonymousId: visitorId, firstSeenAt: new Date() },
        $set: { lastSeenAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await ContactActivity.create({
      contact: contact._id,
      type: 'page_view',
      url,
      referrer,
      utm: utm || {},
    });

    res.status(204).end();
  })
);

export default router;
