import { z } from 'zod';
import crypto from 'node:crypto';
import { generateRoadmap, type RoadmapItem } from '../../domain/lib/recommendation-engine';
import { normalizeBuild, emptyCompanyBuild } from '../../domain/lib/company-builder';
import { businessTypes } from '../../domain/data/company-builder';
import { businessStages } from '../../domain/data/service-catalog';
import {
  dispatchSubmissionNotifications,
  type SubmissionNotificationContext,
} from './lib/notifications';

// Defensive Response Headers
const DEFENSIVE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Type': 'application/json',
};

function reply(
  status: number,
  body: Record<string, unknown>,
  extraHeaders: Record<string, string> = {},
  origin?: string | null
): Response {
  const corsHeaders: Record<string, string> = {};
  if (origin && isOriginAllowed(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...DEFENSIVE_HEADERS,
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

// Allowed Origins Allowlist
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
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
  ];

  const allowed = new Set([...defaults, ...configured]);
  if (allowed.has(origin)) return true;

  // Dynamically permit Netlify deploy-preview, branch-deploy, and localtunnel review URLs
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

// Common Validation Schemas
const commonEnvelopeSchema = z.object({
  version: z.literal(1),
  kind: z.enum(['builder', 'blueprint', 'general']).optional(),
  idempotencyKey: z.string().uuid(),
  consent: z.object({
    evaluation: z.literal(true),
    communication: z.literal(true),
    noticeVersion: z.string().min(1).max(100),
  }).strict(),
  honeypot: z.string().max(0, 'Bot detected'),
  botToken: z.string().max(4096).optional(),
  data: z.record(z.any()),
}).strict();

const safeUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(2000).refine((s) => /^https?:\/\//i.test(s), 'Must be http:// or https:// URL'),
]);

const builderPayloadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().email('Invalid email address').max(254),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().min(1, 'Company name is required').max(150),
  website: safeUrl.optional().default(''),
  businessType: z.string().trim().min(1).max(100),
  businessStage: z.enum(['Idea', 'Preparing to launch', 'Operating', 'Growing']),
  existingAssets: z.array(z.string()).default([]),
  selectedNeeds: z.array(z.string()).default([]),
  launchTimeline: z.string().trim().max(200).default('Exploring'),
  budgetRange: z.string().trim().max(200).optional().default(''),
  ambitionNotes: z.string().trim().max(2000).optional().default(''),
}).strict();

const blueprintPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().min(1).max(150),
  website: safeUrl.optional().default(''),
  businessType: z.enum(businessTypes as unknown as [string, ...string[]]),
  businessStage: z.enum(businessStages as unknown as [string, ...string[]]),
  physicalMarket: z.boolean().default(false),
  ideaDescription: z.string().trim().min(20).max(3000),
  problemDescription: z.string().trim().min(10).max(2000),
  targetCustomer: z.string().trim().min(10).max(1500),
  existingAssets: z.string().trim().max(2000).optional().default(''),
  requestedNeeds: z.string().trim().min(10).max(2000),
  targetLaunch: z.string().trim().min(1).max(200).default('Exploring'),
  primaryMarket: z.string().trim().min(1).max(200).default('General'),
  competitors: z.string().trim().max(1500).optional().default(''),
  brandAssets: z.string().trim().max(1500).optional().default(''),
  companyDocuments: z.string().trim().max(1000).optional().default(''),
  digitalAssets: z.string().trim().max(1500).optional().default(''),
  distributionGoals: z.string().trim().max(2000).optional().default(''),
  biggestQuestion: z.string().trim().min(10).max(2000),
  references: z.array(safeUrl).max(5).default([]),
}).strict();

const generalPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().min(1).max(150),
  website: safeUrl.optional().default(''),
  services: z.array(z.string().trim().max(100)).min(1, 'Select at least one service'),
  physicalMarket: z.boolean().default(false),
  description: z.string().trim().min(20).max(5000),
  stage: z.string().trim().max(100),
  budget: z.string().trim().max(100),
  timeframe: z.string().trim().max(100),
  referenceUrl: safeUrl.optional().default(''),
}).strict();

async function coreHandler(request: Request, context?: any): Promise<Response> {
  const startTime = Date.now();
  const origin = request.headers.get('origin');
  const respond = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
    reply(status, body, extra, origin);

  // 1. Origin Allowlist Validation
  if (origin && !isOriginAllowed(origin)) {
    return reply(403, { status: 'rejected', message: 'Origin Not Allowed' });
  }

  // 2. Preflight OPTIONS Handling
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Idempotency-Key',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    });
  }

  // 3. HTTP Method Check
  if (request.method !== 'POST') {
    return respond(405, { status: 'rejected', message: 'Method Not Allowed' }, { Allow: 'POST, OPTIONS' });
  }

  // 4. Feature Flag Gate (Controlled Phase 2E.1 Operation)
  if (process.env.INQUIRY_SUBMISSIONS_ENABLED !== 'true') {
    return respond(503, {
      status: 'not_configured',
      message: 'Secure transmission endpoint is not enabled. Local export and brief download remain available.',
    });
  }

  // 4. Content-Type Validation
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return respond(415, { status: 'rejected', message: 'Expected Content-Type: application/json' });
  }

  // 5. Payload Size Bound (Max 48KB)
  const MAX_BYTES = 48000;
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BYTES) {
    return respond(413, { status: 'rejected', message: 'Payload Too Large' });
  }

  let rawBodyText = '';
  try {
    const rawBuffer = await request.arrayBuffer();
    if (rawBuffer.byteLength > MAX_BYTES) {
      return respond(413, { status: 'rejected', message: 'Payload Too Large' });
    }
    rawBodyText = new TextDecoder('utf-8', { fatal: true }).decode(rawBuffer);
  } catch {
    return respond(400, { status: 'rejected', message: 'Malformed request body' });
  }

  let body: any;
  try {
    body = JSON.parse(rawBodyText);
  } catch {
    return respond(400, { status: 'rejected', message: 'Invalid JSON' });
  }

  // 6. Common Envelope Validation (Idempotency, Consent, Honeypot)
  const envelopeResult = commonEnvelopeSchema.safeParse(body);
  if (!envelopeResult.success) {
    return respond(400, {
      status: 'rejected',
      message: 'Invalid submission envelope or honeypot triggered',
      errors: envelopeResult.error.flatten().fieldErrors,
    });
  }

  const { idempotencyKey } = envelopeResult.data;

  // 7. Resolve Submission Kind from:
  //    a) pathname (e.g. /api/submissions/builder or /.netlify/functions/submissions/builder)
  //    b) searchParams (e.g. ?kind=builder)
  //    c) body envelope (e.g. { kind: 'builder', ... })
  const url = new URL(request.url);
  const pathSegments = url.pathname.replace(/\/+$/, '').split('/');
  const lastPathSegment = pathSegments[pathSegments.length - 1]?.toLowerCase();
  const pathKind = (lastPathSegment === 'builder' || lastPathSegment === 'blueprint' || lastPathSegment === 'general')
    ? lastPathSegment
    : null;

  const queryKind = url.searchParams.get('kind')?.toLowerCase() || null;
  const bodyKind = (body?.kind && typeof body.kind === 'string') ? body.kind.toLowerCase() : null;

  const resolvedKind = pathKind || queryKind || bodyKind;

  if (resolvedKind !== 'builder' && resolvedKind !== 'blueprint' && resolvedKind !== 'general') {
    return respond(400, { status: 'rejected', message: 'Invalid or missing submission kind parameter' });
  }

  const kind: 'builder' | 'blueprint' | 'general' = resolvedKind;

  // 8. Type-Specific Validation & Recomputation
  let validatedData: any;
  let recomputedDetail: any;

  if (kind === 'builder') {
    const parseResult = builderPayloadSchema.safeParse(body.data);
    if (!parseResult.success) {
      return respond(422, {
        status: 'validation_error',
        message: 'Please review required Company Builder fields.',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    validatedData = parseResult.data;

    // Server-side deterministic recomputation
    const build = normalizeBuild({
      ...emptyCompanyBuild,
      businessType: validatedData.businessType,
      businessStage: validatedData.businessStage,
      starting: validatedData.existingAssets as any,
      needs: validatedData.selectedNeeds as any,
      company: validatedData.company,
      launch: (validatedData.launchTimeline as any) || 'Exploring',
      budgetNote: validatedData.ambitionNotes || '',
    });
    const roadmap = generateRoadmap(build);

    recomputedDetail = {
      ...validatedData,
      recomputedServices: roadmap.items.map((i: RoadmapItem) => ({
        serviceId: i.serviceId,
        timing: i.timing,
        reason: i.reason,
        prerequisiteNotes: i.prerequisiteNotes,
      })),
      recomputedPhases: roadmap.phases.map((p) => p.name),
      recommendedPackage: roadmap.engagement.id,
    };
  } else if (kind === 'blueprint') {
    const parseResult = blueprintPayloadSchema.safeParse(body.data);
    if (!parseResult.success) {
      return respond(422, {
        status: 'validation_error',
        message: 'Please review required Founder Blueprint fields.',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    validatedData = parseResult.data;
    recomputedDetail = {
      ...validatedData,
      website: validatedData.website || null,
    };
  } else {
    const parseResult = generalPayloadSchema.safeParse(body.data);
    if (!parseResult.success) {
      return respond(422, {
        status: 'validation_error',
        message: 'Please review required Contact fields.',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    validatedData = parseResult.data;
    recomputedDetail = {
      ...validatedData,
      website: validatedData.website || null,
      referenceUrl: validatedData.referenceUrl || null,
    };
  }

  // 9. Ephemeral Privacy-Preserving Rate Limit Hash
  // Extract trusted client IP from platform-verified sources (Netlify context.ip or edge header)
  let rawIp = context?.ip || request.headers.get('x-nf-client-connection-ip');

  // Fallback for simulated test environments only (never trusted in production)
  if (!rawIp) {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST || process.env.DWS_TEST_MODE === 'true') {
      rawIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    } else {
      rawIp = '127.0.0.1';
    }
  }

  const pepper = process.env.RATE_LIMIT_PEPPER || 'dws_static_dev_pepper';
  const ipHash = crypto.createHash('sha256').update(rawIp + pepper).digest('hex');

  // 10. Payload SHA-256 Hash
  const payloadHash = crypto.createHash('sha256').update(JSON.stringify(recomputedDetail)).digest('hex');

  try {
    // 11. Lead Ingestion Automation Delivery (n8n & HighLevel Pipeline)
    const automationWebhookUrl =
    process.env.DWS_AUTOMATION_WEBHOOK_URL ||
    process.env.GROWTH_SYSTEM_WEBHOOK_URL ||
    (process.env.NETLIFY_DEV ? 'http://localhost:5681/webhook/dws-growth-review' : '');

  const isTest = Boolean(
    isTestEmail(validatedData.email) ||
    process.env.DWS_TEST_MODE === 'true' ||
    request.headers.get('x-dws-test') === 'true'
  );

  let automationDelivered = false;
  let automationError = '';

  if (automationWebhookUrl) {
    const fullName = validatedData.name ? String(validatedData.name).trim() : 'Prospect';
    const spaceIdx = fullName.indexOf(' ');
    const firstName = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
    const lastName = spaceIdx > 0 ? fullName.slice(spaceIdx + 1).trim() : '';

    const automationPayload = {
      inquiry_kind: kind,
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      email: validatedData.email,
      phone: validatedData.phone || '',
      company_name: validatedData.company,
      business_name: validatedData.company,
      company: validatedData.company,
      website: validatedData.website || '',
      services: validatedData.services || [],
      selected_services: Array.isArray(validatedData.services) ? validatedData.services.join(', ') : '',
      description: validatedData.description || validatedData.ambitionNotes || validatedData.ideaDescription || '',
      notes: validatedData.description || validatedData.ambitionNotes || validatedData.ideaDescription || '',
      biggest_bottleneck: validatedData.description || validatedData.problemDescription || '',
      primary_goal: Array.isArray(validatedData.services) ? validatedData.services.join(', ') : (validatedData.businessType || 'General Inquiry'),
      stage: validatedData.stage || validatedData.businessStage || '',
      budget: validatedData.budget || validatedData.budgetRange || '',
      monthly_marketing_budget: validatedData.budget || validatedData.budgetRange || '',
      timeframe: validatedData.timeframe || validatedData.launchTimeline || '',
      reference_url: validatedData.referenceUrl || '',
      physical_market: Boolean(validatedData.physicalMarket),
      source: 'website-general-contact',
      source_page: request.headers.get('referer') || '/contact',
      landing_page: '/contact',
      consent: body.consent,
      idempotency_key: idempotencyKey,
      is_test: isTest,
      submitted_at: new Date().toISOString(),
    };

    const outboundHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'bypass-tunnel-reminder': '1',
    };
    if (process.env.DWS_AUTOMATION_API_KEY) {
      outboundHeaders['Authorization'] = `Bearer ${process.env.DWS_AUTOMATION_API_KEY}`;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const autoRes = await fetch(automationWebhookUrl, {
        method: 'POST',
        headers: outboundHeaders,
        body: JSON.stringify(automationPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (autoRes.ok) {
        automationDelivered = true;
        console.info(JSON.stringify({
          event: 'automation_ingest_success',
          kind,
          email: validatedData.email,
          status: autoRes.status,
          duration_ms: Date.now() - startTime,
        }));
      } else {
        const errTxt = await autoRes.text().catch(() => '');
        automationError = `Automation upstream error (${autoRes.status}): ${errTxt.slice(0, 100)}`;
        console.error('Automation lead ingest error:', automationError);
      }
    } catch (err: any) {
      automationError = `Automation connection failed: ${err.message}`;
      console.error('Automation fetch error:', err);
    }
  }

  // 12. Optional Database RPC Execution (Supabase)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let dbReceiptId: string | null = null;

  if (supabaseUrl && supabaseKey) {
    try {
      const rpcPayload = {
        p_idempotency_key: idempotencyKey,
        p_payload_hash: payloadHash,
        p_inquiry_type: kind,
        p_name: validatedData.name,
        p_email: validatedData.email,
        p_phone: validatedData.phone || null,
        p_company: validatedData.company,
        p_website: validatedData.website || null,
        p_ip_hash: ipHash,
        p_detail: recomputedDetail,
      };

      const rpcResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/submit_inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Profile': 'dynasty_private',
          'Content-Profile': 'dynasty_private',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(rpcPayload),
      });

      if (rpcResponse.ok) {
        const rpcResult: any = await rpcResponse.json();
        const row = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult;
        dbReceiptId = row?.receipt_id || null;
      }
    } catch (dbErr: any) {
      console.warn('Supabase RPC skipped or unavailable:', dbErr?.message);
    }
  }

  // Determine Final Delivery Outcome:
  // If either the automation engine or the database accepted the lead, confirm receipt!
  if (automationDelivered || dbReceiptId) {
    const finalReceiptId = dbReceiptId || ('rec_' + idempotencyKey.replace(/-/g, '').slice(0, 12));

    console.info(JSON.stringify({
      event: 'submission_persisted',
      kind,
      status: 202,
      receipt_id: finalReceiptId,
      automation_delivered: automationDelivered,
      db_delivered: Boolean(dbReceiptId),
      duration_ms: Date.now() - startTime,
    }));

    return respond(202, {
      status: 'accepted',
      receiptId: finalReceiptId,
      message: 'Brief securely received.',
    });
  }

  // Truthful failure response: If neither automation nor database was reached, reject cleanly
  return respond(503, {
    status: 'unavailable',
    message: automationError || 'Secure transmission service is temporarily unavailable. Please download your brief locally.',
  });
} catch (err: any) {
    console.error(JSON.stringify({
      event: 'submission_exception',
      kind,
      error_name: err?.name,
      error_message: err?.message,
      error_cause: err?.cause ? (err.cause.message || String(err.cause)) : null,
      stack: err?.stack,
      duration_ms: Date.now() - startTime,
    }));

    return respond(503, {
      status: 'unavailable',
      message: 'Unable to complete transmission. Your brief is preserved below.',
    });
  }
}

export default async function handler(reqOrEvent: any, context?: any): Promise<any> {
  // If invoked in Lambda compatibility mode (event, context)
  if (reqOrEvent && (reqOrEvent.httpMethod || !reqOrEvent.headers?.get)) {
    const method = reqOrEvent.httpMethod || 'POST';
    const headers = new Headers();
    if (reqOrEvent.headers && typeof reqOrEvent.headers === 'object') {
      for (const [k, v] of Object.entries(reqOrEvent.headers)) {
        if (v !== undefined) headers.set(k, String(v));
      }
    }
    const host = headers.get('host') || 'localhost';
    const protocol = headers.get('x-forwarded-proto') || 'http';
    const rawPath = reqOrEvent.path || '/';
    const url = new URL(`${protocol}://${host}${rawPath}`);
    if (reqOrEvent.queryStringParameters) {
      for (const [k, v] of Object.entries(reqOrEvent.queryStringParameters)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }
    const init: RequestInit = {
      method,
      headers,
    };
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS' && reqOrEvent.body) {
      init.body = reqOrEvent.isBase64Encoded
        ? Buffer.from(reqOrEvent.body, 'base64')
        : reqOrEvent.body;
    }
    const webReq = new Request(url.toString(), init);
    const webRes = await coreHandler(webReq, context);
    const resHeaders: Record<string, string> = {};
    webRes.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });
    const resBody = await webRes.text();
    return {
      statusCode: webRes.status,
      headers: resHeaders,
      body: resBody,
    };
  }

  // Standard Web Request/Response mode
  return coreHandler(reqOrEvent, context);
}

export { handler };
