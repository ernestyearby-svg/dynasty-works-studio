export const contract = {fee:40,cost:18,contribution:22,fixed:4400,threshold:200,capacity:300,setup:10000,funding:18000} as const;
export const phases = ['Held','Authorized','Validated','Active','Service complete','Receipt recorded','Recovered','Settled'] as const;
export type State = {phase:number; authorized:boolean; held:boolean; history:string[]};
export type Action = {type:'authorize'|'hold'|'next'|'reset'};
export function initial():State {return {phase:0,authorized:false,held:false,history:['Request 001 entered · one reusable protective carrier','Capacity checked · one of 300 cycle slots reserved','Funding checked · $18 reserved from $8,000 operating funds','Prepared reservation · awaiting human authority']};}
export function reducer(s:State,a:Action):State {
 if(a.type==='reset')return initial();
 if(a.type==='hold')return s.phase===0&&!s.held?{...s,held:true,history:[...s.history,'Human decision · hold release; reservation retained']}:s;
 if(a.type==='authorize')return s.phase===0?{...s,phase:1,authorized:true,held:false,history:[...s.history,'Human authorized Request 001 only']}:s;
 if(a.type==='next'&&s.authorized&&s.phase>0&&s.phase<7){const phase=s.phase+1;const event=['','','Validation passed · request, authority and resources match','Release 001 · one carrier enters service','Service completed · one cycle fulfilled','Receipt 001 · $40 received; $18 cost; $22 contribution','Recovery confirmed · carrier returned; capacity restored','Feedback recorded · returned carrier enters next proposed preparation; new authority required'][phase];return {...s,phase,history:[...s.history,event]};}
 return s;
}
export function ledger(s:State){return {available:s.phase>=6?300:299,reserved:s.phase<3?1:0,committed:s.phase>=3&&s.phase<6?1:0,receipts:s.phase>=5?1:0,releases:s.phase>=3?1:0,reservations:1,contribution:s.phase>=5?22:0,cash:8000-(s.phase>=3?18:0)+(s.phase>=5?40:0),availableCash:s.phase<3?7982:8000-18+(s.phase>=5?40:0),completed:s.phase>=4?1:0,nextPreparation:s.phase>=7?'recovered-carrier':'unassigned'};}
