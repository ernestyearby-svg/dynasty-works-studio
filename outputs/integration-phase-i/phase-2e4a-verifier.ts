/**
 * Dynasty Works Studio — Phase 2E.4A Live Resend Preview Verification Suite
 *
 * Mission:
 * Prove REAL Resend email delivery through the existing Phase 2E.4 notification architecture.
 *
 * Flow:
 * 1. Checks if a submission was made via Deploy Preview (or runs one locally if RESEND_API_KEY is in .env.dws.local).
 * 2. Validates live Resend transport results in Supabase (notification_status = SENT, internal & founder msg IDs).
 * 3. Safely cleans up the synthetic test submission from Supabase.
 * 4. Outputs comprehensive Phase 2E.4A audit report JSON.
 */

import fs from 'node:fs';
import { execSync } from 'node:child_process';
import handler from '../../netlify/functions/submissions';

// 1. Helper to query remote DB via Supabase CLI
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
    console.error('queryDb error for sql:', clean, 'output:', err.stdout || err.message);
    throw err;
  }
}

// 2. Load Local Config
const config: Record<string, string> = {};
if (fs.existsSync('.env.dws.local')) {
  const envContent = fs.readFileSync('.env.dws.local', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) config[match[1].trim()] = match[2].trim();
  }
}

async function main() {
  console.log('================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2E.4A LIVE RESEND VERIFICATION');
  console.log('================================================================\n');

  // Check if we can run submission locally via RESEND_API_KEY
  const localResendKey = config['RESEND_API_KEY'] || process.env.RESEND_API_KEY;
  let receiptId: string | null = null;
  let submissionEmail: string | null = null;

  if (localResendKey && localResendKey.trim().length > 0) {
    console.log('Found RESEND_API_KEY in local environment. Executing synthetic submission with real Resend transport...');
    process.env.RESEND_API_KEY = localResendKey.trim();
    process.env.EMAIL_FROM = config['EMAIL_FROM'] || process.env.EMAIL_FROM || 'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
    process.env.INTERNAL_NOTIFICATION_EMAIL = config['INTERNAL_NOTIFICATION_EMAIL'] || process.env.INTERNAL_NOTIFICATION_EMAIL || 'ernestyearby@gmail.com';
    process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';
    delete process.env.DWS_TEST_MODE;
    delete process.env.USE_MOCK_NOTIFICATIONS;

    submissionEmail = 'ernestyearby@gmail.com';
    const idempotencyKey = crypto.randomUUID();

    const req = new Request('http://localhost/.netlify/functions/submissions?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.30',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Resend Live Verification',
          email: submissionEmail,
          phone: '+1 415 555 0199',
          company: 'Resend Test Venture',
          businessType: 'B2B Software Platform',
          businessStage: 'Preparing to launch',
          selectedNeeds: ['Executive Strategy', 'Brand Identity', 'Product System'],
          launchTimeline: 'Q3 2026',
          budgetRange: '$100k - $250k',
          ambitionNotes: 'Live Phase 2E.4A Resend delivery verification on verified domain.',
        },
      }),
    });

    const res = await handler(req);
    const body: any = await res.json();
    console.log(`Handler response status: ${res.status}`);
    console.log(`Handler response body:`, body);

    if (res.status === 202 || res.status === 200) {
      receiptId = body.receiptId;
    } else {
      console.error('Submission failed:', body);
      process.exit(1);
    }
  } else {
    console.log('Scanning Supabase for latest Company Builder submission from Deploy Preview...');
    const latestRows = queryDb(`
      select i.receipt_id, l.email, l.company_name
      from dynasty_private.inquiries i
      join dynasty_private.leads l on i.lead_id = l.id
      join dynasty_private.builder_submissions b on b.inquiry_id = i.id
      order by i.created_at desc
      limit 1;
    `);

    if (latestRows.length === 0) {
      console.log('No submissions found in Supabase database.');
      console.log('Please execute the submission either via the Deploy Preview browser URL or by providing RESEND_API_KEY in .env.dws.local.');
      process.exit(2);
    }

    receiptId = latestRows[0].receipt_id;
    submissionEmail = latestRows[0].email;
    console.log(`Located submission receipt: ${receiptId} (${submissionEmail})`);
  }

  if (!receiptId) {
    console.error('No receiptId available for verification.');
    process.exit(1);
  }

  // Verify database record
  console.log(`\nVerifying database notification state for receipt: ${receiptId}...`);
  const record = queryDb(`
    select
      i.receipt_id,
      i.notification_status,
      i.retry_count,
      i.notification_sent_at,
      i.next_retry_at,
      i.notification_error,
      i.notification_metadata,
      l.email,
      l.company_name,
      b.business_type
    from dynasty_private.inquiries i
    join dynasty_private.leads l on i.lead_id = l.id
    join dynasty_private.builder_submissions b on b.inquiry_id = i.id
    where i.receipt_id = '${receiptId}';
  `);

  if (record.length === 0) {
    console.error(`Record for receipt ${receiptId} not found in database.`);
    process.exit(1);
  }

  const row = record[0];
  console.log('Database row retrieved:');
  console.log('  Receipt ID:           ', row.receipt_id);
  console.log('  Notification Status:  ', row.notification_status);
  console.log('  Notification Sent At: ', row.notification_sent_at);
  console.log('  Next Retry At:        ', row.next_retry_at);
  console.log('  Retry Count:          ', row.retry_count);
  console.log('  Notification Error:   ', row.notification_error);
  console.log('  Notification Metadata:', JSON.stringify(row.notification_metadata, null, 2));

  const meta = typeof row.notification_metadata === 'string'
    ? JSON.parse(row.notification_metadata)
    : row.notification_metadata || {};

  const internalProvider = meta.internal_provider;
  const internalMsgId = meta.internal_msg_id;
  const founderProvider = meta.founder_provider;
  const founderMsgId = meta.founder_msg_id;

  const checks = [
    { name: 'Receipt Generated', passed: Boolean(row.receipt_id) },
    { name: 'Provider is Resend (Internal)', passed: internalProvider === 'resend', detail: `provider=${internalProvider}` },
    { name: 'Internal Message ID returned', passed: Boolean(internalMsgId), detail: `internal_msg_id=${internalMsgId}` },
    { name: 'Provider is Resend (Founder)', passed: founderProvider === 'resend', detail: `provider=${founderProvider}` },
    { name: 'Founder Message ID returned', passed: Boolean(founderMsgId), detail: `founder_msg_id=${founderMsgId}` },
    { name: 'Notification Status is SENT', passed: row.notification_status === 'SENT', detail: `status=${row.notification_status}` },
    { name: 'Notification Sent At is populated', passed: Boolean(row.notification_sent_at) },
    { name: 'Next Retry At is null', passed: row.next_retry_at === null },
  ];

  console.log('\n--- VERIFICATION AUDIT RESULTS ---');
  for (const c of checks) {
    console.log(`[${c.passed ? '✓ PASS' : '✗ FAIL'}] ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
  }

  const allPassed = checks.every(c => c.passed);
  console.log(`\nOverall Test Result: ${allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);

  // Purge synthetic record
  console.log('\nPurging synthetic test records from Supabase...');
  queryDb(`
    delete from dynasty_private.leads
    where id in (select lead_id from dynasty_private.inquiries where receipt_id = '${receiptId}');
  `);
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
  console.log('Database row counts after cleanup:');
  for (const c of counts) {
    console.log(`  ${c.tbl}: ${c.count}`);
  }

  const cleanupPassed = nonZero.length === 0;
  console.log(`Cleanup verification: ${cleanupPassed ? 'PASS (0 synthetic rows remain)' : 'FAIL'}`);

  const reportData = {
    timestamp: new Date().toISOString(),
    receiptId,
    submissionEmail,
    internalMsgId,
    founderMsgId,
    internalProvider,
    founderProvider,
    notificationStatus: row.notification_status,
    notificationSentAt: row.notification_sent_at,
    checks,
    allPassed,
    cleanupPassed,
  };

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2e4a-verification.json',
    JSON.stringify(reportData, null, 2),
    'utf8'
  );
  console.log('\nWrote outputs/integration-phase-i/phase-2e4a-verification.json');
}

main().catch(err => {
  console.error('Fatal error in verifier:', err);
  process.exit(1);
});
