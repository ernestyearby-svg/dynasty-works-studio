import React,{useEffect,useReducer,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {installMotionTokens,DWS_MOTION} from '../experience/tokens';
import {World} from './World';
import {contract,initial,ledger,phases,reducer} from './model';
import './proof.css';
installMotionTokens();
const names={a:'Operating section',b:'Continuous instrument'};
function Study({variant}:{variant:'a'|'b'}){
 const [s,dispatch]=useReducer(reducer,undefined,initial),[inspection,setInspection]=useState(100),[playing,setPlaying]=useState(false);
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(query.matches);setPlaying(false);};query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!playing||inspection<100||reduced||s.phase===0||s.phase>=7)return;const timer=setTimeout(()=>dispatch({type:'next'}),DWS_MOTION.system*2);return()=>clearTimeout(timer);},[playing,s.phase,inspection,reduced]);
 const l=ledger(s),isInspect=inspection<100;
 const title=s.phase===0?<>Prepared.<br/><em>Not permitted.</em></>:s.phase<3?<>Authority.<br/><em>Then action.</em></>:s.phase<6?<>One promise.<br/><em>In motion.</em></>:<>One company.<br/><em>Ready again.</em></>;
 const advance=()=>{setPlaying(false);dispatch({type:'next'});};
 return <main className={`proof alternative-${variant}`} data-phase={s.phase} data-inspection={inspection}>
  <header><a href="/genesis-proof/" className="studio">DWS<span>GENESIS / COMPANY PROOF</span></a><nav aria-label="Alternative"><a href="/genesis-proof/a" aria-current={variant==='a'?'page':undefined}>A</a><a href="/genesis-proof/b" aria-current={variant==='b'?'page':undefined}>B</a></nav></header>
  <div className="title-row"><p className="study-label">{variant.toUpperCase()} — {names[variant]}</p><span>08 / COMPANY</span></div>
  <section className="company-canvas" aria-label={`${names[variant]} operating company`}>
   <h1>{title}</h1>
   <div className="current-state" aria-live="polite" aria-atomic="true"><b>{isInspect?'REVERSE INSPECTION':phases[s.phase].toUpperCase()}</b><span>{isInspect?'Construction retracts. The decision record stays.':s.phase===0?(s.held?'Release held by you.':'Resources supported. Your authority is withheld.'):s.phase<3?'Request 001 only. Validation before release.':s.phase<6?'One cycle executes. Capacity remains committed.':'Carrier returned. Feedback informs the next proposal.'}</span></div>
   <World variant={variant} state={s} inspection={inspection}/>
   <div className="authority"><div className="authority-note"><span>HUMAN AUTHORITY</span><p>{s.phase===0?'Release one supported cycle.':s.phase<7?'Request 001 / authorization recorded.':'Next cycle requires new authorization.'}</p></div><div className="authority-actions"><button className="authorize" disabled={s.phase!==0||isInspect} onClick={()=>dispatch({type:'authorize'})}>{s.authorized?'AUTHORIZED':'AUTHORIZE CYCLE'}<span aria-hidden="true">↗</span></button><button className="hold" disabled={s.phase!==0||isInspect} onClick={()=>dispatch({type:'hold'})}>{s.held?'HELD':'HOLD'}</button></div></div>
  </section>
  <section className="consequence-rail" aria-label="Transaction evidence">
   <div><span>RECEIPT</span><strong>${s.phase>=5?40:0}<small> / $40</small></strong></div><div><span>CONTRIBUTION</span><strong>${l.contribution}<small> / $22</small></strong></div><div className="transaction-description"><span>{s.phase>=7?'FEEDBACK → NEXT PREPARATION':'ONE SIGNAL. ONE CONSTRUCTION.'}</span><p>{s.phase>=7?'Recovered carrier assigned to the next proposal. Nothing else releases.':'A reusable protective carrier, supplied per use and recovered for reuse.'}</p></div>
  </section>
  <section className="review-controls" aria-label="Review controls"><div className="inspection-control"><label htmlFor="inspection">CONSTRUCTION INSPECTION <output>{inspection}%</output></label><input id="inspection" type="range" min="0" max="100" value={inspection} aria-valuetext={`${inspection}% construction. Recorded transaction ${phases[s.phase]}.`} onChange={e=>{setInspection(Number(e.target.value));setPlaying(false);}}/><span>ANCESTOR <i>Decision record preserved</i> COMPANY</span></div><div className="cycle-controls"><button disabled={!s.authorized||s.phase>=7||isInspect} onClick={advance}>Advance cycle →</button><button disabled={!s.authorized||s.phase>=7||isInspect||reduced} onClick={()=>setPlaying(!playing)}>{playing&&s.phase<7?'Pause cycle':'Run finite cycle'}</button><button onClick={()=>{setPlaying(false);setInspection(100);dispatch({type:'reset'});}}>Reset demonstration</button></div></section>
  <footer><span>FICTIONAL OPERATING SCENARIO / LOCAL DESIGN PROOF</span><details><summary>Model & decision record</summary><div className="records"><dl>{Object.entries(contract).map(([key,value])=><React.Fragment key={key}><dt>{key}</dt><dd>{value}</dd></React.Fragment>)}</dl><div><p>Operating funds: $18,000 funding − $10,000 setup = $8,000. One cycle reserves $18 and one capacity slot. Capacity is modeled in cycle slots; it is not a claim about physical fleet size.</p><p>Cash: ${l.cash} · Available cash: ${l.availableCash} · Completed: {l.completed}</p><p data-testid="counts">Reservations: {l.reservations} · Releases: {l.releases} · Receipts: {l.receipts}</p><ol>{s.history.map((entry,i)=><li key={i}>{entry}</li>)}</ol><p>Scrub inspection does not undo authorization or replay transactions. Reset deliberately clears this local demonstration.</p></div></div></details></footer>
 </main>;
}
function Index(){return <main className="comparison"><a href="/genesis-proof/a">A — OPERATING SECTION<span aria-hidden="true">↗</span></a><a href="/genesis-proof/b">B — CONTINUOUS INSTRUMENT<span aria-hidden="true">↗</span></a></main>;}
const part=location.pathname.split('/').filter(Boolean).at(-1);
createRoot(document.getElementById('root')!).render(part==='a'||part==='b'?<Study variant={part}/>:<Index/>);
