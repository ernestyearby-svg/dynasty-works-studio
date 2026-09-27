import React from 'react';

const traditionalSteps = [
  { step: 'Traffic', detail: 'Purchased clicks or random visitors arriving from unsegmented channels' },
  { step: 'Website', detail: 'Generic brochure page with high bounce rates and no dynamic personalization' },
  { step: 'Form', detail: 'Unmonitored static form that dumps into an unattended inbox' },
  { step: '??? (Black Hole)', detail: 'Leads forgotten, zero automated follow-up, untracked attribution, zero ROI visibility' },
];

const dynastySteps = [
  { step: 'Traffic', detail: 'Targeted Meta & Google acquisition filtered by commercial intent' },
  { step: 'Conversion Page', detail: 'Sub-second edge-rendered page built specifically for the campaign offer' },
  { step: 'Tracked Lead', detail: 'Immediate attribution stamp capturing full UTM, campaign, and referrer parameters' },
  { step: 'CRM Ingestion', detail: 'Instant contact deduplication and pipeline assignment within 300ms' },
  { step: 'Automated Follow-Up', detail: 'Sub-60-second SMS and email response engaging the prospect while interest is peak' },
  { step: 'Appointment', detail: 'Direct calendar booking with automated confirmation and 2-way reminder sequences' },
  { step: 'Pipeline Velocity', detail: 'Structured opportunity tracking ensuring no lead stalls or vanishes' },
  { step: 'Customer Conversion', detail: 'Closed transaction synced with financial and merchant processors' },
  { step: 'Measured Revenue', detail: 'Closed-loop attribution reporting true ROAS and CAC back to leadership' },
];

export const DifferenceComparison: React.FC = () => {
  return (
    <section id="difference" className="growth-section" aria-labelledby="difference-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">STRUCTURAL COMPARISON</span>
          <h2 id="difference-heading" className="growth-h2">
            Your Website Shouldn’t Sit Outside Your Sales System.
          </h2>
          <p className="growth-sub">
            The traditional website is an isolated brochure. The Dynasty Growth Operating System is an active,
            connected revenue engine. Compare the fundamental structural difference:
          </p>
        </div>

        <div className="growth-grid-2" style={{ alignItems: 'stretch' }}>
          {/* Traditional Website Column */}
          <div
            className="growth-card"
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--dws-stone)',
                  marginBottom: '8px',
                }}
              >
                THE STATUS QUO
              </div>
              <h3 className="growth-h3" style={{ color: 'var(--dws-stone)' }}>
                Traditional Disconnected Website
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--dws-text-dim)', marginBottom: '24px' }}>
                Isolated components operating without data connection, creating massive revenue leakage at every handoff.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {traditionalSteps.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: 'var(--dws-radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: idx === traditionalSteps.length - 1 ? '#e05252' : 'var(--dws-stone)', fontWeight: 700 }}>
                        {idx + 1}. {item.step}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--dws-text-dim)', lineHeight: '1.4' }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '12px',
                color: '#e05252',
                fontFamily: 'monospace',
              }}
            >
              OUTCOME: Untracked Ad Spend · Missed Inquiries · Stalled Growth
            </div>
          </div>

          {/* Dynasty Growth System Column */}
          <div
            className="growth-card"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.9) 0%, rgba(14, 14, 14, 0.95) 100%)',
              borderColor: 'rgba(212, 180, 131, 0.4)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--dws-champagne)',
                  marginBottom: '8px',
                }}
              >
                THE ARCHITECTURE
              </div>
              <h3 className="growth-h3" style={{ color: 'var(--dws-bone)' }}>
                Dynasty Growth Operating System
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', marginBottom: '24px' }}>
                End-to-end synchronized infrastructure ensuring zero leads disappear between initial click and collected revenue.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dynastySteps.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(212, 180, 131, 0.04)',
                      border: '1px solid rgba(212, 180, 131, 0.15)',
                      borderRadius: 'var(--dws-radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--dws-champagne)', fontWeight: 700 }}>
                        {idx + 1}. {item.step}
                      </span>
                      <span style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>● CONNECTED</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--dws-text-muted)', lineHeight: '1.4' }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(212, 180, 131, 0.25)',
                fontSize: '12px',
                color: 'var(--dws-champagne)',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              OUTCOME: Sub-Minute Follow-Up · Automated Booking · Measured ROI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
