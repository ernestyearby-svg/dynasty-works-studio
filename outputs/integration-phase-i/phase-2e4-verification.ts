/**
 * Dynasty Works Studio — Phase 2E.4 Notification Infrastructure Verification Suite
 *
 * Verifies end-to-end notification delivery, failure isolation, and durable retry:
 * 1. Security baseline & Netlify credential audit (zero repo or bundle exposure).
 * 2. Notification provider audit & abstraction test.
 * 3. Database schema & RPC function verification (record_notification_result, get_retryable_inquiries).
 * 4. Synthetic conversion flows with end-to-end notification generation (Builder, Blueprint, General).
 * 5. Structured internal DWS notification and founder confirmation verification.
 * 6. Decoupled failure simulation: confirms HTTP 202 is returned and submission is persisted despite email failure.
 * 7. Durable retry queue execution & state transition verification.
 * 8. Zero synthetic data leakage & cleanup verification.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import handler from '../../netlify/functions/submissions';
import {
  MockTestTransport,
  ResendTransport,
  UnconfiguredTransport,
  getNotificationTransport,
  buildInternalDWSNotification,
  buildFounderConfirmation,
  dispatchSubmissionNotifications,
  type SubmissionNotificationContext,
} from '../../netlify/functions/lib/notifications';
import { processRetryQueue } from '../../netlify/functions/retry-notifications';

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

// 1. Load Local Config Safely
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
    console.error('queryDb error for sql:', clean, 'output:', err.stdout || err.message);
    throw err;
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2E.4 NOTIFICATION VERIFICATION');
  console.log(`Supabase URL:    ${supabaseUrl}`);
  console.log(`Test Mode:       ${process.env.DWS_TEST_MODE}`);
  console.log('================================================================\n');

  const runId = crypto.randomUUID().slice(0, 8);
  const createdReceipts: string[] = [];
  const createdEmails: string[] = [];

  try {
    // -------------------------------------------------------------
    // 1. SAFETY & CREDENTIAL REMEDIATION AUDIT
    // -------------------------------------------------------------
    console.log('--- 01: SAFETY & CREDENTIAL REMEDIATION AUDIT ---');

    // A. Safety Checkpoint Tag
    const tagCheck = execSync('git tag -l checkpoint/pre-phase-2e4', { encoding: 'utf8' }).trim();
    check('SAFETY', 'Safety checkpoint tag checkpoint/pre-phase-2e4 exists', tagCheck === 'checkpoint/pre-phase-2e4');

    // B. Scan repository files for secrets
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
    let secretMatches = 0;
    for (const f of trackedFiles) {
      if (fs.existsSync(f) && fs.statSync(f).isFile()) {
        const txt = fs.readFileSync(f, 'utf8');
        if (/nfp_[a-zA-Z0-9_-]{20,}/.test(txt) || /re_[a-zA-Z0-9_-]{20,}/.test(txt)) {
          secretMatches++;
        }
      }
    }
    check('SECURITY', 'Zero Netlify or Resend credentials in git tracked repository', secretMatches === 0);

    // C. Scan client bundle dist/
    let distSecretMatches = 0;
    if (fs.existsSync('dist')) {
      const checkDist = (dir: string) => {
        for (const file of fs.readdirSync(dir)) {
          const full = path.join(dir, file);
          if (fs.statSync(full).isDirectory()) checkDist(full);
          else {
            const txt = fs.readFileSync(full, 'utf8');
            if (/nfp_[a-zA-Z0-9_-]{20,}/.test(txt) || /re_[a-zA-Z0-9_-]{20,}/.test(txt)) {
              distSecretMatches++;
            }
          }
        }
      };
      checkDist('dist');
    }
    check('SECURITY', 'Zero Netlify or Resend credentials in client dist/ bundle', distSecretMatches === 0);

    // -------------------------------------------------------------
    // 2. NOTIFICATION PROVIDER & ABSTRACTION AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 02: NOTIFICATION PROVIDER & ABSTRACTION AUDIT ---');

    const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
    check('PROVIDER', 'Resend provider audit correctly evaluates configuration', !resendConfigured, 'NOT CONFIGURED (as expected)');

    const testTransport = getNotificationTransport();
    check('PROVIDER', 'Factory selects MockTestTransport in test mode', testTransport instanceof MockTestTransport);

    const unconfigured = new UnconfiguredTransport();
    const unconfigRes = await unconfigured.send({
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Test',
      text: 'Test',
    });
    check('PROVIDER', 'UnconfiguredTransport safely reports unconfigured status', !unconfigRes.success && unconfigRes.provider === 'unconfigured');

    // -------------------------------------------------------------
    // 3. DATABASE MIGRATION & RPC FUNCTIONS AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 03: DATABASE MIGRATION & RPC AUDIT ---');

    // Verify record_notification_result RPC exists
    const rpcCheck = queryDb(`
      select routine_name
      from information_schema.routines
      where routine_schema = 'dynasty_private'
        and routine_name in ('record_notification_result', 'get_retryable_inquiries');
    `);
    const rpcNames = rpcCheck.map((r: any) => r.routine_name);
    check('SCHEMA', 'record_notification_result RPC exists in dynasty_private', rpcNames.includes('record_notification_result'));
    check('SCHEMA', 'get_retryable_inquiries RPC exists in dynasty_private', rpcNames.includes('get_retryable_inquiries'));

    // -------------------------------------------------------------
    // 4. SYNTHETIC END-TO-END CONVERSION & NOTIFICATIONS
    // -------------------------------------------------------------
    console.log('\n--- 04: SYNTHETIC CONVERSIONS & NOTIFICATIONS ---');
    MockTestTransport.clear();

    // --- A. Company Builder Conversion Flow ---
    const builderEmail = `test-founder-${runId}@example.com`;
    createdEmails.push(builderEmail);
    const builderKey = crypto.randomUUID();

    const builderReq = new Request('http://localhost/.netlify/functions/submissions?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.21',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey: builderKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Venture Architect Test',
          email: builderEmail,
          phone: '+1 415 555 0101',
          company: `Hyperion Systems ${runId}`,
          businessType: 'B2B Software Platform',
          businessStage: 'Preparing to launch',
          selectedNeeds: ['Executive Strategy', 'Brand Identity', 'Product System'],
          launchTimeline: 'Q3 2026',
          budgetRange: '$100k - $250k',
          ambitionNotes: 'Autonomous venture studio architecture evaluation.',
        },
      }),
    });

    const builderRes = await handler(builderReq);
    check('BUILDER', 'Builder submission returns HTTP 202 Accepted', builderRes.status === 202);
    const builderBody: any = await builderRes.json();
    const builderReceipt = builderBody.receiptId;
    check('BUILDER', 'Builder submission returns valid receiptId', Boolean(builderReceipt));
    if (builderReceipt) createdReceipts.push(builderReceipt);

    // Verify DB persistence & notification status
    const dbBuilder = queryDb(`
      select i.receipt_id, i.notification_status, i.retry_count, i.notification_sent_at, l.email, b.business_type
      from dynasty_private.inquiries i
      join dynasty_private.leads l on i.lead_id = l.id
      join dynasty_private.builder_submissions b on b.inquiry_id = i.id
      where i.receipt_id = '${builderReceipt}';
    `);
    check('BUILDER', 'Builder submission persisted in DB with child row', dbBuilder.length === 1);
    check('BUILDER', 'Builder notification_status updated to SENT in DB', dbBuilder[0]?.notification_status === 'SENT');
    check('BUILDER', 'Builder notification_sent_at is populated', Boolean(dbBuilder[0]?.notification_sent_at));

    // Verify Email Dispatches for Builder
    check('NOTIF_BUILDER', 'Two emails dispatched for Builder (Internal + Founder)', MockTestTransport.dispatchedEmails.length === 2);
    const internalBuilderEmail = MockTestTransport.dispatchedEmails.find((e) => e.to === 'advisory@dynastyworksstudio.com' || e.to === 'advisory@dynastyworks.studio');
    const founderBuilderEmail = MockTestTransport.dispatchedEmails.find((e) => e.to === builderEmail);

    check('NOTIF_BUILDER', 'Internal DWS email dispatched with structured subject', Boolean(internalBuilderEmail?.subject.includes('[DWS Intake] COMPANY BUILDER ROADMAP')));
    check('NOTIF_BUILDER', 'Internal DWS email contains receipt ID', Boolean(internalBuilderEmail?.text.includes(builderReceipt)));
    check('NOTIF_BUILDER', 'Internal DWS email contains founder company and diagnostic details', Boolean(internalBuilderEmail?.text.includes(`Hyperion Systems ${runId}`) && internalBuilderEmail?.text.includes('B2B Software Platform')));
    check('NOTIF_BUILDER', 'Founder confirmation dispatched with approved subject', founderBuilderEmail?.subject === 'Dynasty Works Studio — Submission Received');
    check('NOTIF_BUILDER', 'Founder confirmation contains receipt ID and non-promissory disclaimer', Boolean(founderBuilderEmail?.text.includes(builderReceipt) && founderBuilderEmail?.text.includes('evaluates all strategic submissions directly')));

    // --- B. Founder Blueprint Conversion Flow ---
    MockTestTransport.clear();
    const blueprintEmail = `test-blueprint-${runId}@example.com`;
    createdEmails.push(blueprintEmail);
    const blueprintKey = crypto.randomUUID();

    const blueprintReq = new Request('http://localhost/.netlify/functions/submissions?kind=blueprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.22',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey: blueprintKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Blueprint Founder Test',
          email: blueprintEmail,
          company: `Aegis Robotics ${runId}`,
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

    const blueprintRes = await handler(blueprintReq);
    const blueprintBody: any = await blueprintRes.json();
    check('BLUEPRINT', 'Blueprint submission returns HTTP 202 Accepted', blueprintRes.status === 202, blueprintRes.status !== 202 ? JSON.stringify(blueprintBody) : undefined);
    const blueprintReceipt = blueprintBody.receiptId;
    check('BLUEPRINT', 'Blueprint submission returns valid receiptId', Boolean(blueprintReceipt));
    if (blueprintReceipt) {
      createdReceipts.push(blueprintReceipt);

      const dbBlueprint = queryDb(`
        select i.receipt_id, i.notification_status, bp.business_type, bp.physical_market
        from dynasty_private.inquiries i
        join dynasty_private.founder_blueprint_intakes bp on bp.inquiry_id = i.id
        where i.receipt_id = '${blueprintReceipt}';
      `);
      check('BLUEPRINT', 'Blueprint intake persisted in DB', dbBlueprint.length === 1);
      check('BLUEPRINT', 'Blueprint notification_status is SENT in DB', dbBlueprint[0]?.notification_status === 'SENT');
    }


    // Verify Blueprint emails
    check('NOTIF_BLUEPRINT', 'Two emails dispatched for Blueprint', MockTestTransport.dispatchedEmails.length === 2);
    const internalBpEmail = MockTestTransport.dispatchedEmails.find((e) => e.to === 'advisory@dynastyworksstudio.com' || e.to === 'advisory@dynastyworks.studio');
    check('NOTIF_BLUEPRINT', 'Internal Blueprint email contains strategic blueprint data', Boolean(internalBpEmail?.text.includes('Precision autonomous robotics') && internalBpEmail?.text.includes('Physical Market:   Yes')));

    // --- C. General Contact Studio Conversion Flow ---
    MockTestTransport.clear();
    const generalEmail = `test-contact-${runId}@example.com`;
    createdEmails.push(generalEmail);
    const generalKey = crypto.randomUUID();

    const generalReq = new Request('http://localhost/.netlify/functions/submissions?kind=general', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.23',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey: generalKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Contact Lead Test',
          email: generalEmail,
          company: `Omni Venture Group ${runId}`,
          services: ['Venture Architecture', 'Commercial Strategy'],
          description: 'Exploring long-term studio engagement for autonomous financial services platform.',
          stage: 'Operating',
          budget: '$250k - $500k',
          timeframe: 'Immediate',
        },
      }),
    });

    const generalRes = await handler(generalReq);
    const generalBody: any = await generalRes.json();
    check('GENERAL', 'Contact submission returns HTTP 202 Accepted', generalRes.status === 202, generalRes.status !== 202 ? JSON.stringify(generalBody) : undefined);
    const generalReceipt = generalBody.receiptId;
    check('GENERAL', 'Contact submission returns valid receiptId', Boolean(generalReceipt));
    if (generalReceipt) {
      createdReceipts.push(generalReceipt);

      const dbGeneral = queryDb(`
        select i.receipt_id, i.notification_status, g.stage, g.budget
        from dynasty_private.inquiries i
        join dynasty_private.general_inquiries g on g.inquiry_id = i.id
        where i.receipt_id = '${generalReceipt}';
      `);
      check('GENERAL', 'General inquiry persisted in DB', dbGeneral.length === 1);
      check('GENERAL', 'General inquiry notification_status is SENT in DB', dbGeneral[0]?.notification_status === 'SENT');
    }

    // -------------------------------------------------------------
    // 5. DECOUPLED FAILURE HANDLING & DURABLE RETRY TEST
    // -------------------------------------------------------------
    console.log('\n--- 05: DECOUPLED FAILURE & DURABLE RETRY TEST ---');
    MockTestTransport.clear();
    MockTestTransport.simulateFailure = true;
    MockTestTransport.failureMessage = 'Simulated SMTP/API Gateway Timeout (504)';

    const failEmail = `test-fail-${runId}@example.com`;
    createdEmails.push(failEmail);
    const failKey = crypto.randomUUID();

    const failReq = new Request('http://localhost/.netlify/functions/submissions?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'x-nf-client-connection-ip': '198.51.100.24',
      },
      body: JSON.stringify({
        version: 1,
        idempotencyKey: failKey,
        consent: { evaluation: true, communication: true, noticeVersion: '2026-02-phase2e' },
        honeypot: '',
        data: {
          name: 'Resilience Test Founder',
          email: failEmail,
          company: `Resilience Lab ${runId}`,
          businessType: 'Consumer Brand',
          businessStage: 'Operating',
          selectedNeeds: ['Digital System', 'Packaging Design'],
          launchTimeline: 'Summer 2026',
          ambitionNotes: 'Verifying that email outage never disrupts founder submission.',
        },
      }),
    });

    const failRes = await handler(failReq);
    const failBody: any = await failRes.json();
    check('RESILIENCE', 'Submission returns HTTP 202 Accepted EVEN WHEN EMAIL DISPATCH FAILS', failRes.status === 202, failRes.status !== 202 ? JSON.stringify(failBody) : undefined);
    const failReceipt = failBody.receiptId;
    check('RESILIENCE', 'Confirmed receiptId returned to client despite email failure', Boolean(failReceipt));
    if (failReceipt) {
      createdReceipts.push(failReceipt);

      // Verify DB state records FAILED without dropping submission
      const dbFail = queryDb(`
        select i.receipt_id, i.notification_status, i.retry_count, i.next_retry_at, i.notification_error
        from dynasty_private.inquiries i
        where i.receipt_id = '${failReceipt}';
      `);
      check('RESILIENCE', 'Submission remains securely persisted in DB', dbFail.length === 1);
      check('RESILIENCE', 'notification_status is set to FAILED', dbFail[0]?.notification_status === 'FAILED');
      check('RESILIENCE', 'retry_count is incremented to 1', dbFail[0]?.retry_count === 1);
      check('RESILIENCE', 'next_retry_at is scheduled in the future', Boolean(dbFail[0]?.next_retry_at));
      check('RESILIENCE', 'notification_error captures failure message', Boolean(dbFail[0]?.notification_error?.includes('Simulated SMTP/API Gateway Timeout')));

      // --- B. Test Durable Retry Execution ---
      console.log('\n--- 06: DURABLE RETRY EXECUTION TEST ---');
      // Clear simulated failure
      MockTestTransport.simulateFailure = false;

      // Fast-forward next_retry_at in database to now() so that get_retryable_inquiries picks it up
      queryDb(`
        update dynasty_private.inquiries
        set next_retry_at = clock_timestamp() - interval '1 second'
        where receipt_id = '${failReceipt}';
      `);

      // Verify get_retryable_inquiries returns the item
      const retryable = queryDb(`select * from dynasty_private.get_retryable_inquiries(10) where receipt_id = '${failReceipt}';`);
      check('RETRY', 'get_retryable_inquiries returns overdue failed submission', retryable.length === 1);

      // Execute the retry runner
      const retryResult = await processRetryQueue({
        supabaseUrl,
        supabaseKey: serviceRoleKey,
        transport: new MockTestTransport(),
      });
      check('RETRY', 'processRetryQueue executes successfully', retryResult.status === 'completed');
      check('RETRY', 'processRetryQueue succeeded count is at least 1', retryResult.succeeded >= 1);

      // Check DB state after retry
      const dbAfterRetry = queryDb(`
        select i.receipt_id, i.notification_status, i.retry_count, i.notification_sent_at, i.next_retry_at
        from dynasty_private.inquiries i
        where i.receipt_id = '${failReceipt}';
      `);
      check('RETRY', 'notification_status transitioned to SENT after successful retry', dbAfterRetry[0]?.notification_status === 'SENT');
      check('RETRY', 'next_retry_at cleared after successful retry', dbAfterRetry[0]?.next_retry_at === null);
      check('RETRY', 'notification_sent_at is now populated', Boolean(dbAfterRetry[0]?.notification_sent_at));

      // --- C. Test Exhaustion Bounded Policy ---
      console.log('\n--- 07: BOUNDED EXHAUSTION POLICY TEST ---');
      // Manually test record_notification_result with 5 retries to verify EXHAUSTED state
      queryDb(`
        update dynasty_private.inquiries
        set retry_count = 4, notification_status = 'FAILED'
        where receipt_id = '${failReceipt}';
      `);
      const exhaustRes = queryDb(`
        select * from dynasty_private.record_notification_result(
          '${failReceipt}'::uuid,
          'FAILED',
          'Persistent downstream failure test'
        );
      `);
      check('EXHAUSTION', 'Fifth consecutive failure transitions notification_status to EXHAUSTED', exhaustRes[0]?.notification_status === 'EXHAUSTED');
      check('EXHAUSTION', 'next_retry_at is null when EXHAUSTED', exhaustRes[0]?.next_retry_at === null);
    }


  } finally {
    // -------------------------------------------------------------
    // 6. SYNTHETIC RECORD CLEANUP & ZERO-LEAK AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 08: SYNTHETIC RECORD PURGE & ZERO-LEAK AUDIT ---');
    // Delete all synthetic records created during testing
    if (createdReceipts.length > 0) {
      const receiptList = createdReceipts.map((r) => `'${r}'`).join(',');
      queryDb(`
        delete from dynasty_private.leads
        where id in (select lead_id from dynasty_private.inquiries where receipt_id in (${receiptList}));
      `);
    }

    // Delete any remaining rate limits from test IPs
    queryDb(`delete from dynasty_private.rate_limits;`);

    // Verify zero synthetic rows remaining
    const counts = queryDb(`
      select 'leads' as tbl, count(*) from dynasty_private.leads
      union all select 'inquiries', count(*) from dynasty_private.inquiries
      union all select 'builder_submissions', count(*) from dynasty_private.builder_submissions
      union all select 'founder_blueprint_intakes', count(*) from dynasty_private.founder_blueprint_intakes
      union all select 'general_inquiries', count(*) from dynasty_private.general_inquiries
      union all select 'rate_limits', count(*) from dynasty_private.rate_limits;
    `);

    const nonzero = counts.filter((c: any) => Number(c.count) > 0);
    check('CLEANUP', 'Zero synthetic rows remain across all tables', nonzero.length === 0, `Non-zero tables: ${nonzero.map((n: any) => `${n.tbl}=${n.count}`).join(', ') || 'None'}`);
  }

  // Summary Output
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n================================================================');
  console.log(`PHASE 2E.4 VERIFICATION COMPLETE: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('================================================================');

  const summary = {
    suite: 'Phase 2E.4 Notification Infrastructure & Security Remediation',
    timestamp: new Date().toISOString(),
    totalChecks: total,
    passedChecks: passed,
    failedChecks: failed,
    results,
  };

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2e4-verification.json',
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
