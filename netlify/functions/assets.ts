import crypto from 'node:crypto';
import { z } from 'zod';
import {
  SubmissionNotificationContext,
  buildInternalDWSNotification,
  buildFounderConfirmation,
  getNotificationTransport,
  IntakeAssetSummary,
} from './lib/notifications';

// Security Headers & Allowed Origins Allowlist
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

  if (/^https:\/\/[a-z0-9-]+--dynasty-works-studio-review\.netlify\.app$/.test(origin)) {
    return true;
  }

  return false;
}

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.xlsx',
  '.pptx',
  '.csv',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const MAX_FILE_SIZE = 26_214_400; // 25 MB
const MAX_FILES_PER_INQUIRY = 10;
const MAX_AGGREGATE_SIZE = 104_857_600; // 100 MB

function sanitizeFilename(raw: string): string {
  const base = raw.replace(/^.*[\\\/]/, '').trim();
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return clean.substring(0, 100) || 'unnamed_asset';
}

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.substring(idx).toLowerCase();
}

export default async function handler(request: Request, context?: any): Promise<Response> {
  const startTime = Date.now();
  const origin = request.headers.get('origin');
  const allowed = isOriginAllowed(origin);

  const corsHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  if (allowed && origin) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-receipt-id, x-filename, x-mimetype';
    corsHeaders['Access-Control-Max-Age'] = '86400';
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'error', message: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({
        status: 'not_configured',
        message: 'Storage backend is not configured.',
      }),
      { status: 503, headers: corsHeaders }
    );
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const action = url.searchParams.get('action') || path.split('/').pop();

  try {
    // -------------------------------------------------------------
    // ACTION 1: AUTHORIZE UPLOADS (Generate Signed Upload URLs)
    // -------------------------------------------------------------
    if (action === 'authorize') {
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return new Response(
          JSON.stringify({ status: 'error', message: 'Invalid JSON payload' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const receiptId = body.receiptId;
      if (!receiptId || typeof receiptId !== 'string' || !/^[0-9a-f-]{36}$/i.test(receiptId)) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'Valid receipt ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const files = body.files;
      if (!Array.isArray(files) || files.length === 0) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'No files provided for authorization' }),
          { status: 400, headers: corsHeaders }
        );
      }

      if (files.length > MAX_FILES_PER_INQUIRY) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: `Maximum ${MAX_FILES_PER_INQUIRY} files per submission allowed`,
          }),
          { status: 400, headers: corsHeaders }
        );
      }

      let totalSize = 0;
      for (const file of files) {
        if (!file.originalFilename || typeof file.originalFilename !== 'string') {
          return new Response(
            JSON.stringify({ status: 'error', message: 'Missing originalFilename' }),
            { status: 400, headers: corsHeaders }
          );
        }
        const ext = getExtension(file.originalFilename);
        if (!ALLOWED_EXTENSIONS.has(ext)) {
          return new Response(
            JSON.stringify({
              status: 'rejected',
              message: `File extension '${ext}' is not permitted for founder intake`,
            }),
            { status: 400, headers: corsHeaders }
          );
        }
        if (!ALLOWED_MIME_TYPES.has(file.mimeType)) {
          return new Response(
            JSON.stringify({
              status: 'rejected',
              message: `MIME type '${file.mimeType}' is not permitted for founder intake`,
            }),
            { status: 400, headers: corsHeaders }
          );
        }
        if (typeof file.sizeBytes !== 'number' || file.sizeBytes <= 0 || file.sizeBytes > MAX_FILE_SIZE) {
          return new Response(
            JSON.stringify({
              status: 'rejected',
              message: `File '${file.originalFilename}' exceeds maximum size of 25MB`,
            }),
            { status: 400, headers: corsHeaders }
          );
        }
        totalSize += file.sizeBytes;
      }

      if (totalSize > MAX_AGGREGATE_SIZE) {
        return new Response(
          JSON.stringify({
            status: 'rejected',
            message: 'Total upload volume exceeds 100MB aggregate limit',
          }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Verify inquiry exists in Supabase via RPC
      const inqCheck = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_inquiry_by_receipt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Accept-Profile': 'dynasty_private',
            'Content-Profile': 'dynasty_private',
          },
          body: JSON.stringify({ p_receipt_id: receiptId }),
        }
      );

      if (!inqCheck.ok) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'Unable to verify submission reference' }),
          { status: 500, headers: corsHeaders }
        );
      }

      const inqRows: any = await inqCheck.json();
      if (!Array.isArray(inqRows) || inqRows.length === 0) {
        return new Response(
          JSON.stringify({ status: 'not_found', message: 'Submission record not found' }),
          { status: 404, headers: corsHeaders }
        );
      }

      const inquiryId = inqRows[0].id;

      // Generate signed upload URLs
      const uploads = [];
      for (const file of files) {
        const sanitized = sanitizeFilename(file.originalFilename);
        const fileId = crypto.randomUUID();
        const storagePath = `${inquiryId}/${fileId}-${sanitized}`;

        const signRes = await fetch(
          `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/upload/sign/founder-intake-assets/${storagePath}`,
          {
            method: 'POST',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expiresIn: 900 }), // 15 min expiry
          }
        );

        if (!signRes.ok) {
          const errText = await signRes.text();
          console.error('Storage sign error:', errText);
          return new Response(
            JSON.stringify({ status: 'error', message: 'Failed to generate upload authorization' }),
            { status: 500, headers: corsHeaders }
          );
        }

        const signData: any = await signRes.json();
        uploads.push({
          fileId,
          originalFilename: file.originalFilename,
          sanitizedFilename: sanitized,
          storagePath,
          signedUploadUrl: `${supabaseUrl.replace(/\/$/, '')}/storage/v1${signData.url}`,
          token: signData.token,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        });
      }

      return new Response(
        JSON.stringify({
          status: 'authorized',
          receiptId,
          inquiryId,
          uploads,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // -------------------------------------------------------------
    // ACTION 2: CONFIRM UPLOAD & REGISTER METADATA
    // -------------------------------------------------------------
    if (action === 'confirm') {
      const body = await request.json().catch(() => null);
      if (!body || !body.receiptId || !Array.isArray(body.uploadedFiles)) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'Invalid confirmation payload' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const { receiptId, uploadedFiles } = body;
      const registered = [];

      for (const f of uploadedFiles) {
        const rpcPayload = {
          p_receipt_id: receiptId,
          p_storage_path: f.storagePath,
          p_original_filename: f.originalFilename,
          p_sanitized_filename: f.sanitizedFilename,
          p_mime_type: f.mimeType,
          p_size_bytes: f.sizeBytes,
          p_metadata: f.metadata || {},
        };

        const rpcRes = await fetch(
          `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/register_inquiry_asset`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Accept-Profile': 'dynasty_private',
              'Content-Profile': 'dynasty_private',
            },
            body: JSON.stringify(rpcPayload),
          }
        );

        if (rpcRes.ok) {
          const resData: any = await rpcRes.json();
          registered.push(resData);
        } else {
          console.error('register_inquiry_asset error:', await rpcRes.text());
        }
      }

      return new Response(
        JSON.stringify({
          status: 'confirmed',
          receiptId,
          registeredCount: registered.length,
          assets: registered,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // -------------------------------------------------------------
    // ACTION 3: DIRECT SERVER-SIDE UPLOAD PROXY (Fallback & Testing)
    // -------------------------------------------------------------
    if (action === 'upload') {
      const receiptId = request.headers.get('x-receipt-id');
      const filename = request.headers.get('x-filename') || 'unnamed_asset.pdf';
      const mimeType = request.headers.get('x-mimetype') || request.headers.get('content-type') || 'application/pdf';

      if (!receiptId) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'x-receipt-id header required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const ext = getExtension(filename);
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return new Response(
          JSON.stringify({ status: 'rejected', message: `Extension '${ext}' not allowed` }),
          { status: 400, headers: corsHeaders }
        );
      }

      const arrayBuffer = await request.arrayBuffer();
      const sizeBytes = arrayBuffer.byteLength;

      if (sizeBytes <= 0 || sizeBytes > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ status: 'rejected', message: 'File size exceeds limit' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Verify inquiry
      const inqCheck = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_inquiry_by_receipt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Accept-Profile': 'dynasty_private',
            'Content-Profile': 'dynasty_private',
          },
          body: JSON.stringify({ p_receipt_id: receiptId }),
        }
      );

      if (!inqCheck.ok) {
        return new Response(
          JSON.stringify({ status: 'error', message: 'Verification error' }),
          { status: 500, headers: corsHeaders }
        );
      }

      const inqRows: any = await inqCheck.json();
      if (!Array.isArray(inqRows) || inqRows.length === 0) {
        return new Response(
          JSON.stringify({ status: 'not_found', message: 'Inquiry not found' }),
          { status: 404, headers: corsHeaders }
        );
      }

      const inquiryId = inqRows[0].id;
      const sanitized = sanitizeFilename(filename);
      const fileId = crypto.randomUUID();
      const storagePath = `${inquiryId}/${fileId}-${sanitized}`;

      // Upload binary to Supabase Storage
      const uploadRes = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/founder-intake-assets/${storagePath}`,
        {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': mimeType,
          },
          body: Buffer.from(arrayBuffer),
        }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        console.error('Storage upload failed:', err);
        return new Response(
          JSON.stringify({ status: 'error', message: 'Storage upload failed' }),
          { status: 500, headers: corsHeaders }
        );
      }

      // Register metadata
      const rpcPayload = {
        p_receipt_id: receiptId,
        p_storage_path: storagePath,
        p_original_filename: filename,
        p_sanitized_filename: sanitized,
        p_mime_type: mimeType,
        p_size_bytes: sizeBytes,
        p_metadata: {},
      };

      const rpcRes = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/register_inquiry_asset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Accept-Profile': 'dynasty_private',
            'Content-Profile': 'dynasty_private',
          },
          body: JSON.stringify(rpcPayload),
        }
      );

      const rpcData = await rpcRes.json();
      return new Response(
        JSON.stringify({
          status: 'uploaded',
          receiptId,
          storagePath,
          asset: rpcData,
        }),
        { status: 201, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ status: 'error', message: `Unknown action '${action}'` }),
      { status: 400, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('Assets endpoint exception:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal server error processing assets' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
