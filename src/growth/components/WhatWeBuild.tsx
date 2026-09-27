import React from 'react';

interface BuildModule {
  tag: string;
  title: string;
  description: string;
  features: string[];
}

const modules: BuildModule[] = [
  {
    tag: 'MODULE 01',
    title: 'CONVERSION EXPERIENCE',
    description: 'High-performance digital surfaces designed to eliminate bounce and turn commercial intent into verified inquiries.',
    features: [
      'Websites',
      'Landing Pages',
      'High-Conversion Funnels',
      'Progressive Qualification Forms',
      'Conversion Rate Optimization',
    ],
  },
  {
    tag: 'MODULE 02',
    title: 'ACQUISITION',
    description: 'Targeted paid media engineered around buyer intent, creative differentiation, and deterministic tracking.',
    features: [
      'Meta Advertising (FB & IG)',
      'Google Advertising (Search & Intent)',
      'Campaign Architecture Strategy',
      'Creative & Copy Development',
      'Conversion API (CAPI) Integration',
    ],
  },
  {
    tag: 'MODULE 03',
    title: 'CRM + SALES',
    description: 'Centralized sales infrastructure that routes every lead, eliminates duplicate contacts, and drives opportunities forward.',
    features: [
      'Lead Capture & Routing',
      'Custom Pipeline Architecture',
      'Opportunity Stage Tracking',
      'Team Calendar Integration',
      'Sales Task & SLA Automation',
    ],
  },
  {
    tag: 'MODULE 04',
    title: 'AUTOMATION',
    description: 'Immediate, intelligent follow-up workflows operating 24/7 so prospects never go cold between inquiry and booking.',
    features: [
      'Two-Way SMS Follow-Up',
      'Behavioral Email Sequences',
      'Automated Lead Nurture',
      'Appointment Reminders & Confirmations',
      'Dormant Lead Reactivation',
      'Instant Internal Team Notifications',
    ],
  },
  {
    tag: 'MODULE 05',
    title: 'INTELLIGENCE',
    description: 'Closed-loop data and reporting that reveals the exact financial return on every marketing dollar spent.',
    features: [
      'Performance Analytics Dashboards',
      'Deterministic Revenue Attribution',
      'AI-Assisted Campaign Analysis',
      'Creative & Hook Performance Testing',
      'Executive KPI & Financial Reporting',
    ],
  },
];

export const WhatWeBuild: React.FC = () => {
  return (
    <section id="what-we-build" className="growth-section" aria-labelledby="build-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">INSTALLED INFRASTRUCTURE</span>
          <h2 id="build-heading" className="growth-h2">
            Infrastructure, Not Random Marketing Services.
          </h2>
          <p className="growth-sub">
            Dynasty Works Studio doesn’t sell disconnected tasks or isolated hours. We architect, install,
            and calibrate interconnected business growth systems built for permanent operational advantage.
          </p>
        </div>

        <div className="growth-grid-3">
          {modules.map((m, idx) => (
            <div
              key={idx}
              className="growth-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(20, 20, 20, 0.75)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--dws-champagne)',
                    marginBottom: '8px',
                  }}
                >
                  {m.tag}
                </div>
                <h3 className="growth-h3" style={{ fontSize: '20px', marginBottom: '12px' }}>
                  {m.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--dws-text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {m.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--dws-text-dim)',
                    marginBottom: '10px',
                  }}
                >
                  INSTALLED CAPABILITIES:
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {m.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      style={{
                        fontSize: '13px',
                        color: 'var(--dws-bone)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: 'var(--dws-champagne)', fontSize: '9px' }}>■</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
