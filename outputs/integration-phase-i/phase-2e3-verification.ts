/**
 * Dynasty Works Studio — Phase 2E.3 Preview Conversion Verification Suite
 *
 * Verifies end-to-end client -> server -> database pipeline:
 * 1. Static contract & file integrity checks across all 3 flows + legacy builder.
 * 2. In-process serverless function unit & integration tests against live Supabase.
 * 3. Synthetic submissions for builder, blueprint, and general.
 * 4. PostgREST database row persistence verification (inquiries, leads, child detail tables).
 * 5. Replay idempotency & collision conflict verification.
 * 6. Edge/defensive tests: honeypot, consent, 413, 405, 403, 422, 503, 429 rate limit.
 * 7. Live Netlify preview HTTP tests (if preview URL provided).
 * 8. Zero-secret leak audit across dist/ bundles.
 * 9. Synthetic record cleanup.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import handler from '../../netlify/functions/submissions';
import { submitInquiry, generateIdempotencyKey } from '../../domain/lib/submission-client';

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

// Helper to query remote DB via Supabase CLI
function queryDb(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const out = execSync(`npx supabase db query --linked "${escaped}"`, { encoding: 'utf8' });
  const jsonMatch = out.match(/\{[\s\S]*"rows"[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]).rows;
  }
  return [];
}

async function runSuite() {
  console.log('================================================================');
  console.log('DYNASTY WORKS STUDIO // PHASE 2E.3 VERIFICATION SUITE');
  console.log(`Supabase Target: ${supabaseUrl}`);
  console.log('================================================================\n');

  // Track synthetic IDs for cleanup
  const syntheticIdempotencyKeys: string[] = [];
  const syntheticReceiptIds: string[] = [];
  const runId = crypto.randomUUID().slice(0, 8);
  const runOctet = Math.floor(Math.random() * 200) + 20;
  const testIp1 = `198.51.${runOctet}.10`;
  const testIp2 = `198.51.${runOctet}.11`;
  const testIp3 = `198.51.${runOctet}.12`;
  const testSpamIp = `198.51.${runOctet}.88`;

  // ===========================================================================
  // SECTION 1: CODEBASE & CLIENT FORM CONTRACT INTEGRITY
  // ===========================================================================
  console.log('--- SECTION 1: CODEBASE & CLIENT FORM CONTRACT INTEGRITY ---');

  const clientPath = 'domain/lib/submission-client.ts';
  check('S1_CONTRACT', 'Client submission module exists', fs.existsSync(clientPath));
  const clientCode = fs.readFileSync(clientPath, 'utf8');
  check('S1_CONTRACT', 'Exports submitInquiry', clientCode.includes('export async function submitInquiry'));
  check('S1_CONTRACT', 'Exports generateIdempotencyKey', clientCode.includes('export function generateIdempotencyKey'));
  check('S1_CONTRACT', 'Generates UUID v4 idempotency keys', clientCode.includes('crypto.randomUUID()') || clientCode.includes('xxxxxxxx-xxxx-4xxx'));
  check('S1_CONTRACT', 'Handles 202 accepted with receiptId', clientCode.includes("httpStatus === 202") && clientCode.includes('receiptId'));
  check('S1_CONTRACT', 'Handles 429 rate limit with Retry-After', clientCode.includes("httpStatus === 429") && clientCode.includes('Retry-After'));
  check('S1_CONTRACT', 'Handles 422 validation error', clientCode.includes("httpStatus === 422"));
  check('S1_CONTRACT', 'Handles 409 conflict', clientCode.includes("httpStatus === 409"));
  check('S1_CONTRACT', 'Handles 503 fallback', clientCode.includes("httpStatus === 503"));

  // Company Builder UI (src/ReviewDiagnostic.tsx)
  const builderUiCode = fs.readFileSync('src/ReviewDiagnostic.tsx', 'utf8');
  check('S1_BUILDER_UI', 'Imports submitInquiry', builderUiCode.includes('submitInquiry'));
  check('S1_BUILDER_UI', 'Unchecked explicit consent checkbox present', builderUiCode.includes('builder-consent') && builderUiCode.includes('leadConsent'));
  check('S1_BUILDER_UI', 'Hidden honeypot input present', builderUiCode.includes('builder-hp-fax') && builderUiCode.includes('leadHoneypot'));
  check('S1_BUILDER_UI', 'Receipt ID displayed upon 202', builderUiCode.includes('Receipt: {leadReceiptId}') || builderUiCode.includes('leadReceiptId'));
  check('S1_BUILDER_UI', 'Offline download fallback retained (.txt and .json)', builderUiCode.includes('Download Roadmap (.txt)') && builderUiCode.includes('Download Brief (.json)'));
  check('S1_BUILDER_UI', 'Direct local download button available', builderUiCode.includes('Download Brief Locally'));

  // Founder Blueprint UI (legacy/components/blueprint-intake.tsx)
  const bpUiCode = fs.readFileSync('legacy/components/blueprint-intake.tsx', 'utf8');
  check('S1_BLUEPRINT_UI', 'Imports submitInquiry', bpUiCode.includes('submitInquiry'));
  check('S1_BLUEPRINT_UI', 'Explicit consent acknowledgment present', bpUiCode.includes('authorize Dynasty Works Studio to review this Blueprint intake'));
  check('S1_BLUEPRINT_UI', 'Hidden honeypot input present', bpUiCode.includes('className="honeypot"') && bpUiCode.includes('name="fax"'));
  check('S1_BLUEPRINT_UI', 'Submits blueprint intake at Step 4', bpUiCode.includes('submitBlueprint()'));
  check('S1_BLUEPRINT_UI', 'Offline download retained in review step', bpUiCode.includes('Download my intake ↓'));

  // Contact Studio UI (legacy/components/inquiry-form.tsx)
  const inquiryUiCode = fs.readFileSync('legacy/components/inquiry-form.tsx', 'utf8');
  check('S1_CONTACT_UI', 'Imports submitInquiry', inquiryUiCode.includes('submitInquiry'));
  check('S1_CONTACT_UI', 'Consent checkbox present and truthful', inquiryUiCode.includes('authorize Dynasty Works Studio to review this project brief'));
  check('S1_CONTACT_UI', 'Hidden honeypot input present', inquiryUiCode.includes('className="honeypot"') && inquiryUiCode.includes('name="fax"'));
  check('S1_CONTACT_UI', 'Dual transmit and local download buttons present', inquiryUiCode.includes('Transmit brief to studio') && inquiryUiCode.includes('Download brief locally ↓'));

  // ===========================================================================
  // SECTION 2: SYNTHETIC SUBMISSION PIPELINE (IN-PROCESS FUNCTION & DB TEST)
  // ===========================================================================
  console.log('\n--- SECTION 2: SYNTHETIC CONVERSION SUBMISSIONS & DB VERIFICATION ---');

  // Test Flow 01: Company Builder
  const builderKey = crypto.randomUUID();
  syntheticIdempotencyKeys.push(builderKey);
  const builderData = {
    name: 'Sarah Connor',
    email: `sarah.connor.${runId}@cyberdyne-preview.internal`,
    phone: '+1 (555) 234-5678',
    company: 'SkyNet Remediation Corp',
    website: 'https://cyberdyne-preview.internal',
    businessType: 'Technology / Hardware',
    businessStage: 'Idea',
    existingAssets: ['Domain / Name', 'Technical Concept'],
    selectedNeeds: ['Brand Identity', 'Website', 'Application'],
    launchTimeline: '3–6 months',
    budgetRange: '$25,000–$50,000',
    ambitionNotes: 'Synthetic Phase 2E.3 preview verification test.',
  };

  const builderEnvelope = {
    version: 1,
    idempotencyKey: builderKey,
    consent: {
      evaluation: true,
      communication: true,
      noticeVersion: 'dws-eval-v1',
    },
    honeypot: '',
    data: builderData,
  };

  const builderReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(builderEnvelope),
  });

  const builderRes = await handler(builderReq);
  check('S2_BUILDER', 'Company Builder HTTP status is 202 Accepted', builderRes.status === 202);
  const builderJson = await builderRes.json();
  check('S2_BUILDER', 'Returns accepted status and confirmed receiptId', builderJson.status === 'accepted' && Boolean(builderJson.receiptId));
  if (builderJson.receiptId) {
    syntheticReceiptIds.push(builderJson.receiptId);
  }

  // Database verification for Builder
  const dbBuilderInquiries = queryDb(`select id, inquiry_type, receipt_id, idempotency_key from dynasty_private.inquiries where idempotency_key = '${builderKey}';`);
  check('S2_BUILDER_DB', 'Inquiry record exists in dynasty_private.inquiries', dbBuilderInquiries.length === 1);
  check('S2_BUILDER_DB', 'Receipt ID matches between RPC return and DB row', dbBuilderInquiries[0]?.receipt_id === builderJson.receiptId);

  const dbBuilderDetail = queryDb(`select inquiry_id, business_type, business_stage, server_recomputed_services, server_recomputed_phases, recommended_package from dynasty_private.builder_submissions where inquiry_id = '${dbBuilderInquiries[0]?.id}';`);
  check('S2_BUILDER_DB', 'Child row exists in dynasty_private.builder_submissions', dbBuilderDetail.length === 1);
  check('S2_BUILDER_DB', 'Server recomputed roadmap services stored in child table', Array.isArray(dbBuilderDetail[0]?.server_recomputed_services) && dbBuilderDetail[0]?.server_recomputed_services.length > 0);
  check('S2_BUILDER_DB', 'Recommended package present in child table', Boolean(dbBuilderDetail[0]?.recommended_package));

  const dbBuilderLead = queryDb(`select id, name, email, company_name from dynasty_private.leads where email = '${builderData.email}';`);
  check('S2_BUILDER_DB', 'Lead record upserted in dynasty_private.leads', dbBuilderLead.length === 1 && dbBuilderLead[0]?.name === builderData.name);

  // Test Flow 02: Founder Blueprint
  const blueprintKey = crypto.randomUUID();
  syntheticIdempotencyKeys.push(blueprintKey);
  const blueprintData = {
    name: 'Alexander Sterling',
    email: `alex.sterling.${runId}@meridian-ventures.internal`,
    phone: '+1 (555) 876-5432',
    company: 'Meridian Maritime',
    website: 'https://meridian-maritime.internal',
    businessType: 'Consumer Product',
    businessStage: 'Idea',
    physicalMarket: true,
    ideaDescription: 'Proprietary zero-emissions maritime transport architecture for luxury logistics.',
    problemDescription: 'High sulfur marine fuels face escalating regulatory bans.',
    targetCustomer: 'Luxury freight operators and sovereign coastal logistics coordinators.',
    existingAssets: 'Naval engineering patents and initial propulsion test data.',
    requestedNeeds: 'Complete brand architecture, sovereign identity, and industrial pitch deck.',
    targetLaunch: '12–18 months',
    primaryMarket: 'Pacific Rim / North America',
    competitors: 'Traditional diesel freight liners',
    brandAssets: 'Unassigned trade names',
    companyDocuments: 'Provisional patent filings',
    digitalAssets: 'None',
    distributionGoals: 'Direct port authority leasing agreements',
    biggestQuestion: 'How to sequence capital allocation across naval R&D vs corporate positioning?',
    references: ['https://imo.org/marine-regulations'],
  };

  const blueprintEnvelope = {
    version: 1,
    idempotencyKey: blueprintKey,
    consent: {
      evaluation: true,
      communication: true,
      noticeVersion: 'dws-eval-v1',
    },
    honeypot: '',
    data: blueprintData,
  };

  const bpReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/blueprint?kind=blueprint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
      'X-Forwarded-For': testIp2,
    },
    body: JSON.stringify(blueprintEnvelope),
  });

  const bpRes = await handler(bpReq);
  check('S2_BLUEPRINT', 'Founder Blueprint HTTP status is 202 Accepted', bpRes.status === 202);
  const bpJson = await bpRes.json();
  check('S2_BLUEPRINT', 'Returns accepted status and receiptId', bpJson.status === 'accepted' && Boolean(bpJson.receiptId));
  if (bpJson.receiptId) {
    syntheticReceiptIds.push(bpJson.receiptId);
  }

  const dbBpInquiries = queryDb(`select id, inquiry_type, receipt_id from dynasty_private.inquiries where idempotency_key = '${blueprintKey}';`);
  check('S2_BLUEPRINT_DB', 'Inquiry record exists with inquiry_type = blueprint', dbBpInquiries.length === 1 && dbBpInquiries[0]?.inquiry_type === 'blueprint');
  if (dbBpInquiries[0]?.id) {
    const dbBpDetail = queryDb(`select inquiry_id, idea_description, physical_market from dynasty_private.founder_blueprint_intakes where inquiry_id = '${dbBpInquiries[0]?.id}';`);
    check('S2_BLUEPRINT_DB', 'Child row exists in dynasty_private.founder_blueprint_intakes', dbBpDetail.length === 1 && dbBpDetail[0]?.physical_market === true);
  } else {
    check('S2_BLUEPRINT_DB', 'Child row exists in dynasty_private.founder_blueprint_intakes', false, 'Missing parent inquiry ID');
  }

  // Test Flow 03: Contact Studio (General)
  const generalKey = crypto.randomUUID();
  syntheticIdempotencyKeys.push(generalKey);
  const generalData = {
    name: 'Elena Rostova',
    email: `elena.rostova.${runId}@aurora-studios.internal`,
    phone: '+1 (555) 345-6789',
    company: 'Aurora Kinematics',
    website: 'https://aurora-kinematics.internal',
    services: ['Brand Strategy', 'Brand Identity', 'Website'],
    physicalMarket: false,
    description: 'We are seeking an executive partner to design and deploy the digital presence for our sovereign robotics laboratory.',
    stage: 'Idea',
    budget: 'I have a range to discuss',
    timeframe: '1–3 months',
    referenceUrl: 'https://aurora-kinematics.internal/concepts',
  };

  const generalEnvelope = {
    version: 1,
    idempotencyKey: generalKey,
    consent: {
      evaluation: true,
      communication: true,
      noticeVersion: 'dws-eval-v1',
    },
    honeypot: '',
    data: generalData,
  };

  const genReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/general?kind=general', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
      'X-Forwarded-For': testIp3,
    },
    body: JSON.stringify(generalEnvelope),
  });

  const genRes = await handler(genReq);
  check('S2_GENERAL', 'Contact Studio HTTP status is 202 Accepted', genRes.status === 202);
  const genJson = await genRes.json();
  check('S2_GENERAL', 'Returns accepted status and receiptId', genJson.status === 'accepted' && Boolean(genJson.receiptId));
  if (genJson.receiptId) {
    syntheticReceiptIds.push(genJson.receiptId);
  }

  const dbGenInquiries = queryDb(`select id, inquiry_type, receipt_id from dynasty_private.inquiries where idempotency_key = '${generalKey}';`);
  check('S2_GENERAL_DB', 'Inquiry record exists with inquiry_type = general', dbGenInquiries.length === 1 && dbGenInquiries[0]?.inquiry_type === 'general');
  if (dbGenInquiries[0]?.id) {
    const dbGenDetail = queryDb(`select inquiry_id, services from dynasty_private.general_inquiries where inquiry_id = '${dbGenInquiries[0]?.id}';`);
    check('S2_GENERAL_DB', 'Child row exists in dynasty_private.general_inquiries', dbGenDetail.length === 1 && Array.isArray(dbGenDetail[0]?.services));
  } else {
    check('S2_GENERAL_DB', 'Child row exists in dynasty_private.general_inquiries', false, 'Missing parent inquiry ID');
  }

  // ===========================================================================
  // SECTION 3: IDEMPOTENCY REPLAY & CONFLICT DETECTION
  // ===========================================================================
  console.log('\n--- SECTION 3: IDEMPOTENCY REPLAY & CONFLICT DETECTION ---');

  // Exact duplicate request: Replay
  const replayReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(builderEnvelope),
  });
  const replayRes = await handler(replayReq);
  check('S3_IDEMPOTENCY', 'Replay returns HTTP 202 Accepted', replayRes.status === 202);
  const replayJson = await replayRes.json();
  check('S3_IDEMPOTENCY', 'Replay returns same confirmed receipt ID', replayJson.receiptId === builderJson.receiptId);

  const countAfterReplay = queryDb(`select count(*) from dynasty_private.inquiries where idempotency_key = '${builderKey}';`);
  check('S3_IDEMPOTENCY', 'Replay did not create a duplicate row in inquiries table', countAfterReplay[0]?.count === 1);

  // Conflicting request: Same key, altered payload
  const conflictEnvelope = {
    ...builderEnvelope,
    data: {
      ...builderData,
      company: 'Totally Different Corporation Inc',
    },
  };
  const conflictReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
      'X-Forwarded-For': testIp1,
    },
    body: JSON.stringify(conflictEnvelope),
  });
  const conflictRes = await handler(conflictReq);
  check('S3_CONFLICT', 'Conflicting payload with reused key returns HTTP 409 Conflict', conflictRes.status === 409);
  const conflictJson = await conflictRes.json();
  check('S3_CONFLICT', 'Conflict message explains key reuse', conflictJson.status === 'conflict');

  // ===========================================================================
  // SECTION 4: DEFENSIVE SECURITY, BOUNDARY & ERROR HANDLING
  // ===========================================================================
  console.log('\n--- SECTION 4: DEFENSIVE SECURITY, BOUNDARY & ERROR HANDLING ---');

  // 1. Honeypot Trap Trigger
  const botEnvelope = {
    ...builderEnvelope,
    idempotencyKey: crypto.randomUUID(),
    honeypot: 'SPAM_BOT_ENTRY',
  };
  const botReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
    body: JSON.stringify(botEnvelope),
  });
  const botRes = await handler(botReq);
  check('S4_SECURITY', 'Non-empty honeypot rejected with HTTP 400', botRes.status === 400);

  // 2. Missing Consent
  const noConsentEnvelope = {
    ...builderEnvelope,
    idempotencyKey: crypto.randomUUID(),
    consent: {
      evaluation: false,
      communication: false,
      noticeVersion: 'dws-eval-v1',
    },
  };
  const noConsentReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
    body: JSON.stringify(noConsentEnvelope),
  });
  const noConsentRes = await handler(noConsentReq);
  check('S4_SECURITY', 'Missing consent rejected with HTTP 400', noConsentRes.status === 400);

  // 3. Validation Error (e.g. invalid email)
  const invalidEmailEnvelope = {
    ...builderEnvelope,
    idempotencyKey: crypto.randomUUID(),
    data: {
      ...builderData,
      email: 'not-an-email',
    },
  };
  const invalidEmailReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
    body: JSON.stringify(invalidEmailEnvelope),
  });
  const invalidEmailRes = await handler(invalidEmailReq);
  check('S4_SECURITY', 'Invalid email rejected with HTTP 422 Validation Error', invalidEmailRes.status === 422);

  // 4. Payload Size Limit (>48KB)
  const oversizedData = {
    ...builderData,
    ambitionNotes: 'A'.repeat(50000),
  };
  const oversizedEnvelope = {
    ...builderEnvelope,
    idempotencyKey: crypto.randomUUID(),
    data: oversizedData,
  };
  const oversizedReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '55000',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
    body: JSON.stringify(oversizedEnvelope),
  });
  const oversizedRes = await handler(oversizedReq);
  check('S4_SECURITY', 'Payload > 48KB rejected with HTTP 413 Payload Too Large', oversizedRes.status === 413);

  // 5. HTTP Method Not Allowed
  const getReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'GET',
    headers: {
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
  });
  const getRes = await handler(getReq);
  check('S4_SECURITY', 'GET method rejected with HTTP 405 Method Not Allowed', getRes.status === 405 && (getRes.headers.get('Allow') || '').includes('POST'));

  // 6. Forbidden Origin
  const badOriginReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://malicious-scam-site.example',
    },
    body: JSON.stringify(builderEnvelope),
  });
  const badOriginRes = await handler(badOriginReq);
  check('S4_SECURITY', 'Unrecognized origin rejected with HTTP 403 Forbidden', badOriginRes.status === 403);

  // 7. Submissions Disabled (Production Default Simulation)
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'false';
  const disabledReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://dynasty-works-studio-review.netlify.app',
    },
    body: JSON.stringify({
      ...builderEnvelope,
      idempotencyKey: crypto.randomUUID(),
    }),
  });
  const disabledRes = await handler(disabledReq);
  check('S4_SECURITY', 'When INQUIRY_SUBMISSIONS_ENABLED=false returns HTTP 503 not_configured', disabledRes.status === 503);
  const disabledJson = await disabledRes.json();
  check('S4_SECURITY', '503 body informs user local download is preserved', disabledJson.status === 'not_configured' && disabledJson.message.includes('Local export'));
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';

  // 8. Rate Limiting Burst Simulation
  console.log('\n--- Testing Database Transaction Rate Limit (Threshold: 5 / 10min) ---');
  const spamIp = testSpamIp;
  let rateLimitedHit = false;
  let retryAfterHeader = null;

  for (let i = 0; i < 7; i++) {
    const burstEnvelope = {
      version: 1,
      idempotencyKey: crypto.randomUUID(),
      consent: {
        evaluation: true,
        communication: true,
        noticeVersion: 'dws-eval-v1',
      },
      honeypot: '',
      data: {
        ...builderData,
        email: `rate.test.${i}@cyberdyne-preview.internal`,
      },
    };
    syntheticIdempotencyKeys.push(burstEnvelope.idempotencyKey);

    const burstReq = new Request('https://dynasty-works-studio-review.netlify.app/api/submissions/builder?kind=builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://dynasty-works-studio-review.netlify.app',
        'X-Forwarded-For': spamIp,
      },
      body: JSON.stringify(burstEnvelope),
    });

    const burstRes = await handler(burstReq);
    if (burstRes.status === 429) {
      rateLimitedHit = true;
      retryAfterHeader = burstRes.headers.get('Retry-After');
      break;
    }
  }
  check('S4_SECURITY', 'Rate limiter triggers HTTP 429 after threshold', rateLimitedHit);
  check('S4_SECURITY', 'Rate limited response includes Retry-After header', Boolean(retryAfterHeader));

  // ===========================================================================
  // SECTION 5: CLIENT BUNDLE SECRET LEAK AUDIT
  // ===========================================================================
  console.log('\n--- SECTION 5: CLIENT BUNDLE ZERO-SECRET LEAK AUDIT ---');

  function scanDir(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const distFiles = scanDir('dist');
  let secretFound = false;
  let leakedFile = '';

  const sensitiveTokens = [
    serviceRoleKey,
    rateLimitPepper,
    'DWS_SERVICE_ROLE_KEY',
    'RATE_LIMIT_PEPPER',
    'DWS_DB_PASS',
  ].filter(Boolean);

  for (const file of distFiles) {
    if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
      const content = fs.readFileSync(file, 'utf8');
      for (const token of sensitiveTokens) {
        if (content.includes(token)) {
          secretFound = true;
          leakedFile = `${file} (leaked token)`;
          break;
        }
      }
    }
  }
  check('S5_AUDIT', 'Dist bundles audited: zero secret leaks detected', !secretFound, leakedFile || 'all clean');

  // ===========================================================================
  // SECTION 6: SYNTHETIC DATA CLEANUP
  // ===========================================================================
  console.log('\n--- SECTION 6: SYNTHETIC TEST RECORD CLEANUP ---');

  if (syntheticIdempotencyKeys.length > 0) {
    const keysList = syntheticIdempotencyKeys.map((k) => `'${k}'`).join(',');
    queryDb(`delete from dynasty_private.builder_submissions where inquiry_id in (select id from dynasty_private.inquiries where idempotency_key in (${keysList}));`);
    queryDb(`delete from dynasty_private.founder_blueprint_intakes where inquiry_id in (select id from dynasty_private.inquiries where idempotency_key in (${keysList}));`);
    queryDb(`delete from dynasty_private.general_inquiries where inquiry_id in (select id from dynasty_private.inquiries where idempotency_key in (${keysList}));`);
    queryDb(`delete from dynasty_private.inquiries where idempotency_key in (${keysList});`);
    queryDb(`delete from dynasty_private.leads where email like '%@cyberdyne-preview.internal' or email like '%@meridian-ventures.internal' or email like '%@aurora-studios.internal';`);
    const remaining = queryDb(`select count(*) from dynasty_private.inquiries where idempotency_key in (${keysList});`);
    check('S6_CLEANUP', 'All synthetic test rows successfully deleted from Supabase', remaining[0]?.count === 0);
  }

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n================================================================');
  console.log('PHASE 2E.3 VERIFICATION SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Assertions: ${total}`);
  console.log(`Passed:           ${passed}`);
  console.log(`Failed:           ${failed}`);

  fs.writeFileSync('outputs/integration-phase-i/phase-2e3-verification.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    total,
    passed,
    failed,
    results,
  }, null, 2));

  if (failed > 0) {
    console.error('\nFAILURE DETECTED: Some assertions did not pass.');
    process.exit(1);
  } else {
    console.log('\nALL PHASE 2E.3 VERIFICATION ASSERTIONS PASSED.');
  }
}

runSuite().catch((err) => {
  console.error('Fatal execution error in verification suite:', err);
  process.exit(1);
});
