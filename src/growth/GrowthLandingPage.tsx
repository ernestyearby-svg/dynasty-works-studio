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
        {/* SECTION 01 — HERO */}
        <section className="growth-hero" aria-labelledby="hero-headline">
          <div className="growth-container">
            <div className="growth-hero-grid">
              <div>
                <span className="growth-eyebrow">DYNASTY GROWTH OPERATING SYSTEM</span>
                <h1 id="hero-headline" className="growth-h1">
                  Turn Attention Into<br />
                  <em>Measurable Growth.</em>
                </h1>
                <p className="growth-sub">
                  Dynasty Works Studio builds the infrastructure connecting your website, advertising,
                  CRM, automated follow-up and sales pipeline—so leads don’t disappear between the click
                  and the close.
                </p>

                <div className="growth-hero-actions">
                  <a
                    href="#apply"
                    className="growth-btn growth-btn-primary"
                    onClick={() => handleCtaClick('Hero Primary CTA', '#apply')}
                  >
                    BUILD MY GROWTH SYSTEM
                  </a>
                  <a
                    href="#system"
                    className="growth-btn growth-btn-secondary"
                    onClick={() => handleCtaClick('Hero Secondary CTA', '#system')}
                  >
                    SEE HOW IT WORKS
                  </a>
                </div>

                <div className="growth-microcopy" aria-label="Core Capabilities">
                  <span>Strategy</span> • <span>Infrastructure</span> • <span>Automation</span> • <span>Acquisition</span> • <span>Intelligence</span>
                </div>
              </div>

              {/* Hero Visual System Map */}
              <div>
                <GrowthSystemDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02 — THE PROBLEM */}
        <ProblemCards />

        {/* SECTION 03 — THE SYSTEM */}
        <SystemArchitecture />

        {/* SECTION 04 — WHAT WE BUILD */}
        <WhatWeBuild />

        {/* SECTION 05 — LIVE FLOW */}
        <FunnelFlow />

        {/* SECTION 06 — VERTICALS */}
        <VerticalsSection />

        {/* SECTION 07 — DIFFERENCE */}
        <DifferenceComparison />

        {/* SECTION 08 — TECHNOLOGY */}
        <ModernTechGrid />

        {/* SECTION 09 — APPLICATION */}
        <section id="apply" className="growth-section" aria-labelledby="application-heading">
          <div className="growth-container">
            <div className="growth-section-header" style={{ maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
              <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>DIAGNOSTIC AUDIT</span>
              <h2 id="application-heading" className="growth-h2">
                Let’s Find the Leak in Your Growth System.
              </h2>
              <p className="growth-sub" style={{ margin: '0 auto' }}>
                Tell us how your business currently generates and manages leads. We’ll use your answers to
                understand where stronger infrastructure may create leverage.
              </p>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <LeadApplicationForm onSuccessRedirect="/growth/book" />
            </div>
          </div>
        </section>
      </main>

      <GrowthFooter />
    </div>
  );
}
