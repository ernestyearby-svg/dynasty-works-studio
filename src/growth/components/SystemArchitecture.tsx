import React, { useState } from 'react';

interface Stage {
  number: string;
  name: string;
  subtitle: string;
  statement: string;
  capabilities: string[];
  protocol: string;
}

const architectureStages: Stage[] = [
  {
    number: '01',
    name: 'ACQUIRE',
    subtitle: 'Paid Acquisition & Demand Engineering',
    statement: 'Meta & Google ad campaigns engineered around commercial intent, differentiated creative, and automated Conversion API (CAPI) feedback loops.',
    capabilities: [
      'Intent-focused search & social ad structures',
      'Direct conversion API (CAPI) server-side signals',
      'Dynamic UTM & campaign attribution mapping',
    ],
    protocol: 'Meta CAPI / Google Enhanced Conversions · Deterministic Tagging',
  },
  {
    number: '02',
    name: 'CONVERT',
    subtitle: 'High-Converting Digital Surfaces',
    statement: 'Sub-second landing pages and progressive qualification forms designed to eliminate bounce and turn commercial interest into verified leads.',
    capabilities: [
      'Edge-rendered experiences with 0.4s LCP',
      'Progressive qualification inputs with validation',
      'Dynamic Number Insertion (DNI) for inbound calls',
    ],
    protocol: 'Session storage preservation of first-touch attribution',
  },
  {
    number: '03',
    name: 'CAPTURE',
    subtitle: 'Centralized CRM & Contact Verification',
    statement: 'Every lead instantly normalized, deduplicated, enriched, and logged into structured CRM opportunity pipelines within 300ms.',
    capabilities: [
      'Instant contact deduplication and enrichment',
      'Deterministic source, medium, and campaign logging',
      'Pipeline stage initialization with audit logs',
    ],
    protocol: 'Secure Webhook Ingestion · Zero Client-Side Secrets',
  },
  {
    number: '04',
    name: 'FOLLOW UP',
    subtitle: 'Sub-60s Multi-Touch Automation',
    statement: 'Automated 2-way conversational SMS and behavioral email sequences engage prospects while their buying intent is at its peak.',
    capabilities: [
      'Sub-60-second conversational SMS response',
      'Behavioral email sequences tailored to inquiry type',
      'Dormant customer database reactivation protocols',
    ],
    protocol: 'Real-time multi-channel conversational dispatching',
  },
  {
    number: '05',
    name: 'BOOK',
    subtitle: 'Frictionless Appointment Architecture',
    statement: 'Direct team calendar allocation with automated confirmations, briefing agendas, and proactive no-show recovery workflows.',
    capabilities: [
      'Integrated real-time calendar availability',
      'Automated SMS & email briefing sequences',
      'Intelligent reschedule and no-show recovery',
    ],
    protocol: 'Two-way calendar synchronization · 94%+ attendance protocol',
  },
  {
    number: '06',
    name: 'CLOSE',
    subtitle: 'Structured Sales Pipeline Velocity',
    statement: 'End-to-end deal milestone tracking ensuring no qualified prospect stalls, with automatic task triggers and SLA monitoring.',
    capabilities: [
      'Deal advancement across defined milestones',
      'Operator task assignment and SLA alerts',
      'Objection logging and proposal view analytics',
    ],
    protocol: 'Opportunity audit trail mapped to original click source',
  },
  {
    number: '07',
    name: 'MEASURE',
    subtitle: 'Closed-Loop Revenue Attribution',
    statement: 'Deterministic reporting linking closed customer revenue back to the original ad, creative, and campaign that generated it.',
    capabilities: [
      'First-touch to final-close ROAS analysis',
      'True cost-per-acquisition (CAC) financial reporting',
      'Server-side conversion uploads back to ad networks',
    ],
    protocol: 'Closed-loop merchant / Stripe reconciliation model',
  },
  {
    number: '08',
    name: 'OPTIMIZE',
    subtitle: 'AI-Assisted Operations & Refinement',
    statement: 'Continuous algorithmic analysis across funnel conversion rates, recommending budget reallocation and creative testing priorities.',
    capabilities: [
      'Algorithmic bottleneck and drop-off detection',
      'Iterative split-testing of hooks and offers',
      'Proactive campaign budget recommendations',
    ],
    protocol: 'Predictive analytics model driving continuous improvement',
  },
];

export const SystemArchitecture: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = architectureStages[selectedIdx];

  return (
    <section id="system" className="growth-section-editorial growth-theme-dark" aria-labelledby="system-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">THE OPERATING SEQUENCE</span>
          <h2 id="system-heading" className="growth-lead-title">
            One connected<br />
            <em>growth infrastructure.</em>
          </h2>
          <p className="growth-sub">
            Dynasty Works Studio builds the connected infrastructure bridging the entire commercial journey.
            Select a module to inspect its architecture:
          </p>
        </div>

        {/* Signature Architecture Layout */}
        <div className="growth-system-signature">
          {/* Left: Stage Menu */}
          <div className="growth-stage-menu" role="tablist" aria-label="System Stages">
            {architectureStages.map((stage, idx) => {
              const isActive = idx === selectedIdx;
              return (
                <button
                  key={stage.number}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`growth-stage-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: isActive ? 'var(--dws-signal)' : '#5a5e6b' }}>
                      {stage.number}
                    </span>
                    <span>{stage.name}</span>
                  </div>
                  <span
                    className="dot"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--dws-signal)' : 'transparent',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                    }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Architectural Stage Display */}
          <div className="growth-stage-display" role="tabpanel" aria-label={`${active.name} Details`}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', color: 'var(--dws-signal)', textTransform: 'uppercase' }}>
                  MODULE {active.number} · {active.subtitle}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#686c77' }}>
                  LIVE ARCHITECTURE
                </span>
              </div>

              <h3 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '-0.04em', margin: '0 0 20px', color: '#ffffff' }}>
                {active.name}
              </h3>

              <p style={{ fontSize: '17px', color: '#b9bcc6', lineHeight: '1.65', maxWidth: '48ch', margin: '0 0 32px' }}>
                {active.statement}
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '14px' }}>
                  INSTALLED CAPABILITIES:
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {active.capabilities.map((cap, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#ece9e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--dws-signal)', fontSize: '12px' }}>—</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#696e7a', fontFamily: 'monospace' }}>
                Protocol: <strong style={{ color: '#ece9e1' }}>{active.protocol}</strong>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--dws-signal)', fontFamily: 'monospace' }}>
                ● SYNCHRONIZED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
