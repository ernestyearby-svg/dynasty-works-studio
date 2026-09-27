import React, { useEffect } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthBookPage() {
  useGrowthSeo({
    title: 'Schedule Your Growth System Mapping | Dynasty Works Studio',
    description:
      'Book a 1-on-1 strategy call with Dynasty Works Studio to map your acquisition, CRM, and automated sales infrastructure.',
    canonicalPath: '/growth/book',
  });

  useEffect(() => {
    initGrowthTracking();
    trackGrowthEvent('growth_booking_view', { page: '/growth/book' });
  }, []);

  const handlePlaceholderInteraction = () => {
    trackGrowthEvent('growth_booking_click', {
      page: '/growth/book',
      metadata: { action: 'placeholder_click' },
    });
  };

  return (
    <div className="growth-root">
      <GrowthNav currentPath="/growth/book" isStandaloneApply={true} />

      <main id="main-content" style={{ padding: '60px 0 100px' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '860px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              STEP 02 OF 02 · ARCHITECTURE SESSION
            </span>
            <h1 className="growth-h1" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)' }}>
              Let’s Map Your Growth System.
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 20px' }}>
              Select a dedicated time slot for your 30-minute growth infrastructure diagnostic. We will review
              your current marketing channels, audit conversion drop-offs, and blueprint a connected system.
            </p>
          </div>

          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            {/* Calendar Container with Reserved GoHighLevel Embed Area */}
            <div
              className="growth-card"
              style={{
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '48px 24px',
                border: '1px dashed rgba(212, 180, 131, 0.4)',
                background: 'rgba(15, 15, 15, 0.8)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 180, 131, 0.1)',
                  border: '1px solid var(--dws-champagne)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--dws-champagne)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {/* Exact designated development placeholder */}
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: 'var(--dws-champagne)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  padding: '6px 14px',
                  background: 'rgba(212, 180, 131, 0.12)',
                  borderRadius: 'var(--dws-radius-sm)',
                  border: '1px solid rgba(212, 180, 131, 0.3)',
                }}
              >
                CALENDAR INTEGRATION PLACEHOLDER
              </div>

              <h2 className="growth-h3" style={{ fontSize: '20px', maxWidth: '520px', margin: '0 auto 12px' }}>
                GoHighLevel Calendar Integration Ready
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--dws-text-muted)', maxWidth: '540px', lineHeight: '1.6', margin: '0 auto 24px' }}>
                This container is wired for the direct HighLevel or custom booking iframe.
                No simulated appointment slots are displayed until the active calendar webhook is connected.
              </p>

              <button
                type="button"
                className="growth-btn growth-btn-secondary"
                onClick={handlePlaceholderInteraction}
                style={{ fontSize: '12px' }}
              >
                TEST CALENDAR DISPATCH EVENT
              </button>
            </div>

            {/* Strategy Session Expectations */}
            <div className="growth-grid-3" style={{ marginTop: '36px' }}>
              <div className="growth-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-champagne)', marginBottom: '6px' }}>
                  SESSION OBJECTIVE 01
                </div>
                <h3 className="growth-h3" style={{ fontSize: '15px', marginBottom: '8px' }}>
                  Leak Identification
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', margin: 0 }}>
                  We pinpoint exactly where qualified leads are stalling or failing to convert into booked appointments.
                </p>
              </div>

              <div className="growth-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-champagne)', marginBottom: '6px' }}>
                  SESSION OBJECTIVE 02
                </div>
                <h3 className="growth-h3" style={{ fontSize: '15px', marginBottom: '8px' }}>
                  Architecture Blueprint
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', margin: 0 }}>
                  We map the recommended CRM pipeline, automated follow-up triggers, and attribution models for your business.
                </p>
              </div>

              <div className="growth-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-champagne)', marginBottom: '6px' }}>
                  SESSION OBJECTIVE 03
                </div>
                <h3 className="growth-h3" style={{ fontSize: '15px', marginBottom: '8px' }}>
                  Implementation Scope
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', margin: 0 }}>
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
