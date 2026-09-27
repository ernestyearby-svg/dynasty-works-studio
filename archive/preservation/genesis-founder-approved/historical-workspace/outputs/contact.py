from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
p=Path('outputs/phase-ii-founder-gate'); files=[f for f in sorted(p.glob('*.png')) if 'draft' not in f.name and 'sheet' not in f.name]
out=Image.new('RGB',(1500,((len(files)+2)//3)*380),'#fff');d=ImageDraw.Draw(out)
for i,f in enumerate(files):
 im=Image.open(f);im.thumbnail((490,345));x=(i%3)*500;y=(i//3)*380;out.paste(im,(x,y));d.text((x+8,y+352),f.name,fill='black')
out.save(p/'inspection-sheet.jpg')
