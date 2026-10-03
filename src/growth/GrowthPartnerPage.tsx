import React, { useEffect, useState } from 'react';
import './growth.css';
import './growth-partner.css';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthPartnerPage() {
  useGrowthSeo({
    title: 'Founding Growth Partner | Dynasty Works Studio',
    description:
      'Turnkey client-acquisition infrastructure designed, deployed, and managed by Dynasty Works Studio. Exclusive founding partner offer for the first 5 businesses.',
    canonicalPath: '/growth/partner',
  });

  const [applyUrl, setApplyUrl] = useState('/growth/apply');

  useEffect(() => {
    // 1. Initialize attribution persistence engine (captures UTMs, fbclid, gclid, referrers)
    initGrowthTracking();

    // 2. Fire canonical landing and campaign tracking events
    trackGrowthEvent('growth_page_view', { page: '/growth/partner' });
    trackGrowthEvent('growth_engine_landing_view', {
      page: '/growth/partner',
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
            <span className="growth-partner-brand-sub">// FOUNDING PARTNER ALLOCATION</span>
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
                    <span className="growth-partner-amount">$997</span>
                    <span className="growth-partner-period">One-time activation</span>
                  </div>

                  <span className="growth-partner-price-divider" aria-hidden="true">—</span>

                  <div className="growth-partner-price-item">
                    <span className="growth-partner-amount">$997</span>
                    <span className="growth-partner-period">Per month Growth Engine management</span>
                  </div>
                </div>

                <div className="growth-partner-ad-budget-note">
                  Paid advertising budget separate. Recommended minimum: <strong>$500 / month</strong>
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
            02 — WHAT'S INCLUDED (11 CORE SYSTEMS) + RISK-REVERSAL BLOCK
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
            03 — WHO THIS IS FOR
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
              <strong>Broad Service Applicability:</strong> While these initial examples represent proven client models, DWS builds growth infrastructure for any business that sells a real, high-value service with capacity to service new demand.
            </div>
          </div>
        </section>

        {/* ==================================================================
            04 — QUALIFICATION SECTION & INVERSE QUALIFICATION
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
            05 — FINAL DOMINANT CTA
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
