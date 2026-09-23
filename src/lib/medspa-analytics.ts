/**
 * Dynasty Works Studio — MedSpa Growth Engine™ Analytics Dispatcher
 *
 * Lightweight, zero-dependency analytics instrumentation.
 * Dispatches standard CustomEvents on window, mirrors to window.dataLayer if present,
 * and maintains an in-memory event registry for inspection and testing.
 */

export type MedSpaAnalyticsEvent =
  | 'medspa_page_view'
  | 'medspa_primary_cta_click'
  | 'medspa_form_start'
  | 'medspa_form_submit'
  | 'medspa_form_success'
  | 'medspa_booking_click';

export interface MedSpaEventPayload {
  eventName: MedSpaAnalyticsEvent;
  timestamp: string;
  source?: string;
  section?: string;
  treatment?: string;
  budget?: string;
  meta?: Record<string, unknown>;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __MEDSPA_ANALYTICS_EVENTS__?: MedSpaEventPayload[];
  }
}

export function trackMedspaEvent(
  eventName: MedSpaAnalyticsEvent,
  meta?: Record<string, unknown>
): void {
  const payload: MedSpaEventPayload = {
    eventName,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  // 1. Maintain in-memory log for zero-friction verification
  if (typeof window !== 'undefined') {
    if (!window.__MEDSPA_ANALYTICS_EVENTS__) {
      window.__MEDSPA_ANALYTICS_EVENTS__ = [];
    }
    window.__MEDSPA_ANALYTICS_EVENTS__.push(payload);

    // 2. Dispatch custom event for extensible third-party listeners
    try {
      window.dispatchEvent(
        new CustomEvent('medspa_analytics', {
          detail: payload,
          bubbles: true,
        })
      );
    } catch (_err) {
      // Defensive fallback for non-DOM/legacy contexts
    }

    // 3. Forward to GTM / dataLayer if available without hard-coding SDKs
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...payload,
      });
    }

    // 4. Subtle developer telemetry in development mode
    if (import.meta.env.DEV) {
      console.log(`[MedSpa Analytics] 📊 ${eventName}`, payload);
    }
  }
}
