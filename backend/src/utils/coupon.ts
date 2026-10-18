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

export async function consumeCoupon(rawCode: string) {
  const coupon = await findValidCoupon(rawCode);
  if (!coupon) return null;
  coupon.usedCount = (coupon.usedCount || 0) + 1;
  await coupon.save();
  return coupon;
}
