import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const StudentSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    interest: { type: String, default: '', trim: true },
    courseSlug: { type: String, default: '', trim: true, lowercase: true },
    couponCode: { type: String, default: '', trim: true, uppercase: true, index: true },
    country: { type: String, default: '', trim: true },
    avatarUrl: { type: String, default: '', trim: true },
    coursePreference: { type: String, default: '', trim: true },
    freelancedBefore: { type: Boolean, default: null },
    freelancingExperience: { type: String, default: '', trim: true },
    workPreference: { type: String, enum: ['', 'full-time', 'part-time'], default: '' },
    gender: { type: String, enum: ['', 'male', 'female'], default: '' },
    lastLoginAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type StudentDoc = InferSchemaType<typeof StudentSchema>;

export const Student: Model<StudentDoc> =
  (mongoose.models.Student as Model<StudentDoc>) ||
  mongoose.model<StudentDoc>('Student', StudentSchema);

export default Student;
