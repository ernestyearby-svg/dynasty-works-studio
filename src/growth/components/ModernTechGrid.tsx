import React, { useState } from 'react';

interface ConstellationNode {
  id: string;
  title: string;
  focus: string;
  details: string[];
}

const constellationNodes: ConstellationNode[] = [
  {
    id: 'web',
    title: 'WEB EXPERIENCE',
    focus: 'Sub-second edge frontends with zero layout shift and progressive qualification inputs.',
    details: ['Sub-400ms LCP delivery', 'Dynamic parameter injection', 'Accessible keyboard navigation'],
  },
  {
    id: 'crm',
    title: 'CRM INFRASTRUCTURE',
    focus: 'Structured pipeline architecture with automated deduplication and audit histories.',
    details: ['Deterministic contact enrichment', 'Sales rep SLA tracking', 'Bidirectional data sync'],
  },
  {
    id: 'automation',
    title: 'AUTOMATION',
    focus: 'Sub-60s multi-channel follow-up workflows engaging leads while buying intent is peak.',
    details: ['Instant conversational SMS', 'Behavioral email sequences', 'Dormant list reactivation'],
  },
  {
    id: 'paid-media',
    title: 'PAID MEDIA',
    focus: 'Direct Conversion API (CAPI) integrations feeding ad algorithms with revenue data.',
    details: ['Meta CAPI server uploads', 'Google Enhanced Conversions', 'Intent-focused campaign hierarchy'],
  },
  {
    id: 'ai-ops',
    title: 'AI OPERATIONS',
    focus: 'Operational intelligence detecting drop-offs and recommending high-yield adjustments.',
    details: ['Automated intent categorization', 'Funnel drop-off detection', 'Creative split-testing models'],
  },
  {
    id: 'analytics',
    title: 'DATA + ANALYTICS',
    focus: 'Closed-loop multi-touch attribution reporting true ROAS directly to executive leadership.',
    details: ['First-to-last touch ROAS', 'True customer acquisition cost', 'Executive KPI dashboards'],
  },
  {
    id: 'security',
    title: 'SECURE INTEGRATIONS',
    focus: 'Enterprise security standards with zero client-side credentials or exposed tokens.',
    details: ['Decoupled webhook adapters', 'Client-side honeypot protection', 'Encrypted data transmission'],
  },
];

export const ModernTechGrid: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  return (
    <section id="infrastructure" className="growth-section-editorial growth-theme-light" aria-labelledby="infra-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">ENTERPRISE FOUNDATION</span>
          <h2 id="infra-heading" className="growth-lead-title">
            Built on modern<br />
            <em>infrastructure.</em>
          </h2>
          <p className="growth-sub">
            A resilient, enterprise-capable foundation connecting seven operational pillars.
            Interact with any node to reveal subsystem capabilities:
          </p>
        </div>

        {/* Constellation Grid */}
        <div className="growth-constellation-container">
          {constellationNodes.map((node) => {
            const isHovered = activeNodeId === node.id;
            return (
              <div
                key={node.id}
                className="growth-constellation-node"
                onMouseEnter={() => setActiveNodeId(node.id)}
                onMouseLeave={() => setActiveNodeId(null)}
                tabIndex={0}
                onFocus={() => setActiveNodeId(node.id)}
                onBlur={() => setActiveNodeId(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.12em', color: isHovered ? 'var(--dws-signal)' : 'var(--dws-muted)', textTransform: 'uppercase' }}>
                    SUBSYSTEM
                  </span>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isHovered ? 'var(--dws-signal)' : 'var(--dws-line-light)',
                      transition: 'background 0.2s ease',
                    }}
                  />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 10px', color: 'var(--dws-ink)' }}>
                  {node.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--dws-muted)', lineHeight: '1.5', margin: '0 0 16px' }}>
                  {node.focus}
                </p>

                <div
                  style={{
                    borderTop: '1px dashed var(--dws-line-light)',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {node.details.map((detail, dIdx) => (
                    <span key={dIdx} style={{ fontSize: '12px', color: isHovered ? 'var(--dws-ink)' : 'var(--dws-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--dws-signal)', fontSize: '8px' }}>◆</span>
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
