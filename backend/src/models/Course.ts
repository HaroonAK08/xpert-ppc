import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

/** Xpert PPC Digital Academy course pages. */
const CourseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'GraduationCap' },
    level: { type: String, default: 'Beginner to Advanced' },
    duration: { type: String, default: '' },
    format: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },

    outcomes: { type: [String], default: [] },
    modules: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, default: '' },
          lessons: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    audience: { type: [String], default: [] },
    features: { type: [String], default: [] },
    tools: { type: [String], default: [] },
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

export type CourseDoc = InferSchemaType<typeof CourseSchema>;

export const Course: Model<CourseDoc> =
  (mongoose.models.Course as Model<CourseDoc>) ||
  mongoose.model<CourseDoc>('Course', CourseSchema);

export default Course;
