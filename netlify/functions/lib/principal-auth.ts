/**
 * Dynasty Works Studio — Principal Asset Retrieval & Authorization Layer
 * Phase 2F.3 Secure Principal Asset Retrieval Remediation
 *
 * Enforces Zero-Token URL Architecture:
 * 1. Dedicated Production Passcode Authentication via DWS_PRINCIPAL_KEY
 * 2. Constant-time comparison preventing timing side-channel attacks
 * 3. Never derives credentials from SUPABASE_SERVICE_ROLE_KEY
 * 4. Server-side Rate Limiting / Brute-Force Lockout protection
 * 5. Short-lived (15-minute / 900s) signed Supabase storage URL generation
 * 6. Complete credential privacy: zero secrets, passcodes, or signed URLs in client logs or URLs
 */

import crypto from 'node:crypto';

// In-memory rate limiting state for serverless execution context
interface RateLimitEntry {
  failedAttempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes window

/**
 * Checks if the production principal key is properly configured in the environment.
 * Requires an explicit DWS_PRINCIPAL_KEY of at least 16 characters.
 * Supabase service role keys are strictly prohibited as authentication credentials.
 */
export function isPrincipalKeyConfigured(): boolean {
  const key = process.env.DWS_PRINCIPAL_KEY;
  return Boolean(key && typeof key === 'string' && key.trim().length >= 16);
}

/**
 * Constant-time verification of candidate principal passcode against DWS_PRINCIPAL_KEY.
 * Prevents side-channel timing analysis.
 * Does NOT fallback to or derive from SUPABASE_SERVICE_ROLE_KEY.
 */
export function verifyPrincipalPasscode(candidateKey: string | null | undefined): boolean {
  if (!candidateKey || typeof candidateKey !== 'string') {
    return false;
  }

  const configuredKey = process.env.DWS_PRINCIPAL_KEY;
  if (!configuredKey || typeof configuredKey !== 'string' || configuredKey.trim().length === 0) {
    return false;
  }

  const cleanCandidate = candidateKey.trim();
  const cleanConfigured = configuredKey.trim();

  const candBuf = Buffer.from(cleanCandidate, 'utf8');
  const confBuf = Buffer.from(cleanConfigured, 'utf8');

  if (candBuf.length !== confBuf.length) {
    // Perform dummy timing-safe comparison to prevent length-leak timing variations
    crypto.timingSafeEqual(candBuf, candBuf);
    return false;
  }

  return crypto.timingSafeEqual(candBuf, confBuf);
}

/**
 * Derives a privacy-preserving identifier for rate-limiting.
 * Uses SHA-256 with rate-limit pepper.
 */
function hashClientIdentifier(clientIp: string): string {
  const pepper = process.env.RATE_LIMIT_PEPPER || 'dws_vault_rate_pepper';
  return crypto.createHash('sha256').update(`${clientIp}:${pepper}`).digest('hex');
}

/**
 * Checks rate limiting status for a given client IP.
 */
export function checkRateLimit(clientIp: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const idHash = hashClientIdentifier(clientIp);
  const entry = rateLimitMap.get(idHash);

  if (!entry) {
    return { allowed: true };
  }

  // Check if currently locked out
  if (entry.lockedUntil > now) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Reset entry if past the sliding window
  if (now - entry.lastAttempt > WINDOW_DURATION_MS) {
    rateLimitMap.delete(idHash);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Records a failed authentication attempt and triggers progressive lockout if threshold reached.
 */
export function recordFailedAttempt(clientIp: string): void {
  const now = Date.now();
  const idHash = hashClientIdentifier(clientIp);
  const entry = rateLimitMap.get(idHash) || { failedAttempts: 0, lockedUntil: 0, lastAttempt: now };

  entry.failedAttempts += 1;
  entry.lastAttempt = now;

  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  rateLimitMap.set(idHash, entry);
}

/**
 * Resets failed attempts on successful authentication.
 */
export function recordSuccessfulAttempt(clientIp: string): void {
  const idHash = hashClientIdentifier(clientIp);
  rateLimitMap.delete(idHash);
}

/**
 * Generates a short-lived (15-minute) signed download URL for an isolated private storage object.
 * Strictly scopes access to the single requested object path in founder-intake-assets.
 */
export async function generateSignedAssetUrl(
  storagePath: string,
  expiresInSeconds = 900,
  supabaseUrl = process.env.SUPABASE_URL,
  supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
): Promise<{ signedUrl: string; expiresIn: number }> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase storage credentials not configured');
  }

  const cleanUrl = supabaseUrl.replace(/\/$/, '');
  const signEndpoint = `${cleanUrl}/storage/v1/object/sign/founder-intake-assets/${storagePath}`;

  const res = await fetch(signEndpoint, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: expiresInSeconds }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to generate signed download URL: ${errText}`);
  }

  const data: any = await res.json();
  if (!data.signedURL) {
    throw new Error('Storage service returned invalid signed URL payload');
  }

  return {
    signedUrl: `${cleanUrl}/storage/v1${data.signedURL}`,
    expiresIn: expiresInSeconds,
  };
}
