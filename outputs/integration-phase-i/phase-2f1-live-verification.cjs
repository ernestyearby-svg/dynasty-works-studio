const https = require('node:https');

const endpoints = [
  'https://dynastyworksstudio.com/',
  'https://dynastyworksstudio.com/privacy',
  'https://dynastyworksstudio.com/terms',
  'https://dynastyworksstudio.com/robots.txt',
  'https://dynastyworksstudio.com/sitemap.xml',
  'https://www.dynastyworksstudio.com/',
];

async function checkEndpoints() {
  console.log('=== DYNASTY WORKS STUDIO BOUNDED HTTPS CHECKS ===\n');
  
  for (const url of endpoints) {
    const start = Date.now();
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'DWS-Phase2F1-Verifier/1.0',
        },
        redirect: 'manual', // track redirect
      });
      const duration = Date.now() - start;
      const status = res.status;
      const contentType = res.headers.get('content-type') || 'none';
      const location = res.headers.get('location') || 'n/a';

      console.log(`Endpoint: ${url}`);
      console.log(`  HTTP Status:  ${status}`);
      console.log(`  Content-Type: ${contentType}`);
      console.log(`  Redirect To:  ${location}`);
      console.log(`  Duration:     ${duration}ms`);
      console.log(`  Error:        none\n`);
    } catch (err) {
      const duration = Date.now() - start;
      console.log(`Endpoint: ${url}`);
      console.log(`  Error:        ${err.name}: ${err.message}`);
      console.log(`  Duration:     ${duration}ms\n`);
    }
  }

  // Also test submission lock: POST /api/submissions/builder
  try {
    const start = Date.now();
    const res = await fetch('https://dynastyworksstudio.com/api/submissions/builder', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flow: 'company_builder' }),
    });
    const duration = Date.now() - start;
    const status = res.status;
    const body = await res.json().catch(() => ({}));
    console.log('Submission Lock Verification: POST /api/submissions/builder');
    console.log(`  HTTP Status:  ${status}`);
    console.log(`  Response:     ${JSON.stringify(body)}`);
    console.log(`  Duration:     ${duration}ms\n`);
  } catch (err) {
    console.log(`Submission Lock Check Error: ${err.name}: ${err.message}\n`);
  }
}

checkEndpoints().catch(console.error);
