const {chromium}=require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('fs');
(async()=>{const out='outputs/v52';fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});const p=await b.newPage({reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));const widths=[];
for(const w of [320,360,375,390,430,768,1024,1280,1440,1920,2560]){
 await p.setViewportSize({width:w,height:w<800?844:1000});await p.goto('http://127.0.0.1:5178/v5-2-review/');await p.evaluate(()=>document.fonts.ready);
 for(const name of ['proof','invitation']){await p.locator('#'+name).evaluate(e=>e.scrollIntoView());widths.push({width:w,act:name,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});if([1440,1920,390].includes(w))await p.locator('#'+name).screenshot({path:out+'/'+w+'-'+name+'.png'})}
 if([1440,390].includes(w)){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:out+'/'+w+'-full.png',fullPage:true})}
}
const compare=[];for(const w of [1440,390]){await p.setViewportSize({width:w,height:w===390?844:1000});let prior;
 for(const version of ['v5-1-review','v5-2-review']){await p.goto('http://127.0.0.1:5178/'+version+'/');await p.evaluate(()=>document.fonts.ready);const shots={};
 shots.arrival=await p.locator('.p-arrival-composition').screenshot();
 await p.getByRole('button',{name:'08 Company',exact:true}).click();await p.waitForTimeout(100);shots.company=await p.locator('.p-stage').screenshot();
 await p.getByRole('navigation',{name:'Operating states'}).getByRole('button',{name:/Build/}).click();await p.waitForTimeout(100);shots.build=await p.locator('.r51-operating-stage').screenshot();
 shots.builder=await p.locator('#review-builder').screenshot();
 if(prior)for(const key of Object.keys(shots))compare.push({width:w,act:key,identical:Buffer.compare(prior[key],shots[key])===0});else prior=shots;
 }
}
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));await p.getByRole('button',{name:'Menu',exact:false}).click();const menuOpen=await p.locator('dialog').evaluate(e=>e.open);await p.keyboard.press('Escape');const menuClosed=await p.locator('dialog').evaluate(e=>!e.open);const focusReturn=await p.locator('.r52-menu-trigger').evaluate(e=>e===document.activeElement);
await p.getByRole('button',{name:'Start your roadmap',exact:false}).click();await p.getByRole('button',{name:'Consumer Brand',exact:true}).click();await p.getByRole('checkbox',{name:'I only have an idea.',exact:true}).check();await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByRole('checkbox',{name:'Website',exact:true}).check();await p.getByRole('button',{name:'Create roadmap',exact:false}).click();await p.getByRole('heading',{name:'Your first direction.',exact:true}).waitFor();const d=p.waitForEvent('download');await p.getByRole('button',{name:'Download your roadmap',exact:false}).click();const download=await d;await download.saveAs(out+'/roadmap.txt');
const report={errors,widths,compare,menuOpen,menuClosed,focusReturn,download:download.suggestedFilename(),blueprint:await p.getByText('$1,500',{exact:true}).count(),images:await p.locator('img').count(),sections:await p.locator('section').count(),links:await p.locator('.r52-paths a,.r52-invitation-end a').evaluateAll(a=>a.map(e=>({text:e.textContent,href:e.getAttribute('href')})))};
for(const route of ['/work','/concept-lab','/work/mymosa','/work/ikla-maison','/prototype/','/']){await p.goto('http://127.0.0.1:5178'+route);console.log(route,await p.title())}
fs.writeFileSync(out+'/qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
