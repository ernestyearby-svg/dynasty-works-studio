import {useRef,useState} from 'react';
const existing='';
function Arrow(){return <span aria-hidden="true">↗</span>}
export function SiteHeader({portfolio=false}:{portfolio?:boolean}){const [open,setOpen]=useState(false);const menu=useRef<HTMLButtonElement>(null);return <header className="site-head" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);menu.current?.focus();}}}>
 <a className="wordmark" href={portfolio?'/':'#top'} aria-label="Dynasty Works Studio home">Dynasty Works<span>Studio</span></a>
 <button className="mobile-menu" ref={menu} aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button>
 <nav id="navigation" className={open?'navigation is-open':'navigation'} aria-label="Main navigation" onClick={()=>setOpen(false)}><a href={'/work'}>Work</a><a href={portfolio?'/capabilities':'#range'}>Capabilities</a><a href={portfolio?'/#operating':'#method'}>How we build</a><a href={existing+'/studio'}>Studio</a><a className="nav-start" href={portfolio?'/#review-builder':'#builder'}>Start a company <Arrow/></a></nav>
 </header>}

export function SiteFooter({reduced,onMotion}:{reduced:boolean;onMotion:()=>void}){return <footer className="site-foot wrap"><a className="wordmark" href="/">Dynasty Works<span>Studio</span></a><p>Company creation studio.</p><a href={'/concept-lab'}>Concept Lab <Arrow/></a><nav className="site-foot-legal" aria-label="Legal navigation" style={{display:'inline-flex',gap:'16px'}}><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav><button className="motion-setting" aria-pressed={reduced} onClick={onMotion}>{reduced?"Motion reduced":"Reduce motion"}</button><span>© {new Date().getFullYear()} Dynasty Works</span></footer>}
