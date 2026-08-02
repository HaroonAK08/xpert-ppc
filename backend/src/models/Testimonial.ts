import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    avatar: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    platform: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema>;

export const Testimonial: Model<TestimonialDoc> =
  (mongoose.models.Testimonial as Model<TestimonialDoc>) ||
  mongoose.model<TestimonialDoc>('Testimonial', TestimonialSchema);

export default Testimonial;
