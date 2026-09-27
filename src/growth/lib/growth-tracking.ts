/**
 * Dynasty Works Studio — Growth Operating System
 * Tracking & Attribution Engine
 * 
 * Captures, normalizes, and safely persists marketing attribution parameters
 * (UTMs, first-touch URL, landing page, referrer, campaign/creative identifiers)
 * and provides a unified event tracking bus for Meta Pixel, Google Ads,
 * Google Analytics, GHL, and n8n webhooks.
 *
 * CANONICAL DOMAIN RULE: Never expose development/preview URLs.
 */

export interface GrowthAttributionData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page: string;
  referrer: string;
  first_touch_url: string;
  campaign_id: string;
  creative_id: string;
  captured_at: string;
}

export type GrowthEventType =
  | 'growth_page_view'
  | 'growth_cta_click'
  | 'growth_form_start'
  | 'growth_form_submit'
  | 'growth_form_success'
  | 'growth_booking_view'
  | 'growth_booking_click'
  | 'growth_thank_you_view';

export interface GrowthEventPayload {
  event: GrowthEventType;
  page?: string;
  cta_label?: string;
  cta_destination?: string;
  step?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

const STORAGE_KEY = 'dws_growth_attribution_v1';
const PRODUCTION_DOMAIN = 'https://dynastyworksstudio.com';

/**
 * Sanitizes URLs to strictly follow the Production Domain Lock
 * Strips localhost, temporary previews, or unwanted query params if needed.
 */
export function sanitizeAttributionUrl(rawUrl: string): string {
  if (!rawUrl) return PRODUCTION_DOMAIN + '/growth';
  try {
    const parsed = new URL(rawUrl, PRODUCTION_DOMAIN);
    // If the hostname is local or preview, map to official production domain
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.includes('github.io') ||
      parsed.hostname.includes('netlify.app')
    ) {
      return `${PRODUCTION_DOMAIN}${parsed.pathname}${parsed.search}`;
    }
    return parsed.toString();
  } catch {
    return PRODUCTION_DOMAIN + '/growth';
  }
}

/**
 * Captures attribution parameters from window.location and document.referrer.
 * Preserves first-touch data in sessionStorage and localStorage.
 */
export function initGrowthTracking(): GrowthAttributionData {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      landing_page: `${PRODUCTION_DOMAIN}/growth`,
      referrer: '',
      first_touch_url: `${PRODUCTION_DOMAIN}/growth`,
      campaign_id: '',
      creative_id: '',
      captured_at: new Date().toISOString(),
    };
  }

  // Check existing stored attribution
  let stored: Partial<GrowthAttributionData> = {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[DWS Growth Tracking] Could not read stored attribution:', err);
  }

  const searchParams = new URLSearchParams(window.location.search);
  const currentUrl = sanitizeAttributionUrl(window.location.href);
  const currentReferrer = document.referrer ? sanitizeAttributionUrl(document.referrer) : '';

  // Extract from query string or keep existing stored values
  const utm_source = searchParams.get('utm_source') || stored.utm_source || '';
  const utm_medium = searchParams.get('utm_medium') || stored.utm_medium || '';
  const utm_campaign = searchParams.get('utm_campaign') || stored.utm_campaign || '';
  const utm_content = searchParams.get('utm_content') || stored.utm_content || '';
  const utm_term = searchParams.get('utm_term') || stored.utm_term || '';
  const campaign_id = searchParams.get('campaign_id') || searchParams.get('cid') || stored.campaign_id || '';
  const creative_id = searchParams.get('creative_id') || searchParams.get('crid') || stored.creative_id || '';

  const landing_page = stored.landing_page || currentUrl;
  const first_touch_url = stored.first_touch_url || currentUrl;
  const referrer = stored.referrer || currentReferrer;
  const captured_at = stored.captured_at || new Date().toISOString();

  const attribution: GrowthAttributionData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    landing_page,
    referrer,
    first_touch_url,
    campaign_id,
    creative_id,
    captured_at,
  };

  try {
    const serialized = JSON.stringify(attribution);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[DWS Growth Tracking] Could not persist attribution:', err);
  }

  return attribution;
}

/**
 * Returns current attribution data from memory or storage.
 */
export function getGrowthAttribution(): GrowthAttributionData {
  return initGrowthTracking();
}

/**
 * Dispatches a growth tracking event to the browser window and external handlers.
 */
export function trackGrowthEvent(
  event: GrowthEventType,
  payload: Omit<GrowthEventPayload, 'event'> = {}
): void {
  const fullPayload: GrowthEventPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // 1. Dispatch custom DOM event
  if (typeof window !== 'undefined') {
    try {
      const customEvent = new CustomEvent('growth_event', {
        detail: fullPayload,
      });
      window.dispatchEvent(customEvent);
    } catch {
      // ignore
    }

    // 2. Google Tag Manager / dataLayer forwarding if initialized
    const win = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      fbq?: (...args: unknown[]) => void;
      gtag?: (...args: unknown[]) => void;
    };

    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: fullPayload.event,
        growth_event_data: fullPayload,
      });
    }

    // 3. Meta Pixel standard / custom event forwarding
    if (typeof win.fbq === 'function') {
      if (event === 'growth_page_view') {
        win.fbq('track', 'PageView');
      } else if (event === 'growth_form_success') {
        win.fbq('track', 'Lead', {
          content_name: 'Dynasty Growth Operating System Review',
        });
      } else if (event === 'growth_booking_view' || event === 'growth_booking_click') {
        win.fbq('trackCustom', event, fullPayload);
      }
    }

    // 4. Google Analytics gtag forwarding
    if (typeof win.gtag === 'function') {
      win.gtag('event', event, {
        event_category: 'Growth Funnel',
        ...fullPayload,
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Development console audit
    console.info(`[DWS Growth Event] ${event}`, fullPayload);
  }
}
