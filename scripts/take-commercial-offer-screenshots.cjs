const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE_URL = 'http://localhost:5202';
const ARTIFACTS_DIR = 'C:/Users/ernes/.gemini/antigravity/brain/2c33a8ae-250a-4ccd-be78-c14c1829ccbe/screenshots';

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function takeScreenshots() {
  console.log('Launching browser for Commercial Offer Visual QA...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: EDGE_PATH,
  });

  try {
    // -------------------------------------------------------------
    // 1. Desktop 1440x900 Viewport
    // -------------------------------------------------------------
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();

    console.log('1. Loading Homepage Hero at 1440px...');
    await desktopPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_homepage_hero_1440.png'),
      fullPage: false,
    });

    console.log('2. Stepping through Homepage Diagnostic to capture Post-Roadmap Commercial Offer...');
    const builderSection = desktopPage.locator('#review-builder');
    if (await builderSection.count() > 0) {
      await builderSection.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(500);

      // Step 0: click Next
      const nextBtn0 = desktopPage.locator('#review-builder button:has-text("Continue"), #review-builder button:has-text("Next")').first();
      if (await nextBtn0.count() > 0) {
        await nextBtn0.click();
        await desktopPage.waitForTimeout(500);
      }

      // Step 1: click Next / Generate
      const nextBtn1 = desktopPage.locator('#review-builder button:has-text("Generate Roadmap"), #review-builder button:has-text("Continue"), #review-builder button:has-text("Next")').first();
      if (await nextBtn1.count() > 0) {
        await nextBtn1.click();
        await desktopPage.waitForTimeout(600);
      }

      // Post-roadmap commercial offer section
      const commercialSection = desktopPage.locator('.dws-growth-engine-commercial-section');
      if (await commercialSection.count() > 0) {
        await commercialSection.scrollIntoViewIfNeeded();
        await desktopPage.waitForTimeout(600);
        await commercialSection.screenshot({
          path: path.join(ARTIFACTS_DIR, 'desktop_homepage_post_roadmap_offer.png'),
        });
        console.log('-> Successfully captured desktop_homepage_post_roadmap_offer.png');
      }
    }

    console.log('3. Loading Growth Engine Landing Page Hero at 1440px...');
    await desktopPage.goto(`${BASE_URL}/growth-engine`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_growth_engine_hero_1440.png'),
      fullPage: false,
    });

    console.log('4. Capturing Growth Engine Section 8 Pricing & Fuel Levels at 1440px...');
    const pricingSection = desktopPage.locator('#pricing');
    await pricingSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(600);
    // Hide fixed header so it doesn't occlude any part of the pricing section in the screenshot
    await desktopPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = 'none';
    });
    await pricingSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_growth_engine_pricing_1440.png'),
    });
    await desktopPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = '';
    });

    console.log('5. Capturing Growth Engine Section 9 FAQ at 1440px...');
    const faqSection = desktopPage.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();
    const firstFaq = desktopPage.locator('.dws-faq-item summary').first();
    await firstFaq.click();
    await desktopPage.waitForTimeout(500);
    await desktopPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = 'none';
    });
    await faqSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_growth_engine_faq_1440.png'),
    });
    await desktopPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = '';
    });

    console.log('6. Loading Application Page with ?tier=growth at 1440px...');
    await desktopPage.goto(`${BASE_URL}/growth/apply?tier=growth`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_apply_tier_growth_1440.png'),
      fullPage: false,
    });

    await desktopContext.close();

    // -------------------------------------------------------------
    // 2. Mobile 390x844 Viewport (iPhone 12/13/14)
    // -------------------------------------------------------------
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    console.log('7. Loading Homepage Hero at 390px mobile...');
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_390_homepage_hero.png'),
      fullPage: false,
    });

    console.log('8. Loading Growth Engine Landing Page Hero at 390px mobile...');
    await mobilePage.goto(`${BASE_URL}/growth-engine`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_390_growth_engine_hero.png'),
      fullPage: false,
    });

    console.log('9. Capturing Growth Engine Pricing at 390px mobile...');
    const mobilePricing = mobilePage.locator('#pricing');
    await mobilePricing.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(600);
    await mobilePage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = 'none';
    });
    await mobilePricing.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_390_growth_engine_pricing.png'),
    });
    await mobilePage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = '';
    });

    console.log('10. Capturing Growth Engine FAQ at 390px mobile...');
    const mobileFaq = mobilePage.locator('#faq');
    await mobileFaq.scrollIntoViewIfNeeded();
    const mobileFirstFaq = mobilePage.locator('.dws-faq-item summary').first();
    await mobileFirstFaq.click();
    await mobilePage.waitForTimeout(500);
    await mobilePage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = 'none';
    });
    await mobileFaq.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_390_growth_engine_faq.png'),
    });
    await mobilePage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = '';
    });

    console.log('11. Loading Application Page with ?tier=growth at 390px mobile...');
    await mobilePage.goto(`${BASE_URL}/growth/apply?tier=growth`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_390_apply_tier_growth.png'),
      fullPage: false,
    });

    // Check for horizontal overflow on mobile
    const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile 390px scroll check: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
    if (scrollWidth > clientWidth) {
      console.warn(`WARNING: Horizontal overflow detected on 390px! scrollWidth (${scrollWidth}) > clientWidth (${clientWidth})`);
    } else {
      console.log('PASS: No horizontal overflow on 390px mobile.');
    }

    await mobileContext.close();

    // -------------------------------------------------------------
    // 3. Mobile 430x932 Viewport (iPhone 14/15 Pro Max)
    // -------------------------------------------------------------
    const maxContext = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const maxPage = await maxContext.newPage();

    console.log('12. Loading Growth Engine Pricing at 430px mobile...');
    await maxPage.goto(`${BASE_URL}/growth-engine`, { waitUntil: 'networkidle' });
    const maxPricing = maxPage.locator('#pricing');
    await maxPricing.scrollIntoViewIfNeeded();
    await maxPage.waitForTimeout(600);
    await maxPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = 'none';
    });
    await maxPricing.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile_430_growth_engine_pricing.png'),
    });
    await maxPage.evaluate(() => {
      const header = document.querySelector('.dws-engine-header');
      if (header) header.style.display = '';
    });

    const maxScrollWidth = await maxPage.evaluate(() => document.documentElement.scrollWidth);
    const maxClientWidth = await maxPage.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile 430px scroll check: scrollWidth=${maxScrollWidth}, clientWidth=${maxClientWidth}`);
    if (maxScrollWidth > maxClientWidth) {
      console.warn(`WARNING: Horizontal overflow detected on 430px!`);
    } else {
      console.log('PASS: No horizontal overflow on 430px mobile.');
    }

    await maxContext.close();

    console.log('\nAll QA screenshots successfully updated in:', ARTIFACTS_DIR);
  } catch (err) {
    console.error('Error during screenshot generation:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch((e) => {
  console.error(e);
  process.exit(1);
});
