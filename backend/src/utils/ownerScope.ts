import type { FilterQuery } from 'mongoose';

import { AdminUser } from '../models/AdminUser';

/**
 * Lead visibility by role:
 * - admin  → main pool (fieldId null) — website/forms/sheets/meta; not company-field leads
 * - client with a company/field → all leads in that field (shared with teammates)
 * - client without a field → only leads they personally own
 */
export async function leadOwnerScope(
  admin?: { sub: string; role: string }
): Promise<FilterQuery<Record<string, unknown>>> {
  if (!admin || admin.role === 'admin') {
    // Main pool by field bucket. Sheets/Meta may stamp ownerUserId to the connecting
    // admin — still show those; only company/field leads are excluded.
    return { fieldId: null };
  }

  const user = await AdminUser.findById(admin.sub).select('fieldId').lean();
  if (user?.fieldId) return { fieldId: user.fieldId };
  return { ownerUserId: admin.sub };
}

/**
 * Forms / automations (and similar) are partitioned by company field:
 * - admin → fieldId null (main pool)
 * - client with field → that field only
 * - client without field → createdBy self (legacy fallback)
 */
export async function resourceFieldScope(
  admin?: { sub: string; role: string }
): Promise<{ scope: FilterQuery<Record<string, unknown>>; fieldId: string | null }> {
  if (!admin || admin.role === 'admin') {
    return { scope: { fieldId: null }, fieldId: null };
  }

  const user = await AdminUser.findById(admin.sub).select('fieldId').lean();
  if (user?.fieldId) {
    return { scope: { fieldId: user.fieldId }, fieldId: String(user.fieldId) };
  }
  return { scope: { createdBy: admin.sub }, fieldId: null };
}

export async function resolveUserFieldId(userId: string): Promise<string | null> {
  const user = await AdminUser.findById(userId).select('fieldId').lean();
  return user?.fieldId ? String(user.fieldId) : null;
}
