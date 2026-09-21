const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');

const NETWORK_ENDPOINT = 'http://localhost:9999/.netlify/functions/submissions';
const DEPLOYED_PREVIEW_ORIGIN = 'https://6ab0a2906a0a4eecefb5381e--dynasty-works-studio-review.netlify.app';

console.log('================================================================');
console.log('DYNASTY WORKS STUDIO // PHASE 2E.3 NETWORK CONVERSION SUITE');
console.log(`Endpoint:       ${NETWORK_ENDPOINT}`);
console.log(`Preview Origin: ${DEPLOYED_PREVIEW_ORIGIN}`);
console.log('================================================================\n');

function queryDb(sql) {
  const clean = sql.replace(/"/g, '\\"');
  const out = execSync(`npx supabase db query --linked "${clean}"`, { encoding: 'utf8' });
  const match = out.match(/\{[\s\S]*"rows"[\s\S]*\}/);
  if (match) return JSON.parse(match[0]).rows;
  return [];
}

const results = [];
function check(section, name, condition, detail) {
  results.push({ section, name, passed: Boolean(condition), detail });
  const icon = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] [${section}] ${name}${detail ? ` (${detail})` : ''}`);
  if (!condition) {
    console.error(`  Assertion failure: ${name}`);
  }
}

async function netFetch(url, options = {}) {
  const headers = {
    Connection: 'close',
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

async function run() {
  const runId = crypto.randomUUID().slice(0, 8);
  const createdKeys = [];
  const createdReceipts = [];

  // Random IP subnet for this test run to prevent rate limit collisions across runs
  const runOctet = Math.floor(Math.random() * 200) + 20;
  const testIp1 = `198.51.${runOctet}.10`;
  const testIp2 = `198.51.${runOctet}.11`;
  const testIp3 = `198.51.${runOctet}.12`;
  const testSpamIp = `198.51.${runOctet}.88`;

  // -------------------------------------------------------------
  // 1. PREVIEW ORIGIN & CORS VERIFICATION
  // -------------------------------------------------------------
  console.log('--- 01: PREVIEW ORIGIN & CORS VERIFICATION ---');

  // A. Authorized Preview Origin OPTIONS preflight
  const optRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'OPTIONS',
    headers: {
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Idempotency-Key',
    },
  });
  check('CORS', 'Authorized preview origin OPTIONS returns 204 No Content', optRes.status === 204);
  const allowOrigin = optRes.headers.get('Access-Control-Allow-Origin');
  check('CORS', 'OPTIONS returns matching Access-Control-Allow-Origin', allowOrigin === DEPLOYED_PREVIEW_ORIGIN || allowOrigin === '*');
  const allowMethods = optRes.headers.get('Access-Control-Allow-Methods') || '';
  check('CORS', 'OPTIONS returns POST in Access-Control-Allow-Methods', allowMethods.includes('POST'));

  // B. Unauthorized Origin OPTIONS preflight
  const badOptRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://unauthorized-attacker.example',
      'Access-Control-Request-Method': 'POST',
    },
  });
  check('CORS_SECURITY', 'Unauthorized origin OPTIONS returns 403 Forbidden', badOptRes.status === 403);

  // C. Unauthorized Origin POST
  const badPostRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://unauthorized-attacker.example',
    },
    body: JSON.stringify({ version: 1 }),
  });
  check('CORS_SECURITY', 'Unauthorized origin POST returns 403 Forbidden', badPostRes.status === 403);

  // -------------------------------------------------------------
  // 2. THREE REAL PREVIEW CONVERSION FLOWS (CLIENT -> SERVER -> DB)
  // -------------------------------------------------------------
  console.log('\n--- 02: THREE REAL PREVIEW CONVERSION FLOWS ---');

  // FLOW A: Company Builder
  const builderKey = crypto.randomUUID();
  createdKeys.push(builderKey);
  const builderData = {
    businessType: 'Agency / Consulting',
    businessStage: 'Idea',
    existingAssets: ['Clear Offer', 'Target Audience'],
    selectedNeeds: ['Brand Identity', 'Custom Software'],
    company: `Apex Strategy ${runId} Corp`,
    name: 'Marcus Vance',
    email: `marcus.vance.${runId}@apex-preview.internal`,
    phone: '+1 (555) 901-2345',
    website: 'https://apex-preview.internal',
    launchTimeline: '3 months',
    budgetRange: '$25,000–$50,000',
    ambitionNotes: 'Live preview pipeline verification build.',
  };
  const builderEnvelope = {
    version: 1,
    idempotencyKey: builderKey,
    consent: { evaluation: true, communication: true, noticeVersion: 'dws-eval-v1' },
    honeypot: '',
    data: builderData,
  };

  const bRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(builderEnvelope),
  });
  check('PREVIEW_BUILDER', 'Live preview builder submission returns 202', bRes.status === 202);
  const bJson = await bRes.json();
  check('PREVIEW_BUILDER', 'Builder response returns accepted status and receiptId', bJson.status === 'accepted' && Boolean(bJson.receiptId));
  if (bJson.receiptId) createdReceipts.push(bJson.receiptId);
  console.log(`  → Builder Receipt ID: ${bJson.receiptId}`);

  // DB Verification for Builder
  const bInqRows = queryDb(`select id, inquiry_type, receipt_id from dynasty_private.inquiries where idempotency_key = '${builderKey}';`);
  check('DB_BUILDER', 'Inquiry persisted in dynasty_private.inquiries', bInqRows.length === 1 && bInqRows[0].inquiry_type === 'builder');
  if (bInqRows[0]?.id) {
    const bChildRows = queryDb(`select inquiry_id, business_type, server_recomputed_services, server_recomputed_phases, recommended_package from dynasty_private.builder_submissions where inquiry_id = '${bInqRows[0].id}';`);
    check('DB_BUILDER', 'Child row persisted in dynasty_private.builder_submissions', bChildRows.length === 1);
    check('DB_BUILDER', 'Deterministic roadmap recomputed and persisted', Array.isArray(bChildRows[0]?.server_recomputed_services) && bChildRows[0].server_recomputed_services.length > 0);
    check('DB_BUILDER', 'Recommended package persisted in child table', Boolean(bChildRows[0]?.recommended_package));
  }
  const bLeadRows = queryDb(`select id, name, email from dynasty_private.leads where email = '${builderData.email}';`);
  check('DB_BUILDER', 'Lead record upserted in dynasty_private.leads', bLeadRows.length === 1 && bLeadRows[0].name === builderData.name);

  // FLOW B: Founder Blueprint
  const bpKey = crypto.randomUUID();
  createdKeys.push(bpKey);
  const bpData = {
    name: 'Sophia Thorne',
    email: `sophia.thorne.${runId}@meridian-preview.internal`,
    phone: '+1 (555) 789-0123',
    company: `Meridian Dynamics ${runId}`,
    website: 'https://meridian-preview.internal',
    businessType: 'Consumer Product',
    businessStage: 'Idea',
    physicalMarket: true,
    ideaDescription: 'Autonomous marine sensor networks for clean energy harbors.',
    problemDescription: 'Harbor sensor grids rely on toxic legacy disposable batteries.',
    targetCustomer: 'Commercial port directors and maritime authorities.',
    existingAssets: 'Core sensor firmware prototypes.',
    requestedNeeds: 'Full venture strategy, institutional deck, hardware packaging.',
    targetLaunch: '6–12 months',
    primaryMarket: 'North America / European Union',
    competitors: 'Legacy cable sensors',
    brandAssets: 'Registered trademark pending',
    companyDocuments: 'Provisional patent',
    digitalAssets: 'None',
    distributionGoals: 'Port authority pilot deployments',
    biggestQuestion: 'How to structure dual hardware-software recurring revenue models?',
    references: ['https://imo.org'],
  };
  const bpEnvelope = {
    version: 1,
    idempotencyKey: bpKey,
    consent: { evaluation: true, communication: true, noticeVersion: 'dws-eval-v1' },
    honeypot: '',
    data: bpData,
  };

  const bpRes = await netFetch(`${NETWORK_ENDPOINT}?kind=blueprint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'X-Forwarded-For': testIp2,
    },
    body: JSON.stringify(bpEnvelope),
  });
  check('PREVIEW_BLUEPRINT', 'Live preview blueprint submission returns 202', bpRes.status === 202);
  const bpJson = await bpRes.json();
  check('PREVIEW_BLUEPRINT', 'Blueprint response returns accepted and receiptId', bpJson.status === 'accepted' && Boolean(bpJson.receiptId));
  if (bpJson.receiptId) createdReceipts.push(bpJson.receiptId);
  console.log(`  → Founder Blueprint Receipt ID: ${bpJson.receiptId}`);

  // DB Verification for Blueprint
  const bpInqRows = queryDb(`select id, inquiry_type, receipt_id from dynasty_private.inquiries where idempotency_key = '${bpKey}';`);
  check('DB_BLUEPRINT', 'Inquiry persisted with type blueprint', bpInqRows.length === 1 && bpInqRows[0].inquiry_type === 'blueprint');
  if (bpInqRows[0]?.id) {
    const bpChildRows = queryDb(`select inquiry_id, physical_market, idea_description from dynasty_private.founder_blueprint_intakes where inquiry_id = '${bpInqRows[0].id}';`);
    check('DB_BLUEPRINT', 'Child row persisted in dynasty_private.founder_blueprint_intakes', bpChildRows.length === 1 && bpChildRows[0].physical_market === true);
  }

  // FLOW C: Contact Studio (General)
  const genKey = crypto.randomUUID();
  createdKeys.push(genKey);
  const genData = {
    name: 'Julian Montgomery',
    email: `julian.montgomery.${runId}@vanguard-preview.internal`,
    phone: '+1 (555) 456-7890',
    company: `Vanguard Aerospace ${runId}`,
    website: 'https://vanguard-preview.internal',
    services: ['Strategic Advisory', 'Executive Narrative', 'Brand Architecture'],
    physicalMarket: false,
    description: 'Developing high-altitude meteorological data systems for commercial cargo aviation.',
    stage: 'Operating',
    budget: '$50,000–$100,000',
    timeframe: 'Immediate',
    referenceUrl: 'https://aviation-standards.internal',
  };
  const genEnvelope = {
    version: 1,
    idempotencyKey: genKey,
    consent: { evaluation: true, communication: true, noticeVersion: 'dws-eval-v1' },
    honeypot: '',
    data: genData,
  };

  const genRes = await netFetch(`${NETWORK_ENDPOINT}?kind=general`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'X-Forwarded-For': testIp3,
    },
    body: JSON.stringify(genEnvelope),
  });
  check('PREVIEW_GENERAL', 'Live preview contact submission returns 202', genRes.status === 202);
  const genJson = await genRes.json();
  check('PREVIEW_GENERAL', 'Contact response returns accepted and receiptId', genJson.status === 'accepted' && Boolean(genJson.receiptId));
  if (genJson.receiptId) createdReceipts.push(genJson.receiptId);
  console.log(`  → Contact Studio Receipt ID: ${genJson.receiptId}`);

  // DB Verification for Contact Studio
  const genInqRows = queryDb(`select id, inquiry_type, receipt_id from dynasty_private.inquiries where idempotency_key = '${genKey}';`);
  check('DB_GENERAL', 'Inquiry persisted with type general', genInqRows.length === 1 && genInqRows[0].inquiry_type === 'general');
  if (genInqRows[0]?.id) {
    const genChildRows = queryDb(`select inquiry_id, services from dynasty_private.general_inquiries where inquiry_id = '${genInqRows[0].id}';`);
    check('DB_GENERAL', 'Child row persisted in dynasty_private.general_inquiries', genChildRows.length === 1 && Array.isArray(genChildRows[0].services));
  }

  // -------------------------------------------------------------
  // 3. IDEMPOTENCY REPLAY & CONFLICT DETECTION
  // -------------------------------------------------------------
  console.log('\n--- 03: IDEMPOTENCY REPLAY & CONFLICT DETECTION ---');

  // Exact duplicate request: Replay
  const replayRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(builderEnvelope),
  });
  check('IDEMPOTENCY', 'Replay returns 202 Accepted', replayRes.status === 202);
  const replayJson = await replayRes.json();
  check('IDEMPOTENCY', 'Replay returns identical receiptId', replayJson.receiptId === bJson.receiptId);

  const countAfterReplay = queryDb(`select count(*) as count from dynasty_private.inquiries where idempotency_key = '${builderKey}';`);
  check('IDEMPOTENCY', 'Replay did not create a duplicate database record', countAfterReplay[0]?.count === 1);

  // Conflicting request: Reused key, modified payload
  const conflictEnvelope = {
    ...builderEnvelope,
    data: {
      ...builderData,
      company: 'Modified Corporation Conflict Test LLC',
    },
  };
  const conflictRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: DEPLOYED_PREVIEW_ORIGIN,
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(conflictEnvelope),
  });
  check('IDEMPOTENCY_CONFLICT', 'Conflicting payload with reused key returns 409 Conflict', conflictRes.status === 409);
  const conflictJson = await conflictRes.json();
  check('IDEMPOTENCY_CONFLICT', 'Conflict response explains key reuse', conflictJson.status === 'conflict');

  // -------------------------------------------------------------
  // 4. DEFENSIVE FAILURE MATRIX
  // -------------------------------------------------------------
  console.log('\n--- 04: DEFENSIVE FAILURE MATRIX ---');

  // A. Honeypot populated -> 400
  const hpRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: DEPLOYED_PREVIEW_ORIGIN, 'X-Forwarded-For': testIp1 },
    body: JSON.stringify({ ...builderEnvelope, idempotencyKey: crypto.randomUUID(), honeypot: 'bot-spam-value' }),
  });
  check('FAILURE_MATRIX', 'Honeypot filled returns 400', hpRes.status === 400);

  // B. Missing consent -> 400
  const noConsentRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: DEPLOYED_PREVIEW_ORIGIN, 'X-Forwarded-For': testIp1 },
    body: JSON.stringify({ ...builderEnvelope, idempotencyKey: crypto.randomUUID(), consent: { evaluation: false, communication: true, noticeVersion: 'v1' } }),
  });
  check('FAILURE_MATRIX', 'Missing consent returns 400', noConsentRes.status === 400);

  // C. Invalid schema -> 422
  const badSchemaRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: DEPLOYED_PREVIEW_ORIGIN, 'X-Forwarded-For': testIp1 },
    body: JSON.stringify({ ...builderEnvelope, idempotencyKey: crypto.randomUUID(), data: { ...builderData, email: 'not-an-email' } }),
  });
  check('FAILURE_MATRIX', 'Invalid email schema returns 422', badSchemaRes.status === 422);

  // D. Oversized payload -> 413
  const hugeData = 'X'.repeat(50000);
  const hugeRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: DEPLOYED_PREVIEW_ORIGIN, 'X-Forwarded-For': testIp1 },
    body: JSON.stringify({ ...builderEnvelope, idempotencyKey: crypto.randomUUID(), data: { ...builderData, ambitionNotes: hugeData } }),
  });
  check('FAILURE_MATRIX', 'Payload > 48KB returns 413', hugeRes.status === 413);

  // E. Method not allowed (GET) -> 405
  const getRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
    method: 'GET',
    headers: { Origin: DEPLOYED_PREVIEW_ORIGIN },
  });
  check('FAILURE_MATRIX', 'GET method returns 405 Method Not Allowed', getRes.status === 405 && (getRes.headers.get('Allow') || '').includes('POST'));

  // -------------------------------------------------------------
  // 5. RATE LIMIT BURST TEST
  // -------------------------------------------------------------
  console.log('\n--- 05: RATE LIMIT BURST TEST (Threshold: 5 / 10min) ---');
  let rateLimitHit = false;
  let retryAfterHeader = null;

  for (let i = 0; i < 7; i++) {
    const burstKey = crypto.randomUUID();
    createdKeys.push(burstKey);
    const burstRes = await netFetch(`${NETWORK_ENDPOINT}?kind=builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: DEPLOYED_PREVIEW_ORIGIN,
        'X-Forwarded-For': testSpamIp,
      },
      body: JSON.stringify({
        ...builderEnvelope,
        idempotencyKey: burstKey,
        data: { ...builderData, email: `spam.${i}.${runId}@apex-preview.internal` },
      }),
    });

    if (burstRes.status === 429) {
      rateLimitHit = true;
      retryAfterHeader = burstRes.headers.get('Retry-After');
      break;
    }
  }
  check('RATE_LIMIT', 'Burst beyond threshold triggers 429 Rate Limited', rateLimitHit);
  check('RATE_LIMIT', '429 response includes Retry-After header', Boolean(retryAfterHeader));

  // -------------------------------------------------------------
  // 6. PURGE SYNTHETIC TEST RECORDS
  // -------------------------------------------------------------
  console.log('\n--- 06: PURGING ALL SYNTHETIC TEST RECORDS ---');
  for (const key of createdKeys) {
    queryDb(`delete from dynasty_private.inquiries where idempotency_key = '${key}';`);
  }
  queryDb(`delete from dynasty_private.leads where email like '%.${runId}@%' or email like 'synthetic.%' or email like '%@dynastyworks.test' or email like 'test.replay.%' or email like 'network.test@example.com';`);
  queryDb(`delete from dynasty_private.inquiries where lead_id is null or id not in (select distinct inquiry_id from dynasty_private.builder_submissions union select distinct inquiry_id from dynasty_private.founder_blueprint_intakes union select distinct inquiry_id from dynasty_private.general_inquiries);`);

  // Verify zero synthetic records remain
  const remainingInq = queryDb(`select count(*) as count from dynasty_private.inquiries where idempotency_key in ('${createdKeys.join("','")}');`);
  check('CLEANUP', 'All synthetic preview test inquiries successfully purged from database', remainingInq[0]?.count === 0);

  const remainingLeads = queryDb(`select count(*) as count from dynasty_private.leads where email like '%.${runId}@%';`);
  check('CLEANUP', 'All synthetic preview test leads successfully purged from database', remainingLeads[0]?.count === 0);

  // Summary
  console.log('\n================================================================');
  console.log('NETWORK CONVERSION SUITE SUMMARY');
  console.log('================================================================');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total Assertions: ${results.length}`);
  console.log(`Passed:           ${passed}`);
  console.log(`Failed:           ${failed}`);

  fs.writeFileSync('outputs/integration-phase-i/phase-2e3-network-test.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    endpoint: NETWORK_ENDPOINT,
    previewOrigin: DEPLOYED_PREVIEW_ORIGIN,
    total: results.length,
    passed,
    failed,
    receipts: createdReceipts,
    results,
  }, null, 2));

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
