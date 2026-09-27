import React, { useState } from 'react';

interface SystemNode {
  id: string;
  step: string;
  name: string;
  subtext: string;
  protocol: string;
  status: string;
  telemetry: string;
}

const systemNodes: SystemNode[] = [
  {
    id: 'ads',
    step: '01',
    name: 'ADS',
    subtext: 'Meta & Google Paid Acquisition',
    protocol: 'CAPI & Enhanced Conversions',
    status: 'ACTIVE',
    telemetry: 'Real-time Bidding',
  },
  {
    id: 'landing-page',
    step: '02',
    name: 'LANDING PAGE',
    subtext: 'High-Converting Web Experience',
    protocol: 'Edge-Rendered · 0.4s LCP',
    status: 'ONLINE',
    telemetry: 'Dynamic Parameter Injection',
  },
  {
    id: 'lead',
    step: '03',
    name: 'LEAD',
    subtext: 'Verified Inquiry Capture',
    protocol: 'Honeypot + Strict Schema',
    status: 'CAPTURED',
    telemetry: 'Instant Attribution Stamp',
  },
  {
    id: 'crm',
    step: '04',
    name: 'CRM',
    subtext: 'Centralized Opportunity Hub',
    protocol: 'Two-Way Sync · Deduplication',
    status: 'ROUTED',
    telemetry: 'Pipeline Stage Automation',
  },
  {
    id: 'follow-up',
    step: '05',
    name: 'AUTOMATED FOLLOW-UP',
    subtext: 'Instant SMS & Email Sequences',
    protocol: 'Sub-60s SLA Response',
    status: 'TRIGGERED',
    telemetry: 'Multi-Channel Conversational AI',
  },
  {
    id: 'appointment',
    step: '06',
    name: 'APPOINTMENT',
    subtext: 'Direct Calendar Booking',
    protocol: 'Live Calendar Availability',
    status: 'SCHEDULED',
    telemetry: 'No-Show Recovery Workflows',
  },
  {
    id: 'customer',
    step: '07',
    name: 'CUSTOMER',
    subtext: 'Closed Qualified Sale',
    protocol: 'POS / Stripe Reconciliation',
    status: 'CONVERTED',
    telemetry: 'High-Value Client Onboarding',
  },
  {
    id: 'revenue',
    step: '08',
    name: 'REVENUE',
    subtext: 'Closed-Loop Attribution',
    protocol: 'Multi-Touch ROAS Model',
    status: 'ATTRIBUTED',
    telemetry: 'Executive KPI Dashboard',
  },
];

export const GrowthSystemDiagram: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('lead');

  const activeNode = systemNodes.find((n) => n.id === activeNodeId) || systemNodes[2];

  return (
    <div className="growth-system-map" aria-label="Dynasty Growth Operating System Pipeline Map">
      <div className="growth-map-header">
        <div className="growth-map-title">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              display: 'inline-block',
              boxShadow: '0 0 8px #4ade80',
            }}
            aria-hidden="true"
          />
          PROPRIETARY OPERATING ENGINE · V1.0
        </div>
        <div className="growth-map-badge">PIPELINE SYNCHRONIZED</div>
      </div>

      {/* Nodes Pipeline */}
      <div className="growth-flow-nodes" role="list">
        {systemNodes.map((node, index) => {
          const isActive = node.id === activeNodeId;
          return (
            <React.Fragment key={node.id}>
              <div
                role="listitem"
                tabIndex={0}
                className={`growth-flow-node ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNodeId(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveNodeId(node.id);
                  }
                }}
                style={{ cursor: 'pointer' }}
                aria-label={`${node.step} ${node.name}: ${node.subtext}`}
              >
                <div className="growth-node-left">
                  <span className="growth-node-num">{node.step}</span>
                  <div>
                    <span className="growth-node-name">{node.name}</span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--dws-text-muted)',
                        marginTop: '1px',
                      }}
                    >
                      {node.subtext}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: isActive ? 'var(--dws-champagne)' : 'var(--dws-stone)',
                      display: 'block',
                    }}
                  >
                    {node.status}
                  </span>
                  <span className="growth-node-status">{node.protocol}</span>
                </div>
              </div>
              {index < systemNodes.length - 1 && (
                <div className="growth-node-arrow" aria-hidden="true">
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Node Telemetry Card */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: 'var(--dws-radius-sm)',
          border: '1px solid rgba(212, 180, 131, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--dws-champagne)', textTransform: 'uppercase' }}>
            NODE TELEMETRY · STAGE {activeNode.step}
          </span>
          <span style={{ fontSize: '11px', color: '#4ade80', fontFamily: 'monospace' }}>● ACTIVE STREAM</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--dws-bone)', fontWeight: 600 }}>
          {activeNode.name} — {activeNode.subtext}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--dws-text-muted)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>Architecture: <strong style={{ color: 'var(--dws-champagne-light)' }}>{activeNode.protocol}</strong></span>
          <span>Throughput: <strong style={{ color: 'var(--dws-champagne-light)' }}>{activeNode.telemetry}</strong></span>
        </div>
      </div>
    </div>
  );
};
