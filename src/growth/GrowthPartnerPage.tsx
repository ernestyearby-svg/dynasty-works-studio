import React, { useEffect, useState } from 'react';
import './growth.css';
import './growth-partner.css';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthPartnerPage() {
  useGrowthSeo({
    title: 'Growth Engine | Dynasty Works Studio',
    description:
      'Turnkey client-acquisition infrastructure engineered, deployed, and managed by Dynasty Works Studio. Exclusive founding partner offer for the first 5 businesses.',
    canonicalPath: '/growth-engine',
  });

  const [applyUrl, setApplyUrl] = useState('/growth/apply');

  useEffect(() => {
    // 1. Initialize attribution persistence engine (captures UTMs, fbclid, gclid, referrers)
    initGrowthTracking();

    // 2. Fire canonical landing and campaign tracking events
    trackGrowthEvent('growth_page_view', { page: '/growth-engine' });
    trackGrowthEvent('growth_engine_landing_view', {
      page: '/growth-engine',
      metadata: { offer: 'founding_growth_partner_cohort' },
    });

    // 3. Preserve query string for seamless conversion attribution passing
    if (typeof window !== 'undefined' && window.location.search) {
      setApplyUrl(`/growth/apply${window.location.search}`);
    }
  }, []);

  const handleCtaClick = (locationTag: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: 'REQUEST MY FREE GROWTH REVIEW',
      cta_destination: '/growth/apply',
      metadata: { location: locationTag },
    });
  };

  return (
    <div className="growth-root growth-partner-page">
      {/* ==================================================================
          MINIMAL HEADER — No distracting navigation. Logo links to homepage.
          ================================================================== */}
      <header className="growth-partner-header" role="banner">
        <div className="growth-container growth-partner-header-inner">
          <a
            href="/"
            className="growth-partner-brand"
            aria-label="Dynasty Works Studio Homepage"
          >
            <span className="growth-partner-brand-name">DYNASTY WORKS STUDIO</span>
            <span className="growth-partner-brand-sub">// GROWTH ENGINE</span>
          </a>

          <a
            href={applyUrl}
            className="growth-partner-header-cta"
            onClick={() => handleCtaClick('Header CTA')}
          >
            <span>REQUEST MY FREE GROWTH REVIEW</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ==================================================================
            01 — HERO & FOUNDING PARTNER OFFER
            ================================================================== */}
        <section className="growth-partner-hero" aria-labelledby="offer-heading">
          <div className="growth-container">
            <div className="growth-partner-hero-content">
              <div className="growth-partner-badge">
                <span>FOUNDING PARTNER OFFER · FIRST 5 BUSINESSES</span>
              </div>

              <h1 id="offer-heading" className="growth-partner-title">
                Founding Growth Partner —<br />
                <em>First 5 Businesses</em>
              </h1>

              <p className="growth-partner-subtitle">
                A turnkey client-acquisition system engineered, deployed, and managed by Dynasty Works Studio.
                We build the infrastructure between paid attention and booked clients.
              </p>

              {/* Pricing Box */}
              <div className="growth-partner-pricing-box">
                <div className="growth-partner-pricing-header">
                  FOUNDING PARTNER ALLOCATION
                </div>

                <div className="growth-partner-price-row">
                  <div className="growth-partner-price-item">
                    <span className="growth-partner-amount">$2,500</span>
                    <span className="growth-partner-period">Implementation</span>
                  </div>

                  <span className="growth-partner-price-divider" aria-hidden="true">—</span>

                  <div className="growth-partner-price-item">
                    <span className="growth-partner-amount">
                      $997 <span className="growth-partner-amount-sub">/ month</span>
                    </span>
                    <span className="growth-partner-period">Growth Engine management</span>
                  </div>
                </div>

                <div className="growth-partner-ad-budget-note">
                  Advertising spend, communication usage and applicable third-party software charges are separate.
                </div>

                <div>
                  <a
                    href={applyUrl}
                    className="growth-partner-main-cta"
                    onClick={() => handleCtaClick('Hero Pricing Card CTA')}
                  >
                    <span>REQUEST MY FREE GROWTH REVIEW</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>

                <div className="growth-partner-contract-terms">
                  <span>● No long-term contract</span>
                  <span>● 30-day cancellation</span>
                  <span>● Dedicated studio engineering</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            02 — LIVE SYSTEM STATUS STRIP
            ================================================================== */}
        <section className="growth-partner-status-strip" aria-label="Live System Status">
          <div className="growth-container">
            <div className="growth-status-strip-inner">
              <div className="growth-status-header-tag">
                <span className="growth-status-pulse-dot" aria-hidden="true"></span>
                <span className="growth-status-pulse-text">OPERATIONAL SYSTEM ARCHITECTURE</span>
              </div>

              <div className="growth-status-grid">
                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">LANDING PAGE</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">LIVE</span>
                </div>

                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">CRM PIPELINE</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">CONNECTED</span>
                </div>

                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">LEAD ROUTING</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">AUTOMATED</span>
                </div>

                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">FOLLOW-UP</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">ACTIVE</span>
                </div>

                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">BOOKING</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">CONNECTED</span>
                </div>

                <div className="growth-status-pill">
                  <span className="growth-status-dot" aria-hidden="true"></span>
                  <span className="growth-status-name">ATTRIBUTION</span>
                  <span className="growth-status-dash">—</span>
                  <span className="growth-status-state">TRACKED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            03 — WHERE REVENUE LEAKS
            ================================================================== */}
        <section className="growth-partner-leaks-section" aria-labelledby="leaks-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">CONVERSION VULNERABILITIES</span>
              <h2 id="leaks-heading" className="growth-partner-section-title">
                Where Revenue Leaks
              </h2>
              <p className="growth-partner-section-desc">
                Most businesses do not have a traffic generation problem. They have structural friction between the initial click and the confirmed customer.
              </p>
            </div>

            <div className="growth-partner-leaks-grid">
              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">01</div>
                <p className="growth-partner-leak-text">Traffic arrives but follow-up is too slow.</p>
              </div>

              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">02</div>
                <p className="growth-partner-leak-text">Leads live across disconnected systems.</p>
              </div>

              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">03</div>
                <p className="growth-partner-leak-text">Nobody clearly owns the next action.</p>
              </div>

              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">04</div>
                <p className="growth-partner-leak-text">Prospects disappear before booking.</p>
              </div>

              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">05</div>
                <p className="growth-partner-leak-text">No-shows destroy appointment economics.</p>
              </div>

              <div className="growth-partner-leak-card">
                <div className="growth-partner-leak-num">06</div>
                <p className="growth-partner-leak-text">Reporting can't connect spend to revenue.</p>
              </div>
            </div>

            <div className="growth-partner-leak-closing-wrap">
              <div className="growth-partner-leak-closing">
                DWS connects the gaps.
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            04 — EVERYTHING A LEAD TOUCHES (CONNECTED-SYSTEM VISUALIZATION)
            ================================================================== */}
        <section className="growth-partner-touches-section" aria-labelledby="touches-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">UNIFIED PIPELINE INFRASTRUCTURE</span>
              <h2 id="touches-heading" className="growth-partner-section-title">
                Everything A Lead Touches
              </h2>
              <p className="growth-partner-section-desc">
                From first impression to closed revenue, every touchpoint operates within a single connected architecture.
              </p>
            </div>

            <div className="growth-partner-chain-wrapper" role="region" aria-label="System Workflow Chain">
              <div className="growth-partner-chain">
                <div className="growth-chain-node">
                  <span className="growth-chain-title">META</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">GOOGLE</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">LANDING PAGE</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">FORM</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node highlight">
                  <span className="growth-chain-title">CRM</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">FOLLOW-UP</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">CALENDAR</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node highlight">
                  <span className="growth-chain-title">PIPELINE</span>
                </div>
                <span className="growth-chain-arrow" aria-hidden="true">→</span>

                <div className="growth-chain-node">
                  <span className="growth-chain-title">REPORTING</span>
                </div>
              </div>
            </div>

            <div className="growth-partner-touches-statement">
              One contact. One history. One accountable next step.
            </div>
          </div>
        </section>

        {/* ==================================================================
            05 — WHAT'S INCLUDED (11 CORE SYSTEMS) + RISK-REVERSAL BLOCK
            ================================================================== */}
        <section className="growth-partner-included-section" aria-labelledby="included-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">COMPLETE ACQUISITION ARCHITECTURE</span>
              <h2 id="included-heading" className="growth-partner-section-title">
                Everything required to convert traffic into clients.
              </h2>
              <p className="growth-partner-section-desc">
                We do not sell isolated marketing tactics. We engineer and manage a cohesive, end-to-end client conversion engine.
              </p>
            </div>

            <div className="growth-partner-included-grid">
              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">01 / 11</div>
                <h3 className="growth-partner-card-title">Landing page</h3>
                <p className="growth-partner-card-desc">
                  High-converting, mobile-first acquisition page engineered for fast loading speeds and direct conversion velocity.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">02 / 11</div>
                <h3 className="growth-partner-card-title">CRM setup</h3>
                <p className="growth-partner-card-desc">
                  Centralized customer relationship architecture configured to track contacts, conversation histories, and engagement data.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">03 / 11</div>
                <h3 className="growth-partner-card-title">Pipeline</h3>
                <p className="growth-partner-card-desc">
                  Custom deal stages mapping every prospect milestone from initial inquiry to booked consultation and signed client.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">04 / 11</div>
                <h3 className="growth-partner-card-title">Lead automation</h3>
                <p className="growth-partner-card-desc">
                  Instant webhook routing, multi-channel notifications, and immediate lead dispatching so opportunities are never lost.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">05 / 11</div>
                <h3 className="growth-partner-card-title">Calendar</h3>
                <p className="growth-partner-card-desc">
                  Frictionless client scheduling with intelligent timezone detection, automatic buffer times, and calendar sync.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">06 / 11</div>
                <h3 className="growth-partner-card-title">Confirmation sequences</h3>
                <p className="growth-partner-card-desc">
                  Automated email and SMS confirmations delivering immediate receipt verification and clear call preparation instructions.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">07 / 11</div>
                <h3 className="growth-partner-card-title">Reminder sequences</h3>
                <p className="growth-partner-card-desc">
                  Timed 24-hour and 2-hour appointment reminders engineered to maximize attendance and eliminate prospect no-shows.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">08 / 11</div>
                <h3 className="growth-partner-card-title">Analytics/event tracking</h3>
                <p className="growth-partner-card-desc">
                  Google Analytics 4 and server-side tracking layer recording funnel progression from page view to completed booking.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">09 / 11</div>
                <h3 className="growth-partner-card-title">Attribution</h3>
                <p className="growth-partner-card-desc">
                  Persistent UTM parameter and campaign tracking ensuring you know exactly which channel, ad, or keyword produced each lead.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">10 / 11</div>
                <h3 className="growth-partner-card-title">Monthly optimization</h3>
                <p className="growth-partner-card-desc">
                  Continuous conversion rate optimization, creative iteration, funnel refinements, and conversion analysis every month.
                </p>
              </div>

              <div className="growth-partner-included-card">
                <div className="growth-partner-card-number">11 / 11</div>
                <h3 className="growth-partner-card-title">DWS system support</h3>
                <p className="growth-partner-card-desc">
                  Dedicated engineering support, infrastructure monitoring, and active technical maintenance by Dynasty Works Studio.
                </p>
              </div>
            </div>

            {/* Risk-Reversal Block */}
            <div className="growth-partner-commitment-box">
              <div className="growth-partner-commitment-badge">
                <span>GUARANTEED DELIVERY STANDARD</span>
              </div>
              <h3 className="growth-partner-commitment-title">
                Infrastructure Launch Commitment
              </h3>
              <p className="growth-partner-commitment-text">
                If DWS does not launch the agreed Growth Engine within 14 business days after receiving all required client assets, access, approvals and information, the client's next management month is credited.
              </p>
              <div className="growth-partner-commitment-notes">
                <span>● No long-term contract required. Cancel anytime.</span>
                <span>● Transparent infrastructure delivery: We do not promise speculative lead volume, revenue, ROAS or arbitrary business results. We guarantee reliable, verified client-acquisition infrastructure and execution.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            06 — DWS DELIVERY METHOD
            ================================================================== */}
        <section className="growth-partner-method-section" aria-labelledby="method-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">EXECUTION DISCIPLINE</span>
              <h2 id="method-heading" className="growth-partner-section-title">
                From Diagnosis To A Working Growth Engine
              </h2>
              <p className="growth-partner-section-desc">
                A structured, four-phase delivery framework ensuring absolute technical precision before any public traffic is launched.
              </p>
            </div>

            <div className="growth-partner-method-grid">
              <div className="growth-partner-method-card">
                <div className="growth-partner-method-step">01 — Diagnose</div>
                <h3 className="growth-partner-method-title">System Analysis</h3>
                <p className="growth-partner-method-desc">
                  Map the funnel, sales process and leakage points.
                </p>
              </div>

              <div className="growth-partner-method-card">
                <div className="growth-partner-method-step">02 — Build</div>
                <h3 className="growth-partner-method-title">Architecture Deployment</h3>
                <p className="growth-partner-method-desc">
                  Create the Growth Engine in staging.
                </p>
              </div>

              <div className="growth-partner-method-card">
                <div className="growth-partner-method-step">03 — Prove</div>
                <h3 className="growth-partner-method-title">Rigorous Verification</h3>
                <p className="growth-partner-method-desc">
                  Test every conversion path before launch.
                </p>
              </div>

              <div className="growth-partner-method-card">
                <div className="growth-partner-method-step">04 — Operate</div>
                <h3 className="growth-partner-method-title">Continuous Management</h3>
                <p className="growth-partner-method-desc">
                  Monitor, optimize and improve the system monthly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            07 — OWNERSHIP / TRUST SECTION
            ================================================================== */}
        <section className="growth-partner-ownership-section" aria-labelledby="ownership-heading">
          <div className="growth-container">
            <div className="growth-partner-ownership-box">
              <div className="growth-partner-section-header" style={{ marginBottom: '32px' }}>
                <span className="growth-partner-section-eyebrow">DATA SOVEREIGNTY & ASSET SECURITY</span>
                <h2 id="ownership-heading" className="growth-partner-section-title">
                  Built For Your Business. Not Held Hostage.
                </h2>
                <p className="growth-partner-section-desc">
                  You maintain 100% ownership and administrative access to all platforms, accounts, customer records, and marketing assets.
                </p>
              </div>

              <div className="growth-partner-ownership-grid">
                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your leads.</span>
                </div>

                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your data.</span>
                </div>

                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your ad accounts.</span>
                </div>

                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your analytics.</span>
                </div>

                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your pipeline.</span>
                </div>

                <div className="growth-partner-ownership-item">
                  <span className="growth-partner-ownership-check" aria-hidden="true">✓</span>
                  <span className="growth-partner-ownership-text">Your customer history.</span>
                </div>
              </div>

              <div className="growth-partner-ownership-closing">
                DWS builds and operates the infrastructure. The business remains yours.
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            08 — WHO THIS IS FOR
            ================================================================== */}
        <section className="growth-partner-who-section" aria-labelledby="who-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">TARGET AUDIENCE & FIT</span>
              <h2 id="who-heading" className="growth-partner-section-title">
                Built For Businesses That Need A Repeatable Client-Acquisition System.
              </h2>
              <p className="growth-partner-section-desc">
                Engineered for service businesses where a steady flow of qualified inquiries and booked consultations creates meaningful enterprise revenue.
              </p>
            </div>

            <div className="growth-partner-examples-grid">
              <div className="growth-partner-example-card">
                <div className="growth-partner-example-tag">EXAMPLE SECTOR</div>
                <h3 className="growth-partner-example-title">MedSpas</h3>
                <p className="growth-partner-example-desc">
                  Converting targeted digital demand into scheduled aesthetic consultations, treatment packages, and recurring clinic revenue.
                </p>
              </div>

              <div className="growth-partner-example-card">
                <div className="growth-partner-example-tag">EXAMPLE SECTOR</div>
                <h3 className="growth-partner-example-title">Fitness / Gyms</h3>
                <p className="growth-partner-example-desc">
                  Automating membership inquiry capture, trial bookings, and personal training consultations into booked visits.
                </p>
              </div>

              <div className="growth-partner-example-card">
                <div className="growth-partner-example-tag">EXAMPLE SECTOR</div>
                <h3 className="growth-partner-example-title">Automotive</h3>
                <p className="growth-partner-example-desc">
                  Managing inbound inquiries for custom restyling, detailing, paint protection, and premium vehicle service appointments.
                </p>
              </div>

              <div className="growth-partner-example-card">
                <div className="growth-partner-example-tag">EXAMPLE SECTOR</div>
                <h3 className="growth-partner-example-title">Home Services</h3>
                <p className="growth-partner-example-desc">
                  Generating qualified homeowner consultation requests for high-ticket roofing, solar, HVAC, and architectural remodeling.
                </p>
              </div>

              <div className="growth-partner-example-card">
                <div className="growth-partner-example-tag">EXAMPLE SECTOR</div>
                <h3 className="growth-partner-example-title">Professional Services</h3>
                <p className="growth-partner-example-desc">
                  Positioning and booking qualified prospective clients for legal, wealth advisory, accounting, and executive consulting.
                </p>
              </div>
            </div>

            <div className="growth-partner-non-exclusive-banner">
              <strong>Broad Service Applicability:</strong> These represent typical implementation models; the infrastructure applies to any business relying on qualified booked appointments.
            </div>
          </div>
        </section>

        {/* ==================================================================
            09 — QUALIFICATION SECTION & INVERSE QUALIFICATION
            ================================================================== */}
        <section className="growth-partner-qualification-section" aria-labelledby="qual-heading">
          <div className="growth-container">
            <div className="growth-partner-section-header">
              <span className="growth-partner-section-eyebrow">MUTUAL FIT STANDARDS</span>
              <h2 id="qual-heading" className="growth-partner-section-title">
                DWS Is Probably A Fit If...
              </h2>
              <p className="growth-partner-section-desc">
                We work best with operators who value operational systems, predictable conversion pipelines, and sustained execution.
              </p>
            </div>

            <div className="growth-partner-qualification-grid">
              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  You have a real service or offer to sell
                </span>
              </div>

              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  One new customer is economically meaningful
                </span>
              </div>

              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  You can handle additional appointments
                </span>
              </div>

              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  You are willing to follow a sales process
                </span>
              </div>

              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  You have at least $500/month available for initial paid traffic
                </span>
              </div>

              <div className="growth-partner-qual-item">
                <span className="growth-partner-qual-check" aria-hidden="true">✓</span>
                <span className="growth-partner-qual-text">
                  You want infrastructure, not random marketing tactics
                </span>
              </div>
            </div>

            {/* Inverse Qualification Block */}
            <div className="growth-partner-inverse-box">
              <div className="growth-partner-inverse-title">
                HONEST EXPECTATIONS & CANDOR
              </div>
              <p className="growth-partner-inverse-desc">
                Probably not a fit if you're looking for guaranteed overnight sales or zero-investment growth.
                We construct real, compounding customer acquisition systems for committed business operators.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            10 — FINAL DOMINANT CTA
            ================================================================== */}
        <section className="growth-partner-final-cta-section" aria-labelledby="final-cta-heading">
          <div className="growth-container">
            <h2 id="final-cta-heading" className="growth-partner-final-headline">
              Before You Buy More Traffic, Make Sure Your Business Can Convert It.
            </h2>

            <p className="growth-partner-final-support">
              Complete the review in a few minutes. If we see a fit, we'll map the next move together.
            </p>

            <div>
              <a
                href={applyUrl}
                className="growth-partner-main-cta"
                onClick={() => handleCtaClick('Final Section CTA')}
              >
                <span>REQUEST MY FREE GROWTH REVIEW</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================
          MINIMAL FOOTER — Privacy, Terms, and Main Site only
          ================================================================== */}
      <footer className="growth-partner-footer" role="contentinfo">
        <div className="growth-container growth-partner-footer-inner">
          <div>
            <span>© {new Date().getFullYear()} Dynasty Works Studio. All rights reserved.</span>
          </div>

          <div className="growth-partner-footer-links">
            <a href="/" className="growth-partner-footer-link">
              Main Site
            </a>
            <span>·</span>
            <a href="/privacy" className="growth-partner-footer-link">
              Privacy Notice
            </a>
            <span>·</span>
            <a href="/terms" className="growth-partner-footer-link">
              Advisory Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
