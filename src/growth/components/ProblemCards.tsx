import React from 'react';

interface ProblemFragment {
  num: string;
  title: string;
  description: string;
  breakType: string;
}

const fragments: ProblemFragment[] = [
  {
    num: '01',
    title: 'DISCONNECTED TOOLS',
    description: 'Website, advertising platforms, and CRM operating in complete isolation without automated synchronization.',
    breakType: '[DATA LEAK // ZERO ATTRIBUTION HANDOFF]',
  },
  {
    num: '02',
    title: 'SLOW FOLLOW-UP',
    description: 'High-intent commercial prospects waiting hours for manual outreach while their buying intent decays.',
    breakType: '[VELOCITY DROP // UNCLAIMED REVENUE]',
  },
  {
    num: '03',
    title: 'INVISIBLE ATTRIBUTION',
    description: 'Knowing leads arrived, but unable to prove which campaign, creative, or keyword generated collected revenue.',
    breakType: '[ATTRIBUTION BLIND SPOT // WASTED MEDIA]',
  },
  {
    num: '04',
    title: 'MANUAL OPERATIONS',
    description: 'Teams repeating routine qualification, manual email follow-up, and scheduling tasks that should be automated.',
    breakType: '[OPERATIONAL DRAG // LOST TIME]',
  },
];

export const ProblemCards: React.FC = () => {
  return (
    <section id="problem" className="growth-section-editorial growth-theme-light" aria-labelledby="problem-heading">
      <div className="growth-container">
        <div className="growth-problem-editorial">
          {/* Left Column: Monumental Editorial Typography */}
          <div>
            <span className="growth-eyebrow">THE REVENUE BOTTLENECK</span>
            <h2 id="problem-heading" className="growth-lead-title" style={{ fontSize: 'clamp(44px, 5.5vw, 76px)', maxWidth: '14ch' }}>
              Most businesses don’t have a lead problem.<br /><br />
              <em>They have a system problem.</em>
            </h2>
            <p className="growth-sub" style={{ marginTop: '24px' }}>
              Traffic without conversion infrastructure wastes commercial opportunity. A prospect clicks an ad.
              Visits a page. Submits a form. Calls after hours. Misses an appointment. Without a connected operating
              system, those moments become lost revenue.
            </p>
          </div>

          {/* Right Column: Fragmented Broken System Visualization */}
          <div className="growth-fragmented-diagram" role="list" aria-label="Operational Fragmentation Points">
            {fragments.map((frag) => (
              <div key={frag.num} className="growth-fragment-item" role="listitem">
                <span className="growth-fragment-num">{frag.num}</span>
                <div>
                  <h3 className="growth-fragment-title">{frag.title}</h3>
                  <p className="growth-fragment-desc">{frag.description}</p>
                  <div className="growth-fragment-break">{frag.breakType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
