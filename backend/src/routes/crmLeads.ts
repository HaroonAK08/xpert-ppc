import { Router } from 'express';
import type { FilterQuery } from 'mongoose';

import { Lead } from '../models/Lead';
import { LeadNote } from '../models/LeadNote';
import { LeadActivity } from '../models/LeadActivity';
import { requireCrmAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { recordLeadActivity } from '../utils/activity';
import { markLeadDirty } from '../services/googleSheets/sheetsService';
import {
  ok,
  serializeLead,
  serializeNote,
  serializeActivity,
} from '../utils/crmSerialize';
import {
  contactActionSchema,
  crmLeadCreateSchema,
  crmLeadUpdateSchema,
  followUpSchema,
  noteCreateSchema,
  replyActionSchema,
} from '../validation/crm';
import { CRM_LEAD_STATUSES, normalizeLeadStatus } from '../../../shared/crm/constants';
import { normalizeEmail, normalizePhone } from '../../../shared/crm/normalize';
import type { LeadDoc } from '../models/Lead';

const router = Router();

router.use(requireCrmAuth);

function parsePage(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.page_size) || Number(query.limit) || 30));
  return { page, pageSize };
}

function buildLeadFilter(query: Record<string, unknown>): FilterQuery<LeadDoc> {
  const filter: FilterQuery<LeadDoc> = {};

  if (typeof query.status === 'string' && query.status) {
    const statuses = query.status.split(',').map((s) => s.trim()).filter(Boolean);
    if (statuses.length) filter.status = { $in: statuses };
  }

  if (query.replied === 'true') filter.replied = true;
  if (query.replied === 'false') filter.replied = false;

  if (query.follow_up === 'due') {
    filter.followUpAt = { $lte: new Date() };
  } else if (query.follow_up === 'upcoming') {
    filter.followUpAt = { $gt: new Date() };
  } else if (query.follow_up === 'set') {
    filter.followUpAt = { $ne: null };
  }

  if (typeof query.source === 'string' && query.source) {
    filter.source = query.source;
  }

  if (typeof query.search === 'string' && query.search.trim()) {
    const q = query.search.trim();
    const phoneQ = normalizePhone(q);
    filter.$or = [
      { name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { email: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { phone: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { company: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { businessName: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { message: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      ...(phoneQ ? [{ phoneNormalized: phoneQ }] : []),
    ];
  }

  if (typeof query.created_from === 'string') {
    filter.createdAt = {
      ...(filter.createdAt as object),
      $gte: new Date(query.created_from),
    };
  }
  if (typeof query.created_to === 'string') {
    filter.createdAt = {
      ...(filter.createdAt as object),
      $lte: new Date(query.created_to),
    };
  }

  return filter;
}

function sortFromQuery(query: Record<string, unknown>): Record<string, 1 | -1> {
  const sort = typeof query.sort === 'string' ? query.sort : 'newest';
  switch (sort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'updated':
      return { updatedAt: -1 };
    case 'follow_up':
      return { followUpAt: 1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, pageSize } = parsePage(req.query as Record<string, unknown>);
    const filter = buildLeadFilter(req.query as Record<string, unknown>);
    const sort = sortFromQuery(req.query as Record<string, unknown>);

    const [items, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json(
      ok(
        items.map((l) => serializeLead(l)),
        {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize) || 1,
        }
      )
    );
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) throw new ApiError(404, 'Lead not found.');

    const [notes, activity] = await Promise.all([
      LeadNote.find({ lead: lead._id }).sort({ createdAt: -1 }).limit(50).lean(),
      LeadActivity.find({ lead: lead._id }).sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    res.json(
      ok({
        lead: serializeLead(lead),
        notes: notes.map(serializeNote),
        activity: activity.map(serializeActivity),
      })
    );
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = crmLeadCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid lead payload.');
    }

    const data = parsed.data;
    const businessName = data.businessName || data.company || '';
    const email = data.email ? normalizeEmail(data.email) : '';

    const lead = await Lead.create({
      name: data.name,
      email: email || `lead-${Date.now()}@placeholder.local`,
      phone: data.phone || '',
      phoneNormalized: normalizePhone(data.phone || ''),
      businessName,
      company: businessName,
      source: data.source,
      message: data.message,
      status: data.status,
      notes: data.notes,
      replied: data.replied,
      followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      externalId: data.externalId || '',
      localDirtyAt: new Date(),
    });

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action: 'lead_created',
    });

    res.status(201).json(ok(serializeLead(lead.toObject())));
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = crmLeadUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    const prevStatus = lead.status;
    const data = parsed.data;

    if (data.name !== undefined) lead.name = data.name;
    if (data.email !== undefined) lead.email = normalizeEmail(data.email) || lead.email;
    if (data.phone !== undefined) {
      lead.phone = data.phone;
      lead.phoneNormalized = normalizePhone(data.phone);
    }
    if (data.businessName !== undefined || data.company !== undefined) {
      const biz = data.businessName ?? data.company ?? '';
      lead.businessName = biz;
      lead.company = biz;
    }
    if (data.source !== undefined) lead.source = data.source;
    if (data.message !== undefined) lead.message = data.message;
    if (data.status !== undefined) lead.status = data.status;
    if (data.notes !== undefined) lead.notes = data.notes;
    if (data.replied !== undefined) lead.replied = data.replied;
    if (data.contactedAt !== undefined) {
      lead.contactedAt = data.contactedAt ? new Date(data.contactedAt) : null;
    }
    if (data.repliedAt !== undefined) {
      lead.repliedAt = data.repliedAt ? new Date(data.repliedAt) : null;
    }
    if (data.followUpAt !== undefined) {
      lead.followUpAt = data.followUpAt ? new Date(data.followUpAt) : null;
    }
    if (data.externalId !== undefined) lead.externalId = data.externalId;

    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    if (data.status && data.status !== prevStatus) {
      await recordLeadActivity({
        leadId: String(lead._id),
        userId: req.admin?.sub,
        userName: req.admin?.name,
        action: 'status_changed',
        metadata: { from: prevStatus, to: data.status },
      });
    } else {
      await recordLeadActivity({
        leadId: String(lead._id),
        userId: req.admin?.sub,
        userName: req.admin?.name,
        action: 'lead_updated',
      });
    }

    res.json(ok(serializeLead(lead.toObject())));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Lead not found.');
    res.json(ok({ id: req.params.id }));
  })
);

router.post(
  '/:id/contact',
  asyncHandler(async (req, res) => {
    const parsed = contactActionSchema.safeParse(req.body ?? {});
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    lead.contactedAt = new Date();
    const nextStatus = parsed.data.status || (lead.status === 'new' ? 'contacted' : lead.status);
    lead.status = nextStatus;
    if (parsed.data.note) {
      lead.notes = lead.notes
        ? `${lead.notes}\n\n[${new Date().toISOString()}] ${parsed.data.note}`
        : parsed.data.note;
      await LeadNote.create({
        lead: lead._id,
        author: req.admin!.sub,
        authorName: req.admin!.name,
        text: parsed.data.note,
      });
    }
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action: 'marked_contacted',
      metadata: { status: lead.status },
    });

    res.json(ok(serializeLead(lead.toObject())));
  })
);

router.post(
  '/:id/reply',
  asyncHandler(async (req, res) => {
    const parsed = replyActionSchema.safeParse(req.body ?? {});
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    lead.replied = true;
    lead.repliedAt = new Date();
    if (!lead.contactedAt) lead.contactedAt = new Date();
    if (normalizeLeadStatus(String(lead.status)) === 'new' || lead.status === 'contacted') {
      lead.status = 'replied';
    }
    if (parsed.data.note) {
      lead.notes = lead.notes
        ? `${lead.notes}\n\n[${new Date().toISOString()}] ${parsed.data.note}`
        : parsed.data.note;
      await LeadNote.create({
        lead: lead._id,
        author: req.admin!.sub,
        authorName: req.admin!.name,
        text: parsed.data.note,
      });
    }
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action: 'marked_replied',
      metadata: { channel: parsed.data.channel || 'other' },
    });

    res.json(ok(serializeLead(lead.toObject())));
  })
);

router.post(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const parsed = noteCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Note text is required.');

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    const note = await LeadNote.create({
      lead: lead._id,
      author: req.admin!.sub,
      authorName: req.admin!.name,
      text: parsed.data.text,
    });

    lead.notes = lead.notes
      ? `${lead.notes}\n\n[${new Date().toISOString()}] ${req.admin!.name}: ${parsed.data.text}`
      : `${req.admin!.name}: ${parsed.data.text}`;
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action: 'note_added',
      metadata: { noteId: String(note._id) },
    });

    res.status(201).json(ok(serializeNote(note.toObject())));
  })
);

router.get(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const notes = await LeadNote.find({ lead: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json(ok(notes.map(serializeNote)));
  })
);

router.post(
  '/:id/follow-up',
  asyncHandler(async (req, res) => {
    const parsed = followUpSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid follow-up payload.');

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    const prev = lead.followUpAt;
    lead.followUpAt = parsed.data.followUpAt ? new Date(parsed.data.followUpAt) : null;
    if (lead.followUpAt && normalizeLeadStatus(String(lead.status)) !== 'converted') {
      lead.status = 'follow_up';
    }
    if (parsed.data.note) {
      await LeadNote.create({
        lead: lead._id,
        author: req.admin!.sub,
        authorName: req.admin!.name,
        text: parsed.data.note,
      });
    }
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    const action =
      lead.followUpAt === null
        ? 'follow_up_cancelled'
        : 'follow_up_changed';

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action,
      metadata: {
        from: prev ? new Date(prev).toISOString() : null,
        to: lead.followUpAt ? lead.followUpAt.toISOString() : null,
      },
    });

    res.json(ok(serializeLead(lead.toObject())));
  })
);

router.post(
  '/:id/follow-up/complete',
  asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');

    lead.followUpAt = null;
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));

    await recordLeadActivity({
      leadId: String(lead._id),
      userId: req.admin?.sub,
      userName: req.admin?.name,
      action: 'follow_up_completed',
    });

    res.json(ok(serializeLead(lead.toObject())));
  })
);

router.get(
  '/:id/activity',
  asyncHandler(async (req, res) => {
    const items = await LeadActivity.find({ lead: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(ok(items.map(serializeActivity)));
  })
);

router.post(
  '/:id/sync',
  asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found.');
    lead.localDirtyAt = new Date();
    await lead.save();
    await markLeadDirty(String(lead._id));
    res.json(ok({ queued: true, lead: serializeLead(lead.toObject()) }));
  })
);

export { CRM_LEAD_STATUSES };
export default router;
