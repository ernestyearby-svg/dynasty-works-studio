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

function formatBuilderNotes(data: any, recomputed: any): string {
  const lines: string[] = [
    '=== DWS COMPANY BUILDER INTAKE ===',
    `Company: ${data.company || 'Not named yet'}`,
    `Business Type: ${data.businessType || 'General'}`,
    `Business Stage: ${data.businessStage || 'Exploring'}`,
    `Launch Timeline: ${data.launchTimeline || 'Exploring'}`,
    `Budget Range: ${data.budgetRange || 'Not provided'}`,
    `Existing Assets: ${Array.isArray(data.existingAssets) && data.existingAssets.length ? data.existingAssets.join(', ') : 'None'}`,
    `Selected Needs: ${Array.isArray(data.selectedNeeds) && data.selectedNeeds.length ? data.selectedNeeds.join(', ') : 'None'}`,
    `Ambition / Referral Notes: ${data.ambitionNotes || 'None'}`,
  ];
  if (recomputed) {
    lines.push('');
    lines.push('--- GENERATED ROADMAP RECOMMENDATION ---');
    if (recomputed.recommendedPackage) {
      lines.push(`Recommended Package: ${recomputed.recommendedPackage}`);
    }
    if (Array.isArray(recomputed.recomputedPhases) && recomputed.recomputedPhases.length) {
      lines.push(`Phases: ${recomputed.recomputedPhases.join(' -> ')}`);
    }
    if (Array.isArray(recomputed.recomputedServices) && recomputed.recomputedServices.length) {
      lines.push('Recommended Services:');
      for (const s of recomputed.recomputedServices) {
        lines.push(`- ${s.serviceId} (${s.timing}): ${s.reason}`);
      }
    }
  }
  return lines.join('\n');
}

function formatBlueprintNotes(data: any): string {
  const lines: string[] = [
    '=== DWS FOUNDER BLUEPRINT INTAKE ===',
    `Company: ${data.company || 'Not named yet'}`,
    `Business Type: ${data.businessType || 'General'}`,
    `Business Stage: ${data.businessStage || 'Exploring'}`,
    `Physical Market: ${data.physicalMarket ? 'Yes' : 'No'}`,
    `Primary Market: ${data.primaryMarket || 'General'}`,
    `Target Launch: ${data.targetLaunch || 'Exploring'}`,
    '',
    `Idea Description:\n${data.ideaDescription || 'Not provided'}`,
    '',
    `Problem Description:\n${data.problemDescription || 'Not provided'}`,
    '',
    `Target Customer:\n${data.targetCustomer || 'Not provided'}`,
    '',
    `Existing Assets:\n${data.existingAssets || 'None'}`,
    '',
    `Requested Needs:\n${data.requestedNeeds || 'Not provided'}`,
    '',
    `Distribution Goals:\n${data.distributionGoals || 'None'}`,
    '',
    `Competitors:\n${data.competitors || 'None'}`,
    '',
    `Brand Assets:\n${data.brandAssets || 'None'}`,
    '',
    `Digital Assets:\n${data.digitalAssets || 'None'}`,
    '',
    `Company Documents:\n${data.companyDocuments || 'None'}`,
    '',
    `Biggest Question / Unsolved Challenge:\n${data.biggestQuestion || 'Not provided'}`,
  ];
  if (Array.isArray(data.references) && data.references.length) {
    lines.push('');
    lines.push(`References:\n${data.references.join('\n')}`);
  }
  return lines.join('\n');
}

function formatGeneralNotes(data: any): string {
  return [
    '=== DWS PROJECT BRIEF INTAKE ===',
    `Company: ${data.company || 'Not named yet'}`,
    `Website: ${data.website || 'Not provided'}`,
    `Stage: ${data.stage || 'Not provided'}`,
    `Budget: ${data.budget || 'Not provided'}`,
    `Timeframe: ${data.timeframe || 'Not provided'}`,
    `Physical Market: ${data.physicalMarket ? 'Yes' : 'No'}`,
    `Reference URL: ${data.referenceUrl || 'Not provided'}`,
    `Selected Services: ${Array.isArray(data.services) ? data.services.join(', ') : 'Not provided'}`,
    '',
    `Project Description:\n${data.description || 'Not provided'}`,
  ].join('\n');
}

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
    'http://localhost:8888',
    'http://127.0.0.1:8888',
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
  businessType: z.string().trim().min(1).max(100).default('General'),
  businessStage: z.string().trim().max(100).optional().default('Idea'),
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
  businessType: z.string().trim().min(1).max(100).default('General'),
  businessStage: z.string().trim().min(1).max(100).default('Idea'),
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
  if (process.env.INQUIRY_SUBMISSIONS_ENABLED === 'false') {
    return respond(503, {
      status: 'not_configured',
      message: "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.",
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
    // 11. Lead Ingestion CRM Delivery (Server-side Forward to Production Webhook)
    const isTest = Boolean(
      isTestEmail(validatedData.email) ||
      process.env.DWS_TEST_MODE === 'true' ||
      request.headers.get('x-dws-test') === 'true'
    );

    let automationDelivered = false;
    let automationError = '';

    const fullName = validatedData.name ? String(validatedData.name).trim() : 'Prospect';
    const spaceIdx = fullName.indexOf(' ');
    const firstName = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
    const lastName = spaceIdx > 0 ? fullName.slice(spaceIdx + 1).trim() : '';

    const leadSourceMap = {
      builder: 'DWS Company Builder',
      blueprint: 'DWS Founder Blueprint',
      general: 'DWS Project Brief',
    } as const;

    const leadSource = leadSourceMap[kind];
    let formattedNotes = '';
    if (kind === 'builder') {
      formattedNotes = formatBuilderNotes(validatedData, recomputedDetail);
    } else if (kind === 'blueprint') {
      formattedNotes = formatBlueprintNotes(validatedData);
    } else {
      formattedNotes = formatGeneralNotes(validatedData);
    }

    const referer = request.headers.get('referer') || '';
    let utmSource = '';
    let utmMedium = '';
    let utmCampaign = '';
    try {
      if (referer) {
        const refUrl = new URL(referer);
        utmSource = refUrl.searchParams.get('utm_source') || '';
        utmMedium = refUrl.searchParams.get('utm_medium') || '';
        utmCampaign = refUrl.searchParams.get('utm_campaign') || '';
      }
    } catch {}

    const automationPayload = {
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      business_name: validatedData.company,
      company_name: validatedData.company,
      company: validatedData.company,
      lead_source: leadSource,
      source: leadSource,
      email: validatedData.email.toLowerCase().trim(),
      phone: validatedData.phone || '',
      website: validatedData.website || '',
      industry: validatedData.businessType || validatedData.primaryMarket || (Array.isArray(validatedData.services) ? validatedData.services.join(', ') : '') || '',
      monthly_marketing_budget: validatedData.budget || validatedData.budgetRange || '',
      primary_goal: Array.isArray(validatedData.services) ? validatedData.services.join(', ') : (validatedData.requestedNeeds || validatedData.businessType || 'General Inquiry'),
      primary_growth_goal: Array.isArray(validatedData.services) ? validatedData.services.join(', ') : (validatedData.requestedNeeds || validatedData.businessType || 'General Inquiry'),
      current_crm: '',
      lead_generation_method: '',
      biggest_bottleneck: validatedData.biggestQuestion || validatedData.problemDescription || validatedData.description || '',
      biggest_growth_bottleneck: validatedData.biggestQuestion || validatedData.problemDescription || validatedData.description || '',
      notes: formattedNotes,
      growth_review_notes: formattedNotes,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: '',
      utm_term: '',
      landing_page: referer ? new URL(referer).pathname : (kind === 'builder' ? '/start-a-business/builder' : (kind === 'blueprint' ? '/founder-blueprint' : '/contact')),
      source_page: referer || (kind === 'builder' ? '/start-a-business/builder' : (kind === 'blueprint' ? '/founder-blueprint' : '/contact')),
      referrer: referer,
      first_touch_url: referer,
      campaign_id: '',
      creative_id: '',
      consent: body.consent,
      idempotency_key: idempotencyKey,
      is_test: isTest,
      submitted_at: new Date().toISOString(),
      raw_data: validatedData,
    };

    const webhookUrl = process.env.GROWTH_WEBHOOK_URL || 'https://automation.dynastyworksstudio.com/webhook/dws-growth-review';

    try {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Dynasty-Submissions-Forwarder/1.0',
        },
        body: JSON.stringify(automationPayload),
      });

      if (webhookRes.ok) {
        automationDelivered = true;
        console.info(JSON.stringify({
          event: 'crm_webhook_success',
          kind,
          leadSource,
          email: validatedData.email,
          status: webhookRes.status,
          duration_ms: Date.now() - startTime,
        }));
      } else {
        const errText = await webhookRes.text().catch(() => '');
        automationError = `Webhook responded with status ${webhookRes.status}`;
        console.error(JSON.stringify({
          event: 'crm_webhook_error',
          kind,
          leadSource,
          status: webhookRes.status,
          body: errText.slice(0, 300),
          duration_ms: Date.now() - startTime,
        }));
      }
    } catch (whErr: any) {
      automationError = whErr?.message || 'Webhook transmission failure';
      console.error(JSON.stringify({
        event: 'crm_webhook_exception',
        kind,
        leadSource,
        error: whErr?.message,
        duration_ms: Date.now() - startTime,
      }));
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
  // Require verified CRM automation delivery for submission acceptance.
  if (automationDelivered) {
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

  // Graceful failure response: If CRM delivery failed, reject cleanly with honest, user-safe error
  return respond(503, {
    status: 'unavailable',
    message: "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.",
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
      message: "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.",
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
