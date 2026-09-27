/**
 * Dynasty Works Studio — Fitness Growth Engine™ HighLevel Integration Adapter
 *
 * Prepares and normalizes Fitness Growth Plan form submissions
 * for automated ingestion into HighLevel (Contact + Opportunity + Pipeline).
 *
 * SECURITY & ARCHITECTURE GUARANTEES:
 * 1. Completely isolated from MedSpa adapter and tagging.
 * 2. Zero hard-coded credentials or API tokens in client bundles.
 * 3. Connects to configured webhook or serverless endpoint via VITE_HIGHLEVEL_FITNESS_WEBHOOK_URL.
 * 4. Gracefully operates in mock mode during local development or when webhook is unconfigured.
 */

export interface FitnessGrowthPlanFormData {
  firstName: string;
  lastName: string;
  gymName: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  businessType: string;
  primaryOffer: string;
  monthlyBudget: string;
  currentLeadVolume: string;
  successCriteria: string;
  consent: boolean;
}

export interface HighLevelFitnessContactPayload {
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

export interface HighLevelFitnessOpportunityPayload {
  pipelineName: string;
  pipelineStage: string;
  title: string;
  status: 'open';
  monetaryValue?: number;
}

export interface HighLevelFitnessSubmissionEnvelope {
  schemaVersion: '1.0.0';
  submittedAt: string;
  contact: HighLevelFitnessContactPayload;
  opportunity: HighLevelFitnessOpportunityPayload;
  meta: {
    funnel: 'Dynasty Fitness Growth Engine';
    funnelRoute: '/growth/fitness';
    vertical: 'Fitness';
    domain: string;
    userAgent?: string;
  };
}

/**
 * Normalizes user form input into the HighLevel Contact & Opportunity schema for Fitness.
 */
export function normalizeForHighLevelFitness(
  data: FitnessGrowthPlanFormData
): HighLevelFitnessSubmissionEnvelope {
  const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const fitnessTypeSlug = toSlug(data.businessType);
  const offerSlug = toSlug(data.primaryOffer);
  const budgetSlug = toSlug(data.monthlyBudget);

  return {
    schemaVersion: '1.0.0',
    submittedAt: new Date().toISOString(),
    contact: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      companyName: data.gymName.trim(),
      website: data.website.trim() || undefined,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      city: data.city.trim(),
      state: data.state.trim().toUpperCase(),
      tags: [
        'dws-lead',
        'fitness-growth-engine',
        'growth-plan-request',
        `fitness-type:${fitnessTypeSlug}`,
        `offer:${offerSlug}`,
        `budget:${budgetSlug}`,
      ],
      customFields: {
        dws_vertical: 'Fitness',
        dws_business_type: data.businessType,
        dws_primary_offer: data.primaryOffer,
        dws_monthly_marketing_budget: data.monthlyBudget,
        dws_current_monthly_lead_volume: data.currentLeadVolume || 'Not provided',
        dws_success_criteria: data.successCriteria.trim() || 'Not specified',
        dws_consent_recorded: data.consent ? 'true' : 'false',
        dws_landing_page: '/growth/fitness',
      },
      source: 'Dynasty Fitness Growth Engine',
    },
    opportunity: {
      pipelineName: 'Fitness Growth Engine Acquisition Pipeline',
      pipelineStage: 'New Growth Plan Request',
      title: `${data.gymName.trim()} — Growth Plan Consultation`,
      status: 'open',
    },
    meta: {
      funnel: 'Dynasty Fitness Growth Engine',
      funnelRoute: '/growth/fitness',
      vertical: 'Fitness',
      domain: typeof window !== 'undefined' ? window.location.origin : 'https://dynastyworksstudio.com',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
  };
}

export interface FitnessSubmissionResult {
  success: boolean;
  mode: 'live_webhook' | 'local_mock';
  referenceId: string;
  message: string;
  data?: HighLevelFitnessSubmissionEnvelope;
}

/**
 * Submits the fitness growth plan request.
 * If VITE_HIGHLEVEL_FITNESS_WEBHOOK_URL is configured, dispatches a POST request.
 * Otherwise, resolves safely in local mock mode with simulated latency.
 */
export async function submitFitnessGrowthPlan(
  formData: FitnessGrowthPlanFormData
): Promise<FitnessSubmissionResult> {
  const envelope = normalizeForHighLevelFitness(formData);
  const envWebhook =
    typeof import.meta !== 'undefined'
      ? ((import.meta as any).env?.VITE_HIGHLEVEL_FITNESS_WEBHOOK_URL as string | undefined)
      : undefined;
  const webhookUrl = envWebhook?.trim();

  const referenceId = `DWS-FITNESS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DWS-Source': 'fitness-growth-engine',
          'X-DWS-Vertical': 'fitness',
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
      console.error('[HighLevel Fitness Adapter] Webhook submission error:', err);
      throw new Error(
        'Unable to complete submission automatically. Please try again or reach out to our team directly.'
      );
    }
  }

  // Local mock / preview fallback with simulated latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.groupCollapsed(`[HighLevel Fitness Adapter] 🏋️ Simulated Lead Ingestion (${referenceId})`);
    console.log('Normalized HighLevel Envelope:', envelope);
    console.log('To connect live HighLevel ingestion, set VITE_HIGHLEVEL_FITNESS_WEBHOOK_URL in environment.');
    console.groupEnd();
  }

  return {
    success: true,
    mode: 'local_mock',
    referenceId,
    message: 'Fitness Growth Plan request captured successfully (preview mode). Ready for HighLevel pipeline ingestion.',
    data: envelope,
  };
}
