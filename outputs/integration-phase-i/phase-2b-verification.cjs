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

  console.log('--- 1. Testing Homepage Commercial Clarity (5-Second Test) ---');
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  // Who are we?
  const classificationText = await page.locator('.p-classification').textContent();
  check('kicker identifies studio', classificationText.toLowerCase().includes('company creation studio'), classificationText);

  const heroH1 = await page.locator('h1#p-title').textContent();
  check('H1 is "From idea to company."', heroH1.toLowerCase().includes('from idea') && heroH1.toLowerCase().includes('to company.'), heroH1);

  // What do we build & why different?
  const thesisText = await page.locator('.p-arrival-bottom').textContent();
  check('thesis defines complete company building', thesisText.includes('operating companies') && thesisText.includes('strategy'), thesisText);

  // What to do next?
  const primaryCta = await page.locator('.p-arrival .r51-action').first();
  const primaryHref = await primaryCta.getAttribute('href');
  check('primary CTA links to #review-builder', primaryHref === '#review-builder');

  const secondaryCta = await page.locator('.p-arrival .r52-hero-work').first();
  const secondaryHref = await secondaryCta.getAttribute('href');
  check('secondary CTA links to /work', secondaryHref === '/work');

  // Where is the proof? Check section order
  const arrivalBox = await page.locator('.p-arrival').boundingBox();
  const proofBox = await page.locator('#work').boundingBox();
  const creationBox = await page.locator('#creation').boundingBox();
  check('Selected Work placed immediately after hero and before creation chamber', proofBox.y > arrivalBox.y && proofBox.y < creationBox.y, `heroY:${arrivalBox.y}, proofY:${proofBox.y}, creationY:${creationBox.y}`);

  console.log('--- 2. Testing Early Portfolio Proof on Homepage ---');
  const mymosaCard = page.locator('#work a[href="/work/mymosa"]');
  check('MyMosa card present', await mymosaCard.count() > 0);

  const iklaCard = page.locator('#work a[href="/work/ikla-maison"]');
  check('IKLA Maison card present', await iklaCard.count() > 0);

  const cliffsCard = page.locator('#work a[href="/work/mr-cliffs"]');
  check('Mr. Cliffs card present', await cliffsCard.count() > 0);

  // Check proof images loading
  const proofImages = await page.locator('#work img').all();
  let allProofLoaded = proofImages.length === 3;
  for (const img of proofImages) {
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const loaded = await img.evaluate(el => el.complete && el.naturalWidth > 0);
    if (!loaded) allProofLoaded = false;
  }
  check('All 3 authentic proof images loaded', allProofLoaded);

  // Zero placeholder check
  const placeholders = await page.locator(':has-text("ASSET SET PENDING")').count();
  check('Zero placeholders on homepage', placeholders === 0, `found ${placeholders}`);

  console.log('--- 3. Testing How We Build / Creation Chamber ---');
  const chamberTop = await page.locator('.p-stage-top').textContent();
  check('Creation chamber labeled HOW WE BUILD', chamberTop.includes('HOW WE BUILD') && chamberTop.includes('Proprietary 8-Stage'), chamberTop);

  const stages = await page.locator('.p-stages button').allTextContents();
  check('8 stages present', stages.length === 8 && stages[0].includes('Idea') && stages[7].includes('Company'), stages.join(', '));

  // Check desktop scroll height
  const desktopEvolutionHeight = await page.locator('.p-evolution').evaluate(el => el.getBoundingClientRect().height);
  const viewportHeight = 1000;
  check('desktop evolution height reduced to ~240vh (no scroll trap)', desktopEvolutionHeight <= 2500, `height is ${desktopEvolutionHeight}px`);

  // Test stage button interaction
  await page.locator('.p-stages button').nth(2).click(); // Click Identity
  await page.waitForTimeout(300);
  const activeStage = await page.locator('.p-stages button[aria-current="step"]').textContent();
  check('clicking stage selects Identity', activeStage.includes('Identity'), activeStage);

  console.log('--- 4. Testing Operating System & Capabilities Bridge ---');
  check('Operating states section present', await page.locator('#operating').count() > 0);

  const capItems = await page.locator('.r52-cap-item').count();
  check('9 capabilities rendered', capItems === 9, `found ${capItems}`);

  const capLinks = await page.locator('.r52-cap-all').getAttribute('href');
  check('capabilities links to disciplines score', capLinks === '/capabilities/disciplines');

  console.log('--- 5. Testing Studio Signal & Invitation CTAs ---');
  const studioSignal = await page.locator('#studio h2').textContent();
  check('Studio signal heading present', studioSignal.includes('Systems guided by human judgment'), studioSignal);

  const studioTenets = await page.locator('.r52-tenet').count();
  check('3 studio tenets present', studioTenets === 3, `found ${studioTenets}`);

  const invitationCta = await page.locator('#invitation .r51-action').getAttribute('href');
  check('Invitation primary CTA links to #review-builder', invitationCta === '#review-builder');

  const invitationTalk = await page.locator('#invitation .r52-talk').getAttribute('href');
  check('Invitation talk link links to /contact', invitationTalk === '/contact');

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
    await page.waitForTimeout(200);

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    check(`viewport ${vp.w}x${vp.h} zero horizontal overflow`, !hasOverflow);

    if (vp.w <= 800) {
      const mobileEvoHeight = await page.locator('.p-evolution').evaluate(el => el.getBoundingClientRect().height);
      check(`mobile evolution height reduced to ~200vh at ${vp.w}px`, mobileEvoHeight <= vp.h * 2.1, `height: ${mobileEvoHeight}px`);
    }
  }

  const failed = checks.filter(c => !c.pass);
  console.log(`\n=== Verification Summary: ${checks.length - failed.length} passed, ${failed.length} failed ===`);

  fs.writeFileSync('outputs/integration-phase-i/phase-2b-verification.json', JSON.stringify({ checks }, null, 2));

  await browser.close();
  if (failed.length > 0) process.exit(1);
})();
