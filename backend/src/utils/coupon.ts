import { Coupon } from '../models/Coupon';

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export async function findValidCoupon(rawCode: string) {
  const code = normalizeCouponCode(rawCode);
  if (!code) return null;

  const coupon = await Coupon.findOne({ code });
  if (!coupon || !coupon.active) return null;
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return null;
  return coupon;
}

/** Atomically reserves one use, so two concurrent signups can't both pass a maxUses:1 coupon. */
export async function consumeCoupon(rawCode: string) {
  const code = normalizeCouponCode(rawCode);
  if (!code) return null;

  return Coupon.findOneAndUpdate(
    {
      code,
      active: true,
      $expr: { $or: [{ $eq: ['$maxUses', 0] }, { $lt: ['$usedCount', '$maxUses'] }] },
    },
    { $inc: { usedCount: 1 } },
    { new: true }
  );
}

/** Gives back a use, e.g. when the applicant who redeemed it is rejected. */
export async function refundCoupon(rawCode: string) {
  const code = normalizeCouponCode(rawCode);
  if (!code) return null;

  return Coupon.findOneAndUpdate(
    { code, usedCount: { $gt: 0 } },
    { $inc: { usedCount: -1 } },
    { new: true }
  );
}
