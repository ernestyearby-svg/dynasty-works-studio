import {useEffect,useRef} from 'react';
import * as T from 'three';
import type {CreationEnvironmentState} from './Review52';
type Props=CreationEnvironmentState&{onReady:()=>void;onFailure:()=>void};
type Part={mesh:T.Mesh;x:number;y:number;z:number;w:number;h:number;d:number;stage:number;kind:string};
const smooth=(v:number)=>{const t=Math.min(1,Math.max(0,v));return t*t*(3-2*t);};

/** One retained scene. All construction derives from the existing foreground progress. */
export default function CompanyRenderer(props:Props){
 const host=useRef<HTMLDivElement>(null);const latest=useRef(props);const update=useRef<(()=>void)|null>(null);
 useEffect(()=>{latest.current=props;update.current?.();},[props]);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const started=performance.now();let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{latest.current.onFailure();return;}
  let mobile=innerWidth<=800,disposed=false,ready=false,lost=false,frames=0,frame=0;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;el.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.background=new T.Color('#ccc6ba');const fog=new T.Fog('#ccc6ba',1900,5100);scene.fog=fog;
  const camera=new T.PerspectiveCamera(2*Math.atan(450/960)*180/Math.PI,1440/900,5,12000);
  const unit=new T.BoxGeometry(1,1,1),materials:T.Material[]=[],parts:Part[]=[];
  const size=128,bytes=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,v=Math.round(180+9*Math.sin(x*.13)*Math.cos(y*.09)+3*Math.sin(x*.63+y*.31));bytes.set([v,v,v,255],i);}
  const grain=new T.DataTexture(bytes,size,size,T.RGBAFormat);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(3,3);grain.needsUpdate=true;
  const mat=(color:string,roughness:number,metalness=0)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,roughnessMap:grain,bumpMap:grain,bumpScale:.025});materials.push(m);return m;};
  const stone=mat('#505456',.95),metal=mat('#252a2c',.55,.65),limestone=mat('#aaa495',.88),floorMat=mat('#454945',.87,.04);
  const blue=new T.MeshStandardMaterial({color:'#2457ff',emissive:'#2457ff',emissiveIntensity:.7,roughness:.7});materials.push(blue);
  const warm=new T.MeshStandardMaterial({color:'#e2d4b5',emissive:'#e8ce9e',emissiveIntensity:.8});materials.push(warm);
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material,stage=0,kind='volume')=>{const mesh=new T.Mesh(unit,m);mesh.castShadow=h>80&&z<1800;mesh.receiveShadow=true;scene.add(mesh);parts.push({mesh,x,y,z,w,h,d,stage,kind});};
  // Retained V5.6 Company bounds; growth is anchored to each original lower corner.
  box(330,0,850,170,760,178,stone,0,'origin');box(330,0,850,880,61,178,stone,1,'foundation');
  box(1040,0,850,45,620,178,metal,2);box(1060,0,200,110,800,650,stone,5);
  box(420,0,2200,120,750,190,limestone,5);box(660,0,300,180,190,180,limestone,3);
  box(330,757,850,840,3,750,stone,5,'canopy');
  for(let i=0;i<6;i++)box(500,742,850+i*115,540,16,18,metal,5,'rib'+i);
  for(let i=0;i<3;i++){box(1040,0,1800+i*560,46,720,95,stone,6,'bay');box(330,718,1800+i*560,710,2,95,stone,6,'bay');}
  for(let i=0;i<4;i++)box(180+i*300,0,1900+i*160,75,440+i*80,150,stone,6,'distant');
  box(500,62,850,45,678,175,metal,0,'recess');box(543,62,1023,2,678,2,warm,0,'aperture');
  for(const y of [250,500])box(332,y,847,166,1.5,2,metal,2,'detail');box(479,16,847,10,728,2,metal,2,'detail');
  box(-4500,-9,-500,9000,8,8500,floorMat,0,'floor');
  const path=(x:number,z:number,w:number,d:number,stage:number)=>{box(x-2,-.8,z-2,w+4,1,d+4,metal,stage,'channel');box(x,0,z,w,1,d,blue,stage,'signal');};
  path(560,100,2,750,4);path(560,100,480,2,4);path(330,850,2,1350,7);path(330,2200,840,2,7);path(1170,200,2,2000,7);
  path(400,800,2,2700,6);path(400,2400,1500,2,6);
  const ambient=new T.HemisphereLight('#e4e7e6','#34393b',1.6);scene.add(ambient);
  const sun=new T.DirectionalLight('#f0f2ef',2.2);sun.position.set(250,1200,-450);sun.target.position.set(750,0,-1050);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?512:1024,mobile?512:1024);Object.assign(sun.shadow.camera,{left:-1700,right:1700,top:1600,bottom:-1600,near:1,far:6000});sun.shadow.normalBias=1.2;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun,sun.target);
  const aperture=new T.PointLight('#ffdfad',140000,1400,2);aperture.position.set(590,600,-900);scene.add(aperture);
  // Six neutral one-pixel faces: fixed ambient reflection, no future-world capture.
  const faces=[80,85,102,34,74,78].map(v=>{const t=new T.DataTexture(new Uint8Array([v,v,v,255]),1,1,T.RGBAFormat);t.needsUpdate=true;return t;});
  const environment=new T.CubeTexture(faces);environment.needsUpdate=true;scene.environment=environment;scene.environmentIntensity=.24;
  const pale=new T.Color('#96958d'),dark=new T.Color('#505456');
  const render=()=>{
   if(disposed||lost||document.hidden)return;
   const {position,reduced,material}=latest.current;if(position>=8)return;const p=Math.min(7,Math.max(0,position));
   const v=smooth(p-2),sp=smooth(p-4),ma=smooth(p-5);const background=new T.Color(String(material['--field' as keyof typeof material]||'#242728'));
   scene.background=background;fog.color.copy(background);fog.near=mobile?1450:1900;fog.far=mobile?3900:5100;
   stone.color.copy(pale).lerp(dark,smooth(p-1));floorMat.color.copy(background).lerp(new T.Color('#383d3e'),.45);
   aperture.intensity=95000+sp*65000;blue.emissiveIntensity=.4+smooth(p-3)*.35;
   camera.position.set(mobile?240:0,mobile?420:430,(mobile?1220:1120)+(reduced?0:sp*(mobile?35:100)+ma*(mobile?30:130)));
   let visibleParts=0;
   for(const part of parts){
    let t=part.stage===0?1:smooth(p-(part.stage-1));let {w,h,d,z}=part;const y=part.y;
    if(reduced&&part.stage>0)t=p>=part.stage?1:0;
    if(part.kind==='origin')d=8+170*v;
    else if(part.kind==='foundation'){w=170+710*smooth(p);h=3+58*v;d=8+170*v;}
    else if(part.kind==='recess'){d=8+167*v;w=3+42*v;}
    else if(part.kind==='aperture')z=850+173*v;
    else if(part.kind==='signal'||part.kind==='channel'){if(w>d)w*=t;else d*=t;}
    else if(part.stage>0){if(part.h<20){w*=t;d*=t;}else h*=t;}
    const omitted=mobile&&(part.kind==='distant'||part.kind==='bay'||['rib1','rib3','rib5'].includes(part.kind));
    part.mesh.visible=t>.001&&!omitted;if(part.mesh.visible)visibleParts++;
    part.mesh.scale.set(Math.max(.001,w),Math.max(.001,h),Math.max(.001,d));part.mesh.position.set(part.x+w/2,y+h/2,-z-d/2);
   }
   const t=performance.now();try{renderer.render(scene,camera);}catch{lost=true;latest.current.onFailure();return;}frames++;
   el.dataset.progress=p.toFixed(4);el.dataset.construction=parts.filter(a=>a.mesh.visible).map(a=>[a.kind,...a.mesh.scale.toArray(),...a.mesh.position.toArray()].join(',')).join(';');
   el.dataset.stats=JSON.stringify({cpuSubmitMs:performance.now()-t,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,visibleParts,dpr:renderer.getPixelRatio(),frames});
   if(!ready){el.dataset.initMs=String(performance.now()-started);ready=true;el.dataset.ready='true';latest.current.onReady();}
  };
  update.current=render;
  const resize=()=>{mobile=innerWidth<=800;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));renderer.setSize(w,h);if(mobile){camera.setViewOffset(1440,900,475,-10,510,900);}else{const scale=Math.max(w/1440,h/900),vw=w/scale,vh=h/scale;camera.setViewOffset(1440,900,(1440-vw)/2-20,(900-vh)/2+85,vw,vh);}render();};
  const observer=new ResizeObserver(resize);observer.observe(el);
  const visible=()=>{if(!document.hidden)render();};document.addEventListener('visibilitychange',visible);
  const loss=(event:Event)=>{event.preventDefault();lost=true;ready=false;el.dataset.ready='false';latest.current.onFailure();};renderer.domElement.addEventListener('webglcontextlost',loss);
  const benchmark=()=>{cancelAnimationFrame(frame);const times:number[]=[];let last=0,count=0;const tick=(t:number)=>{if(disposed||lost)return;if(last)times.push(t-last);last=t;render();if(++count<120)frame=requestAnimationFrame(tick);else{times.sort((a,b)=>a-b);el.dataset.benchmark=JSON.stringify({medianMs:times[Math.floor(times.length*.5)],p95Ms:times[Math.floor(times.length*.95)]});}};frame=requestAnimationFrame(tick);};el.addEventListener('dws-benchmark',benchmark);
  try{resize();}catch{latest.current.onFailure();}
  return()=>{disposed=true;update.current=null;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visible);el.removeEventListener('dws-benchmark',benchmark);renderer.domElement.removeEventListener('webglcontextlost',loss);unit.dispose();materials.forEach(m=>m.dispose());grain.dispose();environment.dispose();faces.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
 },[]);
 return <div className="ve-webgl ve-world" ref={host} aria-hidden="true"/>;
}
