import React, { useEffect, useRef, useState } from 'react';
import { founderBlueprint, blueprintDocumentSections } from '../legacy/data/founder-blueprint';
import './founder-blueprint.css';

const Arrow = () => <span aria-hidden="true">→</span>;
const ExternalArrow = () => <span aria-hidden="true">↗</span>;

export default function FounderBlueprintPage() {
  const menuRef = useRef<HTMLDialogElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Founder Blueprint — Dynasty Works Studio';
  }, []);

  function openMenu() {
    menuRef.current?.showModal();
    setMobileMenuOpen(true);
  }

  function closeMenu() {
    menuRef.current?.close();
    setMobileMenuOpen(false);
  }

  return (
    <div className="fb-page">
      <a href="#fb-content" className="skip-link">Skip to main content</a>

      {/* Navigation Header */}
      <header className="fb-header" role="banner">
        <div className="fb-shell fb-header-inner">
          <a href="/" className="fb-brand" aria-label="Dynasty Works Studio Home">
            DYNASTY WORKS <span>STUDIO</span>
          </a>

          <nav className="fb-nav" aria-label="Main Navigation">
            <a href="/work">Work</a>
            <a href="/#operating">How we build</a>
            <a href="/capabilities">Capabilities</a>
            <a href="/#review-builder">Company Builder</a>
            <a href="/studio">Studio</a>
            <a href="/founder-blueprint/intake" className="fb-nav-cta">
              Begin Intake <Arrow />
            </a>
          </nav>

          <button
            type="button"
            className="fb-mobile-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="fb-mobile-nav"
            onClick={openMenu}
          >
            Menu ＋
          </button>

          <dialog ref={menuRef} id="fb-mobile-nav" className="fb-mobile-dialog" onClose={() => setMobileMenuOpen(false)}>
            <div className="fb-mobile-dialog-head">
              <span className="fb-kicker">Navigation</span>
              <button type="button" onClick={closeMenu} aria-label="Close Navigation">×</button>
            </div>
            <nav className="fb-mobile-dialog-nav">
              <a href="/" onClick={closeMenu}>Home</a>
              <a href="/work" onClick={closeMenu}>Work <ExternalArrow /></a>
              <a href="/#creation" onClick={closeMenu}>How we build</a>
              <a href="/capabilities" onClick={closeMenu}>Capabilities <ExternalArrow /></a>
              <a href="/#review-builder" onClick={closeMenu}>Company Builder</a>
              <a href="/studio" onClick={closeMenu}>Studio</a>
              <a href="/contact" onClick={closeMenu}>Contact</a>
            </nav>
            <a href="/founder-blueprint/intake" className="fb-offer-cta" onClick={closeMenu}>
              Begin Blueprint Intake <Arrow />
            </a>
          </dialog>
        </div>
      </header>

      <main id="fb-content">
        {/* 01 Hero & Offer Overview */}
        <section className="fb-hero" aria-labelledby="fb-hero-title">
          <div className="fb-shell fb-hero-grid">
            <div className="fb-hero-lead">
              <span className="fb-kicker">01 / STRATEGIC COMPANY DEVELOPMENT</span>
              <h1 id="fb-hero-title" className="fb-heading-serif">
                Before we build the company,<br />
                <em>we define what must be built.</em>
              </h1>
              <p className="fb-hero-desc">
                A high-conviction 2–3 week strategic scoping engagement establishing company
                architecture, operational priorities, technical dependencies, and execution sequence
                before major capital deployment.
              </p>

              {/* Commercial Pathway Ladder */}
              <div className="fb-journey-ladder" aria-label="Commercial progression from diagnostic to full build">
                <div className="fb-ladder-header">
                  <span>Commercial Progression</span>
                  <span>From Diagnostic to Venture</span>
                </div>
                <div className="fb-ladder-steps">
                  <div className="fb-ladder-step">
                    <span className="fb-ladder-num">01 / DIAGNOSTIC</span>
                    <strong className="fb-ladder-title">Company Builder</strong>
                    <span className="fb-ladder-role">Free initial roadmap · Maps preliminary territory</span>
                  </div>
                  <div className="fb-ladder-step is-active" aria-current="step">
                    <span className="fb-ladder-num">02 / SCOPING</span>
                    <strong className="fb-ladder-title">Founder Blueprint</strong>
                    <span className="fb-ladder-role">$1,500 strategic scoping · 2–3 week architecture</span>
                  </div>
                  <div className="fb-ladder-step">
                    <span className="fb-ladder-num">03 / VENTURE</span>
                    <strong className="fb-ladder-title">Venture Creation</strong>
                    <span className="fb-ladder-role">Custom build · End-to-end studio execution</span>
                  </div>
                </div>
                <p className="fb-ladder-note">
                  * Note: Running the Company Builder diagnostic provides helpful initial context but is not required prior to purchasing the Founder Blueprint.
                </p>
              </div>
            </div>

            {/* Strategic Offer Card */}
            <aside className="fb-offer-card" aria-labelledby="fb-offer-heading">
              <span className="fb-offer-badge">Single Engagement · Fixed Price</span>
              <div className="fb-offer-price">
                <span className="fb-price-amount">{founderBlueprint.priceLabel}</span>
                <span className="fb-price-currency">{founderBlueprint.currency}</span>
              </div>
              <h2 id="fb-offer-heading" className="fb-offer-title">{founderBlueprint.name}</h2>
              <p className="fb-offer-sub">{founderBlueprint.description}</p>

              <div className="fb-offer-specs">
                <div className="fb-spec-item">
                  <span className="fb-spec-label">Timeline</span>
                  <span className="fb-spec-val">2–3 Weeks Focused Scope</span>
                </div>
                <div className="fb-spec-item">
                  <span className="fb-spec-label">Session</span>
                  <span className="fb-spec-val">{founderBlueprint.session}</span>
                </div>
                <div className="fb-spec-item">
                  <span className="fb-spec-label">Core Artifact</span>
                  <span className="fb-spec-val">Reviewed 21-Section Digital Blueprint</span>
                </div>
                <div className="fb-spec-item">
                  <span className="fb-spec-label">Execution Plan</span>
                  <span className="fb-spec-val">Prioritized 30 / 60 / 90-Day Sequence</span>
                </div>
              </div>

              <a href="/founder-blueprint/intake" className="fb-offer-cta">
                Begin Blueprint Intake <Arrow />
              </a>
              <p className="fb-offer-note">
                Intake preview operates locally without remote data transmission. Your strategic brief is preserved for review with Dynasty Works leadership.
              </p>
            </aside>
          </div>
        </section>

        {/* 02 Executive Q&A Hierarchy */}
        <section className="fb-section" aria-labelledby="fb-qa-title">
          <div className="fb-shell">
            <div className="fb-section-header">
              <span className="fb-kicker">02 / EXECUTIVE CLARITY</span>
              <h2 id="fb-qa-title" className="fb-heading-serif">
                A serious strategic engagement,<br />
                <em>not a casual consultation call.</em>
              </h2>
              <p className="fb-section-desc">
                Everything founders need to understand about the scope, intent, and outcomes of the Founder Blueprint.
              </p>
            </div>

            <div className="fb-answers-grid">
              <article className="fb-answer-card">
                <span className="fb-kicker">01 / WHAT IS IT?</span>
                <h3>A Structured Company Creation Instrument</h3>
                <p>
                  The Founder Blueprint is a dedicated 2–3 week strategic scoping engagement. Rather than jumping blindly into logo design, code, or marketing spend, we conduct rigorous research and build the underlying architecture of your business.
                </p>
              </article>

              <article className="fb-answer-card">
                <span className="fb-kicker">02 / WHO IS IT FOR?</span>
                <h3>Founders with Vision Needing Cohesive Structure</h3>
                <p>
                  Engineered for idea-stage founders, early ventures preparing to launch, and existing businesses requiring unified architecture across brand, digital, and operations. Mature companies with isolated single-service needs do not require this engagement.
                </p>
              </article>

              <article className="fb-answer-card">
                <span className="fb-kicker">03 / WHAT HAPPENS?</span>
                <h3>Discovery, Deep Research, and Architectural Synthesis</h3>
                <p>
                  We begin with your completed intake and an intensive 60–90 minute strategy working session. We then analyze the market, define required disciplines, uncover hidden technical dependencies, and map your 30/60/90 execution sequence.
                </p>
              </article>

              <article className="fb-answer-card">
                <span className="fb-kicker">04 / WHAT DO I RECEIVE?</span>
                <h3>Ten Strategic Deliverables in a Reviewed Document</h3>
                <p>
                  You receive an executive, boardroom-ready Dynasty Works Founder Blueprint PDF comprising 21 comprehensive sections, strategic roadmap milestones, and exact resource/budget recommendations.
                </p>
              </article>

              <article className="fb-answer-card" style={{ gridColumn: '1 / -1' }}>
                <span className="fb-kicker">05 / WHAT HAPPENS AFTERWARD?</span>
                <h3>Complete Independence or Seamless Venture Transition</h3>
                <p>
                  You own the complete strategic blueprint. You can execute the roadmap independently, collaborate with third-party partners using our architectural specifications, or commission Dynasty Works Studio to execute full-scale venture creation across brand, engineering, and market launch.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 03 Verified Deliverables */}
        <section className="fb-section" aria-labelledby="fb-deliverables-title">
          <div className="fb-shell">
            <div className="fb-section-header">
              <span className="fb-kicker">03 / DELIVERABLE ARTIFACTS</span>
              <h2 id="fb-deliverables-title" className="fb-heading-serif">
                Ten verified strategic assets.<br />
                <em>No fabricated filler.</em>
              </h2>
              <p className="fb-section-desc">
                Every deliverable is an actionable, high-conviction component of your company architecture.
              </p>
            </div>

            <div className="fb-deliverables-grid">
              {founderBlueprint.deliverables.map((item, index) => (
                <article key={item.title} className="fb-deliverable-card">
                  <div className="fb-card-top">
                    <span className="fb-card-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="fb-kicker" style={{ margin: 0 }}>Strategic Asset</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Abstract Document Representation */}
        <section className="fb-section" aria-labelledby="fb-doc-title">
          <div className="fb-shell">
            <div className="fb-section-header">
              <span className="fb-kicker">04 / THE DOCUMENT SYSTEM</span>
              <h2 id="fb-doc-title" className="fb-heading-serif">
                A 21-section executive blueprint.<br />
                <em>Boardroom-grade architecture.</em>
              </h2>
              <p className="fb-section-desc">
                Abstract representation of the standardized document architecture delivered upon engagement completion.
              </p>
            </div>

            <div className="fb-doc-artifact">
              <div className="fb-doc-topbar">
                <div>
                  <span className="fb-doc-meta">Dynasty Works Studio // Architectural Specification</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                    Founder Blueprint Document System v1.4
                  </div>
                </div>
                <span className="fb-doc-badge">21 Verified Sections · Human Reviewed</span>
              </div>

              <div className="fb-doc-sections-grid">
                {blueprintDocumentSections.map((sec, i) => (
                  <div key={sec.title} className={`fb-doc-section-pill ${sec.conditional ? 'is-conditional' : ''}`}>
                    <span>{String(i + 1).padStart(2, '0')}. {sec.title}</span>
                    <span>{sec.conditional ? 'Conditional' : 'Standard'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 Engagement Process */}
        <section className="fb-section" aria-labelledby="fb-process-title">
          <div className="fb-shell">
            <div className="fb-section-header">
              <span className="fb-kicker">05 / ENGAGEMENT PROCESS</span>
              <h2 id="fb-process-title" className="fb-heading-serif">
                A deliberate sequence.<br />
                <em>Two to three weeks from intake to delivery.</em>
              </h2>
              <p className="fb-section-desc">
                Four clear phases conducted in close partnership with studio leadership.
              </p>
            </div>

            <div className="fb-process-timeline">
              <div className="fb-process-step">
                <span className="fb-step-num">PHASE 01</span>
                <h3>Discovery</h3>
                <p>
                  Intake review and an intensive 60–90 minute strategy session uncovering core thesis, constraints, and commercial ambition.
                </p>
              </div>

              <div className="fb-process-step">
                <span className="fb-step-num">PHASE 02</span>
                <h3>Architecture</h3>
                <p>
                  Rigorous competitive research, technical scoping, brand architecture, and multi-disciplinary dependency mapping.
                </p>
              </div>

              <div className="fb-process-step">
                <span className="fb-step-num">PHASE 03</span>
                <h3>Review</h3>
                <p>
                  Internal studio peer evaluation, sequencing alignment, timeline stress-testing, and milestone verification.
                </p>
              </div>

              <div className="fb-process-step">
                <span className="fb-step-num">PHASE 04</span>
                <h3>Blueprint</h3>
                <p>
                  Formal presentation and delivery of your 21-section executive document and 30/60/90 execution roadmap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 Execution Horizons */}
        <section className="fb-section" aria-labelledby="fb-horizons-title">
          <div className="fb-shell">
            <div className="fb-section-header">
              <span className="fb-kicker">06 / OPERATIONAL SEQUENCING</span>
              <h2 id="fb-horizons-title" className="fb-heading-serif">
                30 / 60 / 90<br />
                <em>Planning horizons.</em>
              </h2>
              <p className="fb-section-desc">
                Priorities organized across three operational horizons to ensure the critical path is clear from Day 1.
              </p>
            </div>

            <div className="fb-horizons-grid">
              {founderBlueprint.horizons.map((h) => (
                <article key={h.days} className="fb-horizon-card">
                  <div className="fb-horizon-tag">
                    <span className="fb-horizon-days">{h.days}</span>
                    <span className="fb-horizon-unit">DAYS</span>
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.description}</p>
                </article>
              ))}
            </div>

            <div className="fb-boundary-box">
              <span className="fb-kicker">Professional Boundaries & Regulatory Disclaimer</span>
              <p>{founderBlueprint.boundary}</p>
            </div>
          </div>
        </section>

        {/* 07 Commercial Conversion Callout */}
        <section className="fb-conversion" aria-labelledby="fb-cta-title">
          <div className="fb-shell fb-conversion-inner">
            <span className="fb-kicker">07 / IMMEDIATE ACTION</span>
            <h2 id="fb-cta-title" className="fb-heading-serif">
              Ready to turn the idea<br />
              <em>into an executable company?</em>
            </h2>
            <div className="fb-conversion-price">
              {founderBlueprint.name} · {founderBlueprint.priceLabel} USD · 2–3 Week Engagement
            </div>

            <div className="fb-conversion-actions">
              <a href="/founder-blueprint/intake" className="fb-btn-primary">
                Begin Blueprint Intake <Arrow />
              </a>
              <a href="/#review-builder" className="fb-btn-secondary">
                Explore Company Builder first <ExternalArrow />
              </a>
            </div>

            <p className="fb-offer-note" style={{ maxWidth: '520px', margin: '0 auto' }}>
              Preview environment: Your strategic intake is assembled locally. No credit card or remote transmission occurs until mutual engagement terms are executed.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Chrome */}
      <footer className="fb-footer" role="contentinfo">
        <div className="fb-shell fb-footer-inner">
          <a href="/" className="fb-brand">
            DYNASTY WORKS <span>STUDIO</span>
          </a>

          <nav className="fb-footer-nav" aria-label="Footer Navigation">
            <a href="/work">Work</a>
            <a href="/capabilities">Capabilities</a>
            <a href="/#review-builder">Company Builder</a>
            <a href="/studio">Studio</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>

          <div>
            © {new Date().getFullYear()} Dynasty Works Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
