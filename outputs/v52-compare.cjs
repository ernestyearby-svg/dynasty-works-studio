const {chromium}=require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const sets=[];
for(const v of ['v5-1-review','v5-2-review']){await p.goto('http://127.0.0.1:5178/'+v+'/');await p.locator('h1').waitFor();await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(250);const arrival=await p.locator('.p-arrival-composition').screenshot({path:'outputs/v52/'+v+'-arrival-compare.png'});
await p.locator('#review-builder').evaluate(e=>e.scrollIntoView({block:'start'}));await p.waitForTimeout(250);const builder=await p.locator('#review-builder').screenshot({path:'outputs/v52/'+v+'-builder-compare.png'});sets.push({arrival,builder})}
console.log({arrival:Buffer.compare(sets[0].arrival,sets[1].arrival)===0,builder:Buffer.compare(sets[0].builder,sets[1].builder)===0});
for(const route of ['/work','/concept-lab','/work/mymosa','/work/ikla-maison']){await p.goto('http://127.0.0.1:5178'+route);await p.locator('h1').waitFor();await p.waitForTimeout(100);console.log(route,await p.title(),await p.locator('h1').innerText())}
await b.close()})()
