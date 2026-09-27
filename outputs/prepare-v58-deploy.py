from pathlib import Path
p=Path('outputs/deploy-environment-lab.cjs');s=p.read_text(encoding='utf-8-sig').replace('DWS Visual Environment Lab ','DWS V5.8 cinematic candidate ').replace('codex/visual-environment-lab','codex/v5.8-cinematic-candidate').replace('outputs/environment-deploy.json','outputs/v58-deploy.json');Path('outputs/deploy-v58.cjs').write_text(s,encoding='utf-8')
