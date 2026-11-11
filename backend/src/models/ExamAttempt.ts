import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const ExamAttemptSchema = new Schema(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    answers: { type: [Number], required: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    percent: { type: Number, required: true, min: 0, max: 100 },
    submittedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

ExamAttemptSchema.index({ examId: 1, studentId: 1 }, { unique: true });
ExamAttemptSchema.index({ examId: 1, submittedAt: -1, _id: -1 });

export type ExamAttemptDoc = InferSchemaType<typeof ExamAttemptSchema>;

export const ExamAttempt: Model<ExamAttemptDoc> =
  (mongoose.models.ExamAttempt as Model<ExamAttemptDoc>) ||
  mongoose.model<ExamAttemptDoc>('ExamAttempt', ExamAttemptSchema);

export default ExamAttempt;
