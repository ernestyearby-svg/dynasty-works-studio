import React, { useState, useEffect } from 'react';

interface SystemStage {
  id: string;
  step: string;
  label: string;
  sub: string;
  latency: string;
  status: string;
}

const stages: SystemStage[] = [
  { id: 'traffic', step: '01', label: 'TRAFFIC', sub: 'Intent-Targeted Paid Media', latency: '0.1s', status: 'SYNCHRONIZED' },
  { id: 'conversion', step: '02', label: 'CONVERSION', sub: 'Sub-Second Landing Experience', latency: '0.4s', status: 'ACTIVE' },
  { id: 'lead', step: '03', label: 'LEAD', sub: 'Verified Multi-Touch Capture', latency: 'Real-time', status: 'AUTHENTICATED' },
  { id: 'crm', step: '04', label: 'CRM', sub: 'Automated Pipeline Ingestion', latency: '< 300ms', status: 'ENRICHED' },
  { id: 'follow-up', step: '05', label: 'FOLLOW-UP', sub: 'Sub-60s Automated Conversational SMS', latency: '< 60s', status: 'ENGAGED' },
  { id: 'appointment', step: '06', label: 'APPOINTMENT', sub: 'Confirmed Calendar Reservation', latency: 'Direct', status: 'RESERVED' },
  { id: 'customer', step: '07', label: 'CUSTOMER', sub: 'Closed Commercial Contract', latency: 'Closed-Won', status: 'ONBOARDED' },
  { id: 'revenue', step: '08', label: 'REVENUE', sub: 'Multi-Touch Closed-Loop Attribution', latency: 'Attributed', status: 'RECORDED' },
];

export const GrowthSystemDiagram: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Subtle automated cycle representing the live cobalt pulse traversing the system
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % stages.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const activeStage = stages[activeStageIndex];

  return (
    <div className="growth-architectural-plane" aria-label="Proprietary Operating Infrastructure Model">
      <div className="growth-plane-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="growth-pulse-indicator" aria-hidden="true" />
          <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ece9e1' }}>
            OPERATING INFRASTRUCTURE · ACTIVE BEAM
          </span>
        </div>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--dws-signal)', letterSpacing: '0.1em' }}>
          STAGE {activeStage.step}/08
        </span>
      </div>

      {/* Spatial Stage Pathway */}
      <div className="growth-plane-nodes" role="list">
        {stages.map((st, idx) => {
          const isActive = idx === activeStageIndex;
          return (
            <div
              key={st.id}
              role="listitem"
              tabIndex={0}
              onClick={() => setActiveStageIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveStageIndex(idx);
                }
              }}
              className={`growth-plane-node ${isActive ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isActive ? 'var(--dws-signal)' : '#5a5d66',
                  }}
                >
                  {st.step}
                </span>
                <div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isActive ? '#ffffff' : '#b2b5be',
                    }}
                  >
                    {st.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      color: isActive ? '#d1d5db' : '#696c77',
                    }}
                  >
                    {st.sub}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: isActive ? 'var(--dws-signal)' : '#4f525c',
                  }}
                >
                  {st.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating System Plane Output */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(36, 87, 255, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.12em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block' }}>
            SIGNAL TELEMETRY
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ece9e1' }}>
            {activeStage.label} → {activeStage.sub}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#888b94', display: 'block' }}>
            SLA BENCHMARK
          </span>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dws-signal)', fontWeight: 700 }}>
            {activeStage.latency}
          </span>
        </div>
      </div>
    </div>
  );
};
