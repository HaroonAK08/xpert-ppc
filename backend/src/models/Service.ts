import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Search' },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },

    hero: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
    },
    features: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Check' },
        },
      ],
      default: [],
    },
    process: {
      type: [
        {
          step: { type: String, default: '' },
          title: { type: String, required: true },
          description: { type: String, default: '' },
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

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;

export const Service: Model<ServiceDoc> =
  (mongoose.models.Service as Model<ServiceDoc>) ||
  mongoose.model<ServiceDoc>('Service', ServiceSchema);

export default Service;
