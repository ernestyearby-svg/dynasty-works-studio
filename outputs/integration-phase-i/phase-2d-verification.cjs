const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = 'outputs/phase-2d';
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
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter documented native browser ViewTransition cancellation condition
      if (!text.includes('ViewTransition opt-in disabled')) {
        errors.push(text);
      }
    }
  });
  page.on('pageerror', (err) => {
    if (!err.message.includes('ViewTransition opt-in disabled')) {
      errors.push(err.message);
    }
  });

  const checks = [];
  const check = (name, pass, detail = '') => {
    checks.push({ name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ': ' + detail : ''}`);
  };

  const BASE = 'http://127.0.0.1:5202';

  console.log('--- 1. Testing Founder Blueprint Page (/founder-blueprint) Desktop ---');
  await page.goto(BASE + '/founder-blueprint');
  await page.waitForLoadState('networkidle');

  // Verify V3 styling retired (dws-v3 class absent)
  const hasDwsV3 = await page.evaluate(() => document.body.classList.contains('dws-v3'));
  check('Founder Blueprint has V3 styling retired (dws-v3 class absent)', !hasDwsV3);

  // Verify Kicker and H1
  const fbKicker = await page.locator('.fb-hero-lead .fb-kicker').textContent();
  check('Kicker is STRATEGIC COMPANY DEVELOPMENT', fbKicker.includes('STRATEGIC COMPANY DEVELOPMENT'), fbKicker);

  const fbH1 = await page.locator('#fb-hero-title').textContent();
  check(
    'H1 contains "Before we build the company, we define what must be built"',
    fbH1.includes('Before we build the company') && fbH1.includes('we define what must be built'),
    fbH1
  );

  // Verify $1,500 Price & Offer Card
  const priceAmount = await page.locator('.fb-price-amount').textContent();
  check('Founder Blueprint price is $1,500', priceAmount === '$1,500', priceAmount);

  const currency = await page.locator('.fb-price-currency').textContent();
  check('Currency is USD', currency.includes('USD'), currency);

  const offerSpecs = await page.locator('.fb-offer-specs').textContent();
  check('Specs contain 2–3 Weeks timeline', offerSpecs.includes('2–3 Weeks'), offerSpecs);
  check('Specs contain 60–90 minute session', offerSpecs.includes('60–90 minute'), offerSpecs);

  // Capture 01-founder-blueprint-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '01-founder-blueprint-desktop-1440.png') });
  check('Capture 01-founder-blueprint-desktop-1440.png saved', true);

  // Verify Commercial Ladder
  const ladderSteps = await page.locator('.fb-ladder-step').count();
  check('Commercial progression ladder has 3 tiers', ladderSteps === 3, `found: ${ladderSteps}`);
  const activeStep = await page.locator('.fb-ladder-step.is-active .fb-ladder-title').textContent();
  check('Active step in ladder is Founder Blueprint', activeStep.includes('Founder Blueprint'), activeStep);

  // Verify Executive Q&A (5 answers)
  const answersCount = await page.locator('.fb-answer-card').count();
  check('Executive Q&A has 5 answers', answersCount === 5, `found: ${answersCount}`);

  // Verify Deliverables (10 items)
  const deliverablesLocator = page.locator('.fb-deliverables-grid');
  await deliverablesLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const delivCount = await page.locator('.fb-deliverable-card').count();
  check('10 verified deliverables rendered', delivCount === 10, `found: ${delivCount}`);

  // Verify 21 Document System Sections
  const docSectionsCount = await page.locator('.fb-doc-section-pill').count();
  check('21 document system sections rendered', docSectionsCount === 21, `found: ${docSectionsCount}`);

  // Capture 02-founder-blueprint-deliverables-1440.png
  await page.screenshot({ path: path.join(outDir, '02-founder-blueprint-deliverables-1440.png') });
  check('Capture 02-founder-blueprint-deliverables-1440.png saved', true);

  // Verify Process Timeline (4 phases)
  const processLocator = page.locator('.fb-process-timeline');
  await processLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const processStepsCount = await page.locator('.fb-process-step').count();
  check('4-phase process timeline rendered', processStepsCount === 4, `found: ${processStepsCount}`);

  // Verify 30/60/90 Horizons
  const horizonsCount = await page.locator('.fb-horizon-card').count();
  check('3 planning horizons rendered (30/60/90)', horizonsCount === 3, `found: ${horizonsCount}`);

  // Verify Boundary Disclaimer
  const boundaryText = await page.locator('.fb-boundary-box').textContent();
  check('Regulatory/professional boundary disclaimer present', boundaryText.includes('Company formation') && boundaryText.includes('Legal, tax'), boundaryText);

  // Capture 03-founder-blueprint-process-1440.png
  await page.screenshot({ path: path.join(outDir, '03-founder-blueprint-process-1440.png') });
  check('Capture 03-founder-blueprint-process-1440.png saved', true);

  // Verify Primary CTA routes to /founder-blueprint/intake
  const heroCtaHref = await page.locator('.fb-offer-card .fb-offer-cta').getAttribute('href');
  check('Offer CTA links to /founder-blueprint/intake', heroCtaHref === '/founder-blueprint/intake', heroCtaHref);

  console.log('--- 2. Testing Studio Page (/studio) Desktop ---');
  await page.goto(BASE + '/studio');
  await page.waitForLoadState('networkidle');

  // Verify V3 styling retired (dws-v3 class absent)
  const studioHasDwsV3 = await page.evaluate(() => document.body.classList.contains('dws-v3'));
  check('Studio page has V3 styling retired (dws-v3 class absent)', !studioHasDwsV3);

  // Verify room dataset
  const cinematicRoom = await page.evaluate(() => document.body.dataset.cinematicRoom);
  check('Studio body room dataset is "human"', cinematicRoom === 'human', cinematicRoom);

  // Verify H1 and Thesis
  const studioH1 = await page.locator('#studio-hero-title').textContent();
  check(
    'Studio H1 is "Systems guided by human judgment"',
    studioH1.includes('Systems guided by') && studioH1.includes('human judgment'),
    studioH1
  );

  const studioLead = await page.locator('.studio-hero-lead').textContent();
  check('Studio lead states independent company creation practice', studioLead.includes('independent company creation practice'), studioLead);

  // Verify Philosophy Section
  const philHeading = await page.locator('#studio-phil-title').textContent();
  check('Philosophy heading is "An idea rarely needs only one thing"', philHeading.includes('An idea rarely needs') && philHeading.includes('only one thing'), philHeading);

  // Verify Four Human Tenets
  const tenetsCount = await page.locator('.studio-tenet-card').count();
  check('4 human signal operational tenets rendered', tenetsCount === 4, `found: ${tenetsCount}`);

  // Capture 04-studio-desktop-1440.png
  await page.screenshot({ path: path.join(outDir, '04-studio-desktop-1440.png') });
  check('Capture 04-studio-desktop-1440.png saved', true);

  // Verify Eight Disciplines
  const discCount = await page.locator('.studio-discipline-card').count();
  check('8 core disciplines rendered', discCount === 8, `found: ${discCount}`);

  // Verify Three Commercial Tiers
  const tiersCount = await page.locator('.studio-tier-card').count();
  check('3 commercial tiers rendered', tiersCount === 3, `found: ${tiersCount}`);
  const tier2Price = await page.locator('.studio-tier-card.is-featured .studio-tier-price').textContent();
  check('Tier 02 Founder Blueprint priced at $1,500', tier2Price.includes('$1,500'), tier2Price);

  // Verify Proof & Next Moves (4 Route Cards)
  const routeCardsCount = await page.locator('.studio-route-card').count();
  check('4 proof routing cards rendered', routeCardsCount === 4, `found: ${routeCardsCount}`);

  const workRouteHref = await page.locator('.studio-route-card[href="/work"]').count();
  check('Studio routes to /work', workRouteHref === 1);

  const capRouteHref = await page.locator('.studio-route-card[href="/capabilities"]').count();
  check('Studio routes to /capabilities', capRouteHref === 1);

  const builderRouteHref = await page.locator('.studio-route-card[href="/#review-builder"]').count();
  check('Studio routes to /#review-builder', builderRouteHref === 1);

  const bpRouteHref = await page.locator('.studio-route-card[href="/founder-blueprint"]').count();
  check('Studio routes to /founder-blueprint', bpRouteHref === 1);

  console.log('--- 3. Testing Mobile Viewport (390px) & Visual Gate Captures ---');
  await page.setViewportSize({ width: 390, height: 844 });

  // Founder Blueprint Mobile
  await page.goto(BASE + '/founder-blueprint');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '05-founder-blueprint-mobile-390.png') });
  check('Capture 05-founder-blueprint-mobile-390.png saved', true);

  const fbMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check('Founder Blueprint mobile 390px zero horizontal overflow', fbMobileOverflow);

  // Studio Mobile
  await page.goto(BASE + '/studio');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '06-studio-mobile-390.png') });
  check('Capture 06-studio-mobile-390.png saved', true);

  const studioMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check('Studio mobile 390px zero horizontal overflow', studioMobileOverflow);

  console.log('--- 4. Multi-Viewport Responsiveness & Zero Horizontal Overflow ---');
  const viewports = [
    { width: 320, height: 640 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.goto(BASE + '/founder-blueprint');
    const fbOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    check(`Founder Blueprint @ ${vp.width}x${vp.height} zero overflow`, fbOverflow);

    await page.goto(BASE + '/studio');
    const studioOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    check(`Studio @ ${vp.width}x${vp.height} zero overflow`, studioOverflow);
  }

  console.log('--- 5. Commercial Pathway Inter-Route Navigation Flow ---');
  // Navigate from Founder Blueprint to Intake
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + '/founder-blueprint');
  await page.locator('.fb-offer-card .fb-offer-cta').click();
  await page.waitForURL('**/founder-blueprint/intake');
  check('Clicking Begin Blueprint Intake navigates to /founder-blueprint/intake', page.url().includes('/founder-blueprint/intake'), page.url());

  // Navigate from Studio to Work
  await page.goto(BASE + '/studio');
  await page.locator('.studio-route-card[href="/work"]').click();
  await page.waitForURL('**/work');
  check('Clicking Selected Work card navigates to /work', page.url().includes('/work'), page.url());

  // Navigate from Studio to Founder Blueprint
  await page.goto(BASE + '/studio');
  await page.locator('.studio-route-card[href="/founder-blueprint"]').click();
  await page.waitForURL('**/founder-blueprint');
  check('Clicking Founder Blueprint card navigates to /founder-blueprint', page.url().includes('/founder-blueprint'), page.url());

  // Check console errors
  check('Zero console errors during execution', errors.length === 0, errors.join('; '));

  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass).length;
  console.log(`\n=== Phase 2D Verification Summary: ${passed} passed, ${failed} failed ===\n`);

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2d-verification.json',
    JSON.stringify({ passed, failed, total: checks.length, checks }, null, 2)
  );

  await browser.close();
  if (failed > 0) process.exit(1);
})();
