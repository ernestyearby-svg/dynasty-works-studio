import {useEffect,useState,type ReactNode} from 'react';
import {SiteHeader,SiteFooter} from './SiteChrome';
import images from './portfolio-images.json';
import {concepts,portfolioTitles} from './portfolio-data';
import './portfolio.css';

type ImageKey=keyof typeof images;

function Image({id,alt,critical=false,className='',sizes='(max-width: 800px) 100vw, 90vw'}:{id:string;alt:string;critical?:boolean;className?:string;sizes?:string}){
 const a=images[id as ImageKey];
 if(!a) return null;
 const set=(format:string)=>a.widths.map(w=>`/assets/portfolio/${id}-${w}.${format} ${w}w`).join(', ');
 const defaultWidth=a.widths[Math.min(1,a.widths.length-1)];
 return <picture className={'portfolio-image '+className}><source type="image/avif" srcSet={set('avif')} sizes={sizes}/><img src={`/assets/portfolio/${id}-${defaultWidth}.webp`} srcSet={set('webp')} sizes={sizes} width={a.width} height={a.height} alt={alt} loading={critical?'eager':'lazy'} fetchPriority={critical?'high':'auto'} decoding="async"/></picture>;
}

function Visual({id,alt,caption,critical=false,className=''}:{id:string;alt:string;caption:string;critical?:boolean;className?:string}){
 return <figure className={'portfolio-visual '+className}><Image id={id} alt={alt} critical={critical}/><figcaption>{caption}</figcaption></figure>;
}

function Intro({label,title,copy,children}:{label:string;title:ReactNode;copy:string;children?:ReactNode}){
 return <header className="portfolio-intro wrap"><p className="kicker">{label}</p><h1>{title}</h1><div className="intro-bottom"><p>{copy}</p>{children}</div></header>;
}

function LabGate(){
 return <section className="lab-gate wrap"><p className="kicker">CONCEPT LAB</p><h2>What else<br/>can we build?</h2><div><p>Independent studies exploring how strategy, identity, product, digital and experience can become complete systems.</p><p className="concept-classification">Conceptual studies · Not client engagements</p><a className="text-action" href="/concept-lab">Enter Concept Lab <span aria-hidden="true">↗</span></a></div></section>;
}

function CompanyGate(){
 return <section className="company-gate wrap"><p className="kicker">FROM IDEA TO COMPANY.</p><h2>Bring us the idea.</h2><div className="company-gate-actions"><a href="/#review-builder" className="primary-action">Start a company <span aria-hidden="true">→</span></a><a href="/capabilities" className="text-action">Explore capabilities →</a></div></section>;
}

function Work(){
 return <>
  <Intro
   label="SELECTED WORK / OPERATING ENTERPRISES"
   title={<>Different companies.<br/>Connected thinking.</>}
   copy="Selected operating brands built across beverage, fashion, and spirits. Each company expresses its own distinct discipline and category authority."
  />

  {/* 01 MY DRINK FAMILY / MYMOSA */}
  <section className="work-showcase-item work-brand-mymosa wrap" id="mymosa" aria-labelledby="brand-01-title">
   <div className="work-brand-header">
    <div className="work-brand-identity">
     <span className="work-brand-index">01 / SELECTED WORK</span>
     <div className="work-brand-lockup">
      <a href="https://mydrinkfamily.com" target="_blank" rel="noopener noreferrer" id="brand-01-title" className="work-mdf-lockup-link" aria-label="My Drink Family">
       <img
        src="/assets/portfolio/mymosa/identity/my-drink-family-horizontal-primary-light.svg"
        alt="My Drink Family"
        className="work-brand-mark work-mdf-mark"
        width={320}
        height={73}
        loading="eager"
       />
      </a>
     </div>
    </div>
    <span className="work-brand-descriptor">CATEGORY PIONEER • BEVERAGE BRAND SYSTEM</span>
   </div>

   <a className="work-visual-frame" href="https://mydrinkfamily.com" target="_blank" rel="noopener noreferrer" aria-label="Visit My Drink Family live website">
    <picture className="portfolio-image">
     <source srcSet="/assets/portfolio/01-MY-DRINK-FAMILY-HERO-800.webp 800w, /assets/portfolio/01-MY-DRINK-FAMILY-HERO-1200.webp 1200w, /assets/portfolio/01-MY-DRINK-FAMILY-HERO.webp 1672w" sizes="(max-width: 800px) 100vw, 1340px"/>
     <img src="/assets/portfolio/01-MY-DRINK-FAMILY-HERO.webp" width={1672} height={941} alt="My Drink Family — Category-defining beverage brand system" loading="eager" decoding="async"/>
    </picture>
   </a>

   <div className="work-brand-footer">
    <p className="work-brand-summary">
     Category-defining ready-to-drink cocktail enterprise built from first principles — complete brand architecture, 17 house identities, packaging systems, and national distribution launch.
    </p>
    <div className="work-actions-cluster">
     <a className="work-primary-cta work-cta-mymosa" href="https://mydrinkfamily.com" target="_blank" rel="noopener noreferrer">
      VISIT WEBSITE <span aria-hidden="true">↗</span>
     </a>
     <a className="work-secondary-cta" href="/work/mymosa">
      VIEW PROJECT <span aria-hidden="true">→</span>
     </a>
    </div>
   </div>
  </section>

  {/* 02 IKLA MAISON */}
  <section className="work-showcase-item work-brand-ikla wrap" id="ikla" aria-labelledby="brand-02-title">
   <div className="work-brand-header">
    <div className="work-brand-identity">
     <span className="work-brand-index">02 / SELECTED WORK</span>
     <div className="work-brand-lockup">
      <a href="https://iklamaison.com" target="_blank" rel="noopener noreferrer" id="brand-02-title" className="work-ikla-lockup-link" aria-label="IKLA Maison">
       <img
        src="/assets/portfolio/ikla/identity/crest-light.webp"
        alt="IKLA Maison Crest"
        className="work-brand-crest"
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
       />
       <img
        src="/assets/portfolio/ikla/identity/wordmark-light.webp"
        alt="IKLA Maison"
        className="work-brand-mark work-ikla-mark"
        width={220}
        height={73}
        loading="lazy"
        decoding="async"
       />
      </a>
     </div>
    </div>
    <span className="work-brand-descriptor">ULTRA-LUXURY SARTORIAL MAISON</span>
   </div>

   <a className="work-visual-frame" href="https://iklamaison.com" target="_blank" rel="noopener noreferrer" aria-label="Visit IKLA Maison live website">
    <picture className="portfolio-image">
     <source srcSet="/assets/portfolio/02-IKLA-MAISON-HERO-800.webp 800w, /assets/portfolio/02-IKLA-MAISON-HERO-1200.webp 1200w, /assets/portfolio/02-IKLA-MAISON-HERO.webp 1672w" sizes="(max-width: 800px) 100vw, 1340px"/>
     <img src="/assets/portfolio/02-IKLA-MAISON-HERO.webp" width={1672} height={941} alt="IKLA Maison — Ultra-luxury European sartorial maison" loading="lazy" decoding="async"/>
    </picture>
   </a>

   <div className="work-brand-footer">
    <p className="work-brand-summary">
     Architectural tailoring, fine leather goods, and an exclusive private-client salon universe shaped by heraldic restraint, digital flagship experience, and bespoke Griffin luxury commissions.
    </p>
    <div className="work-actions-cluster">
     <a className="work-primary-cta work-cta-ikla" href="https://iklamaison.com" target="_blank" rel="noopener noreferrer">
      VISIT WEBSITE <span aria-hidden="true">↗</span>
     </a>
     <a className="work-secondary-cta" href="/work/ikla">
      VIEW PROJECT <span aria-hidden="true">→</span>
     </a>
    </div>
   </div>
  </section>

  {/* 03 MR. CLIFF'S */}
  <section className="work-showcase-item work-brand-cliffs wrap" id="mr-cliffs" aria-labelledby="brand-03-title">
   <div className="work-brand-header">
    <div className="work-brand-identity">
     <span className="work-brand-index">03 / SELECTED WORK</span>
     <div className="work-brand-lockup">
      <a href="https://mr-cliffs-aesthetic-upgrade.netlify.app" target="_blank" rel="noopener noreferrer" id="brand-03-title" className="work-cliffs-lockup-link" aria-label="Mr. Cliff's Premium Bourbon Whiskey">
       <img
        src="/assets/portfolio/mr-cliffs/mr-cliffs-emblem.webp"
        alt="Mr. Cliff's Emblem"
        className="work-brand-emblem"
        width={50}
        height={50}
        loading="lazy"
        decoding="async"
       />
       <img
        src="/assets/portfolio/mr-cliffs/mr-cliffs-wordmark.svg"
        alt="Mr. Cliff's"
        className="work-brand-mark work-cliffs-mark"
        width={240}
        height={42}
        loading="lazy"
        decoding="async"
       />
      </a>
     </div>
    </div>
    <div className="work-cliffs-specs">
     <span>90 PROOF</span>
     <span>•</span>
     <span>45% ALC./VOL.</span>
     <span>•</span>
     <span>750 ML</span>
    </div>
   </div>

   <a className="work-visual-frame" href="https://mr-cliffs-aesthetic-upgrade.netlify.app" target="_blank" rel="noopener noreferrer" aria-label="Visit Mr. Cliff’s live website">
    <picture className="portfolio-image">
     <source srcSet="/assets/portfolio/03-MR-CLIFFS-HERO-800.webp 800w, /assets/portfolio/03-MR-CLIFFS-HERO-1200.webp 1200w, /assets/portfolio/03-MR-CLIFFS-HERO.webp 1672w" sizes="(max-width: 800px) 100vw, 1340px"/>
     <img src="/assets/portfolio/03-MR-CLIFFS-HERO.webp" width={1672} height={941} alt="Mr. Cliff’s — Heritage spirits and digital flagship" loading="lazy" decoding="async"/>
    </picture>
   </a>

   <div className="work-brand-footer">
    <p className="work-brand-summary">
     Kentucky bourbon character meets digital flagship craftsmanship — an evocative online brand experience and hospitality presence built around heritage, warmth, and restraint.
    </p>
    <div className="work-actions-cluster">
     <a className="work-primary-cta work-cta-cliffs" href="https://mr-cliffs-aesthetic-upgrade.netlify.app" target="_blank" rel="noopener noreferrer">
      VISIT WEBSITE <span aria-hidden="true">↗</span>
     </a>
     <a className="work-secondary-cta" href="/work/mr-cliffs">
      VIEW PROJECT <span aria-hidden="true">→</span>
     </a>
    </div>
   </div>
  </section>

  <LabGate/>
  <CompanyGate/>
 </> ;
}

function Chapter({number,title,copy,children,id}:{number:string;title:string;copy:string;children?:ReactNode;id?:string}){
 return <section className="case-chapter wrap" id={id}><div className="chapter-heading"><p className="kicker">{number}</p><h2>{title}</h2><p>{copy}</p></div>{children}</section>;
}

function Back(){
 return <a href="/work" className="text-action">← Back to Work</a>;
}

function Next({name,href}:{name:string;href:string}){
 return <nav className="next-project wrap" aria-label="Case study navigation"><Back/><a href={href}><span className="kicker">NEXT PROJECT</span><strong>{name} <span aria-hidden="true">↗</span></strong></a><a href="/concept-lab" className="text-action">Explore Concept Lab →</a></nav>;
}

function MyMosa(){
 return <article className="case-study case-mymosa">
  <Intro label="01 / SELECTED WORK" title={<>MyMosa<span className="case-subtitle">/ My Drink Family</span></>} copy="Category pioneer. Beverage brand architecture, four-flavor packaging system, and extensible brand-house ecosystem."><Back/></Intro>
  <div className="wrap"><Visual id="01-mymosa-four-flavor-hero" alt="MyMosa four-flavor packaging system." caption="Product presentation · project visualization" critical/></div>
  <Chapter number="01 / CHALLENGE" title="Defining a Category in Canned Wine Cocktails." copy="The ready-to-drink beverage landscape was dominated by generic hard seltzers and undifferentiated spirit mixes. The challenge was to engineer a sophisticated canned mimosa brand that felt celebratory yet grounded in authentic wine pedigree, designed to scale seamlessly from an initial flagship into a multi-expression beverage house."/>
  <Chapter number="02 / SYSTEM / APPROACH" title="Rhythm, Constant Hierarchy &amp; Color Coding." copy="Dynasty Works Studio engineered a strict label hierarchy: a central cream pedestal, elegant serif typography, and prominent wordmark remain fixed, while vivid background hues and bespoke fruit illustrations identify each flavor expression.">
   <div className="flavor-rail" tabIndex={0} role="region" aria-label="Four flavor details; scroll horizontally on mobile">
    {[['orange','Classic Orange'],['pineapple','Pineapple'],['tropical','Tropical'],['strawberry','Strawberry']].map(([id,name])=><figure key={id}><Image id={'mymosa-'+id+'-detail'} alt={'MyMosa '+name+' — unchanged source detail.'} sizes="(max-width:800px) 190px, 220px"/><figcaption>{name}</figcaption></figure>)}
   </div>
  </Chapter>
  <Chapter number="03 / WHAT DWS BUILT" title="From Can Master to Beverage Ecosystem." copy="Dynasty Works Studio designed and delivered the complete four-flavor and eight-flavor packaging systems, the 17-house My Drink Family organizing architecture, identity lockups, and digital flagship assets."/>
  <Chapter number="04 / BRAND ARCHITECTURE" title="MyMosa &amp; The My Drink Family Ecosystem." copy="The flagship product was positioned as house number one within 'My Drink Family', an umbrella brand architecture developed to host an entire family of complementary beverage ventures under a unified corporate seal."><Visual id="04-mymosa-brand-system" alt="MyMosa brand system presentation spanning packaging and campaign direction." caption="Brand-world development"/></Chapter>
  <Chapter number="05 / SELECTED PROCESS / SYSTEM PROOF" title="Label Hierarchy &amp; Flavor Development." copy="A structure for every expression: inspect the flavor system, label zone constants, and packaging differentiation across Classic Orange, Pineapple, Tropical, and Strawberry."><Visual id="03-mymosa-packaging-development" alt="MyMosa packaging development board with flavor system and layout studies." caption="Packaging development visualization · not a production specification"/></Chapter>
  <Chapter number="06 / RESULTING BRAND EXPERIENCE" title="The Live Consumer Platform." copy="The finished brand world operates as an active commercial consumer platform and retail presentation.">
   <div className="closing-quiet" style={{marginTop:'30px'}}>
    <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}>
     <p style={{fontSize:'clamp(24px,3vw,42px)',letterSpacing:'-0.03em',lineHeight:'1.2'}}>Explore the complete, live My Drink Family web platform.</p>
     <a href="https://mydrinkfamily.com" target="_blank" rel="noopener noreferrer" className="primary-action" style={{fontSize:'11px',letterSpacing:'.08em',padding:'16px 26px',textTransform:'uppercase'}}>
      VISIT LIVE WEBSITE <span aria-hidden="true">↗</span>
     </a>
    </div>
   </div>
  </Chapter>
  <Next name="IKLA Maison" href="/work/ikla"/>
 </article>;
}

function Process({id,title,alt}:{id:string;title:string;alt:string}){
 const[open,setOpen]=useState(false);
 return <details className="process-disclosure" onToggle={e=>setOpen(e.currentTarget.open)}><summary>{title}<span aria-hidden="true">+</span></summary>{open&&<Visual id={id} alt={alt} caption="Design exploration · authentic study asset"/>}</details>;
}

function IKLA(){
 return <article className="case-study case-ikla">
  <Intro label="02 / SELECTED WORK" title="IKLA Maison" copy="Ultra-luxury fashion and lifestyle maison. A quiet design language shaped by architectural tailoring, fine materials, modern living, and considered detail."><Back/></Intro>
  <div className="wrap"><Visual id="01-ikla-creative-direction" alt="IKLA Maison quiet-luxury creative direction study." caption="Creative direction · authoritative quiet-luxury presentation" critical/></div>
  <nav className="chapter-navigation wrap" aria-label="IKLA chapters">{['challenge','system','built','architecture','process','experience'].map((id,i)=><a key={id} href={'#'+id}>{String(i+1).padStart(2,'0')} {id}</a>)}</nav>

  <Chapter id="challenge" number="01 / CHALLENGE" title="The Luxury Paradox." copy="Building an authentic ultra-luxury European fashion maison from first principles requires overcoming extreme market skepticism. Fast fashion and synthetic influencer brands have flooded the market; true luxury demands timeless heritage codes, structural tailoring integrity, and authentic materiality that speaks without loud logos.">
   <div className="detail-aside"><p style={{maxWidth:'60ch',fontSize:'16px',lineHeight:'1.8',color:'var(--graphite)'}}>The challenge was to engineer an enduring luxury identity that commands quiet authority across apparel, bespoke commissions, leather goods, and spatial private-client salons from day one.</p></div>
  </Chapter>

  <Chapter id="system" number="02 / SYSTEM / APPROACH" title="Restraint, Form & Monolithic Codes." copy="Dynasty Works Studio established an uncompromising aesthetic and material grammar rooted in European architectural tailoring. Color, typography, and iconography were locked into an enduring heraldic system.">
   <div className="detail-aside"><Image id="ikla-material-detail" alt="IKLA material study detail showing fabric and textured applications." sizes="(max-width:800px) 90vw, 480px"/><p>Maison Green, Imperial Black, Regal Gold, and Cream White establish the physical and visual baseline. Texture and finish lead before ornament.</p></div>
  </Chapter>

  <Chapter id="built" number="03 / WHAT DWS BUILT" title="The Complete Maison Architecture." copy="Dynasty Works Studio conceived, engineered, and delivered the full operational and creative stack for IKLA Maison.">
   <div className="wrap" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'20px',marginBlock:'24px'}}>
    <div style={{padding:'24px',background:'var(--paper)',border:'1px solid var(--line)'}}>
     <strong style={{display:'block',fontSize:'11px',letterSpacing:'.08em',color:'var(--blue)',marginBottom:'8px'}}>01 / BRAND IDENTITY</strong>
     <p style={{fontSize:'13px',lineHeight:'1.7',color:'var(--graphite)',margin:0}}>Heraldic Griffin crest, custom wordmark typography, proportion matrices, and color systems.</p>
    </div>
    <div style={{padding:'24px',background:'var(--paper)',border:'1px solid var(--line)'}}>
     <strong style={{display:'block',fontSize:'11px',letterSpacing:'.08em',color:'var(--blue)',marginBottom:'8px'}}>02 / SARTORIAL SILHOUETTES</strong>
     <p style={{fontSize:'13px',lineHeight:'1.7',color:'var(--graphite)',margin:0}}>Architectural overcoats, peaked-lapel bespoke dinner jackets, cashmere essentials, and structured footwear.</p>
    </div>
    <div style={{padding:'24px',background:'var(--paper)',border:'1px solid var(--line)'}}>
     <strong style={{display:'block',fontSize:'11px',letterSpacing:'.08em',color:'var(--blue)',marginBottom:'8px'}}>03 / LEATHER & ACCESSORIES</strong>
     <p style={{fontSize:'13px',lineHeight:'1.7',color:'var(--graphite)',margin:0}}>Rigid box-calf attaché cases with bespoke Griffin hardware, cellulose acetate eyewear, and signet horology.</p>
    </div>
    <div style={{padding:'24px',background:'var(--paper)',border:'1px solid var(--line)'}}>
     <strong style={{display:'block',fontSize:'11px',letterSpacing:'.08em',color:'var(--blue)',marginBottom:'8px'}}>04 / PACKAGING & FLAGSHIP</strong>
     <p style={{fontSize:'13px',lineHeight:'1.7',color:'var(--graphite)',margin:0}}>Rigid presentation packaging suite with grosgrain ribbons, and the private-client digital flagship platform.</p>
    </div>
   </div>
  </Chapter>

  <Chapter id="architecture" number="04 / BRAND ARCHITECTURE" title="A Cohesive Multi-Category World." copy="The Maison architecture organizes distinct product and lifestyle categories into a unified hierarchy without brand dilution.">
   <div className="detail-aside"><Image id="ikla-pattern-detail" alt="Source detail of tonal IKLA monogram and herringbone textiles." sizes="(max-width:800px) 90vw, 420px"/><p>From bespoke couture tailoring to private salon commissions, ready-to-wear knitwear, and the exclusive Griffin Edition, every category shares one disciplined voice.</p></div>
  </Chapter>

  <Chapter id="process" number="05 / SELECTED PROCESS / SYSTEM PROOF" title="Materiality, Typography & Rigor." copy="Process evidence demonstrating how initial heraldic studies, typographic scales, and material selections materialized into finished maison standards.">
   <Process id="02-ikla-identity-system" title="View identity architecture study" alt="IKLA identity architecture exploration with wordmark and heraldic applications."/>
   <Process id="04-ikla-typography-system" title="View typography hierarchy system" alt="IKLA typography study exploring hierarchy, lockups and applications."/>
   <Process id="07-ikla-material-study" title="View tactile material and finish exploration" alt="IKLA material and hardware study."/>
   <Process id="09-ikla-packaging-experience" title="View rigid packaging dieline and presentation suite" alt="IKLA packaging experience study with garment, boxes, cards and labels."/>
  </Chapter>

  <Chapter id="experience" number="06 / RESULTING BRAND EXPERIENCE" title="The Living Luxury Flagship." copy="The finished enterprise is an operating luxury brand world: responsive digital boutique, private concierge appointment portal, editorial lookbooks, and high-conversion client pathways.">
   <div className="closing-quiet" style={{marginTop:'30px'}}>
    <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}>
     <p style={{fontSize:'clamp(24px,3vw,42px)',letterSpacing:'-0.03em',lineHeight:'1.2'}}>Explore the complete, live IKLA Maison digital flagship and private-client experience.</p>
     <a href="https://iklamaison.com" target="_blank" rel="noopener noreferrer" className="primary-action" style={{fontSize:'11px',letterSpacing:'.08em',padding:'16px 26px',textTransform:'uppercase'}}>
      VISIT LIVE WEBSITE <span aria-hidden="true">↗</span>
     </a>
    </div>
   </div>
  </Chapter>

  <Next name="Mr. Cliff’s / Heritage Spirits" href="/work/mr-cliffs"/>
  <CompanyGate/>
 </article>;
}

function Cliffs(){
 return <article className="case-study case-cliffs">
  <Intro label="03 / SELECTED WORK" title={<>Mr. Cliff’s<span className="case-subtitle">Premium Bourbon</span></>} copy="Heritage spirits, architectural atmosphere and digital execution. A brand presence built around warm window light, oxblood restraint and authentic bourbon character."><Back/></Intro>
  <div className="wrap">
   <figure className="portfolio-visual cliffs-hero-visual">
    <picture className="portfolio-image">
     <source srcSet="/assets/portfolio/mr-cliffs/window-thumbnail.webp 800w, /assets/portfolio/mr-cliffs/window-hero.webp 1600w" sizes="(max-width: 800px) 100vw, 1200px"/>
     <img src="/assets/portfolio/mr-cliffs/window-hero.webp" width={1600} height={900} alt="Mr. Cliff’s Premium Bourbon bottle and glass in warm window light" loading="eager" fetchPriority="high" decoding="async"/>
    </picture>
    <figcaption>Brand visual atmosphere · Authentic project artwork</figcaption>
   </figure>
  </div>
  <Chapter number="01 / ATMOSPHERE & IDENTITY" title="Grounded in warmth and restraint." copy="Warm ivory, deep oxblood and amber establish the tone. Product artwork carries the brand’s heritage, letting typography and material lead the experience without unnecessary decorative excess."/>
  <Chapter number="02 / DIGITAL FLAGSHIP" title="A coherent digital expression." copy="The website translates the physical hospitality atmosphere into a responsive digital experience. Desktop and mobile compositions give the bourbon bottle, story and cocktail recipes dedicated space.">
   <div className="cliffs-device-grid">
    <figure className="cliffs-device-desktop">
     <img src="/assets/portfolio/mr-cliffs/desktop-home.webp" width={1440} height={1000} alt="Mr. Cliff’s desktop flagship website capture" loading="lazy" decoding="async"/>
     <figcaption>Digital flagship · Desktop interface capture</figcaption>
    </figure>
    <figure className="cliffs-device-mobile">
     <img src="/assets/portfolio/mr-cliffs/mobile-home.webp" width={390} height={1000} alt="Mr. Cliff’s mobile website capture" loading="lazy" decoding="async"/>
     <figcaption>Responsive mobile interface capture</figcaption>
    </figure>
   </div>
  </Chapter>
  <Chapter number="03 / STOREFRONT & PRESENCE" title="From physical encounter to digital arrival." copy="The window artwork establishes an inviting physical presence that carries seamlessly into the digital flagship. Authentic lighting and bottle presentation anchor the brand in hospitality.">
   <div className="cliffs-window-feature">
    <img src="/assets/portfolio/mr-cliffs/window-thumbnail.webp" width={800} height={450} alt="Mr. Cliff’s storefront window presentation detail" loading="lazy" decoding="async"/>
    <p>A hospitality atmosphere where material, lighting and physical environment reinforce brand character before a word is spoken.</p>
   </div>
  </Chapter>
  <Chapter number="04 / COMMERCIAL POSITIONING" title="Clarity without fabrication." copy="This case study exhibits the website design, responsive layouts and original production artwork. No unverified retail relationships, distribution claims or sales figures are asserted."/>

  <Chapter id="experience" number="05 / RESULTING BRAND EXPERIENCE" title="The Digital Flagship & Hospitality World." copy="An authentic digital flagship and physical presence celebrating Kentucky bourbon character, hospitality warmth, and crafted restraint.">
   <div className="closing-quiet" style={{marginTop:'30px'}}>
    <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}>
     <p style={{fontSize:'clamp(20px,2.6vw,36px)',letterSpacing:'-0.02em',lineHeight:'1.2'}}>Explore the complete, live Mr. Cliff’s digital flagship and hospitality presence.</p>
     <a href="https://mr-cliffs-aesthetic-upgrade.netlify.app" target="_blank" rel="noopener noreferrer" className="primary-action" style={{fontSize:'11px',letterSpacing:'.08em',padding:'16px 26px',textTransform:'uppercase'}}>
      VISIT LIVE WEBSITE <span aria-hidden="true">↗</span>
     </a>
    </div>
   </div>
  </Chapter>

  <Next name="MyMosa / My Drink Family" href="/work/mymosa"/>
  <CompanyGate/>
 </article>;
}

function ConceptLab(){
 return <>
  <Intro label="DYNASTY WORKS / CONCEPT LAB" title={<>What else<br/>can we build?</>} copy="Independent studies exploring how strategy, identity, product, digital and experience can become complete systems."><p className="concept-classification">Conceptual studies<br/>Not client engagements</p></Intro>
  <nav className="concept-jumps wrap" aria-label="Concept studies">{concepts.map(c=><a href={'#'+c.slug} key={c.slug}>{c.name} ↘</a>)}</nav>
  <div className="concept-sequence wrap">
   {concepts.map((c,i)=><section id={c.slug} className={'concept-entry concept-entry-'+i} key={c.slug}>
    <div className="concept-copy">
     <p className="kicker">{String(i+1).padStart(2,'0')} / CONCEPT STUDY</p>
     <h2><a href={'/concept-lab/'+c.slug}>{c.name}</a></h2>
     <p>{c.disciplines}</p>
     <p className="concept-premise">{c.premise}</p>
     <a className="text-action" href={'/concept-lab/'+c.slug}>Explore study →</a>
    </div>
    <a href={'/concept-lab/'+c.slug} aria-label={'Explore '+c.name+' concept study'}>
     <Image id={c.detail} alt={c.detailAlt} sizes="(max-width:800px) 90vw, 650px"/>
    </a>
   </section>)}
  </div>
  <CompanyGate/>
 </>;
}

function ConceptDetail({slug}:{slug:string}){
 const index=concepts.findIndex(c=>c.slug===slug),c=concepts[index],next=concepts[(index+1)%concepts.length];
 if(!c)return <NotFound/>;
 return <article className="concept-detail">
  <Intro label="DYNASTY WORKS CONCEPT STUDY" title={c.name} copy={c.premise}><a href="/concept-lab" className="text-action">← Back to Concept Lab</a></Intro>
  <div className="concept-premise-section wrap">
   <p className="concept-classification">Fictional capability demonstration<br/>Not a client engagement or operating company</p>
   <p>{c.system}</p>
   <p>{c.disciplines}</p>
  </div>
  <div className="concept-focus wrap"><Visual id={c.detail} alt={c.detailAlt} caption="Concept study / detail" critical/></div>
  {slug==='nova'?<Nova/>:<section className="concept-board wrap">
   <h2>The connected system.</h2>
   <p>Identity, application and experience explored together.</p>
   <Visual id={c.image} alt={c.name+' conceptual brand system board.'} caption="Concept study · imagery, settings and product specifications are illustrative"/>
  </section>}
  <nav className="next-project wrap" aria-label="Concept study navigation">
   <a href="/concept-lab" className="text-action">← Back to Concept Lab</a>
   <a href={'/concept-lab/'+next.slug}><span className="kicker">NEXT CONCEPT</span><strong>{next.name} ↗</strong></a>
   <a href="/work" className="text-action">Selected Work →</a>
  </nav>
  <CompanyGate/>
 </article>;
}

function Nova(){
 return <>
  <Chapter number="01 / COMPANY CREATION" title="From idea to company." copy="NOVA is a fictional wellness concept used to explore the entire creation chain. Each discipline builds on the decisions before it.">
   <ol className="creation-chain">{['Strategy','Naming','Identity','Product','Packaging','Digital','Environment','Campaign','Market'].map(s=><li key={s}>{s}</li>)}</ol>
   <Visual id="01-nova-company-creation-system" alt="NOVA conceptual company-creation system from strategy through market." caption="Concept study · all market-impact figures within the artwork are fictional, not achieved results"/>
  </Chapter>
  <Chapter number="02 / DIGITAL PRODUCT" title="One identity. Many interactions." copy="The digital product study connects UX, UI, components and user journeys across mobile, desktop and wearable concepts. It demonstrates design thinking, not a live application or validated health outcome.">
   <div className="nova-product-focus"><Visual id="nova-product-detail" alt="NOVA fictional mobile interface design detail." caption="Concept UI · displayed values are sample data"/></div>
   <Visual id="02-nova-digital-product-system" alt="NOVA conceptual digital product board with mobile, desktop and wearable design explorations." caption="Concept study · user counts, scores and outcomes in the artwork are fictional interface or vision data"/>
  </Chapter>
 </>;
}

function NotFound(){
 return <Intro label="DYNASTY WORKS STUDIO" title="Page not found." copy="Return to the studio or explore the work."><a className="text-action" href="/work">Back to Work →</a></Intro>;
}

export default function Portfolio(){
 const[reduced,setReduced]=useState(false);
 const path=window.location.pathname.replace(/\/$/,'')||'/';
 useEffect(()=>{document.title=portfolioTitles[path]||'Page not found — Dynasty Works Studio'},[path]);
 let page:ReactNode=<NotFound/>;
 if(path==='/work')page=<Work/>;
 else if(path==='/work/mymosa')page=<MyMosa/>;
 else if(path==='/work/ikla'||path==='/work/ikla-maison')page=<IKLA/>;
 else if(path==='/work/mr-cliffs')page=<Cliffs/>;
 else if(path==='/concept-lab')page=<ConceptLab/>;
 else if(concepts.some(c=>path==='/concept-lab/'+c.slug))page=<ConceptDetail slug={path.split('/').pop()!}/>;
 return <div className="portfolio-site" data-reduced={reduced}>
  <a className="skip" href="#main">Skip to content</a>
  <SiteHeader portfolio/>
  <main id="main">{page}</main>
  <SiteFooter reduced={reduced} onMotion={()=>setReduced(!reduced)}/>
 </div>;
}
