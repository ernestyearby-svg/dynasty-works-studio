import React, { useEffect } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

const nextSteps = [
  {
    step: '01',
    title: 'We review your current system.',
    description: 'Our growth architects analyze your provided channels, CRM setup, and lead velocity.',
  },
  {
    step: '02',
    title: 'We identify major gaps.',
    description: 'We pinpoint exact areas of lead leakage, delayed follow-up, and untracked attribution.',
  },
  {
    step: '03',
    title: 'We map the recommended infrastructure.',
    description: 'We construct an end-to-end architecture connecting acquisition, automation, and pipeline stages.',
  },
  {
    step: '04',
    title: 'We discuss priorities and implementation.',
    description: 'During your strategy session, we walk through the blueprint, timelines, and activation scope.',
  },
];

export default function GrowthThankYouPage() {
  useGrowthSeo({
    title: 'Your Growth Review Is In Motion | Dynasty Works Studio',
    description:
      'We have received your growth diagnostic request. Book your strategy session to review your personalized infrastructure roadmap.',
    canonicalPath: '/growth/thank-you',
  });

  useEffect(() => {
    initGrowthTracking();
    trackGrowthEvent('growth_thank_you_view', { page: '/growth/thank-you' });
  }, []);

  const handleCtaClick = () => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: 'Thank You Book Strategy Call',
      cta_destination: '/growth/book',
    });
  };

  return (
    <div className="growth-root growth-theme-dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GrowthNav currentPath="/growth/thank-you" isStandaloneApply={true} />

      <main id="main-content" style={{ flex: 1, padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '860px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              APPLICATION CONFIRMED
            </span>
            <h1 className="growth-lead-title" style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Your growth review<br />
              <em>is in motion.</em>
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 36px' }}>
              We’ve received your information. The next step is mapping your current acquisition, follow-up
              and sales infrastructure so we can identify where opportunities may be getting lost.
            </p>

            <a
              href="/growth/book"
              className="growth-btn growth-btn-signal"
              onClick={handleCtaClick}
              style={{ padding: '18px 36px', fontSize: '13px' }}
            >
              <span>BOOK YOUR STRATEGY CALL</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>

          {/* WHAT HAPPENS NEXT */}
          <div style={{ maxWidth: '1000px', margin: '80px auto 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--dws-signal)',
                }}
              >
                THE PROCESS
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 500, color: '#ffffff', margin: '8px 0 0', letterSpacing: '-0.03em' }}>
                WHAT HAPPENS NEXT
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {nextSteps.map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: '#111417',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--dws-font-serif)',
                        fontSize: '32px',
                        fontStyle: 'italic',
                        color: 'var(--dws-signal)',
                        display: 'block',
                        marginBottom: '12px',
                        lineHeight: 1,
                      }}
                    >
                      {item.step}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '8px', lineHeight: '1.4' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#8d909c', lineHeight: '1.6', margin: '12px 0 0' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a
                href="/growth/book"
                className="growth-btn growth-btn-outline-dark"
                onClick={handleCtaClick}
                style={{ fontSize: '11px', minHeight: '48px' }}
              >
                <span>ADVANCE TO CALENDAR SCHEDULE</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <GrowthFooter />
    </div>
  );
}
