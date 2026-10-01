import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const PushTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
    token: { type: String, required: true, unique: true, trim: true },
    platform: { type: String, enum: ['ios', 'android', 'web'], default: 'android' },
  },
  { timestamps: true }
);

export type PushTokenDoc = InferSchemaType<typeof PushTokenSchema>;

export const PushToken: Model<PushTokenDoc> =
  (mongoose.models.PushToken as Model<PushTokenDoc>) ||
  mongoose.model<PushTokenDoc>('PushToken', PushTokenSchema);

export default PushToken;
