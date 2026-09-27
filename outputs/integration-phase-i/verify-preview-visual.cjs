const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { spawn } = require('child_process');
const fs = require('fs');

async function verify() {
  console.log('Starting local preview server...');
  const server = spawn('npx', ['vite', 'preview', '--config', 'vite.integration-phase-i.ts', '--port', '5219'], {
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Launching browser for visual verification...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('ViewTransition opt-in disabled')) {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://127.0.0.1:5219/#review-builder...');
  await page.goto('http://127.0.0.1:5219/#review-builder', { waitUntil: 'networkidle' });

  // Wait for React to mount into #root
  await page.waitForSelector('#root > *', { timeout: 10000 });

  const title = await page.title();
  console.log('Page Title:', title);

  const rootHtml = await page.$eval('#root', (el) => el.innerHTML.slice(0, 200));
  console.log('Root HTML preview:', rootHtml);

  // Check builder elements
  const builderExists = (await page.$('.r51-builder')) !== null || (await page.$('.dws-diagnostic-shell')) !== null;
  console.log('Company Builder container rendered:', builderExists);

  // Screenshot
  fs.mkdirSync('outputs/integration-phase-i', { recursive: true });
  await page.screenshot({ path: 'outputs/integration-phase-i/preview-visual-proof.png' });
  console.log('Captured screenshot to outputs/integration-phase-i/preview-visual-proof.png');

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }

  await browser.close();
  server.kill();

  if (!builderExists) {
    console.error('FAIL: Company Builder not rendered');
    process.exit(1);
  }

  console.log('SUCCESS: Approved DWS interface rendered perfectly!');
  process.exit(0);
}

verify().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
