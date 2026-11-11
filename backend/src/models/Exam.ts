import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const ExamQuestionSchema = new Schema(
  {
    prompt: { type: String, required: true, trim: true, maxlength: 500 },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const ExamSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    questions: { type: [ExamQuestionSchema], required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ExamSchema.index({ published: 1, createdAt: -1, _id: -1 });

export type ExamDoc = InferSchemaType<typeof ExamSchema>;

export const Exam: Model<ExamDoc> =
  (mongoose.models.Exam as Model<ExamDoc>) || mongoose.model<ExamDoc>('Exam', ExamSchema);

export default Exam;
