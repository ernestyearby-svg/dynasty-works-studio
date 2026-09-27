import React from 'react';
import { trackGrowthEvent } from '../lib/growth-tracking';

interface GrowthNavProps {
  currentPath?: string;
  isStandaloneApply?: boolean;
}

export const GrowthNav: React.FC<GrowthNavProps> = ({ currentPath = '/growth', isStandaloneApply = false }) => {
  const handleCtaClick = (label: string, destination: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: label,
      cta_destination: destination,
    });
  };

  return (
    <header className="growth-nav-bar" role="banner">
      <div className="growth-container growth-nav-inner">
        <a
          href="/growth"
          className="growth-wordmark"
          aria-label="Dynasty Works Studio Growth Operating System Home"
        >
          <span className="growth-wordmark-title">DYNASTY WORKS STUDIO</span>
          <span className="growth-wordmark-sub">GROWTH OPERATING SYSTEM</span>
        </a>

        {!isStandaloneApply && (
          <nav className="growth-nav-links" aria-label="Funnel Navigation">
            <a
              href="#problem"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Problem', '#problem')}
            >
              The Problem
            </a>
            <a
              href="#system"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav System', '#system')}
            >
              The System
            </a>
            <a
              href="#capabilities"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Capabilities', '#capabilities')}
            >
              Capabilities
            </a>
            <a
              href="#live-flow"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Live Flow', '#live-flow')}
            >
              Live Flow
            </a>
            <a
              href="#verticals"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Verticals', '#verticals')}
            >
              Verticals
            </a>
            <a
              href="#comparison"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Comparison', '#comparison')}
            >
              Comparison
            </a>
          </nav>
        )}

        <div>
          <a
            href={isStandaloneApply ? '/growth' : '#diagnostic'}
            className="growth-btn growth-btn-signal"
            onClick={() => handleCtaClick(isStandaloneApply ? 'Nav Overview' : 'Nav Review CTA', isStandaloneApply ? '/growth' : '#diagnostic')}
            style={{ padding: '12px 20px', minHeight: '44px', fontSize: '11px', gap: '16px' }}
          >
            <span>{isStandaloneApply ? 'Overview' : 'BUILD MY GROWTH SYSTEM'}</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
};
