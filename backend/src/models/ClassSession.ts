import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ClassSessionSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'PortalCourse', required: true, index: true },
    title: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    meetLink: { type: String, default: '', trim: true },
    timezone: { type: String, default: 'Asia/Karachi', trim: true },
    notes: { type: String, default: '', trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ClassSessionDoc = InferSchemaType<typeof ClassSessionSchema>;

export const ClassSession: Model<ClassSessionDoc> =
  (mongoose.models.ClassSession as Model<ClassSessionDoc>) ||
  mongoose.model<ClassSessionDoc>('ClassSession', ClassSessionSchema);

export default ClassSession;
