import {useEffect,useSyncExternalStore} from 'react';
import {DWS_MOTION,installMotionTokens} from './tokens';
import './experience-system.css';

type State='idle'|'hover'|'navigation'|'transition'|'loading'|'complete';
let state:State='idle';
let completionTimer:ReturnType<typeof setTimeout>|undefined;
const subscribers=new Set<()=>void>();
function update(next:State){if(state===next)return;state=next;subscribers.forEach(callback=>callback());}
function complete(){update('complete');clearTimeout(completionTimer);completionTimer=setTimeout(()=>update('idle'),DWS_MOTION.system);}
const subscribe=(callback:()=>void)=>{subscribers.add(callback);return()=>{subscribers.delete(callback);};};
const snapshot=()=>state;
const actionSelector='.r52-desktop-nav a,.r52-menu a,.site-head nav a,.r51-action,.r52-nav-action,.r52-path-action,.r52-talk,.p-enter,.nav-start,.r52-work-path,.r52-lab-path';
const homePaths=['/','/v5-2-review','/v5-2-review/'];
const storageKey='dws-navigation-intent';
function readIntent(){try{return JSON.parse(sessionStorage.getItem(storageKey)||'null') as {path:string;time:number}|null;}catch{return null;}}
function clearIntent(){try{sessionStorage.removeItem(storageKey);}catch{/* Storage may be disabled; navigation still works. */}}

export function CreationSignal(){
 const current=useSyncExternalStore(subscribe,snapshot,snapshot);
 return <div className="dws-site-signal" data-state={current} aria-hidden="true"><svg viewBox="0 0 300 300"><g className="dws-signal-plane"><path d="M64 58V242H248V212H94V58Z" fill="currentColor"/></g><path className="dws-signal-open" d="M94 58H248V182" fill="none" stroke="currentColor"/><path className="dws-signal-line" d="M94 58H248V212H94" fill="none" stroke="#2457ff" strokeWidth="2" pathLength="1"/><g className="dws-signal-point"><path d="M248 31V58H275" fill="none" stroke="#2457ff"/><circle cx="248" cy="58" r="5" fill="#2457ff"/></g></svg></div>;
}

export function RouteLoading(){
 useEffect(()=>{update('loading');return()=>complete();},[]);
 return <p className="dws-route-loading" role="status">Opening Dynasty Works Studio…</p>;
}

export default function ExperienceSystem(){
 useEffect(()=>{
  installMotionTokens();document.documentElement.classList.add('dws-experience-enabled');
  let docking=false;
  let scrollFrame=0;
  let loadingTimer:ReturnType<typeof setTimeout>|undefined;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set<Animation>();
  const isHome=homePaths.includes(location.pathname);
  const announce=document.getElementById('dws-route-announcement');
  const intent=readIntent();
  const normalize=(path:string)=>path.replace(/\/$/,'')||'/';
  const routeIntent=!!intent&&Date.now()-intent.time<30000&&(normalize(intent.path)===normalize(location.pathname+location.search)||intent.path==='/company-builder'&&location.hash==='#review-builder');
  const backward=(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined)?.type==='back_forward';
  let focusDone=false;
  const ready=()=>{
   const heading=document.querySelector<HTMLElement>('h1');if(!heading)return false;
   if(!focusDone){
    focusDone=true;
    if(routeIntent&&!backward){
     heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
     if(announce)announce.textContent=heading.textContent||document.title;
     complete();
    }
    clearIntent();
   }
   return true;
  };
  const observer=new MutationObserver(()=>{if(ready())observer.disconnect();});
  if(!ready())observer.observe(document.getElementById('root')!,{childList:true,subtree:true});
  const actionable=(target:EventTarget|null)=>target instanceof Element?target.closest<HTMLElement>(actionSelector):null;
  const enter=(event:Event)=>{if(actionable(event.target)&&!['navigation','transition','loading'].includes(state))update('hover');};
  const leave=(event:Event)=>{if(actionable(event.target)&&state==='hover')update('idle');};
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
   if(!link||link.target&&link.target!=='_self'||link.hasAttribute('download'))return;
   const url=new URL(link.href,location.href);
   if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol))return;
   // Leave hashes, tabs, downloads, modified clicks and native history to the browser.
   if(url.pathname===location.pathname&&url.search===location.search){
    if(actionable(event.target))complete();
    if(url.hash){const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
    return;
   }
   update('navigation');
   clearTimeout(loadingTimer);
   loadingTimer=setTimeout(()=>{if(state==='navigation'&&!document.hidden)update('loading');},DWS_MOTION.fast);
   try{sessionStorage.setItem(storageKey,JSON.stringify({path:url.pathname+url.search,time:Date.now()}));}catch{/* Optional state only. */}
  };
  const onSwap=()=>{clearTimeout(loadingTimer);update('transition');};
  const onReveal=(event:Event)=>{
   const transition=(event as Event&{viewTransition?:{finished:Promise<void>;skipTransition:()=>void}}).viewTransition;
   if(reduced.matches||document.hidden)transition?.skipTransition();
   if(transition)void transition.finished.then(()=>complete(),()=>update('idle'));
  };
  const restore=()=>{update('idle');ready();};
  const dock=()=>{
   scrollFrame=0;if(!isHome)return;
   const creation=document.getElementById('creation');if(!creation)return;
   const nowDocked=creation.getBoundingClientRect().bottom<=innerHeight*.35;
   document.documentElement.classList.toggle('dws-home-origin',!nowDocked);
   if(nowDocked===docking)return;
   docking=nowDocked;
   const source=document.querySelector<HTMLElement>('.p-shared-art');
   const target=document.querySelector<HTMLElement>('.dws-site-signal');
   if(nowDocked&&source&&target&&!reduced.matches&&!document.hidden){
    // Carry the actual assembled homepage artifact into its compact state, then release the clone.
    const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
    const clone=source.cloneNode(true) as HTMLElement;
    clone.className='dws-continuity-transfer';clone.setAttribute('aria-hidden','true');
    clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
    Object.assign(clone.style,{position:'fixed',left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,pointerEvents:'none',zIndex:'40',transformOrigin:'0 0'});
    document.body.appendChild(clone);
    const animation=clone.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`,opacity:0}],{duration:DWS_MOTION.standard,easing:DWS_MOTION.ease});
    animations.add(animation);void animation.finished.catch(()=>{}).finally(()=>{clone.remove();animations.delete(animation);});
   }
   document.documentElement.classList.toggle('dws-home-docked',nowDocked);
   if(nowDocked)complete();
  };
  const onScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(dock);};
  const stopHidden=()=>{if(document.hidden)animations.forEach(animation=>animation.finish());};
  if(isHome){document.documentElement.classList.add('dws-home-origin');window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);dock();}
  document.addEventListener('pointerover',enter);document.addEventListener('pointerout',leave);
  document.addEventListener('focusin',enter);document.addEventListener('focusout',leave);document.addEventListener('click',click);
  document.addEventListener('visibilitychange',stopHidden);
  window.addEventListener('pageswap',onSwap);window.addEventListener('pagereveal',onReveal);window.addEventListener('pageshow',restore);
  return()=>{
   observer.disconnect();clearTimeout(completionTimer);clearTimeout(loadingTimer);cancelAnimationFrame(scrollFrame);animations.forEach(animation=>animation.cancel());
   document.removeEventListener('pointerover',enter);document.removeEventListener('pointerout',leave);document.removeEventListener('focusin',enter);document.removeEventListener('focusout',leave);document.removeEventListener('click',click);document.removeEventListener('visibilitychange',stopHidden);
   window.removeEventListener('pageswap',onSwap);window.removeEventListener('pagereveal',onReveal);window.removeEventListener('pageshow',restore);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);
   document.documentElement.classList.remove('dws-home-origin','dws-home-docked');
  };
 },[]);
 return <><CreationSignal/><p id="dws-route-announcement" className="dws-sr-only" role="status" aria-live="polite" aria-atomic="true"/></>;
}
