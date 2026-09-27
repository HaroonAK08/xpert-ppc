import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const SequenceEnrollmentSchema = new Schema(
  {
    sequence: { type: Schema.Types.ObjectId, ref: 'EmailSequence', required: true, index: true },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    currentStep: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'stopped'], default: 'active' },
    nextSendAt: { type: Date, required: true },
    lastSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

SequenceEnrollmentSchema.index({ sequence: 1, lead: 1 }, { unique: true });
SequenceEnrollmentSchema.index({ status: 1, nextSendAt: 1 });

export type SequenceEnrollmentDoc = InferSchemaType<typeof SequenceEnrollmentSchema>;

export const SequenceEnrollment: Model<SequenceEnrollmentDoc> =
  (mongoose.models.SequenceEnrollment as Model<SequenceEnrollmentDoc>) ||
  mongoose.model<SequenceEnrollmentDoc>('SequenceEnrollment', SequenceEnrollmentSchema);

export default SequenceEnrollment;
