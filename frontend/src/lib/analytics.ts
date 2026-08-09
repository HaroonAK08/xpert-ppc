type LeadTrackPayload = {
  source: string;
  platform?: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLeadConversion(payload: LeadTrackPayload) {
  if (typeof window === 'undefined') return;

  const source = payload.source || 'unknown';
  const platform = payload.platform || '';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    lead_source: source,
    lead_platform: platform,
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: source,
      content_category: platform || undefined,
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      method: source,
      platform: platform || undefined,
    });
  }
}
