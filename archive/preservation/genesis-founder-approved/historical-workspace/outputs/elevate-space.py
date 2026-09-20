from pathlib import Path
p=Path('src/capability/SpaceScene.tsx');s=p.read_text()
s=s.replace("import {RoomEnvironment}","import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';\nimport {RoomEnvironment}")
s=s.replace(" const plaster=",''' const textures:T.Texture[]=[];
 function grain(direction:boolean){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#999999';ctx.fillRect(0,0,256,256);let seed=51;for(let i=0;i<5000;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%256;seed=(seed*1664525+1013904223)>>>0;const y=seed%256;ctx.fillStyle=`rgba(${i%2?30:240},${i%2?30:240},${i%2?30:240},.12)`;ctx.fillRect(x,y,direction?25+seed%55:1,direction?.5:1)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(direction?2:5,direction?3:5);textures.push(t);return t}
 const timberGrain=grain(true),mineralGrain=grain(false);
 const plaster=''')
s=s.replace("color:'#b9b7ad',roughness:.9","color:'#b9b7ad',roughness:.94,bumpMap:mineralGrain,bumpScale:.017")
s=s.replace("color:'#56483a',roughness:.84","color:'#56483a',roughness:.78,bumpMap:timberGrain,bumpScale:.011")
s=s.replace("color:'#454a47',roughness:.48,metalness:.35","color:'#454a47',roughness:.32,metalness:.65")
s=s.replace("color:'#71513f',roughness:1","color:'#515650',roughness:1")
s=s.replace('const g=new T.BoxGeometry(w,h,d);','const g=new RoundedBoxGeometry(w,h,d,2,Math.min(.012,w*.12,h*.12,d*.12));')
s=s.replace(' const wings=', ''' const timberTones=Array.from({length:7},(_,i)=>{const m=timber.clone();m.color.set(['#584b3a','#695844','#62513e','#725e49','#514332','#675541','#5d503f'][i]);mats.push(m);return m});let boardIndex=0;
 const wings=''')
s=s.replace('box(w,.12,.095,x,3.04,z-d/2+.15+j*.3,timber,structural)', 'box(w,.12,.095,x,3.04,z-d/2+.15+j*.3,timberTones[boardIndex++%7],structural)')
s=s.replace('metal,structural)}','metal,structural);box(.21,.045,.21,x+sx*(w/2-.18),.14,z+sz*(d/2-.18),metal,structural);box(.18,.045,.22,x+sx*(w/2-.18),2.79,z+sz*(d/2-.18),metal,structural)}')
start=s.index(' function person(');end=s.index(' const ambient=',start)
s=s[:start]+''' // Architectural cut-out figures: different poses articulate arrival, seating and exchange.
 function person(x:number,z:number,angle:number,parent:T.Object3D,pose:'walk'|'stand'|'seat'|'present'='stand'){
 const g=new T.Group();g.position.set(x,.12,z);g.rotation.y=angle;parent.add(g);
 const seated=pose==='seat';const torso=new T.Shape();const pts=seated?[[-.13,.58],[-.15,1.02],[-.07,1.13],[.07,1.13],[.16,1.01],[.15,.65],[.34,.61],[.35,.49],[-.1,.49]]:[[-.14,.80],[-.15,1.11],[-.2,1.35],[-.07,1.46],[.07,1.46],[.2,1.35],[.15,1.11],[.14,.8]];
 pts.forEach(([x,y],i)=>i?torso.lineTo(x,y):torso.moveTo(x,y));torso.closePath();const geo=new T.ExtrudeGeometry(torso,{depth:.055,bevelEnabled:true,bevelSize:.018,bevelThickness:.012,bevelSegments:2,steps:1});geos.push(geo);const body=new T.Mesh(geo,peopleMat);body.castShadow=true;g.add(body);
 const hg=new T.SphereGeometry(.10,16,12);geos.push(hg);const head=new T.Mesh(hg,peopleMat);head.scale.set(.82,1.15,.58);head.position.set(0,seated?1.27:1.60,.02);head.castShadow=true;g.add(head);
 function limb(points:number[][],radius=.045){const curve=new T.CatmullRomCurve3(points.map(([a,b,c])=>new T.Vector3(a,b,c)));const geo=new T.TubeGeometry(curve,8,radius,6,false);geos.push(geo);const mesh=new T.Mesh(geo,peopleMat);mesh.castShadow=true;g.add(mesh)}
 if(seated){limb([[-.06,.57,.02],[.29,.55,.02],[.30,.12,.02]]);limb([[.04,.57,.04],[.36,.53,.04],[.4,.12,.04]]);limb([[-.13,1.02,.02],[-.2,.78,.02],[.16,.70,.02]],.034);limb([[.13,1.02,.02],[.23,.84,.02],[.20,.7,.02]],.034)}else{const stride=pose==='walk'?.20:.06;limb([[-.08,.88,.02],[-.10-stride,.43,.02],[-.1-stride,.06,.02]]);limb([[.08,.88,.02],[.12+stride,.45,.02],[.13+stride,.06,.02]]);limb([[-.17,1.33,.02],[-.24,1.10,.02],[-.19,.93,.02]],.033);limb(pose==='present'?[[.17,1.33,.02],[.37,1.19,.02],[.61,1.30,.02]]:[[.17,1.33,.02],[.25,1.10,.02],[.34,1.12,.02]],.033)}return g}
 person(0,3.5,.25,human,'walk');
 person(-.8,.45,.5,occupation);person(.55,.65,-.35,occupation);person(.15,-.75,2.8,occupation);
 person(3.65,.5,-.55,occupation);person(3.7,-.8,2.7,occupation);
 person(-3.8,1.78,.4,occupation,'seat');person(.2,-3.65,.3,occupation,'present');
 // Site and glazing are representational layers; the approved footprint and structure stay fixed.
 const site=new T.Group();scene.add(site);const ground=new T.MeshStandardMaterial({color:'#d1cbbc',roughness:1,bumpMap:mineralGrain,bumpScale:.022});mats.push(ground);box(12.3,.10,12.5,0,-.14,.4,ground,site);
 for(const z of [-5.5,-4.5,5.5,6.5]){const l=trace([[-6.1,-.078,z],[6.1,-.078,z]]);site.add(l)}
 const glass=new T.MeshPhysicalMaterial({color:'#c1d4ce',roughness:.15,metalness:0,transparent:true,opacity:.24,depthWrite:false,side:T.DoubleSide});mats.push(glass);
 for(const z of [-1.45,.05]){const pane=box(.024,1.7,1.5,-5.08,1.01,z,glass,material);pane.castShadow=false;box(.03,.025,1.5,-5.07,1.87,z,metal,material)}
 const notation=new T.Group();scene.add(notation);
 function label(text:string,x:number,y:number,z:number,width:number){const c=document.createElement('canvas');c.width=640;c.height=96;const ctx=c.getContext('2d')!;ctx.fillStyle='#545b51';ctx.font='28px monospace';ctx.fillText(text,6,56);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);const m=new T.SpriteMaterial({map:t,transparent:true,depthTest:false});mats.push(m);const sprite=new T.Sprite(m);sprite.position.set(x,y,z);sprite.scale.set(width,width*.15,1);notation.add(sprite);return sprite}
 const section=trace([[-5.8,.20,-3.7],[5.8,.20,-3.7]],pathMat);const sectionLabel=label('A — A / STRUCTURE',-5.7,.3,-4.1,2.4);
 const materialLabel=label('TIMBER / MINERAL / METAL',-3.5,3.7,-2.8,4);
 const sunlight=trace([[6,5.5,-5],[1,2.8,0]],pathMat);const sunLabel=label('FILTERED / AFTERNOON',4.8,5.2,-4.5,3.2);
 const dimension=trace([[1.1,.12,3.5],[1.1,1.82,3.5],[.95,1.82,3.5],[1.25,1.82,3.5]],pathMat);const dimensionLabel=label('1.70 m',1.9,1.4,3.5,1.3);
 const occupationLabels=[label('ARRIVE',0,.3,5.8,1.4),label('GATHER',0,.3,1.7,1.4),label('CONVERSE',5.25,1.1,.2,1.8),label('RETREAT',-4,1.4,2.6,1.7),label('PRESENT',.3,2,-3.7,1.7)];
''' +s[end:]
s=s.replace("sun.position.set(-6+light*9,10-light*3,6);ambient.intensity=2-light*.7;", "sun.position.set(-6+light*11,10-light*5,6-light*10);ambient.intensity=2-light*1.05;")
s=s.replace("sun.intensity=1.8+light*.8", "sun.intensity=1.8+light*1.35")
s=s.replace("timber.color.set(mat>.5?'#56483a':'#a3a69e');plaster.color.set(mat>.5?'#b9b7ad':'#d1d2cb');", "timber.color.copy(new T.Color('#a3a69e').lerp(new T.Color('#56483a'),mat));timberTones.forEach((m,i)=>m.color.copy(new T.Color('#a3a69e').lerp(new T.Color(['#584b3a','#695844','#62513e','#725e49','#514332','#675541','#5d503f'][i]),mat)));plaster.color.copy(new T.Color('#d1d2cb').lerp(new T.Color('#b9b7ad'),mat));site.visible=p>.43;ground.color.copy(new T.Color('#e0ded4').lerp(new T.Color('#c9c3b3'),mat));section.visible=sectionLabel.visible=p>.17&&p<.34;materialLabel.visible=p>.48&&p<.64;sunlight.visible=sunLabel.visible=p>=.64&&p<.77;dimension.visible=dimensionLabel.visible=p>=.77&&p<.92;occupationLabels.forEach(l=>l.visible=p>.96);")
s=s.replace('geos.forEach(g=>g.dispose());mats.forEach','textures.forEach(t=>t.dispose());geos.forEach(g=>g.dispose());mats.forEach')
p.write_text(s)
