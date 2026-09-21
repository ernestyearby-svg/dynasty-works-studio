/**
 * Dynasty Works Studio — Notification Infrastructure Layer
 * Phase 2E.4 Preview Notification Scaffold
 *
 * Implements decoupled, provider-neutral notification delivery for:
 * 1. Internal DWS Studio Notification (structured lead intelligence)
 * 2. Founder Confirmation (minimal, non-promissory receipt acknowledgment)
 *
 * Guaranteed boundaries:
 * - Submissions persist independently of email success/failure.
 * - Zero server credentials, database passwords, or IP hashes in email payloads.
 * - Non-promissory founder language (no guaranteed turnaround or acceptance).
 */

export type SubmissionKind = 'builder' | 'blueprint' | 'general';

export interface IntakeAssetSummary {
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface SubmissionNotificationContext {
  kind: SubmissionKind;
  receiptId: string;
  createdAt: string;
  founderName: string;
  founderEmail: string;
  founderPhone?: string | null;
  companyName: string;
  detail: Record<string, unknown>;
  assets?: IntakeAssetSummary[];
}

export interface EmailDispatch {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface NotificationResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

export interface NotificationTransport {
  send(dispatch: EmailDispatch): Promise<NotificationResult>;
}

// In-memory test store for verification
export interface MockSentEmail extends EmailDispatch {
  timestamp: string;
}

export class MockTestTransport implements NotificationTransport {
  public static dispatchedEmails: MockSentEmail[] = [];
  public static simulateFailure = false;
  public static failureMessage = 'Simulated email provider network failure';

  public static clear(): void {
    MockTestTransport.dispatchedEmails = [];
    MockTestTransport.simulateFailure = false;
    MockTestTransport.failureMessage = 'Simulated email provider network failure';
  }

  async send(dispatch: EmailDispatch): Promise<NotificationResult> {
    if (MockTestTransport.simulateFailure) {
      return {
        success: false,
        provider: 'mock-test',
        error: MockTestTransport.failureMessage,
      };
    }

    MockTestTransport.dispatchedEmails.push({
      ...dispatch,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      provider: 'mock-test',
      messageId: `mock_msg_${Math.random().toString(36).substring(2, 12)}`,
    };
  }
}

export class ResendTransport implements NotificationTransport {
  private apiKey: string;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom?: string) {
    this.apiKey = apiKey;
    this.defaultFrom =
      defaultFrom ||
      process.env.EMAIL_FROM ||
      process.env.RESEND_FROM_EMAIL ||
      'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
  }


  async send(dispatch: EmailDispatch): Promise<NotificationResult> {
    try {
      const payload: Record<string, unknown> = {
        from: dispatch.from || this.defaultFrom,
        to: Array.isArray(dispatch.to) ? dispatch.to : [dispatch.to],
        subject: dispatch.subject,
        text: dispatch.text,
      };
      if (dispatch.html) {
        payload.html = dispatch.html;
      }
      if (dispatch.replyTo) {
        payload.reply_to = dispatch.replyTo;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { id?: string; message?: string; name?: string };

      if (!res.ok) {
        return {
          success: false,
          provider: 'resend',
          error: data.message || `Resend API returned HTTP ${res.status}`,
        };
      }

      return {
        success: true,
        provider: 'resend',
        messageId: data.id,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: 'resend',
        error: `Network error reaching Resend: ${msg}`,
      };
    }
  }
}

export class UnconfiguredTransport implements NotificationTransport {
  async send(_dispatch: EmailDispatch): Promise<NotificationResult> {
    return {
      success: false,
      provider: 'unconfigured',
      error: 'Transactional email provider is not configured (RESEND_API_KEY missing)',
    };
  }
}

/**
 * Factory to determine active transport based on environment.
 */
export function getNotificationTransport(): NotificationTransport {
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.DWS_TEST_MODE === 'true' ||
    process.env.USE_MOCK_NOTIFICATIONS === 'true'
  ) {
    return new MockTestTransport();
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    const from =
      process.env.EMAIL_FROM ||
      process.env.RESEND_FROM_EMAIL ||
      'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
    return new ResendTransport(apiKey, from);
  }

  return new UnconfiguredTransport();
}

/**
 * Build structured internal notification for Dynasty Works Studio leadership.
 */
export function buildInternalDWSNotification(
  ctx: SubmissionNotificationContext,
  senderFrom?: string,
  internalRecipient?: string
): EmailDispatch {
  const from =
    senderFrom ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
  const to =
    internalRecipient ||
    process.env.INTERNAL_NOTIFICATION_EMAIL ||
    'advisory@dynastyworksstudio.com';


  const kindLabel =
    ctx.kind === 'builder'
      ? 'COMPANY BUILDER ROADMAP'
      : ctx.kind === 'blueprint'
        ? 'FOUNDER BLUEPRINT INTAKE'
        : 'CONTACT STUDIO INQUIRY';

  const rawCompany = ctx.companyName?.trim() || '';
  const isConfidentialOrEmpty =
    !rawCompany ||
    rawCompany.toLowerCase() === 'confidential venture' ||
    rawCompany.toLowerCase() === 'your venture';
  const displayCompany = isConfidentialOrEmpty ? 'Confidential / Unspecified Venture' : rawCompany;

  const subject = `[DWS Intake] ${kindLabel} — ${displayCompany} (${ctx.receiptId})`;

  let specificDetails = '';
  if (ctx.kind === 'builder') {
    const b = ctx.detail;
    specificDetails = `
--- DIAGNOSTIC DATA ---
Business Type:     ${b.businessType || 'Not specified'}
Operational Stage: ${b.businessStage || 'Not specified'}
Launch Window:     ${b.launchTimeline || 'Not specified'}
Target Budget:     ${b.budgetRange || 'Not specified'}
Selected Priorities: ${Array.isArray(b.selectedNeeds) ? b.selectedNeeds.join(', ') : 'None'}
Recommended Tier:  ${b.recommendedPackage || 'founder-blueprint'}
Founder Ambition:  ${b.ambitionNotes || 'None'}
`;
  } else if (ctx.kind === 'blueprint') {
    const bp = ctx.detail;
    specificDetails = `
--- STRATEGIC BLUEPRINT INTAKE ---
Venture Type:      ${bp.businessType || 'Not specified'}
Venture Stage:     ${bp.businessStage || 'Not specified'}
Physical Market:   ${bp.physicalMarket ? 'Yes' : 'No'}
Target Launch:     ${bp.targetLaunch || 'Not specified'}
Primary Ambition:  ${bp.ideaDescription || 'Not specified'}
Target Customer:   ${bp.targetCustomer || 'Not specified'}
Problem Statement: ${bp.problemDescription || 'Not specified'}
Core Question:     ${bp.biggestQuestion || 'Not specified'}
Requested Needs:   ${bp.requestedNeeds || 'Not specified'}
`;
  } else {
    const g = ctx.detail;
    specificDetails = `
--- GENERAL INQUIRY ---
Primary Intent:    ${g.stage || 'General'}
Budget Range:      ${g.budget || 'Not specified'}
Timeframe:         ${g.timeframe || 'Not specified'}
Services Sought:   ${Array.isArray(g.services) ? g.services.join(', ') : 'General advisory'}
Summary / Notes:   ${g.description || 'None'}
`;
  }

  let assetsSummary = '\nASSETS AT INITIAL TRANSMISSION: 0 (Optional founder materials transmit to private vault upon brief confirmation)\n';
  if (ctx.assets && ctx.assets.length > 0) {
    const list = ctx.assets
      .map((a) => `  - ${a.originalFilename} (${a.mimeType}, ${(a.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`)
      .join('\n');
    assetsSummary = `\nASSETS RECEIVED: ${ctx.assets.length} file(s)\n${list}\n`;
  }

  const text = `DYNASTY WORKS STUDIO // COMMERCIAL INTAKE
==================================================
SUBMISSION RECORD: ${ctx.receiptId}
TYPE:              ${kindLabel}
TIMESTAMP:         ${ctx.createdAt}
==================================================

--- FOUNDER PROFILE ---
Founder Name:      ${ctx.founderName || 'Not specified'}
Company / Venture: ${displayCompany}
Work Email:        ${ctx.founderEmail}
Phone Number:      ${ctx.founderPhone || 'Not provided'}
${specificDetails}
--- SUBMITTED ASSETS ---
${assetsSummary}
==================================================
This notification was deterministically generated by Dynasty Works Studio conversion infrastructure.
Supabase Receipt: ${ctx.receiptId}
`;

  return { to, from, subject, text };
}

/**
 * Build minimal, professional confirmation for the submitting founder.
 * Stated boundaries: No guarantee of acceptance, timeline, meeting, or payment.
 */
export function buildFounderConfirmation(
  ctx: SubmissionNotificationContext,
  senderFrom?: string
): EmailDispatch {
  const from =
    senderFrom ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
  const to = ctx.founderEmail;
  const subject = 'Dynasty Works Studio — Submission Received';

  const kindDescription =
    ctx.kind === 'builder'
      ? 'Company Build Roadmap & Initial Diagnostic'
      : ctx.kind === 'blueprint'
        ? 'Founder Blueprint Strategic Intake'
        : 'Studio Advisory Inquiry';

  const rawCompany = ctx.companyName?.trim() || '';
  const isConfidentialOrEmpty =
    !rawCompany ||
    rawCompany.toLowerCase() === 'confidential venture' ||
    rawCompany.toLowerCase() === 'your venture';
  const companyRef = isConfidentialOrEmpty ? 'your venture' : rawCompany;

  const rawFounder = ctx.founderName?.trim() || '';
  const greetingName =
    rawFounder && rawFounder.toLowerCase() !== 'founder'
      ? rawFounder
      : 'Founder';

  const assetNote =
    ctx.assets && ctx.assets.length > 0
      ? `\nYour submitted materials (${ctx.assets.length} file(s)) were securely received with your brief.\n`
      : '';

  const text = `Dear ${greetingName},

We have received your submission for ${companyRef} through the Dynasty Works Studio ${kindDescription}.${assetNote}

SUBMISSION REFERENCE:
Receipt ID: ${ctx.receiptId}
Timestamp:  ${ctx.createdAt}

WHAT HAPPENS NEXT:
Dynasty Works Studio evaluates all strategic submissions directly against current studio capacity and venture alignment. 

If there is mutual alignment with our venture build criteria, our advisory team will contact you directly at this email address to coordinate next steps.

Please retain this receipt ID for your records.

Sincerely,

Dynasty Works Studio
advisory@dynastyworksstudio.com
https://dynastyworksstudio.com
`;

  const replyTo = process.env.FOUNDER_REPLY_TO || 'ernestyearby@gmail.com';
  return { to, from, subject, text, replyTo };
}


/**
 * Dispatch both internal DWS notification and founder confirmation.
 * Catches all errors gracefully to prevent submission disruption.
 */
export async function dispatchSubmissionNotifications(
  ctx: SubmissionNotificationContext,
  transport?: NotificationTransport
): Promise<{
  success: boolean;
  internal: NotificationResult;
  founder: NotificationResult;
  error?: string;
}> {
  const activeTransport = transport || getNotificationTransport();

  const internalDispatch = buildInternalDWSNotification(ctx);
  const founderDispatch = buildFounderConfirmation(ctx);

  const [internalResult, founderResult] = await Promise.all([
    activeTransport.send(internalDispatch).catch((err) => ({
      success: false,
      provider: 'unknown',
      error: err instanceof Error ? err.message : String(err),
    })),
    activeTransport.send(founderDispatch).catch((err) => ({
      success: false,
      provider: 'unknown',
      error: err instanceof Error ? err.message : String(err),
    })),
  ]);

  const bothSucceeded = internalResult.success && founderResult.success;
  let combinedError: string | undefined;

  if (!bothSucceeded) {
    const errs: string[] = [];
    if (!internalResult.success) {
      errs.push(`Internal notification failed: ${internalResult.error}`);
    }
    if (!founderResult.success) {
      errs.push(`Founder confirmation failed: ${founderResult.error}`);
    }
    combinedError = errs.join('; ');
  }

  return {
    success: bothSucceeded,
    internal: internalResult,
    founder: founderResult,
    error: combinedError,
  };
}

/**
 * Build structured internal notification for Dynasty Works Studio leadership
 * when confidential founder materials are confirmed and stored in the private vault.
 */
export function buildInternalAssetUploadNotification(
  inquiry: {
    receiptId: string;
    founderName?: string | null;
    founderEmail?: string | null;
    companyName?: string | null;
  },
  assets: Array<{
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
  }>,
  senderFrom?: string,
  internalRecipient?: string
): EmailDispatch {
  const from =
    senderFrom ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    'Dynasty Works Studio <advisory@dynastyworksstudio.com>';
  const to =
    internalRecipient ||
    process.env.INTERNAL_NOTIFICATION_EMAIL ||
    'ernestyearby@gmail.com';

  const rawCompany = inquiry.companyName?.trim() || '';
  const isConfidentialOrEmpty =
    !rawCompany ||
    rawCompany.toLowerCase() === 'confidential venture' ||
    rawCompany.toLowerCase() === 'your venture';
  const displayCompany = isConfidentialOrEmpty ? 'Confidential / Unspecified Venture' : rawCompany;

  const subject = `[DWS Intake] CONFIDENTIAL ASSETS RECEIVED — ${displayCompany} (${inquiry.receiptId})`;

  const list = assets
    .map((a) => `  - ${a.originalFilename} (${a.mimeType}, ${(a.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`)
    .join('\n');

  const text = `DYNASTY WORKS STUDIO // CONFIDENTIAL ASSETS RECEIVED
==================================================
SUBMISSION RECEIPT: ${inquiry.receiptId}
TIMESTAMP:          ${new Date().toISOString()}
==================================================

--- FOUNDER PROFILE ---
Founder Name:      ${inquiry.founderName || 'Not specified'}
Company / Venture: ${displayCompany}
Contact Email:     ${inquiry.founderEmail || 'On file with submission brief'}

--- CONFIDENTIAL ASSETS VAULT-STORED (${assets.length} file(s)) ---
${list}

==================================================
VAULT SECURITY NOTICE:
All materials are stored in the private founder asset vault ('founder-intake-assets').
Public anonymous access is disabled. Retrieval is restricted to authenticated studio principals.
==================================================
Supabase Receipt: ${inquiry.receiptId}
`;

  return { to, from, subject, text };
}
