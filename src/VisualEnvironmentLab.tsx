import {useEffect} from 'react';
import Review52,{type CreationEnvironmentState} from './Review52';
import './visual-environment.css';

type Point=[number,number,number];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const resolve=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};

/** A retained architectural model, projected from one camera. The existing
 * Creation controller is the sole input: no observer, timer or scroll handler. */
function Environment({position,phase,reduced,material}:CreationEnvironmentState){
 const p=Math.min(7,position);
 const axes=resolve(p),identity=resolve(p-1),volume=resolve(p-2);
 const digital=resolve(p-3),space=resolve(p-4),market=resolve(p-5),company=resolve(p-6);
 // Reduced motion retains construction, but removes the modest camera dolly.
 const distance=1120+(reduced?0:space*100+market*130);
 const projection=([x,y,z]:Point)=>[740+x*960/(z+distance),365+(430-y)*960/(z+distance)];
 const points=(ps:Point[])=>ps.map(v=>projection(v).map(n=>n.toFixed(2)).join(',')).join(' ');
 const line=(a:Point,b:Point)=>{const x=projection(a),y=projection(b);return `M${x.join(' ')}L${y.join(' ')}`;};
 const cuboid=(id:string,x:number,z:number,w:number,d:number,h:number,opacity=1,extra='')=><g key={id} opacity={opacity} className={'ve-volume '+extra}>
  <polygon points={points([[x,0,z],[x+w,0,z],[x+w+d*.8,0,z+d*.6],[x+d*.8,0,z+d*.6]])} className="ve-shadow"/>
  <polygon points={points([[x,0,z],[x+w,0,z],[x+w,h,z],[x,h,z]])} fill="url(#ve-stone)"/>
  <polygon points={points([[x+w,0,z],[x+w,0,z+d],[x+w,h,z+d],[x+w,h,z]])} fill="url(#ve-metal)"/>
  <polygon points={points([[x,h,z],[x+w,h,z],[x+w,h,z+d],[x,h,z+d]])} className="ve-top"/>
  <path d={line([x,h,z],[x+w,h,z])} className="ve-edge"/>
 </g>;
 return <div className="ve-environment" style={material} data-position={p.toFixed(4)} data-stage={phase} aria-hidden="true">
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
   <defs>
    <linearGradient id="ve-stone" x1="0" y1="0" x2="1" y2=".25"><stop stopColor="var(--surface-front)"/><stop offset=".58" stopColor="var(--surface-side)"/><stop offset="1" stopColor="var(--surface-front)"/></linearGradient>
    <linearGradient id="ve-metal" x1="0" x2="1"><stop stopColor="var(--surface-side)"/><stop offset=".8" stopColor="var(--surface-top)"/><stop offset="1" stopColor="var(--surface-side)"/></linearGradient>
    <linearGradient id="ve-light"><stop stopColor="#f6eedb" stopOpacity="0"/><stop offset="1" stopColor="#f6eedb" stopOpacity=".28"/></linearGradient>
    <linearGradient id="ve-floor" x2="0" y2="1"><stop stopColor="var(--field)"/><stop offset="1" stopColor="var(--surface-side)" stopOpacity=".25"/></linearGradient>
    <linearGradient id="ve-quiet"><stop stopColor="white" stopOpacity="0"/><stop offset=".36" stopColor="white" stopOpacity=".07"/><stop offset=".65" stopColor="white" stopOpacity=".4"/><stop offset="1" stopColor="white" stopOpacity=".9"/></linearGradient>
    <mask id="ve-hierarchy"><rect width="1440" height="900" fill="url(#ve-quiet)"/></mask>
   </defs>
   <g mask="url(#ve-hierarchy)">
    <path d="M0 365H1440V900H0Z" fill="url(#ve-floor)"/>
    <path d="M0 365H1440" className="ve-horizon" opacity={.12+market*.18}/>
    {/* One aperture casts the same light through every construction state. */}
    <polygon points={points([[540,760,850],[630,760,850],[1130,0,-80],[560,0,-80]])} fill="url(#ve-light)" opacity={.18+identity*.25+space*.42}/>
    <g className="ve-grid" opacity={axes*.18}>
     {[-1200,-800,-400,0,400,800,1200,1600].map(x=><path key={x} d={line([x,0,-350],[x,0,3000])}/>)}
     {[0,250,600,1050,1700,2600].map(z=><path key={z} d={line([-1800,0,z],[1800,0,z])}/>)}
    </g>
    {/* Market grows along the axes established in Strategy, behind the room. */}
    <g className="ve-distant" opacity={market*.68}>
     {[0,1,2,3].map(i=>cuboid('distant-'+i,180+i*300,1900+i*160,75,150,market*(440+i*80)))}
     <path d={line([400,0,800],[400,0,3500])} className="ve-pathway"/>
     <path d={line([400,0,2400],[1900,0,2400])} className="ve-pathway"/>
    </g>
    {/* The first plane gains thickness; it is never swapped out. */}
    {cuboid('origin-plane',330,850,170,8+volume*170,760)}
    {cuboid('origin-foot',330,850,170+axes*710,8+volume*170,3+volume*58,.1+axes*.9)}
    <path d={line([330,760,850],[1170,760,850])} className="ve-axis" opacity={axes*.55}/>
    <path d={line([1170,760,850],[1170,0,850])} className="ve-axis" opacity={axes*.55}/>
    <path d={line([515,760,850],[515,0,850])} className="ve-aperture" opacity={.5+space*.3}/>
    {/* Identity differentiates a metal return inside the stone L. */}
    {cuboid('metal-return',1040,850,10+volume*35,8+volume*170,identity*620,identity*.9)}
    <g opacity={digital*.65}>
     <path d={line([520,64,850],[980,64,850])+line([980,64,850],[980,420,850])} className="ve-pathway"/>
     <polygon points={points([[550,140,855],[870,140,855],[870,340,855],[550,340,855]])} className="ve-interface"/>
     <path d={line([550,305,850],[870,305,850])} className="ve-pathway"/>
    </g>
    {/* Depth resolves into a passage, using the same right-angle construction. */}
    {cuboid('passage-wall',1060,200,110,650,space*800,space*.8)}
    {cuboid('passage-return',420,2200,120,190,space*750,space*.65)}
    <polygon points={points([[330,760,850],[1170,760,850],[1170,760,1600],[330,760,1600]])} className="ve-canopy" opacity={space*.32}/>
    {cuboid('product-volume',660,300,180,180,volume*190,volume*.75)}
    <g opacity={company*.45}><path d={line([330,0,850],[330,0,2200])+line([330,0,2200],[1170,0,2200])+line([1170,0,2200],[1170,0,200])} className="ve-pathway"/></g>
    <circle cx={projection([1170,760,850])[0]} cy={projection([1170,760,850])[1]} r="2.4" fill="#2457ff" opacity={identity}/>
   </g>
  </svg>
 </div>;
}

const renderEnvironment=(state:CreationEnvironmentState)=><Environment {...state}/>;
export default function VisualEnvironmentLab(){
 useEffect(()=>{document.title='DWS — Visual Environment Lab';},[]);
 return <Review52 environment={renderEnvironment}/>;
}

