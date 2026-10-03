// Universal dual-mode Netlify function handler for Meta Conversions API (CAPI)
import { sendMetaCapiEvent, type AllowedCapiEventName } from './lib/meta-capi';
import { BUILD_INFO } from './lib/build-info';

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
    'http://127.0.0.1:8888',
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

// Universal dual-mode handler supporting AWS Lambda (event, context) and Web standard Request
export async function handler(eventOrRequest: any, _context?: any): Promise<any> {
  const isWebRequest =
    typeof eventOrRequest?.arrayBuffer === 'function' &&
    typeof eventOrRequest?.headers?.get === 'function';

  let httpMethod: string;
  const headersObj: Record<string, string> = {};
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

  // Strict Event Gating: Only 'Lead' and 'Schedule' are permitted
  const rawEventName = parsed.event_name;
  if (rawEventName !== 'Lead' && rawEventName !== 'Schedule') {
    return respond(400, {
      success: false,
      error: {
        message: `Event "${rawEventName}" is not permitted for Meta CAPI. Only "Lead" and "Schedule" are dispatched.`,
      },
    });
  }
  const eventName = rawEventName as AllowedCapiEventName;

  // Strict Event ID Validation
  const eventId = typeof parsed.event_id === 'string' ? parsed.event_id.trim() : '';
  if (!eventId) {
    return respond(400, {
      success: false,
      error: {
        message: 'Missing required event_id for Meta CAPI deduplication.',
      },
    });
  }

  // Extract Client IP address from platform headers (unhashed per Meta specification)
  const forwarded = headersObj['x-forwarded-for'];
  const clientIp =
    headersObj['x-nf-client-connection-ip'] ||
    headersObj['client-ip'] ||
    (forwarded ? forwarded.split(',')[0].trim() : '') ||
    undefined;

  // Extract Client User Agent (unhashed per Meta specification)
  const clientUserAgent = headersObj['user-agent'] || undefined;

  // Extract FBP / FBC / event_source_url
  const fbp = typeof parsed.fbp === 'string' && parsed.fbp.trim() ? parsed.fbp.trim() : undefined;
  const fbc = typeof parsed.fbc === 'string' && parsed.fbc.trim() ? parsed.fbc.trim() : undefined;
  const eventSourceUrl =
    typeof parsed.event_source_url === 'string' && parsed.event_source_url.trim()
      ? parsed.event_source_url.trim()
      : undefined;

  const testEventCode =
    typeof parsed.test_event_code === 'string' && parsed.test_event_code.trim()
      ? parsed.test_event_code.trim()
      : undefined;

  // Dispatch to Meta Conversions API via server-side engine
  const capiResult = await sendMetaCapiEvent({
    event_name: eventName,
    event_id: eventId,
    email: parsed.email,
    phone: parsed.phone,
    client_ip_address: clientIp,
    client_user_agent: clientUserAgent,
    fbp,
    fbc,
    event_source_url: eventSourceUrl,
    custom_data: parsed.custom_data,
    test_event_code: testEventCode,
  });

  if (!capiResult.success) {
    return respond(502, {
      success: false,
      event_name: eventName,
      event_id: eventId,
      error: {
        message: capiResult.error?.message || 'Meta CAPI transmission failed',
        code: capiResult.error?.code,
      },
      fbtrace_id: capiResult.fbtrace_id,
    });
  }

  return respond(200, {
    success: true,
    event_name: eventName,
    event_id: eventId,
    deduplicated: true,
    events_received: capiResult.events_received || 1,
    fbtrace_id: capiResult.fbtrace_id,
  });
}

export default handler;
