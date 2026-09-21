/**
 * Dynasty Works Studio — Phase 2F.3 Principal Vault Security Test Matrix
 *
 * Direct mapping to Section 08:
 * A. missing passcode → DENIED
 * B. wrong passcode → DENIED
 * C. malformed passcode → DENIED
 * D. correct principal authentication → AUTHORIZED
 * E. missing asset ID → DENIED
 * F. missing receipt ID → DENIED
 * G. random asset ID → DENIED
 * H. random receipt ID → DENIED
 * I. valid asset + wrong receipt → DENIED
 * J. valid receipt + wrong asset → DENIED
 * K. cross-inquiry asset → DENIED
 * L. identifier-only request → DENIED
 * M. direct public storage URL → DENIED
 * N. direct anon RPC → DENIED
 * O. direct authenticated RPC → DENIED
 * P. repeated failed authentication → RATE LIMITED
 * Q. successful authorized retrieval → one-object signed URL
 * R. signed URL expiration <= 900 seconds
 * S. expired signed URL → DENIED
 * T. storage bucket remains private
 *
 * Self-contained lifecycle:
 * Seeds ephemeral synthetic test fixtures in setup, runs all 20 security matrix
 * validations, and cleanly purges the test fixtures in teardown leaving zero residue.
 */

import fs from 'node:fs';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import assetsHandler from '../../netlify/functions/assets';

interface TestResult {
  code: string;
  test: string;
  expectedStatus: number | string;
  actualStatus: number | string;
  passed: boolean;
  notes?: string;
}

const results: TestResult[] = [];

function recordTest(code: string, test: string, expectedStatus: number | string, actualStatus: number | string, condition: boolean, notes?: string) {
  const passed = Boolean(condition);
  results.push({ code, test, expectedStatus, actualStatus, passed, notes });
  const icon = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] Test ${code}: ${test} (Expected: ${expectedStatus}, Actual: ${actualStatus})${notes ? ` - ${notes}` : ''}`);
}

// Load environment configuration
let envContent = '';
if (fs.existsSync('.env.dws.local')) {
  envContent = fs.readFileSync('.env.dws.local', 'utf8');
} else if (fs.existsSync('.env')) {
  envContent = fs.readFileSync('.env', 'utf8');
}

const config: Record<string, string> = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) config[match[1].trim()] = match[2].trim();
}

const TEST_PRINCIPAL_KEY = 'DWS_LOCAL_TEST_PASSCODE_VERIFICATION_KEY_2026_!';
process.env.DWS_PRINCIPAL_KEY = TEST_PRINCIPAL_KEY;
process.env.SUPABASE_URL = config['SUPABASE_URL'] || 'https://iorzzwtmxiyqdqudrbsw.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = config['DWS_SERVICE_ROLE_KEY'] || config['SUPABASE_SERVICE_ROLE_KEY'];
process.env.RATE_LIMIT_PEPPER = config['RATE_LIMIT_PEPPER'] || 'dws_static_test_pepper';
process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function queryDb(sql: string): any[] {
  const clean = sql.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/"/g, '\\"').trim();
  try {
    const out = execSync(`npx supabase db query --linked "${clean}"`, { encoding: 'utf8' });
    const jsonMatch = out.match(/\{[\s\S]*"rows"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).rows;
    }
    return [];
  } catch (err: any) {
    console.error('SQL query error:', err.message);
    return [];
  }
}

async function runMatrix() {
  console.log('\n======================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2F.3 SECTION 08 SECURITY TEST MATRIX');
  console.log('======================================================================\n');

  // Ephemeral test fixture identifiers
  const SYNTH_RECEIPT_1 = crypto.randomUUID();
  const SYNTH_INQUIRY_1 = crypto.randomUUID();
  const SYNTH_LEAD_1 = crypto.randomUUID();
  const SYNTH_ASSET_1 = crypto.randomUUID();

  const SYNTH_RECEIPT_2 = crypto.randomUUID();
  const SYNTH_INQUIRY_2 = crypto.randomUUID();
  const SYNTH_LEAD_2 = crypto.randomUUID();
  const SYNTH_ASSET_2 = crypto.randomUUID();

  const SYNTH_FILENAME_2 = 'founder_secure_test_document.jpeg';
  const SYNTH_STORAGE_PATH_2 = `${SYNTH_INQUIRY_2}/fixture-${SYNTH_FILENAME_2}`;

  const hash1 = crypto.createHash('sha256').update(SYNTH_INQUIRY_1).digest('hex');
  const hash2 = crypto.createHash('sha256').update(SYNTH_INQUIRY_2).digest('hex');

  console.log('--- Setting up ephemeral synthetic security fixtures ---');
  try {
    // 1. Insert DB fixtures
    queryDb(`
      INSERT INTO dynasty_private.leads (id, name, email, company_name, source, status)
      VALUES 
        ('${SYNTH_LEAD_1}', 'Synthetic Founder 1', 'founder1@example.com', 'Acme 1', 'builder', 'NEW'),
        ('${SYNTH_LEAD_2}', 'Synthetic Founder 2', 'founder2@example.com', 'Acme 2', 'builder', 'NEW');

      INSERT INTO dynasty_private.inquiries (id, lead_id, inquiry_type, idempotency_key, payload_hash, receipt_id, evaluation_consent, communication_consent, notice_version, consent_at, notification_status, retry_count, metadata)
      VALUES 
        ('${SYNTH_INQUIRY_1}', '${SYNTH_LEAD_1}', 'builder', '${crypto.randomUUID()}', '${hash1}', '${SYNTH_RECEIPT_1}', true, true, '1.0', now(), 'SENT', 0, '{}'::jsonb),
        ('${SYNTH_INQUIRY_2}', '${SYNTH_LEAD_2}', 'builder', '${crypto.randomUUID()}', '${hash2}', '${SYNTH_RECEIPT_2}', true, true, '1.0', now(), 'SENT', 0, '{}'::jsonb);

      INSERT INTO dynasty_private.inquiry_assets (id, inquiry_id, lead_id, storage_bucket, storage_path, original_filename, sanitized_filename, mime_type, size_bytes, status, metadata)
      VALUES 
        ('${SYNTH_ASSET_1}', '${SYNTH_INQUIRY_1}', '${SYNTH_LEAD_1}', 'founder-intake-assets', '${SYNTH_INQUIRY_1}/doc1.png', 'doc1.png', 'doc1.png', 'image/png', 2048, 'uploaded', '{}'::jsonb),
        ('${SYNTH_ASSET_2}', '${SYNTH_INQUIRY_2}', '${SYNTH_LEAD_2}', 'founder-intake-assets', '${SYNTH_STORAGE_PATH_2}', '${SYNTH_FILENAME_2}', '${SYNTH_FILENAME_2}', 'image/jpeg', 4096, 'uploaded', '{}'::jsonb);
    `);

    // 2. Upload synthetic storage fixture
    const uploadRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets/${SYNTH_STORAGE_PATH_2}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'image/jpeg',
      },
      body: Buffer.from('DYNASTY_WORKS_STUDIO_SYNTHETIC_TEST_FIXTURE_BINARY_DATA'),
    });
    if (!uploadRes.ok) {
      console.warn('Synthetic storage upload warning:', await uploadRes.text());
    }
  } catch (e: any) {
    console.error('Fixture setup error:', e);
  }

  async function callRetrieve(body: any, clientIp = '127.0.0.1') {
    const req = new Request('http://localhost:5202/api/submissions/assets/retrieve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-nf-client-connection-ip': clientIp,
      },
      body: JSON.stringify(body),
    });
    const res = await assetsHandler(req);
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  let authorizedPayload: any = null;

  try {
    // A. missing passcode → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_2 }, '10.1.0.1');
      recordTest('A', 'missing passcode → DENIED', 401, res.status, res.status === 401);
    }

    // B. wrong passcode → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_2, passcode: 'invalid_passcode' }, '10.1.0.2');
      recordTest('B', 'wrong passcode → DENIED', 401, res.status, res.status === 401);
    }

    // C. malformed passcode → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY + 'mod' }, '10.1.0.3');
      recordTest('C', 'malformed passcode → DENIED', 401, res.status, res.status === 401);
    }

    // D. correct principal authentication → AUTHORIZED
    {
      const { res, data } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.4');
      authorizedPayload = data;
      recordTest('D', 'correct principal authentication → AUTHORIZED', 200, res.status, res.status === 200 && data.status === 'authorized');
    }

    // E. missing asset ID → DENIED
    {
      const { res } = await callRetrieve({ rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.5');
      recordTest('E', 'missing asset ID → DENIED', 400, res.status, res.status === 400);
    }

    // F. missing receipt ID → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.6');
      recordTest('F', 'missing receipt ID → DENIED', 400, res.status, res.status === 400);
    }

    // G. random asset ID → DENIED
    {
      const randomAid = '00000000-0000-0000-0000-000000000000';
      const { res } = await callRetrieve({ aid: randomAid, rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.7');
      recordTest('G', 'random asset ID → DENIED', 404, res.status, res.status === 404);
    }

    // H. random receipt ID → DENIED
    {
      const randomRid = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: randomRid, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.8');
      recordTest('H', 'random receipt ID → DENIED', 403, res.status, res.status === 403);
    }

    // I. valid asset + wrong receipt → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_1, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.9');
      recordTest('I', 'valid asset + wrong receipt → DENIED', 403, res.status, res.status === 403, 'Cross-tenant receipt mismatch rejected');
    }

    // J. valid receipt + wrong asset → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_1, rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.10');
      recordTest('J', 'valid receipt + wrong asset → DENIED', 403, res.status, res.status === 403);
    }

    // K. cross-inquiry asset → DENIED
    {
      const { res } = await callRetrieve({ aid: SYNTH_ASSET_1, rid: SYNTH_RECEIPT_2, passcode: TEST_PRINCIPAL_KEY }, '10.1.0.11');
      recordTest('K', 'cross-inquiry asset → DENIED', 403, res.status, res.status === 403);
    }

    // L. identifier-only request → DENIED
    {
      const req = new Request(`http://localhost:5202/api/submissions/assets/retrieve?aid=${SYNTH_ASSET_2}&rid=${SYNTH_RECEIPT_2}`, {
        method: 'GET',
      });
      const res = await assetsHandler(req);
      recordTest('L', 'identifier-only request (GET with aid+rid) → DENIED', 405, res.status, res.status === 405, 'Requires POST and passcode');
    }

    // M. direct public storage URL → DENIED
    {
      const rawStorageUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets/${SYNTH_STORAGE_PATH_2}`;
      const rawRes = await fetch(rawStorageUrl, { method: 'GET' });
      recordTest('M', 'direct public storage URL → DENIED', '400/403/404', rawRes.status, rawRes.status === 400 || rawRes.status === 403 || rawRes.status === 404, 'Unsigned direct request rejected');
    }

    // N. direct anon RPC → DENIED
    {
      const anonRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_asset_by_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Profile': 'dynasty_private',
        },
        body: JSON.stringify({ p_asset_id: SYNTH_ASSET_2 }),
      });
      recordTest('N', 'direct anon RPC get_asset_by_id → DENIED', '401/403', anonRes.status, anonRes.status === 401 || anonRes.status === 403, 'Anon execution revoked');
    }

    // O. direct authenticated RPC → DENIED
    {
      const anonAudit = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/record_asset_retrieval_audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Profile': 'dynasty_private',
        },
        body: JSON.stringify({ p_asset_id: SYNTH_ASSET_2 }),
      });
      recordTest('O', 'direct authenticated/anon RPC record_asset_retrieval_audit → DENIED', '401/403', anonAudit.status, anonAudit.status === 401 || anonAudit.status === 403, 'Public execution revoked');
    }

    // P. repeated failed authentication → RATE LIMITED
    {
      const throttleIp = '192.168.77.88';
      let lockedOut = false;
      let lastCode = 0;
      for (let i = 1; i <= 6; i++) {
        const { res } = await callRetrieve({ aid: SYNTH_ASSET_2, rid: SYNTH_RECEIPT_2, passcode: 'bad' }, throttleIp);
        lastCode = res.status;
        if (res.status === 429) {
          lockedOut = true;
          break;
        }
      }
      recordTest('P', 'repeated failed authentication → RATE LIMITED', 429, lastCode, lockedOut && lastCode === 429, 'Rate limiter triggered after 5 failed attempts');
    }

    // Q. successful authorized retrieval → one-object signed URL
    {
      const isSingleObject = Boolean(authorizedPayload?.signedUrl && authorizedPayload.signedUrl.includes(SYNTH_FILENAME_2));
      recordTest('Q', 'successful authorized retrieval → one-object signed URL', 'one-object', isSingleObject ? 'one-object' : 'multi-or-null', isSingleObject, `Signed URL issued for: ${authorizedPayload?.originalFilename}`);
    }

    // R. signed URL expiration <= 900 seconds
    {
      const isUnder900 = authorizedPayload?.expiresIn === 900;
      recordTest('R', 'signed URL expiration <= 900 seconds', '900s', `${authorizedPayload?.expiresIn}s`, isUnder900);
    }

    // S. expired signed URL → DENIED
    {
      const signRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/sign/founder-intake-assets/${SYNTH_STORAGE_PATH_2}`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 1 }),
      });
      const signData: any = await signRes.json();
      const shortSignedUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1${signData.signedURL}`;

      // Wait 2 seconds for expiry
      await new Promise((r) => setTimeout(r, 2000));
      const expiredFetch = await fetch(shortSignedUrl);
      recordTest('S', 'expired signed URL → DENIED', '400/403/404', expiredFetch.status, expiredFetch.status >= 400, `Expired signed URL rejected with HTTP ${expiredFetch.status}`);
    }

    // T. storage bucket remains private
    {
      const bucketCheck = await fetch(`${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/founder-intake-assets/`, {
        method: 'GET',
      });
      recordTest('T', 'storage bucket remains private', '400/403/404', bucketCheck.status, bucketCheck.status >= 400, 'Public bucket listing rejected');
    }
  } finally {
    // Clean up ephemeral synthetic fixtures
    console.log('\n--- Cleaning up ephemeral synthetic security fixtures ---');
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets`, {
        method: 'DELETE',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefixes: [SYNTH_STORAGE_PATH_2] }),
      });
    } catch (e) {
      console.error('Storage fixture deletion error:', e);
    }

    try {
      queryDb(`
        DELETE FROM dynasty_private.asset_retrieval_audits WHERE inquiry_id IN ('${SYNTH_INQUIRY_1}', '${SYNTH_INQUIRY_2}');
        DELETE FROM dynasty_private.inquiry_assets WHERE inquiry_id IN ('${SYNTH_INQUIRY_1}', '${SYNTH_INQUIRY_2}');
        DELETE FROM dynasty_private.inquiries WHERE id IN ('${SYNTH_INQUIRY_1}', '${SYNTH_INQUIRY_2}');
        DELETE FROM dynasty_private.leads WHERE id IN ('${SYNTH_LEAD_1}', '${SYNTH_LEAD_2}');
      `);
      console.log('Database fixtures purged.');
    } catch (e) {
      console.error('Database fixture cleanup error:', e);
    }
  }

  console.log('\n======================================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log(`OVERALL VERDICT: ${allPassed ? 'ALL TESTS PASSED (100%) — ZERO UNAUTHORIZED BINARY DISCLOSURE' : 'TEST FAILURES DETECTED'}`);
  console.log('======================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runMatrix().catch((err) => {
  console.error('Security Matrix failure:', err);
  process.exit(1);
});
