import React from 'react';

interface BuildModule {
  num: string;
  title: string;
  statement: string;
  capabilities: string[];
  visualLabel: string;
  visualDetail: string;
}

const modules: BuildModule[] = [
  {
    num: '01',
    title: 'CONVERSION EXPERIENCE',
    statement: 'Sub-second web surfaces and qualification funnels engineered to eliminate friction and turn attention into verified intent.',
    capabilities: [
      'Dedicated landing pages & custom websites',
      'Progressive lead qualification forms',
      'Dynamic Number Insertion (DNI) for inbound calls',
      'Performance benchmarking & structured funnel optimization',
    ],
    visualLabel: 'FRONTEND ARCHITECTURE',
    visualDetail: 'Sub-400ms Edge Delivery · Zero Cumulative Layout Shift',
  },
  {
    num: '02',
    title: 'ACQUISITION',
    statement: 'Intent-driven Meta and Google paid media structured around unit economics, creative differentiation, and deterministic attribution.',
    capabilities: [
      'Meta Conversions API (CAPI) server-side integration',
      'High-intent Google Search & demand capture campaigns',
      'Iterative hook and creative testing protocols',
      'Full campaign attribution and keyword telemetry',
    ],
    visualLabel: 'DEMAND GENERATION',
    visualDetail: 'Algorithmic Bid Optimization · Strict Commercial Intent',
  },
  {
    num: '03',
    title: 'CRM + SALES PIPELINE',
    statement: 'Centralized sales infrastructure that instantiates every contact, deduplicates records, and advances opportunities through structured stages.',
    capabilities: [
      'Automated lead capture & routing logic',
      'Custom opportunity pipeline architecture',
      'Team calendar availability & slot management',
      'Sales rep task assignment & SLA tracking',
    ],
    visualLabel: 'PIPELINE GOVERNANCE',
    visualDetail: 'Automated Opportunity Staging · Real-time Contact Deduplication',
  },
  {
    num: '04',
    title: 'CONVERSATIONAL AUTOMATION',
    statement: 'Immediate, intelligent follow-up workflows operating 24/7 so prospects are engaged within 60 seconds of submitting an inquiry.',
    capabilities: [
      'Sub-minute two-way SMS follow-up',
      'Behavior-triggered email nurture sequences',
      'Automated appointment reminders & no-show recovery',
      'Dormant customer database reactivation campaigns',
    ],
    visualLabel: 'RAPID RESPONSE ENGINE',
    visualDetail: '< 60-Second Lead Engagement · Multi-Channel Follow-Up',
  },
  {
    num: '05',
    title: 'CLOSED-LOOP INTELLIGENCE',
    statement: 'Executive reporting connecting collected revenue back to the originating ad, creative, and channel for unambiguous ROI visibility.',
    capabilities: [
      'Deterministic first-to-last touch ROAS attribution',
      'True cost-per-lead and cost-per-acquisition analysis',
      'AI-assisted bottleneck and drop-off diagnosis',
      'Executive KPI & financial performance dashboards',
    ],
    visualLabel: 'REVENUE REPORTING',
    visualDetail: 'Deterministic Conversion Feedback · Continuous Funnel Optimization',
  },
];

export const WhatWeBuild: React.FC = () => {
  return (
    <section id="capabilities" className="growth-section-editorial growth-theme-light" aria-labelledby="capabilities-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">INSTALLED CAPABILITIES</span>
          <h2 id="capabilities-heading" className="growth-lead-title">
            Infrastructure,<br />
            <em>not random marketing services.</em>
          </h2>
          <p className="growth-sub">
            Dynasty Works Studio architects and installs interconnected growth systems built for permanent operational advantage.
          </p>
        </div>

        {/* Alternating Editorial Modules */}
        <div className="growth-build-editorial">
          {modules.map((m, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={m.num}
                className={`growth-build-row ${isReversed ? 'is-reversed' : ''}`}
              >
                <div>
                  <div className="growth-build-number">{m.num}</div>
                  <h3 className="growth-build-title">{m.title}</h3>
                  <p className="growth-build-statement">{m.statement}</p>

                  <ul className="growth-build-bullets">
                    {m.capabilities.map((cap, cIdx) => (
                      <li key={cIdx}>{cap}</li>
                    ))}
                  </ul>
                </div>

                {/* Architectural Diagram Visual */}
                <div className="growth-build-visual">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.14em', color: 'var(--dws-signal)', textTransform: 'uppercase' }}>
                      {m.visualLabel}
                    </span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--dws-signal)' }} />
                  </div>

                  <div style={{ borderLeft: '2px solid var(--dws-ink)', paddingLeft: '16px', margin: '12px 0' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dws-muted)', display: 'block', marginBottom: '4px' }}>
                      SUBSYSTEM SPECIFICATION:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dws-ink)', lineHeight: '1.4' }}>
                      {m.visualDetail}
                    </span>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--dws-line-light)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--dws-muted)' }}>
                    <span>STANDARDIZED DELIVERY</span>
                    <span style={{ color: 'var(--dws-signal)', fontWeight: 700 }}>VERIFIED COMPONENT</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
