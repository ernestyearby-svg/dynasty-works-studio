import React, { useState } from 'react';

interface JourneyStep {
  time: string;
  stage: string;
  name: string;
  trigger: string;
  systemAction: string;
  dataOutput: string;
  sla: string;
}

const steps: JourneyStep[] = [
  {
    time: 'T + 0.0s',
    stage: '01 / ACQUISITION',
    name: 'AD CLICK',
    trigger: 'Prospect clicks targeted Meta or Google ad with high commercial intent.',
    systemAction: 'Dynamic URL parameters appended; user routed to edge-cached conversion environment.',
    dataOutput: 'UTM source, medium, campaign, content, click ID preserved in memory.',
    sla: '< 150ms DNS & TLS Handshake',
  },
  {
    time: 'T + 0.4s',
    stage: '02 / EXPERIENCE',
    name: 'LANDING PAGE',
    trigger: 'Browser initializes conversion landing page with zero layout shift.',
    systemAction: 'Session storage captures first-touch attribution; dynamic copy personalizes by campaign context.',
    dataOutput: 'Device type, viewport, referrer timestamp locked.',
    sla: '0.4s Core Web Vitals LCP',
  },
  {
    time: 'T + 42s',
    stage: '03 / ENGAGEMENT',
    name: 'FORM SUBMISSION',
    trigger: 'Prospect completes structured qualification audit form and agrees to communication terms.',
    systemAction: 'Client honeypot validates authenticity; normalized JSON payload prepared for transmission.',
    dataOutput: 'Sanitized contact details + full attribution envelope.',
    sla: 'Instant Client Validation',
  },
  {
    time: 'T + 43s',
    stage: '04 / DATABASE',
    name: 'CRM CONTACT CREATED',
    trigger: 'Secure webhook ingests submission at API gateway.',
    systemAction: 'Automated contact deduplication; existing customer check; contact profile instantiated.',
    dataOutput: 'Unique CRM Contact ID + activity timeline initialized.',
    sla: '< 300ms API Ingestion',
  },
  {
    time: 'T + 44s',
    stage: '05 / ATTRIBUTION',
    name: 'LEAD SOURCE RECORDED',
    trigger: 'Attribution engine tags contact record with original acquisition parameters.',
    systemAction: 'Deterministic first-touch and last-touch tags applied for closed-loop ad feedback.',
    dataOutput: 'Campaign ID, creative variant, and keyword permanently bound to contact.',
    sla: '100% Deterministic Attribution',
  },
  {
    time: 'T + 58s',
    stage: '06 / CONVERSATION',
    name: 'IMMEDIATE FOLLOW-UP',
    trigger: 'Automated workflow triggers immediate sub-minute response.',
    systemAction: 'Personalized SMS delivered to prospect with calendar booking link and direct question.',
    dataOutput: 'Outbound SMS delivery receipt + open confirmation.',
    sla: '< 60 Seconds Response Time',
  },
  {
    time: 'T + 59s',
    stage: '07 / INTERNAL OPS',
    name: 'SALES NOTIFICATION',
    trigger: 'System generates internal alert for sales executive/operator.',
    systemAction: 'Push notification & SMS sent to designated team member with lead qualification profile.',
    dataOutput: 'Staff assigned; SLA countdown timer initiated.',
    sla: 'Instant Multi-Channel Alert',
  },
  {
    time: 'T + 2h',
    stage: '08 / COMMITMENT',
    name: 'APPOINTMENT BOOKED',
    trigger: 'Prospect chooses dedicated time slot on integrated calendar.',
    systemAction: 'Automated calendar invite created; multi-channel reminder sequence armed (24h, 2h, 15m).',
    dataOutput: 'Confirmed booking + meeting briefing document attached.',
    sla: '94%+ Show-Rate Protocol',
  },
  {
    time: 'T + 24h',
    stage: '09 / SALES VELOCITY',
    name: 'PIPELINE ADVANCEMENT',
    trigger: 'Consultation conducted; prospect qualified for solution scope.',
    systemAction: 'Opportunity moves to "Proposal Sent" or "Agreement Signed" stage; automated tasks spawned.',
    dataOutput: 'Proposal view tracking & contract status updates.',
    sla: 'Zero Pipeline Blind Spots',
  },
  {
    time: 'T + 48h',
    stage: '10 / CONVERSION',
    name: 'CUSTOMER ACQUIRED',
    trigger: 'Client signs engagement agreement and completes initial payment.',
    systemAction: 'Stripe / POS billing triggers automatic welcome sequence and client onboarding workflow.',
    dataOutput: 'Closed-Won deal value + contract milestone recorded.',
    sla: 'Seamless Client Onboarding',
  },
  {
    time: 'T + 49h',
    stage: '11 / CLOSED LOOP',
    name: 'REVENUE ATTRIBUTION',
    trigger: 'Closed transaction reported back to acquisition platforms.',
    systemAction: 'Server-side conversion upload informs Meta CAPI and Google Ads algorithms of high-value win.',
    dataOutput: 'Verified ROAS calculation displayed in executive dashboard.',
    sla: 'Continuous Algorithmic Optimization',
  },
];

export const FunnelFlow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentStep = steps[activeStepIndex];

  return (
    <section id="live-flow" className="growth-section" aria-labelledby="flow-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">STEP-BY-STEP REVENUE TELEMETRY</span>
          <h2 id="flow-heading" className="growth-h2">
            See What Happens After Someone Clicks.
          </h2>
          <p className="growth-sub">
            The difference between lost ad spend and predictable revenue is what happens in the critical
            minutes after an inquiry. Inspect the real-time operational journey below:
          </p>
        </div>

        {/* Step Scrubber / Progress Pipeline */}
        <div
          style={{
            background: 'var(--dws-surface)',
            border: '1px solid var(--dws-surface-border)',
            borderRadius: 'var(--dws-radius-lg)',
            padding: '32px',
          }}
        >
          {/* Milestone Selector */}
          <div
            role="tablist"
            aria-label="Customer Journey Milestones"
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '28px',
            }}
          >
            {steps.map((s, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    background: isSelected ? 'var(--dws-champagne)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? 'var(--dws-obsidian)' : 'var(--dws-bone)',
                    border: 'none',
                    borderRadius: 'var(--dws-radius-sm)',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.time} · {s.name}
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--dws-champagne)',
                  }}
                >
                  {currentStep.time}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--dws-text-dim)',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentStep.stage}
                </span>
              </div>

              <h3 className="growth-h2" style={{ fontSize: '32px', marginBottom: '16px' }}>
                {currentStep.name}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: 'var(--dws-champagne)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Trigger Event:
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--dws-bone)', lineHeight: '1.6' }}>
                  {currentStep.trigger}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: 'var(--dws-champagne)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Automated Infrastructure Action:
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--dws-text-muted)', lineHeight: '1.6' }}>
                  {currentStep.systemAction}
                </p>
              </div>
            </div>

            {/* Telemetry Box */}
            <div
              style={{
                background: '#0D0D0D',
                border: '1px solid rgba(212, 180, 131, 0.25)',
                borderRadius: 'var(--dws-radius-md)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--dws-champagne)',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>DATA STREAM ARTIFACT</span>
                <span style={{ color: '#4ade80' }}>VERIFIED</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--dws-text-dim)', marginBottom: '4px' }}>
                  Payload Output:
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'var(--dws-bone)',
                    lineHeight: '1.5',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {currentStep.dataOutput}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--dws-text-dim)', marginBottom: '4px' }}>
                  Performance Benchmark / SLA:
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--dws-champagne-light)',
                  }}
                >
                  {currentStep.sla}
                </div>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="growth-btn growth-btn-secondary"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '11px', opacity: activeStepIndex === 0 ? 0.3 : 1 }}
                >
                  ← PREVIOUS
                </button>
                <button
                  type="button"
                  className="growth-btn growth-btn-primary"
                  disabled={activeStepIndex === steps.length - 1}
                  onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '11px', opacity: activeStepIndex === steps.length - 1 ? 0.3 : 1 }}
                >
                  NEXT STAGE →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
