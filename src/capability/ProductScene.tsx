import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
export type ProductView='Object'|'Orthographic'|'Wireframe'|'Assembly';
export default function ProductScene({view,finish,light,angle}:{view:ProductView;finish:string;light:number;angle:number}){
 const host=useRef<HTMLDivElement>(null);const update=useRef<((v:ProductView,f:string,l:number,a:number)=>void)|null>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=host.current!;let disposed=false;let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;el.appendChild(renderer.domElement);
  const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1,.01,80);camera.position.set(1.05,.85,1.45);
  const ortho=new T.OrthographicCamera(-.42,.42,.42,-.42,.01,80);ortho.position.set(0,.27,3);ortho.lookAt(0,.27,0);let active:T.Camera=camera;
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.23,0);controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI/2.05;controls.update();
  const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.05);scene.environment=env.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();
  const metal=new T.MeshStandardMaterial({color:'#bbc0c3',metalness:.88,roughness:.28});const black=new T.MeshStandardMaterial({color:'#181d20',metalness:.6,roughness:.37});const emitter=new T.MeshStandardMaterial({color:'#f5e4c2',emissive:'#ffe2a3',emissiveIntensity:2});const cobalt=new T.MeshStandardMaterial({color:'#2457ff',metalness:.25,roughness:.45});
  const group=new T.Group();scene.add(group);const geometries:T.BufferGeometry[]=[];const parts:{mesh:T.Mesh;home:T.Vector3;travel:T.Vector3}[]=[];
  const piece=(w:number,h:number,d:number,x:number,y:number,z:number,mat:T.Material,travel:T.Vector3=new T.Vector3())=>{const geo=new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.15);geometries.push(geo);const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);parts.push({mesh:m,home:m.position.clone(),travel});return m};
  piece(.23,.018,.145,-.025,.009,0,black,new T.Vector3(0,-.015,0));
  piece(.225,.004,.14,-.025,.021,0,metal);
  piece(.023,.348,.026,-.108,.195,0,metal,new T.Vector3(-.07,0,0));
  piece(.009,.327,.012,-.086,.19,0,black,new T.Vector3(-.045,0,.02));
  piece(.42,.029,.052,.074,.382,0,metal,new T.Vector3(0,.055,0));
  piece(.384,.007,.037,.086,.364,0,black,new T.Vector3(0,.01,0));
  piece(.352,.003,.021,.097,.359,0,emitter,new T.Vector3(0,-.035,0));
  piece(.006,.004,.022,.288,.379,0,black,new T.Vector3(.04,.055,0));
  piece(.024,.001,.008,.018,.024,.034,cobalt);
  for(let i=0;i<23;i++)piece(.002,.001,.033,-.06+i*.013,.397,0,black,new T.Vector3(0,.055,0));
  const screwGeo=new T.CylinderGeometry(.0025,.0025,.002,16);geometries.push(screwGeo);for(const x of [-.12,.07])for(const z of [-.048,.048]){const screw=new T.Mesh(screwGeo,black);screw.position.set(x,.024,z);group.add(screw)}
  const floorGeo=new T.PlaneGeometry(200,200);geometries.push(floorGeo);const floorMat=new T.ShadowMaterial({opacity:.4});const floor=new T.Mesh(floorGeo,floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.022;floor.receiveShadow=true;scene.add(floor);
  scene.add(new T.HemisphereLight('#d4dee6','#373737',1.3));const key=new T.DirectionalLight('#f3e7d0',3);key.position.set(-1,2,1);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-1;key.shadow.camera.right=1;key.shadow.camera.top=1;key.shadow.camera.bottom=-1;key.shadow.normalBias=.008;scene.add(key);const edge=new T.DirectionalLight('#a9bed3',2);edge.position.set(1,1,-1);scene.add(edge);const pool=new T.PointLight('#ffda9b',.16,1.2);pool.position.set(.05,.34,.04);scene.add(pool);
  let inView=true;const render=()=>{if(!disposed&&inView&&!document.hidden)renderer.render(scene,active)};
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();ortho.left=-.34*w/h;ortho.right=.34*w/h;ortho.updateProjectionMatrix();render()};
  update.current=(v,f,l,a)=>{active=v==='Orthographic'?ortho:camera;controls.enabled=v!=='Orthographic';group.rotation.y=a*Math.PI/180;metal.color.set(f==='Graphite'?'#3d4548':'#bbc0c3');metal.roughness=f==='Graphite'?.48:.28;metal.wireframe=v==='Wireframe';black.wireframe=v==='Wireframe';emitter.emissiveIntensity=l/30;pool.intensity=l/500;parts.forEach(p=>p.mesh.position.copy(p.home).addScaledVector(p.travel,v==='Assembly'?1:0));render()};
  controls.addEventListener('change',render);const ro=new ResizeObserver(resize);ro.observe(el);const io=new IntersectionObserver(e=>{inView=e[0].isIntersecting;if(inView)render()});io.observe(el);document.addEventListener('visibilitychange',render);const loss=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',loss);resize();
  return()=>{disposed=true;update.current=null;ro.disconnect();io.disconnect();controls.dispose();document.removeEventListener('visibilitychange',render);renderer.domElement.removeEventListener('webglcontextlost',loss);geometries.forEach(g=>g.dispose());[metal,black,emitter,cobalt,floorMat].forEach(m=>m.dispose());env.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()};
 },[]);
 useEffect(()=>update.current?.(view,finish,light,angle),[view,finish,light,angle]);
 return <div className="pd-render" ref={host} role="img" aria-label={`Linear task light study. ${view} view, ${finish} finish. Conceptual dimensions 420 by 145 by 397 millimeters.`}>{failed&&<div className="pd-fallback"><svg viewBox="0 0 600 500" aria-hidden="true"><path d="M170 420V100H500V120H190V420ZM100 420H310V438H100Z" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M210 126H480" stroke="#2457ff" strokeWidth="5"/></svg><p>Orthographic fallback · Interactive 3D unavailable</p></div>}</div>
}
