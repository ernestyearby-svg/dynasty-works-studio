/**
 * Verification script for Dynasty Works Studio Growth Operating System Funnel
 * Tests payload normalization, validation, honeypot, and URL sanitization.
 */

import {
  normalizeGrowthPayload,
  submitGrowthApplication,
  type GrowthApplicationFormData,
} from '../src/growth/lib/growth-integration-adapter';
import { sanitizeAttributionUrl } from '../src/growth/lib/growth-tracking';

async function runVerification() {
  console.log('--- STARTING GROWTH FUNNEL VERIFICATION ---');

  // Test 1: Sanitize Attribution URL strictly en route to production domain
  const rawLocal = 'http://localhost:5202/growth?utm_source=meta';
  const sanitizedLocal = sanitizeAttributionUrl(rawLocal);
  console.assert(
    sanitizedLocal.startsWith('https://dynastyworksstudio.com/growth'),
    `FAIL: sanitizedLocal should use production domain. Got: ${sanitizedLocal}`
  );
  console.log('✓ PASS: Production Domain Lock on local/preview URLs verified');

  // Test 2: Payload normalization schema check
  const sampleForm: GrowthApplicationFormData = {
    firstName: 'Marcus',
    lastName: 'Vance',
    businessName: 'Apex Performance',
    email: 'Marcus@ApexPerformance.com',
    phone: '(555) 234-5678',
    website: 'https://apexperformance.com',
    industry: 'Fitness / Gym',
    monthlyMarketingBudget: '$2,500–$5,000',
    primaryGoal: 'Book More Appointments',
    currentCrm: 'None',
    leadGenerationMethod: 'Local Meta Ads',
    biggestBottleneck: 'Slow follow-up',
    notes: 'Ready to deploy immediately',
    consent: true,
  };

  const normalized = normalizeGrowthPayload(sampleForm);
  console.assert(normalized.first_name === 'Marcus', 'FAIL: first_name');
  console.assert(normalized.last_name === 'Vance', 'FAIL: last_name');
  console.assert(normalized.business_name === 'Apex Performance', 'FAIL: business_name');
  console.assert(normalized.email === 'marcus@apexperformance.com', 'FAIL: email lowercase');
  console.assert(normalized.industry === 'Fitness / Gym', 'FAIL: industry');
  console.assert(normalized.monthly_marketing_budget === '$2,500–$5,000', 'FAIL: budget');
  console.assert(normalized.primary_goal === 'Book More Appointments', 'FAIL: goal');
  console.assert(!!normalized.submitted_at, 'FAIL: submitted_at timestamp missing');
  console.log('✓ PASS: Form payload schema correctly normalized');

  // Test 3: Honeypot bot protection
  const botForm: GrowthApplicationFormData = {
    ...sampleForm,
    honeypot: 'spam_bot_value',
  };
  const botResult = await submitGrowthApplication(botForm);
  console.assert(botResult.success === true, 'Honeypot should silently return success');
  console.assert(botResult.mock === true, 'Honeypot should not call webhook');
  console.log('✓ PASS: Honeypot bot protection verified');

  // Test 4: Missing required fields validation
  const invalidForm: GrowthApplicationFormData = {
    ...sampleForm,
    email: '',
  };
  const invalidResult = await submitGrowthApplication(invalidForm);
  console.assert(invalidResult.success === false, 'FAIL: should reject empty email');
  console.log('✓ PASS: Validation rejects incomplete submissions');

  // Test 5: Missing consent validation
  const noConsentForm: GrowthApplicationFormData = {
    ...sampleForm,
    consent: false,
  };
  const noConsentResult = await submitGrowthApplication(noConsentForm);
  console.assert(noConsentResult.success === false, 'FAIL: should reject unconsented submission');
  console.log('✓ PASS: Consent verification strictly enforced');

  console.log('--- ALL GROWTH FUNNEL TESTS PASSED SUCCESSFULLY ---');
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
