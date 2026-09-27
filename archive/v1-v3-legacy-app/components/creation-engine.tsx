"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Link from "@/components/site-link";
import { BrandSymbol } from "@/components/brand-symbol";

const Diagnostic = lazy(() => import("@/components/company-builder").then(m => ({ default: m.CompanyBuilder })));
const disciplines = ["Strategy", "Identity", "Product", "Technology", "Market"];
const explanations = [
  "A clear relationship between the audience, the opportunity and the offer.",
  "A recognizable voice. A coherent visual language.",
  "The idea becomes something people can use.",
  "The infrastructure that connects the experience to the operation.",
  "A path from the company to the people it is built for.",
];
const systems = [...disciplines, "Operations", "Content", "Commerce", "Automation", "Distribution"];

export function Workline({ branch = false }: { branch?: boolean }) {
  return <svg className={"ce-workline" + (branch ? " ce-workline-branch" : "")} viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
    <path pathLength="1" d={branch ? "M300 0V60M60 160V60H540V160M180 160V60M300 60V160M420 160V60" : "M300 0V160"} />
  </svg>;
}
function SystemLabel({ children }: { children: React.ReactNode }) {
  return <p className="ce-label">{children}</p>;
}
export function WorkNode({ name, active, onSelect, index }: { name: string; active: boolean; onSelect: () => void; index: number }) {
  return <button type="button" role="tab" id={"ce-tab-" + index} aria-selected={active} aria-controls="ce-formation-panel" tabIndex={active ? 0 : -1} onClick={onSelect} className="ce-node">
    <span aria-hidden="true" />{name}
  </button>;
}
function FormationDrawing({ active }: { active: number }) {
  return <svg key={active} className="ce-formation-drawing" viewBox="0 0 600 360" aria-hidden="true">
    {active === 0 && <g><path d="M90 180H510M300 60V300M90 180L300 60L510 180L300 300Z" /><circle cx="90" cy="180" r="13" /><circle cx="510" cy="180" r="13" /><circle cx="300" cy="60" r="13" /><circle cx="300" cy="300" r="13" /><circle className="ce-signal-fill" cx="300" cy="180" r="8" /></g>}
    {active === 1 && <g><path d="M75 275H525M75 90H525" /><text className="ce-type-vision" x="80" y="255">Aa</text><text className="ce-type-execution" x="340" y="250">Aa</text><path className="ce-signal-stroke" d="M75 290H275" /></g>}
    {active === 2 && <g><path d="M180 105L365 65L440 125V270L255 310L180 250ZM180 105L255 165L440 125M255 165V310" /><path className="ce-signal-stroke" d="M180 250L365 210L440 270M365 65V210" /></g>}
    {active === 3 && <g><path d="M75 70H220V290H75ZM295 70H525V125H295ZM295 160H525V215H295ZM295 250H525V290H295ZM100 100H195M100 125H170M100 170H195M100 195H170M100 240H195" /><path className="ce-signal-stroke" d="M220 180H260V97H295M260 180V270H295M260 188H295" /></g>}
    {active === 4 && <g><path d="M300 180L100 80M300 180L500 80M300 180L100 280M300 180L500 280M300 180V45M300 180V315M100 80H500L500 280H100Z" />{[[100,80],[500,80],[100,280],[500,280],[300,45],[300,315]].map(([x,y])=><circle key={x+":"+y} cx={x} cy={y} r="9" />)}<circle className="ce-signal-fill" cx="300" cy="180" r="14" /></g>}
  </svg>;
}
function FormationSystem() {
  const [active, setActive] = useState(0);
  const tabs = useRef<HTMLDivElement>(null);
  return <section className="ce-scene ce-form" id="ce-form" data-ce-scene>
    <div className="ce-section-heading"><SystemLabel>02 / Structure</SystemLabel><h2>An idea<br /><em>needs structure.</em></h2></div>
    <Workline branch />
    <div ref={tabs} className="ce-nodes" role="tablist" aria-label="Explore the five disciplines" onKeyDown={e => {
      let next = active;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % disciplines.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active + disciplines.length - 1) % disciplines.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = disciplines.length - 1;
      else return;
      e.preventDefault(); setActive(next); (tabs.current?.children[next] as HTMLButtonElement)?.focus();
    }}>
      {disciplines.map((name, index) => <WorkNode key={name} name={name} index={index} active={active === index} onSelect={() => setActive(index)} />)}
    </div>
    <div className="ce-formation-panel" id="ce-formation-panel" role="tabpanel" aria-labelledby={"ce-tab-" + active} tabIndex={0}>
      <FormationDrawing active={active} />
      <div aria-live="polite"><span className="ce-panel-number" aria-hidden="true">0{active + 1}</span><h3>{disciplines[active]}</h3><p>{explanations[active]}</p></div>
    </div>
  </section>;
}
function SystemDrawing({ stage = 3 }: { stage?: number }) {
  const coords = [[120,90],[300,45],[530,45],[740,90],[800,245],[740,425],[530,475],[300,475],[100,425],[40,245]];
  return <svg className="ce-system-drawing" viewBox="0 0 900 520" aria-hidden="true">
    <g className="ce-system-connections">{coords.slice(0, stage === 0 ? 3 : stage === 1 ? 5 : 10).map(([x,y],i)=><path key={i} pathLength="1" d={`M450 260L${x} ${y}`} />)}</g>
    {stage >= 2 && <path className="ce-system-perimeter" pathLength="1" d="M120 90L300 45H530L740 90L800 245L740 425L530 475H300L100 425L40 245Z" />}
    {stage >= 3 && <path className="ce-system-cross" pathLength="1" d="M120 90L740 425M300 45L530 475M530 45L300 475M740 90L100 425" />}
    {coords.slice(0, stage === 0 ? 3 : stage === 1 ? 5 : 10).map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={stage === 0 ? 4 : 7} /><text x={x} y={y + (y < 260 ? -18 : 30)} textAnchor="middle">{systems[i]}</text></g>)}
    <circle className="ce-system-core" cx="450" cy="260" r={stage === 0 ? 12 : 54} />
    {stage > 0 && <text className="ce-system-company" x="450" y="265" textAnchor="middle">Company</text>}
  </svg>;
}
function BuildSequence() {
  return <div className="ce-sequence" id="ce-works">
    {["Define", "Build", "Launch", "Scale"].map((word, index) => <section className={"ce-build-state ce-state-" + index} key={word} data-ce-scene aria-labelledby={"ce-build-" + index}>
      <SystemLabel>The works / 0{index + 1}</SystemLabel>
      <h2 id={"ce-build-" + index}>{word}<span>.</span></h2>
      <SystemDrawing stage={index} />
      <p className="ce-build-caption">{["Find the structure.", "Make the parts work together.", "Connect the company to the market.", "Strengthen what comes next."][index]}</p>
      <Workline />
    </section>)}
  </div>;
}
function CompanyBuilderPreview() {
  const [choice, setChoice] = useState("");
  const [launched, setLaunched] = useState(false);
  const liveBuilder = useRef<HTMLDivElement>(null);
  const focusBuilder = () => {
    liveBuilder.current?.focus();
    liveBuilder.current?.scrollIntoView({ behavior: "auto", block: "start" });
  };
  return <section className="ce-scene ce-builder" id="ce-builder" data-ce-scene>
    <SystemLabel>Company Builder</SystemLabel><h2>Bring us<br /><em>the idea.</em></h2>
    <p className="ce-builder-description">A proprietary system for mapping what an idea needs to become a company.</p>
    <fieldset className="ce-preview-options"><legend>What are we building?</legend>
      {["Brand", "Product", "Company", "Experience", "Not sure yet"].map(item=><label key={item}><input type="radio" name="ce-start" value={item} checked={choice === item} onChange={()=>setChoice(item)} /><span>{item}</span></label>)}
    </fieldset>
    <p className="ce-selection-note" aria-live="polite">{choice ? `${choice}. We’ll confirm the business type and scope in the diagnostic.` : "Choose a starting point, or explore the diagnostic directly."}</p>
    <button type="button" className="ce-action" aria-expanded={launched} aria-controls="ce-live-builder" onClick={()=>{setLaunched(true); requestAnimationFrame(focusBuilder);}}>Launch Company Builder <span aria-hidden="true">↗</span></button>
    {launched && <div className="ce-live-builder" id="ce-live-builder" ref={liveBuilder} tabIndex={-1}>
      <Suspense fallback={<p role="status">Opening your diagnostic…</p>}><Diagnostic /></Suspense>
    </div>}
    <noscript><p><a href="/start-a-business/builder">Open Company Builder</a></p></noscript>
  </section>;
}
function DWSHeader() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(()=>{
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return ()=>{ document.body.style.overflow = prior; };
  }, [open]);
  return <header className="ce-header" onKeyDown={e=>{
    if (e.key === "Escape" && open) { setOpen(false); button.current?.focus(); }
    if (e.key === "Tab" && open) {
      const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a");
      const first = links?.[0]; const last = links?.[links.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); button.current?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); button.current?.focus(); }
      else if (e.shiftKey && document.activeElement === button.current) { e.preventDefault(); last?.focus(); }
    }
  }}>
    <Link href="/v3" className="ce-brand" aria-label="Dynasty Works Studio — Creation Engine"><BrandSymbol /><span>Dynasty Works <small>Studio</small></span></Link>
    <button type="button" ref={button} className="ce-menu" aria-controls="ce-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open ? "Close" : "Menu"}</button>
    <nav ref={nav} id="ce-navigation" className={open ? "ce-nav open" : "ce-nav"} aria-label="Creation Engine navigation">
      {[["Work","/work"],["How we build","#ce-form"],["Company Builder","#ce-builder"],["Studio","/studio"],["Start with an idea","#ce-builder"]].map(([label, href])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
    </nav>
  </header>;
}
export function CreationEngine() {
  const root = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(()=>{
    const scenes = root.current?.querySelectorAll<HTMLElement>("[data-ce-scene]");
    if (!scenes || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (entry.isIntersecting) { entry.target.setAttribute("data-resolved", "true"); observer.unobserve(entry.target); }
    }), { threshold: .18 });
    scenes.forEach(scene=>observer.observe(scene));
    return ()=>observer.disconnect();
  }, []);
  return <div className="creation-engine" ref={root} data-reduced={reduced}>
    <DWSHeader />
    <section className="ce-origin" aria-labelledby="ce-origin-title" data-ce-scene>
      <SystemLabel>Company creation studio</SystemLabel>
      <h1 id="ce-origin-title">What if<br /><em>we built it?</em></h1>
      <div className="ce-origin-bottom"><p>Strategy / Identity / Product / Technology / Market</p><a href="#ce-idea" aria-label="Follow the idea"><span aria-hidden="true">↓</span></a></div>
      <Workline />
    </section>
    <section className="ce-scene ce-idea" id="ce-idea" data-ce-scene>
      <div className="ce-idea-source"><span className="ce-idea-point" aria-hidden="true" /><SystemLabel>Idea / 001</SystemLabel></div>
      <h2>Everything<br /><em>starts here.</em></h2>
      <Workline />
    </section>
    <FormationSystem />
    <section className="ce-scene ce-system" id="ce-system" data-ce-scene>
      <SystemLabel>03 / System</SystemLabel><h2>A company<br /><em>is a system.</em></h2>
      <SystemDrawing />
      <p className="ce-system-fallback">{systems.join(" · ")}</p>
      <Workline />
    </section>
    <BuildSequence />
    <CompanyBuilderPreview />
    <section className="ce-scene ce-proof" data-ce-scene>
      <SystemLabel>Selected work</SystemLabel><h2>We’ve built<br /><em>across worlds.</em></h2>
      <ul>{["Consumer", "Fashion", "Product", "Hospitality", "Technology"].map(category=><li key={category}>{category}</li>)}</ul>
      <p>Selected work is available for clients and partners who want to go deeper.</p>
      <Link href="/work" className="ce-action">View selected work <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="ce-scene ce-threshold" data-ce-scene>
      <SystemLabel>DWS / Next project</SystemLabel><h2>What are<br /><em>we building?</em></h2>
      <div className="ce-threshold-links"><Link className="ce-action" href="/start-a-business/builder">Start a company <span aria-hidden="true">↗</span></Link><Link href="/contact">Talk to the studio</Link></div>
    </section>
    <footer className="ce-footer"><Link href="/v3" className="ce-brand"><BrandSymbol /><span>Dynasty Works <small>Studio</small></span></Link><p>Company creation studio<br />Ideas become assets.</p><button type="button" onClick={()=>setReduced(!reduced)} aria-pressed={reduced}>{reduced ? "Motion reduced" : "Reduce motion"}</button></footer>
  </div>;
}
