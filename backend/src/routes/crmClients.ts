import { Router } from 'express';

import { AdminUser } from '../models/AdminUser';
import { GoogleSheetConnection } from '../models/GoogleSheetConnection';
import { Lead } from '../models/Lead';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { hashPassword } from '../utils/password';
import { ok, serializeLead, serializeSheetConnection } from '../utils/crmSerialize';
import { sheetConnectSchema, userCreateSchema, userUpdateSchema } from '../validation/crm';
import {
  extractSpreadsheetId,
  fetchSheetHeaders,
  isGoogleConfigured,
  runTwoWaySync,
  suggestColumnMapping,
} from '../services/googleSheets/sheetsService';

const router = Router();

// Only the main admin manages clients and their sheet assignments.
router.use(requireAuth, requireRole('admin'));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const clients = await AdminUser.find({ role: 'client' }).sort({ createdAt: -1 }).lean();
    const ids = clients.map((u) => u._id);

    const [connections, leadCounts] = await Promise.all([
      GoogleSheetConnection.find({ ownerUserId: { $in: ids } }).lean(),
      Lead.aggregate<{ _id: string; n: number }>([
        { $match: { ownerUserId: { $in: ids } } },
        { $group: { _id: '$ownerUserId', n: { $sum: 1 } } },
      ]),
    ]);

    const connectionByOwner = new Map(connections.map((c) => [String(c.ownerUserId), c]));
    const leadCountByOwner = new Map(leadCounts.map((l) => [String(l._id), l.n]));

    res.json(
      ok(
        clients.map((u) => {
          const connection = connectionByOwner.get(String(u._id));
          return {
            id: String(u._id),
            email: u.email,
            name: u.name,
            active: u.active,
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt,
            leadCount: leadCountByOwner.get(String(u._id)) || 0,
            sheet: connection ? serializeSheetConnection(connection) : null,
          };
        })
      )
    );
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = userCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid client payload.');
    }

    const existing = await AdminUser.findOne({ email: parsed.data.email });
    if (existing) throw new ApiError(409, 'A user with this email already exists.');

    const passwordHash = await hashPassword(parsed.data.password);
    const client = await AdminUser.create({
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: 'client',
      active: true,
    });

    res.status(201).json(
      ok({
        id: String(client._id),
        email: client.email,
        name: client.name,
        active: client.active,
        createdAt: client.createdAt,
        leadCount: 0,
        sheet: null,
      })
    );
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = userUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');

    const client = await AdminUser.findOne({ _id: req.params.id, role: 'client' });
    if (!client) throw new ApiError(404, 'Client not found.');

    if (parsed.data.name !== undefined) client.name = parsed.data.name;
    if (parsed.data.active !== undefined) client.active = parsed.data.active;
    if (parsed.data.password) client.passwordHash = await hashPassword(parsed.data.password);

    await client.save();
    res.json(
      ok({ id: String(client._id), email: client.email, name: client.name, active: client.active })
    );
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    // Soft-delete: deactivate rather than remove, so their leads/history stay intact.
    const client = await AdminUser.findOneAndUpdate(
      { _id: req.params.id, role: 'client' },
      { active: false },
      { new: true }
    );
    if (!client) throw new ApiError(404, 'Client not found.');
    res.json(ok({ id: String(client._id), active: client.active }));
  })
);

router.get(
  '/:id/leads',
  asyncHandler(async (req, res) => {
    const client = await AdminUser.findOne({ _id: req.params.id, role: 'client' });
    if (!client) throw new ApiError(404, 'Client not found.');

    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size) || 30));

    const filter = { ownerUserId: client._id };
    const [items, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json(
      ok(
        items.map((l) => serializeLead(l)),
        { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 }
      )
    );
  })
);

router.put(
  '/:id/sheet',
  asyncHandler(async (req, res) => {
    if (!isGoogleConfigured()) {
      throw new ApiError(503, 'Google service account is not configured on the server.');
    }

    const client = await AdminUser.findOne({ _id: req.params.id, role: 'client' });
    if (!client) throw new ApiError(404, 'Client not found.');

    const parsed = sheetConnectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid connection payload.');
    }
    const { worksheetName, spreadsheetTitle, columnMapping } = parsed.data;
    const spreadsheetId = extractSpreadsheetId(parsed.data.spreadsheetId);

    let headers: string[] = [];
    try {
      headers = await fetchSheetHeaders(spreadsheetId, worksheetName);
    } catch (err) {
      throw new ApiError(
        400,
        err instanceof Error
          ? `Unable to read spreadsheet: ${err.message}`
          : 'Unable to read spreadsheet. Share it with the service account.'
      );
    }

    const mapping =
      Object.values(columnMapping || {}).some(Boolean)
        ? columnMapping
        : suggestColumnMapping(headers);

    const connection = await GoogleSheetConnection.findOneAndUpdate(
      { ownerUserId: client._id },
      {
        spreadsheetId,
        worksheetName,
        spreadsheetTitle: spreadsheetTitle || spreadsheetId,
        columnMapping: mapping,
        connected: true,
        createdBy: req.admin?.sub,
        ownerUserId: client._id,
        lastSyncState: 'idle',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(
      ok({
        connection: serializeSheetConnection(connection.toObject()),
        headers,
        suggestedMapping: mapping,
      })
    );
  })
);

router.delete(
  '/:id/sheet',
  asyncHandler(async (req, res) => {
    const client = await AdminUser.findOne({ _id: req.params.id, role: 'client' });
    if (!client) throw new ApiError(404, 'Client not found.');

    await GoogleSheetConnection.updateMany({ ownerUserId: client._id }, { connected: false });
    res.json(ok({ disconnected: true }));
  })
);

router.post(
  '/:id/sheet/sync',
  asyncHandler(async (req, res) => {
    const client = await AdminUser.findOne({ _id: req.params.id, role: 'client' });
    if (!client) throw new ApiError(404, 'Client not found.');

    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: client._id,
      connected: true,
    });
    if (!connection) throw new ApiError(404, 'No Google Sheet connected for this client.');

    const report = await runTwoWaySync(String(connection._id), req.admin?.sub);
    const refreshed = await GoogleSheetConnection.findById(connection._id);
    res.json(
      ok({
        report,
        connection: refreshed ? serializeSheetConnection(refreshed.toObject()) : null,
      })
    );
  })
);

export default router;
