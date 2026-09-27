from pathlib import Path
s=Path('outputs/deploy-v58.cjs').read_text(encoding='utf-8-sig')
s=s.replace("const site=JSON.parse(fs.readFileSync('outputs/v54-candidate-site.json','utf8').replace(/^\\uFEFF/,''));if(site.id!=='d20efde7-2f7e-4b8f-bea1-0db3670ee6fb')throw Error('Unexpected candidate target');", "const site={id:'ffba4ed6-5c88-4f24-b8d0-cb837a0c60b7'};")
s=s.replace('DWS V5.8 cinematic candidate ','Founder-approved V5.8 investor review ').replace('outputs/v58-deploy.json','outputs/v58-investor-deploy.json').replace("{files,draft:true,branch:'codex/v5.8-cinematic-candidate'}","{files,draft:true,branch:'codex/v5.8-cinematic-candidate',commit_ref:sha}")
Path('outputs/deploy-v58-investor.cjs').write_text(s,encoding='utf-8')
