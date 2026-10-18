import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    active: { type: Boolean, default: true },
    note: { type: String, default: '', trim: true },
    maxUses: { type: Number, default: 0, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export type CouponDoc = InferSchemaType<typeof CouponSchema>;

export const Coupon: Model<CouponDoc> =
  (mongoose.models.Coupon as Model<CouponDoc>) || mongoose.model<CouponDoc>('Coupon', CouponSchema);

export default Coupon;
