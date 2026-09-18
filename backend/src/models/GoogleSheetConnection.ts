import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';
import { SHEET_FIELD_KEYS } from '../../../shared/crm/constants';

const ColumnMappingSchema = new Schema(
  Object.fromEntries(SHEET_FIELD_KEYS.map((k) => [k, { type: String, default: '' }])),
  { _id: false }
);

const SyncReportSchema = new Schema(
  {
    checked: { type: Number, default: 0 },
    created: { type: Number, default: 0 },
    updated: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    conflicts: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    pushed: { type: Number, default: 0 },
    errorItems: [
      {
        row: { type: Number },
        message: { type: String, required: true },
      },
    ],
    startedAt: { type: Date },
    finishedAt: { type: Date },
    state: {
      type: String,
      enum: ['idle', 'syncing', 'success', 'failed'],
      default: 'idle',
    },
  },
  { _id: false }
);

const GoogleSheetConnectionSchema = new Schema(
  {
    spreadsheetId: { type: String, required: true, trim: true },
    spreadsheetTitle: { type: String, default: '', trim: true },
    worksheetName: { type: String, required: true, trim: true, default: 'Sheet1' },
    columnMapping: { type: ColumnMappingSchema, default: () => ({}) },
    connected: { type: Boolean, default: true },
    lastSyncedAt: { type: Date, default: null },
    lastSyncState: {
      type: String,
      enum: ['idle', 'syncing', 'success', 'failed'],
      default: 'idle',
    },
    lastSyncReport: { type: SyncReportSchema, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

GoogleSheetConnectionSchema.index({ spreadsheetId: 1, worksheetName: 1 });

export type GoogleSheetConnectionDoc = InferSchemaType<typeof GoogleSheetConnectionSchema>;

export const GoogleSheetConnection: Model<GoogleSheetConnectionDoc> =
  (mongoose.models.GoogleSheetConnection as Model<GoogleSheetConnectionDoc>) ||
  mongoose.model<GoogleSheetConnectionDoc>('GoogleSheetConnection', GoogleSheetConnectionSchema);

export default GoogleSheetConnection;
