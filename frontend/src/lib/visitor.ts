/** Same key track.js assigns — links a submission to that visitor's page-view history, if any. */
export function getVisitorId(): string {
  try {
    return window.localStorage.getItem('xppc_visitor_id') || '';
  } catch {
    return '';
  }
}
