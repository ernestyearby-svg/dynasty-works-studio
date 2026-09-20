from pathlib import Path
p=Path('src/VisualEnvironmentLab.tsx')
s=p.read_text(encoding='utf-8').replace('export default function VisualEnvironmentLab(){','export default function VisualEnvironmentLab({candidate=false}:{candidate?:boolean}){').replace("document.title='DWS — V5.7 Cinematic Environment Lab';","if(!candidate)document.title='DWS — V5.7 Cinematic Environment Lab';").replace('cancelAnimationFrame(id);},[]);','cancelAnimationFrame(id);},[candidate]);').replace('const choose=(value:boolean)=>{setReady(false);','const choose=(value:boolean)=>{if(value===cinematic&&!failed)return;setReady(false);').replace('<div className="ve-render-toggle" role=', '{!candidate&&<div className="ve-render-toggle" role=').replace('fallback active</span>}</div></>;','fallback active</span>}</div>}</>;')
p.write_text(s,encoding='utf-8')
Path('src/CinematicHome.tsx').write_text("import VisualEnvironmentLab from './VisualEnvironmentLab';\nexport default function CinematicHome(){return <VisualEnvironmentLab candidate/>;}\n",encoding='utf-8')
p=Path('src/main.tsx');s=p.read_text(encoding='utf-8').replace("home:()=>import('./Review52')","home:()=>import('./CinematicHome')")
s=s.replace("const {default:Page}=await loaders[route]();", "const {default:Page}=await loaders[route]();\nconst room=path==='/'||path==='/v5-2-review'?'creation':path==='/work'?'gallery':path.startsWith('/concept-lab')?'laboratory':path==='/studio'?'human':null;\nif(room){document.body.dataset.cinematicRoom=room;await import('./cinematic-rooms.css');}")
p.write_text(s,encoding='utf-8')
