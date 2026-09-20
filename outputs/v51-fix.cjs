const fs=require('fs');let s=fs.readFileSync('src/Review51.tsx','utf8');
s=s.replace('<Artifact phase={started?7:0}/></div><p>', '<Artifact phase={started?7:0}/>{type&&<div className="r51-mobile-map">{map.phases.map((p,i)=><div key={p}><small>{String(i+1).padStart(2,\'0\')}</small><span>{p}</span><i aria-hidden="true"/></div>)}</div>}</div><p>');
fs.writeFileSync('src/Review51.tsx',s);
