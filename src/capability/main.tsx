import {StrictMode,lazy,Suspense,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './capability.css';
const Product=lazy(()=>import('./ProductStudy'));
const Web=lazy(()=>import('./WebStudy'));
const OS=lazy(()=>import('./OperatingStudy'));
const Signal=lazy(()=>import('./Signal'));
const FormEngine=lazy(()=>import('./FormEngine'));
const Packaging=lazy(()=>import('./Packaging'));
const studies=[['01','3d-product','OBJECT ZERO','A modular radiant object.','FORM / MATERIAL / ASSEMBLY'],['02','web','THE LIVING CANVAS','Enter an unfolding architecture.','EDITORIAL / RESPONSIVE / INTERACTION'],['03','os','SOVEREIGN OS','Now. System. Horizon.','INFORMATION / WORKFLOW / CONTROL'],['04','mobile','SIGNAL','Attention, reorganized.','INTENT / TIME / CONTEXT'],['05','identity','FORM','Recognition, engineered.','SEED / MARK / APPLICATION'],['06','packaging','SURFACE / STRUCTURE','A sheet becomes a system.','CUT / SCORE / FOLD']];
function App(){const slug=location.pathname.replace(/\/$/,'').split('/').pop();useEffect(()=>{document.title='DWS Capability Study — '+(studies.find(s=>s[1]===slug)?.[2]||'Founder index')},[slug]);return <div className="cl-root"><a className="cl-skip" href="#study">Skip to study</a><header className="cl-header"><a href="/capability-lab" aria-label="DWS capability lab index"><b className="cl-mark" aria-hidden="true"/><span>DYNASTY WORKS <small>CAPABILITY STUDIES</small></span></a><span className="cl-disclosure">Original demonstration <i/> No client engagement</span><a className="cl-index-link" href="/capability-lab">Index ↗</a></header><Suspense fallback={<p className="cl-loading" role="status">Opening study…</p>}>{slug==='3d-product'?<Product/>:slug==='web'?<Web/>:slug==='os'?<OS/>:slug==='mobile'?<Signal/>:slug==='identity'?<FormEngine/>:slug==='packaging'?<Packaging/>:slug==='capability-lab'?<main id="study" className="cl-index"><p className="cl-eyebrow">FOUNDER REVIEW / PHASE II</p><h1>Six disciplines.<br/><em>Native by design.</em></h1><p className="cl-index-note">Six native studies. Six different disciplines.<br/>Each is an interface you can use.</p><nav aria-label="Capability studies">{studies.map(([n,path,name,line,meta])=><a key={n} href={'/capability-lab/'+path}><span>{n}</span><div><h2>{name}</h2><p>{line}</p></div><small>{meta}</small><b aria-hidden="true">↗</b></a>)}</nav><footer>Independent DWS capability demonstrations. Sample data and conceptual specifications. No production connection.</footer></main>:<main id="study" className="cl-index"><h1>Study not found.</h1><a href="/capability-lab">Return to the index →</a></main>}</Suspense></div>};
createRoot(document.getElementById('capability-root')!).render(<StrictMode><App/></StrictMode>);


