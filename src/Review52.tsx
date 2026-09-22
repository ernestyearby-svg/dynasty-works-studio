import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './review51.css';
import './review52.css';
import {
  ReviewHeader,
  HomeSelectedWork,
  HomeCapabilities,
  StudioSignal,
  Invitation,
  ReviewFooter,
} from './Review52Shell';
import { businessTypes, type BusinessType } from '@/data/company-builder';
import ReviewDiagnostic from './ReviewDiagnostic';

const stages = ['Idea', 'Strategy', 'Identity', 'Product', 'Digital', 'Experience', 'Market', 'Company'];
const statements = [
  'One possibility.',
  'Give it direction.',
  'Make it recognizable.',
  'Give it a form.',
  'Make it work.',
  'Bring it into the world.',
  'Connect it to people.',
  'Everything. Working together.',
];
const descriptions = [
  'An unformed idea. Open to what comes next.',
  'Audience, purpose and position become a deliberate relationship.',
  'A mark, a voice and a coherent visual language emerge.',
  'Decisions become dimensions, surfaces and something you can hold.',
  'The same identity becomes a usable digital experience.',
  'Product, space and interaction meet at human scale.',
  'One system reaches many places without losing its identity.',
  'Strategy, identity, product, digital, experience and market — connected.',
];

/* Color follows the existing scroll position; object timing and geometry are unchanged. */
const materials = [
  ['#ece9e1', '#111214', '#515352', '#85867e', '#f0ede5', '#d4d0c7', '#96938b'],
  ['#e5e1d8', '#111214', '#484b48', '#7c7f76', '#eeeae1', '#cec9bf', '#918e86'],
  ['#dedad1', '#111214', '#494b48', '#787b73', '#eeebe3', '#c5c0b6', '#89867e'],
  ['#d4d0c7', '#111214', '#454744', '#74776f', '#f0ede5', '#c5c0b5', '#77776f'],
  ['#303234', '#ede9df', '#c5c3b9', '#969990', '#484b4c', '#383b3d', '#222527'],
  ['#1c1e20', '#ede9df', '#c6c5ba', '#a2a49b', '#45484a', '#34383a', '#25282b'],
  ['#262728', '#ede9df', '#c5c3ba', '#9d9f96', '#4b4d4e', '#383b3c', '#26292b'],
  ['#111214', '#ede9df', '#c6c4ba', '#999d94', '#4b4d4e', '#333638', '#202326'],
];
const materialKeys = ['--field', '--drawing', '--secondary', '--rule', '--surface-top', '--surface-front', '--surface-side'];

function materialStyle(position: number): CSSProperties {
  const index = Math.min(7, Math.floor(position)), next = Math.min(7, index + 1);
  const mix = Math.min(1, Math.max(0, (position - index - 0.6) / 0.4));
  const blend = (a: string, b: string, t: number) => {
    const rgb = [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t));
    return 'rgb(' + rgb.join(',') + ')';
  };
  const returnToPaper = Math.max(0, Math.min(1, position - 8));
  const values = Object.fromEntries(
    materialKeys.map((key, i) => [key, returnToPaper ? blend(materials[7][i], materials[0][i], returnToPaper) : blend(materials[index][i], materials[next][i], mix)])
  );
  const channels = values['--field'].match(/\d+/g)!.map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  // Switch foreground polarity at the accessible crossover instead of fading through low contrast.
  const crossover = luminance >= 0.12 && luminance <= 0.27;
  values['--drawing'] = crossover ? (luminance > 0.179 ? '#000000' : '#ffffff') : luminance > 0.27 ? '#111214' : '#ede9df';
  values['--secondary'] = luminance > 0.45 ? '#484b48' : values['--drawing'];
  if (crossover) values['--rule'] = values['--drawing'];
  return values as CSSProperties;
}

function Artifact({ phase, assembly = 0 }: { phase: number; assembly?: number }) {
  const visible = (n: number) => phase === n || phase === 7;
  return (
    <svg
      className={'p-artifact ' + (phase === 7 ? 'is-company' : '')}
      viewBox="0 0 900 600"
      role="img"
      aria-label={phase === 0 ? 'An open plane, one line and a cobalt point: the first piece of a system.' : descriptions[phase]}
    >
      <defs>
        <linearGradient id="product-side">
          <stop stopColor="#d6d4cd" />
          <stop offset="1" stopColor="#aba9a3" />
        </linearGradient>
      </defs>
      <g className="p-system-traces" data-on={phase === 7} fill="none" stroke="#95958e" strokeWidth="1">
        <path d="M220 170H450V285M710 150H580V285M220 440H395V335M685 420H545V335M450 335V535" />
        <path d="M120 285H780" strokeDasharray="3 7" />
        <circle cx="450" cy="310" r="93" />
      </g>
      <g
        className="p-core"
        style={{
          opacity: [2, 3, 4, 5].includes(phase) ? 0 : 1,
          transform: phase === 0 ? 'translate(0px,0px)' : phase === 7 ? 'translate(270px,175px) scale(.40)' : 'translate(305px,210px) scale(.28)',
        }}
      >
        <path d="M330 185V405H550V370H365V185Z" fill="#17191c" style={{ transform: phase === 0 ? 'translate(' + -assembly * 28 + 'px,' + assembly * 14 + 'px)' : 'none' }} />
        <path d="M365 185H550V335" fill="none" stroke="#8f9289" strokeWidth="1.3" style={{ transform: phase === 0 ? 'translate(' + assembly * 35 + 'px,' + -assembly * 20 + 'px)' : 'none' }} />
        <path d="M365 370L550 185" stroke="#a9aca3" strokeWidth="1" strokeDasharray="3 6" opacity={phase === 0 ? assembly : 0} />
        <path d="M550 145V185H590" fill="none" stroke="#2457ff" strokeWidth="2" style={{ transform: phase === 0 ? 'translate(' + assembly * 35 + 'px,' + -assembly * 20 + 'px)' : 'none' }} />
        <circle cx="550" cy="185" r="6" fill="#2457ff" style={{ transform: phase === 0 ? 'translate(' + assembly * 35 + 'px,' + -assembly * 20 + 'px)' : 'none' }} />
      </g>
      <>
        <g className="p-evidence p-strategy" data-on={visible(1)} style={{ transform: phase === 7 ? 'translate(20px,45px) scale(.47)' : 'translate(0px,0px)' }} fill="none" stroke="#202226">
          <path d="M140 340H350V145H660V430H350V340M140 340V190H350M350 280H660" strokeWidth="1.2" />
          <path d="M350 145L660 280L350 430Z" stroke="#2457ff" strokeWidth="2" />
          <circle cx="140" cy="340" r="7" fill="#2457ff" stroke="none" />
          <circle cx="350" cy="145" r="6" fill="#f3f1eb" />
          <circle cx="660" cy="280" r="6" fill="#f3f1eb" />
          <circle cx="350" cy="430" r="6" fill="#f3f1eb" />
          <g fill="#17191c" stroke="none" className="p-svg-label">
            <text x="115" y="378">PURPOSE</text>
            <text x="350" y="120">AUDIENCE</text>
            <text x="680" y="284">POSITION</text>
            <text x="350" y="467">OPPORTUNITY</text>
          </g>
        </g>
        <g className="p-evidence p-identity" data-on={visible(2)} style={{ transform: phase === 7 ? 'translate(550px,25px) scale(.38)' : 'translate(0px,0px)' }}>
          <g transform="translate(180 200)">
            <path d="M0 140V0H70L140 70V140H70V70H0Z" fill="#17191c" />
            <path d="M0 70H70V140H0Z" fill="#2457ff" />
          </g>
          <text x="410" y="280" className="p-type-specimen">Aa</text>
          <path d="M400 315H700" stroke="#8c8d89" />
          <rect x="410" y="350" width="88" height="48" fill="#17191c" />
          <rect x="508" y="350" width="88" height="48" fill="#2457ff" />
          <rect x="606" y="350" width="88" height="48" fill="#d2d0c8" />
          <text x="180" y="455" className="p-svg-label">FORM / VOICE / RECOGNITION</text>
        </g>
        <g className="p-evidence p-product" data-on={visible(3)} style={{ transform: phase === 7 ? 'translate(10px,280px) scale(.45)' : 'translate(0px,0px)' }}>
          <path d="M250 190L400 132L540 195L385 260Z" fill="#f8f8f4" stroke="#a7a8a1" />
          <path d="M250 190L385 260V455L250 380Z" fill="#deded7" stroke="#a7a8a1" />
          <path d="M385 260L540 195V382L385 455Z" fill="url(#product-side)" stroke="#a7a8a1" />
          <path d="M385 295L540 230V245L385 310Z" fill="#2457ff" />
          <path d="M300 245L325 258V288L300 275Z" fill="#17191c" />
          <path d="M225 185V389M210 185H238M210 389H238M390 485L553 410M390 475V497M553 399V421" stroke="#9c9d97" fill="none" />
          <text x="170" y="300" className="p-svg-label" transform="rotate(-90 170 300)">PROPORTION</text>
          <text x="420" y="530" className="p-svg-label">SURFACE / VOLUME</text>
        </g>
        <g className="p-evidence p-digital" data-on={visible(4)} style={{ transform: phase === 7 ? 'translate(550px,275px) scale(.40)' : 'translate(0px,0px)' }}>
          <path d="M165 135H735V460H165Z" fill="#fcfcfa" stroke="#7e807c" />
          <path d="M165 177H735M530 177V460" stroke="#c5c5bf" />
          <path d="M187 150H203V165H187ZM680 155H713" fill="#17191c" stroke="#17191c" />
          <text x="198" y="252" className="p-interface-heading">A new</text>
          <text x="198" y="303" className="p-interface-heading">perspective.</text>
          <path d="M200 343H398M200 355H367" stroke="#92948d" />
          <rect x="200" y="392" width="139" height="34" fill="#2457ff" />
          <path d="M305 409H321M316 404L321 409L316 414" fill="none" stroke="white" />
          <path d="M572 239V382H699V360H594V239Z" fill="#17191c" />
          <path d="M594 239H699V337" fill="none" stroke="#92968c" />
          <circle cx="699" cy="239" r="5" fill="#2457ff" />
          <text x="165" y="499" className="p-svg-label">IDENTITY BECOMES INTERACTION</text>
        </g>
        <g className="p-evidence p-experience" data-on={visible(5)} style={{ transform: phase === 7 ? 'translate(305px,365px) scale(.33)' : 'translate(0px,0px)' }}>
          <path d="M180 360L445 220L745 358L469 505Z" fill="#dfdfd7" stroke="#969891" />
          <path d="M180 360V178L445 50V220Z" fill="#e8e8e0" stroke="#969891" />
          <path d="M445 50L745 194V358L445 220Z" fill="#f9f9f5" stroke="#969891" />
          <path d="M293 302V196L308 188V278L382 241V256Z" fill="#17191c" />
          <path d="M509 340V242L575 272V372Z" fill="#b6b8af" />
          <path d="M509 242L566 216L631 246L575 272Z" fill="#fcfcfa" />
          <path d="M575 272L631 246V344L575 372Z" fill="#d1d2ca" />
          <path d="M445 220L745 358" stroke="#2457ff" strokeWidth="4" />
          <circle cx="426" cy="328" r="9" fill="#26282a" />
          <path d="M426 340V392M415 356H437M426 392L415 416M426 392L437 416" stroke="#26282a" strokeWidth="3" />
          <text x="175" y="550" className="p-svg-label">OBJECT / SPACE / HUMAN SCALE</text>
        </g>
        <g className="p-evidence p-market" data-on={visible(6)} style={{ transform: phase === 7 ? 'translate(275px,-35px) scale(.38)' : 'translate(0px,0px)' }}>
          <path d="M450 310V120M450 310H200M450 310H700M450 310V480M200 310V170M700 310V445" fill="none" stroke="#838780" />
          <g fill="#17191c">
            <path d="M410 60H490V160H410Z" />
            <path d="M120 125H270V225H120Z" />
            <path d="M640 255H765V340H640Z" />
            <path d="M390 430H510V490H390Z" />
            <path d="M655 395H742V490H655Z" />
          </g>
          <g fill="#f3f1eb">
            <path d="M425 80H445V140H425Z" />
            <path d="M140 145H250V153H140ZM140 170H205V210H140Z" />
            <path d="M657 270H744V279H657ZM657 290H700V320H657Z" />
          </g>
          <path d="M402 450H500M670 415H727" stroke="#2457ff" strokeWidth="7" />
          <text x="315" y="553" className="p-svg-label">ONE IDENTITY. MANY TOUCHPOINTS.</text>
        </g>
        <g className="p-evidence p-resolution-signature" data-on={phase === 7}>
          <text x="450" y="576" textAnchor="middle" className="p-company-signature">One company.</text>
          <circle cx="450" cy="310" r="5" fill="#2457ff" />
        </g>
      </>
      <g className="p-mobile-resolution" data-on={phase === 7}>
        <path d="M160 90V485H735" fill="none" stroke="#17191c" strokeWidth="16" />
        <path d="M185 90H735V460" fill="none" stroke="#9b9f94" />
        <circle cx="735" cy="90" r="9" fill="#2457ff" />
        {['Strategy', 'Identity', 'Product', 'Digital', 'Experience', 'Market'].map((name, i) => (
          <g key={name}>
            <path d={'M190 ' + (130 + i * 54) + 'H700'} stroke="#c1c4b9" />
            <text x="205" y={164 + i * 54} className="p-mobile-number">{String(i + 2).padStart(2, '0')}</text>
            <text x="277" y={165 + i * 54} className="p-mobile-discipline">{name}</text>
            <path d={'M668 ' + (150 + i * 54) + 'h16'} stroke="#2457ff" strokeWidth="3" />
          </g>
        ))}
        <text x="450" y="565" textAnchor="middle" className="p-company-signature">One company.</text>
      </g>
    </svg>
  );
}

export type CreationEnvironmentState = { position: number; phase: number; reduced: boolean; material: CSSProperties };

export default function Review52({ environment }: { environment?: (state: CreationEnvironmentState) => ReactNode } = {}) {
  const [temperature] = useState(0);
  const [phase] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  return (
    <div className={'p-prototype r51 r52' + (environment ? ' has-environment' : '')}>
      {environment?.({ position: temperature, phase, reduced, material: materialStyle(temperature) })}
      <a className="p-skip" href="#work">Skip to featured work</a>

      {/* 01: HERO & ARRIVAL */}
      <section id="hero" className="p-arrival" aria-labelledby="p-title">
        <ReviewHeader />
        <div className="p-arrival-composition">
          <p className="p-arrival-note">Company Creation Studio <br />From idea to operating enterprise.</p>
          <h1 id="p-title">From idea<span>to company.</span></h1>
          <div className="p-origin-art">
            <div className="p-origin-anchor">
              <Artifact phase={0} assembly={1} />
            </div>
            <span className="p-origin-caption"><i />One idea. Infinite potential.</span>
          </div>
          <p className="p-arrival-bottom">
            We partner with founders to turn ideas into complete operating companies — unifying strategy, identity, product, digital systems, and market launch.
          </p>
          <div className="r51-arrival-actions">
            <a className="r51-action" href="#review-builder">Start a company <span aria-hidden="true">→</span></a>
            <a className="r52-hero-work" href="#work">View selected work <span aria-hidden="true">↗</span></a>
            <a className="p-enter" href="#operating">How we build <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      {/* 02: FEATURED WORK / BRAND FIELDS */}
      <HomeSelectedWork />

      {/* 03: HOW WE BUILD / OPERATING SYSTEM */}
      <Operating />

      {/* 04: WHAT WE CAN BUILD / CAPABILITY VISUAL EDITORIAL */}
      <HomeCapabilities />

      {/* 05: COMPANY BUILDER */}
      <ReviewBuilder />

      {/* 06: WHY DWS / THE STUDIO */}
      <StudioSignal />

      {/* 07: ENTRY POINTS / FINAL CTA */}
      <Invitation />
      <ReviewFooter />
    </div>
  );
}

const operations = [
  { name: 'Define', title: 'Find the company inside the idea.', terms: 'Purpose / Audience / Position / Opportunity / Business model / Roadmap' },
  { name: 'Build', title: 'Turn direction into working assets.', terms: 'Identity / Product / Packaging / Digital / Experience' },
  { name: 'Launch', title: 'Move the system into the market.', terms: 'Content / Campaign / Channel / Retail / Digital / Audience' },
  { name: 'Scale', title: 'Strengthen what works. Build what comes next.', terms: 'Operations / Automation / New products / New experiences / New markets' },
];

function Operating() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = track.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setActive(Math.max(0, Math.min(3, Math.floor((-r.top / (el.offsetHeight - innerHeight)) * 4))));
      });
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, []);
  function go(i: number) {
    const el = track.current;
    if (!el) return;
    scrollTo({
      top: el.getBoundingClientRect().top + scrollY + ((el.offsetHeight - innerHeight) * (i + 0.15)) / 4,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  return (
    <section ref={track} id="operating" className="r51-operating" aria-label="Four operating states">
      <div className="r51-operating-stage" data-operation={active}>
        <header>
          <span>03 / HOW WE BUILD</span>
          <span>The same company. Four operating states: Define → Build → Launch → Scale.</span>
        </header>
        <nav aria-label="Operating states">
          {operations.map((o, i) => (
            <button key={o.name} aria-current={active === i ? 'step' : undefined} onClick={() => go(i)}>
              <small>0{i + 1}</small>
              {o.name}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
        <div className="r51-operating-art">
          <Artifact phase={7} />
          <div className="r51-extensions" aria-hidden="true">
            <span>Operations</span>
            <span>New products</span>
            <span>New markets</span>
          </div>
        </div>
        <div className="r51-operating-copy" aria-live="polite">
          <h2>{operations[active].title}</h2>
          <p>{operations[active].terms}</p>
        </div>
        <div className="r51-operating-foot">
          <span>One architecture, increasingly complete.</span>
          <a href="/#review-builder">Bring us the idea →</a>
        </div>
      </div>
    </section>
  );
}

function ReviewBuilder() {
  const [started, setStarted] = useState(false);
  const [type, setType] = useState<BusinessType | null>(null);
  const [map, setMap] = useState<{ phases: string[]; complete: boolean }>({ phases: [], complete: false });
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (started && !type) title.current?.focus();
  }, [started, type]);
  const active = (name: string) =>
    map.phases.some((p) =>
      name === 'strategy'
        ? p === 'Foundation'
        : name === 'identity'
        ? p === 'Brand'
        : name === 'product'
        ? p === 'Product / Infrastructure'
        : name === 'digital'
        ? p === 'Digital'
        : name === 'experience'
        ? p === 'Activation'
        : name === 'market'
        ? ['Launch', 'Distribution', 'Commercialization'].includes(p)
        : ['Automation System', 'Growth'].includes(p)
    );
  const classes = ['strategy', 'identity', 'product', 'digital', 'experience', 'market', 'systems'].filter(active).map((s) => 'has-' + s).join(' ');
  return (
    <section id="review-builder" className={'r51-builder ' + (started ? 'is-started ' : '') + (map.complete ? 'has-result' : '')}>
      <header>
        <span>05 / COMPANY BUILDER</span>
        <h2>Build the architecture<br /><em>before building the company.</em></h2>
        <p>Tell us what we're building. Tell us where it stands. Tell us what it needs.<br />Dynasty Works will generate an initial company-build roadmap.</p>
      </header>
      <div className="r51-instrument">
        <div className="r51-instrument-status">
          <span>DYNASTY WORKS / FOUNDER DIAGNOSTIC</span>
          <span>{map.complete ? 'OUTPUT / EXECUTIVE ROADMAP' : type ? 'INPUT / STRATEGIC PROFILE' : started ? '01 / COMPANY TYPE' : 'READY / YOUR IDEA'}</span>
        </div>
        <div className="r51-response">
          <div className={'r51-response-art ' + classes + (started ? ' is-active' : '')}>
            <Artifact phase={started ? 7 : 0} />
            {type && (
              <div className="r51-mobile-map">
                {map.phases.map((p, i) => (
                  <div key={p}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    <span>{p}</span>
                    <i aria-hidden="true" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <p>{map.complete ? 'Your mapped disciplines' : type ? 'Initial engine response' : 'One idea. Your starting point.'}</p>
          {type && (
            <ul className="r51-response-labels">
              {map.phases.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="r51-input">
          {!started ? (
            <>
              <h3>What does your<br /><em>idea need next?</em></h3>
              <button className="r51-action" onClick={() => setStarted(true)}>
                Start your roadmap <span aria-hidden="true">→</span>
              </button>
              <p className="r51-utility">
                An initial direction, not a quote.<br />Your answers stay in this browser. Nothing is sent.
              </p>
            </>
          ) : !type ? (
            <>
              <p className="r51-step">01 / YOUR STARTING POINT</p>
              <h3 ref={title} tabIndex={-1}>What are<br />we building?</h3>
              <div className="r51-business-types" aria-label="Choose a business type">
                {businessTypes.map((t) => (
                  <button key={t} onClick={() => setType(t)}>
                    {t}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <ReviewDiagnostic businessType={type} onRestart={() => { setType(null); setMap({ phases: [], complete: false }); }} onMapChange={setMap} />
          )}
        </div>
      </div>
      {map.complete && (
        <div className="r51-blueprint">
          <span>GO DEEPER</span>
          <a href="/founder-blueprint">Founder Blueprint <span aria-hidden="true">↗</span></a>
          <p>A deeper strategic engagement.<br /><strong>$1,500</strong></p>
        </div>
      )}
    </section>
  );
}
