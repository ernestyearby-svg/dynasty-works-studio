const fs=require('fs'),path=require('path');// Vite rewrites module tags; retain render blocking for the route snapshot.
for(const entry of ['dist/index.html','dist/v5-2-review/index.html']){const source=fs.readFileSync(entry,'utf8');fs.writeFileSync(entry,source.replace(/<script type="module"/g,'<script blocking="render" type="module"'));}
const html=fs.readFileSync('dist/index.html','utf8');
const pages={'work':'Dynasty Works Studio — Selected Work','work/mymosa':'MyMosa / My Drink Family — Dynasty Works Studio Case Study','work/ikla-maison':'IKLA Maison — Dynasty Works Studio Case Study','concept-lab':'Concept Lab — Dynasty Works Studio',...Object.fromEntries(['veritas','lumiere','aura','altius','solara','nova'].map(s=>['concept-lab/'+s,s==='nova'?'NOVA Company Creation Concept Study — Dynasty Works Studio':s[0].toUpperCase()+s.slice(1)+' Concept Study — Dynasty Works Studio']))};
for(const [route,title]of Object.entries(pages)){const dir=path.join('dist',route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html.replace(/<title>.*?<\/title>/,`<title>${title}</title>`).replace(/<meta name="description" content="[^"]*"\/>/,`<meta name="description" content="${title}. Explore identity, product, material and digital systems."/>`));}console.log('Wrote '+Object.keys(pages).length+' static route entrypoints');

const supportRoutes=["founder-blueprint","founder-blueprint/intake","studio","capabilities","contact","automation","growth-partnership","how-we-build","services","templates","start-a-business","start-a-business/builder","capabilities/start","capabilities/brand","capabilities/build","capabilities/launch","capabilities/distribute","capabilities/activate","capabilities/grow","capabilities/publish"];
for(const route of supportRoutes){const dir=path.join("dist",route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"index.html"),html);}
fs.writeFileSync("dist/404.html",html.replace(/<title>.*?<\/title>/,"<title>Page not found — Dynasty Works Studio</title>"));

fs.mkdirSync('dist/experience-lab',{recursive:true});fs.writeFileSync('dist/experience-lab/index.html',html.replace(/<title>.*?<\/title>/,'<title>DWS / Experience Lab — V5.4</title>'));

