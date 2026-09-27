import React, { useState, useRef } from 'react';
import { trackGrowthEvent } from '../lib/growth-tracking';

interface GrowthNavProps {
  currentPath?: string;
  isStandaloneApply?: boolean;
}

export const GrowthNav: React.FC<GrowthNavProps> = ({ currentPath = '/growth', isStandaloneApply = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleCtaClick = (label: string, destination: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: label,
      cta_destination: destination,
    });
    setMobileMenuOpen(false);
  };

  return (
    <header className="growth-nav" role="banner">
      <div className="growth-container growth-nav-inner">
        <a
          href="/growth"
          className="growth-brand-lockup"
          aria-label="Dynasty Works Studio Growth Operating System Home"
        >
          <div className="growth-brand-mark" aria-hidden="true">
            {/* Modular Stepped Brand Mark SVG */}
            <svg width="20" height="20" viewBox="0 0 250 150" fill="none">
              <path
                d="M20 125V95H90V60H160V25H230V125Z"
                stroke="#D4B483"
                strokeWidth="12"
                strokeLinejoin="miter"
              />
              <path d="M90 95V125M160 60V125" stroke="#D4B483" strokeWidth="4" />
            </svg>
          </div>
          <div className="growth-brand-text">
            <span className="growth-brand-name">DYNASTY WORKS</span>
            <span className="growth-brand-desc">GROWTH OPERATING SYSTEM</span>
          </div>
        </a>

        {!isStandaloneApply && (
          <nav className="growth-nav-links" aria-label="Funnel Section Navigation">
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
              href="#what-we-build"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Capabilities', '#what-we-build')}
            >
              Capabilities
            </a>
            <a
              href="#live-flow"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Flow', '#live-flow')}
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
              href="#difference"
              className="growth-nav-link"
              onClick={() => handleCtaClick('Nav Compare', '#difference')}
            >
              Compare
            </a>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={isStandaloneApply ? '/growth' : '#apply'}
            className="growth-btn growth-btn-primary"
            onClick={() => handleCtaClick(isStandaloneApply ? 'Back to Overview' : 'Nav Review CTA', isStandaloneApply ? '/growth' : '#apply')}
            style={{ padding: '10px 18px', fontSize: '12px' }}
          >
            {isStandaloneApply ? 'System Overview' : 'REQUEST REVIEW'}
          </a>

          {!isStandaloneApply && (
            <button
              ref={menuButtonRef}
              type="button"
              className="growth-btn growth-btn-secondary"
              style={{ display: 'none', padding: '10px 12px' }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
