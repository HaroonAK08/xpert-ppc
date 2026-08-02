import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const OtpChallengeSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    purpose: { type: String, enum: ['signup', 'login'], required: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

OtpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OtpChallengeSchema.index({ email: 1, purpose: 1 });

export type OtpChallengeDoc = InferSchemaType<typeof OtpChallengeSchema>;

export const OtpChallenge: Model<OtpChallengeDoc> =
  (mongoose.models.OtpChallenge as Model<OtpChallengeDoc>) ||
  mongoose.model<OtpChallengeDoc>('OtpChallenge', OtpChallengeSchema);

export default OtpChallenge;
