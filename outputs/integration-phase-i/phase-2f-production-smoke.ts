/**
 * Dynasty Works Studio — Phase 2F Production Smoke Verification
 *
 * Verifies live apex domain, redirect rules, SEO headers, and locked submission state:
 * 1. Apex HTTPS resolution (https://dynastyworksstudio.com).
 * 2. WWW apex canonical redirect (https://www.dynastyworksstudio.com -> apex).
 * 3. Search indexing meta and HTTP headers (index, follow).
 * 4. Production submission gate verification:
 *    - Confirms INQUIRY_SUBMISSIONS_ENABLED is false on production.
 *    - Confirms HTTP 503 with status: 'not_configured' is returned.
 *    - Proves submissions remain strictly locked.
 */

import fs from 'node:fs';
import path from 'node:path';

interface SmokeCheck {
  target: string;
  name: string;
  passed: boolean;
  details?: string;
}

const checks: SmokeCheck[] = [];

function record(target: string, name: string, condition: boolean, details?: string) {
  checks.push({ target, name, passed: Boolean(condition), details });
  const icon = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] [${target}] ${name}${details ? ` (${details})` : ''}`);
}

async function smokeTest() {
  console.log('\n======================================================');
  console.log('DYNASTY WORKS STUDIO — PRODUCTION CUTOVER SMOKE TEST');
  console.log('======================================================\n');

  // 1. Apex HTTPS
  try {
    const apexRes = await fetch('https://dynastyworksstudio.com/', {
      headers: { 'User-Agent': 'DWS-Cutover-Audit/1.0' },
      redirect: 'manual',
    });

    record('Apex Domain', 'Resolves with HTTP 200 OK', apexRes.status === 200, `Status ${apexRes.status}`);

    const robotsHeader = apexRes.headers.get('x-robots-tag');
    record(
      'Apex SEO',
      'X-Robots-Tag permits search indexing (index, follow)',
      Boolean(robotsHeader && robotsHeader.includes('index') && robotsHeader.includes('follow')),
      `Header: ${robotsHeader}`
    );

    const html = await apexRes.text();
    record('Apex HTML', 'Meta robots permits search indexing', html.includes('name="robots" content="index,follow"'));
    record('Apex HTML', 'Title tag renders accurately', html.includes('<title>Dynasty Works Studio — From idea to company</title>'));
    record('Apex HTML', 'Root mounting container present', html.includes('<div id="root"></div>'));
  } catch (err: any) {
    record('Apex Domain', 'Apex HTTPS resolution exception', false, err.message);
  }

  // 2. WWW Redirect to Apex
  try {
    const wwwRes = await fetch('https://www.dynastyworksstudio.com/', {
      redirect: 'manual',
    });

    const isRedirect = wwwRes.status === 301 || wwwRes.status === 308;
    const location = wwwRes.headers.get('location');
    record(
      'WWW Redirect',
      'WWW redirects to apex canonical URL',
      isRedirect && Boolean(location && location.includes('dynastyworksstudio.com')),
      `Status ${wwwRes.status}, Location: ${location}`
    );
  } catch (err: any) {
    record('WWW Redirect', 'WWW request exception', false, err.message);
  }

  // 3. Submissions Locked Gate Verification
  try {
    const submitRes = await fetch('https://dynastyworksstudio.com/api/submissions/builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey: '00000000-0000-0000-0000-000000000001',
        consent: { evaluation: true, communication: true, noticeVersion: 'v1' },
        honeypot: '',
        data: {},
      }),
    });

    const submitJson = await submitRes.json().catch(() => ({}));
    const isLocked = submitRes.status === 503 && submitJson.status === 'not_configured';

    record(
      'Production Lock',
      'Submissions endpoint strictly locked on production (HTTP 503 not_configured)',
      isLocked,
      `Status ${submitRes.status}: ${JSON.stringify(submitJson)}`
    );
  } catch (err: any) {
    record('Production Lock', 'Submissions probe exception', false, err.message);
  }

  // 4. Asset Routing Reachability
  try {
    const assetRes = await fetch('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({}),
    });

    // An empty body should return 400 (bad request), NOT 404 (not found)
    record(
      'Asset Routing',
      'Assets endpoint correctly routed (returns HTTP 400 on empty request, not 404)',
      assetRes.status === 400,
      `Status ${assetRes.status}`
    );
  } catch (err: any) {
    record('Asset Routing', 'Asset probe exception', false, err.message);
  }

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;
  const failed = total - passed;

  console.log('\n======================================================');
  console.log(`SMOKE TEST SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('======================================================\n');

  fs.writeFileSync(
    path.join('outputs', 'integration-phase-i', 'phase-2f-production-smoke.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), total, passed, failed, checks }, null, 2)
  );

  if (failed > 0) {
    process.exit(1);
  }
}

smokeTest().catch((err) => {
  console.error('Fatal smoke test runner error:', err);
  process.exit(1);
});
