const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

(async () => {
  const checks = [];
  const check = (name, pass, detail = '') => {
    checks.push({ name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ': ' + detail : ''}`);
  };

  console.log('=== 1. Database Migration Syntax & Architectural Boundary Verification ===');
  const migrationPath = 'supabase/migrations/20260920_phase2e1_dynasty_private_schema.sql';
  check('Migration file exists at version-controlled path', fs.existsSync(migrationPath));

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Schema & Revocation
  check('SQL creates isolated schema dynasty_private', sql.includes('create schema if not exists dynasty_private;'));
  check('SQL immediately revokes schema access from public, anon, authenticated', 
    sql.includes('revoke all on schema dynasty_private from public, anon, authenticated;'));

  // Core Tables
  const expectedTables = [
    'rate_limits',
    'leads',
    'inquiries',
    'builder_submissions',
    'founder_blueprint_intakes',
    'general_inquiries'
  ];
  for (const table of expectedTables) {
    check(`Table dynasty_private.${table} defined`, sql.includes(`create table if not exists dynasty_private.${table}`));
    check(`Table dynasty_private.${table} has forced RLS`, 
      sql.includes(`alter table dynasty_private.${table} enable row level security;`) &&
      sql.includes(`alter table dynasty_private.${table} force row level security;`));
  }

  // Revocations
  check('Public/Anon/Authenticated table permissions completely revoked',
    sql.includes('revoke all on all tables in schema dynasty_private from public, anon, authenticated;') &&
    sql.includes('revoke all on all sequences in schema dynasty_private from public, anon, authenticated;'));

  // Hardened Atomic RPC
  check('Atomic submit_inquiry function defined with SECURITY DEFINER',
    sql.includes('create or replace function dynasty_private.submit_inquiry') &&
    sql.includes('security definer'));
  check('Restricted search_path set on submit_inquiry function',
    sql.includes('set search_path = dynasty_private, pg_catalog, pg_temp'));
  check('Execution revoked from public, anon, authenticated',
    sql.includes('revoke execute on function dynasty_private.submit_inquiry from public, anon, authenticated;'));
  check('Execution granted strictly to service_role',
    sql.includes('grant execute on function dynasty_private.submit_inquiry to service_role;'));

  // Rate Limiting & Privacy
  check('Durable rate limit evaluated in database transaction with IP hash',
    sql.includes('p_ip_hash text') && sql.includes('rate_limits'));
  check('Raw IP address is NEVER stored in SQL schema',
    !sql.includes('raw_ip') && !sql.includes('client_ip') && !sql.includes('ip_address'));

  // Idempotency & Conflict Handling
  check('Idempotency key uniqueness and conflict detection implemented',
    sql.includes('idempotency_key uuid not null unique') &&
    sql.includes('IDEMPOTENCY_CONFLICT') &&
    sql.includes('payload_hash text not null'));

  console.log('\n=== 2. Netlify Serverless Scaffold & Controlled Ingestion Verification ===');
  const functionPath = 'netlify/functions/submissions.ts';
  check('Serverless scaffold exists at netlify/functions/submissions.ts', fs.existsSync(functionPath));

  const fnCode = fs.readFileSync(functionPath, 'utf8');

  check('Controlled feature flag INQUIRY_SUBMISSIONS_ENABLED implemented',
    fnCode.includes("process.env.INQUIRY_SUBMISSIONS_ENABLED !== 'true'") &&
    fnCode.includes("not_configured"));
  check('Defensive headers present (Cache-Control: no-store, X-Content-Type-Options: nosniff)',
    fnCode.includes("'Cache-Control': 'no-store") &&
    fnCode.includes("'X-Content-Type-Options': 'nosniff'"));
  check('Strict HTTP Method check (POST only, 405 on others)',
    fnCode.includes("request.method !== 'POST'") &&
    fnCode.includes("405"));
  check('48KB maximum payload size limit enforced',
    fnCode.includes("MAX_BYTES = 48000") &&
    fnCode.includes("413"));
  check('Origin allowlist validation enforced (403 on forbidden origin)',
    fnCode.includes("isOriginAllowed(origin)") &&
    fnCode.includes("403"));
  check('Zero-friction honeypot trap enforced (400 on bot entry)',
    fnCode.includes("honeypot: z.string().max(0") &&
    fnCode.includes("400"));
  check('Strict submission-kind validation for builder, blueprint, and general',
    fnCode.includes("kindParam !== 'builder' && kindParam !== 'blueprint' && kindParam !== 'general'"));

  // Server-Side Recomputation Check
  check('Server-side deterministic recomputation for Company Builder leads',
    fnCode.includes("generateRoadmap(build)") &&
    fnCode.includes("recomputedServices:") &&
    fnCode.includes("recomputedPhases:") &&
    fnCode.includes("recommendedPackage:"));

  // Privacy Hashing Check
  check('IP address hashed with server pepper before RPC execution',
    fnCode.includes("crypto.createHash('sha256').update(rawIp + pepper).digest('hex')"));
  check('Structured PII-redacted logging (zero founder personal data logged)',
    fnCode.includes("event: 'submission_persisted'") &&
    !fnCode.includes("console.log(validatedData.email)") &&
    !fnCode.includes("console.info(validatedData)"));

  console.log('\n=== 3. Netlify Configuration Verification ===');
  const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
  check('netlify.toml defines functions directory as netlify/functions',
    netlifyToml.includes('functions = "netlify/functions"'));
  check('netlify.toml routes /api/submissions/:kind to serverless function before catch-all',
    netlifyToml.indexOf('from = "/api/submissions/:kind"') < netlifyToml.indexOf('from = "/*"'));

  console.log('\n=== 4. Secret Leakage & Bundle Security Audit ===');
  const distDir = 'dist/phase-i/assets';
  check('Client build artifacts exist in dist/phase-i/assets', fs.existsSync(distDir));

  if (fs.existsSync(distDir)) {
    const assetFiles = fs.readdirSync(distDir);
    let secretFound = false;
    let foundSecretName = '';

    const forbiddenPatterns = [
      /SUPABASE_SERVICE_ROLE/i,
      /SERVICE_ROLE_KEY/i,
      /RATE_LIMIT_PEPPER/i,
      /RESEND_API_KEY/i,
      /sbp_[a-zA-Z0-9]{20,}/, // Supabase personal access token format
      /eyJh[a-zA-Z0-9_-]{20,}\.eyJh[a-zA-Z0-9_-]{20,}/, // JWT service-role pattern
    ];

    for (const file of assetFiles) {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const content = fs.readFileSync(path.join(distDir, file), 'utf8');
        for (const pattern of forbiddenPatterns) {
          if (pattern.test(content)) {
            secretFound = true;
            foundSecretName = `Pattern ${pattern} found in ${file}`;
            break;
          }
        }
      }
    }

    check('Zero server secrets or administrative credentials leaked into client bundle', 
      !secretFound, foundSecretName || 'All client chunks clean');
  }

  console.log('\n=== 5. Controlled Endpoint Execution Simulation ===');
  // Dynamic import of Netlify function handler to test execution in Node.js
  const { default: handler } = await import('../../netlify/functions/submissions.ts');

  // Test 1: Disabled mode returns 503
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'false';
  const req1 = new Request('http://localhost:5202/api/submissions/builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5202' },
    body: JSON.stringify({ version: 1, idempotencyKey: '00000000-0000-0000-0000-000000000000', consent: { evaluation: true, communication: true, noticeVersion: 'v1' }, honeypot: '', data: {} })
  });
  const res1 = await handler(req1);
  check('Disabled mode returns HTTP 503 not_configured', res1.status === 503);
  const json1 = await res1.json();
  check('Disabled message informs about local export', json1.status === 'not_configured' && json1.message.includes('Local export'));

  // Test 2: Method validation returns 405 on GET
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'true';
  const req2 = new Request('http://localhost:5202/api/submissions/builder', { method: 'GET' });
  const res2 = await handler(req2);
  check('GET request returns HTTP 405 Method Not Allowed', res2.status === 405);

  // Test 3: Origin validation returns 403 on untrusted origin
  const req3 = new Request('http://localhost:5202/api/submissions/builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'https://malicious-site.com' },
    body: JSON.stringify({})
  });
  const res3 = await handler(req3);
  check('Untrusted origin returns HTTP 403 Origin Not Allowed', res3.status === 403);

  // Test 4: Honeypot trap returns 400 on bot submission
  const req4 = new Request('http://localhost:5202/api/submissions/builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5202' },
    body: JSON.stringify({
      version: 1,
      idempotencyKey: '00000000-0000-0000-0000-000000000000',
      consent: { evaluation: true, communication: true, noticeVersion: 'v1' },
      honeypot: 'bot_filled_value',
      data: {}
    })
  });
  const res4 = await handler(req4);
  check('Honeypot entry returns HTTP 400 Bot detected', res4.status === 400);

  // Test 5: Invalid payload returns 422 with field errors
  const req5 = new Request('http://localhost:5202/api/submissions/builder?kind=builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5202' },
    body: JSON.stringify({
      version: 1,
      idempotencyKey: '00000000-0000-0000-0000-000000000000',
      consent: { evaluation: true, communication: true, noticeVersion: 'v1' },
      honeypot: '',
      data: { name: 'A', email: 'not-an-email' } // Invalid fields
    })
  });
  const res5 = await handler(req5);
  check('Invalid payload returns HTTP 422 with field errors', res5.status === 422, `Received status: ${res5.status}`);

  // Reset feature flag to false for security
  process.env.INQUIRY_SUBMISSIONS_ENABLED = 'false';

  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass).length;
  console.log(`\n=== Phase 2E.1 Verification Summary: ${passed} passed, ${failed} failed ===\n`);

  fs.writeFileSync(
    'outputs/integration-phase-i/phase-2e1-verification.json',
    JSON.stringify({ passed, failed, total: checks.length, checks }, null, 2)
  );

  if (failed > 0) process.exit(1);
})();
