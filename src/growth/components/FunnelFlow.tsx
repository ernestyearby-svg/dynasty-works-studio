import React, { useState } from 'react';

interface FlowMilestone {
  time: string;
  name: string;
  summary: string;
  action: string;
  telemetry: string;
  sla: string;
}

const milestones: FlowMilestone[] = [
  {
    time: 'T + 0.0s',
    name: 'AD CLICK',
    summary: 'Commercial intent captured via high-intent Meta or Google campaign.',
    action: 'Dynamic URL parameters appended and routed to edge infrastructure.',
    telemetry: 'UTM parameters, click ID, and campaign metadata locked in session memory.',
    sla: '< 150ms DNS & TLS Handshake',
  },
  {
    time: 'T + 0.4s',
    name: 'LANDING PAGE',
    summary: 'Prospect lands on a high-trust digital surface with zero layout shift.',
    action: 'First-touch attribution preserved; dynamic copy customized to campaign context.',
    telemetry: 'Device type, viewport, and referrer timestamp written to session storage.',
    sla: '0.4s Core Web Vitals LCP',
  },
  {
    time: 'T + 38s',
    name: 'LEAD CREATED',
    summary: 'Prospect submits structured diagnostic audit form.',
    action: 'Client honeypot validates authenticity; normalized JSON payload constructed.',
    telemetry: 'Sanitized contact details + full attribution envelope prepared.',
    sla: 'Instant Client Validation',
  },
  {
    time: 'T + 39s',
    name: 'CRM INGESTION',
    summary: 'Contact instantiated in CRM; duplicate check performed.',
    action: 'Opportunity profile initialized with audit history and assigned to pipeline.',
    telemetry: 'Unique CRM Contact ID + opportunity stage assigned in < 300ms.',
    sla: '< 300ms API Gateway Processing',
  },
  {
    time: 'T + 58s',
    name: 'FOLLOW-UP',
    summary: 'Automated 2-way conversational SMS delivered to prospect.',
    action: 'Personalized greeting with calendar booking link sent while interest is peak.',
    telemetry: 'Carrier delivery confirmation + outbound SMS event logged.',
    sla: '< 60 Seconds Automated SLA',
  },
  {
    time: 'T + 2h',
    name: 'APPOINTMENT',
    summary: 'Prospect selects strategy slot on integrated calendar.',
    action: 'Calendar invitation created; 2-way reminder protocol armed (24h, 2h, 15m).',
    telemetry: 'Confirmed appointment status synced across CRM & sales calendar.',
    sla: '94%+ Show-Rate Protocol',
  },
  {
    time: 'T + 48h',
    name: 'CUSTOMER',
    summary: 'Commercial agreement executed and initial payment completed.',
    action: 'Stripe / POS billing triggers automatic welcome sequence and client onboarding.',
    telemetry: 'Closed-Won deal value recorded against originating contact.',
    sla: 'Automated Financial Handshake',
  },
  {
    time: 'T + 49h',
    name: 'REVENUE ATTRIBUTION',
    summary: 'Closed transaction reported back to acquisition platforms.',
    action: 'Server-side CAPI event feeds ad algorithms with verified revenue data.',
    telemetry: 'Multi-touch ROAS calculated and displayed on executive dashboard.',
    sla: 'Continuous Algorithmic Optimization',
  },
];

export const FunnelFlow: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const current = milestones[activeIdx];

  return (
    <section id="live-flow" className="growth-section-editorial growth-theme-dark" aria-labelledby="flow-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">REVENUE IN MOTION</span>
          <h2 id="flow-heading" className="growth-lead-title">
            See what happens<br />
            <em>after someone clicks.</em>
          </h2>
          <p className="growth-sub">
            The difference between wasted media spend and compounding revenue is what happens in the minutes
            after an inquiry. Inspect the real-time operational journey:
          </p>
        </div>

        <div className="growth-flow-container">
          {/* Milestone Track Bar */}
          <div className="growth-flow-track" role="tablist" aria-label="Customer Journey Milestones">
            {milestones.map((m, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`growth-flow-node-button ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span
                    className="num"
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: isActive ? 'var(--dws-signal)' : '#5c606c',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {m.time}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isActive ? '#ffffff' : '#9ca0aa',
                    }}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Card */}
          <div className="growth-flow-stage-card" role="tabpanel">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--dws-signal)', fontWeight: 700 }}>
                  {current.time}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#686b76', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  STAGE 0{activeIdx + 1}/08
                </span>
              </div>

              <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 500, letterSpacing: '-0.04em', margin: '0 0 16px', color: '#ffffff' }}>
                {current.name}
              </h3>

              <p style={{ fontSize: '18px', color: '#b9bcc6', lineHeight: '1.6', margin: '0 0 20px', maxWidth: '44ch' }}>
                {current.summary}
              </p>

              <div style={{ borderLeft: '2px solid var(--dws-signal)', paddingLeft: '16px', marginTop: '16px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#7a7e8b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  AUTOMATED INFRASTRUCTURE ACTION:
                </span>
                <span style={{ fontSize: '14px', color: '#ece9e1', lineHeight: '1.5' }}>
                  {current.action}
                </span>
              </div>
            </div>

            {/* Telemetry Panel with Progressive Disclosure */}
            <div
              style={{
                background: '#090b0d',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.14em', color: 'var(--dws-signal)', textTransform: 'uppercase' }}>
                  STAGE SLA
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4ade80' }}>● VERIFIED</span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                {current.sla}
              </div>

              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  color: 'var(--dws-signal)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginBottom: showTechnicalDetails ? '16px' : '0',
                }}
              >
                {showTechnicalDetails ? 'Hide Protocol Telemetry ▲' : 'Inspect Protocol Telemetry ▼'}
              </button>

              {showTechnicalDetails && (
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#a0a4b0',
                    lineHeight: '1.5',
                  }}
                >
                  {current.telemetry}
                </div>
              )}

              {/* Progress Scrubber Controls */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button
                  type="button"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                  className="growth-btn growth-btn-outline-dark"
                  style={{ flex: 1, padding: '10px 14px', minHeight: '40px', fontSize: '11px', justifyContent: 'center' }}
                >
                  PREV
                </button>
                <button
                  type="button"
                  disabled={activeIdx === milestones.length - 1}
                  onClick={() => setActiveIdx((prev) => Math.min(milestones.length - 1, prev + 1))}
                  className="growth-btn growth-btn-signal"
                  style={{ flex: 1, padding: '10px 14px', minHeight: '40px', fontSize: '11px', justifyContent: 'center' }}
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
