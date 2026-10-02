import { useRef, useState } from 'react';

const links = [
  ['Services', '/#services'],
  ['Growth Engine', '/growth'],
  ['Our Work', '/work'],
  ['About', '/studio'],
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
      <span className="p-classification">Brand, Web &amp; Growth Systems</span>
      <nav aria-label="Main navigation" className="r52-desktop-nav">
        {links.map(([name, url]) => (
          <a href={url} key={name}>{name}</a>
        ))}
      </nav>
      <a className="r52-nav-action" href="/growth/book">Book a Discovery Call <Arrow /></a>
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
          <a href="/#services" onClick={close}>Services <Arrow /></a>
          <a href="/growth" onClick={close}>Growth Engine <Arrow /></a>
          <a href="/work" onClick={close}>Our Work <Arrow /></a>
          <a href="/studio" onClick={close}>About <Arrow /></a>
          <a href="/contact" onClick={close}>Start Your Project <Arrow /></a>
        </nav>
        <a className="r51-action" href="/growth/book" onClick={close}>Book a Discovery Call <Arrow /></a>
      </dialog>
    </header>
  );
}

export function ServicesOverview() {
  return (
    <section className="r52-services-section" id="services" aria-labelledby="services-title">
      <div className="r52-services-header">
        <div className="r52-services-title-block">
          <span className="r52-folio">02 / SERVICES</span>
          <h2 id="services-title">Brand, Web &amp;<br /><em>Growth Systems.</em></h2>
        </div>
        <div className="r52-services-header-aside">
          <p className="r52-services-lead">
            Dynasty Works Studio builds brands, websites, and the systems that support their growth.
            Four clear disciplines configured to elevate your market presence and power your customer pipeline.
          </p>
          <a href="/growth/book" className="r52-services-head-cta">
            Book a Discovery Call <Arrow />
          </a>
        </div>
      </div>

      <div className="r52-services-grid">
        {/* Service 01: Brand & Creative */}
        <article className="r52-service-card">
          <div className="r52-service-meta">
            <span className="r52-service-num">01</span>
            <span className="r52-service-tag">IDENTITY &amp; POSITIONING</span>
          </div>
          <h3 className="r52-service-name">Brand &amp; Creative</h3>
          <p className="r52-service-desc">
            A distinctive identity, consistent messaging, and visuals that express what your business stands for.
          </p>
          <ul className="r52-service-features" aria-label="Brand & Creative capabilities">
            <li>Brand architecture &amp; positioning</li>
            <li>Visual identity systems &amp; guidelines</li>
            <li>Voice, messaging &amp; narrative direction</li>
            <li>Packaging, collateral &amp; brand assets</li>
          </ul>
          <div className="r52-service-action">
            <a href="/contact" className="r52-service-btn">
              Start a Brand Project <Arrow />
            </a>
          </div>
        </article>

        {/* Service 02: Websites & Digital Experiences */}
        <article className="r52-service-card">
          <div className="r52-service-meta">
            <span className="r52-service-num">02</span>
            <span className="r52-service-tag">DIGITAL EXPERIENCES</span>
          </div>
          <h3 className="r52-service-name">Websites &amp; Digital Experiences</h3>
          <p className="r52-service-desc">
            Thoughtfully designed websites that make your offer clear and the next step easy.
          </p>
          <ul className="r52-service-features" aria-label="Websites & Digital Experiences capabilities">
            <li>Custom digital flagships &amp; landing experiences</li>
            <li>Clear product presentation &amp; intuitive navigation</li>
            <li>Fast, accessible, mobile-first design</li>
            <li>Interactive product presentations</li>
          </ul>
          <div className="r52-service-action">
            <a href="/work" className="r52-service-btn">
              Explore Digital Experiences <Arrow />
            </a>
          </div>
        </article>

        {/* Service 03: The Dynasty Growth Engine */}
        <article className="r52-service-card r52-service-highlight">
          <div className="r52-service-meta">
            <span className="r52-service-num">03</span>
            <span className="r52-service-tag">GROWTH ARCHITECTURE</span>
          </div>
          <h3 className="r52-service-name">The Dynasty Growth Engine</h3>
          <p className="r52-service-desc">
            Connected inquiry forms, customer management, booking, and follow-up workflows configured around how your business operates.
          </p>
          <ul className="r52-service-features" aria-label="Growth Engine capabilities">
            <li>Inquiry capture &amp; CRM pipeline setup</li>
            <li>Automated SMS &amp; email follow-up</li>
            <li>Integrated calendar booking (HighLevel)</li>
            <li>Attribution tracking &amp; reporting</li>
          </ul>
          <div className="r52-service-action">
            <a href="/growth" className="r52-service-btn r52-service-btn-accent">
              Explore the Growth Engine <Arrow />
            </a>
          </div>
        </article>

        {/* Service 04: Ongoing Care & Improvement */}
        <article className="r52-service-card">
          <div className="r52-service-meta">
            <span className="r52-service-num">04</span>
            <span className="r52-service-tag">LIFECYCLE PARTNERSHIP</span>
          </div>
          <h3 className="r52-service-name">Ongoing Care &amp; Improvement</h3>
          <p className="r52-service-desc">
            Continued support for your website and connected systems as your business evolves.
          </p>
          <ul className="r52-service-features" aria-label="Ongoing Care capabilities">
            <li>Website maintenance &amp; uptime care</li>
            <li>Iterative improvements &amp; performance tuning</li>
            <li>System workflow tuning &amp; audits</li>
            <li>Priority creative &amp; technical advisory</li>
          </ul>
          <div className="r52-service-action">
            <a href="/contact" className="r52-service-btn">
              Discuss Ongoing Support <Arrow />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

export function GrowthEngineShowcase() {
  const steps = [
    {
      num: '01',
      title: 'Inquiry received',
      desc: 'A visitor discovers your business and submits a consultation request or targeted intake questionnaire.',
      badge: 'Inquiry Capture',
    },
    {
      num: '02',
      title: 'Lead organized',
      desc: 'Contact details, campaign attribution (UTMs, referrer), and intent signals are instantly routed to your CRM.',
      badge: 'CRM Routing',
    },
    {
      num: '03',
      title: 'Follow-up supported',
      desc: 'Automated confirmations and team alerts ensure timely follow-up so conversations never stall.',
      badge: 'Follow-up Sync',
    },
    {
      num: '04',
      title: 'Appointment booked',
      desc: 'Integrated calendar scheduling allows qualified prospects to book directly without back-and-forth friction.',
      badge: 'Calendar Booking',
    },
    {
      num: '05',
      title: 'Opportunity tracked',
      desc: 'Every stage is tracked from initial discovery through scheduled appointment to revenue visibility.',
      badge: 'Attribution & ROI',
    },
  ];

  return (
    <section className="r52-growth-engine-showcase" id="growth-engine" aria-labelledby="growth-engine-title">
      <div className="r52-ge-header">
        <div className="r52-ge-title-block">
          <span className="r52-folio">03 / CONNECTED INFRASTRUCTURE</span>
          <h2 id="growth-engine-title">
            Your brand opens the door.<br />
            <em>Your systems carry the conversation forward.</em>
          </h2>
        </div>
        <div className="r52-ge-header-aside">
          <p className="r52-ge-lead">
            A visitor discovers your business. They ask a question, request a quote, or book a consultation. What happens next matters.
          </p>
          <p className="r52-ge-sublead">
            We connect your website with tools and workflows that organize inquiries, support timely follow-up, and give your team a clearer view of every opportunity.
          </p>
        </div>
      </div>

      {/* Responsive 5-Step Workflow Demonstration */}
      <div className="r52-ge-workflow">
        <div className="r52-ge-workflow-bar">
          <span className="r52-ge-workflow-label">Example workflow</span>
          <span className="r52-ge-workflow-note">Configured customer journey from first touch to booked appointment</span>
        </div>

        <ol className="r52-ge-steps" aria-label="Customer workflow demonstration">
          {steps.map((s, idx) => (
            <li key={s.num} className="r52-ge-step">
              <div className="r52-ge-step-top">
                <span className="r52-ge-step-num">{s.num}</span>
                <span className="r52-ge-step-badge">{s.badge}</span>
              </div>
              <h3 className="r52-ge-step-title">{s.title}</h3>
              <p className="r52-ge-step-desc">{s.desc}</p>
              {idx < steps.length - 1 && (
                <span className="r52-ge-step-arrow" aria-hidden="true">→</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Industry Solutions & Actions */}
      <div className="r52-ge-destinations">
        <div className="r52-ge-industries">
          <span className="r52-ge-industry-label">Configured Solutions Available:</span>
          <div className="r52-ge-industry-links">
            <a href="/growth/medspa" className="r52-ge-industry-pill">
              MedSpa Growth Engine <Arrow />
            </a>
            <a href="/growth/fitness" className="r52-ge-industry-pill">
              Fitness &amp; Athletic Clubs <Arrow />
            </a>
            <a href="/growth" className="r52-ge-industry-pill">
              Full Growth Engine System <Arrow />
            </a>
          </div>
        </div>

        <div className="r52-ge-actions">
          <a href="/growth/book" className="r51-action">
            Book a Discovery Call <Arrow />
          </a>
          <a href="/growth" className="r52-hero-work">
            Explore Growth Architecture <Arrow />
          </a>
        </div>
      </div>

      <div className="r52-ge-footer-note">
        <small>
          * The Dynasty Growth Engine is a configured service offering engineered by Dynasty Works Studio using established infrastructure platforms. Capabilities reflect verified implementations.
        </small>
      </div>
    </section>
  );
}

export function BuiltByTheStudio() {
  return (
    <section className="r52-home-proof r52-built-section" id="built" aria-labelledby="built-title">
      <div className="r52-proof-head">
        <div>
          <span className="r52-folio">04 / SELECTED WORK</span>
          <h2 id="built-title">Selected<br /><em>work.</em></h2>
        </div>
        <div className="r52-proof-head-aside">
          <p className="r52-proof-thesis">
            Client enterprises and studio brand projects conceived, engineered, and launched with founders.
            Built for market endurance, operational clarity, and commercial momentum.
          </p>
          <a href="/work" className="r52-proof-all-link">
            EXPLORE SELECTED WORK <Arrow />
          </a>
        </div>
      </div>

      <div className="r52-featured-fields r52-built-grid">
        {/* 01: My Drink Family - Client Enterprise */}
        <article className="r52-brand-field r52-field-mymosa r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">CLIENT ENTERPRISE • BEVERAGE BRAND SYSTEM</span>
              <div className="r52-built-lockup r52-mdf-lockup">
                <img
                  src="/assets/portfolio/mymosa/identity/my-drink-family-seal-primary-dark.svg"
                  alt="My Drink Family Seal"
                  className="r52-built-logo r52-built-seal"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/portfolio/mymosa/identity/my-drink-family-horizontal-primary-dark.svg"
                  alt="My Drink Family"
                  className="r52-built-wordmark r52-mdf-wordmark"
                  width={190}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <p className="r52-field-copy">
              Category-defining ready-to-drink wine cocktail enterprise built from first principles. Complete brand architecture, seventeen house identities, packaging systems, and national distribution launch.
            </p>
            <div className="r52-field-actions r52-built-actions">
              <a
                href="https://mydrinkfamily.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="r52-action-primary r52-built-action"
                aria-label="Visit My Drink Family website (opens in new tab)"
              >
                VISIT WEBSITE <Arrow />
              </a>
            </div>
          </div>
        </article>

        {/* 02: IKLA Maison - Studio Brand Project */}
        <article className="r52-brand-field r52-field-ikla r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">STUDIO BRAND PROJECT • ULTRA-LUXURY SARTORIAL MAISON</span>
              <div className="r52-built-lockup r52-ikla-lockup">
                <img
                  src="/assets/portfolio/ikla/identity/crest-light.webp"
                  alt="IKLA Maison Heraldic Crest"
                  className="r52-built-logo r52-built-crest"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/portfolio/ikla/identity/wordmark-light.webp"
                  alt="IKLA Maison"
                  className="r52-built-wordmark r52-ikla-wordmark"
                  width={170}
                  height={54}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <p className="r52-field-copy">
              Ultra-luxury European sartorial maison and private-client universe. Timeless architectural tailoring, fine leather goods, silk foulards, and bespoke appointment salon.
            </p>
            <div className="r52-field-actions r52-built-actions">
              <a
                href="https://iklamaison.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="r52-action-primary r52-built-action"
                aria-label="Visit IKLA Maison website (opens in new tab)"
              >
                VISIT WEBSITE <Arrow />
              </a>
            </div>
          </div>
        </article>

        {/* 03: Mr. Cliff's - Studio Showcase */}
        <article className="r52-brand-field r52-field-cliffs r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">STUDIO SHOWCASE • HERITAGE SPIRITS DIGITAL FLAGSHIP</span>
              <div className="r52-built-lockup r52-cliffs-lockup">
                <img
                  src="/assets/portfolio/mr-cliffs/mr-cliffs-emblem.webp"
                  alt="Mr. Cliff's Emblem"
                  className="r52-built-logo r52-built-emblem"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/portfolio/mr-cliffs/mr-cliffs-wordmark.svg"
                  alt="Mr. Cliff's Premium Bourbon Whiskey"
                  className="r52-built-wordmark r52-cliffs-wordmark"
                  width={180}
                  height={32}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <p className="r52-field-copy">
              Kentucky bourbon character meets digital flagship craftsmanship. Evocative brand atmosphere and hospitality presence built around heritage, warmth, and restraint.
            </p>
            <div className="r52-field-actions r52-built-actions">
              <a
                href="/work"
                className="r52-action-primary r52-built-action"
                aria-label="View Mr. Cliff's in portfolio"
              >
                VIEW IN PORTFOLIO <Arrow />
              </a>
            </div>
          </div>
        </article>
      </div>

      <div className="r52-proof-foot">
        <div className="r52-proof-foot-meta">
          <span>04 / SELECTED WORK</span>
          <span>Client work and studio projects clearly distinguished</span>
        </div>
      </div>
    </section>
  );
}

export function CapabilityTerritories() {
  return (
    <section className="r52-home-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      {/* Section Header */}
      <div className="r52-cap-header">
        <div className="r52-cap-title-block">
          <span className="r52-folio">04 / CAPABILITIES</span>
          <h2 id="capabilities-title">What we can<br /><em>build.</em></h2>
        </div>
        <div className="r52-cap-header-aside">
          <p className="r52-cap-lead">
            We engineer complete enterprise ecosystems from raw hypothesis to operating market reality. Four foundational capability territories unify our practice.
          </p>
          <a href="/capabilities" className="r52-cap-primary-cta">
            EXPLORE CAPABILITIES <Arrow />
          </a>
        </div>
      </div>

      {/* Asymmetric Editorial Visual Sequence */}
      <div className="r52-capability-editorial">
        {/* Moment 01: IDENTITY — Large dominant editorial frame */}
        <article className="r52-cap-moment r52-cap-moment-dominant">
          <div className="r52-cap-frame r52-frame-identity">
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/capabilities/01-IDENTITY-METAMORPHOSIS-640.webp 640w, /assets/capabilities/01-IDENTITY-METAMORPHOSIS-1024.webp 1024w, /assets/capabilities/01-IDENTITY-METAMORPHOSIS.webp 1536w"
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 92vw, 1340px"
              />
              <img
                src="/assets/capabilities/01-IDENTITY-METAMORPHOSIS.png"
                alt="DWS Capability Visual — Identity Metamorphosis from raw stone to crystal, textile, brass, and digital form"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <div className="r52-cap-caption r52-caption-dominant">
            <div className="r52-cap-meta">
              <span className="r52-cap-tag">01 / IDENTITY</span>
              <h3 className="r52-cap-name">IDENTITY</h3>
            </div>
            <p className="r52-cap-statement">Systems that give ideas a recognizable world.</p>
          </div>
        </article>

        {/* Moment 02: DIGITAL — Contrasting composition / crop */}
        <article className="r52-cap-moment r52-cap-moment-contrast">
          <div className="r52-cap-caption r52-caption-contrast">
            <div className="r52-cap-meta">
              <span className="r52-cap-tag">02 / DIGITAL</span>
              <h3 className="r52-cap-name">DIGITAL</h3>
            </div>
            <p className="r52-cap-statement">Products and experiences designed for how people live now.</p>
          </div>
          <div className="r52-cap-frame r52-frame-digital">
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/capabilities/02-DIGITAL-PRODUCT-ECOSYSTEM-640.webp 640w, /assets/capabilities/02-DIGITAL-PRODUCT-ECOSYSTEM-1024.webp 1024w, /assets/capabilities/02-DIGITAL-PRODUCT-ECOSYSTEM.webp 1536w"
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 68vw, 980px"
              />
              <img
                src="/assets/capabilities/02-DIGITAL-PRODUCT-ECOSYSTEM.png"
                alt="DWS Capability Visual — Digital Product Ecosystem spanning wearable, mobile, laptop, and global analytics command center"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </article>

        {/* Moment 03: INTELLIGENCE — Full-width / cinematic interruption */}
        <article className="r52-cap-moment r52-cap-moment-cinematic">
          <div className="r52-cap-frame r52-frame-intelligence">
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/capabilities/03-INTELLIGENCE-ORCHESTRATION-640.webp 640w, /assets/capabilities/03-INTELLIGENCE-ORCHESTRATION-1024.webp 1024w, /assets/capabilities/03-INTELLIGENCE-ORCHESTRATION.webp 1536w"
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 92vw, 1340px"
              />
              <img
                src="/assets/capabilities/03-INTELLIGENCE-ORCHESTRATION.png"
                alt="DWS Capability Visual — Intelligence Orchestration synthesizing chaos into enterprise opportunity through autonomous AI cores"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <div className="r52-cap-caption r52-caption-cinematic">
            <div className="r52-cap-meta">
              <span className="r52-cap-tag">03 / INTELLIGENCE</span>
              <h3 className="r52-cap-name">INTELLIGENCE</h3>
            </div>
            <p className="r52-cap-statement">AI, automation and connected systems engineered into operations.</p>
          </div>
        </article>

        {/* Moment 04: PRODUCT — Strong concluding visual */}
        <article className="r52-cap-moment r52-cap-moment-concluding">
          <div className="r52-cap-frame r52-frame-product">
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/capabilities/04-PRODUCT-FROM-MATTER-TO-MARKET-640.webp 640w, /assets/capabilities/04-PRODUCT-FROM-MATTER-TO-MARKET-1024.webp 1024w, /assets/capabilities/04-PRODUCT-FROM-MATTER-TO-MARKET.webp 1536w"
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 92vw, 1340px"
              />
              <img
                src="/assets/capabilities/04-PRODUCT-FROM-MATTER-TO-MARKET.png"
                alt="DWS Capability Visual — Product from Matter to Market tracing raw material to engineering, clay form, glass, and luxury packaging"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <div className="r52-cap-caption r52-cap-concluding">
            <div className="r52-cap-concluding-text">
              <div className="r52-cap-meta">
                <span className="r52-cap-tag">04 / PRODUCT</span>
                <h3 className="r52-cap-name">PRODUCT</h3>
              </div>
              <p className="r52-cap-statement">Ideas translated into tangible, market-ready expressions.</p>
            </div>
            <div className="r52-cap-concluding-action">
              <a href="/capabilities" className="r52-cap-bottom-cta">
                EXPLORE CAPABILITIES <Arrow />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function StudioSignal() {
  return (
    <section className="r52-studio-signal" id="studio" aria-labelledby="studio-signal-title">
      <div className="r52-studio-inner">
        <span className="r52-folio">06 / FOUNDER PARTNERSHIP</span>
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
              <h4>Founder-Led Decisions</h4>
              <p>AI and computational systems accelerate research, iteration, and execution. Strategic decisions and production standards remain strictly subject to human judgment and founder leadership.</p>
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
        <span className="r52-folio">07 / FINAL INVITATION</span>
        <p>Whether you're starting a new business or strengthening an established one, we'll help identify what you need and connect the pieces.</p>
      </div>
      <h2 id="invitation-title">Let's build<br /><em>your next chapter.</em></h2>
      <div className="r52-invitation-end">
        <span className="r52-seed" aria-hidden="true"><i /></span>
        <div>
          <a className="r51-action" href="/contact">Start Your Project <span aria-hidden="true">→</span></a>
          <a className="r52-talk" href="/growth/book">Book a Discovery Call <Arrow /></a>
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
        <p>Brand, Web &amp; Growth Systems.<br />Dynasty Works Studio builds brands, websites, and the systems that support their growth.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/#services">Services</a>
        <a href="/growth">Growth Engine</a>
        <a href="/work">Our Work</a>
        <a href="/studio">About</a>
        <a href="/growth/book">Book a Call <Arrow /></a>
        <a href="/contact">Start Your Project</a>
      </nav>
      <nav className="r52-footer-legal" aria-label="Legal navigation">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/contact">Contact</a>
      </nav>
      <small>© {new Date().getFullYear()} Dynasty Works Studio. All rights reserved.</small>
    </footer>
  );
}
