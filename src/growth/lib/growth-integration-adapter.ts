/**
 * Dynasty Works Studio — Growth Operating System
 * Backend Integration Adapter
 *
 * Normalizes lead application data and handles transmission to n8n webhooks,
 * GoHighLevel endpoints, or Supabase edge functions.
 *
 * SECURITY GUARANTEES:
 * 1. Zero hardcoded secrets, GoHighLevel tokens, or Supabase service-role keys in client bundles.
 * 2. Uses VITE_GROWTH_SYSTEM_WEBHOOK_URL environment variable if provided.
 * 3. Gracefully operates in mock mode during local development or when webhook is unconfigured.
 * 4. Includes client honeypot checks and sanitization.
 */

import { getGrowthAttribution, trackGrowthEvent } from './growth-tracking';

export interface GrowthApplicationFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  monthlyMarketingBudget: string;
  primaryGoal: string;
  currentCrm: string;
  leadGenerationMethod: string;
  biggestBottleneck: string;
  notes: string;
  consent: boolean;
  honeypot?: string; // Hidden spam trap field
}

export interface GrowthNormalizedPayload {
  first_name: string;
  last_name: string;
  business_name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  monthly_marketing_budget: string;
  primary_goal: string;
  current_crm: string;
  lead_generation_method: string;
  biggest_bottleneck: string;
  notes: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page: string;
  referrer: string;
  first_touch_url: string;
  campaign_id: string;
  creative_id: string;
  submitted_at: string;
}

export interface GrowthSubmissionResult {
  success: boolean;
  message: string;
  payload?: GrowthNormalizedPayload;
  mock?: boolean;
}

/**
 * Normalizes client form data into the exact required backend payload schema.
 */
export function normalizeGrowthPayload(
  data: GrowthApplicationFormData
): GrowthNormalizedPayload {
  const attribution = getGrowthAttribution();

  return {
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    business_name: data.businessName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    website: data.website.trim(),
    industry: data.industry.trim(),
    monthly_marketing_budget: data.monthlyMarketingBudget.trim(),
    primary_goal: data.primaryGoal.trim(),
    current_crm: data.currentCrm.trim(),
    lead_generation_method: data.leadGenerationMethod.trim(),
    biggest_bottleneck: data.biggestBottleneck.trim(),
    notes: data.notes.trim(),
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    landing_page: attribution.landing_page,
    referrer: attribution.referrer,
    first_touch_url: attribution.first_touch_url,
    campaign_id: attribution.campaign_id,
    creative_id: attribution.creative_id,
    submitted_at: new Date().toISOString(),
  };
}

/**
 * Submits the lead application to the configured webhook or simulated backend.
 */
export async function submitGrowthApplication(
  formData: GrowthApplicationFormData
): Promise<GrowthSubmissionResult> {
  // Honeypot spam protection
  if (formData.honeypot && formData.honeypot.trim().length > 0) {
    console.warn('[DWS Growth Security] Honeypot triggered. Silently dropping bot submission.');
    return {
      success: true,
      message: 'Your review request has been recorded.',
      mock: true,
    };
  }

  // Basic validation
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.businessName.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.industry.trim() ||
    !formData.monthlyMarketingBudget.trim() ||
    !formData.primaryGoal.trim()
  ) {
    return {
      success: false,
      message: 'Please complete all required fields.',
    };
  }

  if (!formData.consent) {
    return {
      success: false,
      message: 'Please agree to the privacy policy and communication terms to proceed.',
    };
  }

  const payload = normalizeGrowthPayload(formData);
  const webhookUrl = (import.meta as { env?: Record<string, string> }).env?.VITE_GROWTH_SYSTEM_WEBHOOK_URL;

  trackGrowthEvent('growth_form_submit', {
    metadata: {
      industry: payload.industry,
      budget: payload.monthly_marketing_budget,
      goal: payload.primary_goal,
    },
  });

  // If a live webhook endpoint is provided (n8n, GHL, AWS Lambda, Supabase edge function)
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Endpoint returned status ${response.status}`);
      }

      trackGrowthEvent('growth_form_success', {
        metadata: {
          submission_mode: 'webhook',
          industry: payload.industry,
        },
      });

      return {
        success: true,
        message: 'Your Growth Review request has been successfully submitted.',
        payload,
        mock: false,
      };
    } catch (error) {
      console.error('[DWS Growth Adapter Error] Failed to submit to webhook endpoint:', error);
      // Fallback response for user confidence
      return {
        success: false,
        message: 'There was a temporary issue transmitting your review request. Please try again or contact us directly.',
      };
    }
  }

  // Safe Mock Mode for local development / testing
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.info('[DWS Growth Adapter] Mock submission payload:', payload);

  trackGrowthEvent('growth_form_success', {
    metadata: {
      submission_mode: 'mock',
      industry: payload.industry,
    },
  });

  return {
    success: true,
    message: 'Growth Review request recorded (Development Mock Mode).',
    payload,
    mock: true,
  };
}
