import React, { useEffect, useState, useRef } from 'react';
import './growth.css';
import './growth-partner.css';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

export default function GrowthPartnerPage() {
  useGrowthSeo({
    title: 'Growth Engine | Dynasty Works Studio',
    description:
      'Turn attention into a system that produces revenue. DWS designs the infrastructure between traffic and the sale — capture, CRM, automation, booking, attribution and follow-up.',
    canonicalPath: '/growth-engine',
  });

  const [applyUrl, setApplyUrl] = useState('/growth/apply');
  const [activeTelemetryTab, setActiveTelemetryTab] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Initialize attribution persistence engine (captures UTMs, fbclid, gclid, referrers)
    initGrowthTracking();

    // 2. Fire canonical landing and campaign tracking events
    trackGrowthEvent('growth_page_view', { page: '/growth-engine' });
    trackGrowthEvent('growth_engine_landing_view', {
      page: '/growth-engine',
      metadata: { offer: 'dws_founding_client_launch_rate' },
    });

    // 3. Preserve query string for seamless conversion attribution passing
    if (typeof window !== 'undefined' && window.location.search) {
      setApplyUrl(`/growth/apply${window.location.search}`);
    }

    // 4. Scroll Reveal via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dws-in-view');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
    );

    const revealElements = document.querySelectorAll('.dws-reveal');
    revealElements.forEach((el) => observer.observe(el));

    // 5. Parallax & Dynamic Hero Scroll Transformation
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (heroRef.current && scrollY < 1400) {
          heroRef.current.style.setProperty('--scroll-y', `${scrollY}px`);
          heroRef.current.style.setProperty('--scroll-ratio', `${Math.min(scrollY / 900, 1)}`);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Micro-Telemetry cycle timer in Hero
    const timer = setInterval(() => {
      setActiveTelemetryTab((prev) => (prev + 1) % 3);
    }, 4500);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      clearInterval(timer);
    };
  }, []);

  const handleCtaClick = (locationTag: string, ctaText: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: ctaText,
      cta_destination: '/growth/apply',
      metadata: { location: locationTag },
    });
  };

  const handleScrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('the-problem');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="growth-root dws-growth-engine-redesign">
      {/* ==================================================================
          MINIMAL EDITORIAL HEADER — Unmistakably Dynasty Works Studio
          ================================================================== */}
      <header className="dws-engine-header" role="banner">
        <div className="growth-container dws-engine-header-inner">
          <a
            href="/"
            className="dws-engine-brand"
            aria-label="Dynasty Works Studio Homepage"
          >
            <span className="dws-brand-mark">DYNASTY WORKS STUDIO</span>
            <span className="dws-brand-sub">// GROWTH OPERATING SYSTEM</span>
          </a>

          <a
            href={applyUrl}
            className="dws-engine-header-cta"
            onClick={() => handleCtaClick('Header CTA', 'RESERVE FOUNDING SPOT — FREE REVIEW')}
          >
            <span className="dws-header-pulse-dot" aria-hidden="true" />
            <span>RESERVE FOUNDING SPOT — FREE REVIEW</span>
            <span className="dws-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ==================================================================
            SECTION 1 — HERO: ENLARGED STATE-OF-THE-ART LIVING SYSTEM COMMAND DECK
            ================================================================== */}
        <section
          ref={heroRef}
          className="dws-engine-hero"
          aria-labelledby="hero-title"
        >
          {/* Layered Animated Ambient Background */}
          <div className="dws-hero-ambient" aria-hidden="true">
            <div className="dws-ambient-glow primary" />
            <div className="dws-ambient-glow secondary" />
            <div className="dws-ambient-grid dynamic-grid" />
            <div className="dws-ambient-vignette" />
          </div>

          <div className="growth-container">
            {/* Top Command Headline & Direct-Response Actions */}
            <div className="dws-hero-header-block dws-reveal">
              <div className="dws-hero-eyebrow">
                <span className="dws-eyebrow-rule" />
                <span className="dws-eyebrow-text">DYNASTY WORKS STUDIO</span>
                <span className="dws-eyebrow-badge">
                  <span className="dws-pulse-beacon" />
                  FOUNDING COHORT ACTIVE
                </span>
              </div>

              <h1 id="hero-title" className="dws-hero-headline">
                Turn Attention Into A System That <em>Produces Revenue.</em>
              </h1>

              <p className="dws-hero-description">
                DWS designs the infrastructure between traffic and the sale — capture, CRM, automation, booking, attribution and follow-up operating as one connected Growth Engine.
              </p>

              <div className="dws-hero-positioning">
                <span className="dws-positioning-tag">// STRATEGIC POSITIONING</span>
                <p className="dws-positioning-text">
                  Creative that positions you better. Systems that convert better. Infrastructure that scales better.
                </p>
              </div>

              <div className="dws-hero-actions">
                <a
                  href={applyUrl}
                  className="dws-btn-primary dws-btn-glow"
                  onClick={() =>
                    handleCtaClick(
                      'Hero Primary CTA',
                      'RESERVE MY FOUNDING CLIENT SPOT — FREE GROWTH REVIEW'
                    )
                  }
                >
                  <span>RESERVE MY FOUNDING CLIENT SPOT — FREE GROWTH REVIEW</span>
                  <span className="dws-btn-arrow" aria-hidden="true">→</span>
                </a>

                <div className="dws-hero-urgency-chip">
                  <span className="dws-chip-icon">✦</span>
                  <span>LIMITED TO FIRST 5 QUALIFIED CLIENTS • LAUNCH RATE $997</span>
                </div>

                <a
                  href="#the-problem"
                  className="dws-hero-explore-link"
                  onClick={handleScrollToExplore}
                >
                  <span>Explore the architecture</span>
                  <span className="dws-explore-arrow" aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            {/* ENLARGED STATE-OF-THE-ART LIVING SYSTEM COMMAND DECK */}
            <div className="dws-hero-command-deck dws-reveal">
              <div className="dws-command-deck-frame">
                {/* Precision HUD Corner Brackets */}
                <div className="dws-deck-bracket top-left" aria-hidden="true" />
                <div className="dws-deck-bracket top-right" aria-hidden="true" />
                <div className="dws-deck-bracket bottom-left" aria-hidden="true" />
                <div className="dws-deck-bracket bottom-right" aria-hidden="true" />

                {/* Subdued Scanning Beam */}
                <div className="dws-deck-scanline" aria-hidden="true" />

                {/* Top Deck HUD Header Strip */}
                <div className="dws-deck-hud-top">
                  <div className="dws-deck-status">
                    <span className="dws-status-beacon" />
                    <span className="dws-status-mono">DWS SYSTEM COMMAND // 01.0 LIVE TELEMETRY</span>
                  </div>
                  <div className="dws-deck-stats">
                    <span className="dws-stat-pill">EDGE LATENCY: 140ms</span>
                    <span className="dws-stat-pill">PIPELINE: SYNCHRONIZED</span>
                    <span className="dws-stat-pill gold">DATA SOVEREIGNTY: 100%</span>
                  </div>
                </div>

                {/* Backdrop Layer: Cinema Grade Art-Directed Image */}
                <div className="dws-deck-visual-stage">
                  <img
                    src="/growth/visuals/hero-operators.jpg"
                    alt="Dynasty Works Studio founders and operators analyzing connected growth telemetry"
                    className="dws-deck-photo"
                    width={1600}
                    height={1067}
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="dws-deck-gradient-mask" aria-hidden="true" />

                  {/* Floating Living Telemetry Overlay: Widget Top Right */}
                  <div className="dws-floating-hud dws-hud-feed" aria-live="polite">
                    <div className="dws-hud-head">
                      <span className="dws-hud-dot" />
                      <span className="dws-hud-title">REAL-TIME ACQUISITION TELEMETRY</span>
                    </div>
                    <div className="dws-hud-feed-body">
                      {activeTelemetryTab === 0 && (
                        <div className="dws-feed-item fadeIn">
                          <span className="dws-feed-tag">✦ INGESTION</span>
                          <span className="dws-feed-text">High-intent prospect completed Growth Review</span>
                          <span className="dws-feed-sub">0.38s Edge Capture · Routed to CRM in 180ms</span>
                        </div>
                      )}
                      {activeTelemetryTab === 1 && (
                        <div className="dws-feed-item fadeIn">
                          <span className="dws-feed-tag alert">✦ AUTOMATION</span>
                          <span className="dws-feed-text">Opportunity created in New Lead Stage</span>
                          <span className="dws-feed-sub">Immediate qualification sequence dispatched</span>
                        </div>
                      )}
                      {activeTelemetryTab === 2 && (
                        <div className="dws-feed-item fadeIn">
                          <span className="dws-feed-tag gold">✦ CALENDAR</span>
                          <span className="dws-feed-text">Strategy Call confirmed on calendar</span>
                          <span className="dws-feed-sub">24h &amp; 2h automated SMS reminders active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Living Telemetry Overlay: Widget Bottom Left */}
                  <div className="dws-floating-hud dws-hud-velocity">
                    <div className="dws-velocity-meta">
                      <span className="dws-velocity-lead">RESPONSE SPEED INFLECTION</span>
                      <span className="dws-velocity-metric">+74% CONVERSION VELOCITY</span>
                    </div>
                    <div className="dws-velocity-track">
                      <div className="dws-velocity-bar-fast" />
                      <div className="dws-velocity-pulse-node" />
                    </div>
                    <div className="dws-velocity-sub">
                      <span>DWS Automated First Response &lt; 2 mins</span>
                      <span className="dws-velocity-vs">vs 4h Industry Delay</span>
                    </div>
                  </div>
                </div>

                {/* Integrated Continuous Signal Pipeline Conduit (Traffic to Revenue) */}
                <div className="dws-deck-conduit-bar" role="region" aria-label="Signal Pipeline Stages">
                  <div className="dws-conduit-bus-line">
                    <div className="dws-conduit-laser-pulse" />
                  </div>
                  <div className="dws-conduit-nodes">
                    <div className="dws-conduit-step">
                      <span className="dws-step-code">01</span>
                      <span className="dws-step-label">TRAFFIC</span>
                      <span className="dws-step-detail">Meta · Google · Direct</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className="dws-conduit-step">
                      <span className="dws-step-code">02</span>
                      <span className="dws-step-label">CAPTURE</span>
                      <span className="dws-step-detail">High-Intent Edge Intake</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className="dws-conduit-step">
                      <span className="dws-step-code">03</span>
                      <span className="dws-step-label">CRM</span>
                      <span className="dws-step-detail">Sovereign Data Ledger</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className="dws-conduit-step highlight">
                      <span className="dws-step-code">04</span>
                      <span className="dws-step-label">AUTOMATION</span>
                      <span className="dws-step-detail">&lt;250ms Lead Routing</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className="dws-conduit-step highlight">
                      <span className="dws-step-code">05</span>
                      <span className="dws-step-label">BOOKING</span>
                      <span className="dws-step-detail">Synced Availability</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className="dws-conduit-step gold">
                      <span className="dws-step-code">06</span>
                      <span className="dws-step-label">REVENUE</span>
                      <span className="dws-step-detail">Closed-Loop Attribution</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2 — THE PROBLEM: EDITORIAL LEAKAGE JOURNEY
            ================================================================== */}
        <section id="the-problem" className="dws-section dws-problem-section" aria-labelledby="problem-heading">
          <div className="growth-container">
            <div className="dws-problem-statement dws-reveal">
              <span className="dws-meta-tag">// SYSTEM DIAGNOSTIC</span>
              <h2 id="problem-heading" className="dws-statement-lead">
                Most businesses do not have a traffic problem.
              </h2>
              <div className="dws-statement-followup">
                They have a <em>systems problem.</em>
              </div>
            </div>

            {/* Visual journey showing where revenue leaks */}
            <div className="dws-leakage-conduit-wrapper dws-reveal" role="region" aria-label="Revenue Leakage Conduit">
              <div className="dws-leakage-spine">
                {/* Milestone 1: TRAFFIC */}
                <div className="dws-conduit-milestone">
                  <div className="dws-milestone-marker">
                    <span className="dws-milestone-ring" />
                    <span className="dws-milestone-label">TRAFFIC</span>
                  </div>
                  <div className="dws-conduit-leak">
                    <span className="dws-leak-arrow" aria-hidden="true">↳</span>
                    <div className="dws-leak-content">
                      <span className="dws-leak-tag">LEAK 01</span>
                      <span className="dws-leak-name">Capture leak</span>
                      <p className="dws-leak-desc">Traffic arrives, encounters high friction, and exits without a recorded contact.</p>
                    </div>
                  </div>
                </div>

                {/* Milestone 2: LEAD */}
                <div className="dws-conduit-milestone">
                  <div className="dws-milestone-marker">
                    <span className="dws-milestone-ring" />
                    <span className="dws-milestone-label">LEAD</span>
                  </div>
                  <div className="dws-conduit-leak">
                    <span className="dws-leak-arrow" aria-hidden="true">↳</span>
                    <div className="dws-leak-content">
                      <span className="dws-leak-tag">LEAK 02</span>
                      <span className="dws-leak-name">Response leak</span>
                      <p className="dws-leak-desc">Inquiries wait hours or days for first contact while prospect urgency evaporates.</p>

                      {/* Subtle UI Telemetry Micro-Composition */}
                      <div className="dws-leak-telemetry" aria-label="Response latency diagnostic">
                        <div className="dws-telemetry-header">
                          <span className="dws-telemetry-indicator alert" />
                          <span className="dws-telemetry-title">RESPONSE LATENCY DECAY</span>
                        </div>
                        <div className="dws-telemetry-metrics">
                          <div className="dws-telemetry-row">
                            <span className="dws-metric-name">Average Industry Delay</span>
                            <span className="dws-metric-val alert">04h 12m</span>
                          </div>
                          <div className="dws-telemetry-bar-wrap">
                            <div className="dws-telemetry-bar decay" />
                          </div>
                          <span className="dws-telemetry-subnote">Lead conversion velocity drops 74% after first 5 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone 3: CONVERSATION */}
                <div className="dws-conduit-milestone">
                  <div className="dws-milestone-marker">
                    <span className="dws-milestone-ring" />
                    <span className="dws-milestone-label">CONVERSATION</span>
                  </div>
                  <div className="dws-conduit-leak">
                    <span className="dws-leak-arrow" aria-hidden="true">↳</span>
                    <div className="dws-leak-content">
                      <span className="dws-leak-tag">LEAK 03</span>
                      <span className="dws-leak-name">Follow-up leak</span>
                      <p className="dws-leak-desc">Dispersed notes and unassigned actions cause engaged prospects to slip away.</p>

                      {/* Subtle UI Telemetry Micro-Composition */}
                      <div className="dws-leak-telemetry" aria-label="Disconnected systems diagnostic">
                        <div className="dws-telemetry-header">
                          <span className="dws-telemetry-indicator alert" />
                          <span className="dws-telemetry-title">DISCONNECTED SYSTEM SILOS</span>
                        </div>
                        <div className="dws-telemetry-silos">
                          <span className="dws-silo-pill">Paid Ads</span>
                          <span className="dws-silo-break">↛</span>
                          <span className="dws-silo-pill">Spreadsheets</span>
                          <span className="dws-silo-break">↛</span>
                          <span className="dws-silo-pill">Personal Inbox</span>
                          <span className="dws-silo-break">↛</span>
                          <span className="dws-silo-pill alert">Lost Prospect</span>
                        </div>
                        <span className="dws-telemetry-subnote">3 isolated databases · Zero shared conversation history</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone 4: APPOINTMENT */}
                <div className="dws-conduit-milestone">
                  <div className="dws-milestone-marker">
                    <span className="dws-milestone-ring" />
                    <span className="dws-milestone-label">APPOINTMENT</span>
                  </div>
                  <div className="dws-conduit-leak">
                    <span className="dws-leak-arrow" aria-hidden="true">↳</span>
                    <div className="dws-leak-content">
                      <span className="dws-leak-tag">LEAK 04</span>
                      <span className="dws-leak-name">No-show leak</span>
                      <p className="dws-leak-desc">Absent confirmation cadences and missing reminders ruin calendar show-up rates.</p>

                      {/* Subtle UI Telemetry Micro-Composition */}
                      <div className="dws-leak-telemetry" aria-label="Appointment friction diagnostic">
                        <div className="dws-telemetry-header">
                          <span className="dws-telemetry-indicator alert" />
                          <span className="dws-telemetry-title">CALENDAR SHOW-UP FRICTION</span>
                        </div>
                        <div className="dws-telemetry-split">
                          <div className="dws-split-stat">
                            <span className="dws-stat-kicker">Standard Calendar Drop-off</span>
                            <span className="dws-stat-number alert">42% No-Shows</span>
                          </div>
                          <div className="dws-split-sep" />
                          <div className="dws-split-stat">
                            <span className="dws-stat-kicker">DWS Automated Sequences</span>
                            <span className="dws-stat-number success">91% Attendance</span>
                          </div>
                        </div>
                        <span className="dws-telemetry-subnote">24h &amp; 2h multi-channel confirmations secure calendar economics</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone 5: SALE */}
                <div className="dws-conduit-milestone">
                  <div className="dws-milestone-marker">
                    <span className="dws-milestone-ring" />
                    <span className="dws-milestone-label">SALE</span>
                  </div>
                  <div className="dws-conduit-leak">
                    <span className="dws-leak-arrow" aria-hidden="true">↳</span>
                    <div className="dws-leak-content">
                      <span className="dws-leak-tag">LEAK 05</span>
                      <span className="dws-leak-name">Attribution leak</span>
                      <p className="dws-leak-desc">Reporting cannot connect cash collected to the campaign, ad, or keyword that produced it.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dramatic Resolution */}
              <div className="dws-problem-resolution">
                <div className="dws-resolution-rule" aria-hidden="true" />
                <h3 className="dws-resolution-headline">DWS closes the gaps.</h3>
                <p className="dws-resolution-sub">
                  We engineer a unified continuum where every lead is tracked, engaged, scheduled, and attributed without manual leaks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3 — THE DWS ENGINE: CONNECTED SYSTEM ARCHITECTURE
            ================================================================== */}
        <section className="dws-section dws-engine-section" aria-labelledby="engine-heading">
          <div className="growth-container">
            <div className="dws-section-header dws-reveal">
              <span className="dws-meta-tag">// SYSTEM TOPOLOGY</span>
              <h2 id="engine-heading" className="dws-section-headline">
                One connected operating system.
              </h2>
              <p className="dws-section-sub">
                Not a loose stack of disjointed software subscriptions. A single, cohesive engine where every component talks to the next.
              </p>
            </div>

            {/* Custom DWS Systems Console Visual: 8 Continuous Subsystems */}
            <div className="dws-console-wrapper dws-reveal" role="region" aria-label="Proprietary DWS Systems Architecture">
              <div className="dws-console-chrome">
                <div className="dws-chrome-status">
                  <span className="dws-chrome-dot live" />
                  <span className="dws-chrome-title">DWS ENGINE OS // UNIFIED ARCHITECTURE CONDUIT</span>
                </div>
                <div className="dws-chrome-telemetry">
                  <span className="dws-telemetry-chip">LATENCY: 180ms</span>
                  <span className="dws-telemetry-chip">PIPELINE: SYNCHRONIZED</span>
                  <span className="dws-telemetry-chip">ATTRIBUTION: 100% MATCH</span>
                </div>
              </div>

              <div className="dws-console-track">
                {/* 01 TRAFFIC */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">01</span>
                    <span className="dws-node-state live">SIGNAL</span>
                  </div>
                  <h3 className="dws-node-heading">TRAFFIC</h3>
                  <div className="dws-node-details">
                    <span>Meta · Google · Direct</span>
                    <span className="dws-node-metric">gclid / fbclid detected</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 02 LANDING PAGE */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">02</span>
                    <span className="dws-node-state live">EDGE</span>
                  </div>
                  <h3 className="dws-node-heading">LANDING PAGE</h3>
                  <div className="dws-node-details">
                    <span>Edge deployment</span>
                    <span className="dws-node-metric">0.38s First Paint</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 03 INTAKE */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">03</span>
                    <span className="dws-node-state live">QUALIFY</span>
                  </div>
                  <h3 className="dws-node-heading">INTAKE</h3>
                  <div className="dws-node-details">
                    <span>5-Step Growth Review</span>
                    <span className="dws-node-metric">Full Payload Capture</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 04 CRM */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">04</span>
                    <span className="dws-node-state live">LEDGER</span>
                  </div>
                  <h3 className="dws-node-heading">CRM</h3>
                  <div className="dws-node-details">
                    <span>Unified Contact Card</span>
                    <span className="dws-node-metric">Zero Duplication</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 05 AUTOMATION */}
                <div className="dws-console-node highlight">
                  <div className="dws-node-top">
                    <span className="dws-node-num">05</span>
                    <span className="dws-node-state pulse">ROUTING</span>
                  </div>
                  <h3 className="dws-node-heading">AUTOMATION</h3>
                  <div className="dws-node-details">
                    <span>n8n Webhook Engine</span>
                    <span className="dws-node-metric">&lt;250ms Dual Ingestion</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 06 BOOKING */}
                <div className="dws-console-node highlight">
                  <div className="dws-node-top">
                    <span className="dws-node-num">06</span>
                    <span className="dws-node-state pulse">CALENDAR</span>
                  </div>
                  <h3 className="dws-node-heading">BOOKING</h3>
                  <div className="dws-node-details">
                    <span>Synced Availability</span>
                    <span className="dws-node-metric">24h / 2h SMS Reminders</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 07 PIPELINE */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">07</span>
                    <span className="dws-node-state live">STAGE</span>
                  </div>
                  <h3 className="dws-node-heading">PIPELINE</h3>
                  <div className="dws-node-details">
                    <span>Opportunity Tracking</span>
                    <span className="dws-node-metric">New Lead → Booked</span>
                  </div>
                  <div className="dws-node-connector" aria-hidden="true">→</div>
                </div>

                {/* 08 ATTRIBUTION */}
                <div className="dws-console-node">
                  <div className="dws-node-top">
                    <span className="dws-node-num">08</span>
                    <span className="dws-node-state live">LOOP</span>
                  </div>
                  <h3 className="dws-node-heading">ATTRIBUTION</h3>
                  <div className="dws-node-details">
                    <span>Closed-Loop ROI</span>
                    <span className="dws-node-metric">Spend to Revenue Match</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dws-engine-statement dws-reveal">
              <p className="dws-statement-quote">
                “Every signal enters one system. Every lead has a history. Every opportunity has a next action.”
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4 — WHAT DWS ACTUALLY BUILDS: EDITORIAL CHAPTERS
            ================================================================== */}
        <section className="dws-section dws-chapters-section" aria-labelledby="builds-heading">
          <div className="growth-container">
            <div className="dws-section-header dws-reveal">
              <span className="dws-meta-tag">// SYSTEM DELIVERABLES</span>
              <h2 id="builds-heading" className="dws-section-headline">
                What DWS Actually Builds.
              </h2>
              <p className="dws-section-sub">
                Five engineered layers forming an end-to-end client conversion apparatus.
              </p>
            </div>

            <div className="dws-chapters-flow dws-reveal">
              {/* Chapter 01: CAPTURE */}
              <article className="dws-chapter-row">
                <div className="dws-chapter-meta">
                  <span className="dws-chapter-num">CHAPTER 01</span>
                  <span className="dws-chapter-line" />
                </div>
                <div className="dws-chapter-content">
                  <h3 className="dws-chapter-title">CAPTURE</h3>
                  <p className="dws-chapter-lead">Campaign landing pages and structured lead intake.</p>
                  <p className="dws-chapter-body">
                    We deploy custom-engineered, ultra-fast acquisition surfaces designed specifically for high-intent traffic. Every form is instrumented to capture deep lead qualification data without adding conversion drag.
                  </p>
                </div>
              </article>

              {/* Chapter 02: ORCHESTRATE */}
              <article className="dws-chapter-row">
                <div className="dws-chapter-meta">
                  <span className="dws-chapter-num">CHAPTER 02</span>
                  <span className="dws-chapter-line" />
                </div>
                <div className="dws-chapter-content">
                  <h3 className="dws-chapter-title">ORCHESTRATE</h3>
                  <p className="dws-chapter-lead">CRM pipelines, routing and automation.</p>
                  <p className="dws-chapter-body">
                    Leads never sit in an inbox. Instant webhook routing ingests inquiries into a unified CRM, applies automated deduplication, creates stage-tracked pipeline opportunities, and alerts your team within seconds.
                  </p>
                </div>
              </article>

              {/* Chapter 03: CONVERT */}
              <article className="dws-chapter-row">
                <div className="dws-chapter-meta">
                  <span className="dws-chapter-num">CHAPTER 03</span>
                  <span className="dws-chapter-line" />
                </div>
                <div className="dws-chapter-content">
                  <h3 className="dws-chapter-title">CONVERT</h3>
                  <p className="dws-chapter-lead">Booking, confirmations, reminders and follow-up.</p>
                  <p className="dws-chapter-body">
                    Frictionless self-scheduling syncs directly with calendar availability. Dynamic confirmation cadences and automated 24-hour and 2-hour reminders protect attendance economics and eliminate no-shows.
                  </p>
                </div>
              </article>

              {/* Chapter 04: MEASURE */}
              <article className="dws-chapter-row">
                <div className="dws-chapter-meta">
                  <span className="dws-chapter-num">CHAPTER 04</span>
                  <span className="dws-chapter-line" />
                </div>
                <div className="dws-chapter-content">
                  <h3 className="dws-chapter-title">MEASURE</h3>
                  <p className="dws-chapter-lead">GA4, attribution and conversion events.</p>
                  <p className="dws-chapter-body">
                    Server-side and client-side event tracking records every step of the funnel. Persistent UTM, Google Click ID (gclid), and Meta Click ID (fbclid) tracking pass straight to your CRM so you know exactly which dollar yielded each closed client.
                  </p>
                </div>
              </article>

              {/* Chapter 05: IMPROVE */}
              <article className="dws-chapter-row">
                <div className="dws-chapter-meta">
                  <span className="dws-chapter-num">CHAPTER 05</span>
                  <span className="dws-chapter-line" />
                </div>
                <div className="dws-chapter-content">
                  <h3 className="dws-chapter-title">IMPROVE</h3>
                  <p className="dws-chapter-lead">Monthly monitoring, testing and optimization.</p>
                  <p className="dws-chapter-body">
                    Growth systems require active stewardship. DWS performs monthly technical reviews, conversion rate testing, pipeline stage optimizations, and infrastructure maintenance to ensure long-term stability and velocity.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5 — DELIVERY METHOD: CINEMATIC TIMELINE
            ================================================================== */}
        <section className="dws-section dws-method-section" aria-labelledby="method-heading">
          <div className="growth-container">
            <div className="dws-section-header dws-reveal">
              <span className="dws-meta-tag">// SYSTEM PROTOCOL</span>
              <h2 id="method-heading" className="dws-section-headline">
                Built Like Infrastructure.<br />
                <em>Not A Marketing Experiment.</em>
              </h2>
              <p className="dws-section-sub">
                A structured four-stage engineering protocol that verifies every path in staging before driving public traffic.
              </p>
            </div>

            {/* Continuous Panoramic Delivery Visual Sequence */}
            <div className="dws-method-panorama-container dws-reveal" role="region" aria-label="Panoramic Delivery Protocol">
              <div className="dws-panorama-frame">
                <img
                  src="/growth/visuals/method-panorama.jpg"
                  alt="Continuous technical evolution across Diagnose, Architect, Prove, and Operate stages"
                  className="dws-panorama-img"
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                />
                <div className="dws-panorama-overlay" aria-hidden="true">
                  <div className="dws-panorama-badge">
                    <span className="dws-status-dot" />
                    <span>CONTINUOUS PROTOCOL SEQUENCE // PHASES 01–04</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dws-timeline-track dws-reveal" role="region" aria-label="Delivery Timeline">
              <div className="dws-timeline-station">
                <div className="dws-station-axis">
                  <div className="dws-station-node" />
                  <div className="dws-station-line" />
                </div>
                <div className="dws-station-content">
                  <div className="dws-station-badge">PHASE 01</div>
                  <h3 className="dws-station-title">DIAGNOSE</h3>
                  <p className="dws-station-desc">
                    Understand the current journey and locate the failure points.
                  </p>
                </div>
              </div>

              <div className="dws-timeline-station">
                <div className="dws-station-axis">
                  <div className="dws-station-node" />
                  <div className="dws-station-line" />
                </div>
                <div className="dws-station-content">
                  <div className="dws-station-badge">PHASE 02</div>
                  <h3 className="dws-station-title">ARCHITECT</h3>
                  <p className="dws-station-desc">
                    Design the connected Growth Engine around how the business actually sells.
                  </p>
                </div>
              </div>

              <div className="dws-timeline-station">
                <div className="dws-station-axis">
                  <div className="dws-station-node" />
                  <div className="dws-station-line" />
                </div>
                <div className="dws-station-content">
                  <div className="dws-station-badge">PHASE 03</div>
                  <h3 className="dws-station-title">PROVE</h3>
                  <p className="dws-station-desc">
                    Build in staging and test every critical path.
                  </p>
                </div>
              </div>

              <div className="dws-timeline-station">
                <div className="dws-station-axis">
                  <div className="dws-station-node active" />
                </div>
                <div className="dws-station-content">
                  <div className="dws-station-badge">PHASE 04</div>
                  <h3 className="dws-station-title">OPERATE</h3>
                  <p className="dws-station-desc">
                    Launch, monitor and improve the system against real conversion data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6 — CREATIVE RANGE: CROSS-CATEGORY POSITIONING
            ================================================================== */}
        <section className="dws-section dws-range-section" aria-labelledby="range-heading">
          <div className="growth-container">
            <div className="dws-section-header dws-reveal">
              <span className="dws-meta-tag">// CROSS-INDUSTRY CAPABILITY</span>
              <h2 id="range-heading" className="dws-section-headline">
                Different Businesses Require Different Positioning.
              </h2>
              <p className="dws-section-sub">
                The system may be connected. The brand should never feel generic.
              </p>
            </div>

            <div className="dws-range-gallery dws-reveal" role="list">
              {/* Category 1: MedSpa / Beauty */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-medspa.jpg"
                    alt="Aesthetic medicine doctor and clinic director reviewing treatment diagnostics in a luxury travertine treatment suite"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">MEDSPA / BEAUTY</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Aesthetic Medicine &amp; Longevity</h3>
                  <p className="dws-range-desc">
                    Clinical luxury positioning paired with automated qualification and pre-treatment consultation sequences.
                  </p>
                </div>
              </div>

              {/* Category 2: Fitness */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-fitness.jpg"
                    alt="Black head strength coach and athlete reviewing biometric telemetry in an architectural obsidian gym"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">FITNESS / ATHLETICS</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Athletic Sanctuaries &amp; Performance</h3>
                  <p className="dws-range-desc">
                    Disciplined high-energy visuals combined with trial booking and member attendance retention workflows.
                  </p>
                </div>
              </div>

              {/* Category 3: Automotive */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-automotive.jpg"
                    alt="Master automotive artisan and engineer inspecting a supercar chassis in an architectural atelier workshop"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">AUTOMOTIVE / ATELIER</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Bespoke Engineering &amp; Tuning</h3>
                  <p className="dws-range-desc">
                    Editorial prestige storytelling capturing collector trust with private consultation inquiry flows.
                  </p>
                </div>
              </div>

              {/* Category 4: Home Services */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-architectural.jpg"
                    alt="Black woman lead architect and Latino master builder reviewing construction blueprints in a modern luxury residence"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">HOME SERVICES / DESIGN-BUILD</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Architectural Construction &amp; Craft</h3>
                  <p className="dws-range-desc">
                    Elevated craft narratives that filter out price shoppers and route high-budget project briefs directly.
                  </p>
                </div>
              </div>

              {/* Category 5: Professional Services */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-advisory.jpg"
                    alt="Diverse executive leadership team collaborating around a stone table in a skyline conference boardroom"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">PROFESSIONAL SERVICES</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Strategic Advisory &amp; Leadership</h3>
                  <p className="dws-range-desc">
                    Restrained executive design language with discrete partnership intake and deep credential positioning.
                  </p>
                </div>
              </div>

              {/* Category 6: Hospitality / Lifestyle */}
              <div className="dws-range-card" role="listitem">
                <div className="dws-range-media-frame">
                  <img
                    src="/growth/visuals/range-hospitality.jpg"
                    alt="Latina beverage director and culinary artisan inspecting bespoke bottled elixirs in an intimate marble lounge"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="dws-range-tag">HOSPITALITY / LIFESTYLE</div>
                </div>
                <div className="dws-range-meta">
                  <h3 className="dws-range-title">Flagship Culinary &amp; Sanctuaries</h3>
                  <p className="dws-range-desc">
                    Atmospheric brand experiences integrated with private reservation and VIP guest history capture.
                  </p>
                </div>
              </div>
            </div>

            <div className="dws-range-resolution dws-reveal">
              <p className="dws-range-statement">
                One growth architecture. Different positioning for every market.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 7 — OWNERSHIP: RADICAL DATA SOVEREIGNTY
            ================================================================== */}
        <section className="dws-section dws-ownership-section" aria-labelledby="ownership-heading">
          <div className="growth-container">
            <div className="dws-ownership-layout dws-reveal">
              <div className="dws-ownership-lead-col">
                <span className="dws-meta-tag">// DATA SOVEREIGNTY</span>
                <h2 id="ownership-heading" className="dws-ownership-headline">
                  Your business should never depend on being trapped inside someone else's system.
                </h2>
                <p className="dws-ownership-statement">
                  DWS builds and operates the infrastructure. The underlying business remains yours.
                </p>
              </div>

              <div className="dws-ownership-pillars-col" role="list">
                <div className="dws-pillar-item" role="listitem">
                  <span className="dws-pillar-idx">[01]</span>
                  <span className="dws-pillar-name">YOUR LEADS</span>
                </div>
                <div className="dws-pillar-item" role="listitem">
                  <span className="dws-pillar-idx">[02]</span>
                  <span className="dws-pillar-name">YOUR DATA</span>
                </div>
                <div className="dws-pillar-item" role="listitem">
                  <span className="dws-pillar-idx">[03]</span>
                  <span className="dws-pillar-name">YOUR AD ACCOUNTS</span>
                </div>
                <div className="dws-pillar-item" role="listitem">
                  <span className="dws-pillar-idx">[04]</span>
                  <span className="dws-pillar-name">YOUR ANALYTICS</span>
                </div>
                <div className="dws-pillar-item" role="listitem">
                  <span className="dws-pillar-idx">[05]</span>
                  <span className="dws-pillar-name">YOUR CUSTOMER HISTORY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 8 — FOUNDING CLIENT LAUNCH RATE: LIMITED TO FIRST 5 CLIENTS
            ================================================================== */}
        <section className="dws-section dws-partner-section" aria-labelledby="partner-heading">
          <div className="growth-container">
            <div className="dws-invitation-plate dws-reveal">
              <div className="dws-plate-header">
                <div className="dws-plate-badge">
                  <span className="dws-plate-dot" aria-hidden="true" />
                  <span className="dws-plate-label">Founding Client Launch Rate</span>
                </div>
                <span className="dws-plate-allocation">LIMITED TO THE FIRST 5 CLIENTS</span>
              </div>

              <h2 id="partner-heading" className="dws-invitation-title">
                One fully connected Growth Engine. Founding client launch rate.
              </h2>

              <div className="dws-invitation-grid">
                {/* Investment Side */}
                <div className="dws-invitation-terms">
                  {/* Pricing Comparison Matrix with slashed standard pricing */}
                  <div className="dws-pricing-comparison">
                    <div className="dws-price-block">
                      <div className="dws-price-anchor">
                        <span className="dws-anchor-label">STANDARD SETUP</span>
                        <span className="dws-anchor-num slashed">$2,500</span>
                      </div>
                      <div className="dws-launch-tier">
                        <span className="dws-launch-label">LAUNCH RATE SETUP</span>
                        <span className="dws-launch-num">$997</span>
                      </div>
                    </div>

                    <div className="dws-price-block-sep" aria-hidden="true" />

                    <div className="dws-price-block">
                      <div className="dws-price-anchor">
                        <span className="dws-anchor-label">STANDARD MONTHLY MANAGEMENT</span>
                        <span className="dws-anchor-num slashed">
                          $1,497 <span className="dws-anchor-sub">/ month</span>
                        </span>
                      </div>
                      <div className="dws-launch-tier">
                        <span className="dws-launch-label">LAUNCH RATE</span>
                        <span className="dws-launch-num">
                          $997 <span className="dws-launch-sub">/ month</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rate Lock & Urgency Directives */}
                  <div className="dws-rate-lock-banner">
                    <span className="dws-lock-icon" aria-hidden="true">🔒</span>
                    <span className="dws-lock-text">
                      Lock in the $997 monthly management rate while your account remains active and in good standing.
                    </span>
                  </div>

                  <div className="dws-invitation-notes">
                    <div className="dws-urgency-box">
                      <p className="dws-urgency-note">
                        <strong>Urgency:</strong> This launch rate is reserved for the first 5 qualified clients. Once the founding spots are filled, standard pricing applies. Secure the discounted rate now and keep it active while your account remains in good standing.
                      </p>
                    </div>

                    <p className="dws-ad-budget-note">
                      Minimum paid advertising budget: <strong>$500/month</strong>.<br />
                      Advertising spend is paid separately and is not included in the $997 monthly management fee.
                    </p>

                    <div className="dws-contract-terms">
                      <span>● No long-term contract</span>
                      <span>● 30-day cancellation</span>
                      <span>● Ad spend billed separately</span>
                      <span>● Platform / usage fees billed separately if applicable</span>
                    </div>

                    <div className="dws-commitment-block">
                      <span className="dws-commitment-tag">INFRASTRUCTURE LAUNCH COMMITMENT</span>
                      <p className="dws-commitment-text">
                        If DWS does not launch the agreed Growth Engine within 14 business days after receiving all required client assets, access, approvals and information, the client's next management month is credited.
                      </p>
                    </div>
                  </div>

                  <div className="dws-invitation-action">
                    <a
                      href={applyUrl}
                      className="dws-btn-primary dws-btn-glow"
                      onClick={() =>
                        handleCtaClick(
                          'Launch Rate Invitation CTA',
                          'CLAIM LAUNCH RATE — START WITH MY FREE GROWTH REVIEW'
                        )
                      }
                    >
                      <span>CLAIM LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
                      <span className="dws-btn-arrow" aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>

                {/* Included Systems Scope */}
                <div className="dws-invitation-scope">
                  <h3 className="dws-scope-header">SYSTEM ARCHITECTURE INCLUDED:</h3>
                  <ul className="dws-scope-list">
                    <li><span className="dws-check" aria-hidden="true">✓</span> landing page or website implementation within agreed scope</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> CRM and pipeline</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> lead capture and routing</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> automated follow-up</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> booking system</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> appointment reminders</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> analytics and attribution</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> monthly system review</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> ongoing monitoring and optimization</li>
                    <li><span className="dws-check" aria-hidden="true">✓</span> DWS direct system support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 9 — FINAL CLOSE: HIGH-IMPACT EDITORIAL RESOLUTION
            ================================================================== */}
        <section className="dws-section dws-final-close-section" aria-labelledby="close-heading">
          <div className="growth-container">
            <div className="dws-final-close-content dws-reveal">
              <span className="dws-meta-tag">// SYSTEM IMPERATIVE</span>
              <h2 id="close-heading" className="dws-close-statement">
                Buying more traffic will not fix a broken journey.
              </h2>
              <div className="dws-close-followup">
                Build the system first. <em>Then scale it.</em>
              </div>

              <div className="dws-close-action">
                <a
                  href={applyUrl}
                  className="dws-btn-primary dws-btn-large dws-btn-glow"
                  onClick={() =>
                    handleCtaClick(
                      'Final Close CTA',
                      'RESERVE MY FOUNDING CLIENT SPOT — FREE GROWTH REVIEW'
                    )
                  }
                >
                  <span>RESERVE MY FOUNDING CLIENT SPOT — FREE GROWTH REVIEW</span>
                  <span className="dws-btn-arrow" aria-hidden="true">→</span>
                </a>
              </div>

              <div className="dws-close-reassurance">
                <span>Zero Obligation Diagnostic</span>
                <span className="dws-sep">·</span>
                <span>Direct Founder Consultation</span>
                <span className="dws-sep">·</span>
                <span>5 Founding Spots Total</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================
          MINIMAL FOOTER
          ================================================================== */}
      <footer className="dws-engine-footer" role="contentinfo">
        <div className="growth-container dws-engine-footer-inner">
          <div className="dws-footer-copy">
            <span>© {new Date().getFullYear()} Dynasty Works Studio. All rights reserved.</span>
          </div>

          <div className="dws-footer-links">
            <a href="/" className="dws-footer-link">Main Site</a>
            <span className="dws-footer-sep">·</span>
            <a href="/privacy" className="dws-footer-link">Privacy Notice</a>
            <span className="dws-footer-sep">·</span>
            <a href="/terms" className="dws-footer-link">Advisory Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
