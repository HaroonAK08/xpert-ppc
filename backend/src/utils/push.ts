import { PushToken } from '../models/PushToken';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CHUNK_SIZE = 100;

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

type ExpoTicket = {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error?: string };
};

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Sends push notifications and prunes tokens Expo reports as dead (uninstalled/unregistered). */
async function sendExpoPush(tokens: string[], notification: { title: string; body: string; data?: Record<string, unknown> }): Promise<void> {
  const unique = Array.from(new Set(tokens)).filter(Boolean);
  if (unique.length === 0) return;

  const invalidTokens: string[] = [];

  for (const batch of chunk(unique, CHUNK_SIZE)) {
    const messages: PushMessage[] = batch.map((to) => ({
      to,
      title: notification.title,
      body: notification.body,
      data: notification.data,
    }));

    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const json = (await res.json()) as { data?: ExpoTicket[] };
      const tickets = json.data ?? [];
      tickets.forEach((ticket, i) => {
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(batch[i]);
        }
      });
    } catch (err) {
      console.error('[push] Expo push request failed:', err);
    }
  }

  if (invalidTokens.length > 0) {
    await PushToken.deleteMany({ token: { $in: invalidTokens } }).catch(() => {});
  }
}

/** Notifies every registered mobile device that a new lead has arrived. */
export async function notifyNewLead(lead: {
  name?: string;
  businessName?: string;
  company?: string;
  source?: string;
  platform?: string;
  _id: { toString(): string };
}): Promise<void> {
  try {
    const tokens = await PushToken.find().distinct('token');
    if (tokens.length === 0) return;

    const business = lead.businessName || lead.company;
    const body = business ? `${lead.name} · ${business}` : lead.name || 'Check the CRM for details';

    await sendExpoPush(tokens, {
      title: 'New lead',
      body: String(body),
      data: { type: 'new_lead', leadId: String(lead._id) },
    });
  } catch (err) {
    console.error('[push] Failed to notify new lead:', err);
  }
}

/** Notifies devices about leads created during a Google Sheets sync (one summary push, not one per row). */
export async function notifyLeadsSynced(createdCount: number): Promise<void> {
  if (createdCount <= 0) return;
  try {
    const tokens = await PushToken.find().distinct('token');
    if (tokens.length === 0) return;

    await sendExpoPush(tokens, {
      title: 'New leads synced',
      body: `${createdCount} new lead${createdCount === 1 ? '' : 's'} imported from Google Sheets`,
      data: { type: 'leads_synced' },
    });
  } catch (err) {
    console.error('[push] Failed to notify synced leads:', err);
  }
}
