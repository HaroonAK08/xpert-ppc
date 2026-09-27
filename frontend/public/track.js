/**
 * Xpert PPC website visitor tracking (first-party, CRM-side).
 *
 * Usage:
 *   <script src="https://xpertppc.com/track.js" data-api="https://api.xpertppc.com" async></script>
 *
 * `data-api` is the backend's own origin (the tracking endpoint is CORS-open,
 * so this works from any site, not just xpertppc.com). Assigns an anonymous
 * visitor id in localStorage and records this page view against it. If that
 * same browser later submits a lead form on this site, `lead-form.tsx` reads
 * the same id and sends it along — stitching this visitor's history to the
 * lead once they're identified (see backend/src/routes/leads.ts).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'xppc_visitor_id';
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var apiOrigin = currentScript.getAttribute('data-api');
  if (!apiOrigin) return; // nothing to send to — silently no-op rather than guess a wrong host

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    try {
      var existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) return existing;
      var id = uuid();
      window.localStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch (e) {
      return null; // localStorage blocked (private mode, cookie settings) — skip tracking silently
    }
  }

  function parseUtm() {
    var params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      term: params.get('utm_term') || '',
      content: params.get('utm_content') || '',
    };
  }

  var visitorId = getVisitorId();
  if (!visitorId) return;

  var payload = JSON.stringify({
    visitorId: visitorId,
    url: window.location.href,
    referrer: document.referrer || '',
    utm: parseUtm(),
  });

  var endpoint = apiOrigin.replace(/\/$/, '') + '/api/track';
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
  } else {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(function () {});
  }
})();
