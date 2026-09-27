import type { MetaLeadField } from './client';

/** Meta's standard lead-form field names — custom questions still land in `raw` for reference. */
export function mapMetaFields(fields: MetaLeadField[]): {
  name: string;
  email: string;
  phone: string;
  company: string;
  raw: Record<string, string>;
} {
  const raw: Record<string, string> = {};
  for (const field of fields) raw[field.name] = field.values?.[0] ?? '';

  const name =
    raw.full_name ||
    [raw.first_name, raw.last_name].filter(Boolean).join(' ') ||
    raw.name ||
    'Facebook Lead';

  return {
    name,
    email: raw.email || '',
    phone: raw.phone_number || raw.phone || '',
    company: raw.company_name || raw.business_name || '',
    raw,
  };
}
