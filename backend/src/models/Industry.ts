import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const IndustrySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Stethoscope' },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },

    hero: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
    },
    stats: {
      type: [{ label: { type: String, required: true }, value: { type: String, required: true } }],
      default: [],
    },
    challenges: {
      type: [{ title: { type: String, required: true }, description: { type: String, default: '' } }],
      default: [],
    },
    solutions: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Check' },
        },
      ],
      default: [],
    },
    packages: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: String, default: '' },
          period: { type: String, default: '/mo' },
          description: { type: String, default: '' },
          features: { type: [String], default: [] },
          popular: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    faqs: {
      type: [
        { question: { type: String, required: true }, answer: { type: String, required: true } },
      ],
      default: [],
    },

    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export type IndustryDoc = InferSchemaType<typeof IndustrySchema>;

export const Industry: Model<IndustryDoc> =
  (mongoose.models.Industry as Model<IndustryDoc>) ||
  mongoose.model<IndustryDoc>('Industry', IndustrySchema);

export default Industry;
