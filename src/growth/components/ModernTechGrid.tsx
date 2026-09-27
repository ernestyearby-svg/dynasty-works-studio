import React from 'react';

interface TechCategory {
  title: string;
  focus: string;
  capabilities: string[];
}

const techCategories: TechCategory[] = [
  {
    title: 'WEB EXPERIENCE',
    focus: 'High-Performance Frontends',
    capabilities: [
      'Sub-second edge rendering and zero layout shift',
      'Mobile-first responsive architecture (320px–1920px)',
      'Progressive qualification inputs & accessible form design',
      'Dynamic UTM & personalization injection',
    ],
  },
  {
    title: 'CRM INFRASTRUCTURE',
    focus: 'Pipeline & Contact Organization',
    capabilities: [
      'Automated contact deduplication and enrichment',
      'Multi-stage pipeline tracking with audit trails',
      'Automated SLA monitoring for sales team responsiveness',
      'Bidirectional data synchronization with external tools',
    ],
  },
  {
    title: 'AUTOMATION',
    focus: 'Sub-Minute Event Execution',
    capabilities: [
      'Instant two-way conversational SMS workflows',
      'Dynamic behavioral email nurture sequences',
      'Automated multi-channel appointment confirmations',
      'Dormant customer database reactivation protocols',
    ],
  },
  {
    title: 'PAID MEDIA',
    focus: 'Intent-Driven Acquisition',
    capabilities: [
      'Meta Conversions API (CAPI) server-side tracking',
      'Google Enhanced Conversions & intent search campaigns',
      'Structured audience segmentation by buying stage',
      'Iterative creative and hook performance testing',
    ],
  },
  {
    title: 'AI OPERATIONS',
    focus: 'Operational Intelligence',
    capabilities: [
      'Automated lead qualification and intent categorization',
      'Funnel drop-off and conversion bottleneck detection',
      'Proactive campaign recommendation modeling',
      'Conversational response generation tailored to business voice',
    ],
  },
  {
    title: 'DATA + ANALYTICS',
    focus: 'Executive Revenue Attribution',
    capabilities: [
      'Deterministic first-touch to final-close ROAS analysis',
      'Real-time cost-per-lead and cost-per-acquisition tracking',
      'Executive KPI reporting for leadership teams',
      'Privacy-compliant tracking architecture',
    ],
  },
  {
    title: 'SECURE INTEGRATIONS',
    focus: 'Enterprise-Grade Security',
    capabilities: [
      'Zero client-side secrets or exposed database tokens',
      'Encrypted webhook endpoints and rate-limited ingestion',
      'Client-side honeypot spam protection protocols',
      'Strict adherence to enterprise data privacy regulations',
    ],
  },
];

export const ModernTechGrid: React.FC = () => {
  return (
    <section id="technology" className="growth-section" aria-labelledby="tech-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">ENTERPRISE FOUNDATION</span>
          <h2 id="tech-heading" className="growth-h2">
            Built on Modern Infrastructure.
          </h2>
          <p className="growth-sub">
            The Dynasty Growth Operating System is engineered with modern, enterprise-capable standards.
            Fast, secure, resilient, and built to scale alongside expanding revenue.
          </p>
        </div>

        <div className="growth-grid-3">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="growth-card"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
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
                    letterSpacing: '0.1em',
                    color: 'var(--dws-champagne)',
                    marginBottom: '8px',
                  }}
                >
                  {cat.focus}
                </div>
                <h3 className="growth-h3" style={{ fontSize: '18px', marginBottom: '16px' }}>
                  {cat.title}
                </h3>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {cat.capabilities.map((cap, cIdx) => (
                    <li
                      key={cIdx}
                      style={{
                        fontSize: '13px',
                        color: 'var(--dws-text-muted)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        lineHeight: '1.5',
                      }}
                    >
                      <span style={{ color: 'var(--dws-champagne)', fontSize: '8px' }}>◆</span>
                      {cap}
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
