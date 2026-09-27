const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const source=path.resolve('../internal-assets/portfolio-v42/DWS-PORTFOLIO-MASTER');const out=path.resolve('public/assets/portfolio');fs.mkdirSync(out,{recursive:true});
const files=[];function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(p.endsWith('.png'))files.push(p)}}walk(source);files.sort();
const crops={
 'ikla-direction-detail':{source:'01-IKLA-CREATIVE-DIRECTION',rect:[.185,.005,.245,.445]},
 'ikla-living-detail':{source:'01-IKLA-CREATIVE-DIRECTION',rect:[.69,.005,.215,.445]},
 'ikla-pattern-detail':{source:'06-IKLA-PATTERN-SURFACE-SYSTEM',rect:[.16,.294,.20,.178]},
 'ikla-material-detail':{source:'07-IKLA-MATERIAL-STUDY',rect:[.175,.30,.285,.345]},
 'mymosa-orange-detail':{source:'01-MYMOSA-FOUR-FLAVOR-HERO',rect:[.183,.18,.146,.685]},
 'mymosa-pineapple-detail':{source:'01-MYMOSA-FOUR-FLAVOR-HERO',rect:[.358,.18,.142,.685]},
 'mymosa-tropical-detail':{source:'01-MYMOSA-FOUR-FLAVOR-HERO',rect:[.535,.18,.141,.685]},
 'mymosa-strawberry-detail':{source:'01-MYMOSA-FOUR-FLAVOR-HERO',rect:[.704,.18,.143,.685]},
 'veritas-detail':{source:'01-VERITAS-SPIRITS-SYSTEM',rect:[0,0,.434,.384]},
 'lumiere-detail':{source:'01-LUMIERE-FRAGRANCE-SYSTEM',rect:[0,0,.421,.40]},
 'aura-detail':{source:'01-AURA-TECHNOLOGY-SYSTEM',rect:[.012,.414,.258,.253]},
 'altius-detail':{source:'01-ALTIUS-HOSPITALITY-SYSTEM',rect:[0,0,.422,.39]},
 'solara-detail':{source:'01-SOLARA-CULINARY-SYSTEM',rect:[0,0,.428,.365]},
 'nova-detail':{source:'01-NOVA-COMPANY-CREATION-SYSTEM',rect:[0,0,.406,.366]},
 'nova-product-detail':{source:'02-NOVA-DIGITAL-PRODUCT-SYSTEM',rect:[.37,0,.368,.426]},
};
(async()=>{const registry={};const manifest=[];async function output(key,file,crop){const meta=await sharp(file).metadata();const rect=crop?{left:Math.round(meta.width*crop[0]),top:Math.round(meta.height*crop[1]),width:Math.floor(meta.width*crop[2]),height:Math.floor(meta.height*crop[3])}:null;const width=rect?.width||meta.width,height=rect?.height||meta.height;const widths=[...new Set([Math.min(480,width),Math.min(960,width),Math.min(1536,width)])];const derivatives=[];for(const w of widths)for(const format of ['avif','webp']){let pipeline=sharp(file);if(rect)pipeline=pipeline.extract(rect);const filename=`${key}-${w}.${format}`;await pipeline.resize({width:w,withoutEnlargement:true})[format]({quality:format==='avif'?65:85,effort:4}).toFile(path.join(out,filename));derivatives.push({filename,bytes:fs.statSync(path.join(out,filename)).size,width:w,format})}registry[key]={width,height,widths};manifest.push({key,source:path.relative(source,file).replaceAll('\\','/'),sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),crop:rect,derivatives});}
for(const file of files){await output(path.basename(file,'.png').toLowerCase(),file);console.log(path.basename(file))}for(const [key,c]of Object.entries(crops)){const file=files.find(f=>path.basename(f,'.png')===c.source);await output(key,file,c.rect)}fs.writeFileSync('src/portfolio-images.json',JSON.stringify(registry,null,2)+'\n');fs.writeFileSync('PORTFOLIO-ASSET-MANIFEST.json',JSON.stringify({sourceRoot:source,masters:files.length,assets:manifest},null,2)+'\n');console.log('Masters '+files.length+'; derivatives '+manifest.reduce((n,a)=>n+a.derivatives.length,0));})();
