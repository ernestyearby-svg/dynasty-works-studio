const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE_URL = 'http://localhost:5202';
const ARTIFACTS_DIR = 'C:/Users/ernes/.gemini/antigravity/brain/2c33a8ae-250a-4ccd-be78-c14c1829ccbe/screenshots';

async function capturePostRoadmap() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: EDGE_PATH,
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log('Navigating to homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Click "Start Your Roadmap"
    const startBtn = page.locator('button:has-text("Start Your Roadmap")').first();
    await startBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await startBtn.click();
    console.log('1. Clicked "Start Your Roadmap"...');
    await page.waitForTimeout(600);

    // 2. Select business type: "Consumer Brand"
    const typeBtn = page.locator('.r51-business-types button').first();
    await typeBtn.click();
    console.log('2. Clicked business type...');
    await page.waitForTimeout(600);

    // 3. Step 0: Check the first starting point checkbox
    const firstCheckbox = page.locator('.dws-check-card input[type="checkbox"]').first();
    if (await firstCheckbox.count() > 0) {
      await firstCheckbox.check();
      console.log('3. Checked starting point checkbox...');
      await page.waitForTimeout(400);
    }

    // 4. Click .primary-action to go to Step 1 ('Continue ->')
    const primaryBtn0 = page.locator('.diagnostic-actions .primary-action');
    await primaryBtn0.click();
    console.log('4. Clicked Continue to step 1...');
    await page.waitForTimeout(800);

    // 5. Step 1: Click .primary-action to complete diagnostic ('Create roadmap ->')
    const primaryBtn1 = page.locator('.diagnostic-actions .primary-action');
    await primaryBtn1.click();
    console.log('5. Clicked Create roadmap...');
    await page.waitForTimeout(1000);

    // 6. Commercial Section should now be rendered
    const commercialSection = page.locator('.dws-growth-engine-commercial-section');
    if (await commercialSection.count() > 0) {
      await commercialSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await commercialSection.screenshot({
        path: path.join(ARTIFACTS_DIR, 'desktop_homepage_post_roadmap_offer.png'),
      });
      console.log('SUCCESS: desktop_homepage_post_roadmap_offer.png captured!');
    } else {
      console.warn('Commercial section not found, capturing builder');
      const builder = page.locator('#review-builder');
      await builder.screenshot({
        path: path.join(ARTIFACTS_DIR, 'desktop_homepage_builder_state.png'),
      });
    }

    await context.close();
  } finally {
    await browser.close();
  }
}

capturePostRoadmap().catch((e) => {
  console.error(e);
  process.exit(1);
});
