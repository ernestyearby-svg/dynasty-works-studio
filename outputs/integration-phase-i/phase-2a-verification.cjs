const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });

  const checks = [];
  const check = (name, pass, detail = '') => {
    checks.push({ name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ': ' + detail : ''}`);
  };

  const BASE = 'http://127.0.0.1:5202';

  // 1. Check /work
  console.log('--- Checking /work ---');
  await page.goto(BASE + '/work');
  await page.waitForLoadState('networkidle');

  // Verify 0 ASSET SET PENDING
  const pendingCountWork = await page.locator(':has-text("ASSET SET PENDING")').count();
  check('/work zero placeholders', pendingCountWork === 0, `found ${pendingCountWork}`);

  // Verify all 3 project cards exist
  const mymosaLink = await page.locator('a[href="/work/mymosa"]').count();
  const iklaLink = await page.locator('a[href="/work/ikla-maison"]').count();
  const cliffsLink = await page.locator('a[href="/work/mr-cliffs"]').count();
  check('/work projects present', mymosaLink > 0 && iklaLink > 0 && cliffsLink > 0, `mymosa:${mymosaLink}, ikla:${iklaLink}, cliffs:${cliffsLink}`);

  // Verify images loaded with naturalWidth > 0 after scrolling into view
  const workImages = await page.locator('main img').all();
  let allWorkImagesLoaded = true;
  for (const img of workImages) {
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const loaded = await img.evaluate(el => el.complete && el.naturalWidth > 0);
    if (!loaded) allWorkImagesLoaded = false;
  }
  check('/work images loaded', allWorkImagesLoaded);

  // 2. Check /work/mymosa
  console.log('--- Checking /work/mymosa ---');
  await page.goto(BASE + '/work/mymosa');
  await page.waitForLoadState('networkidle');

  const pendingCountMymosa = await page.locator(':has-text("ASSET SET PENDING")').count();
  check('/work/mymosa zero placeholders', pendingCountMymosa === 0, `found ${pendingCountMymosa}`);

  // Check header links
  const wordmarkHref = await page.locator('.m53-wordmark').getAttribute('href');
  check('mymosa wordmark links to root /', wordmarkHref === '/');

  const builderHref = await page.locator('header a[href*="builder"]').getAttribute('href');
  check('mymosa builder links to /#review-builder', builderHref === '/#review-builder');

  // Check family seal and house seals in Act 03
  await page.locator('.m531-expand').click();
  const sealCount = await page.locator('.m531-house-seal').count();
  check('mymosa house seal rendered', sealCount > 0);

  const familySeal = page.locator('.m531-family-seal');
  await familySeal.scrollIntoViewIfNeeded();
  const familySealLoaded = await familySeal.evaluate(img => img.complete && img.naturalWidth > 0);
  check('mymosa family seal loaded', familySealLoaded);

  // Check Act 05 Commercial Exhibition
  const exhibitionHero = page.locator('.m531-exhibition-hero img');
  await exhibitionHero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const exhibitionHeroLoaded = await exhibitionHero.evaluate(img => img.complete && img.naturalWidth > 0);
  check('mymosa 8-flavor exhibition hero loaded', exhibitionHeroLoaded);

  const eightCan = page.locator('.m531-eight-can img');
  await eightCan.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const eightCanLoaded = await eightCan.evaluate(img => img.complete && img.naturalWidth > 0);
  check('mymosa 8-flavor can stage loaded', eightCanLoaded);

  // 3. Check /work/ikla-maison
  console.log('--- Checking /work/ikla-maison ---');
  await page.goto(BASE + '/work/ikla-maison');
  await page.waitForLoadState('networkidle');

  const pendingCountIkla = await page.locator(':has-text("ASSET SET PENDING")').count();
  check('/work/ikla-maison zero placeholders', pendingCountIkla === 0, `found ${pendingCountIkla}`);

  const iklaImages = await page.locator('main img').all();
  let allIklaLoaded = iklaImages.length >= 5;
  for (const img of iklaImages) {
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const loaded = await img.evaluate(el => el.complete && el.naturalWidth > 0);
    if (!loaded) allIklaLoaded = false;
  }
  check('/work/ikla-maison authentic images loaded', allIklaLoaded);

  const iklaNextHref = await page.locator('.next-project a[href="/work/mr-cliffs"]').count();
  check('/work/ikla-maison links to Mr Cliffs next', iklaNextHref > 0);

  // 4. Check /work/mr-cliffs
  console.log('--- Checking /work/mr-cliffs ---');
  await page.goto(BASE + '/work/mr-cliffs');
  await page.waitForLoadState('networkidle');

  const pendingCountCliffs = await page.locator(':has-text("ASSET SET PENDING")').count();
  check('/work/mr-cliffs zero placeholders', pendingCountCliffs === 0, `found ${pendingCountCliffs}`);

  const cliffsImages = await page.locator('main img').all();
  let allCliffsLoaded = cliffsImages.length >= 4;
  for (const img of cliffsImages) {
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const loaded = await img.evaluate(el => el.complete && el.naturalWidth > 0);
    if (!loaded) allCliffsLoaded = false;
  }
  check('/work/mr-cliffs authentic assets loaded', allCliffsLoaded);

  const cliffsTitle = await page.locator('h1').textContent();
  check('/work/mr-cliffs title rendered', cliffsTitle.includes("Mr. Cliff"));

  // 5. Responsive zero horizontal overflow test
  console.log('--- Checking viewports (320, 390, 768, 1440) for zero overflow ---');
  const viewports = [320, 390, 768, 1440];
  const testRoutes = ['/work', '/work/mymosa', '/work/ikla-maison', '/work/mr-cliffs'];

  for (const route of testRoutes) {
    for (const w of viewports) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(BASE + route);
      await page.waitForLoadState('domcontentloaded');
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      check(`${route} @ ${w}px zero overflow`, !overflow);
    }
  }

  const failed = checks.filter(c => !c.pass);
  console.log(`\n=== Verification Summary: ${checks.length} passed, ${failed.length} failed ===`);

  fs.writeFileSync('outputs/integration-phase-i/phase-2a-results.json', JSON.stringify({ checks, failed }, null, 2));

  await browser.close();
  if (failed.length > 0) process.exit(1);
})();
