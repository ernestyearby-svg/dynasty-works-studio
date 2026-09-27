import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {candidateSlugs,studies} from './data';
import './candidate.css';
const path=location.pathname.replace(/\/$/,'')||'/';
const gateway=path==='/capabilities'||path==='/capabilities/disciplines';
const artifact=path.startsWith('/capabilities/')&&candidateSlugs.includes(path.split('/').pop()!);
const genesis=path==='/genesis';
if(gateway||artifact||genesis){
 document.documentElement.classList.add('dws-experience-enabled');document.body.classList.add('phase-candidate',gateway?'phase-gateway':'phase-artifact');
 const {default:ExperienceSystem}=await import('../experience/ExperienceSystem');
 const {installMotionTokens}=await import('../experience/tokens');installMotionTokens();
 const ui=document.createElement('div');ui.id='candidate-context';document.body.appendChild(ui);
 const {default:Shell}=await import('./Shell');
 if(genesis){document.title='Genesis — Company Creation Simulation — DWS';await import('../genesis-full/main');}
 else {const {default:Page}=gateway?await import('./Gateway'):await import('./Artifact');document.title=gateway?(path.endsWith('/disciplines')?'All Disciplines — DWS':'Capabilities — DWS'):studies[candidateSlugs.indexOf(path.split('/').pop()!)].name+' — DWS Capability Study';flushSync(()=>createRoot(document.getElementById('root')!).render(<Page/>));}
 flushSync(()=>createRoot(ui).render(<><ExperienceSystem/>{!gateway&&<Shell/>}<p className="candidate-announcement" role="status" aria-live="polite">{document.title}</p></>));
 // Keep native study return controls useful without editing approved study source.
 if(artifact||genesis)document.addEventListener('click',event=>{const a=(event.target as Element).closest?.('a');if(a?.getAttribute('href')==='/capability-lab')a.setAttribute('href','/capabilities/disciplines');});
}else if(path.startsWith('/capability-gateway-proof')){await import('../gateway-proof/main');}
else if(path.startsWith('/capability-lab')){document.getElementById('root')!.id='capability-root';await import('../capability/main');}
else if(path==='/genesis-full'){await import('../genesis-full/main');}
else{
 await import('../main');
 if(path==='/'){
  const proof=document.getElementById('proof');if(proof){const invitation=document.createElement('section');invitation.className='candidate-invitation';invitation.setAttribute('aria-labelledby','candidate-invitation-title');proof.after(invitation);createRoot(invitation).render(<><div><span>ORIGINAL DWS CAPABILITY STUDIES</span><h2 id="candidate-invitation-title">Capabilities<br/><em>in practice.</em></h2></div><div><p>Explore the disciplines behind the company.</p><a className="r51-action" href="/capabilities">Enter capabilities <span aria-hidden="true">↗</span></a><a className="candidate-genesis-link" href="/genesis">Genesis / See an idea become a company ↗</a></div></>);}
 }
}
