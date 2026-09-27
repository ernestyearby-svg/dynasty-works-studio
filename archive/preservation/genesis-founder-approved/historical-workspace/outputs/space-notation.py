from pathlib import Path
p=Path('src/capability/SpaceScene.tsx');s=p.read_text();s=s.replace("c.width=640;c.height=96;const ctx=c.getContext('2d')!;ctx.fillStyle='#545b51';ctx.font='28px monospace';ctx.fillText(text,6,56);", "const measure=c.getContext('2d')!;measure.font='32px monospace';c.width=Math.ceil(measure.measureText(text).width)+16;c.height=52;const ctx=c.getContext('2d')!;ctx.fillStyle='#40483f';ctx.font='32px monospace';ctx.fillText(text,8,37);")
s=s.replace('sprite.scale.set(width,width*.15,1)','sprite.scale.set(width,width*52/c.width,1)')
s=s.replace('path.visible=p>.30&&p<.85','path.visible=p>.30&&p<.50')
p.write_text(s)
