import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const viewports = [
  { name: 'Mobile Mini', width: 320, height: 640 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone Pro Max', width: 430, height: 932 },
  { name: 'iPad Portrait', width: 768, height: 1024 },
  { name: 'iPad Landscape', width: 1024, height: 768 },
  { name: 'Desktop Standard', width: 1440, height: 900 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '2K / 4K Ultrawide', width: 2560, height: 1440 },
];

const routes = [
  '/',
  '/privacy',
  '/terms',
  '/founder-blueprint',
  '/studio',
  '/contact',
];

async function runAudit() {
  console.log('Starting preview server for viewport overflow audit...');
  const port = 5244;
  const server = spawn('npx', ['vite', 'preview', '--config', 'vite.integration-phase-i.ts', '--port', String(port)], {
    shell: true,
    stdio: 'ignore',
  });

  await new Promise((r) => setTimeout(r, 2500));

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });

  let totalChecks = 0;
  let passedChecks = 0;
  const failures: string[] = [];

  try {
    for (const vp of viewports) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      for (const route of routes) {
        totalChecks++;
        const targetUrl = `http://127.0.0.1:${port}${route}`;
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(400);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          const max = Math.max(scrollWidth, bodyScrollWidth);
          return {
            hasOverflow: max > innerWidth + 1, // allow 1px subpixel rounding tolerance
            innerWidth,
            max,
            diff: max - innerWidth,
          };
        });

        if (!overflow.hasOverflow) {
          passedChecks++;
          console.log(`  [✓ PASS] ${route} (width: ${overflow.innerWidth}px, scroll: ${overflow.max}px)`);
        } else {
          failures.push(`${vp.name} (${vp.width}px) on ${route}: scrollWidth ${overflow.max}px > innerWidth ${overflow.innerWidth}px`);
          console.error(`  [✗ FAIL] ${route} OVERFLOW: ${overflow.diff}px excess`);
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log('\n=============================================================');
  console.log(`VIEWPORT AUDIT SUMMARY: ${passedChecks}/${totalChecks} PASSED`);
  if (failures.length > 0) {
    console.error(`FAILURES (${failures.length}):\n` + failures.join('\n'));
    process.exit(1);
  } else {
    console.log('ALL VIEWPORTS FREE OF HORIZONTAL OVERFLOW.');
    console.log('=============================================================\n');
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('Viewport audit failed:', err);
  process.exit(1);
});
