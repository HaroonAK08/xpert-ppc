import { Router } from 'express';

import { Lead } from '../models/Lead';
import { AdminUser } from '../models/AdminUser';
import { LeadFormDefinition } from '../models/LeadFormDefinition';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { leadOwnerScope } from '../utils/ownerScope';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS, normalizeLeadStatus } from '../../../shared/crm/constants';

const router = Router();

router.use(requireAuth);

/** Admins see main-pool stats; team users see their company/field (or own leads). */
async function ownerFilter(admin?: { sub: string; role: string }): Promise<Record<string, unknown>> {
  return leadOwnerScope(admin);
}

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const scope = await ownerFilter(req.admin);
    const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const [statusGroups, sourceGroups, dailyGroups, contactedLeads, ownerGroups, formGroups] = await Promise.all([
      Lead.aggregate<{ _id: string; n: number }>([
        { $match: scope },
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
      Lead.aggregate<{ _id: string; n: number }>([
        { $match: scope },
        { $group: { _id: { $ifNull: ['$source', 'other'] }, n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate<{ _id: string; n: number }>([
        { $match: { ...scope, createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            n: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Lead.find({ ...scope, contactedAt: { $ne: null } })
        .select('createdAt contactedAt')
        .limit(2000)
        .lean(),
      req.admin?.role === 'admin'
        ? Lead.aggregate<{ _id: string | null; total: number; converted: number }>([
            {
              $group: {
                _id: '$ownerUserId',
                total: { $sum: 1 },
                converted: {
                  $sum: { $cond: [{ $in: ['$status', ['converted', 'won']] }, 1, 0] },
                },
              },
            },
          ])
        : Promise.resolve([]),
      Lead.aggregate<{ _id: string | null; n: number }>([
        { $match: { ...scope, formId: { $ne: null } } },
        { $group: { _id: '$formId', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
      ]),
    ]);

    const byStatus: Record<string, number> = {};
    for (const g of statusGroups) byStatus[g._id] = g.n;
    const funnel = CRM_LEAD_STATUSES.map((status) => ({
      status,
      label: LEAD_STATUS_LABELS[status],
      count: byStatus[status] ?? 0,
    }));

    const bySource = sourceGroups.map((g) => ({ source: g._id, count: g.n }));

    const dayMap = new Map(dailyGroups.map((g) => [g._id, g.n]));
    const leadsOverTime: { date: string; count: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      leadsOverTime.push({ date: key, count: dayMap.get(key) ?? 0 });
    }

    const contactDeltasHours = contactedLeads
      .map((l) => {
        if (!l.contactedAt || !l.createdAt) return null;
        return (new Date(l.contactedAt).getTime() - new Date(l.createdAt).getTime()) / 3_600_000;
      })
      .filter((v): v is number => v !== null && v >= 0);
    const avgTimeToContactHours = contactDeltasHours.length
      ? Math.round((contactDeltasHours.reduce((a, b) => a + b, 0) / contactDeltasHours.length) * 10) / 10
      : null;

    let teamPerformance: { userId: string; name: string; total: number; converted: number }[] = [];
    if (req.admin?.role === 'admin' && ownerGroups.length) {
      const ownerIds = ownerGroups.map((g) => g._id).filter(Boolean) as string[];
      const users = await AdminUser.find({ _id: { $in: ownerIds } }).select('name').lean();
      const nameById = new Map(users.map((u) => [String(u._id), u.name]));
      teamPerformance = ownerGroups
        .map((g) => ({
          userId: g._id ? String(g._id) : 'unassigned',
          name: g._id ? nameById.get(String(g._id)) || 'Unknown' : 'Unassigned',
          total: g.total,
          converted: g.converted,
        }))
        .sort((a, b) => b.total - a.total);
    }

    let byForm: { formId: string; name: string; count: number }[] = [];
    if (formGroups.length) {
      const formIds = formGroups.map((g) => g._id).filter(Boolean) as string[];
      const forms = await LeadFormDefinition.find({ _id: { $in: formIds } }).select('name').lean();
      const nameById = new Map(forms.map((f) => [String(f._id), f.name]));
      byForm = formGroups.map((g) => ({
        formId: String(g._id),
        name: nameById.get(String(g._id)) || 'Deleted form',
        count: g.n,
      }));
    }

    const totalLeads = funnel.reduce((sum, f) => sum + f.count, 0);
    const convertedCount =
      byStatus[normalizeLeadStatus('converted')] ?? 0;
    const conversionRate = totalLeads ? Math.round((convertedCount / totalLeads) * 1000) / 10 : 0;

    res.json(
      ok({
        totalLeads,
        conversionRate,
        avgTimeToContactHours,
        funnel,
        bySource,
        byForm,
        leadsOverTime,
        teamPerformance,
      })
    );
  })
);

export default router;
