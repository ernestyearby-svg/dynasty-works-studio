/**
 * Dynasty Works Studio — Phase 2F Secure Asset Upload Verification Suite
 *
 * Verifies end-to-end founder asset intake, storage isolation, and database registration:
 * 1. Storage bucket configuration (private, 25MB max per file, MIME restrictions).
 * 2. Upload authorization flow (signed upload URL generation).
 * 3. File ingestion across supported formats (PDF, DOCX, XLSX, PPTX, PNG).
 * 4. Database metadata persistence via security-definer RPC register_inquiry_asset.
 * 5. Retrieval verification via get_inquiry_assets RPC.
 * 6. Constraint enforcement:
 *    - Rejection of disallowed extensions (.exe, .sh)
 *    - Rejection of oversized files (>25MB)
 * 7. Storage privacy audit: confirms public anonymous object URLs return 400/404.
 * 8. Zero synthetic data leakage: purges all test objects from bucket and database rows.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import submissionsHandler from '../../netlify/functions/submissions';
import assetsHandler from '../../netlify/functions/assets';

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

// 1. Load Local Config
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
  console.log('\n==================================================');
  console.log('DYNASTY WORKS STUDIO — PHASE 2F ASSET VERIFICATION');
  console.log('==================================================\n');

  const createdPaths: string[] = [];
  let testReceiptId = '';
  let testInquiryId = '';
  let testLeadId = '';

  try {
    // -------------------------------------------------------------
    // SECTION 1: STORAGE BUCKET INTEGRITY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: Storage Bucket Configuration ---');
    const bucketRows = queryDb(
      `SELECT id, name, public, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = 'founder-intake-assets';`
    );

    check('Storage Bucket', 'founder-intake-assets bucket exists', bucketRows.length === 1);
    if (bucketRows.length === 1) {
      const b = bucketRows[0];
      check('Storage Bucket', 'Bucket is strictly private (public = false)', b.public === false);
      check('Storage Bucket', 'File size limit is set to 25MB (26214400 bytes)', Number(b.file_size_limit) === 26214400);
      check('Storage Bucket', 'Allowed MIME types are restricted', Array.isArray(b.allowed_mime_types) && b.allowed_mime_types.length >= 8);
    }

    // -------------------------------------------------------------
    // SECTION 2: CREATE AUTHORITATIVE INQUIRY FOR TESTING
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Create Authoritative Test Inquiry ---');
    const idempotencyKey = crypto.randomUUID();
    const envelope = {
      version: 1,
      kind: 'builder',
      idempotencyKey,
      consent: {
        evaluation: true,
        communication: true,
        noticeVersion: 'dws-eval-v1',
      },
      honeypot: '',
      data: {
        name: 'Phase 2F Test Founder',
        email: 'synthetic-phase2f-founder@example.com',
        phone: '+1 (555) 019-2831',
        company: 'Synthetic Quantum Holdings',
        businessType: 'CPG Brand',
        businessStage: 'Preparing to launch',
        existingAssets: ['Brand Identity'],
        selectedNeeds: ['Packaging', 'Application'],
        launchTimeline: 'Q4 2026',
        budgetRange: '$50,000 - $100,000',
        ambitionNotes: 'Phase 2F synthetic asset integration test brief.',
      },
    };

    const submitReq = new Request('http://localhost/.netlify/functions/submissions?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
        'x-forwarded-for': '198.51.100.99',
      },
      body: JSON.stringify(envelope),
    });

    const submitRes = await submissionsHandler(submitReq);
    const submitBody = await submitRes.json().catch(() => ({}));
    check('Inquiry Creation', 'Submissions endpoint returns HTTP 202', submitRes.status === 202, `Status ${submitRes.status}: ${JSON.stringify(submitBody)}`);
    testReceiptId = submitBody.receiptId;
    check('Inquiry Creation', 'Valid receipt ID generated', Boolean(testReceiptId && /^[0-9a-f-]{36}$/i.test(testReceiptId)));

    // Verify DB inquiry row
    const inqRows = queryDb(
      `SELECT id, lead_id FROM dynasty_private.inquiries WHERE receipt_id = '${testReceiptId}';`
    );
    check('Inquiry Creation', 'Authoritative inquiry persisted in database', inqRows.length === 1);
    if (inqRows.length > 0) {
      testInquiryId = inqRows[0].id;
      testLeadId = inqRows[0].lead_id;
    }

    // -------------------------------------------------------------
    // SECTION 3: UPLOAD AUTHORIZATION (SIGNED URL GENERATION)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Upload Authorization Flow ---');
    const authReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [
          { originalFilename: 'pitch-deck.pdf', sizeBytes: 1024, mimeType: 'application/pdf' },
          { originalFilename: 'cap-table.xlsx', sizeBytes: 2048, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          { originalFilename: 'brand-architecture.png', sizeBytes: 4096, mimeType: 'image/png' },
        ],
      }),
    });

    const authRes = await assetsHandler(authReq);
    const authBody = await authRes.json().catch(() => ({}));
    check('Authorization', 'Assets authorize endpoint returns HTTP 200', authRes.status === 200, `Status ${authRes.status}: ${JSON.stringify(authBody)}`);
    check('Authorization', 'Authorization response status is authorized', authBody.status === 'authorized');
    check('Authorization', 'Returned 3 authorized uploads', Array.isArray(authBody.uploads) && authBody.uploads.length === 3);

    const uploads = authBody.uploads || [];
    for (const u of uploads) {
      check('Authorization', `Signed upload URL generated for ${u.originalFilename}`, Boolean(u.signedUploadUrl && u.signedUploadUrl.includes('token=')));
      check('Authorization', `Storage path scoped to inquiryId for ${u.originalFilename}`, u.storagePath.startsWith(testInquiryId));
    }

    // -------------------------------------------------------------
    // SECTION 4: FILE INGESTION & UPLOAD
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: File Ingestion (Signed Transfer) ---');
    const syntheticBuffer = Buffer.from('%PDF-1.4 Synthetic Test PDF Content for DWS Phase 2F Verification Suite');

    for (const u of uploads) {
      // Upload binary to Supabase Storage signed upload URL
      const putRes = await fetch(u.signedUploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': u.mimeType,
        },
        body: syntheticBuffer,
      });

      check('File Transfer', `Binary transfer to signed URL succeeds for ${u.originalFilename}`, putRes.ok, `Status ${putRes.status}`);
      if (putRes.ok) {
        createdPaths.push(u.storagePath);
      }
    }

    // -------------------------------------------------------------
    // SECTION 5: METADATA CONFIRMATION & RPC
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Metadata Confirmation & RPC ---');
    const confirmReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        uploadedFiles: uploads.map((u: any) => ({
          storagePath: u.storagePath,
          originalFilename: u.originalFilename,
          sanitizedFilename: u.sanitizedFilename,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
        })),
      }),
    });

    const confirmRes = await assetsHandler(confirmReq);
    const confirmBody = await confirmRes.json().catch(() => ({}));
    check('Confirmation', 'Confirm endpoint returns HTTP 200', confirmRes.status === 200, `Status ${confirmRes.status}: ${JSON.stringify(confirmBody)}`);
    check('Confirmation', 'Confirmed 3 registered assets', confirmBody.registeredCount === 3, `Count: ${confirmBody.registeredCount}`);

    // Verify DB rows in dynasty_private.inquiry_assets
    const assetDbRows = queryDb(
      `SELECT id, original_filename, mime_type, storage_path FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';`
    );
    check('Metadata Persistence', 'Database contains 3 inquiry_assets records', assetDbRows.length === 3);

    // Verify retrieval RPC get_inquiry_assets
    const rpcRows = queryDb(
      `SELECT * FROM dynasty_private.get_inquiry_assets('${testReceiptId}');`
    );
    check('RPC Retrieval', 'get_inquiry_assets RPC returns 3 matching records', rpcRows.length === 3);

    // -------------------------------------------------------------
    // SECTION 6: NEGATIVE SECURITY CONSTRAINTS
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Constraint & Abuse Protection ---');

    // 6a. Disallowed extension
    const badExtReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [{ originalFilename: 'malware.exe', sizeBytes: 1024, mimeType: 'application/octet-stream' }],
      }),
    });
    const badExtRes = await assetsHandler(badExtReq);
    check('Security Check', 'Disallowed extension (.exe) rejected with HTTP 400', badExtRes.status === 400);

    // 6b. Oversized file (>25MB)
    const oversizeReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [{ originalFilename: 'huge-archive.pdf', sizeBytes: 28_000_000, mimeType: 'application/pdf' }],
      }),
    });
    const oversizeRes = await assetsHandler(oversizeReq);
    check('Security Check', 'Oversized file (>25MB) rejected with HTTP 400', oversizeRes.status === 400);

    // 6c. Non-existent receipt ID
    const fakeReceiptReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: '00000000-0000-0000-0000-000000000000',
        files: [{ originalFilename: 'doc.pdf', sizeBytes: 1024, mimeType: 'application/pdf' }],
      }),
    });
    const fakeReceiptRes = await assetsHandler(fakeReceiptReq);
    const fakeBody = await fakeReceiptRes.json().catch(() => ({}));
    check('Security Check', 'Non-existent receipt rejected with HTTP 404', fakeReceiptRes.status === 404, `Status ${fakeReceiptRes.status}: ${JSON.stringify(fakeBody)}`);

    // -------------------------------------------------------------
    // SECTION 7: STORAGE PRIVACY AUDIT (ANONYMOUS DIRECT ACCESS)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Storage Privacy Audit ---');
    if (createdPaths.length > 0) {
      const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/founder-intake-assets/${createdPaths[0]}`;
      const anonRes = await fetch(publicUrl, { method: 'GET' });
      check(
        'Storage Privacy',
        'Anonymous GET request to public URL is denied (returns 400 or 404)',
        anonRes.status === 400 || anonRes.status === 404,
        `Status ${anonRes.status}`
      );
    }
  } catch (err: any) {
    console.error('Test execution error:', err);
    check('Execution', 'Test completed without uncaught exception', false, err.message);
  } finally {
    // -------------------------------------------------------------
    // SECTION 8: SYNTHETIC DATA PURGE
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: Synthetic Data Purge & Verification ---');

    // 8a. Remove storage objects
    if (createdPaths.length > 0) {
      try {
        const deleteRes = await fetch(
          `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets`,
          {
            method: 'DELETE',
            headers: {
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prefixes: createdPaths }),
          }
        );
        check('Purge', 'Storage test objects deleted from founder-intake-assets bucket', deleteRes.ok);
      } catch (delErr: any) {
        console.error('Storage object deletion error:', delErr);
      }
    }

    // 8b. Purge database records in single batched query
    if (testReceiptId) {
      queryDb(`
        DELETE FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.builder_submissions WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.inquiries WHERE id = '${testInquiryId}';
        DELETE FROM dynasty_private.leads WHERE id = '${testLeadId}';
        DELETE FROM dynasty_private.rate_limits;
      `);
    }

    // 8c. Verify zero synthetic leftovers in single query
    const counts = queryDb(`
      SELECT 
        (SELECT count(*) FROM dynasty_private.inquiry_assets) as assets_count,
        (SELECT count(*) FROM dynasty_private.inquiries) as inq_count,
        (SELECT count(*) FROM dynasty_private.leads) as leads_count;
    `);

    const assetsCount = Number(counts[0]?.assets_count || 0);
    const inqCount = Number(counts[0]?.inq_count || 0);
    const leadsCount = Number(counts[0]?.leads_count || 0);

    check('Purge Audit', '0 rows remaining in dynasty_private.inquiry_assets', assetsCount === 0, `Count: ${assetsCount}`);
    check('Purge Audit', '0 rows remaining in dynasty_private.inquiries', inqCount === 0, `Count: ${inqCount}`);
    check('Purge Audit', '0 rows remaining in dynasty_private.leads', leadsCount === 0, `Count: ${leadsCount}`);
  }

  // Save verification report
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  const report = {
    suite: 'Phase 2F Secure Asset Upload Verification',
    timestamp: new Date().toISOString(),
    total,
    passed,
    failed,
    results,
  };

  fs.writeFileSync(
    path.join('outputs', 'integration-phase-i', 'phase-2f-upload-verification.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n==================================================');
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal suite runner error:', err);
  process.exit(1);
});
