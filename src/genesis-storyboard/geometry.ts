const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export const ramp=(p:number,a:number,b:number)=>smooth((p-a)/(b-a));
export function construction(p:number){
 const returning=p>78;
 const growth=returning?1-ramp(p,93,100):ramp(p,0,20);
 const material=returning?1-ramp(p,86,93):ramp(p,20,68);
 const fold=returning?1-ramp(p,85,92):ramp(p,35,68);
 const channel=returning?1-ramp(p,83,89):ramp(p,32,68);
 const operating=returning?1-ramp(p,78,84):ramp(p,55,68);
 const expression=returning?1-ramp(p,91,93):ramp(p,15,20);
 const reach=Math.max(2,184*growth),thickness=Math.min(reach,Math.max(2,30*growth));
 const left=64-28*fold,bottom=242+28*fold,top=242-reach,right=64+reach;
 return {growth,material,fold,channel,operating,expression,left,bottom,top,right,
  contour:`M${left} ${top}V${bottom}H${right}V${242-thickness}H${64+thickness}V${top}Z`,
  canonical:`M64 ${top}V242H${right}V${242-thickness}H${64+thickness}V${top}Z`,
  depth:12*material,returning};
}
export const stops=[{p:0,id:'00',label:'Signal'},{p:20,id:'01',label:'Direction'},{p:45,id:'03',label:'Form'},{p:70,id:'08',label:'Company'},{p:93,id:'09',label:'Return'}] as const;
export function stage(p:number){return p<12?0:p<32?1:p<60?2:p<=78?3:4;}
