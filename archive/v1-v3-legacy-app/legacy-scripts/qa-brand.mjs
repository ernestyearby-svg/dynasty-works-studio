import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const master=JSON.parse(fs.readFileSync('brand-source/modular-master.json'));
assert.equal(master.outline,'M20 125V95H90V60H160V25H230V125Z');
assert.equal(master.dividers,'M90 95V125M160 60V125');
const files=fs.readdirSync('public/assets/brand',{recursive:true}).map(f=>f.replaceAll('\\','/')).filter(f=>/\.(svg|png)$/.test(f));
let totalBytes=0,svgCount=0;
for(const file of files){const b=fs.readFileSync('public/assets/brand/'+file);totalBytes+=b.length;if(file.endsWith('.svg')){svgCount++;const s=b.toString();assert.ok(!/<(?:script|image|foreignObject)\b|onload=|javascript:/i.test(s),file+' safe vector');assert.ok(s.includes('viewBox='),file+' viewBox');await sharp(b).png().toBuffer();if(file.startsWith('symbol/')||(file.startsWith('logo/')&&!file.endsWith('wordmark.svg')))assert.ok(s.includes(master.outline),file+' master geometry');if(file.startsWith('logo/'))assert.ok(!s.includes('<text'),file+' outlined lettering');}}
for(const size of [16,32,48,180,192,512]){const m=await sharp('public/assets/brand/icons/icon-'+size+'.png').metadata();assert.equal(m.width,size);assert.equal(m.height,size);}
const icon=fs.readFileSync('public/favicon.svg','utf8');assert.ok(icon.includes(master.outline));assert.ok(!icon.includes(master.dividers));
const manifest=JSON.parse(fs.readFileSync('public/manifest.webmanifest'));for(const icon of manifest.icons)assert.ok(fs.existsSync('public'+icon.src));
console.log(JSON.stringify({status:'PASS',assets:files.length,svgCount,totalBytes,iconSizes:[16,32,48,180,192,512],geometry:'unchanged Direction 03',logoLettering:'outlined paths'}));
