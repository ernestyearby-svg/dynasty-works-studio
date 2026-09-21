/**
 * Dynasty Works Studio — Secure Submission Client Layer
 * Phase 2E.3 Preview Conversion Integration
 *
 * Implements client-side transmission to /api/submissions/:kind
 * with idempotency key generation, explicit consent envelope,
 * honeypot shielding, typed error handling, and offline fallback retention.
 */

export type SubmissionKind = 'builder' | 'blueprint' | 'general';

export interface SubmissionEnvelope<T = Record<string, unknown>> {
  version: 1;
  idempotencyKey: string;
  consent: {
    evaluation: true;
    communication: true;
    noticeVersion: string;
  };
  honeypot: string;
  botToken?: string;
  data: T;
}

export interface SubmissionSuccess {
  status: 'accepted';
  receiptId: string;
  message: string;
}

export interface SubmissionFailure {
  status:
    | 'rate_limited'
    | 'validation_error'
    | 'not_configured'
    | 'unavailable'
    | 'conflict'
    | 'rejected'
    | 'network_error';
  message: string;
  errors?: Record<string, string[]>;
  retryAfter?: number;
}

export type SubmissionResult =
  | { success: true; data: SubmissionSuccess; httpStatus: number }
  | { success: false; error: SubmissionFailure; httpStatus: number };

export interface SubmitOptions {
  idempotencyKey?: string;
  noticeVersion?: string;
  honeypot?: string;
  botToken?: string;
  baseUrl?: string;
}

/**
 * Generate standard UUID v4 for idempotency tracking.
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Submit an inquiry payload to the serverless conversion endpoint.
 *
 * Preserves idempotency key across retries of the same submission attempt.
 * Translates HTTP status codes into structured client outcomes:
 * - 202 Accepted: returns confirmed opaque receipt ID
 * - 429 Rate Limited: extracts Retry-After
 * - 422 Validation Error: returns field-level validation errors
 * - 409 Conflict: idempotency key collision with different data
 * - 503 Not Configured / Unavailable: signals caller to use local fallback
 * - Network failures: safely caught and returned as network_error
 */
export async function submitInquiry<T extends Record<string, unknown>>(
  kind: SubmissionKind,
  data: T,
  options: SubmitOptions = {}
): Promise<SubmissionResult> {
  const idempotencyKey = options.idempotencyKey || generateIdempotencyKey();
  const noticeVersion = options.noticeVersion || 'dws-eval-v1';
  const honeypot = options.honeypot || '';

  const envelope: SubmissionEnvelope<T> = {
    version: 1,
    idempotencyKey,
    consent: {
      evaluation: true,
      communication: true,
      noticeVersion,
    },
    honeypot,
    data,
  };

  if (options.botToken) {
    envelope.botToken = options.botToken;
  }

  const baseUrl = options.baseUrl ?? '';
  const url = `${baseUrl}/api/submissions/${kind}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(envelope),
    });

    const httpStatus = response.status;
    let json: any = null;

    try {
      json = await response.json();
    } catch {
      // Non-JSON response (e.g., gateway timeout or HTML 500)
    }

    if (httpStatus === 202 && json?.status === 'accepted' && json?.receiptId) {
      return {
        success: true,
        data: {
          status: 'accepted',
          receiptId: String(json.receiptId),
          message: json.message || 'Brief securely received.',
        },
        httpStatus,
      };
    }

    if (httpStatus === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 600;
      return {
        success: false,
        error: {
          status: 'rate_limited',
          message: json?.message || 'Submission frequency threshold reached. Please try again in a few minutes.',
          retryAfter: isNaN(retryAfter) ? 600 : retryAfter,
        },
        httpStatus,
      };
    }

    if (httpStatus === 422) {
      return {
        success: false,
        error: {
          status: 'validation_error',
          message: json?.message || 'Please review required fields before submitting.',
          errors: json?.errors,
        },
        httpStatus,
      };
    }

    if (httpStatus === 409) {
      return {
        success: false,
        error: {
          status: 'conflict',
          message:
            json?.message ||
            'This request key was previously used with differing information. Please submit a new brief.',
        },
        httpStatus,
      };
    }

    if (httpStatus === 503) {
      return {
        success: false,
        error: {
          status: json?.status === 'not_configured' ? 'not_configured' : 'unavailable',
          message:
            json?.message ||
            'Secure transmission endpoint is not enabled. Local export and brief download remain available.',
        },
        httpStatus,
      };
    }

    // Default error mapping for 400, 403, 405, 413, 500, etc.
    return {
      success: false,
      error: {
        status: 'rejected',
        message:
          json?.message ||
          (httpStatus === 413
            ? 'Payload Too Large'
            : httpStatus === 405
            ? 'Method Not Allowed'
            : 'Submission could not be processed. Your brief is preserved below.'),
        errors: json?.errors,
      },
      httpStatus,
    };
  } catch (err: any) {
    // Network errors (DNS failure, offline, connection reset)
    return {
      success: false,
      error: {
        status: 'network_error',
        message: 'Unable to connect to transmission endpoint. Your brief is preserved below for local download.',
      },
      httpStatus: 0,
    };
  }
}
