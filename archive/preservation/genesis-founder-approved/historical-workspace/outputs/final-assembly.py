from pathlib import Path
p=Path('src/capability/PackagingScene.tsx');s=p.read_text();s=s.replace("tray.position.set(0,.22+clamp((p-.5)/.25)*.40+lift*.35,-(1-clamp((p-.48)/.3))*3.4);tray.visible=p>.30;crown.position.set(0,1.33+open*.55+lift*.18,-(1-clamp((p-.6)/.4))*2.5);crown.visible=p>.5;", "tray.position.set(0,.62+(1-clamp((p-.42)/.33))*1.4+lift*.35,0);tray.visible=p>.4;crown.position.set(0,1.33+(1-clamp((p-.65)/.35))*.8+open*.55+lift*.18,0);crown.visible=p>.65;")
p.write_text(s)
