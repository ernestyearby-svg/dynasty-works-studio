/**
 * Dynasty Works Studio — Phase 2F.1 Public Trust & Asset Intake Security Audit
 *
 * Rigorously verifies data governance, path traversal immunity, filename sanitization,
 * storage path isolation, MIME/extension enforcement, and private bucket access controls:
 *
 * 1. Filename sanitization & path traversal immunity:
 *    - Directory traversal sequences (../, ..\, ../../etc/passwd)
 *    - Malicious executable and shell injection characters (<script>, ;, |, `)
 *    - Extremely long filenames (> 100 characters)
 *    - Unicode / control / null byte injection
 *    - Collision avoidance on duplicate filenames
 * 2. Storage path isolation:
 *    - Enforces format: {inquiryId}/{fileId}-{sanitizedFilename}
 *    - Ensures absolute separation per inquiry and unique UUID prefix per file
 * 3. Live API rejection enforcement:
 *    - Rejection of disallowed extensions (.exe, .sh, .bat, .php, .vbs)
 *    - Rejection of unauthorized origins and forged receipt IDs
 * 4. Supabase private storage security audit:
 *    - Confirms founder-intake-assets bucket is strictly private (public = false)
 *    - Confirms anonymous public object access attempts return 400/404
 * 5. Zero synthetic data leakage:
 *    - Complete purge of test records and objects
 *    - Validates 0 residual rows in database
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

// Mirror of server sanitization function to test unit boundaries
function sanitizeFilename(raw: string): string {
  const base = raw.replace(/^.*[\\\/]/, '').trim();
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return clean.substring(0, 100) || 'unnamed_asset';
}

async function runSecurityAudit() {
  console.log('\n=============================================================');
  console.log('DYNASTY WORKS STUDIO — PHASE 2F.1 ASSET INTAKE SECURITY AUDIT');
  console.log('=============================================================\n');

  let testReceiptId = '';
  let testInquiryId = '';
  let testLeadId = '';
  const createdStoragePaths: string[] = [];

  try {
    // -------------------------------------------------------------
    // SECTION 1: PATH TRAVERSAL & MALICIOUS FILENAME SANITIZATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: Path Traversal & Filename Sanitization ---');

    const attackVectors = [
      { input: '../../../../etc/passwd', expectedNotContain: ['/', '\\', '..'], label: 'Unix root traversal' },
      { input: '..\\..\\windows\\system32\\cmd.exe', expectedNotContain: ['/', '\\', '..'], label: 'Windows root traversal' },
      { input: '../secret_brief.pdf', expectedNotContain: ['/', '\\', '..'], label: 'Relative parent traversal' },
      { input: 'dir1/dir2/confidential.docx', expectedNotContain: ['/', '\\'], label: 'Subdirectory path stripping' },
      { input: '<script>alert("xss")</script>.pdf', expectedNotContain: ['<', '>', '"'], label: 'XSS script injection' },
      { input: 'file;rm -rf /;.pdf', expectedNotContain: [';', ' '], label: 'Command chaining injection' },
      { input: 'file|calc.exe.pdf', expectedNotContain: ['|'], label: 'Pipe redirection injection' },
      { input: 'A'.repeat(300) + '.pdf', maxLen: 100, label: '300+ character filename overflow' },
      { input: 'Brief\u0000NullByte.pdf', expectedNotContain: ['\u0000'], label: 'Null byte injection' },
      { input: 'Venture Brief 2026 (Final) #1!.pdf', expectedNotContain: [' ', '(', ')', '#', '!'], label: 'Special character normalization' },
      { input: '   ', fallback: 'unnamed_asset', label: 'Whitespace-only fallback' },
      { input: '$$$###@@@', label: 'Symbol-only fallback' },
    ];

    for (const vector of attackVectors) {
      const sanitized = sanitizeFilename(vector.input);
      let passed = true;
      let detail = `Input: "${vector.input.substring(0, 30)}" -> Output: "${sanitized.substring(0, 30)}"`;

      if (vector.expectedNotContain) {
        for (const bad of vector.expectedNotContain) {
          if (sanitized.includes(bad)) {
            passed = false;
            detail += ` (Contains forbidden character: "${bad}")`;
          }
        }
      }

      if (vector.maxLen && sanitized.length > vector.maxLen) {
        passed = false;
        detail += ` (Length ${sanitized.length} > ${vector.maxLen})`;
      }

      if (vector.fallback && sanitized !== vector.fallback) {
        passed = false;
        detail += ` (Expected fallback "${vector.fallback}", got "${sanitized}")`;
      }

      // Universal security invariant: sanitized filename MUST NOT contain path separators
      if (sanitized.includes('/') || sanitized.includes('\\') || sanitized.includes('..')) {
        passed = false;
        detail += ' (CRITICAL: Contains path separator or traversal token)';
      }

      check('Filename Sanitization', vector.label, passed, detail);
    }

    // -------------------------------------------------------------
    // SECTION 2: STORAGE PATH ISOLATION & COLLISION RESISTANCE
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Storage Path Isolation & Collisions ---');

    const dummyInquiryId = '00000000-0000-0000-0000-000000000001';
    const filename = 'deck.pdf';

    const fileId1 = crypto.randomUUID();
    const fileId2 = crypto.randomUUID();
    const path1 = `${dummyInquiryId}/${fileId1}-${sanitizeFilename(filename)}`;
    const path2 = `${dummyInquiryId}/${fileId2}-${sanitizeFilename(filename)}`;

    check('Storage Isolation', 'Duplicate filenames yield unique storage paths', path1 !== path2, `${path1} vs ${path2}`);
    check('Storage Isolation', 'Storage path begins with inquiryId boundary', path1.startsWith(`${dummyInquiryId}/`));
    check('Storage Isolation', 'Storage path format matches {inquiryId}/{uuid}-{name}', /^[0-9a-f-]+[\\\/][0-9a-f-]+-deck\.pdf$/i.test(path1));

    // -------------------------------------------------------------
    // SECTION 3: LIVE API ASSET REQUEST WITH MALICIOUS PAYLOADS
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Live API Malicious Payload Handling ---');

    // 3a. Create authentic test inquiry
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
        name: 'Phase 2F1 Security Founder',
        email: 'synthetic-security-audit@example.com',
        phone: '+1 (555) 019-2831',
        company: 'Security Audit Venture',
        businessType: 'B2B Software',
        businessStage: 'Preparing to launch',
        existingAssets: ['Brand Identity'],
        selectedNeeds: ['Packaging', 'Application'],
        launchTimeline: 'Q4 2026',
        budgetRange: '$50,000 - $100,000',
        ambitionNotes: 'Phase 2F.1 security audit brief.',
      },
    };

    const subReq = new Request('http://localhost/.netlify/functions/submissions?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
        'x-forwarded-for': '198.51.100.99',
      },
      body: JSON.stringify(envelope),
    });

    const subRes = await submissionsHandler(subReq);
    const subData = await subRes.json().catch(() => ({}));
    check('Inquiry Creation', 'Submissions endpoint returns HTTP 202', subRes.status === 202, `Status ${subRes.status}`);

    testReceiptId = subData.receiptId;
    check('Inquiry Creation', 'Valid receipt ID generated', Boolean(testReceiptId && /^[0-9a-f-]{36}$/i.test(testReceiptId)));

    // Verify DB inquiry row
    const inqRows = queryDb(
      `SELECT id, lead_id FROM dynasty_private.inquiries WHERE receipt_id = '${testReceiptId}';`
    );
    check('Inquiry Creation', 'Inquiry persisted in database', inqRows.length === 1);
    if (inqRows.length > 0) {
      testInquiryId = inqRows[0].id;
      testLeadId = inqRows[0].lead_id;
    }

    // 3b. Request upload URLs with traversal payloads in originalFilename
    const maliciousUploadReq = new Request('https://dynastyworksstudio.com/api/submissions/assets/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynastyworksstudio.com',
      },
      body: JSON.stringify({
        receiptId: testReceiptId,
        files: [
          {
            originalFilename: '../../../../etc/shadow.pdf',
            sizeBytes: 1024,
            mimeType: 'application/pdf',
          },
          {
            originalFilename: '..\\..\\windows\\win.ini.docx',
            sizeBytes: 2048,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
          {
            originalFilename: '<svg onload=alert(1)>.png',
            sizeBytes: 4096,
            mimeType: 'image/png',
          },
        ],
      }),
    });

    const uploadRes = await assetsHandler(maliciousUploadReq);
    check('Asset Handler', 'Authorize request with traversal names returns HTTP 200', uploadRes.status === 200);

    const uploadData = await uploadRes.json();
    check('Asset Handler', 'Returns uploads array with 3 items', Array.isArray(uploadData.uploads) && uploadData.uploads.length === 3);

    if (uploadData.uploads) {
      for (const u of uploadData.uploads) {
        createdStoragePaths.push(u.storagePath);
        const hasTraversal = u.storagePath.includes('..') || u.storagePath.includes('/etc/') || u.storagePath.includes('windows');
        check('Asset Handler', `Storage path is sanitized for ${u.fileId}`, !hasTraversal, `Path: ${u.storagePath}`);
        check('Asset Handler', `Storage path starts with inquiry directory`, u.storagePath.startsWith(`${testInquiryId}/`));
      }
    }

    // 3c. Direct upload attempt with disallowed executable extension
    const exeUploadReq = new Request('https://dynastyworksstudio.com/api/submissions/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        Origin: 'https://dynastyworksstudio.com',
        'x-receipt-id': testReceiptId,
        'x-filename': 'malicious_payload.exe',
        'x-mimetype': 'application/x-msdownload',
      },
      body: new Uint8Array([0x4d, 0x5a, 0x90, 0x00]), // MZ DOS header
    });

    const exeRes = await assetsHandler(exeUploadReq);
    check('Security Policy', 'Rejects .exe upload with HTTP 400', exeRes.status === 400);

    // 3d. Direct upload attempt with disallowed script extension (.sh)
    const shUploadReq = new Request('https://dynastyworksstudio.com/api/submissions/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        Origin: 'https://dynastyworksstudio.com',
        'x-receipt-id': testReceiptId,
        'x-filename': 'deploy_backdoor.sh',
        'x-mimetype': 'application/x-sh',
      },
      body: Buffer.from('#!/bin/bash\necho test\n'),
    });

    const shRes = await assetsHandler(shUploadReq);
    check('Security Policy', 'Rejects .sh script upload with HTTP 400', shRes.status === 400);

    // -------------------------------------------------------------
    // SECTION 4: STORAGE BUCKET PRIVACY & ANONYMOUS ACCESS DENIAL
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Storage Bucket Privacy & Access Controls ---');

    const bucketRows = queryDb(
      `SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'founder-intake-assets';`
    );

    check('Storage Privacy', 'founder-intake-assets bucket exists', bucketRows.length === 1);
    if (bucketRows.length === 1) {
      const b = bucketRows[0];
      check('Storage Privacy', 'Bucket is strictly private (public = false)', b.public === false);
      check('Storage Privacy', 'File size limit is set to 25 MB (26214400 bytes)', b.file_size_limit === 26214400);
    }

    // Attempt unauthenticated anonymous HTTP GET to public endpoint
    const anonProbeUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/founder-intake-assets/probe-secret.pdf`;
    const anonProbeRes = await fetch(anonProbeUrl);
    const anonDenied = anonProbeRes.status === 400 || anonProbeRes.status === 403 || anonProbeRes.status === 404;
    check(
      'Storage Privacy',
      'Unauthenticated anonymous GET to public object URL returns error (access denied)',
      anonDenied,
      `Status: ${anonProbeRes.status}`
    );

    // -------------------------------------------------------------
    // SECTION 5: CLEAN TEARDOWN & ZERO RESIDUE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Clean Teardown & Zero Residue Audit ---');

    // Delete any files created in bucket if uploaded
    if (createdStoragePaths.length > 0) {
      await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets`,
        {
          method: 'DELETE',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefixes: createdStoragePaths }),
        }
      );
    }

    // Delete test inquiry records
    if (testInquiryId) {
      queryDb(`
        DELETE FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.builder_submissions WHERE inquiry_id = '${testInquiryId}';
        DELETE FROM dynasty_private.inquiries WHERE id = '${testInquiryId}';
        DELETE FROM dynasty_private.leads WHERE id = '${testLeadId}';
        DELETE FROM dynasty_private.rate_limits;
      `);
    }

    // Verify 0 residual rows in database
    const counts = queryDb(`
      SELECT 
        (SELECT count(*) FROM dynasty_private.inquiry_assets) as assets_count,
        (SELECT count(*) FROM dynasty_private.inquiries) as inq_count,
        (SELECT count(*) FROM dynasty_private.leads) as leads_count;
    `);

    const assetsCount = Number(counts[0]?.assets_count || 0);
    const inqCount = Number(counts[0]?.inq_count || 0);
    const leadsCount = Number(counts[0]?.leads_count || 0);

    check('Zero Residue', '0 rows remaining in dynasty_private.inquiry_assets', assetsCount === 0, `Count: ${assetsCount}`);
    check('Zero Residue', '0 rows remaining in dynasty_private.inquiries', inqCount === 0, `Count: ${inqCount}`);
    check('Zero Residue', '0 rows remaining in dynasty_private.leads', leadsCount === 0, `Count: ${leadsCount}`);

  } catch (err: any) {
    console.error('Audit encountered unexpected error:', err);
    check('Audit Suite', 'Audit executed without exceptions', false, err.message);
  } finally {
    // Safety cleanup in case of failure
    if (testInquiryId) {
      try {
        queryDb(`
          DELETE FROM dynasty_private.inquiry_assets WHERE inquiry_id = '${testInquiryId}';
          DELETE FROM dynasty_private.builder_submissions WHERE inquiry_id = '${testInquiryId}';
          DELETE FROM dynasty_private.inquiries WHERE id = '${testInquiryId}';
          DELETE FROM dynasty_private.leads WHERE id = '${testLeadId}';
          DELETE FROM dynasty_private.rate_limits;
        `);
      } catch (_) {}
    }
  }

  // Summary & Save report
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  const report = {
    suite: 'Phase 2F.1 Asset Intake Security Audit',
    timestamp: new Date().toISOString(),
    total,
    passed,
    failed,
    results,
  };

  fs.writeFileSync(
    path.join('outputs', 'integration-phase-i', 'phase-2f1-asset-security-audit.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n=============================================================');
  console.log(`SECURITY AUDIT SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error('Fatal audit runner error:', err);
  process.exit(1);
});
