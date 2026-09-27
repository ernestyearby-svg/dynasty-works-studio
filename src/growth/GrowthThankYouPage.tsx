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
    <div className="growth-root">
      <GrowthNav currentPath="/growth/thank-you" isStandaloneApply={true} />

      <main id="main-content" style={{ padding: '60px 0 100px' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '820px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              APPLICATION RECEIVED · CONFIRMATION
            </span>
            <h1 className="growth-h1" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)' }}>
              Your Growth Review Is In Motion.
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 32px' }}>
              We’ve received your information. The next step is mapping your current acquisition, follow-up
              and sales infrastructure so we can identify where opportunities may be getting lost.
            </p>

            <a
              href="/growth/book"
              className="growth-btn growth-btn-primary"
              onClick={handleCtaClick}
              style={{ padding: '16px 36px', fontSize: '14px', letterSpacing: '0.1em' }}
            >
              BOOK YOUR STRATEGY CALL →
            </a>
          </div>

          {/* WHAT HAPPENS NEXT */}
          <div style={{ maxWidth: '900px', margin: '60px auto 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--dws-champagne)',
                }}
              >
                THE PROCESS
              </span>
              <h2 className="growth-h2" style={{ fontSize: '26px', marginTop: '6px' }}>
                WHAT HAPPENS NEXT
              </h2>
            </div>

            <div className="growth-grid-4">
              {nextSteps.map((item) => (
                <div
                  key={item.step}
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
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: 'var(--dws-champagne)',
                        marginBottom: '12px',
                      }}
                    >
                      {item.step}
                    </div>
                    <h3 className="growth-h3" style={{ fontSize: '16px', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--dws-text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a
                href="/growth/book"
                className="growth-btn growth-btn-secondary"
                onClick={handleCtaClick}
              >
                SELECT A STRATEGY CALL TIME SLOT
              </a>
            </div>
          </div>
        </div>
      </main>

      <GrowthFooter />
    </div>
  );
}
