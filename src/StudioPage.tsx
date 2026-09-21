import React, { useRef, useState } from 'react';
import './studio.css';

const Arrow = () => <span aria-hidden="true">→</span>;
const ExternalArrow = () => <span aria-hidden="true">↗</span>;

export default function StudioPage() {
  const menuRef = useRef<HTMLDialogElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function openMenu() {
    menuRef.current?.showModal();
    setMobileMenuOpen(true);
  }

  function closeMenu() {
    menuRef.current?.close();
    setMobileMenuOpen(false);
  }

  return (
    <div className="studio-page">
      <a href="#studio-content" className="skip-link">Skip to main content</a>

      {/* Navigation Header */}
      <header className="studio-header" role="banner">
        <div className="studio-shell studio-header-inner">
          <a href="/" className="studio-brand" aria-label="Dynasty Works Studio Home">
            DYNASTY WORKS <span>STUDIO</span>
          </a>

          <nav className="studio-nav" aria-label="Main Navigation">
            <a href="/work">Work</a>
            <a href="/#creation">How we build</a>
            <a href="/capabilities">Capabilities</a>
            <a href="/#review-builder">Company Builder</a>
            <a href="/founder-blueprint">Founder Blueprint</a>
            <a href="/contact" className="studio-nav-cta">
              Talk to Studio <Arrow />
            </a>
          </nav>

          <button
            type="button"
            className="studio-mobile-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="studio-mobile-nav"
            onClick={openMenu}
          >
            Menu ＋
          </button>

          <dialog ref={menuRef} id="studio-mobile-nav" className="studio-mobile-dialog" onClose={() => setMobileMenuOpen(false)}>
            <div className="studio-mobile-dialog-head">
              <span className="studio-kicker">Navigation</span>
              <button type="button" onClick={closeMenu} aria-label="Close Navigation">×</button>
            </div>
            <nav className="studio-mobile-dialog-nav">
              <a href="/" onClick={closeMenu}>Home</a>
              <a href="/work" onClick={closeMenu}>Work <ExternalArrow /></a>
              <a href="/#creation" onClick={closeMenu}>How we build</a>
              <a href="/capabilities" onClick={closeMenu}>Capabilities <ExternalArrow /></a>
              <a href="/#review-builder" onClick={closeMenu}>Company Builder</a>
              <a href="/founder-blueprint" onClick={closeMenu}>Founder Blueprint ($1,500) <ExternalArrow /></a>
              <a href="/contact" onClick={closeMenu}>Contact</a>
            </nav>
            <a href="/#review-builder" className="studio-btn-primary" style={{ width: '100%', boxSizing: 'border-box', justifyContent: 'center' }} onClick={closeMenu}>
              Start a Company <Arrow />
            </a>
          </dialog>
        </div>
      </header>

      <main id="studio-content">
        {/* 01 Hero Section */}
        <section className="studio-hero" aria-labelledby="studio-hero-title">
          <div className="studio-shell studio-hero-inner">
            <span className="studio-kicker">DYNASTY WORKS STUDIO / CREATIVE TECHNOLOGY & COMPANY CREATION</span>
            <h1 id="studio-hero-title" className="studio-heading-serif">
              Systems guided by<br />
              <em>human judgment.</em>
            </h1>
            <p className="studio-hero-lead">
              Dynasty Works is an independent company creation practice. We unite strategic advisory,
              brand architecture, industrial design, computational software, and commercial distribution under one roof.
            </p>
            <p className="studio-hero-sub">
              Technology accelerates execution. AI expands computational speed. But commercial endurance requires
              uncompromising taste, strategic discipline, and human judgment. We build companies with founders,
              not for anonymous scale.
            </p>

            <div className="studio-hero-actions">
              <a href="/#review-builder" className="studio-btn-primary">
                Start a company <Arrow />
              </a>
              <a href="/work" className="studio-btn-secondary">
                View selected work <ExternalArrow />
              </a>
            </div>
          </div>
        </section>

        {/* 02 Philosophy: How We Think */}
        <section className="studio-section" aria-labelledby="studio-phil-title">
          <div className="studio-shell">
            <div className="studio-section-header">
              <span className="studio-kicker">01 / PHILOSOPHY</span>
              <h2 id="studio-phil-title" className="studio-heading-serif">
                An idea rarely needs<br />
                <em>only one thing.</em>
              </h2>
              <p className="studio-section-desc">
                Why traditional agency models fail emerging ventures, and how unified company creation solves it.
              </p>
            </div>

            <div className="studio-phil-grid">
              <blockquote className="studio-phil-quote">
                “A logo without a business model is decoration. A digital platform without brand authority is a commodity. An idea becomes an enterprise only when its strategy, identity, product, technology, and market systems function as an integrated whole.”
              </blockquote>

              <div className="studio-phil-body">
                <p>
                  Most ventures stumble not from a lack of ambition, but from fragmentation. Founders hire a branding studio, a separate software agency, an outsourced packaging vendor, and a digital marketing shop. The result is misaligned priorities, blown timelines, and a dilution of the original vision.
                </p>
                <p>
                  Dynasty Works was founded to eliminate that divide. By engineering the entire company architecture under one cohesive system, every touchpoint reinforces the core commercial proposition from Day 1.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 Human Signal: Four Operational Tenets */}
        <section className="studio-section" aria-labelledby="studio-tenets-title">
          <div className="studio-shell">
            <div className="studio-section-header">
              <span className="studio-kicker">02 / HUMAN SIGNAL</span>
              <h2 id="studio-tenets-title" className="studio-heading-serif">
                How we work<br />
                <em>with founders.</em>
              </h2>
              <p className="studio-section-desc">
                Four guiding principles that govern our studio partnership and execution standards.
              </p>
            </div>

            <div className="studio-tenets-grid">
              <article className="studio-tenet-card">
                <span className="studio-tenet-num">01 / FOUNDER PARTNERSHIP</span>
                <h3>Direct Collaboration</h3>
                <p>
                  Direct collaboration and strategic alignment throughout the build. Founders work directly with the practice without account-management bureaucracy or translation layers.
                </p>
              </article>

              <article className="studio-tenet-card">
                <span className="studio-tenet-num">02 / END-TO-END OWNERSHIP</span>
                <h3>Connected Company Systems</h3>
                <p>
                  Strategy, identity, product, digital systems, and commercial architecture are developed as one connected company system. The core commercial proposition remains unified across every physical and digital touchpoint.
                </p>
              </article>

              <article className="studio-tenet-card">
                <span className="studio-tenet-num">03 / HUMAN AUTHORIZATION</span>
                <h3>Judgment at the Helm</h3>
                <p>
                  AI and computational systems accelerate research, iteration, and execution. Strategic decisions, brand standards, and production code remain strictly subject to human judgment and approval.
                </p>
              </article>

              <article className="studio-tenet-card">
                <span className="studio-tenet-num">04 / HIGH CONVICTION</span>
                <h3>Integrated Creation</h3>
                <p>
                  DWS approaches company creation as an integrated build rather than a collection of disconnected deliverables, ensuring the commercial thesis carries through to market.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 04 What We Build: Eight Disciplines */}
        <section className="studio-section" aria-labelledby="studio-disciplines-title">
          <div className="studio-shell">
            <div className="studio-section-header">
              <span className="studio-kicker">03 / WHAT WE BUILD</span>
              <h2 id="studio-disciplines-title" className="studio-heading-serif">
                Eight integrated disciplines.<br />
                <em>Engineered as one.</em>
              </h2>
              <p className="studio-section-desc">
                Our core capability spectrum mapped across the complete company creation lifecycle.
              </p>
            </div>

            <div className="studio-disciplines-grid">
              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">01</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Core</span>
                </div>
                <h3>Strategy</h3>
                <p>Positioning, opportunity framing, business model architecture, and competitive market positioning.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">02</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Visual</span>
                </div>
                <h3>Identity</h3>
                <p>Brand naming, trademark-ready visual marks, typographic systems, and comprehensive brand books.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">03</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Physical</span>
                </div>
                <h3>Product & Packaging</h3>
                <p>Industrial design, custom packaging architecture, dieline engineering, and tactile material specifications.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">04</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Digital</span>
                </div>
                <h3>Digital & Software</h3>
                <p>Bespoke web applications, high-conversion e-commerce systems, and proprietary software interfaces.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">05</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Spatial</span>
                </div>
                <h3>Experience</h3>
                <p>Spatial concepts, interactive prototype environments, customer journey touchpoints, and sensory design.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">06</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Systems</span>
                </div>
                <h3>Automation</h3>
                <p>Operational workflow automation, computational pipelines, internal tools, and data architectures.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">07</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Market</span>
                </div>
                <h3>Market Systems</h3>
                <p>Commercial distribution planning, buyer presentations, go-to-market sequencing, and launch activations.</p>
              </div>

              <div className="studio-discipline-card">
                <div className="studio-disc-top">
                  <span className="studio-disc-num">08</span>
                  <span className="studio-kicker" style={{ margin: 0 }}>Venture</span>
                </div>
                <h3>Company Infrastructure</h3>
                <p>Corporate administrative coordination, operational dependency graphs, and strategic founder advisory.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 How We Engage: Three Commercial Tiers */}
        <section className="studio-section" aria-labelledby="studio-tiers-title">
          <div className="studio-shell">
            <div className="studio-section-header">
              <span className="studio-kicker">04 / ENGAGEMENT MODEL</span>
              <h2 id="studio-tiers-title" className="studio-heading-serif">
                Three levels of engagement.<br />
                <em>From initial roadmap to venture creation.</em>
              </h2>
              <p className="studio-section-desc">
                Clear commercial tiers structured to meet founders wherever their venture currently stands.
              </p>
            </div>

            <div className="studio-tiers-grid">
              <article className="studio-tier-card">
                <span className="studio-tier-badge">Tier 01 // Diagnostic</span>
                <h3 className="studio-tier-title">Company Builder</h3>
                <div className="studio-tier-price">Free</div>
                <p>
                  Our proprietary diagnostic instrument evaluates your company classification, current stage, and immediate priorities to generate a preliminary architectural roadmap.
                </p>
                <a href="/#review-builder" className="studio-tier-link">
                  Run Diagnostic <Arrow />
                </a>
              </article>

              <article className="studio-tier-card is-featured">
                <span className="studio-tier-badge" style={{ background: '#1646ff', color: '#ffffff' }}>Tier 02 // Scoping</span>
                <h3 className="studio-tier-title">Founder Blueprint</h3>
                <div className="studio-tier-price">$1,500 <span style={{ fontSize: '0.88rem', color: '#8c897f' }}>USD</span></div>
                <p>
                  A 2–3 week strategic scoping engagement. We conduct intensive research, hold working sessions with leadership, and deliver an executive 21-section blueprint and 30/60/90 execution sequence.
                </p>
                <a href="/founder-blueprint" className="studio-tier-link" style={{ color: '#6a8eff' }}>
                  Explore Blueprint <Arrow />
                </a>
              </article>

              <article className="studio-tier-card">
                <span className="studio-tier-badge">Tier 03 // Venture</span>
                <h3 className="studio-tier-title">Venture Creation</h3>
                <div className="studio-tier-price">Custom Scope</div>
                <p>
                  Comprehensive end-to-end studio engagement. We design, build, and deploy the entire company—from strategy and physical packaging to custom software platforms and commercial launch.
                </p>
                <a href="/contact" className="studio-tier-link">
                  Talk to Studio <Arrow />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* 06 Proof Connection & Next Moves */}
        <section className="studio-section" aria-labelledby="studio-proof-title" style={{ borderBottom: 'none' }}>
          <div className="studio-shell">
            <div className="studio-section-header">
              <span className="studio-kicker">05 / PROOF & NEXT MOVES</span>
              <h2 id="studio-proof-title" className="studio-heading-serif">
                Explore the studio.<br />
                <em>Where would you like to begin?</em>
              </h2>
              <p className="studio-section-desc">
                Dive deeper into our authentic client work, review our complete technical disciplines, or start your company build.
              </p>
            </div>

            <div className="studio-routing-grid">
              <a href="/work" className="studio-route-card">
                <div>
                  <span className="studio-route-meta">01 / PORTFOLIO PROOF</span>
                  <h3>Selected Work</h3>
                  <p>Explore authentic companies engineered by Dynasty Works across beverage, luxury fashion, and premium spirits.</p>
                </div>
                <span className="studio-route-action">Explore Case Studies <ExternalArrow /></span>
              </a>

              <a href="/capabilities" className="studio-route-card">
                <div>
                  <span className="studio-route-meta">02 / CAPABILITY ARCHITECTURE</span>
                  <h3>Capabilities</h3>
                  <p>Inspect our nine core creation disciplines and technical methodologies in granular detail.</p>
                </div>
                <span className="studio-route-action">Inspect Capabilities <ExternalArrow /></span>
              </a>

              <a href="/#review-builder" className="studio-route-card">
                <div>
                  <span className="studio-route-meta">03 / STRATEGIC INSTRUMENT</span>
                  <h3>Company Builder</h3>
                  <p>Run our interactive diagnostic to receive an immediate deterministic company-build roadmap.</p>
                </div>
                <span className="studio-route-action">Run Diagnostic <ExternalArrow /></span>
              </a>

              <a href="/founder-blueprint" className="studio-route-card">
                <div>
                  <span className="studio-route-meta">04 / STRATEGIC ADVISORY</span>
                  <h3>Founder Blueprint</h3>
                  <p>Review our $1,500 strategic scoping engagement for founders preparing serious commercial builds.</p>
                </div>
                <span className="studio-route-action">Review Founder Blueprint <ExternalArrow /></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Chrome */}
      <footer className="studio-footer" role="contentinfo">
        <div className="studio-shell studio-footer-inner">
          <a href="/" className="studio-brand">
            DYNASTY WORKS <span>STUDIO</span>
          </a>

          <nav className="studio-footer-nav" aria-label="Footer Navigation">
            <a href="/work">Work</a>
            <a href="/capabilities">Capabilities</a>
            <a href="/#review-builder">Company Builder</a>
            <a href="/founder-blueprint">Founder Blueprint</a>
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
