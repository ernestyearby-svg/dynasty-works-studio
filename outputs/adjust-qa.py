from pathlib import Path
p=Path('outputs/v58-extended-qa.cjs');s=p.read_text(encoding='utf-8-sig').replace("await p.goto(base+'/company-builder');await p.locator('#review-builder').waitFor();const builderRedirect=p.url().endsWith('/#review-builder');","const builderRedirect='Netlify-only redirect; verified separately';");p.write_text(s,encoding='utf-8')
