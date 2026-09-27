import React, { useEffect, useState } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';
import { getBookingProspect, type BookingProspectData } from './lib/growth-integration-adapter';

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

  useEffect(() => {
    initGrowthTracking();
    const data = getBookingProspect();
    setProspect(data);
    trackGrowthEvent('growth_booking_view', { page: '/growth/book' });
  }, []);

  const hasPrefill = Boolean(prospect.email || prospect.firstName);

  const handlePlaceholderInteraction = () => {
    trackGrowthEvent('growth_booking_click', {
      page: '/growth/book',
      metadata: { action: 'placeholder_click' },
    });
  };

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
            {/* Calendar Container with Designated GoHighLevel Embed Area */}
            <div
              style={{
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '48px 24px',
                border: '1px dashed rgba(36, 87, 255, 0.4)',
                background: '#111417',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(36, 87, 255, 0.1)',
                  border: '1px solid var(--dws-signal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'var(--dws-signal)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {/* Designated Development Placeholder */}
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: 'var(--dws-signal)',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  padding: '8px 18px',
                  background: 'rgba(36, 87, 255, 0.12)',
                  border: '1px solid rgba(36, 87, 255, 0.3)',
                }}
              >
                CALENDAR INTEGRATION PLACEHOLDER
              </div>

              {hasPrefill && (
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#00e5a3',
                    marginBottom: '16px',
                    padding: '6px 14px',
                    background: 'rgba(0, 229, 163, 0.08)',
                    border: '1px solid rgba(0, 229, 163, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5a3', display: 'inline-block' }} />
                  PROSPECT IDENTITY ATTACHED · READY FOR CALENDAR PREFILL
                </div>
              )}

              <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', maxWidth: '520px', margin: '0 auto 12px' }}>
                GoHighLevel Calendar Container
              </h2>
              <p style={{ fontSize: '14px', color: '#8d919d', maxWidth: '520px', lineHeight: '1.6', margin: '0 auto 28px' }}>
                This container is wired for the HighLevel or custom booking iframe.
                No artificial appointment slots are displayed until the live calendar webhook is connected.
              </p>

              <button
                type="button"
                className="growth-btn growth-btn-outline-dark"
                onClick={handlePlaceholderInteraction}
                style={{ fontSize: '11px', padding: '12px 24px', minHeight: '44px' }}
              >
                DISPATCH TELEMETRY TEST
              </button>
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
