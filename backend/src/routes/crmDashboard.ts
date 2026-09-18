import { Router } from 'express';

import { Lead } from '../models/Lead';
import { LeadActivity } from '../models/LeadActivity';
import { GoogleSheetConnection } from '../models/GoogleSheetConnection';
import { requireCrmAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok, serializeLead, serializeActivity } from '../utils/crmSerialize';
import type { DashboardStats } from '../../../shared/crm/types';

const router = Router();

router.use(requireCrmAuth);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const now = new Date();

    const [
      total,
      statusGroups,
      repliedCount,
      followUpsDue,
      followUpsToday,
      recentLeads,
      recentActivity,
      sheet,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate<{ _id: string; n: number }>([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $in: ['$status', ['qualified']] }, then: 'interested' },
                  { case: { $in: ['$status', ['won']] }, then: 'converted' },
                  { case: { $in: ['$status', ['lost']] }, then: 'not_interested' },
                  { case: { $in: ['$status', ['spam']] }, then: 'closed' },
                ],
                default: '$status',
              },
            },
            n: { $sum: 1 },
          },
        },
      ]),
      Lead.countDocuments({ replied: true }),
      Lead.countDocuments({ followUpAt: { $ne: null, $lte: now } }),
      Lead.find({ followUpAt: { $gte: startOfToday, $lte: endOfToday } })
        .sort({ followUpAt: 1 })
        .limit(10)
        .lean(),
      Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
      LeadActivity.find().sort({ createdAt: -1 }).limit(12).lean(),
      GoogleSheetConnection.findOne({ connected: true }).sort({ updatedAt: -1 }).lean(),
    ]);

    const byStatus: Record<string, number> = {};
    for (const g of statusGroups) byStatus[g._id] = g.n;

    const stats: DashboardStats = {
      total,
      new: byStatus.new ?? 0,
      contacted: byStatus.contacted ?? 0,
      replied: Math.max(byStatus.replied ?? 0, repliedCount),
      interested: byStatus.interested ?? 0,
      followUp: byStatus.follow_up ?? 0,
      followUpsDue,
      followUpsToday: followUpsToday.length,
      converted: byStatus.converted ?? 0,
      notInterested: byStatus.not_interested ?? 0,
      closed: byStatus.closed ?? 0,
      lastSyncedAt: sheet?.lastSyncedAt
        ? new Date(sheet.lastSyncedAt).toISOString()
        : null,
    };

    res.json(
      ok({
        stats,
        recentLeads: recentLeads.map(serializeLead),
        followUpsToday: followUpsToday.map(serializeLead),
        recentActivity: recentActivity.map(serializeActivity),
      })
    );
  })
);

export default router;
