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

  console.log('--- 1. Testing Company Builder Entry (Desktop) ---');
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  // Verify Header copy
  const builderHeader = await page.locator('#review-builder header').textContent();
  check(
    'Builder header has "Build the architecture before building the company"',
    builderHeader.includes('Build the architecture') && builderHeader.includes('before building the company'),
    builderHeader
  );

  const builderExplainer = await page.locator('#review-builder header p').textContent();
  check(
    'Builder explainer states "Tell us what we\'re building. Tell us where it stands. Tell us what it needs."',
    builderExplainer.includes("Tell us what we're building") && builderExplainer.includes("Tell us what it needs"),
    builderExplainer
  );

  // Capture 1. Builder Entry — Desktop
  const builderLocator = page.locator('#review-builder');
  await builderLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '01-builder-entry-1440.png') });
  check('Capture 01-builder-entry-1440.png saved', true);

  // Click Start your roadmap
  await page.getByRole('button', { name: 'Start your roadmap', exact: false }).click();
  await page.waitForTimeout(200);

  // Verify Step 01: Business Types rendered
  const bizTypeCount = await page.locator('.r51-business-types button').count();
  check('14 business types available', bizTypeCount >= 14, `found ${bizTypeCount}`);

  // Capture 2. Diagnostic Step (Business Selection) — Desktop
  await page.screenshot({ path: path.join(outDir, '02-diagnostic-step-1440.png') });
  check('Capture 02-diagnostic-step-1440.png saved', true);

  console.log('--- 2. Testing Diagnostic Progression & Operational Inputs ---');
  // Select "Food / Beverage" (a physical market type with rich dependency rules)
  await page.getByRole('button', { name: 'Food / Beverage', exact: true }).click();
  await page.waitForTimeout(200);

  // Step 2: Where does it stand?
  const step2Title = await page.locator('.dws-diag-step-title').textContent();
  check('Step 2 is "Where does it stand?"', step2Title.includes('Where does it stand?'), step2Title);

  // Select Stage: Preparing to launch
  await page.locator('#business-stage').selectOption('Preparing to launch');

  // Select existing assets
  await page.getByRole('checkbox', { name: 'I have a name.', exact: true }).check();
  await page.getByRole('checkbox', { name: 'I already have branding.', exact: true }).check();

  // Click Continue
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForTimeout(200);

  // Step 3: What does it need?
  const step3Title = await page.locator('.dws-diag-step-title').textContent();
  check('Step 3 is "What does it need?"', step3Title.includes('What does it need?'), step3Title);

  // Select Priorities
  await page.getByRole('checkbox', { name: 'Packaging', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Website', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Distribution Strategy', exact: true }).check();

  // Test Optional Commercial Context accordion
  const contextToggle = page.locator('.dws-context-toggle');
  await contextToggle.click();
  await page.waitForTimeout(200);

  await page.locator('#company-name').fill('Aethelgard Botanical Spirits');
  await page.locator('#launch-window').selectOption('3–6 Months');
  await page.locator('#budget-choice').selectOption('I have a range in mind');
  await page.locator('#budget-note').fill('$150,000 – $250,000 initial allocation');

  // Click Create roadmap
  await page.getByRole('button', { name: 'Create roadmap', exact: false }).click();
  await page.waitForSelector('.roadmap-result');
  check('Executive roadmap generated', true);

  console.log('--- 3. Testing Executive Company Build Roadmap Presentation ---');
  // Check Venture Name rendered in Roadmap Header
  const roadmapTitle = await page.locator('.dws-roadmap-title').textContent();
  check('Roadmap title includes venture name', roadmapTitle.includes('Aethelgard Botanical Spirits'), roadmapTitle);

  // Check 4 Macro Creation System Stages rendered
  const macroCards = await page.locator('.dws-macro-card').count();
  check('Four macro creation stages rendered', macroCards === 4, `found ${macroCards}`);

  const activeMacroCards = await page.locator('.dws-macro-card.is-active').count();
  check('Active macro stages highlighted', activeMacroCards >= 2, `active: ${activeMacroCards}`);

  // Check Immediate Priorities Callout
  const immediateCallout = page.locator('.dws-immediate-callout');
  check('Immediate priorities callout rendered', (await immediateCallout.count()) > 0);
  const immediateChips = await page.locator('.dws-immediate-chip').count();
  check('Immediate critical path chips present', immediateChips > 0, `found ${immediateChips} immediate services`);

  // Check Sequential Service Architecture
  const phaseBlocks = await page.locator('.dws-phase-block').count();
  check('Phase blocks rendered sequentially', phaseBlocks >= 2, `found ${phaseBlocks} phases`);

  const timingBadges = await page.locator('.dws-timing-badge').count();
  check('Timing badges present on services', timingBadges > 0, `found ${timingBadges} badges`);

  // Check Dependency notes present
  const dependencies = await page.locator('.dws-service-dependency').count();
  check('Service dependency notes rendered', dependencies > 0, `found ${dependencies} dependencies`);

  // Check Strategic Guidance & Regulatory Boundaries
  const guidanceText = await page.locator('.dws-guidance-panel').textContent();
  check('Guidance panel includes timeline notice', guidanceText.includes('Timeline & Dependency Notice'));
  check('Guidance panel includes professional boundaries', guidanceText.includes('Professional Boundaries'));
  check('Guidance panel recommends studio engagement', guidanceText.includes('Recommended Studio Engagement'));

  // Check Commercial Boundaries elegant notice
  const boundariesNote = await page.locator('.dws-boundaries-note').textContent();
  check('Commercial boundaries disclaimer present', boundariesNote.includes('Non-binding advisory roadmap'));

  // Capture 3. Generated Roadmap — Desktop
  const execRoadmap = page.locator('#executive-roadmap');
  await execRoadmap.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '03-generated-roadmap-1440.png') });
  check('Capture 03-generated-roadmap-1440.png saved', true);

  console.log('--- 4. Testing Export System & Post-Roadmap Lead Capture ---');
  // Test Download Roadmap (.txt)
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download your roadmap', exact: false }).click();
  const dl = await downloadPromise;
  const dlPath = await dl.path();
  const dlContent = fs.readFileSync(dlPath, 'utf8');
  check('Roadmap .txt downloaded with content', dlContent.includes('DYNASTY WORKS STUDIO') && dlContent.includes('COMPANY BUILD ROADMAP'));

  // Test Post-Roadmap Lead Capture
  const leadBox = page.locator('.dws-lead-capture-box');
  await leadBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // Capture 4. Roadmap Continuation / Lead Capture — Desktop
  await page.screenshot({ path: path.join(outDir, '04-lead-capture-1440.png') });
  check('Capture 04-lead-capture-1440.png saved', true);

  // Fill and submit lead capture
  await page.locator('#lead-name').fill('Genevieve Vance');
  await page.locator('#lead-email').fill('founder@aethelgard.co');
  await page.locator('#lead-phone').fill('+1 415 555 8920');

  const briefDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save Roadmap & Request Review', exact: false }).click();
  const briefDl = await briefDownloadPromise;
  const briefDlPath = await briefDl.path();
  const briefJson = JSON.parse(fs.readFileSync(briefDlPath, 'utf8'));
  check('Structured brief JSON downloaded', briefJson.contactInformation.email === 'founder@aethelgard.co');
  check('Brief contains deterministic recommended services', briefJson.recommendedServices.length > 0);

  // Check success message rendered
  const successMsg = await page.locator('.dws-lead-success').textContent();
  check('Lead success confirmation rendered', successMsg.includes('Roadmap & Strategic Brief Saved'), successMsg);

  // Check Founder Blueprint Bridge ($1,500)
  const ladder = page.locator('.dws-commercial-ladder');
  const ladderText = await ladder.textContent();
  check('Commercial ladder features Founder Blueprint $1,500', ladderText.includes('$1,500 Strategic Scoping'));

  const r51Blueprint = await page.locator('.r51-blueprint').textContent();
  check('External r51-blueprint retains $1,500', r51Blueprint.includes('$1,500'));

  console.log('--- 5. Testing Mobile Viewport & Visual Captures ---');
  // Set Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/');
  await page.waitForTimeout(300);

  const mobileBuilder = page.locator('#review-builder');
  await mobileBuilder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // Capture 5. Builder Entry — Mobile
  await page.screenshot({ path: path.join(outDir, '05-builder-entry-390.png') });
  check('Capture 05-builder-entry-390.png saved', true);

  // Run mobile diagnostic flow
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

  // Capture 6. Generated Roadmap — Mobile
  await page.screenshot({ path: path.join(outDir, '06-generated-roadmap-390.png') });
  check('Capture 06-generated-roadmap-390.png saved', true);

  console.log('--- 6. Multi-Viewport Responsiveness & Zero Overflow ---');
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

  check('Zero console errors during diagnostic execution', errors.length === 0, errors.join('; '));

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n=== Phase 2C Verification Summary: ${checks.length - failed.length} passed, ${failed.length} failed ===`);

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2c-verification.json',
    JSON.stringify({ checks, failed, errors }, null, 2)
  );

  await browser.close();
  if (failed.length > 0) process.exit(1);
})();
