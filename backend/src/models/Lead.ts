import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    company: { type: String, trim: true, maxlength: 160, default: '' },
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
      enum: ['hero-audit', 'contact-page', 'service-page', 'academy', 'industry', 'footer', 'other'],
      default: 'other',
      index: true,
    },
    sourcePath: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'],
      default: 'new',
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 4000, default: '' },
    // Lightweight attribution — populated from query params when present.
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
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ email: 1, createdAt: -1 });

export type LeadDoc = InferSchemaType<typeof LeadSchema>;

export const Lead: Model<LeadDoc> =
  (mongoose.models.Lead as Model<LeadDoc>) || mongoose.model<LeadDoc>('Lead', LeadSchema);

export default Lead;
