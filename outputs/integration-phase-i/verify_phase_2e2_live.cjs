/**
 * DWS Phase 2E.2 — Live Database & Security Verification Suite
 * Tests live Supabase project (iorzzwtmxiyqdqudrbsw)
 */

const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('.env.dws.local', 'utf8');
const config = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) config[match[1].trim()] = match[2].trim();
}

const supabaseUrl = config['SUPABASE_URL'];
const serviceRoleKey = config['DWS_SERVICE_ROLE_KEY'];
const projectRef = config['DWS_PROJECT_REF'];

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function callRpc(payload, headers = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_inquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Profile': 'dynasty_private',
      'Content-Profile': 'dynasty_private',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, text, json };
}

function runSql(query) {
  // Use npx supabase db query --linked
  const escaped = query.replace(/"/g, '\\"');
  const out = execSync(`npx supabase db query --linked "${escaped}"`, { encoding: 'utf8' });
  const jsonMatch = out.match(/\{[\s\S]*"rows"[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return null;
}

async function runLiveVerification() {
  console.log('================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2E.2 LIVE VERIFICATION SUITE');
  console.log(`Target Project: ${projectRef} (${supabaseUrl})`);
  console.log('================================================================\n');

  // --- SECTION 1: REMOTE SCHEMA & TABLE EXISTENCE ---
  console.log('--- 1. REMOTE SCHEMA & TABLE INVENTORY ---');
  const tableCheck = runSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'dynasty_private' ORDER BY table_name;");
  const tables = tableCheck.rows.map(r => r.table_name);
  const expectedTables = [
    'builder_submissions',
    'founder_blueprint_intakes',
    'general_inquiries',
    'inquiries',
    'leads',
    'rate_limits'
  ];
  assert(expectedTables.every(t => tables.includes(t)), `All 6 private tables exist in dynasty_private: ${tables.join(', ')}`);

  // --- SECTION 2: ROW LEVEL SECURITY & FORCED RLS ---
  console.log('\n--- 2. ROW LEVEL SECURITY AUDIT ---');
  const rlsCheck = runSql("SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'dynasty_private' AND c.relkind = 'r';");
  for (const row of rlsCheck.rows) {
    assert(row.relrowsecurity === true, `${row.relname} has relrowsecurity = true`);
    assert(row.relforcerowsecurity === true, `${row.relname} has FORCE ROW LEVEL SECURITY enabled`);
  }

  // --- SECTION 3: ROLE PRIVILEGES (ANON, AUTHENTICATED, PUBLIC) ---
  console.log('\n--- 3. PRIVILEGE & PERMISSION HARDENING AUDIT ---');
  const grantCheck = runSql("SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE table_schema = 'dynasty_private' AND grantee IN ('anon', 'authenticated', 'public');");
  assert(grantCheck.rows.length === 0, 'Zero table grants to anon, authenticated, or public in dynasty_private');

  const procCheck = runSql("SELECT routine_name, grantee, privilege_type FROM information_schema.routine_privileges WHERE routine_schema = 'dynasty_private' AND grantee IN ('anon', 'authenticated', 'public');");
  assert(procCheck.rows.length === 0, 'Zero function execute grants to anon, authenticated, or public in dynasty_private');

  const serviceCheck = runSql("SELECT routine_name, grantee, privilege_type FROM information_schema.routine_privileges WHERE routine_schema = 'dynasty_private' AND grantee = 'service_role';");
  assert(serviceCheck.rows.some(r => r.routine_name === 'submit_inquiry' && r.privilege_type === 'EXECUTE'), 'submit_inquiry explicitly granted to service_role');

  // --- SECTION 4: LIVE ATOMIC RPC TESTS ---
  console.log('\n--- 4. LIVE ATOMIC RPC TEST: NORMAL SUBMISSION ---');
  const testRunId = crypto.randomBytes(4).toString('hex');
  const idempotencyKey1 = crypto.randomUUID();
  const ipHash1 = crypto.createHash('sha256').update(`test_ip_1_${testRunId}`).digest('hex');
  const detail1 = {
    businessType: 'B2B Software',
    businessStage: 'Idea',
    existingAssets: ['Domain name'],
    selectedNeeds: ['Brand Identity', 'Product Architecture'],
    launchTimeline: 'Exploring',
    budgetRange: '$5,000 - $10,000',
    ambitionNotes: `Phase 2E.2 Automated Test Record ${testRunId}`,
    recomputedServices: [{ serviceId: 'brand-identity', timing: 'Month 1' }],
    recomputedPhases: ['Foundation'],
    recommendedPackage: 'founder-blueprint'
  };
  const payloadHash1 = crypto.createHash('sha256').update(JSON.stringify(detail1)).digest('hex');

  const payload1 = {
    p_idempotency_key: idempotencyKey1,
    p_payload_hash: payloadHash1,
    p_inquiry_type: 'builder',
    p_name: `Synthetic Founder ${testRunId}`,
    p_email: `synthetic.${testRunId}@dynastyworks.test`,
    p_phone: '+15555550199',
    p_company: `Synthetic Venture ${testRunId} LLC`,
    p_website: 'https://synthetic.test',
    p_ip_hash: ipHash1,
    p_detail: detail1
  };

  const res1 = await callRpc(payload1);
  assert(res1.status === 200, `Normal submission returned HTTP 200 (status: ${res1.status})`);
  assert(Array.isArray(res1.json) && res1.json[0]?.status === 'accepted', 'Response status is accepted');
  const receiptId1 = res1.json[0]?.receipt_id;
  assert(typeof receiptId1 === 'string' && /^[0-9a-f-]{36}$/i.test(receiptId1), `Opaque receipt ID returned: ${receiptId1}`);

  console.log('\n--- 5. LIVE ATOMIC RPC TEST: IDEMPOTENT REPLAY ---');
  const res2 = await callRpc(payload1);
  assert(res2.status === 200, `Idempotent replay returned HTTP 200 (status: ${res2.status})`);
  assert(Array.isArray(res2.json) && res2.json[0]?.status === 'replay', 'Response status is replay');
  assert(res2.json[0]?.receipt_id === receiptId1, 'Replay returned identical receipt ID');

  console.log('\n--- 6. LIVE ATOMIC RPC TEST: IDEMPOTENCY CONFLICT ---');
  const alteredPayload = {
    ...payload1,
    p_payload_hash: crypto.createHash('sha256').update('altered_content').digest('hex')
  };
  const res3 = await callRpc(alteredPayload);
  assert(res3.status === 500, `Altered payload with same idempotency key rejected (HTTP ${res3.status})`);
  assert(res3.text.includes('IDEMPOTENCY_CONFLICT') || res3.json?.code === 'P0002', 'Error code is IDEMPOTENCY_CONFLICT (P0002)');

  console.log('\n--- 7. LIVE ATOMIC RPC TEST: TRANSACTION ROLLBACK & PARTIAL WRITE PROTECTION ---');
  const badIdempotencyKey = crypto.randomUUID();
  const badEmail = `bad.founder.${testRunId}@dynastyworks.test`;
  // Trigger check constraint violation on builder_submissions: launch_timeline > 200 chars or invalid business_stage
  const badPayload = {
    p_idempotency_key: badIdempotencyKey,
    p_payload_hash: crypto.createHash('sha256').update('bad_detail').digest('hex'),
    p_inquiry_type: 'builder',
    p_name: `Bad Payload ${testRunId}`,
    p_email: badEmail,
    p_phone: '+15555550199',
    p_company: 'Bad LLC',
    p_website: 'https://bad.test',
    p_ip_hash: crypto.createHash('sha256').update(`test_ip_bad_${testRunId}`).digest('hex'),
    p_detail: {
      businessType: 'B2B Software',
      businessStage: 'INVALID_STAGE_THAT_FAILS_CHECK_CONSTRAINT',
      existingAssets: [],
      selectedNeeds: [],
      launchTimeline: 'Exploring',
      recomputedServices: [],
      recomputedPhases: [],
      recommendedPackage: 'founder-blueprint'
    }
  };
  const res4 = await callRpc(badPayload);
  assert(res4.status >= 400, `Invalid detail payload aborted transaction (HTTP ${res4.status})`);

  // Verify remote database has NO orphan lead or inquiry for badEmail
  const rollbackCheck = runSql(`SELECT count(*) as cnt FROM dynasty_private.leads WHERE email = '${badEmail}';`);
  assert(Number(rollbackCheck.rows[0].cnt) === 0, `No orphan lead created for failed transaction (count: ${rollbackCheck.rows[0].cnt})`);

  const inqRollbackCheck = runSql(`SELECT count(*) as cnt FROM dynasty_private.inquiries WHERE idempotency_key = '${badIdempotencyKey}';`);
  assert(Number(inqRollbackCheck.rows[0].cnt) === 0, `No partial inquiry created for failed transaction (count: ${inqRollbackCheck.rows[0].cnt})`);

  console.log('\n--- 8. LIVE ATOMIC RPC TEST: DURABLE RATE LIMITING ---');
  const rateLimitIpHash = crypto.createHash('sha256').update(`rate_limit_test_ip_${testRunId}`).digest('hex');
  let rateLimitExceeded = false;
  let attempts = 0;

  for (let i = 0; i < 7; i++) {
    attempts++;
    const rId = crypto.randomUUID();
    const rDetail = { ...detail1, ambitionNotes: `Rate limit test attempt ${i}` };
    const rPayload = {
      p_idempotency_key: rId,
      p_payload_hash: crypto.createHash('sha256').update(JSON.stringify(rDetail)).digest('hex'),
      p_inquiry_type: 'builder',
      p_name: `Rate Tester ${i}`,
      p_email: `rate.${i}.${testRunId}@dynastyworks.test`,
      p_phone: null,
      p_company: `Rate Test Corp ${i}`,
      p_website: null,
      p_ip_hash: rateLimitIpHash,
      p_detail: rDetail
    };
    const res = await callRpc(rPayload);
    if (res.status >= 400 && (res.text.includes('RATE_LIMITED') || res.json?.code === 'P0001')) {
      rateLimitExceeded = true;
      break;
    }
  }
  assert(rateLimitExceeded === true, `Rate limit enforced after threshold (triggered at attempt ${attempts})`);

  console.log('\n--- 9. PRIVACY & DATA LEAKAGE AUDIT ---');
  // Check rate_limits table schema and data
  const rlCols = runSql("SELECT column_name FROM information_schema.columns WHERE table_schema = 'dynasty_private' AND table_name = 'rate_limits';");
  const rlColNames = rlCols.rows.map(r => r.column_name);
  assert(rlColNames.includes('ip_hash') && !rlColNames.includes('ip') && !rlColNames.includes('client_ip'), 'rate_limits table only stores ip_hash (no raw IP)');

  // Verify leads and inquiries have no IP or IP hash column
  const leadCols = runSql("SELECT column_name FROM information_schema.columns WHERE table_schema = 'dynasty_private' AND table_name = 'leads';");
  const leadColNames = leadCols.rows.map(r => r.column_name);
  assert(!leadColNames.some(c => c === 'ip' || c === 'ip_hash' || c === 'client_ip'), 'leads table contains zero IP or IP hash columns');

  const inqCols = runSql("SELECT column_name FROM information_schema.columns WHERE table_schema = 'dynasty_private' AND table_name = 'inquiries';");
  const inqColNames = inqCols.rows.map(r => r.column_name);
  assert(!inqColNames.some(c => c === 'ip' || c === 'ip_hash' || c === 'client_ip'), 'inquiries table contains zero IP or IP hash columns');

  // Verify rate limit record pruning capability
  const pruneCheck = runSql("DELETE FROM dynasty_private.rate_limits WHERE window_start < now() - interval '24 hours';");
  assert(pruneCheck !== null, 'Rate limit records can be pruned successfully');

  // --- SECTION 10: SYNTHETIC RECORD CLEANUP ---
  console.log('\n--- 10. SYNTHETIC RECORD CLEANUP ---');
  const cleanLeads = runSql(`DELETE FROM dynasty_private.leads WHERE email LIKE 'synthetic.${testRunId}%' OR email LIKE 'rate.%.${testRunId}%';`);
  assert(cleanLeads !== null, 'Synthetic test lead/inquiry/detail records removed successfully');

  // Verify cleanup
  const remainingCheck = runSql(`SELECT count(*) as cnt FROM dynasty_private.leads WHERE email LIKE '%.${testRunId}%';`);
  assert(Number(remainingCheck.rows[0].cnt) === 0, 'Confirmed 0 synthetic records remaining in database');

  console.log('\n================================================================');
  console.log(`ALL ASSERTIONS PASSED: ${passedAssertions} / ${totalAssertions}`);
  console.log('================================================================\n');

  return { passed: true, total: totalAssertions, passedCount: passedAssertions };
}

runLiveVerification().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
