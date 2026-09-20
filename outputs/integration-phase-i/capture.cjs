const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:5202/');
  await p.waitForLoadState('networkidle');
  await p.screenshot({ path: 'outputs/integration-phase-i/hero.png' });

  await p.locator('#work').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'outputs/integration-phase-i/selected-work.png' });

  await p.locator('#creation').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'outputs/integration-phase-i/creation-chamber.png' });

  await p.locator('#capabilities').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'outputs/integration-phase-i/capabilities.png' });

  await p.locator('#studio').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'outputs/integration-phase-i/studio.png' });

  await b.close();
  console.log('Screenshots captured successfully');
})();
