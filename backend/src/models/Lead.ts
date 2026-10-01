import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';
import { LEAD_STATUSES, LEAD_QUALIFICATIONS } from '../../../shared/crm/constants';
import { normalizeEmail, normalizePhone } from '../../../shared/crm/normalize';

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    phoneNormalized: { type: String, trim: true, maxlength: 40, default: '', index: true },
    company: { type: String, trim: true, maxlength: 160, default: '' },
    businessName: { type: String, trim: true, maxlength: 160, default: '' },
    website: { type: String, trim: true, maxlength: 300, default: '' },
    platform: {
      type: String,
      enum: [
        'Google Ads',
        'Meta Ads',
        'TikTok Ads',
        'Amazon Ads',
        'LinkedIn Ads',
        'Microsoft Ads',
        'SEO',
        'Other',
      ],
      default: 'Other',
    },
    monthlyBudget: { type: String, trim: true, maxlength: 60, default: '' },
    message: { type: String, trim: true, maxlength: 4000, default: '' },
    source: {
      type: String,
      default: 'other',
      index: true,
    },
    sourcePath: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: [...LEAD_STATUSES],
      default: 'new',
      index: true,
    },
    // Independent of `status` — whether this lead is legitimate at all.
    qualification: {
      type: String,
      enum: [...LEAD_QUALIFICATIONS],
      default: 'unreviewed',
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 8000, default: '' },
    replied: { type: Boolean, default: false, index: true },
    contactedAt: { type: Date, default: null },
    repliedAt: { type: Date, default: null },
    followUpAt: { type: Date, default: null, index: true },
    externalId: { type: String, trim: true, default: '', index: true },
    sheetRowNumber: { type: Number, default: null, index: true },
    sheetChecksum: { type: String, default: '' },
    lastSyncedAt: { type: Date, default: null },
    localDirtyAt: { type: Date, default: null },
    utm: {
      source: { type: String, default: '' },
      medium: { type: String, default: '' },
      campaign: { type: String, default: '' },
      term: { type: String, default: '' },
      content: { type: String, default: '' },
    },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      referer: { type: String, default: '' },
    },
    // The team member this lead belongs to. null = admin-only / unassigned.
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null, index: true },
    // Company/field bucket for client-team leads — users in the same field share these.
    fieldId: { type: Schema.Types.ObjectId, ref: 'ClientField', default: null, index: true },
    // Which Google Sheet connection this lead was synced from, if any.
    sheetConnectionId: {
      type: Schema.Types.ObjectId,
      ref: 'GoogleSheetConnection',
      default: null,
      index: true,
    },
    // Full provider payload for externally-sourced leads (e.g. Meta field_data), kept for debugging.
    metaRaw: { type: Schema.Types.Mixed, default: null },
    // The anonymous website visitor this lead was identified from, if the tracking script saw them first.
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null, index: true },
    // Which builder-created form this lead was submitted through, if any (source: 'embed').
    formId: { type: Schema.Types.ObjectId, ref: 'LeadFormDefinition', default: null, index: true },
    // Snapshot of the form name at submit time — survives form renames/deletes in the leads list.
    formName: { type: String, trim: true, maxlength: 120, default: '' },
    // Tags copied from the form at submit time (Website, Facebook, …) — CRM-only context.
    formTags: { type: [String], default: [] },
    // Values for admin-defined custom properties, keyed by CustomFieldDefinition.key.
    customFields: { type: Schema.Types.Mixed, default: {} },
    // Set via the unsubscribe link in a sequence email — stops all future sequence sends to this lead.
    emailOptOut: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ updatedAt: -1 });
LeadSchema.index({ email: 1, createdAt: -1 });
LeadSchema.index({ phoneNormalized: 1, email: 1 });
LeadSchema.index({ name: 'text', email: 'text', phone: 'text', company: 'text', businessName: 'text', message: 'text' });
// Prevents re-importing the same externally-sourced lead (e.g. on a Meta webhook retry).
// Scoped to non-empty externalId so manual/website leads (externalId = '') are unaffected.
LeadSchema.index(
  { source: 1, externalId: 1 },
  { unique: true, partialFilterExpression: { externalId: { $gt: '' } } }
);

LeadSchema.pre('validate', function (next) {
  if (this.email) this.email = normalizeEmail(String(this.email));
  if (this.phone) this.phoneNormalized = normalizePhone(String(this.phone));
  if (!this.businessName && this.company) this.businessName = this.company;
  if (!this.company && this.businessName) this.company = this.businessName;
  next();
});

export type LeadDoc = InferSchemaType<typeof LeadSchema>;

export const Lead: Model<LeadDoc> =
  (mongoose.models.Lead as Model<LeadDoc>) || mongoose.model<LeadDoc>('Lead', LeadSchema);

export default Lead;
