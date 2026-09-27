import React from 'react';

interface ProblemCardData {
  num: string;
  tag: string;
  title: string;
  description: string;
  consequence: string;
}

const problems: ProblemCardData[] = [
  {
    num: '01',
    tag: 'FRAGMENTATION',
    title: 'DISCONNECTED TOOLS',
    description: 'Website, CRM, and advertising operating as isolated silos without synchronized data handoffs.',
    consequence: 'Prospect data is lost between clicks, forms, and ad platform optimization loops.',
  },
  {
    num: '02',
    tag: 'LATENCY',
    title: 'SLOW FOLLOW-UP',
    description: 'Qualified prospects waiting hours—or days—for manual sales outreach after showing intent.',
    consequence: 'Lead interest decays exponentially; competitors with rapid follow-up win the deal.',
  },
  {
    num: '03',
    tag: 'BLIND SPOTS',
    title: 'INVISIBLE ATTRIBUTION',
    description: 'Knowing leads arrived, but having zero verified insight into which campaign or ad actually generated closed revenue.',
    consequence: 'Ad budgets are wasted on unqualified clicks while highest-margin campaigns remain underfunded.',
  },
  {
    num: '04',
    tag: 'INEFFICIENCY',
    title: 'MANUAL OPERATIONS',
    description: 'Internal teams repeating routine scheduling, email drafting, data entry, and reminder tasks manually.',
    consequence: 'Operational drag diverts focus from high-touch closing and strategic client execution.',
  },
];

export const ProblemCards: React.FC = () => {
  return (
    <section id="problem" className="growth-section" aria-labelledby="problem-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">THE OPERATIONAL BOTTLENECK</span>
          <h2 id="problem-heading" className="growth-h2">
            Most Businesses Don’t Have a Lead Problem.<br />
            <em>They Have a System Problem.</em>
          </h2>
          <p className="growth-sub">
            Traffic without conversion infrastructure wastes opportunity. A prospect clicks an ad.
            Visits a website. Submits a form. Calls after hours. Misses an appointment. Stops replying.
            Without a connected operating system, those moments become lost revenue.
          </p>
        </div>

        <div className="growth-grid-4" role="list">
          {problems.map((item) => (
            <article key={item.num} className="growth-card" role="listitem">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--dws-champagne)',
                  }}
                >
                  {item.num}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--dws-text-dim)',
                    fontWeight: 700,
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <h3 className="growth-h3" style={{ fontSize: '18px', marginBottom: '12px' }}>
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--dws-text-muted)',
                  lineHeight: '1.6',
                  marginBottom: '16px',
                }}
              >
                {item.description}
              </p>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--dws-champagne-light)',
                  paddingTop: '12px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                }}
              >
                <strong>Revenue Impact:</strong> {item.consequence}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
