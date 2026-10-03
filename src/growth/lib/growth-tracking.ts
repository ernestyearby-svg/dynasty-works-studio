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
  fbclid: string;
  gclid: string;
  landing_page: string;
  referrer: string;
  initial_referrer: string;
  first_touch_url: string;
  campaign_id: string;
  creative_id: string;
  captured_at: string;
}

export type GrowthEventType =
  // Canonical Funnel Events
  | 'growth_review_view'
  | 'growth_review_started'
  | 'growth_review_completed'
  | 'booking_page_view'
  | 'appointment_booked'
  // Preserved Funnel & Interaction Events
  | 'growth_page_view'
  | 'growth_engine_landing_view'
  | 'growth_cta_click'
  | 'growth_form_start'
  | 'growth_form_submit'
  | 'growth_form_success'
  | 'growth_booking_view'
  | 'growth_booking_click'
  | 'growth_booking_complete'
  | 'growth_thank_you_view';

export interface GrowthEventPayload {
  event: GrowthEventType;
  page?: string;
  cta_label?: string;
  cta_destination?: string;
  step?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  event_id?: string;
}

/**
 * Generates a unique collision-resistant event ID for Meta Conversions API (CAPI) deduplication.
 * Format: dws_{prefix}_{timestamp}_{random}
 */
export function generateEventId(prefix: 'lead' | 'sched' | 'event' = 'event'): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 10);
  return `dws_${prefix}_${ts}_${rand}`;
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
      fbclid: '',
      gclid: '',
      landing_page: `${PRODUCTION_DOMAIN}/growth`,
      referrer: '',
      initial_referrer: '',
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
  const fbclid = searchParams.get('fbclid') || stored.fbclid || '';
  const gclid = searchParams.get('gclid') || stored.gclid || '';
  const campaign_id = searchParams.get('campaign_id') || searchParams.get('cid') || stored.campaign_id || '';
  const creative_id = searchParams.get('creative_id') || searchParams.get('crid') || stored.creative_id || '';

  const landing_page = stored.landing_page || currentUrl;
  const first_touch_url = stored.first_touch_url || currentUrl;
  const referrer = stored.referrer || currentReferrer;
  const initial_referrer = stored.initial_referrer || stored.referrer || currentReferrer;
  const captured_at = stored.captured_at || new Date().toISOString();

  const attribution: GrowthAttributionData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    fbclid,
    gclid,
    landing_page,
    referrer,
    initial_referrer,
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

// In-memory deduplication registries to guarantee idempotency per page session
const firedMetaEvents = new Set<string>();
const firedGa4Conversions = new Set<string>();

/**
 * For testing environments: resets deduplication sets.
 */
export function _resetTrackingDedupForTesting(): void {
  firedMetaEvents.clear();
  firedGa4Conversions.clear();
}

/**
 * Strips Personally Identifiable Information (PII) before forwarding events to Google Analytics.
 * Strictly adheres to Google Analytics terms by ensuring no names, email addresses, or phone numbers are transmitted.
 */
function sanitizePayloadForGA4(payload: GrowthEventPayload): Record<string, unknown> {
  const PII_KEYS = new Set([
    'name', 'first_name', 'last_name', 'firstname', 'lastname', 'full_name',
    'email', 'user_email', 'customer_email',
    'phone', 'telephone', 'mobile', 'cell', 'cellphone',
    'address', 'ssn', 'tax_id', 'contact_name', 'business_phone'
  ]);

  const cleanMetadata: Record<string, unknown> = {};
  if (payload.metadata && typeof payload.metadata === 'object') {
    for (const [key, value] of Object.entries(payload.metadata)) {
      if (!PII_KEYS.has(key.toLowerCase()) && typeof value !== 'function') {
        cleanMetadata[key] = value;
      }
    }
  }

  const cleanPayload: Record<string, unknown> = {
    event_category: 'Growth Funnel',
    canonical_event: payload.event,
    page: payload.page,
    step: payload.step,
    cta_label: payload.cta_label,
    cta_destination: payload.cta_destination,
    timestamp: payload.timestamp,
    event_id: payload.event_id,
    ...(Object.keys(cleanMetadata).length > 0 ? { metadata: cleanMetadata } : {}),
  };

  // Attach non-PII marketing attribution if present
  try {
    const rawAttribution = typeof window !== 'undefined' ? (sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)) : null;
    if (rawAttribution) {
      const parsed = JSON.parse(rawAttribution);
      if (parsed.utm_source) cleanPayload.utm_source = parsed.utm_source;
      if (parsed.utm_medium) cleanPayload.utm_medium = parsed.utm_medium;
      if (parsed.utm_campaign) cleanPayload.utm_campaign = parsed.utm_campaign;
      if (parsed.utm_content) cleanPayload.utm_content = parsed.utm_content;
      if (parsed.utm_term) cleanPayload.utm_term = parsed.utm_term;
      if (parsed.landing_page) cleanPayload.landing_page = parsed.landing_page;
    }
  } catch {
    // ignore
  }

  // Remove undefined keys
  for (const k of Object.keys(cleanPayload)) {
    if (cleanPayload[k] === undefined) {
      delete cleanPayload[k];
    }
  }

  return cleanPayload;
}

/**
 * Dispatches a growth tracking event to the browser window and external handlers.
 */
export function trackGrowthEvent(
  event: GrowthEventType,
  payload: Omit<GrowthEventPayload, 'event'> = {}
): void {
  // Preserve or generate unique event_id for conversion deduplication (Lead, Schedule)
  const incomingEventId =
    payload.event_id ||
    (payload.metadata?.event_id as string) ||
    undefined;

  let eventId = incomingEventId;
  if (!eventId) {
    if (event === 'growth_review_completed') {
      eventId = generateEventId('lead');
    } else if (event === 'appointment_booked') {
      eventId = generateEventId('sched');
    }
  }

  const fullPayload: GrowthEventPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...(eventId ? { event_id: eventId } : {}),
    ...payload,
  };

  if (eventId && fullPayload.metadata) {
    fullPayload.metadata.event_id = eventId;
  }

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

    // Expose on window for runtime observability and verification
    (window as unknown as { trackGrowthEvent?: typeof trackGrowthEvent }).trackGrowthEvent = trackGrowthEvent;

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

    // 3. Meta Pixel standard conversion events
    if (typeof win.fbq === 'function') {
      if (event === 'growth_engine_landing_view') {
        // Fire ViewContent once per page view for /growth-engine
        if (!firedMetaEvents.has('ViewContent')) {
          firedMetaEvents.add('ViewContent');
          win.fbq('track', 'ViewContent', {
            content_name: 'Growth Engine Landing Page',
            content_category: 'Growth Operating System',
          });
        }
      } else if (event === 'growth_review_completed') {
        // Fire Lead once upon verified submission completion with unique eventID for CAPI dedup
        const leadDedupKey = `Lead_${eventId || 'default'}`;
        if (!firedMetaEvents.has('Lead') && !firedMetaEvents.has(leadDedupKey)) {
          firedMetaEvents.add('Lead');
          firedMetaEvents.add(leadDedupKey);
          win.fbq(
            'track',
            'Lead',
            {
              content_name: 'Growth Operating System Review',
              content_category: 'Growth Operating System',
            },
            eventId ? { eventID: eventId } : undefined
          );
        }
      } else if (event === 'appointment_booked') {
        // Fire Schedule once upon confirmed booking with unique eventID for CAPI dedup
        const schedDedupKey = `Schedule_${eventId || 'default'}`;
        if (!firedMetaEvents.has('Schedule') && !firedMetaEvents.has(schedDedupKey)) {
          firedMetaEvents.add('Schedule');
          firedMetaEvents.add(schedDedupKey);
          win.fbq(
            'track',
            'Schedule',
            {
              content_name: 'Growth Architecture Session',
              content_category: 'Growth Operating System',
            },
            eventId ? { eventID: eventId } : undefined
          );
        }
      }
      // Note: Standard PageView is dispatched globally on page load by the base Meta Pixel snippet.
      // We intentionally do not duplicate PageView here.
      // We do not fire Lead on start, validation, or failed submission.
      // We do not fire Schedule merely on viewing /growth/book.
      // Zero raw PII is transmitted in browser event parameters.
    }

    // 4. Google Analytics gtag forwarding
    if (typeof win.gtag === 'function') {
      if (event === 'growth_page_view') {
        // Standard page_view is handled natively by GA4 config. Do not send duplicate page_view.
      } else {
        const ga4Data = sanitizePayloadForGA4(fullPayload);
        if (event === 'growth_review_completed') {
          if (!firedGa4Conversions.has('generate_lead')) {
            firedGa4Conversions.add('generate_lead');
            win.gtag('event', 'generate_lead', ga4Data);
          }
        } else if (event === 'growth_form_success') {
          if (!firedGa4Conversions.has('generate_lead')) {
            firedGa4Conversions.add('generate_lead');
            win.gtag('event', 'generate_lead', ga4Data);
          } else {
            win.gtag('event', 'growth_form_success', ga4Data);
          }
        } else if (event === 'appointment_booked') {
          if (!firedGa4Conversions.has('schedule')) {
            firedGa4Conversions.add('schedule');
            win.gtag('event', 'schedule', ga4Data);
          }
        } else if (event === 'growth_booking_complete') {
          if (!firedGa4Conversions.has('schedule')) {
            firedGa4Conversions.add('schedule');
            win.gtag('event', 'schedule', ga4Data);
          } else {
            win.gtag('event', 'growth_booking_complete', ga4Data);
          }
        } else {
          win.gtag('event', event, ga4Data);
        }
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Development console audit
    console.info(`[DWS Growth Event] ${event}`, fullPayload);
  }
}
