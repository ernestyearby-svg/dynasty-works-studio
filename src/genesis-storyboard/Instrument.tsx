import type {CSSProperties} from 'react';
import {construction} from './geometry';
import type {State} from '../genesis-proof/model';
export function Instrument({progress,state,force,mobile}:{progress:number;state:State;force:number;mobile:boolean}){
 const q=construction(progress),id=mobile?'mobile':'desktop';
 const directionInfluence=Math.max(0,1-Math.abs(progress-20)/12);
 const sx=mobile?1.2:2.05+.6*q.material;
 const sy=mobile?1.55:1.7-.22*q.material;
 const matrix=mobile?`matrix(${sx+(force===2?.08:0)*directionInfluence} 0 0 ${sy+(force===0?.07:0)*directionInfluence} 0 0)`:`matrix(${sx+(force===2?.08:0)*directionInfluence} ${-.36*q.material} ${.65*q.material} ${sy+(force===0?.07:0)*directionInfluence} 0 0)`;
 const target=state.phase<3?'M79 79V190':state.phase<6?'M79 79V205Q79 227 101 227H206':'M232 219H100Q88 219 88 205V90';
 const gap=q.operating*(state.authorized?0:7);
 const shade=Math.round(23+35*q.material);
 return <svg className={`story-instrument ${id}`} viewBox={mobile?'0 0 390 450':'0 0 1100 680'} role="img" aria-label={`One persistent L construction, ${Math.round(q.growth*100)} percent extended. ${Math.round(q.material*100)} percent material depth. ${state.authorized?'Authorization recorded.':'Human gate withheld.'}`} data-origin="64,242" data-contour={q.contour} data-material={q.material} data-operating={q.operating}>
 <defs>
  <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#ddd9ce"/><stop offset=".45" stopColor="#b9b7aa"/><stop offset=".65" stopColor="#ebe8df"/><stop offset="1" stopColor="#8a8172"/></linearGradient>
  <linearGradient id={`fold-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3a403d"/><stop offset=".4" stopColor="#171c1b"/><stop offset=".54" stopColor="#777a70"/><stop offset=".65" stopColor="#3a403d"/><stop offset="1" stopColor="#171c1b"/></linearGradient>
  <filter id={`shadow-${id}`} x="-50%" y="-60%" width="210%" height="240%"><feGaussianBlur stdDeviation="8"/></filter>
  <clipPath id={`body-${id}`}><path d={q.contour}/></clipPath>
  <clipPath id={`acquisition-${id}`}><rect x="30" y="58" width="225" height={230*q.channel}/></clipPath>
 </defs>
 <g transform={mobile?'translate(85 340)':'translate(570 485)'}><g transform={matrix}><g transform="translate(-64 -242)">
  <path d={q.contour} transform={`translate(0 ${q.depth*2.5})`} fill="#171c1b" opacity={.16*q.material} filter={`url(#shadow-${id})`}/>
  <path d={q.contour} transform={`translate(0 ${q.depth})`} fill="#171c1b"/>
  <path d={`M${q.left} ${q.bottom}H${q.right}V${q.bottom+q.depth}H${q.left}Z`} fill="#272e29"/>
  <path className="ancestor-surface" d={q.contour} fill={q.material===0?'#171c1b':`url(#fold-${id})`}/>
  <path d={q.contour} fill={`rgb(${shade},${shade+5},${shade+4})`} fillOpacity={1-q.material}/>
  <g clipPath={`url(#body-${id})`}>
   <g clipPath={`url(#acquisition-${id})`}>
    <path d={`M${64-24*q.fold} 58V206Q${64-24*q.fold} ${242+24*q.fold} 101 ${242+24*q.fold}H248V${242+2*q.fold}H102Q${64-2*q.fold} ${242+2*q.fold} ${64-2*q.fold} 204V58Z`} fill={`url(#metal-${id})`}/>
    <path d={`M${64-17*q.fold} 58V202Q${64-17*q.fold} ${242+14*q.fold} 101 ${242+14*q.fold}H248`} fill="none" stroke="#f1f0e9" strokeWidth={.45*q.channel}/>
    <path d="M78 72V205Q78 227 101 227H238" fill="none" stroke="#bdbbad" strokeWidth={9*q.channel}/>
    <path d="M75 74V202Q75 231 102 231H238" fill="none" stroke="#f1f0e9" strokeWidth={.6*q.channel}/>
    <path d={`M102 227H${state.phase>=6?238:225}`} stroke="#72786f" strokeWidth={(state.phase>=6?9:6)*q.channel}/>
    <path d="M70 82Q79 88 88 82" fill="none" stroke="#171c1b" strokeWidth={2*q.operating}/>
   </g>
   <path d={target} pathLength="1" strokeDasharray="1" strokeDashoffset={1-q.operating} fill="none" stroke={state.authorized?'#2457ff':'#ddd9ce'} strokeWidth={2*q.operating}/>
   <g style={{opacity:q.operating}}><rect className="transaction-impression" x="-5" y="-5" width="10" height="10" fill={state.authorized?'#2457ff':'#ddd9ce'} style={{offsetPath:'path("M79 185V205Q79 227 101 227H196H232L88 219V97")',offsetDistance:state.phase<3?'0%':state.phase<6?'28%':'100%',offsetRotate:'0deg'} as CSSProperties}/></g>
   {state.phase>=7&&<path d="M69 104H89V118H69Z" stroke="#ddd9ce" strokeWidth={.6*q.operating} fill="none"/>}
   <path d={`M${q.left} ${196-gap/2}H94V${196+gap/2}H${q.left}Z`} fill="#f1f0e9"/>
   <path d={`M${q.left} ${195-gap/2}H94`} stroke={state.authorized?'#2457ff':'#171c1b'} strokeWidth={(state.authorized?2:.5)*q.operating}/>
  </g>
  <path d={q.contour} fill="none" stroke="#8a8172" strokeWidth={.45*q.material}/>
  <circle cx="64" cy="242" r={progress===0||progress===100?1:1.1} fill={q.growth>.02?'#8a8172':'#171c1b'}/>
 </g></g></g>
 </svg>;
}
