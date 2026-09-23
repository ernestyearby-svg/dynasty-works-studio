/**
 * Dynasty Works Studio — HighLevel Integration Adapter
 *
 * Prepares and normalizes the MedSpa Growth Plan form submissions
 * for automated ingestion into HighLevel (Contact + Opportunity + Pipeline).
 *
 * SECURITY & ARCHITECTURE GUARANTEES:
 * 1. Zero hard-coded credentials or API tokens in client bundles.
 * 2. Connects to configured webhook or serverless endpoint via VITE_HIGHLEVEL_WEBHOOK_URL.
 * 3. Gracefully operates in mock mode during local development or when webhook is unconfigured.
 */

export interface MedSpaGrowthPlanFormData {
  firstName: string;
  lastName: string;
  practiceName: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  primaryTreatment: string;
  monthlyBudget: string;
  currentLeadVolume: string;
  successCriteria: string;
  consent: boolean;
}

export interface HighLevelContactPayload {
  firstName: string;
  lastName: string;
  name: string;
  companyName: string;
  website?: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  tags: string[];
  customFields: Record<string, string>;
  source: string;
}

export interface HighLevelOpportunityPayload {
  pipelineName: string;
  pipelineStage: string;
  title: string;
  status: 'open';
  monetaryValue?: number;
}

export interface HighLevelSubmissionEnvelope {
  schemaVersion: '1.0.0';
  submittedAt: string;
  contact: HighLevelContactPayload;
  opportunity: HighLevelOpportunityPayload;
  meta: {
    funnel: 'Dynasty MedSpa Growth Engine';
    funnelRoute: '/growth/medspa';
    domain: string;
    userAgent?: string;
  };
}

/**
 * Normalizes user form input into the HighLevel Contact & Opportunity schema.
 */
export function normalizeForHighLevel(
  data: MedSpaGrowthPlanFormData
): HighLevelSubmissionEnvelope {
  const treatmentTag = `treatment:${data.primaryTreatment.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const budgetTag = `budget:${data.monthlyBudget.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return {
    schemaVersion: '1.0.0',
    submittedAt: new Date().toISOString(),
    contact: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      companyName: data.practiceName.trim(),
      website: data.website.trim() || undefined,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      city: data.city.trim(),
      state: data.state.trim().toUpperCase(),
      tags: [
        'dws-lead',
        'medspa-growth-engine',
        'growth-plan-request',
        treatmentTag,
        budgetTag,
      ],
      customFields: {
        dws_primary_treatment: data.primaryTreatment,
        dws_monthly_marketing_budget: data.monthlyBudget,
        dws_current_monthly_lead_volume: data.currentLeadVolume || 'Not provided',
        dws_success_criteria: data.successCriteria.trim() || 'Not specified',
        dws_consent_recorded: data.consent ? 'true' : 'false',
      },
      source: 'Dynasty Works Studio — MedSpa Growth Engine',
    },
    opportunity: {
      pipelineName: 'MedSpa Growth Engine Acquisition Pipeline',
      pipelineStage: 'New Growth Plan Request',
      title: `${data.practiceName.trim()} — Growth Plan Consultation`,
      status: 'open',
    },
    meta: {
      funnel: 'Dynasty MedSpa Growth Engine',
      funnelRoute: '/growth/medspa',
      domain: typeof window !== 'undefined' ? window.location.origin : 'https://dynastyworksstudio.com',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
  };
}

export interface SubmissionResult {
  success: boolean;
  mode: 'live_webhook' | 'local_mock';
  referenceId: string;
  message: string;
  data?: HighLevelSubmissionEnvelope;
}

/**
 * Submits the growth plan request.
 * If VITE_HIGHLEVEL_WEBHOOK_URL is set, sends a POST request.
 * Otherwise, resolves safely in local mock mode with simulated latency.
 */
export async function submitGrowthPlan(
  formData: MedSpaGrowthPlanFormData
): Promise<SubmissionResult> {
  const envelope = normalizeForHighLevel(formData);
  const webhookUrl = (import.meta.env.VITE_HIGHLEVEL_WEBHOOK_URL as string | undefined)?.trim();

  const referenceId = `DWS-MEDSPA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DWS-Source': 'medspa-growth-engine',
        },
        body: JSON.stringify({
          referenceId,
          ...envelope,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      return {
        success: true,
        mode: 'live_webhook',
        referenceId,
        message: 'Your Growth Plan request has been dispatched to our onboarding pipeline.',
        data: envelope,
      };
    } catch (err) {
      console.error('[HighLevel Adapter] Webhook submission error:', err);
      // Return clear error so user is notified
      throw new Error(
        'Unable to complete submission automatically. Please try again or reach out to our team directly.'
      );
    }
  }

  // Local mock / preview fallback
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (import.meta.env.DEV) {
    console.groupCollapsed(`[HighLevel Adapter] 🚀 Simulated Lead Ingestion (${referenceId})`);
    console.log('Normalized HighLevel Envelope:', envelope);
    console.log('To connect live HighLevel ingestion, set VITE_HIGHLEVEL_WEBHOOK_URL in environment.');
    console.groupEnd();
  }

  return {
    success: true,
    mode: 'local_mock',
    referenceId,
    message: 'Growth Plan request captured successfully (preview mode). Ready for HighLevel pipeline ingestion.',
    data: envelope,
  };
}
