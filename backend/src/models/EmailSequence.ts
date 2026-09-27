import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const SequenceStepSchema = new Schema(
  {
    // Hours after the previous step (or enrollment, for step 0) before this one sends.
    delayHours: { type: Number, required: true, min: 0 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    // Plain text/simple HTML. Supports {{name}} as the one merge variable.
    body: { type: String, required: true, maxlength: 20000 },
  },
  { _id: false }
);

const EmailSequenceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    steps: { type: [SequenceStepSchema], default: [] },
    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

export type EmailSequenceDoc = InferSchemaType<typeof EmailSequenceSchema>;

export const EmailSequence: Model<EmailSequenceDoc> =
  (mongoose.models.EmailSequence as Model<EmailSequenceDoc>) ||
  mongoose.model<EmailSequenceDoc>('EmailSequence', EmailSequenceSchema);

export default EmailSequence;
