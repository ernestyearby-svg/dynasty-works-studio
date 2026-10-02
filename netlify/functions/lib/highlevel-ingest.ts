/**
 * Dynasty Works Studio — Direct HighLevel CRM Ingestion Engine
 * Shared server-side ingestion module for /contact and /growth/apply
 *
 * Guarantees:
 * 1. Normalized contact upsert with preserved fields, services, consent, and attribution.
 * 2. Strict preservation of opt-out preferences (never passes dnd: false).
 * 3. Supported LeadConnector V2 API endpoints with documented headers:
 *    - Authorization: Bearer <token>
 *    - Version: 2021-07-28
 * 4. Eventual-consistency search followed by transactional opportunity creation.
 * 5. OPPORTUNITY_NO_DUPLICATE treated as success ONLY after confirming matching existing opportunity.
 * 6. Broad error suppression strictly prohibited: 401, 403, 422, 429, 500 throw authentic errors.
 * 7. Zero secret exposure in browser code, logs, or error responses.
 */

import { BUILD_INFO } from './build-info';

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
  deliveredVia: 'highlevel_direct';
  contactId?: string;
  opportunityId?: string;
  duplicatePrevented: boolean;
  action: 'opportunity_created' | 'opportunity_reused_search' | 'opportunity_reused_confirmed';
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

  if (!apiKey) {
    throw new HighLevelIngestionError(
      503,
      'Direct HighLevel integration credential is not configured. HIGHLEVEL_API_KEY must be set in server environment variables.',
      'CONFIG_MISSING'
    );
  }

  const cleanApiKey = apiKey.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');

  return ingestDirectToHighLevel(payload, { apiKey: cleanApiKey, locationId, pipelineId, stageId });
}

/**
 * Direct HighLevel API Ingestion via LeadConnector V2
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
  // Prevent test-triggered outbound messages:
  // For verified test contacts, explicitly set dnd: true so HighLevel workflows never dispatch outbound emails or SMS.
  // For legitimate prospects, we strictly omit dnd so existing opt-out preferences are never overwritten.
  if (payload.is_test) {
    contactUpsertBody.dnd = true;
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
    const searchUrl = `https://services.leadconnectorhq.com/opportunities/search?location_id=${encodeURIComponent(
      locationId
    )}&pipeline_id=${encodeURIComponent(pipelineId)}&contact_id=${encodeURIComponent(contactId)}`;

    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
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
        Version: '2021-07-28',
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
          `https://services.leadconnectorhq.com/opportunities/search?location_id=${encodeURIComponent(
            locationId
          )}&pipeline_id=${encodeURIComponent(pipelineId)}&contact_id=${encodeURIComponent(contactId)}`,
          {
            headers: { Authorization: `Bearer ${apiKey}`, Version: '2021-07-28' },
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
 * Read-Only HighLevel Credential Verification Probe
 * Executes a GET request against LeadConnector V2 to verify credential validity
 * without creating or modifying any CRM contacts or opportunities.
 */
export async function verifyHighLevelCredentialReadOnly(): Promise<{
  status: number;
  ok: boolean;
  sanitizedMessage: string;
  endpoint: string;
  hasCredential: boolean;
  runtimeContext: string;
  authScheme: string;
}> {
  const apiKey =
    process.env.HIGHLEVEL_API_KEY ||
    process.env.GHL_API_KEY ||
    process.env.LEADCONNECTOR_API_KEY ||
    process.env.DWS_HIGHLEVEL_API_KEY;

  const runtimeContext = process.env.CONTEXT || BUILD_INFO.context || 'deploy-preview';
  const deployId = process.env.DEPLOY_ID || BUILD_INFO.deployId;

  if (!apiKey) {
    return {
      status: 503,
      ok: false,
      sanitizedMessage: 'CONFIG_MISSING: HIGHLEVEL_API_KEY not set in runtime environment.',
      endpoint: 'none',
      hasCredential: false,
      runtimeContext,
      deployId,
      authScheme: 'none',
    };
  }

  const cleanApiKey = apiKey.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
  const locationId = process.env.HIGHLEVEL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const endpoint = `https://services.leadconnectorhq.com/locations/${encodeURIComponent(locationId)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        Version: '2021-07-28',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const bodyText = await res.text();
    let parsed: any = {};
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      parsed = { raw: bodyText.slice(0, 200) };
    }

    return {
      status: res.status,
      ok: res.ok,
      sanitizedMessage:
        parsed.message ||
        parsed.msg ||
        (res.ok ? 'Credential verified successfully.' : `LeadConnector V2 returned HTTP ${res.status}`),
      endpoint: '/locations/{locationId}',
      hasCredential: true,
      runtimeContext,
      deployId,
      authScheme: 'Bearer (LeadConnector V2)',
    };
  } catch (err: any) {
    clearTimeout(timeout);
    return {
      status: 500,
      ok: false,
      sanitizedMessage: `Network error during read-only probe: ${err.message}`,
      endpoint: '/locations/{locationId}',
      hasCredential: true,
      runtimeContext,
      deployId,
      authScheme: 'Bearer (LeadConnector V2)',
    };
  }
}
