from pathlib import Path
from PIL import Image,ImageDraw,ImageCms,ImageFont
import numpy as np,json,hashlib,shutil
O=Path('outputs/phase5c11c-hero-candidate-02');R=Path(r'C:\Users\ernes\OneDrive\Documents\ChatGPT\N8N rewire');S=Path(r'C:\Users\ernes\Downloads\ChatGPT Image Sep 18, 2026, 08_09_17 AM.png');P=R/'native-sources/MYMOSA_2026_HERO_PHASE5C11B_ALPHA_INTAKE/ORIGINAL_SUPPLIED_HERO.png';REF=R/'evidence/MYMOSA_2026_REFERENCE/CLASSIC_ORANGE_2026_USER_REFERENCE.jpg';V=R/'design-masters/MYMOSA_355_CLASSIC_ORANGE_v003';N='MYMOSA_CLASSIC_ORANGE_HERO_CANDIDATE_02'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
shutil.copyfile(S,O/'ORIGINAL_SUPPLIED_HERO_02.png');im=Image.open(S);old=Image.open(P);ref=Image.open(REF);a=np.array(im.getchannel('A'));rgb=np.array(im.convert('RGB'))
def bbox(mask):
 y,x=np.where(mask);return [int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)]
stats={'dimensions':im.size,'mode':im.mode,'alpha_present':'A' in im.getbands(),'fully_transparent_pixels':int((a==0).sum()),'partially_transparent_pixels':int(((a>0)&(a<255)).sum()),'opaque_pixels':int((a==255).sum()),'alpha_range':[int(a.min()),int(a.max())],'visible_bbox_alpha16':bbox(a>=16),'icc_embedded':bool(im.info.get('icc_profile'))}
for name,b in {'empty_bowl':[440,160,510,235],'stem':[495,1050,520,1200],'base':[450,1430,550,1470]}.items():
 x,y,X,Y=b;z=a[y:Y,x:X];stats[name]={'box':b,'mean_alpha':float(z.mean()),'range':[int(z.min()),int(z.max())]}
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',19)
def label(im,text,pos=(14,12)):ImageDraw.Draw(im).text(pos,text,font=font,fill='#222222')
def place(bg,asset,box):
 z=asset.copy();z.thumbnail((box[2],box[3]),Image.Resampling.LANCZOS);bg.alpha_composite(z,(box[0]+(box[2]-z.width)//2,box[1]+(box[3]-z.height)//2))
# Native CMYK background grid, sampled back to RGB for diagnostic compositing only.
data=json.loads((V/'MYMOSA_355_CLASSIC_ORANGE_DESIGN_v003_EDITABLE_SOURCE.json').read_text());grid=np.array(data['background']['cmyk_grid'],dtype='uint8');icc=ImageCms.getOpenProfile(str(V/'source/PROVISIONAL_FOGRA39.icc'));srgb=ImageCms.createProfile('sRGB');native=ImageCms.profileToProfile(Image.fromarray(grid,'CMYK'),icc,srgb,outputMode='RGB').resize((1280,1039),Image.Resampling.BILINEAR)
native.save(O/'V003_NATIVE_CMYK_BACKGROUND_EVALUATION.png')
orange=ref.getpixel((60,60));gold=ref.getpixel((840,480));stats['test_colors']={'orange_reference_sample':orange,'gold_reference_sample':gold}
board=Image.new('RGBA',(1500,1540),'#dddddd')
for i,(title,color) in enumerate([('WHITE','white'),('BLACK','black'),('50% GRAY','#808080'),('MYMOSA ORANGE',orange),('MYMOSA GOLD',gold),('v003 NATIVE CMYK FIELD',None)]):
 x=(i%3)*500;y=(i//3)*770;panel=Image.new('RGBA',(500,725),color or 'white')
 if color is None:panel=native.crop((470,250,850,850)).resize((500,725)).convert('RGBA')
 place(panel,im,(0,0,500,725));board.alpha_composite(panel,(x,y+40));label(board,title,(x+12,y+10))
board.convert('RGB').save(O/(N+'_TRANSMISSION_TEST.png'))
comp=Image.new('RGBA',(1200,950),'#f5e8cd');label(comp,'APPROVED 2026 REFERENCE (base obscured)',(15,12));label(comp,'CANDIDATE 02 / height-normalized',(615,12));place(comp,ref.crop((520,270,795,845)).convert('RGBA'),(0,50,600,880));place(comp,im.crop(tuple(stats['visible_bbox_alpha16'])),(600,50,600,880));comp.convert('RGB').save(O/(N+'_REFERENCE_COMPARISON.png'))
comp=Image.new('RGBA',(1200,950),'#f5e8cd')
for j,(asset,title) in enumerate([(old,'CANDIDATE 01 / REJECTED - REFERENCE'),(im,'CANDIDATE 02 / NOT APPROVED')]):
 ar=np.array(asset.getchannel('A'));place(comp,asset.crop(tuple(bbox(ar>=16))),(600*j,50,600,880));label(comp,title,(600*j+15,12))
comp.convert('RGB').save(O/'MYMOSA_CLASSIC_ORANGE_HERO_CANDIDATE_01_VS_02.png')
# Controlled relative-colorimetric+BPC evaluation, original RGB and alpha preserved separately.
srcprof=ImageCms.ImageCmsProfile(__import__('io').BytesIO(im.info['icc_profile'])) if im.info.get('icc_profile') else srgb
cmyk=ImageCms.profileToProfile(im.convert('RGB'),srcprof,icc,outputMode='CMYK',renderingIntent=1,flags=8192);cmyk.save(O/(N+'_CMYK_EVALUATION.tif'),compression='tiff_lzw',icc_profile=icc.tobytes());im.getchannel('A').save(O/(N+'_ORIGINAL_ALPHA.png'))
proof=ImageCms.profileToProfile(cmyk,icc,srgb,outputMode='RGB',renderingIntent=1,flags=8192);proof.putalpha(im.getchannel('A'));proof.save(O/(N+'_CMYK_ROUNDTRIP_PROOF.png'))
cp=Image.new('RGBA',(1000,780),'#E99A22');place(cp,im,(0,40,500,730));place(cp,proof,(500,40,500,730));label(cp,'RGB SOURCE',(12,12));label(cp,'FOGRA39 EVALUATION',(512,12));cp.convert('RGB').save(O/(N+'_COLOR_COMPARISON.png'))
delta=np.abs(np.array(proof.convert('RGB')).astype(float)-rgb);stats['cmyk_eval']={'profile':str(V/'source/PROVISIONAL_FOGRA39.icc'),'profile_hash':sha(V/'source/PROVISIONAL_FOGRA39.icc'),'intent':'relative colorimetric, black point compensation','input_profile':'embedded' if im.info.get('icc_profile') else 'ASSUMED sRGB','mean_absolute_rgb_change_visible':float(delta[a>=128].mean()),'printer_approval':'UNRESOLVED','alpha':'separate original alpha companion; TIFF is color evaluation only'}
b=stats['visible_bbox_alpha16'];stats['placement']={'status':'PROVISIONAL carried from prior intake; final placement not approved','height_mm':79.62656400384985,'width_mm':(b[2]-b[0])/(b[3]-b[1])*79.62656400384985,'effective_dpi':(b[3]-b[1])/79.62656400384985*25.4}
manifest={'asset_id':N,'status':'CANDIDATE — NOT APPROVED','provenance':'NEW CROWN BRIDGE RECONSTRUCTED PRODUCTION ASSET; ownership per user','source_path':str(S),'preserved_source':str((O/'ORIGINAL_SUPPLIED_HERO_02.png').resolve()),'sha256':sha(S),'preserved_hash':sha(O/'ORIGINAL_SUPPLIED_HERO_02.png'),'visual_authority':str(REF),'reference_sha256':sha(REF),'candidate_01':{'path':str(P),'sha256':sha(P),'status':'REJECTED / REFERENCE'},'canonical_promotion':False}
(O/(N+'_MANIFEST.json')).write_text(json.dumps(manifest,indent=2));(O/(N+'_VALIDATION.json')).write_text(json.dumps(stats,indent=2));print(json.dumps(stats,indent=2));print('SHA256',sha(S))
