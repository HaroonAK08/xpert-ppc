import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ContactActivitySchema = new Schema(
  {
    contact: { type: Schema.Types.ObjectId, ref: 'Contact', required: true, index: true },
    type: { type: String, enum: ['page_view'], default: 'page_view' },
    url: { type: String, trim: true, default: '' },
    referrer: { type: String, trim: true, default: '' },
    utm: {
      source: { type: String, default: '' },
      medium: { type: String, default: '' },
      campaign: { type: String, default: '' },
      term: { type: String, default: '' },
      content: { type: String, default: '' },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ContactActivitySchema.index({ contact: 1, createdAt: -1 });

export type ContactActivityDoc = InferSchemaType<typeof ContactActivitySchema>;

export const ContactActivity: Model<ContactActivityDoc> =
  (mongoose.models.ContactActivity as Model<ContactActivityDoc>) ||
  mongoose.model<ContactActivityDoc>('ContactActivity', ContactActivitySchema);

export default ContactActivity;
