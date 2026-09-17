import {useEffect,useRef,useState} from 'react';
import './prototype.css';
const stages=['Idea','Strategy','Identity','Product','Digital','Experience','Market','Company'];
const statements=['One possibility.','Give it direction.','Make it recognizable.','Give it a form.','Make it work.','Bring it into the world.','Connect it to people.','Everything. Working together.'];
const descriptions=['An unformed idea. Open to what comes next.','Audience, purpose and position become a deliberate relationship.','A mark, a voice and a coherent visual language emerge.','Decisions become dimensions, surfaces and something you can hold.','The same identity becomes a usable digital experience.','Product, space and interaction meet at human scale.','One system reaches many places without losing its identity.','Strategy, identity, product, digital, experience and market — connected.'];
function Artifact({phase,assembly=0}:{phase:number;assembly?:number}){
 const visible=(n:number)=>phase===n||phase===7;
 return <svg className={'p-artifact '+(phase===7?'is-company':'')} viewBox="0 0 900 600" role="img" aria-label={phase===0?'An open plane, one line and a cobalt point: the first piece of a system.':descriptions[phase]}>
 <defs><linearGradient id="product-side"><stop stopColor="#d6d4cd"/><stop offset="1" stopColor="#aba9a3"/></linearGradient></defs>
 <g className="p-system-traces" data-on={phase===7} fill="none" stroke="#95958e" strokeWidth="1">
 <path d="M220 170H450V285M710 150H580V285M220 440H395V335M685 420H545V335M450 335V535"/><path d="M120 285H780" strokeDasharray="3 7"/><circle cx="450" cy="310" r="93"/>
 </g>
 <g className="p-core" style={{opacity:[2,3,4,5].includes(phase)?0:1,transform:phase===0?'translate(0px,0px)':phase===7?'translate(270px,175px) scale(.40)':'translate(305px,210px) scale(.28)'}}>
 <path d="M330 185V405H550V370H365V185Z" fill="#17191c" style={{transform:phase===0?'translate('+(-assembly*28)+'px,'+(assembly*14)+'px)':'none'}}/>
 <path d="M365 185H550V335" fill="none" stroke="#8f9289" strokeWidth="1.3" style={{transform:phase===0?'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)':'none'}}/>
 <path d="M365 370L550 185" stroke="#a9aca3" strokeWidth="1" strokeDasharray="3 6" opacity={phase===0?assembly:0}/>
 <path d="M550 145V185H590" fill="none" stroke="#2457ff" strokeWidth="2" style={{transform:phase===0?'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)':'none'}}/>
 <circle cx="550" cy="185" r="6" fill="#2457ff" style={{transform:phase===0?'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)':'none'}}/>
 </g>
 <>
 <g className="p-evidence p-strategy" data-on={visible(1)} style={{transform:phase===7?'translate(20px,45px) scale(.47)':'translate(0px,0px)'}} fill="none" stroke="#202226">
 <path d="M140 340H350V145H660V430H350V340M140 340V190H350M350 280H660" strokeWidth="1.2"/>
 <path d="M350 145L660 280L350 430Z" stroke="#2457ff" strokeWidth="2"/>
 <circle cx="140" cy="340" r="7" fill="#2457ff" stroke="none"/><circle cx="350" cy="145" r="6" fill="#f3f1eb"/><circle cx="660" cy="280" r="6" fill="#f3f1eb"/><circle cx="350" cy="430" r="6" fill="#f3f1eb"/>
 <g fill="#17191c" stroke="none" className="p-svg-label"><text x="115" y="378">PURPOSE</text><text x="350" y="120">AUDIENCE</text><text x="680" y="284">POSITION</text><text x="350" y="467">OPPORTUNITY</text></g>
 </g>
 <g className="p-evidence p-identity" data-on={visible(2)} style={{transform:phase===7?'translate(550px,25px) scale(.38)':'translate(0px,0px)'}}>
 <g transform="translate(180 200)"><path d="M0 140V0H70L140 70V140H70V70H0Z" fill="#17191c"/><path d="M0 70H70V140H0Z" fill="#2457ff"/></g>
 <text x="410" y="280" className="p-type-specimen">Aa</text><path d="M400 315H700" stroke="#8c8d89"/>
 <rect x="410" y="350" width="88" height="48" fill="#17191c"/><rect x="508" y="350" width="88" height="48" fill="#2457ff"/><rect x="606" y="350" width="88" height="48" fill="#d2d0c8"/>
 <text x="180" y="455" className="p-svg-label">FORM / VOICE / RECOGNITION</text>
 </g>
 <g className="p-evidence p-product" data-on={visible(3)} style={{transform:phase===7?'translate(10px,280px) scale(.45)':'translate(0px,0px)'}}>
 <path d="M250 190L400 132L540 195L385 260Z" fill="#f8f8f4" stroke="#a7a8a1"/>
 <path d="M250 190L385 260V455L250 380Z" fill="#deded7" stroke="#a7a8a1"/>
 <path d="M385 260L540 195V382L385 455Z" fill="url(#product-side)" stroke="#a7a8a1"/>
 <path d="M385 295L540 230V245L385 310Z" fill="#2457ff"/><path d="M300 245L325 258V288L300 275Z" fill="#17191c"/>
 <path d="M225 185V389M210 185H238M210 389H238M390 485L553 410M390 475V497M553 399V421" stroke="#9c9d97" fill="none"/>
 <text x="170" y="300" className="p-svg-label" transform="rotate(-90 170 300)">PROPORTION</text><text x="420" y="530" className="p-svg-label">SURFACE / VOLUME</text>
 </g>
 <g className="p-evidence p-digital" data-on={visible(4)} style={{transform:phase===7?'translate(550px,275px) scale(.40)':'translate(0px,0px)'}}>
 <path d="M165 135H735V460H165Z" fill="#fcfcfa" stroke="#7e807c"/>
 <path d="M165 177H735M530 177V460" stroke="#c5c5bf"/>
 <path d="M187 150H203V165H187ZM680 155H713" fill="#17191c" stroke="#17191c"/>
 <text x="198" y="252" className="p-interface-heading">A new</text><text x="198" y="303" className="p-interface-heading">perspective.</text>
 <path d="M200 343H398M200 355H367" stroke="#92948d"/><rect x="200" y="392" width="139" height="34" fill="#2457ff"/><path d="M305 409H321M316 404L321 409L316 414" fill="none" stroke="white"/>
 <path d="M572 239V382H699V360H594V239Z" fill="#17191c"/><path d="M594 239H699V337" fill="none" stroke="#92968c"/><circle cx="699" cy="239" r="5" fill="#2457ff"/>
 <text x="165" y="499" className="p-svg-label">IDENTITY BECOMES INTERACTION</text>
 </g>
 <g className="p-evidence p-experience" data-on={visible(5)} style={{transform:phase===7?'translate(305px,365px) scale(.33)':'translate(0px,0px)'}}>
 <path d="M180 360L445 220L745 358L469 505Z" fill="#dfdfd7" stroke="#969891"/>
 <path d="M180 360V178L445 50V220Z" fill="#e8e8e0" stroke="#969891"/><path d="M445 50L745 194V358L445 220Z" fill="#f9f9f5" stroke="#969891"/>
 <path d="M293 302V196L308 188V278L382 241V256Z" fill="#17191c"/>
 <path d="M509 340V242L575 272V372Z" fill="#b6b8af"/><path d="M509 242L566 216L631 246L575 272Z" fill="#fcfcfa"/><path d="M575 272L631 246V344L575 372Z" fill="#d1d2ca"/>
 <path d="M445 220L745 358" stroke="#2457ff" strokeWidth="4"/>
 <circle cx="426" cy="328" r="9" fill="#26282a"/><path d="M426 340V392M415 356H437M426 392L415 416M426 392L437 416" stroke="#26282a" strokeWidth="3"/>
 <text x="175" y="550" className="p-svg-label">OBJECT / SPACE / HUMAN SCALE</text>
 </g>
 <g className="p-evidence p-market" data-on={visible(6)} style={{transform:phase===7?'translate(275px,-35px) scale(.38)':'translate(0px,0px)'}}>
 <path d="M450 310V120M450 310H200M450 310H700M450 310V480M200 310V170M700 310V445" fill="none" stroke="#838780"/>
 <g fill="#17191c"><path d="M410 60H490V160H410Z"/><path d="M120 125H270V225H120Z"/><path d="M640 255H765V340H640Z"/><path d="M390 430H510V490H390Z"/><path d="M655 395H742V490H655Z"/></g>
 <g fill="#f3f1eb"><path d="M425 80H445V140H425Z"/><path d="M140 145H250V153H140ZM140 170H205V210H140Z"/><path d="M657 270H744V279H657ZM657 290H700V320H657Z"/></g>
 <path d="M402 450H500M670 415H727" stroke="#2457ff" strokeWidth="7"/><text x="315" y="553" className="p-svg-label">ONE IDENTITY. MANY TOUCHPOINTS.</text>
 </g>
 <g className="p-evidence p-resolution-signature" data-on={phase===7}><text x="450" y="576" textAnchor="middle" className="p-company-signature">One company.</text><circle cx="450" cy="310" r="5" fill="#2457ff"/></g>
 </>
 <g className="p-mobile-resolution" data-on={phase===7}>
 <path d="M160 90V485H735" fill="none" stroke="#17191c" strokeWidth="16"/>
 <path d="M185 90H735V460" fill="none" stroke="#9b9f94"/>
 <circle cx="735" cy="90" r="9" fill="#2457ff"/>
 {['Strategy','Identity','Product','Digital','Experience','Market'].map((name,i)=><g key={name}><path d={'M190 '+(130+i*54)+'H700'} stroke="#c1c4b9"/><text x="205" y={164+i*54} className="p-mobile-number">{String(i+2).padStart(2,'0')}</text><text x="277" y={165+i*54} className="p-mobile-discipline">{name}</text><path d={'M668 '+(150+i*54)+'h16'} stroke="#2457ff" strokeWidth="3"/></g>)}
 <text x="450" y="565" textAnchor="middle" className="p-company-signature">One company.</text>
 </g>
 </svg>
}
export default function Prototype(){
 const [phase,setPhase]=useState(0);const origin=useRef<HTMLDivElement>(null);const destination=useRef<HTMLDivElement>(null);const [assembly,setAssembly]=useState(0);const [placement,setPlacement]=useState({left:0,top:0,width:0,height:0});const rail=useRef<HTMLElement>(null);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[]);
 useEffect(()=>{let frame=0;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!rail.current)return;const r=rail.current.getBoundingClientRect();const length=rail.current.offsetHeight-innerHeight;const t=Math.max(0,Math.min(1,1-r.top/innerHeight));setAssembly(t);if(origin.current&&destination.current){const a=origin.current.getBoundingClientRect(),b=destination.current.getBoundingClientRect();const blend=t*t*(3-2*t);setPlacement({left:a.left+(b.left-a.left)*blend,top:a.top+(b.top-a.top)*blend,width:a.width+(b.width-a.width)*blend,height:a.height+(b.height-a.height)*blend})}setPhase(Math.max(0,Math.min(7,Math.floor((-r.top/length)*8))))})};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(frame)}},[]);
 function select(i:number){if(!rail.current)return;const top=rail.current.getBoundingClientRect().top+scrollY;const length=rail.current.offsetHeight-innerHeight;window.scrollTo({top:top+(i+.2)/8*length,behavior:reduced?'instant':'smooth'})}
 return <div className="p-prototype"><a className="p-skip" href="#creation">Skip to creation experience</a><section className="p-arrival" aria-labelledby="p-title"><header><a href="/prototype" className="p-wordmark">DYNASTY WORKS<span>STUDIO</span></a><span className="p-classification">Company creation studio</span><a href="#creation">Enter the process <span aria-hidden="true">↘</span></a></header><div className="p-arrival-composition"><p className="p-arrival-note">The beginning of<br/>something that matters.</p><h1 id="p-title">From idea<span>to company.</span></h1><div className="p-origin-art"><div ref={origin} className="p-origin-anchor"/><span className="p-origin-caption"><i/>One idea. Infinite potential.</span></div><p className="p-arrival-bottom">Strategy. Identity. Product.<br/>Digital. Experience. Market.</p><a className="p-enter" href="#creation">See an idea become a company <span aria-hidden="true">↓</span></a></div></section><section ref={rail} className="p-evolution" id="creation" aria-label="Idea to company"><div className="p-stage"><div className="p-stage-top"><span>DYNASTY WORKS / CREATION STUDY</span><span>Fictional demonstration</span></div><div className="p-stage-copy" aria-live="polite"><span className="p-count">0{phase+1}<span> / 08</span></span><h2>{statements[phase]}</h2><p>{descriptions[phase]}</p></div><div ref={destination} className="p-stage-art"/><nav className="p-stages" aria-label="Creation stages">{stages.map((s,i)=><button key={s} aria-current={i===phase?'step':undefined} onClick={()=>select(i)}><span className="p-stage-progress"/><small>0{i+1}</small>{s}</button>)}</nav><div className="p-stage-foot"><span>{phase===7?'The parts become the whole.':'Scroll to develop the idea.'}</span><span>IDEA → COMPANY</span></div></div></section><div className="p-shared-art" style={placement}><Artifact phase={phase} assembly={assembly}/></div></div>
}

