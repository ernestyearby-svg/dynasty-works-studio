import React from 'react';

const traditionalSteps = [
  'Traffic (Untargeted Clicks)',
  'Generic Website (High Bounce)',
  'Static Form (Unattended Inbox)',
  '??? Unknown Outcome (Lost Revenue)',
];

const dynastySteps = [
  'Traffic (Intent-Targeted Paid Media)',
  'Conversion (Sub-Second Offer Experience)',
  'Tracked Lead (Deterministic Attribution)',
  'CRM Ingestion (Instant Deduplication)',
  'Automated Follow-Up (Sub-60s SMS)',
  'Appointment (Confirmed Calendar Slot)',
  'Customer Conversion (Stripe / POS Sync)',
  'Measured Revenue (Executive Closed-Loop ROI)',
];

export const DifferenceComparison: React.FC = () => {
  return (
    <section id="comparison" className="growth-section-editorial growth-theme-dark" aria-labelledby="comparison-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">STRUCTURAL DIVERGENCE</span>
          <h2 id="comparison-heading" className="growth-lead-title">
            Your website shouldn’t sit<br />
            <em>outside your sales system.</em>
          </h2>
          <p className="growth-sub">
            The visual difference between an isolated digital brochure and an integrated revenue engine
            is immediately evident in the continuity of its pathways.
          </p>
        </div>

        <div className="growth-comparison-spread">
          {/* Left Column: Traditional Website (Broken Disconnected Pathways) */}
          <div className="growth-comp-column traditional">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8c8f99', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                STATUS QUO
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#d94343' }}>
                ✕ DISCONNECTED
              </span>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#8c8f99', margin: '0 0 12px' }}>
              Traditional Website
            </h3>
            <p style={{ fontSize: '14px', color: '#686b76', margin: '0 0 32px', lineHeight: '1.6' }}>
              Isolated components operating with zero data feedback loops, dumping leads into silent inboxes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {traditionalSteps.map((step, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      padding: '14px 18px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      color: idx === traditionalSteps.length - 1 ? '#d94343' : '#8c8f99',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {step}
                  </div>
                  {idx < traditionalSteps.length - 1 && (
                    <div style={{ textAlign: 'center', color: '#555862', fontSize: '12px', padding: '4px 0' }}>
                      ╎ (broken handoff)
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', fontSize: '12px', fontFamily: 'monospace', color: '#d94343' }}>
              OUTCOME: Blind Ad Spend · Delayed Follow-Up · Lost Revenue
            </div>
          </div>

          {/* Right Column: Dynasty Growth System (One Continuous Cobalt Pathway) */}
          <div className="growth-comp-column dynasty">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                DYNASTY ARCHITECTURE
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4ade80' }}>
                ● SYNCHRONIZED
              </span>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', margin: '0 0 12px' }}>
              Dynasty Growth Operating System
            </h3>
            <p style={{ fontSize: '14px', color: '#b2b5c0', margin: '0 0 32px', lineHeight: '1.6' }}>
              One continuous, automated infrastructure linking paid media to pipeline progression and closed revenue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dynastySteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 18px',
                    background: 'rgba(36, 87, 255, 0.08)',
                    borderLeft: '3px solid var(--dws-signal)',
                    borderTop: '1px solid rgba(36, 87, 255, 0.15)',
                    borderRight: '1px solid rgba(36, 87, 255, 0.15)',
                    borderBottom: '1px solid rgba(36, 87, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{step}</span>
                  <span style={{ color: 'var(--dws-signal)', fontSize: '10px' }}>↓</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(36, 87, 255, 0.3)', fontSize: '12px', fontFamily: 'monospace', color: 'var(--dws-signal)', fontWeight: 700 }}>
              OUTCOME: Sub-Minute Follow-Up · Automated Booking · Measured ROI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
