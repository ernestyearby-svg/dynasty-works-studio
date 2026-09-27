import React, { useState } from 'react';

interface Stage {
  number: string;
  name: string;
  kicker: string;
  headline: string;
  items: string[];
  deliverables: string[];
  dataProtocol: string;
}

const systemStages: Stage[] = [
  {
    number: '01',
    name: 'ACQUIRE',
    kicker: 'PAID MEDIA & AUDIENCE TARGETING',
    headline: 'Engineered Traffic That Converts',
    items: ['Meta Ads', 'Google Ads', 'Campaign Strategy', 'Creative Development'],
    deliverables: [
      'High-intent search & paid social structure',
      'Targeted campaign architecture by intent level',
      'Direct conversion API (CAPI) feedback loops',
    ],
    dataProtocol: 'Full UTM & dynamic click attribution tagging',
  },
  {
    number: '02',
    name: 'CONVERT',
    kicker: 'HIGH-CONVERTING WEB INFRASTRUCTURE',
    headline: 'High-Trust Web & Landing Experiences',
    items: ['Landing Pages', 'Web Experiences', 'Lead Forms', 'Call Tracking'],
    deliverables: [
      'Sub-second page speeds with zero layout shift',
      'Frictionless progressive qualification forms',
      'Dynamic number insertion (DNI) for inbound call attribution',
    ],
    dataProtocol: 'Session storage preservation of first-touch source',
  },
  {
    number: '03',
    name: 'CAPTURE',
    kicker: 'CENTRALIZED CRM REPOSITORY',
    headline: 'Automated Lead & Contact Ingestion',
    items: ['CRM Ingestion', 'Contact Records', 'Lead Source Verification', 'Campaign Attribution'],
    deliverables: [
      'Immediate contact deduplication and enrichment',
      'Deterministic source, medium, and campaign logging',
      'Centralized opportunity creation with audit trails',
    ],
    dataProtocol: 'Standardized JSON payload mapping via secure webhooks',
  },
  {
    number: '04',
    name: 'FOLLOW UP',
    kicker: 'RAPID CONVERSATIONAL NURTURE',
    headline: 'Sub-60-Second Multi-Touch Workflows',
    items: ['SMS Follow-Up', 'Email Sequences', 'Missed Call Text-Back', 'Lead Nurture', 'Reactivation'],
    deliverables: [
      'Automated instant two-way SMS response',
      'Behavior-triggered email education and social proof',
      'Dormant list re-engagement and reactivation loops',
    ],
    dataProtocol: 'Real-time event dispatching on prospect interaction',
  },
  {
    number: '05',
    name: 'BOOK',
    kicker: 'INTEGRATED SCHEDULING PLATFORM',
    headline: 'Frictionless Calendar & Attendance Assurance',
    items: ['Calendar Integration', 'Appointments', 'Reminders', 'No-Show Recovery'],
    deliverables: [
      'Real-time team calendar slot allocation',
      'Automated multi-channel confirmation and preparation briefing',
      'Intelligent reschedule and no-show rebooking protocols',
    ],
    dataProtocol: 'Calendar sync with two-way SMS cancellation recovery',
  },
  {
    number: '06',
    name: 'CLOSE',
    kicker: 'STRUCTURED PIPELINE VELOCITY',
    headline: 'Executive Sales Pipeline Management',
    items: ['Sales Pipeline', 'Opportunity Tracking', 'Follow-Up Tasks', 'Deal Stages'],
    deliverables: [
      'Automated deal advancement across defined milestones',
      'Task assignment and SLA tracking for sales operators',
      'Win/loss categorization and objection intelligence',
    ],
    dataProtocol: 'Pipeline stage audit logs tied directly to contact records',
  },
  {
    number: '07',
    name: 'MEASURE',
    kicker: 'CLOSED-LOOP ATTRIBUTION',
    headline: 'Deterministic Revenue Reporting',
    items: ['Leads', 'Appointments', 'Customers', 'Revenue', 'Attribution'],
    deliverables: [
      'True cost-per-acquisition (CPA) and cost-per-appointment',
      'First-touch to final-close ROAS analysis',
      'Executive KPI reporting for strategic leadership',
    ],
    dataProtocol: 'Server-side conversion uploads back to Meta & Google',
  },
  {
    number: '08',
    name: 'OPTIMIZE',
    kicker: 'CONTINUOUS INTELLIGENCE & ITERATION',
    headline: 'AI-Assisted Operations & Refinement',
    items: ['AI-Assisted Analysis', 'Creative Testing', 'Campaign Recommendations', 'Conversion Improvements'],
    deliverables: [
      'Algorithmic anomaly detection across the funnel',
      'Iterative split-testing of hooks, copy, and landing pages',
      'Proactive budget reallocation toward highest-yield channels',
    ],
    dataProtocol: 'Unified analytics ingestion driving weekly operational pivots',
  },
];

export const SystemArchitecture: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const activeStage = systemStages[activeStageIndex];

  return (
    <section id="system" className="growth-section" aria-labelledby="system-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">THE OPERATING SEQUENCE</span>
          <h2 id="system-heading" className="growth-h2">
            One Connected Growth Infrastructure.
          </h2>
          <p className="growth-sub">
            Dynasty Works Studio engineers the complete infrastructure between the first ad impression
            and collected revenue. Explore the eight interconnected modules below:
          </p>
        </div>

        {/* Modular Navigation Bar */}
        <div
          role="tablist"
          aria-label="Growth System Stages"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '8px',
            marginBottom: '28px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {systemStages.map((stage, idx) => {
            const isSelected = idx === activeStageIndex;
            return (
              <button
                key={stage.number}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`stage-panel-${stage.number}`}
                id={`stage-tab-${stage.number}`}
                onClick={() => setActiveStageIndex(idx)}
                style={{
                  background: isSelected ? 'rgba(212, 180, 131, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected
                    ? '1px solid var(--dws-champagne)'
                    : '1px solid var(--dws-surface-border)',
                  borderRadius: 'var(--dws-radius-sm)',
                  padding: '14px 10px',
                  color: isSelected ? 'var(--dws-bone)' : 'var(--dws-text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  minWidth: '110px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isSelected ? 'var(--dws-champagne)' : 'var(--dws-text-dim)',
                    marginBottom: '4px',
                  }}
                >
                  {stage.number}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {stage.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div
          id={`stage-panel-${activeStage.number}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${activeStage.number}`}
          className="growth-card"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(12, 12, 12, 0.98) 100%)',
            border: '1px solid rgba(212, 180, 131, 0.3)',
            padding: '36px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '40px',
              alignItems: 'start',
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
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                MODULE {activeStage.number} · {activeStage.kicker}
              </div>
              <h3 className="growth-h2" style={{ fontSize: '28px', marginBottom: '16px' }}>
                {activeStage.headline}
              </h3>

              <div style={{ marginTop: '24px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: 'var(--dws-text-dim)',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  ENGINEERED DELIVERABLES:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: 'var(--dws-text-muted)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                  }}
                >
                  {activeStage.deliverables.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--dws-radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  color: 'var(--dws-text-dim)',
                }}
              >
                <strong style={{ color: 'var(--dws-champagne)' }}>Data Protocol:</strong>{' '}
                {activeStage.dataProtocol}
              </div>
            </div>

            {/* Scope Elements Badge Stack */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--dws-surface-border)',
                borderRadius: 'var(--dws-radius-md)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: 'var(--dws-champagne)',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                SYSTEM MODULE COMPONENTS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeStage.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 'var(--dws-radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--dws-bone)',
                    }}
                  >
                    <span style={{ color: 'var(--dws-champagne)', fontSize: '10px' }}>◆</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
