import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const FaqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'General',
        'Google Ads',
        'Meta Ads',
        'TikTok Ads',
        'Amazon Ads',
        'LinkedIn Ads',
        'Microsoft Ads',
        'Campaign Management',
        'Reporting',
        'Pricing',
      ],
      default: 'General',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type FaqDoc = InferSchemaType<typeof FaqSchema>;

export const Faq: Model<FaqDoc> =
  (mongoose.models.Faq as Model<FaqDoc>) || mongoose.model<FaqDoc>('Faq', FaqSchema);

export default Faq;
