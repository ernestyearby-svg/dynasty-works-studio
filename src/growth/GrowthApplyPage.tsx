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
    trackGrowthEvent('growth_page_view', { page: '/growth/apply' });
  }, []);

  return (
    <div className="growth-root">
      <GrowthNav currentPath="/growth/apply" isStandaloneApply={true} />

      <main id="main-content" style={{ padding: '60px 0 100px' }}>
        <div className="growth-container">
          <div style={{ maxWidth: '820px', margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              DIRECT SYSTEM APPLICATION
            </span>
            <h1 className="growth-h1" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}>
              Let’s Find the Leak in Your Growth System.
            </h1>
            <p className="growth-sub" style={{ margin: '0 auto 24px' }}>
              Tell us how your business currently generates and manages leads. We’ll use your answers to
              understand where stronger infrastructure may create leverage.
            </p>

            <div
              style={{
                display: 'inline-flex',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'var(--dws-text-muted)',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '999px',
                border: '1px solid var(--dws-surface-border)',
              }}
            >
              <span>🔒 100% Confidential</span>
              <span>⚡ Operator-Grade Review</span>
              <span>🎯 Custom Infrastructure Roadmap</span>
            </div>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <LeadApplicationForm isStandalone={true} onSuccessRedirect="/growth/book" />
          </div>
        </div>
      </main>

      <GrowthFooter />
    </div>
  );
}
