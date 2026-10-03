/**
 * Dynasty Works Studio — Meta Conversions API (CAPI) Server-Side Engine
 * 
 * Handles secure, compliant server-side event transmission directly to Meta Graph API.
 * Guarantees:
 * 1. Strict event gating: ONLY 'Lead' and 'Schedule' are dispatched.
 * 2. Deterministic SHA-256 hashing for email and phone numbers.
 * 3. Never hashes client IP, user agent, _fbp, or _fbc.
 * 4. Preserves browser-generated event_id for full CAPI browser+server deduplication.
 * 5. Zero token leakage in logs, error payloads, or client bundles.
 */

import crypto from 'node:crypto';

export const META_DATASET_ID = '1392597876378254';
export const META_GRAPH_VERSION = 'v21.0';
export const META_CAPI_ENDPOINT = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_DATASET_ID}/events`;

export type AllowedCapiEventName = 'Lead' | 'Schedule';

export interface MetaCapiEventParams {
  event_name: AllowedCapiEventName;
  event_id: string;
  event_time?: number; // Unix seconds
  event_source_url?: string;
  email?: string;
  phone?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  custom_data?: Record<string, unknown>;
  test_event_code?: string;
}

export interface MetaCapiResponse {
  success: boolean;
  events_received?: number;
  fbtrace_id?: string;
  messages?: string[];
  error?: {
    message: string;
    code?: number;
    error_subcode?: number;
  };
}

/**
 * Normalizes email: trim whitespace, convert to lowercase, SHA-256 hash.
 */
export function normalizeAndHashEmail(email?: string): string | null {
  if (!email || typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) return null;
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/**
 * Normalizes phone number: remove all non-digits.
 * If 10 digits (US/Canada format), prepend country code '1'.
 * Computes SHA-256 hash.
 */
export function normalizeAndHashPhone(phone?: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // Prepend US country code if standard 10-digit number
  if (digits.length === 10) {
    digits = '1' + digits;
  }

  return crypto.createHash('sha256').update(digits, 'utf8').digest('hex');
}

/**
 * Dispatches a server-side conversion event to Meta Conversions API.
 */
export async function sendMetaCapiEvent(
  params: MetaCapiEventParams
): Promise<MetaCapiResponse> {
  // 1. Strict event gating: Lead and Schedule only
  if (params.event_name !== 'Lead' && params.event_name !== 'Schedule') {
    return {
      success: false,
      error: {
        message: `Event "${params.event_name}" is not permitted. Only "Lead" and "Schedule" are dispatched to CAPI.`,
      },
    };
  }

  // 2. Validate event_id
  if (!params.event_id || typeof params.event_id !== 'string' || !params.event_id.trim()) {
    return {
      success: false,
      error: {
        message: 'Missing required event_id for Meta CAPI deduplication.',
      },
    };
  }

  // 3. Read access token from secure server environment variable
  const token =
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN;

  if (!token) {
    console.warn('[DWS Meta CAPI] META_CAPI_ACCESS_TOKEN not configured in server environment. Skipping transmission.');
    return {
      success: false,
      error: {
        message: 'META_CAPI_ACCESS_TOKEN not configured.',
      },
    };
  }

  // 4. Construct user_data with SHA-256 hashed identifiers and raw technical headers
  const userData: Record<string, unknown> = {};

  const hashedEmail = normalizeAndHashEmail(params.email);
  if (hashedEmail) {
    userData.em = [hashedEmail];
  }

  const hashedPhone = normalizeAndHashPhone(params.phone);
  if (hashedPhone) {
    userData.ph = [hashedPhone];
  }

  // Technical identifiers MUST NOT be hashed per Meta specifications
  if (params.client_ip_address) {
    userData.client_ip_address = params.client_ip_address;
  }
  if (params.client_user_agent) {
    userData.client_user_agent = params.client_user_agent;
  }
  if (params.fbp) {
    userData.fbp = params.fbp;
  }
  if (params.fbc) {
    userData.fbc = params.fbc;
  }

  const eventTime = params.event_time || Math.floor(Date.now() / 1000);
  const sourceUrl = params.event_source_url || 'https://dynastyworksstudio.com/';

  const singleEventData: Record<string, unknown> = {
    event_name: params.event_name,
    event_time: eventTime,
    event_source_url: sourceUrl,
    action_source: 'website',
    event_id: params.event_id.trim(),
    user_data: userData,
    ...(params.custom_data && Object.keys(params.custom_data).length > 0
      ? { custom_data: params.custom_data }
      : {}),
  };

  const testEventCode =
    params.test_event_code ||
    process.env.META_CAPI_TEST_EVENT_CODE;

  const requestBody: Record<string, unknown> = {
    data: [singleEventData],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const response = await fetch(META_CAPI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseJson: any = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errInfo = responseJson.error || {};
      console.error(
        `[DWS Meta CAPI] Request failed with HTTP ${response.status}:`,
        errInfo.message || 'Unknown Meta error',
        `fbtrace_id: ${errInfo.fbtrace_id || responseJson.fbtrace_id || 'none'}`
      );
      return {
        success: false,
        error: {
          message: errInfo.message || `Meta API returned HTTP ${response.status}`,
          code: errInfo.code,
          error_subcode: errInfo.error_subcode,
        },
        fbtrace_id: errInfo.fbtrace_id || responseJson.fbtrace_id,
      };
    }

    // Success response: never log token or raw user fields
    return {
      success: true,
      events_received: responseJson.events_received || 1,
      fbtrace_id: responseJson.fbtrace_id,
      messages: responseJson.messages || [],
    };
  } catch (netErr: any) {
    console.error('[DWS Meta CAPI] Network failure communicating with Meta Graph API:', netErr?.message);
    return {
      success: false,
      error: {
        message: `Network error: ${netErr?.message || 'Connection failed'}`,
      },
    };
  }
}
