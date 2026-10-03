import React, { useEffect, useState, useRef } from 'react';
import './growth.css';
import './growth-partner.css';
import { useGrowthSeo } from './lib/useGrowthSeo';
import { initGrowthTracking, trackGrowthEvent } from './lib/growth-tracking';

// Factual System States that animate sequentially as part of the hero command deck
const FACTUAL_SYSTEM_STATES = [
  {
    step: '01',
    state: 'LEAD CAPTURED',
    nodeName: 'TRAFFIC & CAPTURE',
    summary: 'High-intent prospect completed structured Growth Review intake',
    detail: 'Edge payload received · Attribution tokens locked · Zero latency drag',
    badge: 'PROTOCOL 01.0 // ACTIVE',
  },
  {
    step: '02',
    state: 'CONTACT CREATED',
    nodeName: 'CRM UNIFIED RECORD',
    summary: 'Prospect card compiled with zero duplication in sovereign CRM',
    detail: 'Complete profile generated · Dual-stage identity matching confirmed',
    badge: 'PROTOCOL 02.0 // ACTIVE',
  },
  {
    step: '03',
    state: 'PIPELINE UPDATED',
    nodeName: 'OPPORTUNITY STAGE',
    summary: 'New opportunity created in DWS Growth Acquisition Pipeline',
    detail: 'Stage ID validated · Expected value & conversion metadata linked',
    badge: 'PROTOCOL 03.0 // ACTIVE',
  },
  {
    step: '04',
    state: 'AUTOMATION TRIGGERED',
    nodeName: 'WEBHOOK ROUTING',
    summary: 'n8n dual-route automation initiated immediately upon intake',
    detail: 'Internal alert dispatched · Custom founder notification fired',
    badge: 'PROTOCOL 04.0 // ACTIVE',
  },
  {
    step: '05',
    state: 'APPOINTMENT BOOKED',
    nodeName: 'CALENDAR CADENCE',
    summary: 'Growth strategy call scheduled on master availability calendar',
    detail: '24-hour & 2-hour automated multi-channel reminders queued',
    badge: 'PROTOCOL 05.0 // ACTIVE',
  },
  {
    step: '06',
    state: 'SOURCE ATTRIBUTED',
    nodeName: 'CLOSED-LOOP ATTRIBUTION',
    summary: 'Exact traffic channel, campaign and ad asset mapped to opportunity',
    detail: 'Attribution continuum linked · Complete journey provenance',
    badge: 'PROTOCOL 06.0 // ACTIVE',
  },
];

export default function GrowthPartnerPage() {
  useGrowthSeo({
    title: 'Growth Engine | Dynasty Works Studio',
    description:
      'Turn attention into a system that produces revenue. DWS designs the infrastructure between traffic and the sale — capture, CRM, automation, booking, attribution and follow-up.',
    canonicalPath: '/growth-engine',
  });

  const [applyUrl, setApplyUrl] = useState('/growth/apply');
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Initialize attribution persistence engine (captures UTMs, fbclid, gclid, referrers)
    initGrowthTracking();

    // 2. Fire canonical landing and campaign tracking events
    trackGrowthEvent('growth_page_view', { page: '/growth-engine' });
    trackGrowthEvent('growth_engine_landing_view', {
      page: '/growth-engine',
      metadata: { offer: 'dws_launch_rate' },
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
      { rootMargin: '120px 0px 120px 0px', threshold: 0.01 }
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

    // 6. Progressive Factual System State Cycle Timer in Hero (every 3.2s)
    const timer = setInterval(() => {
      setActiveStateIndex((prev) => (prev + 1) % FACTUAL_SYSTEM_STATES.length);
    }, 3200);

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

  const currentState = FACTUAL_SYSTEM_STATES[activeStateIndex];

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
            onClick={() => handleCtaClick('Header CTA', 'CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW')}
          >
            <span className="dws-header-pulse-dot" aria-hidden="true" />
            <span>CLAIM THE LAUNCH RATE — FREE REVIEW</span>
            <span className="dws-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ==================================================================
            SECTION 1 — HERO: ENLARGED ULTRA-REALISTIC LIVING SYSTEM COMMAND DECK (DARK)
            ================================================================== */}
        <section
          ref={heroRef}
          className="dws-engine-hero dws-tone-dark"
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
            <div className="dws-hero-header-block">
              <div className="dws-hero-eyebrow">
                <span className="dws-eyebrow-rule" />
                <span className="dws-eyebrow-text">DYNASTY WORKS STUDIO</span>
                <span className="dws-eyebrow-badge">
                  <span className="dws-pulse-beacon" />
                  LAUNCH RATE ENROLLMENT ACTIVE
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
                      'CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW'
                    )
                  }
                >
                  <span>CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
                  <span className="dws-btn-arrow" aria-hidden="true">→</span>
                </a>

                <div className="dws-hero-urgency-chip">
                  <span className="dws-chip-icon">✦</span>
                  <span>LIMITED-TIME ENROLLMENT • STANDARD SETUP $2,500 → LAUNCH SETUP $997</span>
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

            {/* STATE-OF-THE-ART LIVING SYSTEM COMMAND DECK & REAL-TIME OPERATING DASHBOARD */}
            <div className="dws-hero-command-deck" role="region" aria-label="Live Growth Engine Command Center">
              <div className="dws-command-deck-frame">
                {/* Precision HUD Corner Brackets */}
                <div className="dws-deck-bracket top-left" aria-hidden="true" />
                <div className="dws-deck-bracket top-right" aria-hidden="true" />
                <div className="dws-deck-bracket bottom-left" aria-hidden="true" />
                <div className="dws-deck-bracket bottom-right" aria-hidden="true" />

                {/* Subdued Scanning Beam */}
                <div className="dws-deck-scanline" aria-hidden="true" />

                {/* 1. Top Deck HUD Header Strip */}
                <div className="dws-deck-hud-top">
                  <div className="dws-deck-status">
                    <span className="dws-status-beacon" />
                    <span className="dws-status-mono">DWS SYSTEM COMMAND // REAL-TIME CONDUIT</span>
                    <span className="dws-status-build-tag">SYS_VER 5.8.0-PROD</span>
                  </div>
                  <div className="dws-deck-stats">
                    <span className="dws-stat-pill"><span className="dws-stat-dot emerald" /> EDGE DISPATCH: VERIFIED</span>
                    <span className="dws-stat-pill"><span className="dws-stat-dot cyan" /> PIPELINE: SYNCHRONIZED</span>
                    <span className="dws-stat-pill gold"><span className="dws-stat-dot gold" /> DATA SOVEREIGNTY: UNCOMPROMISED</span>
                  </div>
                </div>

                {/* 2. Dynamic Real-Time Command Center Stage (Vector / Live Telemetry / SVG Charts) */}
                <div className="dws-deck-console-stage">

                  {/* 2a. Floating High-Contrast KPI Cards */}
                  <div className="dws-console-kpi-grid">
                    {/* KPI 1: Appointment Cadence */}
                    <div className="dws-kpi-card">
                      <div className="dws-kpi-head">
                        <span className="dws-kpi-label">APPOINTMENT CADENCE</span>
                        <span className="dws-kpi-badge emerald">ACTIVE</span>
                      </div>
                      <div className="dws-kpi-body">
                        <span className="dws-kpi-val emerald" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>SYNCHRONIZED</span>
                        <svg className="dws-kpi-sparkline" viewBox="0 0 100 32" aria-hidden="true">
                          <defs>
                            <linearGradient id="sparkEmerald" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <polygon points="0,30 0,22 15,20 30,24 45,16 60,14 75,8 90,6 100,2 100,30" fill="url(#sparkEmerald)" />
                          <path d="M 0 22 L 15 20 L 30 24 L 45 16 L 60 14 L 75 8 L 90 6 L 100 2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="100" cy="2" r="3" fill="#10b981" className="dws-spark-node" />
                        </svg>
                      </div>
                      <span className="dws-kpi-sub">REMINDER SEQUENCE ACTIVE</span>
                    </div>

                    {/* KPI 2: Acquisition Pipeline */}
                    <div className="dws-kpi-card">
                      <div className="dws-kpi-head">
                        <span className="dws-kpi-label">ACQUISITION PIPELINE</span>
                        <span className="dws-kpi-badge gold">CONNECTED</span>
                      </div>
                      <div className="dws-kpi-body">
                        <span className="dws-kpi-val gold" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>ATTRIBUTED</span>
                        <svg className="dws-kpi-sparkline" viewBox="0 0 100 32" aria-hidden="true">
                          <defs>
                            <linearGradient id="sparkGold" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f3c442" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#f3c442" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <polygon points="0,30 0,8 15,10 30,15 45,18 60,22 75,24 90,26 100,28 100,30" fill="url(#sparkGold)" />
                          <path d="M 0 8 L 15 10 L 30 15 L 45 18 L 60 22 L 75 24 L 90 26 L 100 28" fill="none" stroke="#f3c442" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="100" cy="28" r="3" fill="#f3c442" className="dws-spark-node" />
                        </svg>
                      </div>
                      <span className="dws-kpi-sub">SOURCE ATTRIBUTED</span>
                    </div>

                    {/* KPI 3: Routing Latency */}
                    <div className="dws-kpi-card">
                      <div className="dws-kpi-head">
                        <span className="dws-kpi-label">ROUTING LATENCY</span>
                        <span className="dws-kpi-badge cyan">EDGE DISPATCH</span>
                      </div>
                      <div className="dws-kpi-body">
                        <span className="dws-kpi-val cyan" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>INSTANT</span>
                        <div className="dws-velocity-pulse-meter">
                          <div className="dws-meter-track">
                            <div className="dws-meter-fill" style={{ width: '100%' }} />
                          </div>
                          <span className="dws-meter-status">AUTOMATION TRIGGERED</span>
                        </div>
                      </div>
                      <span className="dws-kpi-sub">AUTOMATION TRIGGERED</span>
                    </div>

                    {/* KPI 4: Closed-Loop Attribution */}
                    <div className="dws-kpi-card highlight-gold">
                      <div className="dws-kpi-head">
                        <span className="dws-kpi-label">CLOSED-LOOP ATTRIBUTION</span>
                        <span className="dws-kpi-badge gold">VERIFIED</span>
                      </div>
                      <div className="dws-kpi-body">
                        <span className="dws-kpi-val gold" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>LINKED</span>
                        <svg className="dws-kpi-sparkline" viewBox="0 0 100 32" aria-hidden="true">
                          <defs>
                            <linearGradient id="sparkStairs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f3c442" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#f3c442" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <polygon points="0,30 0,26 25,26 25,20 50,20 50,14 75,14 75,6 100,6 100,30" fill="url(#sparkStairs)" />
                          <path d="M 0 26 L 25 26 L 25 20 L 50 20 L 50 14 L 75 14 L 75 6 L 100 6" fill="none" stroke="#f3c442" strokeWidth="2.5" />
                          <circle cx="100" cy="6" r="3" fill="#f3c442" className="dws-spark-node" />
                        </svg>
                      </div>
                      <span className="dws-kpi-sub">ATTRIBUTION LINKED</span>
                    </div>
                  </div>

                  {/* 2b. Interactive Architecture Map (Traffic → Capture → CRM → Automation → Booking → Revenue) */}
                  <div className="dws-flow-map-container" role="region" aria-label="End-to-End Pipeline Architecture">
                    <div className="dws-flow-map-header">
                      <div className="dws-flow-meta">
                        <span className="dws-flow-tag">// ARCHITECTURAL FLOW CONTINUUM</span>
                        <span className="dws-flow-title">DEMAND ROUTING & CLOSED-LOOP CONVERSION MAP</span>
                      </div>
                      <div className="dws-flow-status-pill">
                        <span className="dws-status-beacon pulse" />
                        <span>ACTIVE TELEMETRY: STAGE {currentState.step} OF 06</span>
                      </div>
                    </div>

                    {/* SVG Animated Flow Conduits */}
                    <div className="dws-flow-canvas-wrapper">
                      <svg className="dws-flow-svg" viewBox="0 0 960 50" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#f3c442" stopOpacity="0.9" />
                            <stop offset="80%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        {/* Static Conduit Spine */}
                        <path d="M 40 25 L 920 25" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 6" />
                        {/* Dynamic Animated Traveling Light Beam */}
                        <path
                          d="M 40 25 L 920 25"
                          stroke="url(#laserBeam)"
                          strokeWidth="3"
                          className="dws-laser-beam-anim"
                        />
                      </svg>

                      {/* 6 Responsive Pipeline Node Stations */}
                      <div className="dws-pipeline-nodes-strip">
                        {[
                          { step: '01', label: 'TRAFFIC', sub: 'Inbound Ingestion', val: 'SOURCE ATTRIBUTED', tag: 'INBOUND' },
                          { step: '02', label: 'CAPTURE', sub: 'Edge Intake', val: 'LEAD CAPTURED', tag: 'EDGE LP' },
                          { step: '03', label: 'CRM', sub: 'Sovereign Ledger', val: 'DEDUPLICATION VERIFIED', tag: 'HIGHLEVEL' },
                          { step: '04', label: 'AUTOMATION', sub: 'Instant Dispatch', val: 'AUTOMATION TRIGGERED', tag: 'N8N ENGINE' },
                          { step: '05', label: 'BOOKING', sub: 'Synced Calendar', val: 'APPOINTMENT BOOKED', tag: 'CALENDAR' },
                          { step: '06', label: 'REVENUE', sub: 'Closed-Loop Proof', val: 'ATTRIBUTION LINKED', tag: 'CLOSED LOOP' },
                        ].map((node, idx) => {
                          const isActive = activeStateIndex === idx;
                          return (
                            <button
                              key={node.step}
                              type="button"
                              className={`dws-node-station ${isActive ? 'active' : ''}`}
                              onClick={() => setActiveStateIndex(idx)}
                              aria-label={`Select stage ${node.step}: ${node.label}`}
                            >
                              <div className="dws-station-node-icon">
                                <span className="dws-station-num">{node.step}</span>
                                {isActive && <span className="dws-node-ping" aria-hidden="true" />}
                              </div>
                              <span className="dws-station-label">{node.label}</span>
                              <span className="dws-station-sub">{node.sub}</span>
                              <span className="dws-station-metric">{node.val}</span>
                              <span className="dws-station-tag">{node.tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 2c. Lower Split: Live Telemetry Feed & Conversion Trajectory Graph */}
                  <div className="dws-console-lower-grid">
                    {/* Left: Live Demand Telemetry Feed Terminal */}
                    <div className="dws-feed-terminal-panel">
                      <div className="dws-terminal-head">
                        <div className="dws-terminal-title-wrap">
                          <span className="dws-terminal-led" />
                          <span className="dws-terminal-title">LIVE TELEMETRY LOG // EVENT DISPATCH</span>
                        </div>
                        <span className="dws-terminal-count">STAGE {currentState.step} / 06</span>
                      </div>

                      <div className="dws-terminal-current-event">
                        <div className="dws-event-meta-row">
                          <span className="dws-event-type gold">✦ {currentState.state}</span>
                          <span className="dws-event-node">{currentState.nodeName}</span>
                          <span className="dws-event-time">ACTIVE NOW</span>
                        </div>
                        <p className="dws-event-summary">{currentState.summary}</p>
                        <p className="dws-event-detail">{currentState.detail}</p>
                      </div>

                      <div className="dws-terminal-feed-list" aria-hidden="true">
                        <div className="dws-log-row">
                          <span className="dws-log-time">10:14:02</span>
                          <span className="dws-log-badge green">CAPTURED</span>
                          <span className="dws-log-text">Aesthetic MedSpa inquiry · Paid Campaign (cpc) · gclid locked</span>
                        </div>
                        <div className="dws-log-row">
                          <span className="dws-log-time">10:14:03</span>
                          <span className="dws-log-badge cyan">DISPATCHED</span>
                          <span className="dws-log-text">Sovereign CRM contact record created · Deduplication verified</span>
                        </div>
                        <div className="dws-log-row">
                          <span className="dws-log-time">10:14:28</span>
                          <span className="dws-log-badge gold">BOOKED</span>
                          <span className="dws-log-text">Strategy call confirmed · Automated reminder sequence active</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic Demand & Conversion Trajectory Area Chart */}
                    <div className="dws-chart-panel">
                      <div className="dws-chart-head">
                        <div className="dws-chart-title-wrap">
                          <span className="dws-chart-led" />
                          <span className="dws-chart-title">CLOSED-LOOP CONVERSION TRAJECTORY</span>
                        </div>
                        <div className="dws-terminal-count">{currentState.state}</div>
                      </div>

                      <div className="dws-chart-body">
                        <svg className="dws-trajectory-svg" viewBox="0 0 460 140" preserveAspectRatio="none" aria-hidden="true">
                          <defs>
                            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f3c442" stopOpacity="0.25" />
                              <stop offset="70%" stopColor="#f3c442" stopOpacity="0.04" />
                              <stop offset="100%" stopColor="#f3c442" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="35%" stopColor="#38bdf8" />
                              <stop offset="75%" stopColor="#f3c442" />
                              <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="20" y1="25" x2="440" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          <line x1="20" y1="60" x2="440" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          <line x1="20" y1="95" x2="440" y2="95" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                          {/* Area Fill */}
                          <path
                            d="M 20 125 L 20 30 C 90 35, 140 55, 190 68 C 240 78, 290 85, 340 98 C 390 105, 420 110, 440 114 L 440 125 Z"
                            fill="url(#chartAreaGrad)"
                          />

                          {/* Smooth Trajectory Spline */}
                          <path
                            d="M 20 30 C 90 35, 140 55, 190 68 C 240 78, 290 85, 340 98 C 390 105, 420 110, 440 114"
                            fill="none"
                            stroke="url(#chartLineGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="dws-chart-line-draw"
                          />

                          {/* Milestone Nodes */}
                          <circle cx="20" cy="30" r="4" fill="#10b981" className="dws-chart-node" />
                          <circle cx="105" cy="45" r="4" fill="#10b981" className="dws-chart-node" />
                          <circle cx="190" cy="68" r="4" fill="#38bdf8" className="dws-chart-node" />
                          <circle cx="275" cy="82" r="4" fill="#38bdf8" className="dws-chart-node" />
                          <circle cx="360" cy="102" r="4" fill="#f3c442" className="dws-chart-node" />
                          <circle cx="440" cy="114" r="5" fill="#f3c442" className="dws-chart-node pulse-gold" />
                        </svg>

                        {/* Chart Bottom Milestone Axis */}
                        <div className="dws-chart-axis-labels">
                          <span>01 TRAFFIC</span>
                          <span>02 CAPTURE</span>
                          <span>03 CRM LEDGER</span>
                          <span>04 AUTOMATION</span>
                          <span>05 BOOKING</span>
                          <span className="gold">06 ATTRIBUTION</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Integrated Continuous Signal Pipeline Conduit Bus (The 6 Stages) */}
                <div className="dws-deck-conduit-bar" role="region" aria-label="Signal Pipeline Stages">
                  <div className="dws-conduit-bus-line">
                    <div
                      className="dws-conduit-laser-pulse"
                      style={{
                        left: `${(activeStateIndex / 5) * 85}%`,
                        transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                  <div className="dws-conduit-nodes">
                    <div className={`dws-conduit-step ${activeStateIndex === 0 ? 'active-highlight' : ''}`}>
                      <span className="dws-step-code">01</span>
                      <span className="dws-step-label">TRAFFIC</span>
                      <span className="dws-step-detail">Meta · Google · Direct</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className={`dws-conduit-step ${activeStateIndex === 1 ? 'active-highlight' : ''}`}>
                      <span className="dws-step-code">02</span>
                      <span className="dws-step-label">CAPTURE</span>
                      <span className="dws-step-detail">Edge Lead Intake</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className={`dws-conduit-step ${activeStateIndex === 2 ? 'active-highlight' : ''}`}>
                      <span className="dws-step-code">03</span>
                      <span className="dws-step-label">CRM</span>
                      <span className="dws-step-detail">Sovereign Contact Ledger</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className={`dws-conduit-step ${activeStateIndex === 3 ? 'active-highlight' : ''}`}>
                      <span className="dws-step-code">04</span>
                      <span className="dws-step-label">AUTOMATION</span>
                      <span className="dws-step-detail">Instant Routing Engine</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className={`dws-conduit-step ${activeStateIndex === 4 ? 'active-highlight' : ''}`}>
                      <span className="dws-step-code">05</span>
                      <span className="dws-step-label">BOOKING</span>
                      <span className="dws-step-detail">Synced Calendar Cadence</span>
                    </div>
                    <div className="dws-conduit-arrow" aria-hidden="true">→</div>

                    <div className={`dws-conduit-step ${activeStateIndex === 5 ? 'active-highlight gold' : ''}`}>
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
            SECTION 2 — THE PROBLEM: EDITORIAL LEAKAGE JOURNEY (WARM LIGHT STONE)
            ================================================================== */}
        <section id="the-problem" className="dws-section dws-problem-section dws-tone-light-stone" aria-labelledby="problem-heading">
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
                            <span className="dws-metric-val alert">UNROUTED LAG</span>
                          </div>
                          <div className="dws-telemetry-bar-wrap">
                            <div className="dws-telemetry-bar decay" />
                          </div>
                          <span className="dws-telemetry-subnote">Lead responsiveness decays rapidly without immediate automated routing</span>
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
                            <span className="dws-stat-kicker">Standard Calendar State</span>
                            <span className="dws-stat-number alert">UNCONFIRMED</span>
                          </div>
                          <div className="dws-split-sep" />
                          <div className="dws-split-stat">
                            <span className="dws-stat-kicker">DWS Automated Cadence</span>
                            <span className="dws-stat-number success">CONFIRMED</span>
                          </div>
                        </div>
                        <span className="dws-telemetry-subnote">REMINDER SEQUENCE ACTIVE // Multi-channel confirmation protocol</span>
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
            SECTION 3 — THE DWS ENGINE: CONNECTED SYSTEM ARCHITECTURE (DARK)
            ================================================================== */}
        <section className="dws-section dws-engine-section dws-tone-dark" aria-labelledby="engine-heading">
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
                  <span className="dws-telemetry-chip">LATENCY: EDGE VERIFIED</span>
                  <span className="dws-telemetry-chip">PIPELINE: SYNCHRONIZED</span>
                  <span className="dws-telemetry-chip">ATTRIBUTION: LINKED</span>
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
                    <span className="dws-node-metric">SOURCE ATTRIBUTED</span>
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
                    <span className="dws-node-metric">Sub-Second First Paint</span>
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
                    <span className="dws-node-metric">LEAD CAPTURED</span>
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
                    <span className="dws-node-metric">DEDUPLICATION VERIFIED</span>
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
                    <span className="dws-node-metric">AUTOMATION TRIGGERED</span>
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
                    <span className="dws-node-metric">APPOINTMENT BOOKED</span>
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
                    <span className="dws-node-metric">PIPELINE UPDATED</span>
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
                    <span>Closed-Loop Tracking</span>
                    <span className="dws-node-metric">ATTRIBUTION LINKED</span>
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
            SECTION 4 — WHAT DWS ACTUALLY BUILDS: EDITORIAL CHAPTERS (LIGHT NEUTRAL)
            ================================================================== */}
        <section className="dws-section dws-chapters-section dws-tone-light-neutral" aria-labelledby="builds-heading">
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
            SECTION 5 — DELIVERY METHOD: CINEMATIC TIMELINE (DARK)
            ================================================================== */}
        <section className="dws-section dws-method-section dws-tone-dark" aria-labelledby="method-heading">
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

            {/* Native 4-Phase Infrastructure Interface System */}
            <div className="dws-infra-protocol-system dws-reveal" role="region" aria-label="Four-Phase Growth Infrastructure Protocol">
              {/* Top Continuous Bus Conduit with Animated Laser Pulse */}
              <div className="dws-infra-bus-bar" aria-hidden="true">
                <div className="dws-infra-bus-track">
                  <div className="dws-infra-bus-pulse" />
                </div>
                <div className="dws-infra-bus-milestones">
                  <div className="dws-infra-bus-node active">
                    <span className="dws-bus-node-dot" />
                    <span className="dws-bus-node-label">01 DIAGNOSE</span>
                  </div>
                  <div className="dws-infra-bus-node active">
                    <span className="dws-bus-node-dot" />
                    <span className="dws-bus-node-label">02 ARCHITECT</span>
                  </div>
                  <div className="dws-infra-bus-node active">
                    <span className="dws-bus-node-dot" />
                    <span className="dws-bus-node-label">03 PROVE</span>
                  </div>
                  <div className="dws-infra-bus-node live">
                    <span className="dws-bus-node-dot" />
                    <span className="dws-bus-node-label">04 OPERATE</span>
                  </div>
                </div>
              </div>

              {/* The 4 Distinct Native Interface Panels */}
              <div className="dws-infra-cards-grid">
                {/* 1. PHASE 1 — DIAGNOSE */}
                <div className="dws-infra-card dws-phase-diagnose">
                  <div className="dws-infra-card-header">
                    <div className="dws-infra-card-meta">
                      <span className="dws-infra-phase-badge">PHASE 01</span>
                      <span className="dws-infra-status-chip warning">
                        <span className="dws-status-chip-dot" />
                        AUDIT // FRICTION
                      </span>
                    </div>
                    <h3 className="dws-infra-card-title">DIAGNOSE</h3>
                  </div>

                  {/* Native Interface Module: Diagnostic Wireframe & Bottlenecks */}
                  <div className="dws-infra-card-body">
                    {/* Diagnostic Score Card */}
                    <div className="dws-diagnose-score-panel">
                      <div className="dws-score-label-row">
                        <span className="dws-ui-mono">JOURNEY DIAGNOSTIC</span>
                        <span className="dws-ui-badge red">FRICTION DETECTED</span>
                      </div>
                      <div className="dws-score-meter-track">
                        <div className="dws-score-meter-bar red" style={{ width: '100%' }} />
                      </div>
                      <div className="dws-score-meta-stat">
                        <span>LEAD ROUTING STATE:</span>
                        <strong className="dws-text-warn">UNROUTED DELAY</strong>
                      </div>
                    </div>

                    {/* Bottleneck Wireframe & Failure Points */}
                    <div className="dws-diagnose-wireframe">
                      <div className="dws-ui-section-title">// FRICTION AUDIT</div>
                      <div className="dws-diagnose-nodes-list">
                        <div className="dws-diagnose-item leak">
                          <span className="dws-diagnose-indicator red">!</span>
                          <div className="dws-diagnose-info">
                            <span className="dws-diagnose-name">Traffic Ingestion Leak</span>
                            <span className="dws-diagnose-desc">Drop-off on unoptimized intake form</span>
                          </div>
                        </div>
                        <div className="dws-diagnose-item delay">
                          <span className="dws-diagnose-indicator amber">⧗</span>
                          <div className="dws-diagnose-info">
                            <span className="dws-diagnose-name">Unrouted Follow-up</span>
                            <span className="dws-diagnose-desc">Unrouted manual delay suppresses booking rate</span>
                          </div>
                        </div>
                        <div className="dws-diagnose-item silo">
                          <span className="dws-diagnose-indicator red">✕</span>
                          <div className="dws-diagnose-info">
                            <span className="dws-diagnose-name">Siloed Data</span>
                            <span className="dws-diagnose-desc">Fragmented records, zero unified attribution</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini SVG Bottleneck Flow Wireframe */}
                      <div className="dws-diagnose-flow-svg-wrap">
                        <svg className="dws-diagnose-svg" viewBox="0 0 240 38" fill="none" aria-hidden="true">
                          <rect x="2" y="8" width="56" height="22" rx="3" fill="#141824" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="30" y="22" textAnchor="middle" fill="#9fa4b2" fontSize="7.5" fontFamily="monospace">TRAFFIC</text>
                          
                          <path d="M 58 19 L 90 19" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="74" cy="19" r="2.5" fill="#ef4444" />
                          
                          <rect x="92" y="8" width="58" height="22" rx="3" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1" />
                          <text x="121" y="22" textAnchor="middle" fill="#fca5a5" fontSize="7" fontFamily="monospace">LEAK DETECTED</text>
                          
                          <path d="M 150 19 L 176 19" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                          
                          <rect x="178" y="8" width="60" height="22" rx="3" fill="#141824" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="208" y="22" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">LOST LEAD</text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Caption */}
                  <div className="dws-infra-card-footer">
                    <p className="dws-infra-card-desc">
                      Understand the current journey and locate the failure points.
                    </p>
                  </div>
                </div>

                {/* 2. PHASE 2 — ARCHITECT */}
                <div className="dws-infra-card dws-phase-architect">
                  <div className="dws-infra-card-header">
                    <div className="dws-infra-card-meta">
                      <span className="dws-infra-phase-badge">PHASE 02</span>
                      <span className="dws-infra-status-chip cyan">
                        <span className="dws-status-chip-dot" />
                        LOGIC // BLUEPRINT
                      </span>
                    </div>
                    <h3 className="dws-infra-card-title">ARCHITECT</h3>
                  </div>

                  {/* Native Interface Module: Blueprint Logic & Conduit Schematic */}
                  <div className="dws-infra-card-body">
                    <div className="dws-blueprint-schematic-panel">
                      <div className="dws-blueprint-head">
                        <span className="dws-ui-mono">ENGINE ARCHITECTURE</span>
                        <span className="dws-ui-badge cyan">TOPOLOGY 1.0</span>
                      </div>

                      {/* Schematic Visual Flow */}
                      <div className="dws-blueprint-flow-wrap">
                        <div className="dws-blueprint-node-row">
                          <div className="dws-bp-block">
                            <span className="dws-bp-tag">INPUT</span>
                            <span className="dws-bp-val">Edge LP Intake</span>
                          </div>
                          <span className="dws-bp-arrow">→</span>
                          <div className="dws-bp-block active">
                            <span className="dws-bp-tag">DEDUP</span>
                            <span className="dws-bp-val">Sovereign CRM</span>
                          </div>
                        </div>

                        <div className="dws-bp-connector-mid">
                          <svg className="dws-bp-bus-svg" viewBox="0 0 240 18" fill="none" aria-hidden="true">
                            <path d="M 60 2 L 60 9 L 180 9 L 180 16" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                            <circle cx="120" cy="9" r="2.5" fill="#38bdf8" />
                          </svg>
                        </div>

                        <div className="dws-blueprint-node-row">
                          <div className="dws-bp-block">
                            <span className="dws-bp-tag">SPEED</span>
                            <span className="dws-bp-val">Instant SMS Cadence</span>
                          </div>
                          <span className="dws-bp-arrow">→</span>
                          <div className="dws-bp-block highlight">
                            <span className="dws-bp-tag">OUTPUT</span>
                            <span className="dws-bp-val">Calendar Lock</span>
                          </div>
                        </div>
                      </div>

                      {/* Logic Rules Table */}
                      <div className="dws-blueprint-rules-box">
                        <div className="dws-bp-rule">
                          <span className="dws-bp-kw">RULE 1</span>
                          <span className="dws-bp-stmt">High-Intent Lead &rarr; VIP Priority Routing</span>
                        </div>
                        <div className="dws-bp-rule">
                          <span className="dws-bp-kw">RULE 2</span>
                          <span className="dws-bp-stmt">Unscheduled Lead &rarr; Follow-up Cadence</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Caption */}
                  <div className="dws-infra-card-footer">
                    <p className="dws-infra-card-desc">
                      Design the connected Growth Engine around how the business actually sells.
                    </p>
                  </div>
                </div>

                {/* 3. PHASE 3 — PROVE */}
                <div className="dws-infra-card dws-phase-prove">
                  <div className="dws-infra-card-header">
                    <div className="dws-infra-card-meta">
                      <span className="dws-infra-phase-badge">PHASE 03</span>
                      <span className="dws-infra-status-chip emerald">
                        <span className="dws-status-chip-dot" />
                        STAGING // VERIFIED
                      </span>
                    </div>
                    <h3 className="dws-infra-card-title">PROVE</h3>
                  </div>

                  {/* Native Interface Module: QA Test Matrix & Staging Suite */}
                  <div className="dws-infra-card-body">
                    <div className="dws-staging-suite-panel">
                      <div className="dws-staging-head">
                        <span className="dws-ui-mono">STAGING VERIFICATION</span>
                        <span className="dws-ui-badge emerald">VERIFICATION COMPLETE</span>
                      </div>

                      {/* Interactive QA Checklist */}
                      <div className="dws-qa-checklist">
                        <div className="dws-qa-item pass">
                          <span className="dws-qa-icon">✓</span>
                          <div className="dws-qa-meta">
                            <span className="dws-qa-name">Lead Ingestion Webhook</span>
                            <span className="dws-qa-timing">LEAD CAPTURED // EDGE VERIFIED</span>
                          </div>
                          <span className="dws-qa-state">PASS</span>
                        </div>

                        <div className="dws-qa-item pass">
                          <span className="dws-qa-icon">✓</span>
                          <div className="dws-qa-meta">
                            <span className="dws-qa-name">Identity Deduplication</span>
                            <span className="dws-qa-timing">DEDUPLICATION VERIFIED</span>
                          </div>
                          <span className="dws-qa-state">PASS</span>
                        </div>

                        <div className="dws-qa-item pass">
                          <span className="dws-qa-icon">✓</span>
                          <div className="dws-qa-meta">
                            <span className="dws-qa-name">Multi-Channel Cadence</span>
                            <span className="dws-qa-timing">REMINDER SEQUENCE ACTIVE</span>
                          </div>
                          <span className="dws-qa-state">PASS</span>
                        </div>

                        <div className="dws-qa-item pass">
                          <span className="dws-qa-icon">✓</span>
                          <div className="dws-qa-meta">
                            <span className="dws-qa-name">Closed-Loop CAPI Sync</span>
                            <span className="dws-qa-timing">ATTRIBUTION LINKED</span>
                          </div>
                          <span className="dws-qa-state">PASS</span>
                        </div>
                      </div>

                      {/* Staging Benchmark Banner */}
                      <div className="dws-staging-cert-bar">
                        <span className="dws-cert-dot" />
                        <span>ZERO CODE TO PROD WITHOUT QA</span>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Caption */}
                  <div className="dws-infra-card-footer">
                    <p className="dws-infra-card-desc">
                      Build in staging and test every critical path.
                    </p>
                  </div>
                </div>

                {/* 4. PHASE 4 — OPERATE */}
                <div className="dws-infra-card dws-phase-operate">
                  <div className="dws-infra-card-header">
                    <div className="dws-infra-card-meta">
                      <span className="dws-infra-phase-badge">PHASE 04</span>
                      <span className="dws-infra-status-chip gold live-pulse">
                        <span className="dws-status-chip-dot live" />
                        PROD // ACTIVE
                      </span>
                    </div>
                    <h3 className="dws-infra-card-title">OPERATE</h3>
                  </div>

                  {/* Native Interface Module: Real-time Telemetry & Attribution */}
                  <div className="dws-infra-card-body">
                    <div className="dws-operate-dashboard-panel">
                      <div className="dws-operate-head">
                        <span className="dws-ui-mono">LIVE PRODUCTION</span>
                        <span className="dws-ui-badge gold">CONTINUOUS</span>
                      </div>

                      {/* Mini Live KPI Grid */}
                      <div className="dws-operate-kpi-row">
                        <div className="dws-operate-kpi-item">
                          <span className="dws-kpi-sub">PIPELINE STATUS</span>
                          <div className="dws-kpi-main">
                            <strong className="dws-kpi-val emerald">SYNCHRONIZED</strong>
                            <span className="dws-kpi-delta">APPOINTMENT BOOKED</span>
                          </div>
                        </div>
                        <div className="dws-operate-kpi-item">
                          <span className="dws-kpi-sub">ROUTING ENGINE</span>
                          <div className="dws-kpi-main">
                            <strong className="dws-kpi-val gold">AUTOMATED</strong>
                            <span className="dws-kpi-delta">CONTACT CREATED</span>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Trajectory SVG Graph */}
                      <div className="dws-operate-chart-box">
                        <div className="dws-chart-meta-row">
                          <span className="dws-ui-mono">CLOSED-LOOP ATTRIBUTION</span>
                          <span className="dws-chart-rev-val gold">ATTRIBUTION LINKED</span>
                        </div>
                        <div className="dws-operate-svg-wrap">
                          <svg className="dws-operate-chart-svg" viewBox="0 0 240 50" preserveAspectRatio="none" fill="none" aria-hidden="true">
                            <defs>
                              <linearGradient id="operateRevGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f3c442" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#f3c442" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 46 Q 60 42 100 30 T 180 14 T 240 4 L 240 50 L 0 50 Z" fill="url(#operateRevGrad)" />
                            <path d="M 0 46 Q 60 42 100 30 T 180 14 T 240 4" stroke="#f3c442" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="240" cy="4" r="3" fill="#f3c442" />
                          </svg>
                        </div>
                        <div className="dws-operate-chart-legend">
                          <span>W1: INTAKE</span>
                          <span>W2: STAGING</span>
                          <span>W3: SCALE</span>
                          <span className="gold">LIVE PROD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Caption */}
                  <div className="dws-infra-card-footer">
                    <p className="dws-infra-card-desc">
                      Launch, monitor and improve the system against real conversion data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6 — CREATIVE RANGE: CROSS-CATEGORY POSITIONING (WARM LIGHT STONE)
            ================================================================== */}
        <section className="dws-section dws-range-section dws-tone-light-warm" aria-labelledby="range-heading">
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
                    src="/visuals/range-medspa.jpg"
                    alt="Aesthetic medicine doctor and clinic director reviewing treatment diagnostics in a luxury travertine treatment suite"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-medspa.jpg';
                      }
                    }}
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
                    src="/visuals/range-fitness.jpg"
                    alt="Black head strength coach and athlete reviewing biometric telemetry in an architectural obsidian gym"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-fitness.jpg';
                      }
                    }}
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
                    src="/visuals/range-automotive.jpg"
                    alt="Master automotive artisan and engineer inspecting a supercar chassis in an architectural atelier workshop"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-automotive.jpg';
                      }
                    }}
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
                    src="/visuals/range-architectural.jpg"
                    alt="Black woman lead architect and Latino master builder reviewing construction blueprints in a modern luxury residence"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-architectural.jpg';
                      }
                    }}
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
                    src="/visuals/range-advisory.jpg"
                    alt="Diverse executive leadership team collaborating around a stone table in a skyline conference boardroom"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-advisory.jpg';
                      }
                    }}
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
                    src="/visuals/range-hospitality.jpg"
                    alt="Latina beverage director and culinary artisan inspecting bespoke bottled elixirs in an intimate marble lounge"
                    className="dws-range-img"
                    width={800}
                    height={600}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/growth/visuals/range-hospitality.jpg';
                      }
                    }}
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
            SECTION 7 — OWNERSHIP: RADICAL DATA SOVEREIGNTY (DARK)
            ================================================================== */}
        <section className="dws-section dws-ownership-section dws-tone-dark" aria-labelledby="ownership-heading">
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
            SECTION 8 — LAUNCH RATE ENROLLMENT: LIMITED-TIME OFFER (CHAMPAGNE NEUTRAL)
            ================================================================== */}
        <section className="dws-section dws-partner-section dws-tone-champagne" aria-labelledby="partner-heading">
          <div className="growth-container">
            <div className="dws-invitation-plate dws-reveal">
              <div className="dws-plate-header">
                <div className="dws-plate-badge">
                  <span className="dws-plate-dot" aria-hidden="true" />
                  <span className="dws-plate-label">Launch Rate Enrollment</span>
                </div>
                <span className="dws-plate-allocation">LIMITED-TIME ENROLLMENT WINDOW</span>
              </div>

              <h2 id="partner-heading" className="dws-invitation-title">
                One fully connected Growth Engine. Launch rate enrollment.
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
                        <strong>Urgency:</strong> Limited-time launch rate. Once the current enrollment window closes, standard DWS pricing applies. Lock in the $997 monthly management rate while your account remains active and in good standing.
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
                          'CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW'
                        )
                      }
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
                    <li><span className="dws-check" aria-hidden="true">✓</span> DWS direct system support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 9 — FINAL CLOSE: HIGH-IMPACT EDITORIAL RESOLUTION (DARK)
            ================================================================== */}
        <section className="dws-section dws-final-close-section dws-tone-dark" aria-labelledby="close-heading">
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
                      'CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW'
                    )
                  }
                >
                  <span>CLAIM THE LAUNCH RATE — START WITH MY FREE GROWTH REVIEW</span>
                  <span className="dws-btn-arrow" aria-hidden="true">→</span>
                </a>
              </div>

              <div className="dws-close-reassurance">
                <span>Zero Obligation Diagnostic</span>
                <span className="dws-sep">·</span>
                <span>Direct Founder Consultation</span>
                <span className="dws-sep">·</span>
                <span>Limited Enrollment Window</span>
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
