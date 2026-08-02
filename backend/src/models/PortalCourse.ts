import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

export const LESSON_TYPES = ['video', 'lecture', 'assignment', 'task'] as const;
export type LessonType = (typeof LESSON_TYPES)[number];

const LessonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: LESSON_TYPES, required: true },
    summary: { type: String, default: '', trim: true },
    body: { type: String, default: '' },
    videoUrl: { type: String, default: '', trim: true },
    fileUrl: { type: String, default: '', trim: true },
    fileName: { type: String, default: '', trim: true },
    durationMinutes: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { _id: true }
);

const ModuleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: true }
);

const PortalCourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '', trim: true },
    thumbnailUrl: { type: String, default: '', trim: true },
    level: { type: String, default: 'Beginner', trim: true },
    published: { type: Boolean, default: false },
    modules: { type: [ModuleSchema], default: [] },
  },
  { timestamps: true }
);

export type PortalCourseDoc = InferSchemaType<typeof PortalCourseSchema>;

export const PortalCourse: Model<PortalCourseDoc> =
  (mongoose.models.PortalCourse as Model<PortalCourseDoc>) ||
  mongoose.model<PortalCourseDoc>('PortalCourse', PortalCourseSchema);

export default PortalCourse;
