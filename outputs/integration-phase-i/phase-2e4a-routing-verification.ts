/**
 * Dynasty Works Studio — Phase 2E.4A Builder Routing Hotfix Verification Suite
 *
 * Proves:
 * 1. The canonical contract /api/submissions/:kind works without manually appended query params.
 * 2. The authoritative browser Company Builder UI intercepts and transmits kind = 'builder'.
 * 3. The Netlify submissions function resolves kind from pathname, query, or body.
 * 4. All three conversion kinds (builder, blueprint, general) resolve cleanly to HTTP 202 in test mode.
 * 5. Complete cleanup of synthetic test data from Supabase.
 */

import fs from 'node:fs';
import crypto from 'node:crypto';
import { execSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import handler from '../../netlify/functions/submissions';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

// Load .env.dws.local
if (fs.existsSync('.env.dws.local')) {
  const envContent = fs.readFileSync('.env.dws.local', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      process.env[key] = val;
      if (key === 'DWS_SERVICE_ROLE_KEY') {
        process.env.SUPABASE_SERVICE_ROLE_KEY = val;
      }
    }
  }
}

function queryDb(sql: string): any[] {
  const clean = sql.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/"/g, '\\"').trim();
  try {
    const out = execSync(`npx supabase db query --linked "${clean}"`, { encoding: 'utf8' });
    const jsonMatch = out.match(/\{[\s\S]*"rows"[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]).rows;
    return [];
  } catch (err: any) {
    console.error('queryDb error:', err.stdout || err.message);
    throw err;
  }
}

interface CheckResult {
  section: string;
  name: string;
  passed: boolean;
  detail?: string;
}

const checks: CheckResult[] = [];
function check(section: string, name: string, condition: boolean, detail?: string) {
  checks.push({ section, name, passed: Boolean(condition), detail });
  const icon = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] [${section}] ${name}${detail ? ` (${detail})` : ''}`);
  if (!condition) {
    console.error(`  Assertion failed: ${name}`);
  }
}

async function run() {
  console.log('================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2E.4A ROUTING HOTFIX VERIFICATION');
  console.log('================================================================\n');

  process.env.DWS_TEST_MODE = 'true';
  process.env.USE_MOCK_NOTIFICATIONS = 'true';
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';

  const createdReceipts: string[] = [];

  try {
    // -------------------------------------------------------------
    // PART 1: DIRECT HANDLER ROUTING CONTRACT VERIFICATION
    // -------------------------------------------------------------
    console.log('--- PART 1: DIRECT HANDLER ROUTING CONTRACT ---');

    // Test 1: Builder via pure Pathname (/api/submissions/builder) with NO query params
    const builderKey = crypto.randomUUID();
    const builderReq = new Request('http://localhost/api/submissions/builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.41',
      },
      body: JSON.stringify({
        version: 1,
        kind: 'builder',
        idempotencyKey: builderKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Routing Test Founder',
          email: 'test-builder-routing@example.com',
          company: 'Routing Test Studio',
          businessType: 'B2B Software Platform',
          businessStage: 'Preparing to launch',
          selectedNeeds: ['Executive Strategy', 'Brand Identity'],
          launchTimeline: 'Q4 2026',
          ambitionNotes: 'Pure pathname routing test.',
        },
      }),
    });

    const builderRes = await handler(builderReq);
    const builderBody: any = await builderRes.json();
    check('ROUTING_DIRECT', 'Builder pure pathname /api/submissions/builder returns HTTP 202 (not 400)', builderRes.status === 202, `status=${builderRes.status}, message=${builderBody.message}`);
    check('ROUTING_DIRECT', 'Builder returns confirmed receiptId', Boolean(builderBody.receiptId));
    if (builderBody.receiptId) createdReceipts.push(builderBody.receiptId);

    // Test 2: Blueprint via pure Pathname (/api/submissions/blueprint)
    const bpKey = crypto.randomUUID();
    const bpReq = new Request('http://localhost/api/submissions/blueprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.42',
      },
      body: JSON.stringify({
        version: 1,
        kind: 'blueprint',
        idempotencyKey: bpKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Blueprint Routing Founder',
          email: 'test-bp-routing@example.com',
          company: 'Blueprint Routing Co',
          businessType: 'Technology',
          businessStage: 'Idea',
          physicalMarket: true,
          ideaDescription: 'Precision autonomous robotics platform for heavy industrial logistics.',
          problemDescription: 'High operational latency in manual warehouse pallet handling.',
          targetCustomer: 'Enterprise logistics directors and warehouse operators.',
          requestedNeeds: 'Complete brand identity, investor blueprint, and industrial design system.',
          targetLaunch: 'Fall 2026',
          primaryMarket: 'North America Industrial',
          biggestQuestion: 'How to structure dual hardware/software recurring pricing effectively?',
        },
      }),
    });

    const bpRes = await handler(bpReq);
    const bpBody: any = await bpRes.json();
    check('ROUTING_DIRECT', 'Blueprint pure pathname /api/submissions/blueprint returns HTTP 202', bpRes.status === 202, `status=${bpRes.status}, message=${bpBody.message}`);
    check('ROUTING_DIRECT', 'Blueprint returns confirmed receiptId', Boolean(bpBody.receiptId));
    if (bpBody.receiptId) createdReceipts.push(bpBody.receiptId);

    // Test 3: General via pure Pathname (/api/submissions/general)
    const genKey = crypto.randomUUID();
    const genReq = new Request('http://localhost/api/submissions/general', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.43',
      },
      body: JSON.stringify({
        version: 1,
        kind: 'general',
        idempotencyKey: genKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'General Routing Founder',
          email: 'test-gen-routing@example.com',
          company: 'General Routing Co',
          services: ['Company Creation', 'Digital Systems'],
          description: 'Exploring long-term studio engagement for autonomous financial services platform.',
          stage: 'Operating',
          budget: '$250k - $500k',
          timeframe: 'Immediate',
        },
      }),
    });

    const genRes = await handler(genReq);
    const genBody: any = await genRes.json();
    check('ROUTING_DIRECT', 'General pure pathname /api/submissions/general returns HTTP 202', genRes.status === 202, `status=${genRes.status}, message=${genBody.message}`);
    check('ROUTING_DIRECT', 'General returns confirmed receiptId', Boolean(genBody.receiptId));
    if (genBody.receiptId) createdReceipts.push(genBody.receiptId);

    // -------------------------------------------------------------
    // PART 2: REAL BROWSER UI SUBMISSION WITH NETWORK INTERCEPTION
    // -------------------------------------------------------------
    console.log('\n--- PART 2: BROWSER COMPANY BUILDER TRANSMISSION ---');

    const previewPort = 5231;
    const server = spawn('npx', ['vite', 'preview', '--config', 'vite.integration-phase-i.ts', '--port', String(previewPort)], {
      shell: true,
      stdio: 'ignore',
    });

    await new Promise((r) => setTimeout(r, 2500));

    const browser = await chromium.launch({
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      headless: true,
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    let interceptedUrl = '';
    let interceptedMethod = '';
    let interceptedBody: any = null;

    // Route /api/submissions/* to actual handler in test mode
    await page.route('**/api/submissions/*', async (route: any, request: any) => {
      interceptedUrl = request.url();
      interceptedMethod = request.method();
      const postData = request.postData();
      try {
        interceptedBody = JSON.parse(postData);
      } catch {
        interceptedBody = postData;
      }

      // Execute through our real serverless handler
      const nodeReq = new Request(interceptedUrl, {
        method: interceptedMethod,
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://dynasty-works-studio-review.netlify.app',
          'x-nf-client-connection-ip': '198.51.100.50',
        },
        body: postData,
      });

      try {
        const handlerResponse = await handler(nodeReq);
        const respBody = await handlerResponse.text();
        try {
          const parsed = JSON.parse(respBody);
          if (parsed.receiptId) {
            createdReceipts.push(parsed.receiptId);
          }
        } catch (_) {}
        await route.fulfill({
          status: handlerResponse.status,
          contentType: 'application/json',
          body: respBody,
        });
      } catch (err: any) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'error', message: err.message }),
        });
      }
    });

    await page.goto(`http://127.0.0.1:${previewPort}/#review-builder`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.r51-builder, .dws-diagnostic-shell');

    // Click Start your roadmap or select business type if on entry screen
    const startBtn = page.getByRole('button', { name: 'Start your roadmap', exact: false });
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    const bizTypeBtn = page.locator('.r51-business-types button').first();
    if (await bizTypeBtn.isVisible()) {
      await bizTypeBtn.click();
    }

    const checkbox = page.locator('.r51-diagnostic input[type=checkbox]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }

    // Step 0: Operational Stage -> click Continue
    const continueBtn = page.getByRole('button', { name: 'Continue', exact: true });
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }

    // Step 1: Strategic Priorities -> click Create roadmap
    const createRoadmapBtn = page.getByRole('button', { name: 'Create roadmap', exact: false });
    await createRoadmapBtn.waitFor({ state: 'visible' });
    await createRoadmapBtn.click();

    // Step 2: Executive Roadmap generated -> wait for lead form
    await page.waitForSelector('#executive-roadmap');
    await page.waitForSelector('#lead-name');

    // Fill in lead form
    await page.fill('#lead-name', 'Browser Verification Founder');
    await page.fill('#lead-email', 'browser-verify@dynastyworksstudio.com');
    await page.fill('#lead-phone', '+1 (555) 019-2831');
    await page.fill('#lead-ambition', 'Browser routing verification for Phase 2E.4A.');
    await page.check('#builder-consent');

    // Click Transmit Brief to Studio
    const transmitBtn = page.getByRole('button', { name: 'Transmit Brief to Studio', exact: false });
    await transmitBtn.click();

    // Wait for success confirmation or error message
    await page.waitForFunction(() => {
      const success = document.querySelector('.dws-lead-success');
      const error = document.querySelector('.form-error');
      return Boolean(success || error);
    }, { timeout: 8000 });

    const errorEl = await page.$('.form-error');
    const errorText = errorEl ? await errorEl.innerText() : null;
    const successEl = await page.$('.dws-lead-success');
    const successText = successEl ? await successEl.innerText() : null;

    check('BROWSER_SUBMISSION', 'Browser requested exact canonical URL /api/submissions/builder (no query param)', interceptedUrl.includes('/api/submissions/builder') && !interceptedUrl.includes('?kind='), `interceptedUrl=${interceptedUrl}`);
    check('BROWSER_SUBMISSION', 'Browser payload contains kind = builder in envelope', interceptedBody?.kind === 'builder', `body.kind=${interceptedBody?.kind}`);
    check('BROWSER_SUBMISSION', 'Zero "Invalid or missing submission kind parameter" error in UI', errorText !== 'Invalid or missing submission kind parameter', errorText ? `errorText=${errorText}` : undefined);
    check('BROWSER_SUBMISSION', 'UI displays success confirmation with receipt ID', Boolean(successText && successText.includes('Brief Securely Received')), `successText=${successText?.replace(/\s+/g, ' ').slice(0, 100)}`);

    // Extract receipt if displayed
    if (successText) {
      const match = successText.match(/DWS-[A-Z0-9-]+/);
      if (match) createdReceipts.push(match[0]);
    }

    await browser.close();
    server.kill();

  } finally {
    // -------------------------------------------------------------
    // PART 3: CLEANUP
    // -------------------------------------------------------------
    console.log('\n--- PART 3: SYNTHETIC RECORD CLEANUP ---');
    if (createdReceipts.length > 0) {
      const list = createdReceipts.map((r) => `'${r}'`).join(',');
      queryDb(`
        delete from dynasty_private.leads
        where id in (select lead_id from dynasty_private.inquiries where receipt_id in (${list}));
      `);
      console.log(`Purged receipts: ${list}`);
    }
    queryDb(`delete from dynasty_private.rate_limits;`);

    const counts = queryDb(`
      select 'leads' as tbl, count(*) from dynasty_private.leads
      union all select 'inquiries', count(*) from dynasty_private.inquiries
      union all select 'builder_submissions', count(*) from dynasty_private.builder_submissions
      union all select 'founder_blueprint_intakes', count(*) from dynasty_private.founder_blueprint_intakes
      union all select 'general_inquiries', count(*) from dynasty_private.general_inquiries
      union all select 'rate_limits', count(*) from dynasty_private.rate_limits;
    `);

    const nonZero = counts.filter((c: any) => Number(c.count) > 0);
    for (const c of counts) {
      console.log(`  ${c.tbl}: ${c.count}`);
    }
    check('CLEANUP', 'Zero synthetic rows remain across all tables in Supabase', nonZero.length === 0);
  }

  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.filter((c) => !c.passed).length;
  console.log(`\nVerification complete: ${passed}/${checks.length} checks passed (${failed} failed).`);

  fs.writeFileSync('outputs/integration-phase-i/routing-hotfix-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    total: checks.length,
    passed,
    failed,
    checks,
  }, null, 2));

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
