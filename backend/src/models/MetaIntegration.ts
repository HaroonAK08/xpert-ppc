import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const MetaLeadFormSchema = new Schema(
  {
    formId: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { _id: false }
);

const MetaPendingPageSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: '' },
    // Encrypted — see services/meta/crypto.ts. Cleared once a page is selected.
    accessTokenEnc: { type: String, required: true },
  },
  { _id: false }
);

const MetaIntegrationSchema = new Schema(
  {
    // Each team member can connect their own Page, same pattern as GoogleSheetConnection.
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    connected: { type: Boolean, default: false },
    pageId: { type: String, default: '', index: true },
    pageName: { type: String, default: '' },
    pageAccessTokenEnc: { type: String, default: '' },
    forms: { type: [MetaLeadFormSchema], default: [] },
    // Set right after the OAuth callback, before a Page has been chosen.
    pendingPages: { type: [MetaPendingPageSchema], default: [] },
    lastLeadAt: { type: Date, default: null },
    lastError: { type: String, default: '' },
  },
  { timestamps: true }
);

MetaIntegrationSchema.index(
  { ownerUserId: 1 },
  { unique: true, partialFilterExpression: { ownerUserId: { $type: 'objectId' } } }
);

export type MetaIntegrationDoc = InferSchemaType<typeof MetaIntegrationSchema>;

export const MetaIntegration: Model<MetaIntegrationDoc> =
  (mongoose.models.MetaIntegration as Model<MetaIntegrationDoc>) ||
  mongoose.model<MetaIntegrationDoc>('MetaIntegration', MetaIntegrationSchema);

export default MetaIntegration;
