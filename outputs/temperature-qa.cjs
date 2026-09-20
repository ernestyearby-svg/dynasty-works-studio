const {chromium}=require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('fs');
(async()=>{const out='outputs/v51-temperature';fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});const p=await b.newPage({reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));const widths=[];
for(const w of [320,360,375,390,430,768,1024,1280,1440,1920,2560]){
 await p.setViewportSize({width:w,height:w<800?844:1000});await p.goto('http://127.0.0.1:5178/v5-1-review/');await p.evaluate(()=>document.fonts.ready);
 const snap=async name=>{await p.waitForTimeout(100);if([390,1440,1920].includes(w))await p.screenshot({path:out+'/'+w+'-'+name+'.png'});widths.push({width:w,state:name,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)})};
 await snap('arrival');
 for(const [name,n]of [['Strategy','02'],['Product','04'],['Digital','05'],['Experience','06'],['Company','08']]){await p.getByRole('button',{name:n+' '+name,exact:true}).click();await snap(name.toLowerCase())}
 await p.locator('#review-builder').evaluate(e=>e.scrollIntoView());await snap('builder');
}
await p.getByRole('button',{name:'Start your roadmap',exact:false}).click();await p.getByRole('button',{name:'Consumer Brand',exact:true}).click();await p.getByRole('checkbox',{name:'I only have an idea.',exact:true}).check();await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByRole('checkbox',{name:'Website',exact:true}).check();await p.getByRole('button',{name:'Create roadmap',exact:false}).click();await p.getByRole('heading',{name:'Your first direction.',exact:true}).waitFor();
for(const w of [1440,390]){await p.setViewportSize({width:w,height:1000});await p.locator('.r51-input').evaluate(e=>e.scrollIntoView());await p.screenshot({path:out+'/'+w+'-result.png'})}
fs.writeFileSync(out+'/qa.json',JSON.stringify({errors,widths,blueprint:await p.getByText('$1,500',{exact:true}).count(),sections:await p.locator('section').count()},null,2));console.log(JSON.stringify({errors,overflows:widths.filter(x=>x.overflow),blueprint:await p.getByText('$1,500',{exact:true}).count()}));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
