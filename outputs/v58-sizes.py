from pathlib import Path
import re,gzip,json
root=Path('experience-integration/dist');html=(root/'index.html').read_text();initial=[]
for name in re.findall(r'src="(/assets/[^\"]+\.js)"',html):
 b=(root/name.lstrip('/')).read_bytes();initial.append({'name':name,'bytes':len(b),'gzip':len(gzip.compress(b))})
print(json.dumps({'initial':initial,'total':sum(a['bytes']for a in initial),'gzip':sum(a['gzip']for a in initial)}))
