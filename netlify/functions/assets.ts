import crypto from 'node:crypto';
import { z } from 'zod';
import {
  SubmissionNotificationContext,
  buildInternalDWSNotification,
  buildInternalAssetUploadNotification,
  buildFounderConfirmation,
  getNotificationTransport,
  IntakeAssetSummary,
} from './lib/notifications';
import {
  isPrincipalKeyConfigured,
  verifyPrincipalPasscode,
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulAttempt,
  generateSignedAssetUrl,
} from './lib/principal-auth';

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
    corsHeaders['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-receipt-id, x-filename, x-mimetype, x-principal-key';
    corsHeaders['Access-Control-Max-Age'] = '86400';
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST' && request.method !== 'GET') {
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

      const { receiptId, uploadedFiles, founderInfo } = body;
      const registered: any[] = [];

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

      // Dispatch internal notification when confidential assets are confirmed
      if (registered.length > 0) {
        try {
          let founderName = founderInfo?.name || null;
          let founderEmail = founderInfo?.email || null;
          let companyName = founderInfo?.company || null;

          // Attempt to retrieve lead profile details if not fully provided
          if (!founderName || !founderEmail || !companyName) {
            try {
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
              if (inqCheck.ok) {
                const inqRows: any = await inqCheck.json();
                if (Array.isArray(inqRows) && inqRows.length > 0 && inqRows[0].lead_id) {
                  const leadRes = await fetch(
                    `${supabaseUrl.replace(/\/$/, '')}/rest/v1/leads?id=eq.${inqRows[0].lead_id}&select=full_name,email,company_name`,
                    {
                      headers: {
                        apikey: supabaseKey,
                        Authorization: `Bearer ${supabaseKey}`,
                        'Accept-Profile': 'dynasty_private',
                      },
                    }
                  );
                  if (leadRes.ok) {
                    const leadRows: any = await leadRes.json();
                    if (Array.isArray(leadRows) && leadRows.length > 0) {
                      founderName = founderName || leadRows[0].full_name;
                      founderEmail = founderEmail || leadRows[0].email;
                      companyName = companyName || leadRows[0].company_name;
                    }
                  }
                }
              }
            } catch (dbErr) {
              console.warn('Asset notification profile lookup warning:', dbErr);
            }
          }

          const transport = getNotificationTransport();
          const notif = buildInternalAssetUploadNotification(
            {
              receiptId,
              founderName,
              founderEmail,
              companyName,
            },
            uploadedFiles.map((f: any, idx: number) => ({
              id: registered[idx]?.asset_id,
              originalFilename: f.originalFilename,
              mimeType: f.mimeType,
              sizeBytes: f.sizeBytes,
            }))
          );
          const dispatchRes = await transport.send(notif);
          if (!dispatchRes.success) {
            console.error('Asset notification send failed:', dispatchRes.error);
          }
        } catch (notifErr) {
          console.error('Asset notification unexpected error:', notifErr);
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

      // Dispatch internal notification for direct upload
      try {
        let founderName = null;
        let founderEmail = null;
        let companyName = null;

        if (inqRows[0]?.lead_id) {
          try {
            const leadRes = await fetch(
              `${supabaseUrl.replace(/\/$/, '')}/rest/v1/leads?id=eq.${inqRows[0].lead_id}&select=full_name,email,company_name`,
              {
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  'Accept-Profile': 'dynasty_private',
                },
              }
            );
            if (leadRes.ok) {
              const leadRows: any = await leadRes.json();
              if (Array.isArray(leadRows) && leadRows.length > 0) {
                founderName = leadRows[0].full_name;
                founderEmail = leadRows[0].email;
                companyName = leadRows[0].company_name;
              }
            }
          } catch (leadLookupErr) {
            console.warn('Lead lookup error on direct upload:', leadLookupErr);
          }
        }

        const transport = getNotificationTransport();
        const notif = buildInternalAssetUploadNotification(
          {
            receiptId,
            founderName,
            founderEmail,
            companyName,
          },
          [
            {
              id: (Array.isArray(rpcData) ? rpcData[0]?.asset_id : rpcData?.asset_id) || null,
              originalFilename: filename,
              mimeType,
              sizeBytes,
            },
          ]
        );
        await transport.send(notif);
      } catch (directNotifErr) {
        console.error('Direct asset upload notification failed:', directNotifErr);
      }

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

    // -------------------------------------------------------------
    // ACTION 4: PRINCIPAL SECURE ASSET RETRIEVAL (POST Passcode Gate)
    // -------------------------------------------------------------
    if (action === 'retrieve') {
      // Enforce POST method: credentials must never be in GET query parameters
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Method not allowed. Principal authentication requires POST.',
          }),
          { status: 405, headers: corsHeaders }
        );
      }

      const clientIp =
        request.headers.get('x-nf-client-connection-ip') ||
        request.headers.get('client-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        'unknown';

      // 1. Rate Limiting Check (Brute-force protection)
      const rateCheck = checkRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return new Response(
          JSON.stringify({
            status: 'rate_limited',
            message: 'Too many failed authentication attempts. Access temporarily restricted.',
            retryAfter: rateCheck.retryAfter,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Retry-After': String(rateCheck.retryAfter || 900),
            },
          }
        );
      }

      // 2. Verify DWS_PRINCIPAL_KEY is configured on server
      if (!isPrincipalKeyConfigured()) {
        console.error('DWS Principal Key is not configured in server environment');
        return new Response(
          JSON.stringify({
            status: 'unconfigured',
            message: 'Principal vault access is temporarily unconfigured.',
          }),
          { status: 503, headers: corsHeaders }
        );
      }

      // 3. Parse POST Body
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        recordFailedAttempt(clientIp);
        return new Response(
          JSON.stringify({ status: 'error', message: 'Invalid request payload' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const aid = body.aid || body.assetId;
      const rid = body.rid || body.receiptId;
      const passcode =
        body.passcode ||
        body.key ||
        request.headers.get('x-principal-key') ||
        null;

      // 4. Principal Authentication (Constant-time check against DWS_PRINCIPAL_KEY)
      if (!passcode || !verifyPrincipalPasscode(passcode)) {
        recordFailedAttempt(clientIp);
        // Generic failure response: do not disclose whether passcode was wrong vs aid/rid validity
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Invalid credentials or request reference',
          }),
          { status: 401, headers: corsHeaders }
        );
      }

      // Successfully authenticated! Reset rate limit failure count
      recordSuccessfulAttempt(clientIp);

      // 5. Parameter Validation (UUID Format)
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!aid || !UUID_REGEX.test(aid) || !rid || !UUID_REGEX.test(rid)) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Valid asset ID and receipt ID are required',
          }),
          { status: 400, headers: corsHeaders }
        );
      }

      // 6. Fetch Asset Record via Security Definer RPC
      const assetCheck = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_asset_by_id`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Accept-Profile': 'dynasty_private',
            'Content-Profile': 'dynasty_private',
          },
          body: JSON.stringify({ p_asset_id: aid }),
        }
      );

      if (!assetCheck.ok) {
        console.error('get_asset_by_id error:', await assetCheck.text());
        return new Response(
          JSON.stringify({ status: 'error', message: 'Unable to verify asset reference' }),
          { status: 500, headers: corsHeaders }
        );
      }

      const assetRows: any = await assetCheck.json();
      if (!Array.isArray(assetRows) || assetRows.length === 0) {
        return new Response(
          JSON.stringify({ status: 'not_found', message: 'Specified asset not found in private vault' }),
          { status: 404, headers: corsHeaders }
        );
      }

      const assetRecord = assetRows[0];

      // 7. Authorization Boundary Checks:
      // Verify asset belongs to receipt
      if (assetRecord.receipt_id !== rid) {
        return new Response(
          JSON.stringify({
            status: 'forbidden',
            message: 'Asset does not belong to specified submission receipt',
          }),
          { status: 403, headers: corsHeaders }
        );
      }

      // Verify asset status is uploaded
      if (assetRecord.status !== 'uploaded') {
        return new Response(
          JSON.stringify({
            status: 'rejected',
            message: 'Asset status is not uploaded',
          }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Verify storage path begins with inquiry ID
      if (!assetRecord.storage_path || !assetRecord.storage_path.startsWith(`${assetRecord.inquiry_id}/`)) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Asset storage path integrity mismatch',
          }),
          { status: 500, headers: corsHeaders }
        );
      }

      // 8. Generate 15-Minute Short-Lived Signed Download URL
      const signedData = await generateSignedAssetUrl(assetRecord.storage_path, 900, supabaseUrl, supabaseKey);

      // 9. Audit Logging (Zero credentials or signed URLs logged)
      try {
        const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16);
        const userAgent = (request.headers.get('user-agent') || 'unknown').substring(0, 200);

        await fetch(
          `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/record_asset_retrieval_audit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Accept-Profile': 'dynasty_private',
              'Content-Profile': 'dynasty_private',
            },
            body: JSON.stringify({
              p_asset_id: aid,
              p_actor: 'principal',
              p_auth_method: 'passcode',
              p_ip_hash: ipHash,
              p_ua: userAgent,
            }),
          }
        ).catch(() => {});

        console.log(JSON.stringify({
          event: 'principal_asset_retrieval',
          assetId: aid,
          inquiryId: assetRecord.inquiry_id,
          receiptId: assetRecord.receipt_id,
          authMethod: 'passcode',
          timestamp: new Date().toISOString(),
        }));
      } catch (auditErr) {
        console.warn('Audit record warning:', auditErr);
      }

      // 10. Return Authorized Response
      return new Response(
        JSON.stringify({
          status: 'authorized',
          assetId: aid,
          receiptId: assetRecord.receipt_id,
          originalFilename: assetRecord.original_filename,
          mimeType: assetRecord.mime_type,
          sizeBytes: Number(assetRecord.size_bytes),
          signedUrl: signedData.signedUrl,
          expiresIn: signedData.expiresIn,
        }),
        { status: 200, headers: corsHeaders }
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
