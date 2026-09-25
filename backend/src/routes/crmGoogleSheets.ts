import { Router } from 'express';

import { GoogleSheetConnection } from '../models/GoogleSheetConnection';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok, serializeSheetConnection } from '../utils/crmSerialize';
import { sheetConnectSchema, sheetMappingSchema } from '../validation/crm';
import {
  extractSpreadsheetId,
  fetchSheetHeaders,
  isGoogleConfigured,
  runTwoWaySync,
  suggestColumnMapping,
} from '../services/googleSheets/sheetsService';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: req.admin?.sub,
      connected: true,
    }).lean();

    res.json(
      ok({
        configured: isGoogleConfigured(),
        connection: connection ? serializeSheetConnection(connection) : null,
      })
    );
  })
);

router.get(
  '/status',
  asyncHandler(async (req, res) => {
    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: req.admin?.sub,
      connected: true,
    }).lean();

    res.json(
      ok({
        configured: isGoogleConfigured(),
        connected: Boolean(connection?.connected),
        lastSyncedAt: connection?.lastSyncedAt
          ? new Date(connection.lastSyncedAt).toISOString()
          : null,
        lastSyncState: connection?.lastSyncState || 'idle',
        lastSyncReport: connection?.lastSyncReport || null,
        spreadsheetId: connection?.spreadsheetId || null,
        worksheetName: connection?.worksheetName || null,
        spreadsheetTitle: connection?.spreadsheetTitle || null,
      })
    );
  })
);

router.post(
  '/connect',
  asyncHandler(async (req, res) => {
    if (!isGoogleConfigured()) {
      throw new ApiError(
        503,
        'Google service account is not configured on the server. See docs/google-sheets.md.'
      );
    }

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

    // Each user has at most one sheet — replace theirs in place rather than
    // disconnecting everyone else's (the old single-tenant behavior).
    const connection = await GoogleSheetConnection.findOneAndUpdate(
      { ownerUserId: req.admin?.sub },
      {
        spreadsheetId,
        worksheetName,
        spreadsheetTitle: spreadsheetTitle || spreadsheetId,
        columnMapping: mapping,
        connected: true,
        createdBy: req.admin?.sub,
        ownerUserId: req.admin?.sub,
        lastSyncState: 'idle',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(
      ok({
        connection: serializeSheetConnection(connection.toObject()),
        headers,
        suggestedMapping: mapping,
      })
    );
  })
);

router.patch(
  '/mapping',
  asyncHandler(async (req, res) => {
    const parsed = sheetMappingSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid mapping payload.');

    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: req.admin?.sub,
      connected: true,
    });
    if (!connection) throw new ApiError(404, 'No Google Sheet connected.');

    if (parsed.data.worksheetName) connection.worksheetName = parsed.data.worksheetName;
    if (parsed.data.spreadsheetTitle) connection.spreadsheetTitle = parsed.data.spreadsheetTitle;
    if (parsed.data.columnMapping) {
      connection.columnMapping = {
        ...(connection.columnMapping as object),
        ...parsed.data.columnMapping,
      };
    }
    await connection.save();

    res.json(ok(serializeSheetConnection(connection.toObject())));
  })
);

router.get(
  '/headers',
  asyncHandler(async (req, res) => {
    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: req.admin?.sub,
      connected: true,
    });
    if (!connection) throw new ApiError(404, 'No Google Sheet connected.');

    const headers = await fetchSheetHeaders(connection.spreadsheetId, connection.worksheetName);
    res.json(
      ok({
        headers,
        suggestedMapping: suggestColumnMapping(headers),
        currentMapping: connection.columnMapping,
      })
    );
  })
);

router.post(
  '/sync',
  asyncHandler(async (req, res) => {
    const connection = await GoogleSheetConnection.findOne({
      ownerUserId: req.admin?.sub,
      connected: true,
    });
    if (!connection) throw new ApiError(404, 'No Google Sheet connected.');

    try {
      const report = await runTwoWaySync(String(connection._id), req.admin?.sub);
      const refreshed = await GoogleSheetConnection.findById(connection._id);
      res.json(
        ok({
          report,
          connection: refreshed ? serializeSheetConnection(refreshed.toObject()) : null,
        })
      );
    } catch (err) {
      throw new ApiError(
        500,
        err instanceof Error ? err.message : 'Google Sheet synchronization failed.'
      );
    }
  })
);

router.delete(
  '/disconnect',
  asyncHandler(async (req, res) => {
    await GoogleSheetConnection.updateMany(
      { ownerUserId: req.admin?.sub },
      { connected: false }
    );
    res.json(ok({ disconnected: true }));
  })
);

export default router;
