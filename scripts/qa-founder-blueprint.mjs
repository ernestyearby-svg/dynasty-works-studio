import { build } from "esbuild";
const source = `
import assert from 'node:assert/strict';
import {emptyCompanyBuild,validateCompanyStep} from '@/lib/company-builder';
import {generateRoadmap,roadmapText} from '@/lib/recommendation-engine';
import {startingPoints as a,budgetChoices} from '@/data/company-builder';
import {serviceById} from '@/data/service-catalog';
import {engagementPackages} from '@/data/packages';
import {founderBlueprint,blueprintDocumentSections} from '@/data/founder-blueprint';
import {blueprintIntakeSchema,emptyBlueprintDraft,validateBlueprintStep} from '@/lib/blueprint-intake';
import {handleSubmission} from '@/server/submission-handler';
import {canDeliverBlueprint} from '@/server/blueprint-document';
const base={...emptyCompanyBuild,businessType:'Technology',businessStage:'Idea',starting:[a[0]],needs:['Company Setup','Application','Website'],launch:'Exploring',budgetChoice:budgetChoices[0],name:'QA Founder',company:'Example',email:'qa@example.com',acknowledged:true};
assert.equal(generateRoadmap(base).engagement.id,'founder-blueprint');
assert.ok(generateRoadmap(base).items.every(i=>!['distribute','activate'].includes(serviceById[i.serviceId].practice)));
const food={...base,businessType:'Food / Beverage',needs:['Company Setup','Packaging','Website','Distribution Strategy','Launch']};
assert.equal(generateRoadmap(food).engagement.id,'founder-blueprint');assert.ok(generateRoadmap(food).items.some(i=>serviceById[i.serviceId].practice==='distribute'&&i.timing==='future'));
const mature={...base,businessStage:'Growing',starting:[a[2],a[3],a[4],a[6]],needs:['Website Optimization']};
assert.notEqual(generateRoadmap(mature).engagement.id,'founder-blueprint');
assert.notEqual(generateRoadmap({...mature,needs:['Brand Identity'],redesignIdentity:true}).engagement.id,'founder-blueprint');
assert.equal(generateRoadmap({...base,uncertainNeeds:true,needs:[]}).engagement.id,'founder-blueprint');assert.deepEqual(validateCompanyStep({...base,uncertainNeeds:true,needs:[]},2),{});
assert.equal(generateRoadmap({...base,engagementPreference:'Do it myself'}).engagement.id,'dynasty-tools');
assert.equal(engagementPackages.filter(p=>p.publicPrice!==null).length,1);assert.equal(founderBlueprint.publicPrice,1500);
assert.ok(roadmapText(food).includes('$1,500'));assert.ok(!roadmapText(mature).includes('$1,500'));assert.ok(roadmapText(food).includes('IMMEDIATE PRIORITIES'));assert.ok(roadmapText(food).includes('FUTURE PHASES'));
assert.equal(blueprintDocumentSections.length,21);
const intake={...emptyBlueprintDraft,name:'QA Founder',email:'qa@example.com',company:'Example',businessType:'Technology',businessStage:'Idea',ideaDescription:'A useful scheduling application for small teams.',problemDescription:'Teams struggle to plan their time.',targetCustomer:'Small professional service teams.',requestedNeeds:'A clear roadmap and product requirements.',targetLaunch:'Exploring',primaryMarket:'United States',biggestQuestion:'Which product requirements should come first?'};
assert.ok(blueprintIntakeSchema.safeParse(intake).success);assert.ok(!blueprintIntakeSchema.safeParse({...intake,email:'bad'}).success);assert.ok(!blueprintIntakeSchema.safeParse({...intake,references:['javascript:alert(1)']}).success);assert.ok(!blueprintIntakeSchema.safeParse({...intake,distributionGoals:'Retail stores'}).success);assert.ok(!blueprintIntakeSchema.safeParse({...intake,password:'secret'}).success);assert.ok(validateBlueprintStep({...intake,ideaDescription:''},1).ideaDescription);
const common={version:1,idempotencyKey:'11111111-1111-4111-8111-111111111111',consent:{evaluation:true,communication:true,noticeVersion:'project-evaluation-v1'},honeypot:'',botToken:'synthetic-test-token'};
const req=(payload,headers={})=>new Request('http://localhost/api/submissions/blueprint',{method:'POST',headers:{origin:'http://localhost','content-type':'application/json',...headers},body:typeof payload==='string'?payload:JSON.stringify(payload)});
const envelope={...common,data:intake};
assert.equal((await handleSubmission(req(envelope),'blueprint')).status,503);
assert.equal((await handleSubmission(req({...common,data:base}),'builder')).status,503);
assert.equal((await handleSubmission(req(envelope,{origin:'https://untrusted.example'}),'blueprint')).status,403);
assert.equal((await handleSubmission(req(envelope,{'content-type':'text/plain'}),'blueprint')).status,415);
assert.equal((await handleSubmission(req('{broken'),'blueprint')).status,400);
assert.equal((await handleSubmission(req('x'.repeat(48001)),'blueprint')).status,413);
assert.equal((await handleSubmission(req({...envelope,honeypot:'bot'}),'blueprint')).status,422);
assert.equal((await handleSubmission(req({...envelope,consent:{...common.consent,evaluation:false}}),'blueprint')).status,422);
assert.equal((await handleSubmission(req({...common,data:{...base,recommendedPackage:'invented'}}),'builder')).status,422);
let writes=0,derived;
const receipt='22222222-2222-4222-8222-222222222222';
const deps={enabled:true,limiter:{consume:async()=>({allowed:true,retryAfterSeconds:60})},botVerifier:{verify:async()=>true},repository:{persistAtomic:async(input,computed)=>{writes++;derived=computed;return {status:'accepted',receiptId:receipt};}}};
const accepted=await handleSubmission(req({...common,data:base}),'builder',deps);assert.equal(accepted.status,202);assert.deepEqual(await accepted.json(),{status:'accepted',receiptId:receipt});assert.equal(derived.roadmap.engagement.id,'founder-blueprint');
const limited=await handleSubmission(req(envelope),'blueprint',{...deps,limiter:{consume:async()=>({allowed:false,retryAfterSeconds:30})}});assert.equal(limited.status,429);assert.equal(limited.headers.get('Retry-After'),'30');
assert.equal((await handleSubmission(req(envelope),'blueprint',{...deps,botVerifier:{verify:async()=>false}})).status,403);
assert.equal((await handleSubmission(req(envelope),'blueprint',{...deps,repository:null})).status,503);assert.equal(writes,1);
assert.equal((await handleSubmission(req(envelope),'blueprint',{...deps,repository:{persistAtomic:async()=>({status:'conflict'})}})).status,409);
assert.equal((await handleSubmission(req(envelope),'blueprint',{...deps,repository:{persistAtomic:async()=>{throw Error('private database failure');}}})).status,503);
assert.equal(canDeliverBlueprint({state:'draft'}),false);assert.equal(canDeliverBlueprint({state:'approved',revision:2,approvedRevision:1,reviewedBy:'staff',reviewedAt:'date',privatePdfObjectPath:'private'}),false);assert.equal(canDeliverBlueprint({state:'approved',revision:2,approvedRevision:2,reviewedBy:'staff',reviewedAt:'date',privatePdfObjectPath:'private'}),true);
if(process.argv[2]) {
 const origin=process.argv[2];const u=new URL(origin);assert.ok(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)&&u.port,'Local QA only');
 const general={services:['Website'],physicalMarket:false,description:'Synthetic project description for local QA only.',company:'Example',stage:'Idea',budget:'Let’s discuss',timeframe:'Flexible',name:'QA Founder',email:'qa@example.com',phone:'',website:'',reference:'',consent:true,honeypot:''};
 for(const [kind,data] of [['general',general],['builder',base],['blueprint',intake]]){
  const result=await fetch(origin+'/api/submissions/'+kind,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({...common,data})});
  assert.equal(result.status,503,kind+' disabled status');assert.equal((await result.json()).status,'not_configured');assert.equal(result.headers.get('cache-control'),'no-store');
 }
 const invalid=await fetch(origin+'/api/submissions/blueprint',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({...envelope,data:{...intake,email:'bad'}})});assert.equal(invalid.status,422);
 const cross=await fetch(origin+'/api/submissions/blueprint',{method:'POST',headers:{origin:'https://untrusted.example','content-type':'application/json'},body:JSON.stringify(envelope)});assert.equal(cross.status,403);
 const unknown=await fetch(origin+'/api/submissions/unknown',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'});assert.equal(unknown.status,404);
 console.log('PASS: six actual local HTTP checks for all three disabled submission types, validation, origin rejection and unknown kind.');
}
console.log('PASS: Blueprint fit/non-fit, only approved price, physical exclusions, uncertainty, downloads, intake validation, disabled endpoints, security gates, mock-only persistence/error states and human-review delivery gate.');
`;
const result = await build({
  stdin: { contents: source, resolveDir: process.cwd(), loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
