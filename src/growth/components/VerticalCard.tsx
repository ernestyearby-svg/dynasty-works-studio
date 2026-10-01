import React, { useState } from 'react';

export interface VerticalData {
  id: string;
  name: string;
  category: string;
  statement: string;
  funnelSteps: string[];
  systemFocus: string;
  architectureNotes: string;
}

export const verticals: VerticalData[] = [
  {
    id: 'automotive',
    name: 'AUTOMOTIVE',
    category: 'Dealerships & Luxury Pre-Owned',
    statement: 'Transforming high-intent vehicle shoppers into verified showroom test-drive appointments with automated trade-in valuation follow-up.',
    funnelSteps: [
      'Inventory / Finance Ad',
      'Vehicle Detail Landing Page',
      'Finance / Trade-In Lead',
      'Instant BDC Follow-Up (< 60s)',
      'Test Drive Appointment',
      'Showroom Deal Closed',
    ],
    systemFocus: 'Speed-to-lead BDC response protocols & dynamic inventory matching.',
    architectureNotes: 'Dynamic CRM showroom scheduling with instant SMS trade-in appraisal delivery.',
  },
  {
    id: 'medspa',
    name: 'MEDSPA / AESTHETICS',
    category: 'Aesthetic Clinics & Medical Spas',
    statement: 'Connecting aesthetic treatment marketing directly to booked, confirmed consultations while eliminating consultation no-shows.',
    funnelSteps: [
      'Treatment-Specific Ad',
      'Clinical Consultation Page',
      'Consultation Inquiry Capture',
      'SMS Nurture & Treatment Guide',
      'Calendar Consultation Booking',
      'Treatment Protocol Initiated',
    ],
    systemFocus: 'Clinical credibility, progressive consultation qualification, and zero-leakage follow-up.',
    architectureNotes: 'Automated 2-way SMS consultation reminders, pre-treatment briefings, and VIP reactivation loops.',
  },
  {
    id: 'fitness',
    name: 'FITNESS / GYMS',
    category: 'Boutique Studios & Performance Centers',
    statement: 'Converting local search and social interest into first gym visits within 48 hours, followed by structured membership conversion.',
    funnelSteps: [
      'Trial / Assessment Ad',
      'Dedicated Offer & Intake Page',
      'Trial Pass Lead Captured',
      'Sub-60s SMS Pass Delivery',
      'First Gym Visit Scheduled',
      'Recurring Membership Sale',
    ],
    systemFocus: 'Frictionless pass generation and rapid coach notification to secure the first visit.',
    architectureNotes: 'Instant pass verification via SMS, coach task allocation, and attendance accountability alerts.',
  },
  {
    id: 'hospitality',
    name: 'HOSPITALITY / RESTAURANTS',
    category: 'Fine Dining & Private Events',
    statement: 'Automating private event inquiries, corporate dining reservations, and large-party booking deposits with zero manual delay.',
    funnelSteps: [
      'Private Dining / Event Ad',
      'Event Showcase Experience',
      'Private Booking Inquiry',
      'Event Specialist Outreach',
      'Tasting / Reservation Confirmed',
      'High-Ticket Event Executed',
    ],
    systemFocus: 'Automated private dining brochure delivery and date reservation hold protocols.',
    architectureNotes: 'Automated date availability check, catering brochure delivery, and deposit reconciliation.',
  },
  {
    id: 'professional-services',
    name: 'PROFESSIONAL SERVICES',
    category: 'Legal, Advisory, Consulting & Wealth',
    statement: 'Elevating authority positioning and discrete lead qualification to turn cold inquiries into pre-briefed partner consultations.',
    funnelSteps: [
      'Authority / Advisory Ad',
      'Executive Case Study Page',
      'Confidential Audit Request',
      'Consultant Follow-Up',
      'Discovery Consultation',
      'Retained Advisory Client',
    ],
    systemFocus: 'High-trust positioning, discretion, and strategic qualification.',
    architectureNotes: 'Confidential lead forms, scheduling buffers, and automated NDA/briefing document delivery.',
  },
  {
    id: 'consumer-brands',
    name: 'CONSUMER BRANDS',
    category: 'Direct-to-Consumer & Omnichannel',
    statement: 'Driving immediate first-order conversion velocity, high cart recovery rates, and automated post-purchase repeat loyalty loops.',
    funnelSteps: [
      'Hero Product Acquisition Ad',
      'Frictionless Bundle Landing Page',
      'VIP Lead / Cart Initiated',
      'Abandoned Flow Recovery',
      'First Transaction Completed',
      'Loyalty & Repeat Purchase Cycle',
    ],
    systemFocus: 'First-order conversion velocity, SMS cart recovery, and customer lifetime value.',
    architectureNotes: 'E-commerce webhook integration, one-click checkout, and post-purchase review capture.',
  },
];

export const VerticalCard: React.FC<{ vertical: VerticalData }> = ({ vertical }) => {
  return (
    <div className="growth-vertical-journey-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {vertical.category}
          </span>
          <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 500, letterSpacing: '-0.03em', margin: '6px 0 0' }}>
            {vertical.name}
          </h3>
        </div>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dws-muted)' }}>
          TAILORED OPERATING BLUEPRINT
        </span>
      </div>

      <p style={{ fontSize: '16px', color: 'var(--dws-muted)', lineHeight: '1.6', margin: '0 0 32px', maxWidth: '60ch' }}>
        {vertical.statement}
      </p>

      {/* Sequential Journey Pathway */}
      <div style={{ borderTop: '1px solid var(--dws-line-light)', paddingTop: '28px', marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-ink)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
          SAMPLE CUSTOMER CONVERSION JOURNEY:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {vertical.funnelSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--dws-paper)',
                border: '1px solid var(--dws-line-light)',
                padding: '16px',
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--dws-signal)', display: 'block', marginBottom: '6px' }}>
                STAGE 0{idx + 1}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dws-ink)', lineHeight: '1.4' }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Focus & Architecture Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px dashed var(--dws-line-light)', paddingTop: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            SYSTEM FOCUS:
          </span>
          <span style={{ fontSize: '13px', color: 'var(--dws-ink)' }}>{vertical.systemFocus}</span>
        </div>
        <div>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            ARCHITECTURE SPECIFICATION:
          </span>
          <span style={{ fontSize: '13px', color: 'var(--dws-ink)' }}>{vertical.architectureNotes}</span>
        </div>
      </div>
    </div>
  );
};

export const VerticalsSection: React.FC = () => {
  const [selectedVerticalId, setSelectedVerticalId] = useState(verticals[0].id);
  const activeVertical = verticals.find((v) => v.id === selectedVerticalId) || verticals[0];

  return (
    <section id="verticals" className="growth-section-editorial growth-theme-light" aria-labelledby="verticals-heading">
      <div className="growth-container">
        <div>
          <span className="growth-eyebrow">VERTICAL ADAPTATION</span>
          <h2 id="verticals-heading" className="growth-lead-title">
            Built around how your<br />
            <em>business actually sells.</em>
          </h2>
          <p className="growth-sub">
            Growth infrastructure cannot be generic. Each vertical requires custom conversion flows, qualification
            rules, and follow-up protocols. Select an industry to review its journey:
          </p>
        </div>

        {/* 6 Premium Horizontal Selectors */}
        <div className="growth-verticals-selector" role="tablist" aria-label="Vertical Selectors">
          {verticals.map((vert) => {
            const isActive = vert.id === selectedVerticalId;
            return (
              <button
                key={vert.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`growth-vertical-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedVerticalId(vert.id)}
              >
                {vert.name}
              </button>
            );
          })}
        </div>

        {/* Selected Customer Journey View */}
        <VerticalCard vertical={activeVertical} />
      </div>
    </section>
  );
};
