import {construction as approvedConstruction,ramp} from '../genesis-storyboard/geometry';
export {ramp};
export const stops=[{p:0,id:'00',label:'Signal'},{p:10,id:'01',label:'Direction'},{p:20,id:'02',label:'Identity'},{p:30,id:'03',label:'Form'},{p:42,id:'04',label:'Experience'},{p:52,id:'05',label:'Economics'},{p:62,id:'06',label:'System'},{p:72,id:'07',label:'Market'},{p:82,id:'08',label:'Company'},{p:93,id:'09',label:'Return'}] as const;
const mapping=[[0,0],[10,20],[20,28],[30,45],[42,51],[52,57],[62,62],[72,66],[82,70],[86,78],[87,80],[88,83],[89,86],[90,89],[92,92],[93,93],[100,100]];
export function spineProgress(p:number){for(let i=1;i<mapping.length;i++){const[a,x]=mapping[i-1],[b,y]=mapping[i];if(p<=b)return x+(y-x)*(p-a)/(b-a);}return 100;}
export function construction(p:number){return approvedConstruction(spineProgress(p));}
export function stage(p:number){if(p>=86.5)return 9;for(let i=0;i<stops.length-2;i++)if(p<(stops[i].p+stops[i+1].p)/2)return i;return 8;}
function field(p:number,start:number,peak:number,end:number){return ramp(p,start,peak)*(1-ramp(p,peak,end));}
export function intelligence(p:number){return {identity:field(p,11,20,30),experience:field(p,31,42,52),economics:field(p,43,52,62),system:field(p,53,62,72),market:field(p,63,72,82)};}

