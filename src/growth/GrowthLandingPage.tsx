import React, { useEffect } from 'react';
import './growth.css';
import { GrowthNav } from './components/GrowthNav';
import { ProblemCards } from './components/ProblemCards';
import { FunnelFlow } from './components/FunnelFlow';
import { VerticalsSection } from './components/VerticalCard';
import { DifferenceComparison } from './components/DifferenceComparison';
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
        {/* ==================================================================
            01 — HERO (DARK OBSIDIAN)
            Visual Authority: 01-growth-os-hero.png
            ================================================================== */}
        <section className="growth-section-editorial growth-theme-dark" aria-labelledby="hero-headline">
          <div className="growth-container">
            <div className="growth-hero-grid">
              <div>
                <span className="growth-eyebrow">DYNASTY GROWTH OPERATING SYSTEM</span>
                <h1 id="hero-headline" className="growth-lead-title" style={{ fontSize: 'clamp(44px, 5.8vw, 88px)' }}>
                  TURN ATTENTION INTO<br />
                  <em>MEASURABLE GROWTH.</em>
                </h1>
                <p className="growth-sub">
                  Dynasty Works Studio builds the infrastructure connecting your website, advertising,
                  CRM, automated follow-up and sales pipeline—so leads don’t disappear between the click
                  and the close.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                  <a
                    href="#diagnostic"
                    className="growth-btn growth-btn-signal"
                    onClick={() => handleCtaClick('Hero Primary CTA', '#diagnostic')}
                  >
                    <span>BUILD MY GROWTH SYSTEM</span>
                    <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="#acquisition"
                    className="growth-btn growth-btn-outline-dark"
                    onClick={() => handleCtaClick('Hero Secondary CTA', '#acquisition')}
                  >
                    <span>SEE HOW IT WORKS</span>
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.12em', color: '#686c77', textTransform: 'uppercase' }}>
                  <span>Strategy</span> · <span>Infrastructure</span> · <span>Automation</span> · <span>Acquisition</span> · <span>Intelligence</span>
                </div>
              </div>

              {/* Master 01: Hero Architectural Visual Authority */}
              <div className="growth-hero-visual-authority">
                <img
                  src="/growth/assets/01-growth-os-hero.png"
                  alt="Dynasty Works Studio Growth Operating System connecting attention to measurable growth."
                  className="growth-master-img"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="growth-asset-caption">
                  <span>SUBSYSTEM · OS CORE</span>
                  <span style={{ color: 'var(--dws-signal)' }}>● OPERATING PLATFORM V1.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            02 — THE PROBLEM (LIGHT WARM PAPER)
            Typography + Lightweight Fragmented System Visualization
            ================================================================== */}
        <ProblemCards />

        {/* ==================================================================
            03 — ACQUISITION (DARK OBSIDIAN)
            Visual Authority: 02-acquisition.png
            ================================================================== */}
        <section id="acquisition" className="growth-section-editorial growth-theme-dark" aria-labelledby="acq-heading">
          <div className="growth-container">
            <div className="growth-editorial-split">
              <div>
                <span className="growth-eyebrow">MODULE 01 · PAID ACQUISITION</span>
                <h2 id="acq-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Engineered demand.<br />
                  <em>Intent-focused media.</em>
                </h2>
                <p className="growth-sub">
                  Targeted Meta and Google campaigns structured around commercial intent, differentiated creative,
                  and direct Conversion API (CAPI) server feedback loops.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-signal)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#b9bcc6' }}>
                    <li>— Meta Conversions API (CAPI) server-side integration</li>
                    <li>— High-intent Google Search & demand harvesting</li>
                    <li>— Full UTM attribution & keyword telemetry mapping</li>
                  </ul>
                </div>
              </div>

              {/* Master 02: Acquisition Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/02-acquisition.png"
                  alt="Paid acquisition system connecting Meta and Google traffic to conversion infrastructure."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 01 · DEMAND HARVESTING</span>
                  <span style={{ color: 'var(--dws-signal)' }}>CAPI VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            04 — CONVERSION EXPERIENCE (LIGHT WARM PAPER)
            Visual Authority: 03-conversion.png
            ================================================================== */}
        <section id="conversion" className="growth-section-editorial growth-theme-light" aria-labelledby="conv-heading">
          <div className="growth-container">
            <div className="growth-editorial-split is-reversed">
              <div>
                <span className="growth-eyebrow">MODULE 02 · CONVERSION INTERFACE</span>
                <h2 id="conv-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Traffic into experience.<br />
                  <em>Experience into leads.</em>
                </h2>
                <p className="growth-sub">
                  Sub-second edge-rendered web surfaces, landing pages, and progressive qualification forms
                  engineered to eliminate bounce and turn commercial interest into verified opportunities.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-ink)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dws-muted)' }}>
                    <li>— Sub-400ms Largest Contentful Paint (LCP)</li>
                    <li>— Progressive qualification inputs with honeypot security</li>
                    <li>— Dynamic Number Insertion (DNI) for call tracking</li>
                  </ul>
                </div>
              </div>

              {/* Master 03: Conversion Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/03-conversion.png"
                  alt="Conversion infrastructure transforming website visitors into captured leads."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 02 · CONVERSION EXPERIENCE</span>
                  <span style={{ color: 'var(--dws-signal)' }}>0.4s LCP BENCHMARK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            05 — CRM + SALES PIPELINE (DARK OBSIDIAN)
            Visual Authority: 04-crm.png
            ================================================================== */}
        <section id="crm" className="growth-section-editorial growth-theme-dark" aria-labelledby="crm-heading">
          <div className="growth-container">
            <div className="growth-editorial-split">
              <div>
                <span className="growth-eyebrow">MODULE 03 · PIPELINE ARCHITECTURE</span>
                <h2 id="crm-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Centralized CRM &<br />
                  <em>opportunity governance.</em>
                </h2>
                <p className="growth-sub">
                  Every inquiry instantly normalized, deduplicated, enriched, and assigned to custom sales pipeline
                  stages with audit logs and sales SLA tracking.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-signal)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#b9bcc6' }}>
                    <li>— Real-time contact deduplication & history sync</li>
                    <li>— Multi-stage pipeline architecture with SLA monitors</li>
                    <li>— Unified omnichannel communication timelines</li>
                  </ul>
                </div>
              </div>

              {/* Master 04: CRM Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/04-crm.png"
                  alt="CRM system organizing leads and opportunities through a sales pipeline."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 03 · CRM REPOSITORY</span>
                  <span style={{ color: 'var(--dws-signal)' }}>&lt; 300ms INGESTION</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            06 — AUTOMATION (LIGHT WARM PAPER)
            Visual Authority: 05-automation.png
            ================================================================== */}
        <section id="automation" className="growth-section-editorial growth-theme-light" aria-labelledby="auto-heading">
          <div className="growth-container">
            <div className="growth-editorial-split is-reversed">
              <div>
                <span className="growth-eyebrow">MODULE 04 · RAPID EXECUTION</span>
                <h2 id="auto-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Sub-60-second follow-up.<br />
                  <em>24/7 engagement.</em>
                </h2>
                <p className="growth-sub">
                  The system keeps working long after the lead submits. Automated two-way SMS, behavioral email
                  sequences, and team notifications fire while buyer interest is at its peak.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-ink)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dws-muted)' }}>
                    <li>— Sub-60s conversational SMS response protocols</li>
                    <li>— Multi-touch nurture & reactivation sequences</li>
                    <li>— Immediate internal team routing & SMS push alerts</li>
                  </ul>
                </div>
              </div>

              {/* Master 05: Automation Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/05-automation.png"
                  alt="Automated follow-up system connecting lead events to SMS, email and appointment workflows."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 04 · CONVERSATIONAL AUTOMATION</span>
                  <span style={{ color: 'var(--dws-signal)' }}>&lt; 60s RESPONSE TIME</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            07 — LIVE FLOW (DARK OBSIDIAN)
            Interactive Architecture
            ================================================================== */}
        <FunnelFlow />

        {/* ==================================================================
            08 — APPOINTMENT BOOKING (LIGHT WARM PAPER)
            Visual Authority: 06-appointment.png
            ================================================================== */}
        <section id="appointment" className="growth-section-editorial growth-theme-light" aria-labelledby="apt-heading">
          <div className="growth-container">
            <div className="growth-editorial-split">
              <div>
                <span className="growth-eyebrow">MODULE 05 · CALENDAR INTEGRATION</span>
                <h2 id="apt-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Frictionless booking.<br />
                  <em>Guaranteed attendance.</em>
                </h2>
                <p className="growth-sub">
                  Real-time calendar slot allocation paired with automated briefing agendas, confirmations,
                  and two-way SMS reminders that achieve 94%+ attendance rates.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-ink)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dws-muted)' }}>
                    <li>— Automated multi-channel reminders (24h, 2h, 15m)</li>
                    <li>— Proactive reschedule & no-show recovery loops</li>
                    <li>— Pre-call qualification agenda attached to invites</li>
                  </ul>
                </div>
              </div>

              {/* Master 06: Appointment Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/06-appointment.png"
                  alt="Appointment booking system connecting online scheduling, reminders and confirmation."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 05 · CALENDAR INFRASTRUCTURE</span>
                  <span style={{ color: 'var(--dws-signal)' }}>94%+ SHOW-RATE PROTOCOL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            09 — SALES PIPELINE (DARK OBSIDIAN)
            Visual Authority: 07-pipeline.png
            ================================================================== */}
        <section id="pipeline" className="growth-section-editorial growth-theme-dark" aria-labelledby="pipe-heading">
          <div className="growth-container">
            <div className="growth-editorial-split is-reversed">
              <div>
                <span className="growth-eyebrow">MODULE 06 · DEAL VELOCITY</span>
                <h2 id="pipe-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Sales pipeline velocity.<br />
                  <em>Structured advancement.</em>
                </h2>
                <p className="growth-sub">
                  Visual milestone progression tracking deals from first consultation to closed agreement,
                  ensuring proposals are tracked and sales teams execute without blind spots.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-signal)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#b9bcc6' }}>
                    <li>— Automated proposal view tracking & notification</li>
                    <li>— Operator task SLAs & milestone progression</li>
                    <li>— Direct integration with contract & billing systems</li>
                  </ul>
                </div>
              </div>

              {/* Master 07: Pipeline Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/07-pipeline.png"
                  alt="Sales pipeline tracking leads from initial contact through closed opportunity."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 06 · PIPELINE VELOCITY</span>
                  <span style={{ color: 'var(--dws-signal)' }}>STAGE TRACKING ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            10 — VERTICALS (LIGHT WARM PAPER)
            Interactive Selector
            ================================================================== */}
        <VerticalsSection />

        {/* ==================================================================
            11 — MEASURE / ATTRIBUTION (DARK OBSIDIAN)
            Visual Authority: 08-attribution.png
            ================================================================== */}
        <section id="attribution" className="growth-section-editorial growth-theme-dark" aria-labelledby="attr-heading">
          <div className="growth-container">
            <div className="growth-editorial-split">
              <div>
                <span className="growth-eyebrow">MODULE 07 · CLOSED-LOOP MEASUREMENT</span>
                <h2 id="attr-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Deterministic revenue.<br />
                  <em>Source attribution.</em>
                </h2>
                <p className="growth-sub">
                  Knowing leads arrived is insufficient. The Growth Operating System links collected revenue
                  back to the originating ad, creative, and channel so capital flows to proven winners.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-signal)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#b9bcc6' }}>
                    <li>— First-to-last touch multi-touch attribution models</li>
                    <li>— True Customer Acquisition Cost (CAC) & ROAS visibility</li>
                    <li>— Closed-loop feedback uploaded to Meta & Google algorithms</li>
                  </ul>
                </div>
                <small style={{ fontSize: '11px', color: '#686b77', fontStyle: 'italic', display: 'block' }}>
                  *Numerical data shown in interface artwork is illustrative visual content.
                </small>
              </div>

              {/* Master 08: Attribution Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/08-attribution.png"
                  alt="Performance analytics and attribution system connecting campaigns to measurable outcomes."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 07 · ATTRIBUTION MATRIX</span>
                  <span style={{ color: 'var(--dws-signal)' }}>CLOSED-LOOP ENGINE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            12 — AI INTELLIGENCE / OPTIMIZATION (LIGHT WARM PAPER)
            Visual Authority: 09-ai-intelligence.png
            ================================================================== */}
        <section id="intelligence" className="growth-section-editorial growth-theme-light" aria-labelledby="intel-heading">
          <div className="growth-container">
            <div className="growth-editorial-split is-reversed">
              <div>
                <span className="growth-eyebrow">MODULE 08 · CONTINUOUS OPTIMIZATION</span>
                <h2 id="intel-heading" className="growth-lead-title" style={{ fontSize: 'clamp(34px, 4.5vw, 62px)' }}>
                  Operational intelligence.<br />
                  <em>Predictive refinement.</em>
                </h2>
                <p className="growth-sub">
                  AI-assisted analytics analyze funnel performance, detect drop-off anomalies, and provide strategic
                  campaign recommendations to guide human executive decisions.
                </p>

                <div style={{ borderLeft: '2px solid var(--dws-ink)', paddingLeft: '20px', margin: '24px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--dws-signal)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    KEY SPECIFICATIONS:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dws-muted)' }}>
                    <li>— Algorithmic bottleneck & drop-off detection</li>
                    <li>— Creative hook & copy variation recommendations</li>
                    <li>— Decision support assisting executive media allocation</li>
                  </ul>
                </div>
              </div>

              {/* Master 09: AI Intelligence Master */}
              <div className="growth-master-frame">
                <img
                  src="/growth/assets/09-ai-intelligence.png"
                  alt="AI-assisted growth intelligence system analyzing performance and recommending optimization."
                  className="growth-master-img"
                  loading="lazy"
                />
                <div className="growth-asset-caption">
                  <span>MODULE 08 · INTELLIGENCE LAYER</span>
                  <span style={{ color: 'var(--dws-signal)' }}>PREDICTIVE REFINEMENT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            13 — COMPARISON (DARK OBSIDIAN)
            Disconnected vs Connected System
            ================================================================== */}
        <DifferenceComparison />

        {/* ==================================================================
            14 — COMPLETE CONNECTED SYSTEM (SIGNATURE CLOSING MOMENT)
            Visual Authority: 10-connected-system.png
            ================================================================== */}
        <section className="growth-section-editorial growth-theme-dark" style={{ borderBottom: 'none' }} aria-labelledby="connected-heading">
          <div className="growth-container" style={{ textAlign: 'center' }}>
            <span className="growth-eyebrow" style={{ justifyContent: 'center' }}>
              UNIFIED OPERATING PLATFORM
            </span>
            <h2 id="connected-heading" className="growth-lead-title" style={{ fontSize: 'clamp(38px, 5.5vw, 76px)', maxWidth: '20ch', margin: '0 auto 24px' }}>
              One connected<br />
              <em>growth operating system.</em>
            </h2>
            <p className="growth-sub" style={{ margin: '0 auto 40px', maxWidth: '64ch' }}>
              This is not a collection of disconnected marketing services. It is a single, integrated growth
              infrastructure engineered between your first impression and collected revenue.
            </p>

            {/* Master 10: Complete Connected System */}
            <div className="growth-signature-system-card">
              <img
                src="/growth/assets/10-connected-system.png"
                alt="Complete Dynasty Growth Operating System from acquisition through revenue."
                className="growth-master-img"
                loading="lazy"
              />
              <div className="growth-asset-caption">
                <span>FULL PIPELINE ARCHITECTURE · 10 INTEGRATED MODULES</span>
                <span style={{ color: 'var(--dws-signal)' }}>● ENTERPRISE VERIFIED</span>
              </div>
            </div>

            <div style={{ marginTop: '48px' }}>
              <a
                href="#diagnostic"
                className="growth-btn growth-btn-signal"
                onClick={() => handleCtaClick('Connected System Closing CTA', '#diagnostic')}
                style={{ padding: '20px 44px', fontSize: '13px' }}
              >
                <span>BUILD MY GROWTH SYSTEM</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================================
            15 — GROWTH REVIEW DIAGNOSTIC (DARK OBSIDIAN)
            Multi-Step Lead Form (01 to 05)
            ================================================================== */}
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
