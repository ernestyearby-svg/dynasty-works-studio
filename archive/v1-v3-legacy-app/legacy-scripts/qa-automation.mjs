import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
const source = `
import assert from 'node:assert/strict';
import {startingPoints} from './data/company-builder';
import {automationServices,automationGoals,workflowExamples} from './data/automation';
import {serviceCatalog,serviceById} from './data/service-catalog';
import {emptyCompanyBuild,companyDraftSchema,normalizeBuild,parseSavedBuild} from './lib/company-builder';
import {generateRoadmap,roadmapText,createLeadPayload} from './lib/recommendation-engine';
import {evaluateActionPlan,validateContentTransition} from './lib/automation-policy';
import {automationAdapters,executeAutomation} from './server/automation-adapters';
assert.equal(serviceCatalog.length,122);assert.equal(automationServices.length,27);assert.equal(new Set(automationServices.map(s=>s.id)).size,27);assert.equal(automationGoals.length,17);assert.equal(workflowExamples.length,7);
for(const s of automationServices)assert.ok(serviceById[s.parentServiceId]?.practice==='build');
assert.ok(parseSavedBuild(JSON.stringify({build:emptyCompanyBuild,step:0})));
const base={...emptyCompanyBuild,businessType:'Technology',businessStage:'Operating',starting:[startingPoints[5]],needs:['AI / Automation']};
assert.equal(generateRoadmap({...base,needs:['Website']}).automation,null);
const early=generateRoadmap({...base,businessStage:'Idea',automation:{goals:['Content'],maturity:'Intelligent',systems:['CRM']}});
assert.equal(early.automation.engagement,'Automation Audit');assert.ok(!early.automation.services.some(s=>s.name==='AI Integrations'||s.name==='Social Publishing Systems'));assert.equal(early.automation.stages.filter(s=>s.timing==='future').length,8);
const results=[];
for(const maturity of ['Manual','Connected','Automated','Intelligent']){
 const b={...base,automation:{goals:['Leads','Email','Reporting'],maturity,systems:['CRM'],manualProcess:'Draft follow-up manually'}};
 const r=generateRoadmap(b);assert.ok(companyDraftSchema.safeParse(b).success);assert.ok(r.phases.some(p=>p.name==='Automation System'));assert.ok(r.automation.services.some(s=>s.name==='Lead Automation'));assert.equal(r.automation.mode,'Draft only');assert.ok(roadmapText(b).includes('Automation System'.toUpperCase()));assert.ok(roadmapText(b).includes('Lead Automation'));assert.equal(createLeadPayload(b,{builderSessionId:'test',createdAt:'2026-09-15'}).automation.maturity,maturity);
 assert.equal(r.automation.services.some(s=>s.name==='AI Integrations'),maturity==='Intelligent');results.push({maturity,scope:r.automation.engagement});
}
assert.equal(normalizeBuild({...base,needs:['Website'],automation:{goals:['Leads']}}).automation,undefined);
assert.equal(companyDraftSchema.safeParse({...base,automation:{goals:['Invented']}}).success,false);
assert.equal(companyDraftSchema.safeParse({...base,automation:{manualProcess:'x'.repeat(401)}}).success,false);
const a={id:'action',tenantId:'tenant',workflowId:'lead',recordId:'record',revision:1,payloadDigest:'digest',idempotencyKey:'unique',mode:'approval-required',risk:'higher-consequence'};
const approval={actionId:'action',tenantId:'tenant',revision:1,payloadDigest:'digest',state:'approved',authorizedActorId:'reviewer',expiresAt:'2026-09-16T00:00:00Z'};
const context={now:'2026-09-15T00:00:00Z',authorizedActorIds:['reviewer'],approvedLowRiskRule:true};
assert.equal(evaluateActionPlan(a,approval,context).allowed,true);
for(const patch of [{tenantId:'other'},{revision:2},{payloadDigest:'edited'},{state:'revoked'},{authorizedActorId:'intruder'},{expiresAt:'2026-09-14T00:00:00Z'}])assert.equal(evaluateActionPlan(a,{...approval,...patch},context).allowed,false);
assert.equal(evaluateActionPlan({...a,mode:'draft-only'},approval,context).allowed,false);
assert.equal(evaluateActionPlan({...a,mode:'automated'},approval,context).allowed,false);
assert.equal(evaluateActionPlan({...a,mode:'automated',risk:'medium'},approval,context).allowed,false);
assert.equal(evaluateActionPlan({...a,mode:'automated',risk:'low'},null,context).allowed,true);
assert.equal(evaluateActionPlan({...a,mode:'automated',risk:'low'},null,{...context,approvedLowRiskRule:false}).allowed,false);
const e={authorized:true,approvalCurrent:true,providerReceipt:false,cancelConfirmed:false};
assert.equal(validateContentTransition('SCHEDULED','PUBLISHED',e),false);
assert.equal(validateContentTransition('SCHEDULED','PUBLISHED',{...e,providerReceipt:true}),true);
assert.equal(validateContentTransition('SCHEDULED','DRAFT',e),false);
assert.equal(validateContentTransition('APPROVED','SCHEDULED',{...e,approvalCurrent:false}),false);
assert.equal(validateContentTransition('DRAFT','PUBLISHED',{...e,providerReceipt:true}),false);
assert.equal(automationAdapters.recordStore,null);assert.equal(automationAdapters.orchestration,null);assert.equal(automationAdapters.email,null);assert.equal(Object.keys(automationAdapters.social).length,0);assert.deepEqual(await executeAutomation(),{status:'disabled',executed:false});
console.log(results);console.log('PASS: catalog preservation, conditional scope, four maturities, conservative early stage, strict input, roadmap/download/payload, approval binding, queue evidence and disabled execution.');
`;
const result = await build({
  stdin: { contents: source, resolveDir: process.cwd(), loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
try {
  await import(
    "data:text/javascript;base64," +
      Buffer.from(result.outputFiles[0].text).toString("base64")
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const ui = readFileSync("components/company-builder.tsx", "utf8");
assert.match(ui, /saved.build.automation[\s\S]*manualProcess/);
assert.match(ui, /build.automation[\s\S]*manualProcess/);
