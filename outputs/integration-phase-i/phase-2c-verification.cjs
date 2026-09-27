const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = 'outputs/phase-2c';
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  const checks = [];
  const check = (name, pass, detail = '') => {
    checks.push({ name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ': ' + detail : ''}`);
  };

  const BASE = 'http://127.0.0.1:5202';

  console.log('--- 1. Testing Company Builder Entry & Proportions (Desktop 1440px) ---');
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  // Verify Header copy
  const builderHeader = await page.locator('#review-builder header').textContent();
  check(
    'Builder header has "Build the architecture before building the company"',
    builderHeader.includes('Build the architecture') && builderHeader.includes('before building the company'),
    builderHeader
  );

  // Check reduced headline scale on desktop (clamp max <= 105px, not 150px)
  const h2FontSize = await page.locator('#review-builder h2').evaluate((el) => {
    return parseFloat(window.getComputedStyle(el).fontSize);
  });
  check('Desktop H2 font size scaled down to balanced proportion (< 110px)', h2FontSize <= 110, `fontSize: ${h2FontSize}px`);

  // Scroll to Builder entry
  const builderLocator = page.locator('#review-builder');
  await builderLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Capture 01-entry-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '01-entry-desktop-1440.png') });
  check('Capture 01-entry-desktop-1440.png saved', true);

  // Click Start your roadmap CTA
  const startCta = page.getByRole('button', { name: 'Start your roadmap', exact: false });
  const ctaBox = await startCta.boundingBox();
  check('Start CTA has architectural proportions (height >= 50px)', ctaBox.height >= 50, `height: ${ctaBox.height}px`);

  await startCta.click();
  await page.waitForTimeout(200);

  // Capture 02-diagnostic-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '02-diagnostic-desktop-1440.png') });
  check('Capture 02-diagnostic-desktop-1440.png saved', true);

  console.log('--- 2. Testing Diagnostic Flow & Form Controls Validation ---');
  // Select "Food / Beverage"
  await page.getByRole('button', { name: 'Food / Beverage', exact: true }).click();
  await page.waitForTimeout(200);

  // Step 2: Where does it stand?
  await page.locator('#business-stage').selectOption('Preparing to launch');
  await page.getByRole('checkbox', { name: 'I have a name.', exact: true }).check();
  await page.getByRole('checkbox', { name: 'I already have branding.', exact: true }).check();

  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForTimeout(200);

  // Step 3: What does it need?
  await page.getByRole('checkbox', { name: 'Packaging', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Website', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Distribution Strategy', exact: true }).check();

  // Test Optional Commercial Context accordion
  const contextToggle = page.locator('.dws-context-toggle');
  await contextToggle.click();
  await page.waitForTimeout(200);

  const compNameInput = page.locator('#company-name');
  await compNameInput.fill('Aethelgard Botanical Spirits');
  const compNameBox = await compNameInput.boundingBox();
  check('Company name input rendered as deliberate full-width field (width > 200px, height >= 44px)', compNameBox.width > 200 && compNameBox.height >= 44, `w:${compNameBox.width}, h:${compNameBox.height}`);

  await page.locator('#launch-window').selectOption('3–6 Months');
  await page.locator('#budget-choice').selectOption('I have a range in mind');
  await page.locator('#budget-note').fill('$150,000 – $250,000 initial allocation');

  // Click Create roadmap
  await page.getByRole('button', { name: 'Create roadmap', exact: false }).click();
  await page.waitForSelector('.roadmap-result');
  check('Executive roadmap generated', true);

  console.log('--- 3. Testing Executive Roadmap Top Presentation (Desktop) ---');
  const execRoadmap = page.locator('#executive-roadmap');
  await execRoadmap.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Capture 03-roadmap-top-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '03-roadmap-top-desktop-1440.png') });
  check('Capture 03-roadmap-top-desktop-1440.png saved', true);

  // Verify Macro Landmarks present
  const macroLandmarks = await page.locator('.dws-macro-landmark').count();
  check('Macro creation landmarks present', macroLandmarks >= 2, `found ${macroLandmarks} active landmarks`);

  // Verify Service table rows & dependencies
  const serviceRows = await page.locator('.dws-service-row').count();
  check('Sequential service rows rendered', serviceRows >= 5, `found ${serviceRows} services`);

  console.log('--- 4. Testing Commercial Continuation, Truthful CTA & Lead Form Controls ---');
  // Scroll to Commercial Ladder & Lead Capture
  const ladder = page.locator('.dws-commercial-ladder');
  await ladder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Capture 04-roadmap-continuation-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '04-roadmap-continuation-desktop-1440.png') });
  check('Capture 04-roadmap-continuation-desktop-1440.png saved', true);

  // Check Commercial Ladder hierarchy
  const blueprintCta = page.locator('.dws-ladder-cta-primary');
  check('Primary commercial action is "Explore Founder Blueprint"', (await blueprintCta.textContent()).includes('Explore Founder Blueprint'));
  check('Blueprint CTA links to /founder-blueprint', (await blueprintCta.getAttribute('href')) === '/founder-blueprint');

  const studioTalkCta = page.locator('.dws-ladder-action[href="/contact"]');
  check('Secondary action links to /contact', (await studioTalkCta.count()) > 0);

  // Check Truthful CTA Language on Lead Capture
  const leadBox = page.locator('.dws-lead-capture-box');
  const leadTitle = await leadBox.locator('.dws-lead-title').textContent();
  check('Truthful CTA title is "Save Roadmap & Prepare Studio Brief"', leadTitle.includes('Save Roadmap & Prepare Studio Brief'), leadTitle);

  const leadSubtitle = await leadBox.locator('.dws-lead-subtitle').textContent();
  check('Subtitle truthfully states "Nothing is transmitted over the network"', leadSubtitle.includes('Nothing is transmitted over the network'), leadSubtitle);

  // CRITICAL FORM DEFECT TEST: Measure input and textarea dimensions
  const nameInput = page.locator('#lead-name');
  const nameBox = await nameInput.boundingBox();
  check(
    'Founder name input is deliberate full-width control (width > 200px, height >= 44px)',
    nameBox.width > 200 && nameBox.height >= 44,
    `width: ${nameBox.width}px, height: ${nameBox.height}px`
  );

  const emailInput = page.locator('#lead-email');
  const emailBox = await emailInput.boundingBox();
  check(
    'Work email input is deliberate full-width control (width > 200px, height >= 44px)',
    emailBox.width > 200 && emailBox.height >= 44,
    `width: ${emailBox.width}px, height: ${emailBox.height}px`
  );

  const ambitionTextarea = page.locator('#lead-ambition');
  const ambitionBox = await ambitionTextarea.boundingBox();
  check(
    'Core ambition textarea has deliberate height (height >= 80px, width > 200px)',
    ambitionBox.width > 200 && ambitionBox.height >= 80,
    `width: ${ambitionBox.width}px, height: ${ambitionBox.height}px`
  );

  // Test Save Roadmap & Prepare Studio Brief button action
  await nameInput.fill('Genevieve Vance');
  await emailInput.fill('founder@aethelgard.co');
  await ambitionTextarea.fill('Target Q4 botanical spirits launch.');

  const briefDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save Roadmap & Prepare Studio Brief', exact: false }).click();
  const briefDl = await briefDownloadPromise;
  const briefDlPath = await briefDl.path();
  const briefJson = JSON.parse(fs.readFileSync(briefDlPath, 'utf8'));
  check('Brief JSON downloaded with contact email', briefJson.contactInformation.email === 'founder@aethelgard.co');

  const successNotice = await page.locator('.dws-lead-success').textContent();
  check('Success notice confirms "Roadmap & Studio Brief Prepared"', successNotice.includes('Roadmap & Studio Brief Prepared'), successNotice);

  // Test Download Roadmap (.txt)
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download your roadmap', exact: false }).click();
  const dl = await downloadPromise;
  const dlPath = await dl.path();
  const dlText = fs.readFileSync(dlPath, 'utf8');
  check('Roadmap .txt export downloaded', dlText.includes('COMPANY BUILD ROADMAP'));

  console.log('--- 5. Testing Mobile Viewport (390px) & Visual Gate Captures ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/');
  await page.waitForTimeout(300);

  const mobileBuilder = page.locator('#review-builder');
  await mobileBuilder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Check Mobile H2 Font Size (< 48px)
  const mobileH2Size = await page.locator('#review-builder h2').evaluate((el) => {
    return parseFloat(window.getComputedStyle(el).fontSize);
  });
  check('Mobile H2 font size scaled comfortably (< 48px)', mobileH2Size <= 48, `fontSize: ${mobileH2Size}px`);

  // Verify mobile construction primitive is NOT clipped or visible on unstarted entry screen
  const mobileResponseVisible = await page.locator('.r51-response').isVisible();
  check('Mobile unstarted entry suppresses clipped primitive fragment', !mobileResponseVisible);

  // Capture 05-entry-mobile-390.png
  await page.screenshot({ path: path.join(outDir, '05-entry-mobile-390.png') });
  check('Capture 05-entry-mobile-390.png saved', true);

  // Run Mobile Diagnostic Flow
  await page.getByRole('button', { name: 'Start your roadmap', exact: false }).click();
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Consumer Brand', exact: true }).click();
  await page.waitForTimeout(150);
  await page.locator('.dws-check-card input[type=checkbox]').first().check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Create roadmap', exact: false }).click();
  await page.waitForSelector('.roadmap-result');
  await page.waitForTimeout(300);

  // Capture 06-roadmap-top-mobile-390.png
  const mobileExecRoadmap = page.locator('#executive-roadmap');
  await mobileExecRoadmap.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '06-roadmap-top-mobile-390.png') });
  check('Capture 06-roadmap-top-mobile-390.png saved', true);

  // Capture 07-roadmap-mid-mobile-390.png (showing Macro Landmarks and services)
  const firstLandmark = page.locator('.dws-macro-landmark').first();
  await firstLandmark.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '07-roadmap-mid-mobile-390.png') });
  check('Capture 07-roadmap-mid-mobile-390.png saved', true);

  // Capture 08-continuation-mobile-390.png (showing Commercial Ladder & Lead Form)
  const mobileLadder = page.locator('.dws-commercial-ladder');
  await mobileLadder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '08-continuation-mobile-390.png') });
  check('Capture 08-continuation-mobile-390.png saved', true);

  console.log('--- 6. Multi-Viewport Responsiveness & Zero Horizontal Overflow ---');
  const viewports = [
    { w: 320, h: 640 },
    { w: 390, h: 844 },
    { w: 430, h: 932 },
    { w: 768, h: 1024 },
    { w: 1024, h: 768 },
    { w: 1440, h: 900 },
    { w: 1920, h: 1080 },
    { w: 2560, h: 1440 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(BASE + '/');
    await page.waitForTimeout(150);

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    check(`viewport ${vp.w}x${vp.h} zero horizontal overflow`, !hasOverflow);
  }

  check('Zero console errors during execution', errors.length === 0, errors.join('; '));

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n=== Phase 2C.1 Verification Summary: ${checks.length - failed.length} passed, ${failed.length} failed ===`);

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2c-verification.json',
    JSON.stringify({ checks, failed, errors }, null, 2)
  );

  await browser.close();
  if (failed.length > 0) process.exit(1);
})();
