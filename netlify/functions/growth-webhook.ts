// Universal dual-mode Netlify function handler for growth webhook
import { ingestLead } from './lib/highlevel-ingest';

// Defensive headers for browser responses
const DEFENSIVE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Type': 'application/json',
};

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  const configured = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
    : [];

  const defaults = [
    'https://dynasty-works-studio-review.netlify.app',
    'https://dynasty-works-studio-preview.netlify.app',
    'https://dynastyworks.studio',
    'https://www.dynastyworks.studio',
    'https://dynastyworksstudio.com',
    'https://www.dynastyworksstudio.com',
    'http://localhost:5202',
    'http://127.0.0.1:5202',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8888',
  ];

  const allowed = new Set([...defaults, ...configured]);
  if (allowed.has(origin)) return true;

  if (
    /^https:\/\/[a-z0-9-]+--dynasty-works-studio-review\.netlify\.app$/.test(origin) ||
    /^https:\/\/[a-z0-9-]+\.loca\.lt$/.test(origin)
  ) {
    return true;
  }

  return false;
}

function isTestEmail(email?: string): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    lower.endsWith('@example.com') ||
    lower.endsWith('@example.org') ||
    lower.endsWith('@example.net') ||
    lower.includes('.test.') ||
    lower.includes('+test') ||
    lower.includes('verification') ||
    lower.startsWith('test.') ||
    lower.startsWith('test-')
  );
}

// Universal dual-mode handler supporting AWS Lambda (event, context) and Web standard Request
export async function handler(eventOrRequest: any, context?: any): Promise<any> {
  const isWebRequest = typeof eventOrRequest?.arrayBuffer === 'function' && typeof eventOrRequest?.headers?.get === 'function';

  let httpMethod: string;
  let headersObj: Record<string, string> = {};
  let bodyText: string = '';
  let origin: string | null = null;

  if (isWebRequest) {
    const req = eventOrRequest as Request;
    httpMethod = req.method;
    origin = req.headers.get('origin');
    req.headers.forEach((val, key) => {
      headersObj[key.toLowerCase()] = val;
    });
    try {
      bodyText = await req.text();
    } catch {
      bodyText = '';
    }
  } else {
    httpMethod = eventOrRequest.httpMethod || 'GET';
    const rawHeaders = eventOrRequest.headers || {};
    for (const [k, v] of Object.entries(rawHeaders)) {
      headersObj[k.toLowerCase()] = String(v);
    }
    origin = headersObj['origin'] || null;
    bodyText = eventOrRequest.body || '';
  }

  const corsHeaders: Record<string, string> = {};
  if (origin && isOriginAllowed(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Vary'] = 'Origin';
  } else {
    corsHeaders['Access-Control-Allow-Origin'] = '*';
  }

  const respond = (status: number, body: Record<string, unknown>, extraHeaders: Record<string, string> = {}) => {
    const finalHeaders = {
      ...DEFENSIVE_HEADERS,
      ...corsHeaders,
      ...extraHeaders,
    };

    if (isWebRequest) {
      return new Response(JSON.stringify(body), {
        status,
        headers: finalHeaders,
      });
    }

    return {
      statusCode: status,
      headers: finalHeaders,
      body: JSON.stringify(body),
    };
  };

  // Preflight
  if (httpMethod === 'OPTIONS') {
    const preflightHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Idempotency-Key',
      'Access-Control-Max-Age': '86400',
    };
    if (isWebRequest) {
      return new Response(null, { status: 204, headers: preflightHeaders });
    }
    return { statusCode: 204, headers: preflightHeaders, body: '' };
  }

  if (httpMethod !== 'POST') {
    return respond(405, { success: false, error: { message: 'Method Not Allowed' } });
  }

  let parsed: any;
  try {
    parsed = JSON.parse(bodyText || '{}');
  } catch {
    return respond(400, { success: false, error: { message: 'Invalid JSON body' } });
  }

  // Honeypot check
  if (parsed.honeypot && String(parsed.honeypot).trim().length > 0) {
    return respond(200, { success: true, message: 'Application received' });
  }

  // Test mode isolation check
  const isTest = Boolean(
    parsed.is_test ||
    isTestEmail(parsed.email) ||
    process.env.DWS_TEST_MODE === 'true' ||
    headersObj['x-dws-test'] === 'true'
  );

  const normalizedPayload = {
    ...parsed,
    inquiry_type: 'growth',
    is_test: isTest,
    source: parsed.source || 'DWS Growth Review',
    submitted_at: parsed.submitted_at || new Date().toISOString(),
  };

  try {
    const result = await ingestLead(normalizedPayload);
    return respond(200, {
      success: true,
      message: result.duplicatePrevented
        ? 'Growth application accepted and confirmed by CRM automation (duplicate opportunity prevented).'
        : 'Growth application accepted and confirmed by CRM automation.',
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 503;
    console.error(JSON.stringify({
      event: 'growth_ingest_failure',
      status: statusCode,
      code: err.errorCode,
      message: err.message,
    }));

    return respond(statusCode, {
      success: false,
      error: {
        code: err.errorCode || 'INGESTION_ERROR',
        message: err.message || 'Lead ingestion service returned an error. Application not confirmed.',
      },
    });
  }
}

export default handler;
