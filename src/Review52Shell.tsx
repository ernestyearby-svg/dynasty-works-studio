import { useRef, useState } from 'react';

const links = [
  ['Work', '/work'],
  ['How we build', '#creation'],
  ['Capabilities', '/capabilities'],
  ['Company Builder', '#review-builder'],
  ['Studio', '/studio'],
];

const Arrow = () => <span aria-hidden="true">↗</span>;

export function ReviewHeader() {
  const menu = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  function close() {
    menu.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <header className="r52-header">
      <a href="/" className="p-wordmark">DYNASTY WORKS<span>STUDIO</span></a>
      <span className="p-classification">Company creation studio</span>
      <nav aria-label="Main navigation" className="r52-desktop-nav">
        {links.map(([name, url]) => (
          <a href={url} key={name}>{name}</a>
        ))}
      </nav>
      <a className="r52-nav-action" href="#review-builder">Start a company <Arrow /></a>
      <button
        className="r52-menu-trigger"
        ref={trigger}
        aria-expanded={open}
        aria-controls="r52-menu"
        onClick={() => {
          menu.current?.showModal();
          setOpen(true);
        }}
      >
        Menu <span aria-hidden="true">＋</span>
      </button>
      <dialog
        ref={menu}
        id="r52-menu"
        className="r52-menu"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div>
          <span>Dynasty Works Studio</span>
          <button onClick={close} aria-label="Close navigation">Close ×</button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([name, url]) => (
            <a href={url} key={name} onClick={close}>{name}<Arrow /></a>
          ))}
        </nav>
        <a className="r51-action" href="#review-builder" onClick={close}>Start a company <Arrow /></a>
      </dialog>
    </header>
  );
}

export function HomeSelectedWork() {
  return (
    <section className="r52-home-proof" id="work" aria-labelledby="home-proof-title">
      <div className="r52-proof-head">
        <div>
          <span className="r52-folio">01 / SELECTED WORK</span>
          <h2 id="home-proof-title">Proven company<br /><em>creation.</em></h2>
        </div>
        <div className="r52-proof-head-aside">
          <p className="r52-proof-thesis">
            Authentic enterprises engineered from concept to commercial reality.
            Strategy, identity, physical packaging, digital platforms, and launch systems.
          </p>
          <a href="/work" className="r52-proof-all-link">
            Explore all case studies <Arrow />
          </a>
        </div>
      </div>

      <div className="r52-proof-grid">
        {/* Project 01: MyMosa */}
        <article className="r52-proof-card">
          <a href="/work/mymosa" className="r52-proof-media" aria-label="MyMosa case study">
            <img
              src="/assets/portfolio/01-mymosa-four-flavor-hero-960.webp"
              alt="MyMosa premium ready-to-drink mimosa packaging architecture"
              width={960}
              height={540}
              loading="lazy"
            />
            <span className="r52-proof-pill">RTD BEVERAGE ENTERPRISE</span>
          </a>
          <div className="r52-proof-content">
            <div className="r52-card-tags">
              <span>Strategy</span>
              <span>Identity</span>
              <span>Packaging System</span>
              <span>E-Commerce</span>
            </div>
            <h3>
              <a href="/work/mymosa">MyMosa</a>
            </h3>
            <p className="r52-card-premise">
              End-to-end beverage enterprise creation: brand architecture, eight can expressions,
              bespoke 3D asset pipeline, and direct-to-consumer digital commerce.
            </p>
            <a href="/work/mymosa" className="r52-card-action">
              Explore case study <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>

        {/* Project 02: IKLA Maison */}
        <article className="r52-proof-card">
          <a href="/work/ikla-maison" className="r52-proof-media" aria-label="IKLA Maison case study">
            <img
              src="/assets/portfolio/01-ikla-creative-direction-960.webp"
              alt="IKLA Maison haute parfumerie bespoke vessel and unboxing architecture"
              width={960}
              height={540}
              loading="lazy"
            />
            <span className="r52-proof-pill">LUXURY HOME FRAGRANCE</span>
          </a>
          <div className="r52-proof-content">
            <div className="r52-card-tags">
              <span>Identity</span>
              <span>Industrial Vessel</span>
              <span>Packaging</span>
              <span>Digital Flagship</span>
            </div>
            <h3>
              <a href="/work/ikla-maison">IKLA Maison</a>
            </h3>
            <p className="r52-card-premise">
              Haute parfumerie maison brought from concept to physical presence: architectural
              glass vessel design, unboxing ritual, high-conversion digital boutique, and editorial campaign.
            </p>
            <a href="/work/ikla-maison" className="r52-card-action">
              Explore case study <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>

        {/* Project 03: Mr. Cliff's */}
        <article className="r52-proof-card">
          <a href="/work/mr-cliffs" className="r52-proof-media" aria-label="Mr. Cliff's case study">
            <img
              src="/assets/portfolio/mr-cliffs/window-thumbnail.webp"
              alt="Mr. Cliff's modern heritage grooming parlor storefront branding and spatial experience"
              width={960}
              height={540}
              loading="lazy"
            />
            <span className="r52-proof-pill">COMMERCE & SPATIAL ENVIRONMENT</span>
          </a>
          <div className="r52-proof-content">
            <div className="r52-card-tags">
              <span>Brand Heritage</span>
              <span>Spatial Design</span>
              <span>Storefront System</span>
              <span>Digital Platform</span>
            </div>
            <h3>
              <a href="/work/mr-cliffs">Mr. Cliff’s</a>
            </h3>
            <p className="r52-card-premise">
              Heritage grooming parlor transformed into a scalable modern institution: physical storefront
              atmosphere, editorial typographic identity, merchandising, and appointment platform.
            </p>
            <a href="/work/mr-cliffs" className="r52-card-action">
              Explore case study <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>

      <div className="r52-proof-foot">
        <div className="r52-proof-foot-meta">
          <span>03 / AUTHENTIC FLAGSHIP CASE STUDIES</span>
          <span>Zero synthetic client claims</span>
        </div>
        <div className="r52-proof-foot-action">
          <a href="/work" className="r51-action">
            View all selected work <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const homeCapabilities = [
  {
    num: '01',
    name: 'Brand Systems & Identity',
    outcome: 'Strategic naming, mark design, typographic hierarchies, and brand guideline architecture.',
    deliverable: 'Complete Identity System',
  },
  {
    num: '02',
    name: 'Packaging & Industrial Design',
    outcome: 'Structural packaging, custom container forms, material finishes, unboxing rituals, and production specs.',
    deliverable: 'Production-Ready Packaging',
  },
  {
    num: '03',
    name: 'Digital Platforms & E-Commerce',
    outcome: 'High-performance headless web flagships, transactional infrastructure, and conversion design.',
    deliverable: 'Custom Web & Commerce Flagship',
  },
  {
    num: '04',
    name: '3D Asset Systems & Virtual Worlds',
    outcome: 'Photorealistic 3D product rendering, virtual set design, interactive WebGL, and generative asset pipelines.',
    deliverable: 'High-Fidelity 3D Pipeline',
  },
  {
    num: '05',
    name: 'Automation & AI Operating Systems',
    outcome: 'Enterprise workflows, autonomous agent orchestration, custom APIs, and backend intelligence.',
    deliverable: 'Operational Automation',
  },
  {
    num: '06',
    name: 'Commercial Strategy & Positioning',
    outcome: 'Market gap analysis, unit economics modeling, audience segmentation, and go-to-market roadmaps.',
    deliverable: 'Venture & Market Roadmap',
  },
  {
    num: '07',
    name: 'Spatial & Environmental Design',
    outcome: 'Storefront architecture, environmental graphics, point-of-sale systems, and physical retail staging.',
    deliverable: 'Physical Experience System',
  },
  {
    num: '08',
    name: 'Creative Direction & Campaign Systems',
    outcome: 'Editorial campaign imagery, cinematic video direction, brand voice manuals, and multichannel content.',
    deliverable: 'Multi-Channel Launch Campaign',
  },
  {
    num: '09',
    name: 'Mobile & Connected Ecosystems',
    outcome: 'Progressive web apps, native companion software, real-time client portals, and IoT digital interfaces.',
    deliverable: 'Connected Application Suite',
  },
];

export function HomeCapabilities() {
  return (
    <section className="r52-home-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="r52-cap-head">
        <div>
          <span className="r52-folio">03 / CAPABILITIES</span>
          <h2 id="capabilities-title">Nine disciplines.<br /><em>One unified studio.</em></h2>
        </div>
        <div className="r52-cap-head-aside">
          <p>
            We eliminate the friction between strategy consultants, branding agencies, industrial designers,
            and software engineering teams. Every capability necessary to build a market-ready company lives under one roof.
          </p>
          <a href="/capabilities" className="r52-proof-all-link">
            Explore capability studies <Arrow />
          </a>
        </div>
      </div>

      <div className="r52-cap-grid">
        {homeCapabilities.map((c) => (
          <div key={c.num} className="r52-cap-item">
            <div className="r52-cap-item-top">
              <span className="r52-cap-num">{c.num}</span>
              <span className="r52-cap-deliverable">{c.deliverable}</span>
            </div>
            <h3>{c.name}</h3>
            <p>{c.outcome}</p>
            <a href="/capabilities" className="r52-cap-link">
              Explore capability <Arrow />
            </a>
          </div>
        ))}
      </div>

      <div className="r52-cap-foot">
        <span>INTELLIGENCE IN RELATION / NATIVE BY DESIGN</span>
        <a href="/capabilities/disciplines" className="r52-cap-all">
          View relational discipline score <Arrow />
        </a>
      </div>
    </section>
  );
}

export function StudioSignal() {
  return (
    <section className="r52-studio-signal" id="studio" aria-labelledby="studio-signal-title">
      <div className="r52-studio-inner">
        <span className="r52-folio">05 / THE STUDIO</span>
        <h2 id="studio-signal-title">
          Systems guided by <br /><em>human judgment.</em>
        </h2>
        <div className="r52-studio-body">
          <p className="r52-studio-lead">
            Technology and AI accelerate execution, but commercial endurance requires uncompromising creative taste,
            strategic discipline, and human judgment. We build companies with founders, not for anonymous scale.
          </p>
          <div className="r52-studio-tenets">
            <div className="r52-tenet">
              <span className="r52-tenet-num">01</span>
              <h4>Founder Partnership</h4>
              <p>Direct collaboration and strategic alignment throughout the build, without bureaucracy or translation layers.</p>
            </div>
            <div className="r52-tenet">
              <span className="r52-tenet-num">02</span>
              <h4>End-to-End Ownership</h4>
              <p>Strategy, identity, product, digital systems, and commercial architecture are developed as one connected company system.</p>
            </div>
            <div className="r52-tenet">
              <span className="r52-tenet-num">03</span>
              <h4>Human Authorization</h4>
              <p>AI and computational systems accelerate research, iteration, and execution. Strategic decisions and production standards remain strictly subject to human judgment and approval.</p>
            </div>
          </div>
        </div>
        <div className="r52-studio-foot">
          <a href="/studio" className="r52-studio-link">
            Learn more about the studio <Arrow />
          </a>
          <a href="/founder-blueprint" className="r52-studio-blueprint">
            Founder Blueprint / Strategic advisory for serious founders <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section className="r52-proof" id="proof" aria-labelledby="proof-title">
      <span className="r52-folio">06 / EXPERIMENTAL LAB & ARCHIVE</span>
      <h2 id="proof-title">The work is there<br /><em>when you want<br />the proof.</em></h2>
      <div className="r52-paths">
        <a className="r52-work-path" href="/work">
          <span className="r52-path-meta">01 / REAL CASE STUDIES</span>
          <h3>Selected<br />work.</h3>
          <span className="r52-path-action">Explore selected work <Arrow /></span>
        </a>
        <a className="r52-lab-path" href="/concept-lab">
          <span className="r52-path-meta">02 / INDEPENDENT CAPABILITY STUDIES</span>
          <h3>Concept Lab</h3>
          <span className="r52-path-action">Enter Concept Lab <Arrow /></span>
        </a>
      </div>
    </section>
  );
}

export function Invitation() {
  return (
    <section className="r52-invitation" id="invitation" aria-labelledby="invitation-title">
      <div className="r52-invitation-top">
        <span className="r52-folio">07 / THE INVITATION</span>
        <p>The next company<br />has not been built yet.</p>
      </div>
      <h2 id="invitation-title">What are<br /><em>we building?</em></h2>
      <div className="r52-invitation-end">
        <span className="r52-seed" aria-hidden="true"><i /></span>
        <div>
          <a className="r51-action" href="#review-builder">Start a company <span aria-hidden="true">→</span></a>
          <a className="r52-talk" href="/contact">Talk to the studio <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

export function ReviewFooter() {
  return (
    <footer className="r52-footer">
      <div className="r52-footer-identity">
        <a href="/" className="p-wordmark">DYNASTY WORKS<span>STUDIO</span></a>
        <p>Company creation studio.<br />From idea to operating enterprise.</p>
      </div>
      <nav aria-label="Footer navigation">
        {links.map(([name, url]) => (
          <a href={url} key={name}>{name}</a>
        ))}
        <a href="#review-builder">Start a company <Arrow /></a>
      </nav>
      <small>© {new Date().getFullYear()} Dynasty Works Studio. All rights reserved.</small>
    </footer>
  );
}
