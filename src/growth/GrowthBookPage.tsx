import React, { useEffect, useState, useRef } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';
import {
  getBookingProspect,
  buildCalendarEmbedUrl,
  HIGHLEVEL_CALENDAR_ID,
  HIGHLEVEL_CALENDAR_BASE_URL,
  HIGHLEVEL_SCRIPT_SRC,
  type BookingProspectData,
} from './lib/growth-integration-adapter';

const TRUSTED_WIDGET_ORIGINS = [
  'https://api.leadconnectorhq.com',
  'https://link.msgsndr.com',
  'https://services.leadconnectorhq.com',
];

export default function GrowthBookPage() {
  useGrowthSeo({
    title: 'Schedule Your Growth System Mapping | Dynasty Works Studio',
    description:
      'Book a 1-on-1 strategy call with Dynasty Works Studio to map your acquisition, CRM, and automated sales infrastructure.',
    canonicalPath: '/growth/book',
  });

  const [prospect, setProspect] = useState<BookingProspectData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    initGrowthTracking();
    const data = getBookingProspect();
    setProspect(data);
    trackGrowthEvent('growth_booking_view', { page: '/growth/book' });

    // Safely load HighLevel form_embed.js singleton
    if (typeof document !== 'undefined') {
      const existingScript = document.querySelector(`script[src="${HIGHLEVEL_SCRIPT_SRC}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'msgsndr-form-embed-script';
        script.src = HIGHLEVEL_SCRIPT_SRC;
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    // Listen for HighLevel booking completion postMessage events
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // 1. Validate trusted origin
      if (!TRUSTED_WIDGET_ORIGINS.includes(event.origin)) {
        return;
      }

      // 2. Validate that the message originated from the embedded calendar iframe
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const isBookingComplete =
        (Array.isArray(event.data) && event.data[0] === 'msgsndr-booking-complete') ||
        (typeof event.data === 'string' && event.data.includes('msgsndr-booking-complete'));

      if (isBookingComplete) {
        // 3. Verify calendar ID if present in payload
        if (Array.isArray(event.data) && event.data[1]?.calendarId) {
          if (event.data[1].calendarId !== HIGHLEVEL_CALENDAR_ID) {
            return;
          }
        }

        trackGrowthEvent('growth_booking_complete', { page: '/growth/book' });
        window.location.href = '/growth/thank-you/';
      }
    };
    window.addEventListener('message', handleMessage);

    // Fallback safeguard: intercept top navigation attempting to escape to production thank-you
    let removeNavListener: (() => void) | undefined;
    if (typeof window !== 'undefined' && 'navigation' in window) {
      const handleNavigate = (e: any) => {
        try {
          const dest = new URL(e.destination.url);
          if (dest.pathname.replace(/\/$/, '') === '/growth/thank-you' && dest.origin !== window.location.origin) {
            e.preventDefault();
            window.location.href = `${window.location.origin}/growth/thank-you/${dest.search}`;
          }
        } catch {}
      };
      (window as any).navigation.addEventListener('navigate', handleNavigate);
      removeNavListener = () => (window as any).navigation.removeEventListener('navigate', handleNavigate);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (removeNavListener) removeNavListener();
    };
  }, []);

  const hasPrefill = Boolean(prospect.email || prospect.firstName);
  const calendarEmbedUrl = buildCalendarEmbedUrl(HIGHLEVEL_CALENDAR_BASE_URL, prospect);
  const iframeElementId = 'tEz9m9Ij933G8wMJhdGs_1790525045901';

  return (
    <div className="growth-root growth-theme-dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GrowthNav currentPath="/growth/book" isStandaloneApply={true} />

      <main id="main-content" style={{ flex: 1, padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '860px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              STEP 02 OF 02 · ARCHITECTURE SESSION
            </span>
            <h1 className="growth-lead-title" style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Let’s map your<br />
              <em>growth system.</em>
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 24px' }}>
              Select a dedicated time slot for your 30-minute growth infrastructure diagnostic. We will audit
              your existing channels, uncover conversion leaks, and blueprint an operating system.
            </p>
          </div>

          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            {/* Live HighLevel Calendar Container */}
            <div className="growth-calendar-wrap">
              {/* Header Status Bar */}
              <div className="growth-calendar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--dws-signal)',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                    }}
                  >
                    DWS STRATEGY CALL · 30-MIN ARCHITECTURE SESSION
                  </span>
                </div>

                {hasPrefill && (
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#00e5a3',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: 'rgba(0, 229, 163, 0.08)',
                      border: '1px solid rgba(0, 229, 163, 0.25)',
                      borderRadius: '2px',
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00e5a3' }} />
                    DIAGNOSTIC DATA CONNECTED
                  </div>
                )}
              </div>

              {/* Sensible Loading State while External Widget Connects */}
              {!isIframeLoaded && (
                <div className="growth-calendar-loading" aria-live="polite">
                  <div className="growth-calendar-spinner" />
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.12em',
                      color: '#8d919d',
                      textTransform: 'uppercase',
                    }}
                  >
                    INITIALIZING SCHEDULING INTERFACE...
                  </span>
                </div>
              )}

              {/* Official HighLevel Responsive Iframe */}
              <iframe
                ref={iframeRef}
                src={calendarEmbedUrl}
                allow="payment"
                style={{
                  width: '100%',
                  border: 'none',
                  overflow: 'hidden',
                  minHeight: '720px',
                  display: 'block',
                  background: 'transparent',
                }}
                scrolling="no"
                id={iframeElementId}
                title="Dynasty Works Studio — Growth Strategy Call Calendar"
                onLoad={() => setIsIframeLoaded(true)}
              />
            </div>

            {/* Strategy Session Expectations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '40px' }}>
              <div style={{ padding: '24px', background: '#111417', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', display: 'block', marginBottom: '8px' }}>
                  SESSION OBJECTIVE 01
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px' }}>
                  Revenue Leak Audit
                </h3>
                <p style={{ fontSize: '13px', color: '#888b97', margin: 0, lineHeight: '1.6' }}>
                  We inspect where qualified leads are stalling or failing to convert into booked appointments.
                </p>
              </div>

              <div style={{ padding: '24px', background: '#111417', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', display: 'block', marginBottom: '8px' }}>
                  SESSION OBJECTIVE 02
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px' }}>
                  Architecture Blueprint
                </h3>
                <p style={{ fontSize: '13px', color: '#888b97', margin: 0, lineHeight: '1.6' }}>
                  We map the recommended CRM pipeline, automated follow-up triggers, and attribution models.
                </p>
              </div>

              <div style={{ padding: '24px', background: '#111417', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', display: 'block', marginBottom: '8px' }}>
                  SESSION OBJECTIVE 03
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px' }}>
                  Implementation Scope
                </h3>
                <p style={{ fontSize: '13px', color: '#888b97', margin: 0, lineHeight: '1.6' }}>
                  We review deployment timelines, required software connections, and system activation milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GrowthFooter />
    </div>
  );
}
