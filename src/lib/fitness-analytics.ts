/**
 * Dynasty Works Studio — Fitness Growth Engine™ Analytics Dispatcher
 *
 * Lightweight, zero-dependency analytics instrumentation for Vertical #2.
 * Completely isolated from MedSpa analytics.
 * Dispatches standard CustomEvents on window, mirrors to window.dataLayer if present,
 * and maintains an in-memory event registry for inspection and testing.
 */

export type FitnessAnalyticsEvent =
  | 'fitness_page_view'
  | 'fitness_primary_cta_click'
  | 'fitness_form_start'
  | 'fitness_form_submit'
  | 'fitness_form_success'
  | 'fitness_booking_click';

export interface FitnessEventPayload {
  eventName: FitnessAnalyticsEvent;
  timestamp: string;
  source?: string;
  section?: string;
  fitnessType?: string;
  offer?: string;
  budget?: string;
  meta?: Record<string, unknown>;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __FITNESS_ANALYTICS_EVENTS__?: FitnessEventPayload[];
  }
}

export function trackFitnessEvent(
  eventName: FitnessAnalyticsEvent,
  meta?: Record<string, unknown>
): void {
  const payload: FitnessEventPayload = {
    eventName,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  // 1. Maintain in-memory log for zero-friction verification
  if (typeof window !== 'undefined') {
    if (!window.__FITNESS_ANALYTICS_EVENTS__) {
      window.__FITNESS_ANALYTICS_EVENTS__ = [];
    }
    window.__FITNESS_ANALYTICS_EVENTS__.push(payload);

    // 2. Dispatch custom event for third-party listeners
    try {
      window.dispatchEvent(
        new CustomEvent('fitness_analytics', {
          detail: payload,
          bubbles: true,
        })
      );
    } catch (_err) {
      // Defensive fallback for legacy / non-standard DOM environments
    }

    // 3. Forward to GTM / dataLayer if available without hard-coded SDKs
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...payload,
      });
    }

    // 4. Subtle developer telemetry in development mode
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
      console.log(`[Fitness Analytics] ⚡ ${eventName}`, payload);
    }
  }
}
