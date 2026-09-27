const fs=require('fs');let s=fs.readFileSync('src/Prototype.tsx','utf8');
s=s.replace("function Artifact({phase,arrival=false}:{phase:number;arrival?:boolean}){","function Artifact({phase,assembly=0}:{phase:number;assembly?:number}){");
s=s.replace("className={'p-artifact '+(arrival?'is-origin':'')}","className={'p-artifact '+(phase===7?'is-company':'')}");
s=s.replace("aria-label={arrival?'One unformed idea, represented by a single folded ink sheet.':descriptions[phase]}","aria-label={phase===0?'An open plane, one line and a cobalt point: the first piece of a system.':descriptions[phase]}");
const start=s.indexOf(' <defs>'),end=s.indexOf(' <g className="p-system-traces"');
s=s.slice(0,start)+' <defs><linearGradient id="product-side"><stop stopColor="#d6d4cd"/><stop offset="1" stopColor="#aba9a3"/></linearGradient></defs>\n'+s.slice(end);
const core=s.indexOf(' <g className="p-core"'),coreEnd=s.indexOf(' {!arrival&&<>');
s=s.slice(0,core)+` <g className="p-core" style={{opacity:[2,3,4,5].includes(phase)?0:1,transform:phase===0?'translate(0px,0px)':phase===7?'translate(270px,175px) scale(.40)':'translate(305px,210px) scale(.28)'}}>
 <path d="M330 185V405H550V370H365V185Z" fill="#17191c" style={{transform:phase===0?'translate('+(-assembly*28)+'px,'+(assembly*14)+'px)':'none'}}/>
 <path d="M365 185H550V335" fill="none" stroke="#8f9289" strokeWidth="1.3" style={{transform:phase===0?'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)':'none'}}/>
 <path d="M365 370L550 185" stroke="#a9aca3" strokeWidth="1" strokeDasharray="3 6" opacity={assembly}/>
 <path d="M550 145V185H590" fill="none" stroke="#2457ff" strokeWidth="2" style={{transform:'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)'}}/>
 <circle cx="550" cy="185" r="6" fill="#2457ff" style={{transform:'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)'}}/>
 </g>
 <>`+s.slice(coreEnd+' {!arrival&&<>'.length);
s=s.replace(' </>}',' </>');
s=s.replace('<g className="p-evidence" data-on={phase===7}>','<g className="p-evidence p-resolution-signature" data-on={phase===7}>');
const closing=s.indexOf(' </svg>');
s=s.slice(0,closing)+` <g className="p-mobile-resolution" data-on={phase===7}>
 <path d="M160 90V485H735" fill="none" stroke="#17191c" strokeWidth="16"/>
 <path d="M185 90H735V460" fill="none" stroke="#9b9f94"/>
 <circle cx="735" cy="90" r="9" fill="#2457ff"/>
 {['Strategy','Identity','Product','Digital','Experience','Market'].map((name,i)=><g key={name}><path d={'M190 '+(130+i*54)+'H700'} stroke="#c1c4b9"/><text x="205" y={164+i*54} className="p-mobile-number">{String(i+2).padStart(2,'0')}</text><text x="277" y={165+i*54} className="p-mobile-discipline">{name}</text><path d={'M668 '+(150+i*54)+'h16'} stroke="#2457ff" strokeWidth="3"/></g>)}
 <text x="450" y="565" textAnchor="middle" className="p-company-signature">One company.</text>
 </g>
`+s.slice(closing);
s=s.replace("const [phase,setPhase]=useState(0);const rail", "const [phase,setPhase]=useState(0);const origin=useRef<HTMLDivElement>(null);const destination=useRef<HTMLDivElement>(null);const [assembly,setAssembly]=useState(0);const [placement,setPlacement]=useState({left:0,top:0,width:0,height:0});const rail");
s=s.replace("const length=rail.current.offsetHeight-innerHeight;setPhase", "const length=rail.current.offsetHeight-innerHeight;const t=Math.max(0,Math.min(1,1-r.top/innerHeight));setAssembly(t);if(origin.current&&destination.current){const a=origin.current.getBoundingClientRect(),b=destination.current.getBoundingClientRect();const blend=t*t*(3-2*t);setPlacement({left:a.left+(b.left-a.left)*blend,top:a.top+(b.top-a.top)*blend,width:a.width+(b.width-a.width)*blend,height:a.height+(b.height-a.height)*blend})}setPhase");
s=s.replace("window.addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>{window.removeEventListener('scroll',onScroll);", "window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);");
s=s.replace('<Artifact phase={0} arrival/>','<div ref={origin} className="p-origin-anchor"/>');
s=s.replace('<div className="p-stage-art"><Artifact phase={phase}/></div>','<div ref={destination} className="p-stage-art"/>');
s=s.replace('</div></section></div>','</div></section><div className="p-shared-art" style={placement}><Artifact phase={phase} assembly={assembly}/></div></div>');
fs.writeFileSync('src/Prototype.tsx',s);
