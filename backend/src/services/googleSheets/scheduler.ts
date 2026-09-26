import { env } from '../../config/env';
import { GoogleSheetConnection } from '../../models/GoogleSheetConnection';
import { isGoogleConfigured, runTwoWaySync } from './sheetsService';

let running = false;

/**
 * Pulls every connected Google Sheet into the CRM on a timer, so leads show
 * up without anyone needing to open the app and tap "Sync now". Runs
 * connections one at a time (not in parallel) to stay well under Google
 * Sheets API rate limits regardless of how many clients are connected.
 */
async function runAllScheduledSyncs() {
  if (running) return; // previous cycle still going — skip this tick
  running = true;
  try {
    const connections = await GoogleSheetConnection.find({ connected: true }).select('_id');
    for (const { _id } of connections) {
      try {
        await runTwoWaySync(String(_id));
      } catch (err) {
        console.error('[sheets] scheduled sync failed for', String(_id), err);
      }
    }
  } catch (err) {
    console.error('[sheets] scheduled sync cycle failed:', err);
  } finally {
    running = false;
  }
}

export function startSheetSyncScheduler(): void {
  if (!isGoogleConfigured() || env.sheetSyncIntervalMs <= 0) {
    console.log('[sheets] scheduled sync disabled');
    return;
  }
  console.log(`[sheets] scheduled sync every ${Math.round(env.sheetSyncIntervalMs / 1000)}s`);
  setInterval(() => void runAllScheduledSyncs(), env.sheetSyncIntervalMs).unref();
}
