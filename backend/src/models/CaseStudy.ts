import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const CaseStudySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    client: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '' },
    industry: { type: String, default: '' },
    duration: { type: String, default: '' },
    channels: { type: [String], default: [] },
    heroImage: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },

    metrics: {
      type: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
          description: { type: String, default: '' },
        },
      ],
      default: [],
    },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    results: { type: String, default: '' },
    sections: {
      type: [{ title: { type: String, required: true }, body: { type: String, default: '' } }],
      default: [],
    },
    testimonial: {
      quote: { type: String, default: '' },
      author: { type: String, default: '' },
      role: { type: String, default: '' },
    },

    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export type CaseStudyDoc = InferSchemaType<typeof CaseStudySchema>;

export const CaseStudy: Model<CaseStudyDoc> =
  (mongoose.models.CaseStudy as Model<CaseStudyDoc>) ||
  mongoose.model<CaseStudyDoc>('CaseStudy', CaseStudySchema);

export default CaseStudy;
