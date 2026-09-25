import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';
import { LEAD_STATUSES } from '../../../shared/crm/constants';
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
    // Which Google Sheet connection this lead was synced from, if any.
    sheetConnectionId: {
      type: Schema.Types.ObjectId,
      ref: 'GoogleSheetConnection',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ updatedAt: -1 });
LeadSchema.index({ email: 1, createdAt: -1 });
LeadSchema.index({ phoneNormalized: 1, email: 1 });
LeadSchema.index({ name: 'text', email: 'text', phone: 'text', company: 'text', businessName: 'text', message: 'text' });

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
