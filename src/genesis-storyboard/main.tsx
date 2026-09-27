import {useReducer,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {installMotionTokens} from '../experience/tokens';
import {initial,ledger,reducer,phases} from '../genesis-proof/model';
import {Instrument} from './Instrument';
import {stage,stops} from './geometry';
import './storyboard.css';
installMotionTokens();
const propositions=[['Every company.','Begins as a signal.'],['An idea.','Takes direction.'],['Identity.','Becomes matter.'],['One company.','One continuous instrument.'],['Everything.','Came from the idea.']];
function Storyboard(){
 const [progress,setProgress]=useState(0),[force,setForce]=useState(0),[state,dispatch]=useReducer(reducer,undefined,initial);
 const which=stage(progress),step=stops[which],l=ledger(state),atCompany=progress>=68&&progress<=78;
 const returning=which===4,returnLabel=progress<84?'Consequence retracts':progress<89?'Operation quiets':progress<93?'Material unfolds':progress<96?'The original L':'The original point';
 return <main className={`genesis-story stage-${which}`} data-progress={progress} data-phase={state.phase}>
 <header><a href="#story">DWS <span>GENESIS / NATIVE STORYBOARD</span></a><span>B / CONTINUOUS INSTRUMENT</span></header>
 <section className="story" id="story" aria-label="Five-state Genesis storyboard">
  <div className="chapter"><span>{step.id} / {step.label.toUpperCase()}</span><span>ONE ANCESTOR</span></div>
  <h1>{propositions[which][0]}<br/><em>{propositions[which][1]}</em></h1>
  <Instrument progress={progress} state={state} force={force} mobile={false}/>
  <Instrument progress={progress} state={state} force={force} mobile/>
  <div className="state-note" aria-live="polite" aria-atomic="true"><b>{which===0?'POTENTIAL':which===1?'ORIENTATION':which===2?'PHYSICAL CONSEQUENCE':which===3?phases[state.phase].toUpperCase():returnLabel.toUpperCase()}</b><p>{which===0?'One point. The latent elbow.':which===1?'Purpose, audience and opportunity give the same origin direction.':which===2?'Surface gains thickness. An edge begins to carry consequence.':which===3?(state.phase===0?(state.held?'Held by you. Nothing crosses.':'One prepared request. Nothing crosses without you.'):state.phase<3?'The human decision is recorded. Validation precedes release.':state.phase<6?'One authorized circulation cycle. Capacity remains committed.':'Carrier recovered. The next proposal inherits its return.'):'Construction subtracts. Recorded decisions remain intact.'}</p></div>
  {which===1&&<div className="forces" role="group" aria-label="Directional influences">{['Purpose','Audience','Opportunity'].map((name,i)=><button key={name} aria-pressed={force===i} onClick={()=>setForce(i)}>{name}<span>{['Reuse','Temporary protection','Repeated circulation'][i]}</span></button>)}</div>}
  {which===2&&<div className="form-note"><span>SURFACE / THICKNESS / CHANNEL</span><p>The first capacity to carry.</p></div>}
  {which===3&&<div className="authority"><span>REQUEST 001 / HUMAN AUTHORITY</span><p>{state.phase===0?'The fold is interrupted. Only you can join it.':state.phase<7?'One request authorized. No authority transfers to the next.':'Recovered carrier → next preparation. New authority required.'}</p><div><button className="authorize" disabled={!atCompany||state.authorized} onClick={()=>dispatch({type:'authorize'})}>{state.authorized?'AUTHORIZED':'AUTHORIZE CYCLE'} <i aria-hidden="true">↗</i></button><button disabled={!atCompany||state.authorized} onClick={()=>dispatch({type:'hold'})}>{state.held?'HELD':'HOLD'}</button><button disabled={!atCompany||!state.authorized||state.phase>=7} onClick={()=>dispatch({type:'next'})}>Advance cycle →</button></div></div>}
  {which===3&&<div className="capacity"><span>{state.phase>=6?'RECOVERED CAPACITY':'AVAILABLE CAPACITY'}</span><b>{l.available}<small> / 300</small></b><p>{state.phase<3?'1 prepared reservation':state.phase<6?'1 committed to service':'Returned. Available again.'}</p></div>}
  {returning&&<div className="return-note"><span>ORIGIN / 64 : 242</span><p>{progress>=99?'The same point. Begin again.':progress>=93?'The L remains. Continue toward the point.':'Acquired capabilities return to their source.'}</p></div>}
 </section>
 <section className="story-control" aria-label="Founder progression control"><div className="control-meta"><label htmlFor="genesis-progress">CONSTRUCTION</label><output htmlFor="genesis-progress">{progress.toFixed(0)} / 100</output></div><input id="genesis-progress" type="range" min="0" max="100" step=".1" value={progress} onChange={e=>setProgress(Number(e.target.value))} aria-valuetext={`${step.label}, ${progress.toFixed(0)} percent. Transaction ${phases[state.phase]}.`}/><nav aria-label="Storyboard states">{stops.map(item=><button key={item.id} aria-current={step.id===item.id?'step':undefined} onClick={()=>setProgress(item.p)}><span>{item.id}</span> {item.label}</button>)}<button onClick={()=>setProgress(100)} aria-label="Return to original point">●</button></nav></section>
 <section className={`story-evidence ${which===3?'show-evidence':''}`} aria-label="Recorded transaction" data-testid="ledger"><div><span>RECEIPT</span><strong>${l.receipts*40}</strong></div><div><span>CONTRIBUTION</span><strong>${l.contribution}</strong></div><p data-testid="counts">Reservations {l.reservations} / Releases {l.releases} / Receipts {l.receipts}<small>Inspection never undoes the recorded decision.</small></p></section>
 <footer><span>FICTIONAL OPERATING SCENARIO / FOUNDER PROOF</span><div><button onClick={()=>setProgress(0)}>Return to Signal ↗</button><button onClick={()=>{dispatch({type:'reset'});}}>Reset transaction</button><details><summary>Scenario & decision record</summary><p>One reusable protective carrier. Fee $40; variable fulfillment / inspection cost $18; contribution $22. Fixed monthly cost $4,400. Operating threshold 200 completed cycles/month. Capacity ceiling 300 cycles/month. Initial setup/carrier pool $10,000; illustrative funding $18,000.</p><p>Operating funds $8,000. Cash ${l.cash}; available cash ${l.availableCash}. Capacity is modeled in cycle slots. Physical travel is expressive, not a chart of all 300 slots.</p><ol>{state.history.map((entry,i)=><li key={i}>{entry}</li>)}</ol><p>Returning to Signal retains the decision. Reset transaction deliberately creates a fresh local demonstration.</p></details></div></footer>
 </main>;
}
createRoot(document.getElementById('root')!).render(<Storyboard/>);
