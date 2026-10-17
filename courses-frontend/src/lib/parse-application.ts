export type ParsedApplication = {
  course: string;
  experience: string;
  whatsapp: string;
  timezone: string;
  fee: string;
  transactionId: string;
  receiptUrl: string;
  raw: string;
};

function pick(interest: string, label: string): string {
  const re = new RegExp(`${label}:\\s*(.+?)\\.(\\s|$)`, 'i');
  const match = interest.match(re);
  return match?.[1]?.trim() || '';
}

export function parseApplicationInterest(interest: string): ParsedApplication {
  const raw = interest || '';
  const receiptMatch = raw.match(/Transaction image:\s*(https?:\/\/\S+?)(?:\.(\s|$)|$)/i);
  return {
    course: pick(raw, 'Course'),
    experience: pick(raw, 'Experience level'),
    whatsapp: pick(raw, 'WhatsApp'),
    timezone: pick(raw, 'Timezone'),
    fee: pick(raw, 'Registration fee'),
    transactionId: pick(raw, 'Transaction ID'),
    receiptUrl: (receiptMatch?.[1] || '').replace(/\.$/, ''),
    raw,
  };
}
