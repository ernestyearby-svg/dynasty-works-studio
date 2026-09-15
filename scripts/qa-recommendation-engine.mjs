import { build } from "esbuild";
const source = `
import assert from 'node:assert/strict';
import {emptyCompanyBuild,companyDraftSchema} from '@/lib/company-builder';
import {generateRoadmap,createLeadPayload,roadmapText} from '@/lib/recommendation-engine';
import {serviceCatalog,serviceById} from '@/data/service-catalog';
import {engagementPackages,growthPartnerships} from '@/data/packages';
import {startingPoints as a} from '@/data/company-builder';
const scenario=(businessType,businessStage,starting,needs,extra={})=>({...emptyCompanyBuild,businessType,businessStage,starting,needs,launch:'Exploring',...extra});
const cases=[
 scenario('Food / Beverage','Idea',[a[0]],['Company Setup','Brand Identity','Packaging','Website','Distribution Strategy','Launch']),
 scenario('Fashion','Preparing to launch',[a[1],a[3]],['Brand Identity','E-commerce','Launch']),
 scenario('Technology','Idea',[a[0]],['Company Setup','Application','Website','AI / Automation']),
 scenario('Professional Service','Operating',[a[2],a[3],a[4]],['Website','Brand Identity','Launch']),
 scenario('Hospitality','Growing',[a[2],a[3],a[4],a[6]],['Market Expansion','Market Activation','Ongoing Support'],{productReady:true}),
 scenario('E-commerce','Operating',[a[2],a[3],a[4]],['E-commerce Optimization'],{storefrontReady:true})
];
const results=cases.map(generateRoadmap);
const ids=r=>r.items.map(i=>i.serviceId);
assert.equal(serviceCatalog.length,122);
assert.equal(new Set(serviceCatalog.map(s=>s.id)).size,122);
for(const s of serviceCatalog) for(const dep of [...s.dependencies,...s.recommendedNextServices])assert.ok(serviceById[dep],dep);
for(const p of engagementPackages) {assert.equal(p.publicPrice,p.id==='founder-blueprint'?1500:null);for(const id of [...p.services,...p.optionalServices])assert.ok(serviceById[id],id);}
assert.equal(engagementPackages.length,7);assert.equal(growthPartnerships.length,5);
assert.equal(new Set(results.map(r=>ids(r).join('|'))).size,6,'Scenarios materially differ');
assert.ok(results[0].items.some(i=>serviceById[i.serviceId].practice==='distribute'&&i.timing==='future'));
assert.ok(results[0].items.some(i=>serviceById[i.serviceId].practice==='activate'&&i.timing==='future'));
assert.ok(ids(results[0]).indexOf('brand-brand-strategy')<ids(results[0]).indexOf('brand-packaging-design'));
assert.ok(!ids(results[1]).includes('brand-logo-design'));assert.ok(!ids(results[1]).includes('brand-identity-systems'));
assert.ok(results[2].items.every(i=>!['distribute','activate'].includes(serviceById[i.serviceId].practice)));
assert.ok(ids(results[2]).includes('build-database-architecture'));
assert.ok(!ids(results[3]).includes('brand-logo-design'));assert.ok(ids(results[3]).includes('grow-website-optimization'));
assert.equal(results[4].engagement.id,'market-expansion');assert.ok(results[4].items.some(i=>serviceById[i.serviceId].practice==='activate'&&i.timing==='initial'));
assert.ok(ids(results[5]).includes('grow-e-commerce-optimization'));assert.ok(!ids(results[5]).includes('build-e-commerce'));
const noSite=generateRoadmap(scenario('Professional Service','Idea',[a[0]],['Website Optimization']));
assert.ok(ids(noSite).includes('build-website-development'));assert.ok(!ids(noSite).includes('grow-website-optimization'));
const noStore=generateRoadmap({...cases[5],storefrontReady:false});assert.ok(ids(noStore).includes('build-e-commerce'));assert.ok(!ids(noStore).includes('grow-e-commerce-optimization'));
assert.ok(ids(generateRoadmap({...cases[1],redesignIdentity:true})).includes('brand-logo-design'));
assert.equal(generateRoadmap({...cases[0],engagementPreference:'Do it myself'}).engagement.id,'dynasty-tools');
assert.equal(generateRoadmap({...cases[0],engagementPreference:'Guide me'}).engagement.id,'founder-blueprint');
assert.notEqual(generateRoadmap({...cases[0],launch:'ASAP'}).timelineNote,results[0].timelineNote);
assert.ok(ids(generateRoadmap({...cases[2],physicalMarket:true,needs:['Distribution Strategy']})).some(id=>serviceById[id].practice==='distribute'));
const payload=createLeadPayload(cases[0],{builderSessionId:'synthetic-session',createdAt:'2026-09-15T00:00:00Z'});
assert.equal(payload.consentState.submissionConsent,false);assert.deepEqual(payload.recommendedPhases,results[0].phases.map(p=>p.name));
assert.ok(roadmapText(cases[0]).includes('Future'));assert.ok(companyDraftSchema.safeParse(cases[0]).success);
for(const r of results){assert.equal(new Set(ids(r)).size,r.items.length);for(const p of r.phases)assert.ok(p.items.length);}
console.log(JSON.stringify(results.map((r,i)=>({scenario:cases[i].businessType,phases:r.phases.length,services:r.items.length,engagement:r.engagement.name})),null,2));
console.log('PASS: six scenarios, prerequisites, readiness, existing assets, explicit redesign, modes, timeline, catalog references, price gates and payload.');
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
