import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

export const RESOURCE_KINDS = ['notes', 'assignment', 'template', 'other'] as const;

const LearningResourceSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'PortalCourse', required: true, index: true },
    title: { type: String, required: true, trim: true },
    kind: { type: String, enum: RESOURCE_KINDS, default: 'notes' },
    description: { type: String, default: '', trim: true },
    fileUrl: { type: String, default: '', trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type LearningResourceDoc = InferSchemaType<typeof LearningResourceSchema>;

export const LearningResource: Model<LearningResourceDoc> =
  (mongoose.models.LearningResource as Model<LearningResourceDoc>) ||
  mongoose.model<LearningResourceDoc>('LearningResource', LearningResourceSchema);

export default LearningResource;
