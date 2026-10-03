import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // 1. Initialize attribution persistence engine (captures UTMs, fbclid, gclid, referrers)
    initGrowthTracking();

    // 2. Fire canonical landing and campaign tracking events
    trackGrowthEvent('growth_page_view', { page: '/growth-engine' });
    trackGrowthEvent('growth_engine_landing_view', {
      page: '/growth-engine',
      metadata: { offer: 'dws_growth_engine_launch_rate' },
    });

    // 3. Preserve query string for seamless conversion attribution passing
    if (typeof window !== 'undefined' && window.location.search) {
      setApplyUrl(`/growth/apply${window.location.search}`);
    }
  }, []);

  const handleCtaClick = (locationTag: string) => {
    trackGrowthEvent('growth_cta_click', {
      cta_label: 'CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW',
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
            onClick={() => handleCtaClick('Header CTA')}
          >
            <span>CLAIM LAUNCH RATE — FREE REVIEW</span>
            <span className="dws-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ==================================================================
            SECTION 1 — HERO: CINEMATIC COMMAND CENTER & SIGNAL CONVERGENCE
            ================================================================== */}
        <section className="dws-engine-hero" aria-labelledby="hero-title">
          <div className="dws-hero-ambient" aria-hidden="true">
            <div className="dws-ambient-glow" />
            <div className="dws-ambient-grid" />
          </div>

          <div className="growth-container">
            <div className="dws-hero-layout">
              <div className="dws-hero-copy">
                <div className="dws-hero-eyebrow">
                  <span className="dws-eyebrow-rule" />
                  <span className="dws-eyebrow-text">DYNASTY WORKS STUDIO</span>
                </div>

                <h1 id="hero-title" className="dws-hero-headline">
                  Turn Attention Into A System That <em>Produces Revenue.</em>
                </h1>

                <p className="dws-hero-description">
                  DWS designs the infrastructure between traffic and the sale — capture, CRM, automation, booking, attribution and follow-up operating as one connected Growth Engine.
                </p>

                <div className="dws-hero-actions">
                  <a
                    href={applyUrl}
                    className="dws-btn-primary"
                    onClick={() => handleCtaClick('Hero Primary CTA')}
                  >
                    <span>CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
                    <span className="dws-btn-arrow" aria-hidden="true">→</span>
                  </a>

                  <a
                    href="#the-problem"
                    className="dws-hero-explore-link"
                    onClick={handleScrollToExplore}
                  >
                    <span>Explore the engine</span>
                    <span className="dws-explore-arrow" aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>

              {/* Abstract Visual Representation: Signals Moving Into One Operating System */}
              <div className="dws-hero-visual-frame" aria-hidden="true">
                <div className="dws-convergence-display">
                  <svg
                    viewBox="0 0 600 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="dws-convergence-svg"
                  >
                    {/* Concentric Coordinate Rings */}
                    <circle cx="300" cy="300" r="280" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <circle cx="300" cy="300" r="210" stroke="rgba(212,175,55,0.12)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="300" cy="300" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="300" cy="300" r="70" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5" />

                    {/* Architectural Coordinate Axes */}
                    <line x1="20" y1="300" x2="580" y2="300" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="300" y1="20" x2="300" y2="580" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="102" y1="102" x2="498" y2="498" stroke="rgba(212,175,55,0.06)" strokeWidth="1" strokeDasharray="2 4" />
                    <line x1="102" y1="498" x2="498" y2="102" stroke="rgba(212,175,55,0.06)" strokeWidth="1" strokeDasharray="2 4" />

                    {/* Inbound Signal Vectors Converging into Core */}
                    <path d="M 60 140 Q 180 200 260 270" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeDasharray="4 4" className="dws-pulse-line-1" />
                    <circle cx="60" cy="140" r="4" fill="#d4af37" />
                    <text x="50" y="125" fill="#a3a8b4" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SIGNAL.01 // META</text>

                    <path d="M 540 120 Q 420 180 340 260" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeDasharray="4 4" className="dws-pulse-line-2" />
                    <circle cx="540" cy="120" r="4" fill="#d4af37" />
                    <text x="440" y="105" fill="#a3a8b4" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SIGNAL.02 // GOOGLE</text>

                    <path d="M 80 480 Q 180 420 260 330" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeDasharray="4 4" className="dws-pulse-line-3" />
                    <circle cx="80" cy="480" r="4" fill="#d4af37" />
                    <text x="40" y="505" fill="#a3a8b4" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SIGNAL.03 // ORGANIC</text>

                    <path d="M 520 480 Q 420 420 340 340" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeDasharray="4 4" className="dws-pulse-line-4" />
                    <circle cx="520" cy="480" r="4" fill="#d4af37" />
                    <text x="420" y="505" fill="#a3a8b4" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SIGNAL.04 // DIRECT</text>

                    {/* Central Core: Dynasty Growth Engine Nexus */}
                    <circle cx="300" cy="300" r="38" fill="#08090d" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="300" cy="300" r="26" fill="rgba(212,175,55,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <circle cx="300" cy="300" r="6" fill="#f3c442" className="dws-core-dot" />

                    <text x="300" y="365" textAnchor="middle" fill="#d4af37" fontSize="11" fontFamily="monospace" fontWeight="700" letterSpacing="0.16em">
                      DWS // GROWTH ENGINE CORE
                    </text>
                    <text x="300" y="382" textAnchor="middle" fill="#717684" fontSize="9" fontFamily="monospace" letterSpacing="0.12em">
                      OPERATIONAL PROTOCOL 01.0
                    </text>

                    <defs>
                      <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f3c442" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                  </svg>
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
            <div className="dws-problem-statement">
              <span className="dws-meta-tag">// SYSTEM DIAGNOSTIC</span>
              <h2 id="problem-heading" className="dws-statement-lead">
                Most businesses do not have a traffic problem.
              </h2>
              <div className="dws-statement-followup">
                They have a <em>systems problem.</em>
              </div>
            </div>

            {/* Visual journey showing where revenue leaks */}
            <div className="dws-leakage-conduit-wrapper" role="region" aria-label="Revenue Leakage Conduit">
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
            <div className="dws-section-header">
              <span className="dws-meta-tag">// SYSTEM TOPOLOGY</span>
              <h2 id="engine-heading" className="dws-section-headline">
                One connected operating system.
              </h2>
              <p className="dws-section-sub">
                Not a loose stack of disjointed software subscriptions. A single, cohesive engine where every component talks to the next.
              </p>
            </div>

            {/* Large Visual System Architecture — 5 Continuous Stages */}
            <div className="dws-architecture-pipeline" role="region" aria-label="System Architecture Pipeline">
              <div className="dws-pipeline-bus-line" aria-hidden="true">
                <span className="dws-bus-pulse" />
              </div>

              <div className="dws-pipeline-stages">
                {/* 01 — ATTENTION */}
                <div className="dws-stage-column">
                  <div className="dws-stage-header">
                    <span className="dws-stage-idx">01</span>
                    <h3 className="dws-stage-title">ATTENTION</h3>
                  </div>
                  <div className="dws-stage-body">
                    <div className="dws-node-pill">Meta</div>
                    <div className="dws-node-pill">Google</div>
                    <div className="dws-node-pill">Organic</div>
                    <div className="dws-node-pill">Referral</div>
                  </div>
                  <div className="dws-stage-wire" aria-hidden="true" />
                </div>

                {/* 02 — INTENT */}
                <div className="dws-stage-column">
                  <div className="dws-stage-header">
                    <span className="dws-stage-idx">02</span>
                    <h3 className="dws-stage-title">INTENT</h3>
                  </div>
                  <div className="dws-stage-body">
                    <div className="dws-node-pill">Landing Page</div>
                    <div className="dws-node-pill">Growth Review</div>
                    <div className="dws-node-pill">Inquiry</div>
                  </div>
                  <div className="dws-stage-wire" aria-hidden="true" />
                </div>

                {/* 03 — INTELLIGENCE */}
                <div className="dws-stage-column">
                  <div className="dws-stage-header">
                    <span className="dws-stage-idx">03</span>
                    <h3 className="dws-stage-title">INTELLIGENCE</h3>
                  </div>
                  <div className="dws-stage-body">
                    <div className="dws-node-pill">Lead Source</div>
                    <div className="dws-node-pill">Qualification</div>
                    <div className="dws-node-pill">Contact History</div>
                  </div>
                  <div className="dws-stage-wire" aria-hidden="true" />
                </div>

                {/* 04 — ACTION */}
                <div className="dws-stage-column highlight">
                  <div className="dws-stage-header">
                    <span className="dws-stage-idx">04</span>
                    <h3 className="dws-stage-title">ACTION</h3>
                  </div>
                  <div className="dws-stage-body">
                    <div className="dws-node-pill">CRM</div>
                    <div className="dws-node-pill">Automation</div>
                    <div className="dws-node-pill">Booking</div>
                    <div className="dws-node-pill">Follow-Up</div>
                  </div>
                  <div className="dws-stage-wire" aria-hidden="true" />
                </div>

                {/* 05 — REVENUE */}
                <div className="dws-stage-column highlight">
                  <div className="dws-stage-header">
                    <span className="dws-stage-idx">05</span>
                    <h3 className="dws-stage-title">REVENUE</h3>
                  </div>
                  <div className="dws-stage-body">
                    <div className="dws-node-pill">Pipeline</div>
                    <div className="dws-node-pill">Attribution</div>
                    <div className="dws-node-pill">Reporting</div>
                    <div className="dws-node-pill">Optimization</div>
                  </div>
                  <div className="dws-stage-wire" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="dws-engine-statement">
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
            <div className="dws-section-header">
              <span className="dws-meta-tag">// SYSTEM DELIVERABLES</span>
              <h2 id="builds-heading" className="dws-section-headline">
                What DWS Actually Builds.
              </h2>
              <p className="dws-section-sub">
                Five engineered layers forming an end-to-end client conversion apparatus.
              </p>
            </div>

            <div className="dws-chapters-flow">
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
            <div className="dws-section-header">
              <span className="dws-meta-tag">// SYSTEM PROTOCOL</span>
              <h2 id="method-heading" className="dws-section-headline">
                Built Like Infrastructure.<br />
                <em>Not A Marketing Experiment.</em>
              </h2>
              <p className="dws-section-sub">
                A structured four-stage engineering protocol that verifies every path in staging before driving public traffic.
              </p>
            </div>

            <div className="dws-timeline-track" role="region" aria-label="Delivery Timeline">
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
            SECTION 6 — OWNERSHIP: RADICAL DATA SOVEREIGNTY
            ================================================================== */}
        <section className="dws-section dws-ownership-section" aria-labelledby="ownership-heading">
          <div className="growth-container">
            <div className="dws-ownership-layout">
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
            SECTION 7 — DWS GROWTH ENGINE LAUNCH RATE: EXECUTIVE INVITATION
            ================================================================== */}
        <section className="dws-section dws-partner-section" aria-labelledby="partner-heading">
          <div className="growth-container">
            <div className="dws-invitation-plate">
              <div className="dws-plate-header">
                <div className="dws-plate-badge">
                  <span className="dws-plate-dot" aria-hidden="true" />
                  <span className="dws-plate-label">DWS GROWTH ENGINE — LAUNCH RATE</span>
                </div>
                <span className="dws-plate-allocation">LIMITED-TIME ENROLLMENT WINDOW</span>
              </div>

              <h2 id="partner-heading" className="dws-invitation-title">
                One fully connected Growth Engine. Launch window rate.
              </h2>

              <div className="dws-invitation-grid">
                {/* Investment Side */}
                <div className="dws-invitation-terms">
                  {/* Pricing Comparison Matrix */}
                  <div className="dws-pricing-comparison">
                    <div className="dws-price-block">
                      <div className="dws-price-anchor">
                        <span className="dws-anchor-label">STANDARD SETUP</span>
                        <span className="dws-anchor-num">$2,500</span>
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
                        <span className="dws-anchor-num">$1,497 <span className="dws-anchor-sub">/ month</span></span>
                      </div>
                      <div className="dws-launch-tier">
                        <span className="dws-launch-label">LAUNCH RATE</span>
                        <span className="dws-launch-num">$997 <span className="dws-launch-sub">/ month</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="dws-rate-lock-banner">
                    <span className="dws-lock-icon" aria-hidden="true">🔒</span>
                    <span className="dws-lock-text">
                      Lock in the $997 monthly management rate while your account remains active and in good standing.
                    </span>
                  </div>

                  <div className="dws-invitation-notes">
                    <p className="dws-urgency-note">
                      Limited-time launch rate. Once the current enrollment window closes, standard DWS pricing applies.
                    </p>
                    <p className="dws-ad-budget-note">
                      Minimum paid advertising budget: <strong>$500/month</strong>.<br />
                      Advertising spend is paid separately and is not included in the $997 monthly management fee.
                    </p>
                    <div className="dws-contract-terms">
                      <span>● No long-term contract</span>
                      <span>● 30-day cancellation</span>
                      <span>● Direct studio engineering</span>
                    </div>
                  </div>

                  <div className="dws-invitation-action">
                    <a
                      href={applyUrl}
                      className="dws-btn-primary"
                      onClick={() => handleCtaClick('Launch Rate Invitation CTA')}
                    >
                      <span>CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 8 — FINAL CLOSE: HIGH-IMPACT EDITORIAL RESOLUTION
            ================================================================== */}
        <section className="dws-section dws-final-close-section" aria-labelledby="close-heading">
          <div className="growth-container">
            <div className="dws-final-close-content">
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
                  className="dws-btn-primary dws-btn-large"
                  onClick={() => handleCtaClick('Final Close CTA')}
                >
                  <span>CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
                  <span className="dws-btn-arrow" aria-hidden="true">→</span>
                </a>
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
