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
  <polygon points={points([[x,0,z],[x+w,0,z],[x+w+h*.52,0,z+d+h*.42],[x+h*.52,0,z+d+h*.42]])} className="ve-shadow"/>
  <polygon points={points([[x-5,0,z-5],[x+w+5,0,z-5],[x+w+9,0,z+d+9],[x-5,0,z+d+9]])} className="ve-contact"/>
  <polygon points={points([[x,0,z],[x+w,0,z],[x+w,h,z],[x,h,z]])} fill="url(#ve-stone)"/>
  <polygon points={points([[x+w,0,z],[x+w,0,z+d],[x+w,h,z+d],[x+w,h,z]])} fill="url(#ve-metal)"/>
  <polygon points={points([[x,h,z],[x+w,h,z],[x+w,h,z+d],[x,h,z+d]])} className="ve-top"/>
  <path d={line([x,h,z],[x+w,h,z])} className="ve-edge"/>
  <path d={line([x+w,h,z],[x+w,0,z])} className="ve-rebate" opacity={identity*.32}/>
 </g>;
 return <div className="ve-environment" style={material} data-position={p.toFixed(4)} data-stage={phase} data-layer="environment-system" aria-hidden="true">
  <svg className="ve-atmosphere" data-layer="01-environment" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
   <defs>
    <linearGradient id="ve-stone" x1="0" y1="0" x2=".75" y2="1"><stop stopColor="var(--surface-top)"/><stop offset=".3" stopColor="var(--surface-front)"/><stop offset="1" stopColor="var(--surface-side)"/></linearGradient>
    <linearGradient id="ve-metal" x1="0" x2="1"><stop stopColor="var(--surface-side)"/><stop offset=".08" stopColor="var(--surface-front)"/><stop offset=".92" stopColor="var(--surface-front)"/><stop offset="1" stopColor="var(--surface-top)"/></linearGradient>
    <linearGradient id="ve-reveal" x2="0" y2="1"><stop stopColor="#080a0d" stopOpacity=".58"/><stop offset="1" stopColor="#080a0d" stopOpacity=".08"/></linearGradient>
    <linearGradient id="ve-daylight" x2="0" y2="1"><stop stopColor="#fff4d9" stopOpacity=".38"/><stop offset="1" stopColor="#fff4d9" stopOpacity="0"/></linearGradient>
    <linearGradient id="ve-light"><stop stopColor="#f6eedb" stopOpacity="0"/><stop offset="1" stopColor="#f6eedb" stopOpacity=".28"/></linearGradient>
    <linearGradient id="ve-floor" x2="0" y2="1"><stop stopColor="var(--field)"/><stop offset="1" stopColor="var(--surface-side)" stopOpacity=".25"/></linearGradient>
    <linearGradient id="ve-quiet"><stop stopColor="white" stopOpacity="0"/><stop offset=".36" stopColor="white" stopOpacity=".07"/><stop offset=".65" stopColor="white" stopOpacity=".4"/><stop offset="1" stopColor="white" stopOpacity=".9"/></linearGradient>
    <mask id="ve-hierarchy"><rect width="1440" height="900" fill="url(#ve-quiet)"/></mask>
   </defs>
   <g mask="url(#ve-hierarchy)">
    <path d="M0 365H1440V900H0Z" fill="url(#ve-floor)"/>
    <path d="M0 365H1440" className="ve-horizon" opacity={.12+market*.18}/>
   </g>
  </svg>
  <svg className="ve-construction" data-layer="02-reactive-construction" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
   <g mask="url(#ve-hierarchy)">
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
    {/* Repeated bays are extensions of the original L, not a second scene. */}
    <g className="ve-bays" opacity={market*.5}>
     {[0,1,2].map(i=>{const z=1800+i*560,construction=resolve((p-5)*1.7-i*.24);return <g key={z}>
      {cuboid('bay-'+i,1040,z,46,95,construction*720,.7)}
      <polygon points={points([[330,720,z],[1040,720,z],[1040,720,z+95],[330,720,z+95]])} fill="var(--surface-front)" opacity={construction}/>
      <path d={line([330,0,z],[1040,0,z])+line([1040,0,z],[1040,construction*720,z])} className="ve-rebate"/>
     </g>})}
    </g>
    {/* The first plane gains thickness; it is never swapped out. */}
    {cuboid('origin-plane',330,850,170,8+volume*170,760)}
    {cuboid('origin-foot',330,850,170+axes*710,8+volume*170,3+volume*58,.1+axes*.9)}
    {/* Precision joints make the first plane read as fabricated material. */}
    <g className="ve-craft" opacity={identity*.7}>
     {[250,500].map(y=><g key={y}>
      <path d={line([332,y,849],[498,y,849])} className="ve-joint"/>
      <path d={line([332,y+2,849],[498,y+2,849])} className="ve-edge"/>
     </g>)}
     <path d={line([476,16,848],[476,744,848])} className="ve-joint"/>
     <polygon points={points([[479,16,847],[489,16,847],[489,744,847],[479,744,847]])} fill="url(#ve-metal)"/>
    </g>
    {/* A recessed threshold: the same aperture gains a jamb and a deep reveal. */}
    <g opacity={volume*.7}>
     <polygon points={points([[500,62,1025],[545,62,1025],[545,740,1025],[500,740,1025]])} fill="url(#ve-reveal)"/>
     <polygon points={points([[500,740,850],[545,740,1025],[545,62,1025],[500,62,850]])} fill="var(--surface-side)"/>
     <path d={line([545,740,1025],[545,62,1025])} className="ve-aperture"/>
    </g>
    <path d={line([330,760,850],[1170,760,850])} className="ve-axis" opacity={axes*.55}/>
    <path d={line([1170,760,850],[1170,0,850])} className="ve-axis" opacity={axes*.55}/>
    <path d={line([515,760,850],[515,0,850])} className="ve-aperture" opacity={.5+space*.3}/>
    {/* Identity differentiates a metal return inside the stone L. */}
    {cuboid('metal-return',1040,850,10+volume*35,8+volume*170,identity*620,identity*.9)}
    <g opacity={digital*.65}>
     <path d={line([520,64,850],[980,64,850])+line([980,64,850],[980,420,850])} className="ve-pathway"/>
     <polygon points={points([[550,140,855],[870,140,855],[870,340,855],[550,340,855]])} className="ve-interface"/>
     <path d={line([550,305,850],[870,305,850])} className="ve-pathway"/>
     {/* Light is housed in the floor joints, rather than hovering in the room. */}
     <path d={line([560,1,850],[560,1,100])+line([560,1,100],[1040,1,100])} className="ve-channel"/>
     <path d={line([560,2,850],[560,2,100])+line([560,2,100],[1040,2,100])} className="ve-pathway"/>
    </g>
    {/* Depth resolves into a passage, using the same right-angle construction. */}
    {cuboid('passage-wall',1060,200,110,650,space*800,space*.8)}
    {cuboid('passage-return',420,2200,120,190,space*750,space*.65)}
    <polygon points={points([[330,760,850],[1170,760,850],[1170,760,1600],[330,760,1600]])} className="ve-canopy" opacity={space*.32}/>
    {/* The aperture rhythm produces both ceiling structure and grounded light. */}
    <g className="ve-louvres" opacity={space*.5}>
     {[0,1,2,3,4,5].map(i=>{const z=850+i*115;return <g key={z}>
      <polygon points={points([[500,758,z],[1040,758,z],[1040,742,z+18],[500,742,z+18]])} fill="var(--surface-side)"/>
      <path d={line([500,758,z],[1040,758,z])} className="ve-edge"/>
      <polygon points={points([[550+i*27,1,90+i*145],[740+i*27,1,90+i*145],[770+i*27,1,126+i*145],[580+i*27,1,126+i*145]])} fill="url(#ve-daylight)"/>
     </g>})}
    </g>
    {cuboid('product-volume',660,300,180,180,volume*190,volume*.75)}
    <g className="ve-craft" opacity={volume*.42}>
     <path d={line([662,volume*170,299],[838,volume*170,299])+line([838,volume*170,299],[838,volume*170,478])} className="ve-joint"/>
     <path d={line([682,volume*190+1,325],[817,volume*190+1,325])+line([817,volume*190+1,325],[817,volume*190+1,452])} className="ve-edge"/>
    </g>
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

