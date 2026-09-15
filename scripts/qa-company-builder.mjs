import assert from "node:assert/strict";
import { build } from "esbuild";
const source = `
import assert from "node:assert/strict";
import {emptyCompanyBuild,availableNeeds,recommendServices,normalizeBuild,parseSavedBuild,validateCompanyStep,validateCompanyBuild} from "@/lib/company-builder";
import {marketNeeds,companyJourney,startingPoints,budgetChoices} from "@/data/company-builder";
import {approvedMarketSections} from "@/types/company";
import {practices} from "@/data/practices";
import {studioPackages,recurringOfferings} from "@/data/offerings";
const software={...emptyCompanyBuild,businessType:"Technology",starting:[startingPoints[2],startingPoints[3]]};
assert.ok(marketNeeds.every(need=>!availableNeeds(software).includes(need)));
assert.ok(recommendServices(software).every(r=>!marketNeeds.includes(r.service)));
const physical={...software,businessType:"Food / Beverage"};
assert.ok(marketNeeds.every(need=>availableNeeds(physical).includes(need)));
assert.ok(recommendServices(physical).some(r=>r.service==="Distribution Strategy"));
assert.ok(availableNeeds({...software,physicalMarket:true}).includes("Retail Readiness"));
const cleaned=normalizeBuild({...software,needs:["Market Activation","Brand Identity"]});
assert.deepEqual(cleaned.needs,["Brand Identity"]);
assert.ok(recommendServices({...physical,needs:["Distribution Strategy"]}).every(r=>r.service!=="Distribution Strategy"));
assert.equal(parseSavedBuild("not-json"),null);
assert.equal(parseSavedBuild(JSON.stringify({step:7,build:emptyCompanyBuild})),null);
assert.equal(parseSavedBuild(JSON.stringify({step:0,build:{...emptyCompanyBuild,businessType:"unknown"}})),null);
const recovered=parseSavedBuild(JSON.stringify({step:6,build:software}));
assert.equal(recovered.step,2);
assert.ok(validateCompanyStep({...software,budgetChoice:budgetChoices[1]},4).budgetNote);
assert.ok(validateCompanyStep({...software,email:"invalid"},5).email);
const valid={...physical,needs:["Brand Identity"],launch:"Exploring",budgetChoice:budgetChoices[0],name:"QA Founder",company:"Example",email:"qa@example.com",acknowledged:true};
assert.deepEqual(validateCompanyBuild(valid),{});
assert.ok(validateCompanyStep({...valid,website:"javascript:alert(1)"},5).website);
const section={title:"Retail Placement",body:"Verified narrative",status:"approved",approvedAt:"2026-09-15",proofRef:"approved-evidence"};
assert.equal(approvedMarketSections([section,{...section,status:"draft"},{...section,proofRef:null},{...section,approvedAt:null}]).length,1);
assert.deepEqual(companyJourney.map(s=>s.id),["idea","form","brand","build","launch","distribute","activate","grow"]);
assert.equal(practices.length,8);
assert.ok(studioPackages.every(p=>p.status==="draft"&&p.startingPrice===null));
assert.ok(recurringOfferings.every(p=>p.status==="draft"&&p.price===null));
console.log("PASS: eligibility, pruning, draft recovery, validation, proof gates and unpublished-offering checks.");
`;
const compiled = await build({
  stdin: { contents: source, resolveDir: process.cwd(), loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
assert.equal(compiled.errors.length, 0);
await import(
  "data:text/javascript;base64," +
    Buffer.from(compiled.outputFiles[0].text).toString("base64")
);
