import {useEffect,useRef,useState} from 'react';
import * as T from 'three';

/** Company only. Coordinates mirror the retained SVG model; no scroll controller. */
export default function CompanyRenderer({reduced=false}:{reduced?:boolean}){
 const host=useRef<HTMLDivElement>(null);const [error,setError]=useState('');
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const started=performance.now();let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setError('WebGL unavailable. Select Lightweight.');return;}
  const mobile=innerWidth<=800;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  el.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.background=new T.Color('#191c1e');scene.fog=new T.Fog('#242728',2100,6300);
  const camera=new T.PerspectiveCamera(2*Math.atan(450/960)*180/Math.PI,1440/900,5,12000);camera.position.set(0,430,reduced?1120:1350);
  const geometries:T.BufferGeometry[]=[];const materials:T.Material[]=[];
  // Small deterministic material map, created locally, never downloaded.
  const size=128,bytes=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;const v=Math.round(170+12*Math.sin(x*.13)*Math.cos(y*.09)+5*Math.sin(x*.63+y*.31));bytes.set([v,v,v,255],i);}
  const grain=new T.DataTexture(bytes,size,size,T.RGBAFormat);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(3,3);grain.needsUpdate=true;
  const mat=(color:string,roughness:number,metalness=0)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,roughnessMap:grain,bumpMap:grain,bumpScale:.035});materials.push(m);return m;};
  const stone=mat('#46443e',.94),metal=mat('#272b2d',.48,.7),limestone=mat('#b4a58b',.84),floorMat=mat('#383a36',.82,.06);
  const blue=new T.MeshStandardMaterial({color:'#2457ff',emissive:'#2457ff',emissiveIntensity:1.1,roughness:.6});materials.push(blue);
  const warm=new T.MeshStandardMaterial({color:'#ead3a2',emissive:'#e5b96e',emissiveIntensity:1.2});materials.push(warm);
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const g=new T.BoxGeometry(w,h,d);geometries.push(g);const mesh=new T.Mesh(g,m);mesh.position.set(x+w/2,y+h/2,-z-d/2);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;};
  // Exact fully constructed bounds from the SVG cuboids.
  box(330,0,850,170,760,178,stone);box(330,0,850,880,61,178,stone);
  box(1040,0,850,45,620,178,metal);box(1060,0,200,110,800,650,stone);
  box(420,0,2200,120,750,190,limestone);box(660,0,300,180,190,180,limestone);
  box(330,757,850,840,3,750,stone);
  for(let i=0;i<6;i++)box(500,742,850+i*115,540,16,18,metal);
  for(let i=0;i<3;i++){box(1040,0,1800+i*560,46,720,95,stone);box(330,718,1800+i*560,710,2,95,stone);}
  for(let i=0;i<4;i++)box(180+i*300,0,1900+i*160,75,440+i*80,150,stone);
  // Existing recessed return and narrow aperture emitter.
  box(500,62,850,45,678,175,metal);box(543,62,1023,2,678,2,warm);
  for(const y of [250,500])box(332,y,847,166,1.5,2,metal);
  box(479,16,847,10,728,2,metal);
  box(-4500,-9,-500,9000,8,8500,floorMat);
  const path=(x:number,z:number,w:number,d:number)=>{box(x-2,-.8,z-2,w+4,1,d+4,metal);box(x,0,z,w,1,d,blue);};
  path(560,100,2,750);path(560,100,480,2);path(330,850,2,1350);path(330,2200,840,2);path(1170,200,2,2000);
  path(400,800,2,2700);path(400,2400,1500,2);
  scene.add(new T.HemisphereLight('#e1d6c1','#262a2d',1.45));
  const sun=new T.DirectionalLight('#fff0dc',2.6);sun.position.set(250,1200,-450);sun.target.position.set(750,0,-1050);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?512:1024,mobile?512:1024);Object.assign(sun.shadow.camera,{left:-1700,right:1700,top:1600,bottom:-1600,near:1,far:6000});sun.shadow.normalBias=1.2;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun,sun.target);
  const aperture=new T.PointLight('#ffdfad',280000,1900,2);aperture.position.set(590,600,-900);scene.add(aperture);
  // A low-resolution local reflection probe supplies rough physical response.
  const target=new T.WebGLCubeRenderTarget(mobile?32:64,{type:T.HalfFloatType});const probe=new T.CubeCamera(5,6500,target);probe.position.set(740,160,-600);scene.add(probe);probe.update(renderer,scene);scene.environment=target.texture;scene.environmentIntensity=.22;
  let ready=false,disposed=false;let frame=0;
  const draw=()=>{if(disposed||document.hidden)return;const t=performance.now();renderer.render(scene,camera);const stats={initMs:ready?undefined:performance.now()-started,cpuSubmitMs:performance.now()-t,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,dpr:renderer.getPixelRatio(),shadowSize:mobile?512:1024};if(!ready){el.dataset.initMs=String(stats.initMs);ready=true;}el.dataset.stats=JSON.stringify(stats);el.dataset.ready='true';};
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);const scale=Math.max(w/1440,h/900);const vw=w/scale,vh=h/scale;camera.setViewOffset(1440,900,(1440-vw)/2-20,(900-vh)/2+85,vw,vh);draw();};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const visible=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',visible);
  // Explicit QA-only bounded render sample, never an idle animation loop.
  const benchmark=()=>{cancelAnimationFrame(frame);const times:number[]=[];let last=0,count=0;const tick=(t:number)=>{if(disposed)return;if(last)times.push(t-last);last=t;draw();if(++count<120)frame=requestAnimationFrame(tick);else{times.sort((a,b)=>a-b);el.dataset.benchmark=JSON.stringify({medianMs:times[Math.floor(times.length*.5)],p95Ms:times[Math.floor(times.length*.95)]});}};frame=requestAnimationFrame(tick);};
  el.addEventListener('dws-benchmark',benchmark);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visible);el.removeEventListener('dws-benchmark',benchmark);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());grain.dispose();target.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
 },[reduced]);
 return <div className="ve-webgl" ref={host} aria-hidden={!error}>{error&&<span role="status">{error}</span>}</div>;
}
