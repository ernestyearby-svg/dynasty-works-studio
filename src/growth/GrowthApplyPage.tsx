import React, { useEffect } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { LeadApplicationForm } from './components/LeadApplicationForm';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthApplyPage() {
  useGrowthSeo({
    title: 'Apply for Growth System Review | Dynasty Works Studio',
    description:
      'Request a diagnostic review of your marketing, CRM, and sales infrastructure. Identify revenue leaks between ad click and close.',
    canonicalPath: '/growth/apply',
  });

  useEffect(() => {
    initGrowthTracking();
    trackGrowthEvent('growth_review_view', { page: '/growth/apply' });
    trackGrowthEvent('growth_page_view', { page: '/growth/apply' });
  }, []);

  return (
    <div className="growth-root growth-theme-dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GrowthNav currentPath="/growth/apply" isStandaloneApply={true} />

      <main id="main-content" style={{ flex: 1, padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '860px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              DIRECT SYSTEM APPLICATION
            </span>
            <h1 className="growth-lead-title" style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Let’s find the leak in<br />
              <em>your growth system.</em>
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 28px' }}>
              Complete this 5-step diagnostic. We will review your current customer journey, pinpoint
              drop-offs, and construct a connected operating system.
            </p>

            <div
              style={{
                display: 'inline-flex',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '11px',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                color: '#8b8e99',
                padding: '10px 24px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span>● 100% CONFIDENTIAL</span>
              <span>● OPERATOR-GRADE ARCHITECTURE</span>
              <span>● TAILORED ROADMAP</span>
            </div>
          </div>

          <LeadApplicationForm isStandalone={true} onSuccessRedirect="/growth/book" />
        </div>
      </main>

      <GrowthFooter />
    </div>
  );
}
