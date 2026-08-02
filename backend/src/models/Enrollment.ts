import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const EnrollmentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'PortalCourse', required: true, index: true },
    completedLessonIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export type EnrollmentDoc = InferSchemaType<typeof EnrollmentSchema>;

export const Enrollment: Model<EnrollmentDoc> =
  (mongoose.models.Enrollment as Model<EnrollmentDoc>) ||
  mongoose.model<EnrollmentDoc>('Enrollment', EnrollmentSchema);

export default Enrollment;
