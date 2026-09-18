/**
 * Normalize phone numbers for matching/WhatsApp.
 * Preserves the original display value on the Lead document separately.
 */
export function normalizePhone(raw: string, defaultCountry = 'PK'): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';

  let digits = trimmed.replace(/[^\d+]/g, '');

  if (digits.startsWith('00')) {
    digits = `+${digits.slice(2)}`;
  }

  if (digits.startsWith('+')) {
    return `+${digits.slice(1).replace(/\D/g, '')}`;
  }

  const only = digits.replace(/\D/g, '');

  if (defaultCountry === 'PK') {
    if (only.startsWith('92') && only.length >= 12) {
      return `+${only}`;
    }
    if (only.startsWith('0') && only.length === 11) {
      return `+92${only.slice(1)}`;
    }
    if (only.length === 10 && only.startsWith('3')) {
      return `+92${only}`;
    }
  }

  return only ? `+${only}` : '';
}

export function normalizeEmail(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw);
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Digits-only WhatsApp path (no +). */
export function whatsappDigits(raw: string): string {
  return normalizePhone(raw).replace(/\D/g, '');
}
