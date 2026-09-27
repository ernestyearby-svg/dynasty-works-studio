const fs=require('fs'),path=require('path');const seen=new Set,external=new Set;
const routes=['founder-blueprint','founder-blueprint/intake','studio','capabilities','contact','automation','growth-partnership','how-we-build','services','templates','start-a-business','start-a-business/builder'];
function walk(f){f=f.replaceAll('\\','/');if(seen.has(f))return;seen.add(f);let s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){let i=m[1],p=i.startsWith('@/')?i.slice(2):i.startsWith('.')?path.join(path.dirname(f),i):null;if(!p){external.add(i);continue}const file=['','.tsx','.ts','.json','/index.tsx','/index.ts'].map(e=>p+e).find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());if(file)walk(file);}}
routes.forEach(r=>walk('app/'+r+'/page.tsx'));['components/navbar.tsx','components/experience-motion.tsx'].forEach(walk);
for(const f of seen){const dest='investor-deployment/legacy/'+f;fs.mkdirSync(path.dirname(dest),{recursive:true});let s=fs.readFileSync(f,'utf8').replaceAll('@/','@legacy/').replace('from "next/navigation"','from "@legacy/navigation"');fs.writeFileSync(dest,s);}
const styles=['globals','brand-system','automation','experience','production-foundations','mymosa','company-creation','editorial-v3','art-direction'];
for(const s of styles)fs.copyFileSync('app/'+s+'.css','investor-deployment/legacy/app/'+s+'.css');
fs.writeFileSync('outputs/legacy-dependencies.json',JSON.stringify([...seen]));console.log(JSON.stringify({count:seen.size,external:[...external]}));
