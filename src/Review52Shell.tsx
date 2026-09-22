import { useRef, useState } from 'react';

const links = [
  ['Work', '/work'],
  ['How we build', '/#creation'],
  ['Capabilities', '/capabilities'],
  ['Studio', '/studio'],
  ['Contact', '/contact'],
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
      <a className="r52-nav-action" href="/#review-builder">Start a company <Arrow /></a>
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
          <a href="/work" onClick={close}>Work <Arrow /></a>
          <a href="/#creation" onClick={close}>How we build</a>
          <a href="/capabilities" onClick={close}>Capabilities <Arrow /></a>
          <a href="/#review-builder" onClick={close}>Company Builder</a>
          <a href="/studio" onClick={close}>Studio</a>
          <a href="/contact" onClick={close}>Contact</a>
        </nav>
        <a className="r51-action" href="/#review-builder" onClick={close}>Start a company <Arrow /></a>
      </dialog>
    </header>
  );
}

export function BuiltByTheStudio() {
  return (
    <section className="r52-home-proof r52-built-section" id="built" aria-labelledby="built-title">
      <div className="r52-proof-head">
        <div>
          <span className="r52-folio">03 / BUILT BY THE STUDIO</span>
          <h2 id="built-title">Authentic operating<br /><em>brand worlds.</em></h2>
        </div>
        <div className="r52-proof-head-aside">
          <p className="r52-proof-thesis">
            Real enterprises conceived, engineered, and launched with founders.
            Zero synthetic claims. Live commercial destinations.
          </p>
        </div>
      </div>

      <div className="r52-featured-fields r52-built-grid">
        {/* 01: My Drink Family */}
        <article className="r52-brand-field r52-field-mymosa r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">CATEGORY PIONEER • BEVERAGE BRAND SYSTEM</span>
              <div className="r52-built-lockup r52-mdf-lockup">
                <img
                  src="/assets/portfolio/mymosa/identity/my-drink-family-seal-primary-light.svg"
                  alt="My Drink Family Seal"
                  className="r52-built-logo r52-built-seal"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/portfolio/mymosa/identity/my-drink-family-horizontal-primary-light.svg"
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
                href="https://mydrinkfamily.com"
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

        {/* 02: IKLA Maison */}
        <article className="r52-brand-field r52-field-ikla r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">ULTRA-LUXURY SARTORIAL MAISON</span>
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
                href="https://iklamaison.com"
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

        {/* 03: Mr. Cliff's */}
        <article className="r52-brand-field r52-field-cliffs r52-built-card">
          <div className="r52-field-content">
            <div className="r52-built-brand-header">
              <span className="r52-field-category">HERITAGE SPIRITS • DIGITAL FLAGSHIP</span>
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
                href="https://mr-cliffs-aesthetic-upgrade.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="r52-action-primary r52-built-action"
                aria-label="Visit Mr. Cliff's website (opens in new tab)"
              >
                VISIT WEBSITE <Arrow />
              </a>
            </div>
          </div>
        </article>
      </div>

      <div className="r52-proof-foot">
        <div className="r52-proof-foot-meta">
          <span>03 / AUTHORITATIVE LIVE ENTERPRISES</span>
          <span>Zero synthetic client claims</span>
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
        <span className="r52-folio">06 / WHY DWS</span>
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
        <span className="r52-folio">07 / FINAL CTA</span>
        <p>The next company<br />has not been built yet.</p>
      </div>
      <h2 id="invitation-title">What are<br /><em>we building?</em></h2>
      <div className="r52-invitation-end">
        <span className="r52-seed" aria-hidden="true"><i /></span>
        <div>
          <a className="r51-action" href="/#review-builder">Start a company <span aria-hidden="true">→</span></a>
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
        <a href="/work">Work</a>
        <a href="/#creation">How we build</a>
        <a href="/capabilities">Capabilities</a>
        <a href="/#review-builder">Company Builder</a>
        <a href="/studio">Studio</a>
        <a href="/#review-builder">Start a company <Arrow /></a>
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
