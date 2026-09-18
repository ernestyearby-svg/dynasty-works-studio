import {useEffect, useRef, useState} from 'react';
import './experience-lab.css';

const states=['Idle','Hover','Navigation','Transition','Loading','Complete'] as const;
type State=typeof states[number];
const motion={fast:160,standard:360,system:720,ease:'cubic-bezier(.22,.68,.12,1)'};
const notes:Record<State,string>={Idle:'One open plane. Ready for what comes next.',Hover:'The open edge extends toward an available action.',Navigation:'The signal follows a deliberate change of context.',Transition:'The plane compresses; its structure stays intact.',Loading:'A finite assembly study. No request is being made.',Complete:'The signal reaches the corner. The system resolves.'};
const navigation=['Work','How we build','Company Builder','Capabilities','Studio'];

function Primitive({state,compact=false}:{state:State;compact?:boolean}){
 return <svg className={'el-primitive'+(compact?' is-compact':'')} data-state={state.toLowerCase()} viewBox="0 0 300 300" aria-hidden="true">
  <g className="el-plane"><path d="M64 58V242H248V212H94V58Z" fill="currentColor"/></g>
  <path className="el-open" d="M94 58H248V182" fill="none" stroke="currentColor" strokeWidth="1"/>
  <path className="el-extension" d="M94 58H248V212H94" fill="none" stroke="#2457ff" strokeWidth="2" pathLength="1"/>
  <g className="el-signal"><path d="M248 31V58H275" fill="none" stroke="#2457ff" strokeWidth="1"/><circle cx="248" cy="58" r="4" fill="#2457ff"/></g>
 </svg>;
}

export default function ExperienceLab(){
 const [state,setState]=useState<State>('Idle');
 const [page,setPage]=useState<'A'|'B'>('A');
 const [busy,setBusy]=useState(false);
 const [selected,setSelected]=useState('Work');
 const [reduced,setReduced]=useState(false);
 const [inView,setInView]=useState(true);
 const stage=useRef<HTMLDivElement>(null);
 const controller=useRef<AbortController|null>(null);
 const stateSection=useRef<HTMLElement>(null);
 const activity=useRef<HTMLElement>(null);
 useEffect(()=>{
  document.title='DWS / Experience Lab — V5.4';
  const query=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting));
  if(stateSection.current)observer.observe(stateSection.current);
  const finishHidden=()=>{stage.current?.getAnimations().forEach(animation=>animation.finish());};
  const visibilityObserver=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)finishHidden();});
  if(stage.current)visibilityObserver.observe(stage.current);
  const visibility=()=>{if(document.hidden)finishHidden();};document.addEventListener('visibilitychange',visibility);
  return()=>{query.removeEventListener('change',update);observer.disconnect();visibilityObserver.disconnect();document.removeEventListener('visibilitychange',visibility);controller.current?.abort();};
 },[]);
 async function transfer(){
  if(busy||!stage.current)return;
  const element=stage.current;setBusy(true);setState('Transition');
  const abort=new AbortController();controller.current=abort;
  const animations:Animation[]=[];
  const animate=async(keyframes:Keyframe[],duration:number)=>{
   const bounds=element.getBoundingClientRect();
   if(reduced||document.hidden||bounds.bottom<0||bounds.top>innerHeight)return;
   const animation=element.animate(keyframes,{duration,easing:motion.ease,fill:'forwards'});
   animations.push(animation);
   const cancel=()=>animation.cancel();abort.signal.addEventListener('abort',cancel,{once:true});
   try{await animation.finished;}finally{abort.signal.removeEventListener('abort',cancel);}
  };
  try{
   await animate([{transform:'scale(1)',clipPath:'polygon(0 0,100% 0,100% 70%,100% 100%,0 100%,0 0)'},{transform:'scale(.10)',clipPath:'polygon(0 0,16% 0,16% 80%,100% 80%,100% 100%,0 100%)'}],motion.system/2);
   if(abort.signal.aborted)return;
   setPage(current=>current==='A'?'B':'A');setState('Navigation');
   await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
   await animate([{transform:'scale(.10)',clipPath:'polygon(0 0,16% 0,16% 80%,100% 80%,100% 100%,0 100%)'},{transform:'scale(1)',clipPath:'polygon(0 0,100% 0,100% 70%,100% 100%,0 100%,0 0)'}],motion.system/2);
   setState('Complete');
  }catch{ /* Component unmount cancels its own in-flight animation. */ }
  finally{animations.forEach(animation=>animation.cancel());if(!abort.signal.aborted)setBusy(false);}
 }
 const respond=()=>{if(!busy)setState('Hover');};
 const settle=()=>{if(!busy)setState('Idle');};
 return <main className="experience-lab" ref={activity}>
  <a className="el-skip" href="#lab-01">Skip to experiments</a>
  <header className="el-header"><a href="/" className="el-wordmark">DYNASTY WORKS<span>STUDIO</span></a><span>V5.4 / EXPERIENCE LAB</span><div className="el-persistent"><Primitive state={state} compact/><span aria-live="polite">{state}</span></div></header>
  <section className="el-intro" id="lab-01" ref={stateSection}>
   <div className="el-section-meta"><span>01 / PERSISTENT PRIMITIVE</span><span>Interaction studies · Not applied site-wide</span></div>
   <h1>One idea.<br/><em>Always present.</em></h1>
   <div className="el-study" data-visible={inView}>
    <div className="el-large-primitive"><Primitive key={state==='Loading'?'loading':'rest'} state={state}/><span className="el-object-note">One plane / one open edge / one signal</span></div>
    <div className="el-state-control"><p>Six states.<br/>The same beginning.</p><div className="el-state-list" role="group" aria-label="Primitive state">{states.map((s,i)=><button key={s} aria-pressed={state===s} onClick={()=>{if(!busy)setState(s);}}><span>0{i+1}</span>{s}<i aria-hidden="true">↗</i></button>)}</div><p className="el-state-note" aria-live="polite">{notes[state]}</p></div>
   </div>
  </section>
  <section className="el-transfer" id="lab-02">
   <div className="el-section-meta"><span>02 / ROUTE TRANSITION</span><span>{reduced?'Reduced motion / immediate context change':'720 ms / reduce → reorganize → resolve'}</span></div>
   <div className="el-transfer-heading"><h2>Same system.<br/><em>New context.</em></h2><p>Two fictional pages.<br/>One continuous architecture.</p></div>
   <div className="el-route-stage" aria-busy={busy}>
    <div className="el-route-axis" aria-hidden="true"><Primitive state={busy?'Transition':'Idle'}/></div>
    <div ref={stage} className={'el-page is-'+page.toLowerCase()}>
     <div className="el-page-folio">DWS / {page==='A'?'DIRECTION':'EXPRESSION'}<span>PAGE {page}</span></div>
     <div className="el-page-title">{page==='A'?<>Give it<br/><em>direction.</em></>:<>Make it<br/><em>recognizable.</em></>}</div>
     <svg className="el-page-architecture" viewBox="0 0 500 340" aria-hidden="true">{page==='A'?<><path d="M70 50V280H430M100 50H430V250M100 165H430M265 50V280" fill="none" stroke="currentColor"/><path d="M70 50V280H300V250H100V50Z" fill="currentColor"/><path d="M265 50V165H430" fill="none" stroke="#2457ff" strokeWidth="3"/><circle cx="430" cy="165" r="5" fill="#2457ff"/></>:<><path d="M60 50V280H290V250H90V50Z" fill="currentColor"/><path d="M90 50H290V220" fill="none" stroke="currentColor"/><text x="235" y="195">Aa</text><path d="M340 250H430" stroke="#2457ff" strokeWidth="30"/><circle cx="290" cy="50" r="5" fill="#2457ff"/></>}</svg>
     <div className="el-page-foot"><span>{page==='A'?'Purpose / relationship / structure':'Form / voice / recognition'}</span><span>Fictional DWS study</span></div>
    </div>
   </div>
   <div className="el-route-controls"><span role="status">{busy?'Architecture in transition':`Page ${page} · Ready`}</span><button className="el-action" onClick={transfer} aria-disabled={busy}>Go to page {page==='A'?'B':'A'}<span aria-hidden="true">→</span></button></div>
  </section>
  <section className="el-controls" id="lab-03">
   <div className="el-section-meta"><span>03 / NAVIGATION + ACTION</span><span>Hover / focus / touch</span></div>
   <h2>Intent.<br/><em>Then response.</em></h2>
   <div className="el-nav-study"><nav aria-label="Experimental navigation">{navigation.map((name,i)=><button key={name} aria-pressed={selected===name} onPointerEnter={respond} onPointerLeave={settle} onFocus={respond} onBlur={settle} onClick={()=>{setSelected(name);setState('Navigation');}}><small>0{i+1}</small><span>{name}</span><i aria-hidden="true">↗</i></button>)}</nav><div className="el-action-study"><p>One clear next move.</p><button className="el-action" onPointerEnter={respond} onPointerLeave={settle} onFocus={respond} onBlur={settle} onClick={()=>{setSelected('Start a company');setState('Complete');}}>Start a company<span aria-hidden="true">→</span></button><p role="status" className="el-selection">{selected==='Start a company'?'Action acknowledged':selected+' selected'}<br/><span>Interaction preview. No route or form is opened.</span></p></div></div>
   <footer className="el-footer"><span>DYNASTY WORKS / EXPERIENCE LAB</span><span>Three experiments. Awaiting founder approval.</span></footer>
  </section>
 </main>;
}
