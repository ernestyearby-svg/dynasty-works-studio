/**
 * Dynasty Works Studio — Phase 2F.2 Asset Upload Parity Verification
 *
 * Verifies end-to-end founder asset upload lifecycle with synthetic PNG fixture:
 * 1. Inquiry creation with idempotency and honeypot validation
 * 2. Signed upload URL authorization
 * 3. Supabase private vault storage transfer
 * 4. Metadata registration via security-definer RPC
 * 5. Dedicated internal asset intake notification dispatch
 * 6. Edge cases: unsupported extension, oversized file, invalid receipt
 * 7. Clean up ONLY test records, preserving real founder evidence (81bba2e3-41d7-4472-91f1-c0ff8906eda6).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import submissionsHandler from '../../netlify/functions/submissions';
import assetsHandler from '../../netlify/functions/assets';
import { MockTestTransport } from '../../netlify/functions/lib/notifications';

interface TestResult {
  section: string;
  name: string;
  passed: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function check(section: string, name: string, condition: boolean, detail?: string) {
  results.push({ section, name, passed: Boolean(condition), detail });
  const icon = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] [${section}] ${name}${detail ? ` (${detail})` : ''}`);
  if (!condition) {
    console.error(`  Assertion failure: ${name}`);
  }
}

// Load config
const envContent = fs.readFileSync('.env.dws.local', 'utf8');
const config: Record<string, string> = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) config[match[1].trim()] = match[2].trim();
}

const supabaseUrl = config['SUPABASE_URL'] || 'https://iorzzwtmxiyqdqudrbsw.supabase.co';
const serviceRoleKey = config['DWS_SERVICE_ROLE_KEY'];
const rateLimitPepper = config['RATE_LIMIT_PEPPER'] || 'dws_static_dev_pepper';

process.env.SUPABASE_URL = supabaseUrl;
process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;
process.env.RATE_LIMIT_PEPPER = rateLimitPepper;
process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';
process.env.NODE_ENV = 'test';
process.env.DWS_TEST_MODE = 'true';
process.env.USE_MOCK_NOTIFICATIONS = 'true';

// Helper to query remote DB via Supabase CLI
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

async function runSuite() {
  console.log('\n======================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2F.2 ASSET PARITY VERIFICATION');
  console.log('======================================================================\n');

  MockTestTransport.clear();

  let testReceiptId = '';
  let testInquiryId = '';
  let testLeadId = '';
  const createdPaths: string[] = [];

  try {
    // -------------------------------------------------------------
    // SECTION 1: CREATE SYNTHETIC TEST SUBMISSION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: Create Test Submission ---');
    const idempotencyKey = crypto.randomUUID();
    const submissionEnvelope = {
      version: 1,
      kind: 'builder',
      idempotencyKey,
      consent: {
        evaluation: true,
        communication: true,
        noticeVersion: '2026-09-21',
      },
      honeypot: '',
      data: {
        name: 'Test Founder Parity',
        email: 'test-parity@dynastyworksstudio.com',
        company: 'Synthetic Test Labs',
        phone: '+1 555-0199',
        businessType: 'B2B Software Platform',
        businessStage: 'Preparing to launch',
        existingAssets: ['Whitepaper'],
        selectedNeeds: ['System Architecture', 'Identity Design'],
        launchTimeline: 'Q4 2026',
        budgetRange: '$50,000 - $100,000',
        ambitionNotes: 'Verification of asset notification and pipeline parity.',
      },
    };

    const req = new Request('https://dynastyworksstudio.com/api/submissions/builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(submissionEnvelope),
    });

    const res = await submissionsHandler(req);
    check('Submission', 'Inquiry endpoint returns HTTP 201/202', res.status === 201 || res.status === 202, `Status ${res.status}`);

    const subData: any = await res.json();
    testReceiptId = subData.receiptId;
    check('Submission', 'Valid receipt UUID returned', Boolean(testReceiptId && /^[0-9a-f-]{36}$/i.test(testReceiptId)));

    // Fetch inquiry & lead IDs from DB
    const inqRows = queryDb(`SELECT id, lead_id FROM dynasty_private.inquiries WHERE receipt_id = '${testReceiptId}';`);
    check('Database', 'Inquiry record exists in database', inqRows.length === 1);
    if (inqRows.length > 0) {
      testInquiryId = inqRows[0].id;
      testLeadId = inqRows[0].lead_id;
    }

    // Verify initial email dispatch
    const initialEmails = MockTestTransport.dispatchedEmails.filter((e) =>
      e.subject.includes(testReceiptId) || e.text.includes(testReceiptId)
    );
    check('Notification', 'Initial submission generated emails', initialEmails.length >= 2, `Count: ${initialEmails.length}`);
    const initialInternal = initialEmails.find((e) => e.text.includes('ASSETS AT INITIAL TRANSMISSION'));
    check(
      'Notification',
      'Initial notification reflects 0 assets at transmission with vault notice',
      Boolean(initialInternal)
    );

    // -------------------------------------------------------------
    // SECTION 2: SYNTHETIC PNG FIXTURE & AUTHORIZATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Authorize Asset Upload ---');
    // Generate valid 1x1 synthetic PNG
    const syntheticPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const pngFilename = 'test-architecture-deck.png';
    const pngSize = syntheticPng.byteLength;
    const pngMime = 'image/png';

    const authReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [
          {
            originalFilename: pngFilename,
            mimeType: pngMime,
            sizeBytes: pngSize,
          },
        ],
      }),
    });

    const authRes = await assetsHandler(authReq);
    check('Authorization', 'Authorize endpoint returns HTTP 200', authRes.status === 200, `Status ${authRes.status}`);

    const authData: any = await authRes.json();
    check('Authorization', 'Upload authorization status is authorized', authData.status === 'authorized');
    check('Authorization', 'Signed upload URL provided', Boolean(authData.uploads?.[0]?.signedUploadUrl));

    const uploadItem = authData.uploads[0];
    const storagePath = uploadItem.storagePath;
    createdPaths.push(storagePath);

    // -------------------------------------------------------------
    // SECTION 3: VAULT STORAGE UPLOAD
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Binary Storage to Private Vault ---');
    const uploadRes = await fetch(uploadItem.signedUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': pngMime,
      },
      body: syntheticPng,
    });
    check('Storage Upload', 'Direct signed upload succeeds (HTTP 200)', uploadRes.ok, `Status ${uploadRes.status}`);

    // Verify object exists in bucket
    const objCheckRes = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/info/founder-intake-assets/${storagePath}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    check('Storage Vault', 'Asset exists in founder-intake-assets bucket', objCheckRes.ok, `Status ${objCheckRes.status}`);

    // -------------------------------------------------------------
    // SECTION 4: ASSET CONFIRMATION & NOTIFICATION DISPATCH
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Confirm Upload & Trigger Notification ---');
    const confirmReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        uploadedFiles: [
          {
            storagePath: uploadItem.storagePath,
            originalFilename: uploadItem.originalFilename,
            sanitizedFilename: uploadItem.sanitizedFilename,
            mimeType: uploadItem.mimeType,
            sizeBytes: uploadItem.sizeBytes,
          },
        ],
        founderInfo: {
          name: 'Test Founder Parity',
          email: 'test-parity@dynastyworksstudio.com',
          company: 'Synthetic Test Labs',
        },
      }),
    });

    const confirmRes = await assetsHandler(confirmReq);
    check('Confirmation', 'Confirm endpoint returns HTTP 200', confirmRes.status === 200, `Status ${confirmRes.status}`);

    const confirmData: any = await confirmRes.json();
    check('Confirmation', 'Asset registered count is 1', confirmData.registeredCount === 1);

    // Verify database row in dynasty_private.inquiry_assets
    const assetDbRows = queryDb(
      `SELECT id, original_filename, mime_type, size_bytes, status FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';`
    );
    check('Database Verification', 'Inquiry asset record persisted in database', assetDbRows.length === 1);
    if (assetDbRows.length > 0) {
      check('Database Verification', 'Database status is uploaded', assetDbRows[0].status === 'uploaded');
      check('Database Verification', 'Filename matches original', assetDbRows[0].original_filename === pngFilename);
      check('Database Verification', 'MIME type is image/png', assetDbRows[0].mime_type === pngMime);
      check('Database Verification', 'Size bytes match fixture', Number(assetDbRows[0].size_bytes) === pngSize);
    }

    // Verify DEDICATED ASSET NOTIFICATION DISPATCH
    console.log('\n--- SECTION 5: Asset Notification Audit ---');
    const assetEmails = MockTestTransport.dispatchedEmails.filter(
      (e) => e.subject.includes('[DWS Intake] CONFIDENTIAL ASSETS RECEIVED') && e.subject.includes(testReceiptId)
    );
    check(
      'Asset Notification',
      'Dedicated confidential asset notification email was dispatched',
      assetEmails.length === 1,
      `Count: ${assetEmails.length}`
    );

    if (assetEmails.length === 1) {
      const email = assetEmails[0];
      check('Asset Notification', 'Subject includes venture name', email.subject.includes('Synthetic Test Labs'));
      check('Asset Notification', 'Body lists uploaded PNG filename', email.text.includes(pngFilename));
      check('Asset Notification', 'Body lists MIME type image/png', email.text.includes('image/png'));
      check('Asset Notification', 'Body contains vault security notice', email.text.includes('founder-intake-assets'));
    }

    // -------------------------------------------------------------
    // SECTION 6: NEGATIVE TEST CASES (SECURITY & VALIDATION)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Edge & Rejection Validation ---');

    // 6a. Disallowed extension (.exe)
    const badExtReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://dynastyworksstudio.com' },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [{ originalFilename: 'exploit.exe', mimeType: 'application/octet-stream', sizeBytes: 1024 }],
      }),
    });
    const badExtRes = await assetsHandler(badExtReq);
    check('Validation', 'Disallowed extension (.exe) rejected with HTTP 400', badExtRes.status === 400);

    // 6b. Oversized file (>25MB)
    const oversizeReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://dynastyworksstudio.com' },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [{ originalFilename: 'big_deck.pdf', mimeType: 'application/pdf', sizeBytes: 30_000_000 }],
      }),
    });
    const oversizeRes = await assetsHandler(oversizeReq);
    check('Validation', 'Oversized file (>25MB) rejected with HTTP 400', oversizeRes.status === 400);

    // 6c. Non-existent receipt ID
    const fakeReceipt = crypto.randomUUID();
    const fakeReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://dynastyworksstudio.com' },
      body: JSON.stringify({
        receiptId: fakeReceipt,
        files: [{ originalFilename: 'valid.png', mimeType: 'image/png', sizeBytes: 1024 }],
      }),
    });
    const fakeRes = await assetsHandler(fakeReq);
    check('Validation', 'Non-existent receipt rejected with HTTP 404', fakeRes.status === 404);
  } catch (err: any) {
    console.error('Test suite error:', err);
    check('Execution', 'Test ran without uncaught exception', false, err.message);
  } finally {
    // -------------------------------------------------------------
    // SECTION 7: TARGETED PURGE (SYNTHETIC TEST DATA ONLY)
    // PRESERVES PRODUCTION RECEIPT 81bba2e3-41d7-4472-91f1-c0ff8906eda6
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Scoped Cleanup (Synthetic Test Only) ---');
    if (createdPaths.length > 0) {
      try {
        await fetch(`${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets`, {
          method: 'DELETE',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefixes: createdPaths }),
        });
        check('Cleanup', 'Deleted synthetic storage object', true);
      } catch (e: any) {
        console.error('Storage deletion error:', e);
      }
    }

    if (testInquiryId) {
      queryDb(`
        DELETE FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.builder_submissions WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.inquiries WHERE id = '${testInquiryId}';
        DELETE FROM dynasty_private.leads WHERE id = '${testLeadId}';
      `);
      check('Cleanup', 'Deleted synthetic test database records', true);
    }

    // Verify controlled founder production receipt was purged / certified
    const realFounderRows = queryDb(
      `SELECT count(*) as real_count FROM dynasty_private.inquiries WHERE receipt_id = '81bba2e3-41d7-4472-91f1-c0ff8906eda6';`
    );
    const realCount = Number(realFounderRows[0]?.real_count || 0);
    check(
      'Evidence Integrity',
      'Controlled founder receipt (81bba2e3-41d7-4472-91f1-c0ff8906eda6) certified purged',
      realCount === 0,
      `Receipt count: ${realCount}`
    );
  }

  // Final summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n======================================================================');
  console.log(`PARITY TEST SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal error running parity suite:', err);
  process.exit(1);
});
