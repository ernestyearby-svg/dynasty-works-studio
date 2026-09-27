import type {CSSProperties} from 'react';
import {ledger,type State} from './model';
const ancestor='M64 58V242H248V212H94V58Z';
export function World({variant,state,inspection}:{variant:'a'|'b';state:State;inspection:number}) {
 const l=ledger(state), assembled=inspection/100, reserved=state.phase<6;
 const signal=state.phase<3?'M79 79V192':state.phase<6?'M79 79V227H206':'M232 219H88V90';
 const skin=variant==='a'?ancestor:`M${64-28*assembled} 58V${242+28*assembled}H248V212H94V58Z`;
 return <div className={`world world-${variant}`} style={{'--assembly':assembled} as CSSProperties}>
  <svg className="machine" viewBox="0 0 1100 680" role="img" aria-label={`${variant==='a'?'Sectional operating spine':'Continuous folded instrument'}. ${state.phase===0?'Prepared work stops at the open elbow.':state.phase<3?'Human gate joined; validation precedes release.':state.phase<6?'One authorized consequence crosses the elbow; capacity committed.':'Recovered carrier restores capacity.'} Construction inspection ${inspection} percent.`}>
   <defs>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#DDD9CE"/><stop offset=".28" stopColor="#b7b3a9"/><stop offset=".48" stopColor="#ebe8df"/><stop offset="1" stopColor="#8A8172"/></linearGradient>
    <linearGradient id="edge" x2="0" y2="1"><stop stopColor="#62665f"/><stop offset="1" stopColor="#171C1B"/></linearGradient>
    <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3A403D"/><stop offset=".4" stopColor="#171C1B"/><stop offset=".53" stopColor="#777a70"/><stop offset=".63" stopColor="#3A403D"/><stop offset="1" stopColor="#171C1B"/></linearGradient>
    <filter id="shadow" x="-40%" y="-50%" width="190%" height="230%"><feGaussianBlur stdDeviation="8"/></filter>
    <pattern id="grain" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M0 0H2" stroke="#fff" strokeOpacity=".12" strokeWidth=".14"/></pattern>
   </defs>
   <g className="desktop-geometry" transform="translate(100 120)">
    <g transform={variant==='a'?'matrix(2.6 -.57 1.3 1.5 0 0)':'matrix(2.65 -.36 .65 1.48 115 0)'}>
     <path d={skin} transform="translate(0 40)" fill="#171c1b" opacity={.16*assembled} filter="url(#shadow)"/>
     <g className="construction" style={{opacity:.2+.8*assembled}}>
      <path d={skin} transform={`translate(0 ${assembled*(variant==='a'?21:12)})`} fill="#171C1B"/>
      <path d={variant==='a'?`M64 242L248 242V${242+assembled*21}H64Z`:`M36 270H248V${270+assembled*12}H36Z`} fill="url(#edge)"/>
      <path d={`M248 212V242L248 ${242+assembled*12}V${212+assembled*12}Z`} fill="#8A8172"/>
      <path d={skin} fill={variant==='a'?'url(#body)':'url(#ribbon)'} stroke="#8A8172" strokeWidth=".45"/>
      <path d={skin} fill="url(#grain)"/>
      <g opacity={assembled}>{variant==='a'?<>
       <path d="M72 68V232H239V219H88V68Z" fill="#292e2b" stroke="#f1f0e9" strokeWidth=".5"/>
       <path d="M75 73V228H235" fill="none" stroke="#92998b" strokeWidth=".5"/>
       <path d="M86 69V207" stroke="#bbb6a9" strokeWidth="2"/>
       {Array.from({length:19},(_,i)=><path key={i} d={`M${98+i*7} 233v6`} stroke="#171c1b" strokeWidth=".6"/>)}
       <path d={`M97 225H${reserved?226:238}`} stroke="#a19c8d" strokeWidth="7" className="capacity-surface"/>
       <path d="M226 221H238V229H226Z" fill={reserved?'#171C1B':'#c4c0b4'}/>
       <path d="M68 81H91M68 83H91" stroke="#666b63" strokeWidth=".5"/>
      </>:<>
       <path d="M40 62V264H244" fill="none" stroke="#e2ded0" strokeWidth=".65"/>
       <path d="M40 58V206Q40 266 101 266H248V244H102Q62 244 62 204V58Z" fill="url(#body)"/>
       <path d="M47 58V202Q47 256 101 256H248" fill="none" stroke="#F1F0E9" strokeWidth=".45"/>
       <path d="M91 60V216H246" fill="none" stroke="#8a8172" strokeWidth="1.2"/>
       <path d="M78 72V205Q78 227 101 227H238" fill="none" stroke="#bdbbad" strokeWidth="9"/>
       <path d="M75 74V202Q75 231 102 231H238" fill="none" stroke="#f1f0e9" strokeWidth=".6"/>
       <path d={`M102 227H${reserved?225:238}`} stroke="#72786f" strokeWidth={reserved?6:9} className="capacity-surface"/>
       <path d="M70 82Q79 88 88 82" fill="none" stroke="#171C1B" strokeWidth="2"/>
      </>}</g>
      <g className="operating-evidence" style={{opacity:assembled}}>
       <path d={variant==='a'?'M64 196H94V202H64Z':'M36 196H94V202H36Z'} fill={state.authorized?'#8a8172':'#F1F0E9'}/>
       <path d={variant==='a'?'M64 195H94':'M36 195H94'} stroke={state.authorized?'#2457ff':'#171c1b'} strokeWidth={state.authorized?2:.6}/>
       <path key={state.phase} d={signal} pathLength="1" className={`consequence phase-${state.phase}`} fill="none" stroke={state.authorized?'#2457FF':'#DDD9CE'} strokeWidth="2"/>
       <path d={state.phase<3?'M74 181H84V190H74Z':state.phase<6?'M183 221H200V231H183Z':'M74 92H84V101H74Z'} fill={state.authorized?'#2457ff':'#DDD9CE'} stroke="#F1F0E9" strokeWidth=".4"/>
       {state.phase>=5&&<path d="M220 229l4 4 9-12" fill="none" stroke="#F1F0E9" strokeWidth="1.4"/>}
       {state.phase>=7&&<path d="M69 104H89V118H69Z" fill="none" stroke="#ddd9ce" strokeWidth=".6"/>}
      </g>
     </g>
     <path d={ancestor} fill="none" stroke="#8A8172" strokeWidth=".4" opacity={1-assembled}/>
    </g>
   </g>
   <path className="gate-leader" d={variant==='a'?'M566 373L515 430V572':'M520 392L515 440V572'} fill="none" stroke="#8A8172" strokeWidth=".6"/><g className="mobile-geometry" transform="translate(5 -45) scale(3.6 2.8)">
    <path d={skin} transform={`translate(5 ${assembled*10})`} fill="#171c1b" opacity={.15*assembled}/>
    <path d={skin} fill={variant==='a'?'url(#body)':'url(#ribbon)'} stroke="#8A8172" strokeWidth=".5" opacity={.2+.8*assembled}/>
    {variant==='b'&&<path d="M40 58V210Q40 266 101 266H248V244H102Q62 244 62 204V58Z" fill="url(#body)" opacity={assembled}/>}
    <path d="M76 65V229H240" fill="none" stroke={variant==='a'?'#171c1b':'#b8b7a9'} strokeWidth={variant==='a'?13:9}/>
    <path d={`M98 229H${reserved?222:240}`} stroke="#777e73" strokeWidth="7"/>
    <path d={variant==='a'?'M64 195H94V201H64Z':'M36 195H94V201H36Z'} fill={state.authorized?'#2457ff':'#F1F0E9'}/>
    <g opacity={assembled}><path d={signal} fill="none" stroke={state.authorized?'#2457ff':'#ddd9ce'} strokeWidth="2"/><path d={state.phase<3?'M71 180H81V189H71Z':state.phase<6?'M180 224H196V233H180Z':'M71 90H81V99H71Z'} fill={state.authorized?'#2457ff':'#ddd9ce'}/></g><path d={ancestor} fill="none" stroke="#171c1b" strokeWidth=".5" opacity={1-assembled}/>
   </g>
  </svg>
  <div className="annotation input-note"><span>01 / INTENT</span><strong>One carrier.<br/>One circulation.</strong><small>REQUEST 001</small></div>
  <div className="annotation output-note"><span>{state.phase>=6?'RECOVERED':'CAPACITY'}</span><strong>{l.available}<i> / 300</i></strong><small>{state.phase>=6?'AVAILABLE AGAIN':state.phase>=3?'1 COMMITTED TO SERVICE':'1 PREPARED RESERVATION'}</small></div>
  <div className="object-caption"><span>{variant==='a'?'RESPONSIBILITY × CAPACITY':'INTENT → CONSEQUENCE'}</span><span>CANONICAL L / 184 : 30</span></div>
 </div>;
}

