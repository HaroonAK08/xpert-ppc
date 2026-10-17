import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ClassRecordingSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'PortalCourse', required: true, index: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, default: 0 },
    recordedAt: { type: Date, default: null },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ClassRecordingDoc = InferSchemaType<typeof ClassRecordingSchema>;

export const ClassRecording: Model<ClassRecordingDoc> =
  (mongoose.models.ClassRecording as Model<ClassRecordingDoc>) ||
  mongoose.model<ClassRecordingDoc>('ClassRecording', ClassRecordingSchema);

export default ClassRecording;
