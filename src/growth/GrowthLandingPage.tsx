import React, { useEffect } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { GrowthSystemDiagram } from './components/GrowthSystemDiagram';
import { ProblemCards } from './components/ProblemCards';
import { SystemArchitecture } from './components/SystemArchitecture';
import { WhatWeBuild } from './components/WhatWeBuild';
import { FunnelFlow } from './components/FunnelFlow';
import { VerticalsSection } from './components/VerticalCard';
import { DifferenceComparison } from './components/DifferenceComparison';
import { ModernTechGrid } from './components/ModernTechGrid';
import { LeadApplicationForm } from './components/LeadApplicationForm';
import { GrowthFooter } from './components/GrowthFooter';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthLandingPage() {
  useGrowthSeo({
    title: 'AI Growth Systems | Dynasty Works Studio',
    description:
      'Dynasty Works Studio builds connected growth infrastructure across websites, lead generation, CRM, automation, advertising and analytics.',
    canonicalPath: '/growth',
  });

  useEffect(() => {
    initGrowthTracking();
    trackGrowthEvent('growth_page_view', { page: '/growth' });
  }, []);

  const handleCtaClick = (label: string, destination: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: label,
      cta_destination: destination,
    });
  };

  return (
    <div className="growth-root">
      <GrowthNav currentPath="/growth" />

      <main id="main-content">
        {/* 01 — HERO (DARK OBSIDIAN) */}
        <section className="growth-section-editorial growth-theme-dark" aria-labelledby="hero-headline">
          <div className="growth-container">
            <div className="growth-hero-grid">
              <div>
                <span className="growth-eyebrow">DYNASTY GROWTH OPERATING SYSTEM</span>
                <h1 id="hero-headline" className="growth-lead-title" style={{ fontSize: 'clamp(44px, 6vw, 92px)' }}>
                  TURN ATTENTION INTO<br />
                  <em>MEASURABLE GROWTH.</em>
                </h1>
                <p className="growth-sub">
                  Dynasty Works Studio builds the infrastructure connecting your website, advertising,
                  CRM, automated follow-up and sales pipeline—so leads don’t disappear between the click
                  and the close.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '36px' }}>
                  <a
                    href="#diagnostic"
                    className="growth-btn growth-btn-signal"
                    onClick={() => handleCtaClick('Hero Primary CTA', '#diagnostic')}
                  >
                    <span>BUILD MY GROWTH SYSTEM</span>
                    <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="#system"
                    className="growth-btn growth-btn-outline-dark"
                    onClick={() => handleCtaClick('Hero Secondary CTA', '#system')}
                  >
                    <span>SEE HOW IT WORKS</span>
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.12em', color: '#6a6e7b', textTransform: 'uppercase' }}>
                  <span>Strategy</span> · <span>Infrastructure</span> · <span>Automation</span> · <span>Acquisition</span> · <span>Intelligence</span>
                </div>
              </div>

              {/* Elevated Architectural Operating Diagram */}
              <div>
                <GrowthSystemDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* 02 — THE PROBLEM (LIGHT WARM PAPER) */}
        <ProblemCards />

        {/* 03 — ONE CONNECTED INFRASTRUCTURE (DARK OBSIDIAN) */}
        <SystemArchitecture />

        {/* 04 — WHAT WE BUILD (LIGHT WARM PAPER) */}
        <WhatWeBuild />

        {/* 05 — LIVE FLOW (DARK OBSIDIAN) */}
        <FunnelFlow />

        {/* 06 — VERTICALS (LIGHT WARM PAPER) */}
        <VerticalsSection />

        {/* 07 — COMPARISON (DARK OBSIDIAN) */}
        <DifferenceComparison />

        {/* 08 — MODERN INFRASTRUCTURE (LIGHT WARM PAPER) */}
        <ModernTechGrid />

        {/* 09 — GROWTH REVIEW DIAGNOSTIC (DARK OBSIDIAN) */}
        <section id="diagnostic" className="growth-section-editorial growth-theme-dark" aria-labelledby="diagnostic-heading">
          <div className="growth-container">
            <div style={{ maxWidth: '860px', margin: '0 auto 36px', textAlign: 'center' }}>
              <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>DIAGNOSTIC ASSESSMENT</span>
              <h2 id="diagnostic-heading" className="growth-lead-title" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}>
                Let’s find the leak in<br />
                <em>your growth system.</em>
              </h2>
              <p className="growth-sub" style={{ margin: '0 auto' }}>
                Complete this 5-step diagnostic. We will review your current customer journey, pinpoint
                drop-offs, and construct a connected operating system.
              </p>
            </div>

            <LeadApplicationForm onSuccessRedirect="/growth/book" />
          </div>
        </section>
      </main>

      <GrowthFooter />
    </div>
  );
}
