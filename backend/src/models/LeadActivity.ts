import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';
import { LEAD_ACTIVITY_ACTIONS } from '../../../shared/crm/constants';

const LeadActivitySchema = new Schema(
  {
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    userName: { type: String, default: null },
    action: {
      type: String,
      enum: [...LEAD_ACTIVITY_ACTIONS],
      required: true,
      index: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LeadActivitySchema.index({ createdAt: -1 });
LeadActivitySchema.index({ lead: 1, createdAt: -1 });

export type LeadActivityDoc = InferSchemaType<typeof LeadActivitySchema>;

export const LeadActivity: Model<LeadActivityDoc> =
  (mongoose.models.LeadActivity as Model<LeadActivityDoc>) ||
  mongoose.model<LeadActivityDoc>('LeadActivity', LeadActivitySchema);

export default LeadActivity;
