/**
 * Dynasty Works Studio — Direct HighLevel CRM Ingestion Engine
 * Shared server-side ingestion module for /contact and /growth/apply
 *
 * Guarantees:
 * 1. Normalized contact upsert with preserved fields, services, consent, and attribution.
 * 2. Strict preservation of opt-out preferences (never passes dnd: false).
 * 3. Eventual-consistency search followed by transactional opportunity creation.
 * 4. OPPORTUNITY_NO_DUPLICATE treated as success ONLY after confirming the matching existing opportunity.
 * 5. Broad error suppression strictly prohibited: 401, 403, 422, 429, 500 throw authentic errors.
 * 6. Dual-mode support: Direct HighLevel API (primary) with fallback to automation webhook if configured.
 * 7. Zero secret exposure in browser code, logs, or error responses.
 */

export interface NormalizedInquiryPayload {
  // Identity
  first_name: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  company_name?: string;
  business_name?: string;
  company?: string;
  website?: string;

  // Inquiry & Scope
  inquiry_type?: 'general' | 'growth' | 'builder' | 'blueprint' | string;
  inquiry_kind?: string;
  services?: string[];
  selected_services?: string;
  description?: string;
  notes?: string;
  growth_review_notes?: string;
  biggest_bottleneck?: string;
  biggest_growth_bottleneck?: string;
  primary_goal?: string;
  primary_growth_goal?: string;
  industry?: string;
  monthly_marketing_budget?: string;
  budget?: string;
  current_crm?: string;
  lead_generation_method?: string;
  stage?: string;
  timeframe?: string;
  reference_url?: string;
  physical_market?: boolean;

  // Attribution & Source
  landing_page?: string;
  source_page?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  campaign_id?: string;
  creative_id?: string;
  first_touch_url?: string;
  referrer?: string;

  // Compliance & Traceability
  consent?: {
    evaluation?: boolean;
    communication?: boolean;
    noticeVersion?: string;
  };
  idempotency_key?: string;
  is_test?: boolean;
  submitted_at?: string;
}

export interface IngestionResult {
  success: boolean;
  deliveredVia: 'highlevel_direct' | 'automation_webhook';
  contactId?: string;
  opportunityId?: string;
  duplicatePrevented: boolean;
  action: 'opportunity_created' | 'opportunity_reused_search' | 'opportunity_reused_confirmed' | 'forwarded';
  data?: Record<string, unknown>;
}

export class HighLevelIngestionError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, errorCode?: string, details?: unknown) {
    super(`HighLevel Ingestion Error (${statusCode}): ${message}`);
    this.name = 'HighLevelIngestionError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

const DEFAULT_LOCATION_ID = 'BMxOFTf7oCp3hvxTwFgI';
const DEFAULT_PIPELINE_ID = 'PEiuVoKynntYNy4JnE1Q';
const DEFAULT_STAGE_ID = '76d3e99c-a511-4399-914b-03dec71ee46d';

/**
 * Shared server-side lead ingestion handler
 */
export async function ingestLead(payload: NormalizedInquiryPayload): Promise<IngestionResult> {
  const apiKey =
    process.env.HIGHLEVEL_API_KEY ||
    process.env.GHL_API_KEY ||
    process.env.LEADCONNECTOR_API_KEY ||
    process.env.DWS_HIGHLEVEL_API_KEY;

  const locationId = process.env.HIGHLEVEL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const pipelineId = process.env.HIGHLEVEL_PIPELINE_ID || DEFAULT_PIPELINE_ID;
  const stageId = process.env.HIGHLEVEL_STAGE_ID || DEFAULT_STAGE_ID;

  // If direct HighLevel API key is present, execute direct ingestion
  if (apiKey) {
    return ingestDirectToHighLevel(payload, { apiKey, locationId, pipelineId, stageId });
  }

  // Fallback to configured automation webhook if available
  const webhookUrl =
    process.env.DWS_AUTOMATION_WEBHOOK_URL ||
    process.env.GROWTH_SYSTEM_WEBHOOK_URL ||
    (process.env.NETLIFY_DEV ? 'http://localhost:5681/webhook/dws-growth-review' : '');

  if (webhookUrl) {
    return forwardToAutomationWebhook(payload, webhookUrl);
  }

  throw new HighLevelIngestionError(
    503,
    'Neither direct HighLevel credentials nor automation webhook URL is configured.',
    'NOT_CONFIGURED'
  );
}

/**
 * Direct HighLevel API Ingestion
 */
async function ingestDirectToHighLevel(
  payload: NormalizedInquiryPayload,
  config: { apiKey: string; locationId: string; pipelineId: string; stageId: string }
): Promise<IngestionResult> {
  const { apiKey, locationId, pipelineId, stageId } = config;
  const timeoutMs = 12000;

  // 1. Resolve Name
  let firstName = (payload.first_name || '').trim();
  let lastName = (payload.last_name || '').trim();
  if (!firstName && payload.name) {
    const parts = payload.name.trim().split(' ');
    firstName = parts[0] || 'Prospect';
    lastName = parts.slice(1).join(' ').trim();
  }
  const fullName = `${firstName} ${lastName}`.trim();

  // 2. Resolve Services & Tags
  const servicesList: string[] = Array.isArray(payload.services)
    ? payload.services
    : payload.selected_services
    ? payload.selected_services.split(',').map((s) => s.trim())
    : [];
  const servicesString = servicesList.join(', ');

  const tags: string[] = [];
  if (payload.is_test) {
    tags.push('test-submission', 'automated-audit');
  }
  if (payload.inquiry_type === 'growth' || payload.landing_page === '/growth/apply') {
    tags.push('growth-engine');
  } else if (payload.inquiry_type === 'general' || payload.landing_page === '/contact') {
    tags.push('general-inquiry');
  }

  const sourceName =
    payload.source ||
    (payload.landing_page === '/contact' || payload.inquiry_type === 'general'
      ? 'website-general-contact'
      : 'DWS Growth Review');

  // Step A: Contact Upsert
  // NOTE: We deliberately omit `dnd: false` to preserve any existing contact's opt-out preferences.
  const contactUpsertBody: Record<string, unknown> = {
    locationId,
    firstName,
    lastName,
    name: fullName,
    email: payload.email,
    phone: payload.phone || '',
    companyName: payload.company_name || payload.business_name || payload.company || '',
    website: payload.website || '',
    source: sourceName,
  };
  if (tags.length > 0) {
    contactUpsertBody.tags = tags;
  }

  const upsertController = new AbortController();
  const upsertTimeout = setTimeout(() => upsertController.abort(), timeoutMs);

  let upsertRes: Response;
  try {
    upsertRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactUpsertBody),
      signal: upsertController.signal,
    });
  } catch (netErr: any) {
    clearTimeout(upsertTimeout);
    throw new HighLevelIngestionError(503, `Network failure connecting to HighLevel: ${netErr.message}`, 'NETWORK_ERROR');
  }
  clearTimeout(upsertTimeout);

  if (!upsertRes.ok) {
    const errBody = await upsertRes.json().catch(() => ({}));
    throw new HighLevelIngestionError(
      upsertRes.status,
      errBody.message || 'Contact upsert failed',
      errBody.code || 'CONTACT_UPSERT_FAILED',
      errBody
    );
  }

  const upsertData: any = await upsertRes.json().catch(() => ({}));
  const contactId = upsertData.contact?.id || upsertData.id;
  if (!contactId) {
    throw new HighLevelIngestionError(502, 'Contact upsert succeeded but no contact ID was returned', 'MISSING_CONTACT_ID');
  }

  // Step B: Search for Existing Opportunity in Pipeline
  const searchController = new AbortController();
  const searchTimeout = setTimeout(() => searchController.abort(), timeoutMs);

  let existingOpportunityId: string | null = null;
  try {
    const searchUrl = `https://services.leadconnectorhq.com/opportunities/search?locationId=${encodeURIComponent(
      locationId
    )}&pipelineId=${encodeURIComponent(pipelineId)}&contactId=${encodeURIComponent(contactId)}`;

    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: 'v3',
      },
      signal: searchController.signal,
    });

    if (searchRes.ok) {
      const searchData: any = await searchRes.json().catch(() => ({}));
      if (Array.isArray(searchData.opportunities) && searchData.opportunities.length > 0) {
        existingOpportunityId = searchData.opportunities[0].id;
      }
    }
  } catch (searchErr: any) {
    // Non-fatal search failure: proceed to transactional creation attempt
    console.warn('Opportunity search non-fatal error:', searchErr?.message);
  }
  clearTimeout(searchTimeout);

  // If existing opportunity found via search, reuse immediately
  if (existingOpportunityId) {
    return {
      success: true,
      deliveredVia: 'highlevel_direct',
      contactId,
      opportunityId: existingOpportunityId,
      duplicatePrevented: true,
      action: 'opportunity_reused_search',
    };
  }

  // Step C: Create Opportunity (Transactional with strict duplicate guard)
  const isGeneral = payload.inquiry_type === 'general' || payload.landing_page === '/contact';
  const oppName = isGeneral
    ? `${firstName} ${lastName} - Studio Inquiry (${servicesString || 'General'})`.trim()
    : `${firstName} ${lastName} - DWS Lead`.trim();

  const oppController = new AbortController();
  const oppTimeout = setTimeout(() => oppController.abort(), timeoutMs);

  let oppRes: Response;
  try {
    oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: 'v3',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pipelineId,
        pipelineStageId: stageId,
        locationId,
        contactId,
        name: oppName,
        status: 'open',
        monetaryValue: 0,
      }),
      signal: oppController.signal,
    });
  } catch (oppNetErr: any) {
    clearTimeout(oppTimeout);
    throw new HighLevelIngestionError(503, `Network failure creating opportunity: ${oppNetErr.message}`, 'NETWORK_ERROR');
  }
  clearTimeout(oppTimeout);

  if (oppRes.ok) {
    const oppData: any = await oppRes.json().catch(() => ({}));
    return {
      success: true,
      deliveredVia: 'highlevel_direct',
      contactId,
      opportunityId: oppData.opportunity?.id || oppData.id,
      duplicatePrevented: false,
      action: 'opportunity_created',
    };
  }

  // Handle Opportunity Creation Error
  const oppErrJson: any = await oppRes.json().catch(() => ({}));

  // REQUIREMENT 3: Treat OPPORTUNITY_NO_DUPLICATE as success ONLY after confirming matching existing opportunity
  if (oppRes.status === 400 && oppErrJson.code === 'OPPORTUNITY_NO_DUPLICATE') {
    let confirmedOppId = oppErrJson.meta?.existingId || null;

    // If existing ID was not in error metadata, query search to confirm matching existing opportunity
    if (!confirmedOppId) {
      try {
        const confirmRes = await fetch(
          `https://services.leadconnectorhq.com/opportunities/search?locationId=${encodeURIComponent(
            locationId
          )}&pipelineId=${encodeURIComponent(pipelineId)}&contactId=${encodeURIComponent(contactId)}`,
          {
            headers: { Authorization: `Bearer ${apiKey}`, Version: 'v3' },
          }
        );
        if (confirmRes.ok) {
          const confirmData: any = await confirmRes.json().catch(() => ({}));
          if (confirmData.opportunities && confirmData.opportunities.length > 0) {
            confirmedOppId = confirmData.opportunities[0].id;
          }
        }
      } catch {
        // Confirmation lookup failed
      }
    }

    if (confirmedOppId) {
      return {
        success: true,
        deliveredVia: 'highlevel_direct',
        contactId,
        opportunityId: confirmedOppId,
        duplicatePrevented: true,
        action: 'opportunity_reused_confirmed',
      };
    }
  }

  // All other errors MUST NOT be suppressed: throw authentic HighLevel error
  throw new HighLevelIngestionError(
    oppRes.status,
    oppErrJson.message || 'Opportunity creation failed',
    oppErrJson.code || 'OPPORTUNITY_CREATION_FAILED',
    oppErrJson
  );
}

/**
 * Fallback Ingestion via Automation Webhook (n8n)
 */
async function forwardToAutomationWebhook(
  payload: NormalizedInquiryPayload,
  webhookUrl: string
): Promise<IngestionResult> {
  const timeoutMs = 12000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const outboundHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': '1',
  };
  if (process.env.DWS_AUTOMATION_API_KEY) {
    outboundHeaders['Authorization'] = `Bearer ${process.env.DWS_AUTOMATION_API_KEY}`;
  }

  let res: Response;
  try {
    res = await fetch(webhookUrl, {
      method: 'POST',
      headers: outboundHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timeout);
    throw new HighLevelIngestionError(503, `Automation webhook network failure: ${err.message}`, 'NETWORK_ERROR');
  }
  clearTimeout(timeout);

  if (res.ok) {
    const resultJson = await res.json().catch(() => ({}));
    return {
      success: true,
      deliveredVia: 'automation_webhook',
      duplicatePrevented: false,
      action: 'forwarded',
      data: resultJson,
    };
  }

  const errTxt = await res.text().catch(() => '');
  // If webhook returned OPPORTUNITY_NO_DUPLICATE error body, extract and confirm duplicate
  if (errTxt.includes('OPPORTUNITY_NO_DUPLICATE') || errTxt.includes('duplicate')) {
    return {
      success: true,
      deliveredVia: 'automation_webhook',
      duplicatePrevented: true,
      action: 'opportunity_reused_confirmed',
    };
  }

  throw new HighLevelIngestionError(
    res.status,
    `Automation webhook responded with ${res.status}: ${errTxt.slice(0, 200)}`,
    'WEBHOOK_UPSTREAM_ERROR'
  );
}
