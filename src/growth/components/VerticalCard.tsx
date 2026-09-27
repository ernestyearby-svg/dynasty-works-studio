import React from 'react';

export interface VerticalData {
  id: string;
  name: string;
  category: string;
  funnelSteps: string[];
  focus: string;
  architectureNotes: string;
}

export const verticals: VerticalData[] = [
  {
    id: 'automotive',
    name: 'AUTOMOTIVE',
    category: 'Dealerships & Luxury Pre-Owned',
    funnelSteps: [
      'Inventory / Finance Ad',
      'Vehicle Detail Landing Page',
      'Finance / Trade-In Lead',
      'Instant BDC Follow-Up',
      'Test Drive Appointment',
      'Showroom Deal Closed',
    ],
    focus: 'Inventory match, trade-in valuation, and fast BDC response protocols.',
    architectureNotes: 'Dynamic inventory sync, finance pre-qualification hooks, and CRM showroom scheduling.',
  },
  {
    id: 'medspa',
    name: 'MEDSPA / AESTHETICS',
    category: 'Aesthetic Clinics & Medical Spas',
    funnelSteps: [
      'Treatment-Specific Ad',
      'Clinical Consultation Page',
      'Consultation Inquiry',
      'SMS Nurture & Education',
      'Calendar Consultation Booking',
      'Treatment Protocol Initiated',
    ],
    focus: 'Treatment education, high-trust qualification, and no-show prevention.',
    architectureNotes: 'Automated 2-way SMS consultation reminders, treatment prep guides, and VIP reactivation.',
  },
  {
    id: 'fitness',
    name: 'FITNESS / GYMS',
    category: 'Boutique Studios & Performance Centers',
    funnelSteps: [
      'Trial / Assessment Ad',
      'High-Conversion Offer Page',
      'Trial Pass Lead Captured',
      'Sub-60s SMS Follow-Up',
      'First Gym Visit Scheduled',
      'Recurring Membership Sale',
    ],
    focus: 'Speed-to-lead response, trial-to-visit velocity, and automated re-engagement.',
    architectureNotes: 'Instant pass delivery via SMS, coach notification, and attendance accountability loops.',
  },
  {
    id: 'hospitality',
    name: 'HOSPITALITY / RESTAURANTS',
    category: 'Fine Dining & Private Events',
    funnelSteps: [
      'Private Dining / Event Ad',
      'Event Showcase Experience',
      'Private Booking Inquiry',
      'Event Specialist Outreach',
      'Tasting / Reservation Confirmed',
      'High-Ticket Event Executed',
    ],
    focus: 'Private dining inquiries, catering packages, and repeat corporate bookings.',
    architectureNotes: 'Automated date availability check, catering brochure delivery, and deposit collection.',
  },
  {
    id: 'professional-services',
    name: 'PROFESSIONAL SERVICES',
    category: 'Legal, Advisory, Consulting & Wealth',
    funnelSteps: [
      'Authority / Advisory Ad',
      'Executive Case Study Page',
      'Confidential Audit Request',
      'Consultant Follow-Up',
      'Discovery Consultation',
      'Retained Advisory Client',
    ],
    focus: 'High-trust positioning, discretion, and strategic qualification.',
    architectureNotes: 'Strict confidential forms, calendar scheduling buffers, and NDA document delivery.',
  },
  {
    id: 'consumer-brands',
    name: 'CONSUMER BRANDS',
    category: 'Direct-to-Consumer & Omnichannel',
    funnelSteps: [
      'Hero Product Acquisition Ad',
      'Frictionless Bundle Landing Page',
      'VIP Lead / Cart Initiated',
      'Abandoned Flow Recovery',
      'First Transaction Completed',
      'Loyalty & Repeat Purchase Cycle',
    ],
    focus: 'First-order conversion velocity, SMS cart recovery, and customer lifetime value.',
    architectureNotes: 'Klaviyo/SMS marketing integration, one-click checkout, and post-purchase review capture.',
  },
];

export const VerticalCard: React.FC<{ vertical: VerticalData }> = ({ vertical }) => {
  return (
    <article className="growth-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dws-champagne)', fontWeight: 700 }}>
            {vertical.name}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--dws-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {vertical.category}
          </span>
        </div>

        <h3 className="growth-h3" style={{ fontSize: '18px', marginBottom: '16px' }}>
          {vertical.name}
        </h3>

        {/* Tailored Funnel Pathway */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--dws-radius-sm)',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--dws-champagne)',
              marginBottom: '10px',
            }}
          >
            SAMPLE CONVERSION FUNNEL:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {vertical.funnelSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ fontFamily: 'monospace', color: 'var(--dws-text-dim)', fontSize: '10px' }}>
                  {idx + 1}.
                </span>
                <span style={{ color: idx === vertical.funnelSteps.length - 1 ? 'var(--dws-champagne-light)' : 'var(--dws-bone)', fontWeight: idx === vertical.funnelSteps.length - 1 ? 700 : 500 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', lineHeight: '1.5', margin: '0 0 12px' }}>
          <strong>System Focus:</strong> {vertical.focus}
        </p>
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
        <span style={{ fontSize: '11px', color: 'var(--dws-text-dim)', display: 'block' }}>
          <strong>Architecture:</strong> {vertical.architectureNotes}
        </span>
      </div>
    </article>
  );
};

export const VerticalsSection: React.FC = () => {
  return (
    <section id="verticals" className="growth-section" aria-labelledby="verticals-heading">
      <div className="growth-container">
        <div className="growth-section-header">
          <span className="growth-eyebrow">VERTICAL ADAPTABILITY</span>
          <h2 id="verticals-heading" className="growth-h2">
            Built Around How Your Business Actually Sells.
          </h2>
          <p className="growth-sub">
            Growth infrastructure cannot be one-size-fits-all. Each vertical has distinct buying cycles,
            qualification criteria, and scheduling requirements. We construct systems tailored to your unit economics.
          </p>
        </div>

        <div className="growth-grid-3">
          {verticals.map((vert) => (
            <VerticalCard key={vert.id} vertical={vert} />
          ))}
        </div>
      </div>
    </section>
  );
};
