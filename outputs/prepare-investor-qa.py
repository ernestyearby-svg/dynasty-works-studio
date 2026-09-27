from pathlib import Path
for source,target in [('v58-qa.cjs','v58-investor-qa.cjs'),('v58-extended-qa.cjs','v58-investor-extended-qa.cjs')]:
 s=Path('outputs',source).read_text(encoding='utf-8-sig').replace('outputs/v58-','outputs/v58-investor-')
 s=s.replace("p.waitForURL('**/work')",r"p.waitForURL(/\/work\/?$/)").replace("p.waitForURL('**/work/mymosa')",r"p.waitForURL(/\/work\/mymosa\/?$/)")
 s=s.replace("const builderRedirect='Netlify-only redirect; verified separately';","await p.goto(base+'/company-builder');await p.locator('#review-builder').waitFor();const builderRedirect=p.url().endsWith('/#review-builder');")
 Path('outputs',target).write_text(s,encoding='utf-8')
