import { z } from 'zod';
import crypto from 'node:crypto';
import { generateRoadmap, type RoadmapItem } from '../../domain/lib/recommendation-engine';
import { normalizeBuild, emptyCompanyBuild } from '../../domain/lib/company-builder';
import { businessTypes } from '../../domain/data/company-builder';
import { businessStages } from '../../domain/data/service-catalog';

// Defensive Response Headers
const DEFENSIVE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Type': 'application/json',
};

function reply(status: number, body: Record<string, unknown>, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...DEFENSIVE_HEADERS,
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
    'http://localhost:5202',
    'http://127.0.0.1:5202',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  const allowed = new Set([...defaults, ...configured]);
  return allowed.has(origin);
}

// Common Validation Schemas
const commonEnvelopeSchema = z.object({
  version: z.literal(1),
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

export default async function handler(request: Request): Promise<Response> {
  const startTime = Date.now();

  // 1. HTTP Method Check
  if (request.method !== 'POST') {
    return reply(405, { status: 'rejected', message: 'Method Not Allowed' }, { Allow: 'POST' });
  }

  // 2. Feature Flag Gate (Controlled Phase 2E.1 Operation)
  if (process.env.INQUIRY_SUBMISSIONS_ENABLED !== 'true') {
    return reply(503, {
      status: 'not_configured',
      message: 'Secure transmission endpoint is not enabled. Local export and brief download remain available.',
    });
  }

  // 3. Origin Allowlist Validation
  const origin = request.headers.get('origin');
  if (origin && !isOriginAllowed(origin)) {
    return reply(403, { status: 'rejected', message: 'Origin Not Allowed' });
  }

  // 4. Content-Type Validation
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return reply(415, { status: 'rejected', message: 'Expected Content-Type: application/json' });
  }

  // 5. Payload Size Bound (Max 48KB)
  const MAX_BYTES = 48000;
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BYTES) {
    return reply(413, { status: 'rejected', message: 'Payload Too Large' });
  }

  let rawBodyText = '';
  try {
    const rawBuffer = await request.arrayBuffer();
    if (rawBuffer.byteLength > MAX_BYTES) {
      return reply(413, { status: 'rejected', message: 'Payload Too Large' });
    }
    rawBodyText = new TextDecoder('utf-8', { fatal: true }).decode(rawBuffer);
  } catch {
    return reply(400, { status: 'rejected', message: 'Malformed request body' });
  }

  let body: any;
  try {
    body = JSON.parse(rawBodyText);
  } catch {
    return reply(400, { status: 'rejected', message: 'Invalid JSON' });
  }

  // 6. Common Envelope Validation (Idempotency, Consent, Honeypot)
  const envelopeResult = commonEnvelopeSchema.safeParse(body);
  if (!envelopeResult.success) {
    return reply(400, {
      status: 'rejected',
      message: 'Invalid submission envelope or honeypot triggered',
      errors: envelopeResult.error.flatten().fieldErrors,
    });
  }

  const { idempotencyKey } = envelopeResult.data;

  // 7. Resolve Submission Kind
  const url = new URL(request.url);
  const kindParam = url.searchParams.get('kind') || body.kind;
  if (kindParam !== 'builder' && kindParam !== 'blueprint' && kindParam !== 'general') {
    return reply(400, { status: 'rejected', message: 'Invalid or missing submission kind parameter' });
  }

  const kind: 'builder' | 'blueprint' | 'general' = kindParam;

  // 8. Type-Specific Validation & Recomputation
  let validatedData: any;
  let recomputedDetail: any;

  if (kind === 'builder') {
    const parseResult = builderPayloadSchema.safeParse(body.data);
    if (!parseResult.success) {
      return reply(422, {
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
      return reply(422, {
        status: 'validation_error',
        message: 'Please review required Founder Blueprint fields.',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    validatedData = parseResult.data;
    recomputedDetail = validatedData;
  } else {
    const parseResult = generalPayloadSchema.safeParse(body.data);
    if (!parseResult.success) {
      return reply(422, {
        status: 'validation_error',
        message: 'Please review required Contact fields.',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    validatedData = parseResult.data;
    recomputedDetail = validatedData;
  }

  // 9. Ephemeral Privacy-Preserving Rate Limit Hash
  const rawIp =
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('client-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  const pepper = process.env.RATE_LIMIT_PEPPER || 'dws_static_dev_pepper';
  const ipHash = crypto.createHash('sha256').update(rawIp + pepper).digest('hex');

  // 10. Payload SHA-256 Hash
  const payloadHash = crypto.createHash('sha256').update(JSON.stringify(recomputedDetail)).digest('hex');

  // 11. Database RPC Execution
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return reply(503, {
      status: 'not_configured',
      message: 'Database connection configuration is missing or incomplete.',
    });
  }

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

    if (!rpcResponse.ok) {
      const errText = await rpcResponse.text();

      // Check for custom Postgres exception codes
      if (errText.includes('RATE_LIMITED') || rpcResponse.status === 429) {
        return reply(429, {
          status: 'rate_limited',
          message: 'Submission frequency threshold reached. Please try again in a few minutes.',
        }, { 'Retry-After': '600' });
      }

      if (errText.includes('IDEMPOTENCY_CONFLICT') || rpcResponse.status === 409) {
        return reply(409, {
          status: 'conflict',
          message: 'This request key was previously used with differing information. Please submit a new brief.',
        });
      }

      console.error(JSON.stringify({
        event: 'db_rpc_error',
        kind,
        status: rpcResponse.status,
        duration_ms: Date.now() - startTime,
      }));

      return reply(503, {
        status: 'unavailable',
        message: 'Secure transmission service is temporarily unavailable. Please download your brief locally.',
      });
    }

    const rpcResult: any = await rpcResponse.json();
    const row = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult;
    const receiptId = row?.receipt_id;

    if (!receiptId) {
      throw new Error('Database transaction did not return a confirmed receipt ID.');
    }

    // Structured PII-Redacted Logging
    console.info(JSON.stringify({
      event: 'submission_persisted',
      kind,
      status: 202,
      receipt_id: receiptId,
      replay: row?.status === 'replay',
      duration_ms: Date.now() - startTime,
    }));

    return reply(202, {
      status: 'accepted',
      receiptId,
      message: 'Brief securely received.',
    });
  } catch (err: any) {
    console.error(JSON.stringify({
      event: 'submission_exception',
      kind,
      error_name: err?.name,
      duration_ms: Date.now() - startTime,
    }));

    return reply(503, {
      status: 'unavailable',
      message: 'Unable to complete transmission. Your brief is preserved below.',
    });
  }
}
