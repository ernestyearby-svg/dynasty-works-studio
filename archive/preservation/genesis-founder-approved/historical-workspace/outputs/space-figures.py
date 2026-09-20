from pathlib import Path
p=Path('src/capability/SpaceScene.tsx');s=p.read_text();s=s.replace(' // Architectural cut-out figures:', " const humanInk=peopleMat.clone(),occupationInk=peopleMat.clone();humanInk.transparent=occupationInk.transparent=true;mats.push(humanInk,occupationInk);\n // Architectural cut-out figures:")
s=s.replace(" const g=new T.Group();g.position.set(x,.12,z);g.rotation.y=angle;parent.add(g);", " const figureInk=parent===human?humanInk:occupationInk;const g=new T.Group();g.position.set(x,.12,z);g.rotation.y=angle;parent.add(g);")
a=s.index(' function person(');b=s.index(' person(0,3.5',a);s=s[:a]+s[a:b].replace(',peopleMat)',',figureInk)')+s[b:]
s=s.replace('human.scale.y=ramp(p,.72,.84);occupation.visible=p>.85;occupation.scale.y=ramp(p,.85,1);','humanInk.opacity=ramp(p,.72,.84);occupation.visible=p>.88;occupationInk.opacity=ramp(p,.88,1);')
p.write_text(s)
