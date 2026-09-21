/**
 * Dynasty Works Studio — Durable Notification Retry Runner
 * Phase 2E.4 Preview Notification Scaffold
 *
 * Scans for inquiries in PENDING or FAILED status eligible for retry,
 * attempts notification dispatch, and records outcome with exponential backoff.
 */

import {
  dispatchSubmissionNotifications,
  type SubmissionNotificationContext,
  type SubmissionKind,
  getNotificationTransport,
  type NotificationTransport,
} from './lib/notifications';

export interface RetryQueueResult {
  status: 'completed' | 'no_pending' | 'error';
  processed: number;
  succeeded: number;
  failed: number;
  exhausted: number;
  errors?: string[];
}

export interface ProcessRetryOptions {
  batchSize?: number;
  transport?: NotificationTransport;
  supabaseUrl?: string;
  supabaseKey?: string;
}

/**
 * Programmatic processor for the notification retry queue.
 * Can be run via scheduled function, administrative API, or test suites.
 */
export async function processRetryQueue(options: ProcessRetryOptions = {}): Promise<RetryQueueResult> {
  const supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL;
  const supabaseKey = options.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const batchSize = options.batchSize || 10;
  const transport = options.transport || getNotificationTransport();

  if (!supabaseUrl || !supabaseKey) {
    return {
      status: 'error',
      processed: 0,
      succeeded: 0,
      failed: 0,
      exhausted: 0,
      errors: ['Supabase service role credentials not configured'],
    };
  }

  // 1. Fetch retryable inquiries from PostgREST RPC
  const fetchRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_retryable_inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Profile': 'dynasty_private',
      'Content-Profile': 'dynasty_private',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ p_batch_size: batchSize }),
  });

  if (!fetchRes.ok) {
    const errText = await fetchRes.text();
    return {
      status: 'error',
      processed: 0,
      succeeded: 0,
      failed: 0,
      exhausted: 0,
      errors: [`Failed to query retryable inquiries: ${errText}`],
    };
  }

  const items: any[] = await fetchRes.json();
  if (!items || items.length === 0) {
    return {
      status: 'no_pending',
      processed: 0,
      succeeded: 0,
      failed: 0,
      exhausted: 0,
    };
  }

  let succeeded = 0;
  let failed = 0;
  let exhausted = 0;
  const errors: string[] = [];

  // 2. Process each overdue notification
  for (const item of items) {
    const ctx: SubmissionNotificationContext = {
      kind: item.inquiry_type as SubmissionKind,
      receiptId: item.receipt_id,
      createdAt: item.created_at || new Date().toISOString(),
      founderName: item.name,
      founderEmail: item.email,
      founderPhone: item.phone,
      companyName: item.company_name,
      detail: item.detail || {},
    };

    try {
      const result = await dispatchSubmissionNotifications(ctx, transport);

      const status = result.success ? 'SENT' : 'FAILED';
      const recordRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/record_notification_result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Profile': 'dynasty_private',
          'Content-Profile': 'dynasty_private',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          p_receipt_id: item.receipt_id,
          p_status: status,
          p_error: result.error || null,
          p_metadata: {
            retry_run_at: new Date().toISOString(),
            internal_provider: result.internal.provider,
            founder_provider: result.founder.provider,
          },
        }),
      });

      if (result.success) {
        succeeded++;
      } else {
        failed++;
        if (item.retry_count + 1 >= 5) {
          exhausted++;
        }
        if (result.error) {
          errors.push(`Receipt ${item.receipt_id}: ${result.error}`);
        }
      }
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Receipt ${item.receipt_id} error: ${msg}`);

      // Record failure in DB
      try {
        await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/record_notification_result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Profile': 'dynasty_private',
            'Content-Profile': 'dynasty_private',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            p_receipt_id: item.receipt_id,
            p_status: 'FAILED',
            p_error: msg,
          }),
        });
      } catch (_) {}
    }
  }

  return {
    status: 'completed',
    processed: items.length,
    succeeded,
    failed,
    exhausted,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Netlify Function Handler for Scheduled or Administrative Invocations
 */
export default async function handler(request: Request): Promise<Response> {
  // Allow administrative invocation or scheduled Netlify execution
  if (request.method !== 'POST' && request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await processRetryQueue();
  return new Response(JSON.stringify(result), {
    status: result.status === 'error' ? 500 : 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
