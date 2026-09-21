/**
 * Dynasty Works Studio — Founder Asset Client Layer
 * Phase 2F Production Cutover & Confidential Founder Intake
 *
 * Implements confidential client-side intake of founder assets (pitch decks,
 * architecture diagrams, cap tables, operating models, briefs).
 *
 * Architecture:
 * 1. Pre-validation of size, MIME type, extension, and file counts.
 * 2. Authorization via Netlify Functions -> scoped signed upload URLs (15-min expiry).
 * 3. Direct binary transfer to private Supabase bucket 'founder-intake-assets'.
 * 4. Automatic fallback to direct endpoint upload if signed URL upload encounters network issues.
 * 5. Registration of asset metadata linked to the authoritative brief receipt ID.
 * 6. Non-blocking atomicity: asset failures NEVER invalidate or cancel an accepted brief.
 */

export interface FounderAsset {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  progress: number; // 0 to 100
  error?: string;
}

export interface AssetValidationResult {
  valid: boolean;
  error?: string;
}

export interface UploadAuthorizationItem {
  fileId: string;
  originalFilename: string;
  sanitizedFilename: string;
  storagePath: string;
  signedUploadUrl: string;
  token?: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadAuthorizationResponse {
  status: 'authorized' | 'error' | 'rejected' | 'not_found';
  receiptId: string;
  inquiryId?: string;
  uploads?: UploadAuthorizationItem[];
  message?: string;
}

export interface AssetRegistrationSummary {
  id: string;
  inquiry_id: string;
  original_filename: string;
  sanitized_filename: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export interface AssetUploadBatchResult {
  success: boolean;
  receiptId: string;
  totalFiles: number;
  uploadedCount: number;
  failedCount: number;
  registeredAssets: AssetRegistrationSummary[];
  errors: string[];
}

// Constraints mirroring Supabase Storage & Netlify Function security policy
export const ALLOWED_EXTENSIONS: readonly string[] = [
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
];

export const ALLOWED_MIME_TYPES: readonly string[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 26_214_400; // 25 MB per file
export const MAX_FILES_PER_INQUIRY = 10;
export const MAX_AGGREGATE_SIZE_BYTES = 104_857_600; // 100 MB aggregate

/**
 * Extract lowercase file extension including dot.
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Format bytes to human-readable string (e.g. "4.2 MB").
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const cleanIndex = Math.min(i, units.length - 1);
  return `${(bytes / Math.pow(1024, cleanIndex)).toFixed(cleanIndex === 0 ? 0 : 1)} ${units[cleanIndex]}`;
}

/**
 * Validate a candidate file against size, MIME, and extension rules.
 */
export function validateAssetFile(file: File): AssetValidationResult {
  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File format '${ext || 'unknown'}' is not supported. Supported: PDF, DOCX, XLSX, PPTX, CSV, TXT, PNG, JPG, WEBP.`,
    };
  }

  // Permissive check for MIME types when browser reports generic octet-stream
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type) && file.type !== 'application/octet-stream') {
    return {
      valid: false,
      error: `Detected format (${file.type}) does not match permitted document standards.`,
    };
  }

  if (file.size <= 0) {
    return { valid: false, error: 'File appears to be empty (0 bytes).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds 25 MB limit (${formatBytes(file.size)}).`,
    };
  }

  return { valid: true };
}

/**
 * Authorize upload items via Netlify serverless endpoint.
 */
export async function authorizeUploads(
  receiptId: string,
  files: Array<{ originalFilename: string; sizeBytes: number; mimeType: string }>,
  baseUrl = ''
): Promise<UploadAuthorizationResponse> {
  const url = `${baseUrl}/api/submissions/assets/authorize`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      receiptId,
      files,
    }),
  });

  if (!response.ok) {
    let message = 'Upload authorization failed';
    try {
      const errJson = await response.json();
      message = errJson.message || message;
    } catch {
      // Ignore non-json
    }
    return {
      status: 'error',
      receiptId,
      message,
    };
  }

  return await response.json();
}

/**
 * Upload binary directly to Supabase signed upload URL with progress tracking.
 */
export function uploadFileToSignedUrl(
  signedUploadUrl: string,
  file: File | Blob,
  mimeType: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`Storage transfer failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during asset transmission to storage.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Storage upload timed out.'));
    };

    // Supabase signed upload URL supports PUT directly
    xhr.open('PUT', signedUploadUrl, true);
    xhr.setRequestHeader('Content-Type', mimeType || 'application/octet-stream');
    xhr.send(file);
  });
}

/**
 * Confirm uploaded assets and persist metadata in Supabase.
 */
export async function confirmUploads(
  receiptId: string,
  uploadedFiles: Array<{
    storagePath: string;
    originalFilename: string;
    sanitizedFilename: string;
    mimeType: string;
    sizeBytes: number;
    metadata?: Record<string, unknown>;
  }>,
  baseUrl = '',
  founderInfo?: { name?: string; email?: string; company?: string }
): Promise<{ status: string; registeredCount: number; assets: AssetRegistrationSummary[] }> {
  const url = `${baseUrl}/api/submissions/assets/confirm`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      receiptId,
      uploadedFiles,
      founderInfo,
    }),
  });

  if (!response.ok) {
    let msg = 'Asset registration confirmation failed';
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return await response.json();
}

/**
 * Fallback direct upload through Netlify Function proxy.
 */
export async function uploadFileDirect(
  receiptId: string,
  file: File | Blob,
  filename: string,
  mimeType: string,
  baseUrl = ''
): Promise<AssetRegistrationSummary> {
  const url = `${baseUrl}/api/submissions/assets/upload`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': mimeType || 'application/octet-stream',
      'x-receipt-id': receiptId,
      'x-filename': encodeURIComponent(filename),
      'x-mimetype': mimeType,
    },
    body: file,
  });

  if (!response.ok) {
    let msg = 'Direct file intake failed';
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = await response.json();
  return json.asset;
}

/**
 * High-level orchestration for submitting an array of founder files against an accepted receipt.
 *
 * Guarantees:
 * - Never throws unhandled exceptions that interrupt the founder's experience.
 * - Updates per-file progress callbacks.
 * - Attempts signed direct upload first; falls back to proxy upload if needed.
 * - Confirms metadata registration atomically for completed files.
 */
export async function uploadInquiryAssets(
  receiptId: string,
  files: File[],
  onFileProgress?: (fileIndex: number, progress: number, status: 'uploading' | 'uploaded' | 'error', error?: string) => void,
  baseUrl = '',
  founderInfo?: { name?: string; email?: string; company?: string }
): Promise<AssetUploadBatchResult> {
  const result: AssetUploadBatchResult = {
    success: false,
    receiptId,
    totalFiles: files.length,
    uploadedCount: 0,
    failedCount: 0,
    registeredAssets: [],
    errors: [],
  };

  if (files.length === 0) {
    result.success = true;
    return result;
  }

  try {
    // 1. Request signed URLs for all files
    const authPayload = files.map((f) => ({
      originalFilename: f.name,
      sizeBytes: f.size,
      mimeType: f.type || 'application/octet-stream',
    }));

    const authRes = await authorizeUploads(receiptId, authPayload, baseUrl);

    if (authRes.status !== 'authorized' || !authRes.uploads || authRes.uploads.length === 0) {
      // If authorization failed entirely, attempt direct fallback per file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (onFileProgress) onFileProgress(i, 20, 'uploading');
        try {
          const registered = await uploadFileDirect(receiptId, file, file.name, file.type, baseUrl);
          result.uploadedCount++;
          result.registeredAssets.push(registered);
          if (onFileProgress) onFileProgress(i, 100, 'uploaded');
        } catch (err: any) {
          result.failedCount++;
          const msg = err.message || `Failed to upload ${file.name}`;
          result.errors.push(msg);
          if (onFileProgress) onFileProgress(i, 0, 'error', msg);
        }
      }

      result.success = result.uploadedCount > 0;
      return result;
    }

    // 2. Upload each file using signed URL
    const uploadedForConfirmation: Array<{
      storagePath: string;
      originalFilename: string;
      sanitizedFilename: string;
      mimeType: string;
      sizeBytes: number;
    }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const auth = authRes.uploads[i];

      if (!auth) {
        result.failedCount++;
        result.errors.push(`Missing authorization for ${file.name}`);
        if (onFileProgress) onFileProgress(i, 0, 'error', 'Authorization missing');
        continue;
      }

      if (onFileProgress) onFileProgress(i, 10, 'uploading');

      try {
        await uploadFileToSignedUrl(auth.signedUploadUrl, file, auth.mimeType, (pct) => {
          if (onFileProgress) onFileProgress(i, pct, 'uploading');
        });

        uploadedForConfirmation.push({
          storagePath: auth.storagePath,
          originalFilename: auth.originalFilename,
          sanitizedFilename: auth.sanitizedFilename,
          mimeType: auth.mimeType,
          sizeBytes: auth.sizeBytes,
        });

        if (onFileProgress) onFileProgress(i, 100, 'uploaded');
        result.uploadedCount++;
      } catch (uploadErr: any) {
        // Fallback to direct upload if signed URL fails (e.g. CORS)
        try {
          if (onFileProgress) onFileProgress(i, 30, 'uploading');
          const directAsset = await uploadFileDirect(receiptId, file, file.name, file.type, baseUrl);
          result.uploadedCount++;
          result.registeredAssets.push(directAsset);
          if (onFileProgress) onFileProgress(i, 100, 'uploaded');
        } catch (fallbackErr: any) {
          result.failedCount++;
          const errMessage = fallbackErr.message || uploadErr.message || 'Upload failed';
          result.errors.push(`${file.name}: ${errMessage}`);
          if (onFileProgress) onFileProgress(i, 0, 'error', errMessage);
        }
      }
    }

    // 3. Confirm metadata registration for signed uploads
    if (uploadedForConfirmation.length > 0) {
      try {
        const confirmRes = await confirmUploads(receiptId, uploadedForConfirmation, baseUrl, founderInfo);
        if (confirmRes.assets && confirmRes.assets.length > 0) {
          result.registeredAssets.push(...confirmRes.assets);
        }
      } catch (confirmErr: any) {
        // Metadata registration failed but files are in storage; log error
        result.errors.push(`Metadata confirmation warning: ${confirmErr.message}`);
      }
    }

    result.success = result.uploadedCount > 0;
  } catch (err: any) {
    result.errors.push(`Intake batch exception: ${err.message || 'Unknown failure'}`);
    result.success = result.uploadedCount > 0;
  }

  return result;
}
