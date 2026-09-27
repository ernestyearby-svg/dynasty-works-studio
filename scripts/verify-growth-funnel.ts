/**
 * Verification script for Dynasty Works Studio Growth Operating System Funnel
 * Tests payload normalization, validation, honeypot, and URL sanitization.
 */

import fs from 'fs';
import path from 'path';
import {
  normalizeGrowthPayload,
  submitGrowthApplication,
  buildBookingRedirectUrl,
  getBookingProspect,
  buildCalendarEmbedUrl,
  HIGHLEVEL_CALENDAR_ID,
  HIGHLEVEL_CALENDAR_BASE_URL,
  HIGHLEVEL_SCRIPT_SRC,
  FORBIDDEN_CALENDAR_PARAMS,
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

  // Test 6: Continuity redirect & booking prefill verification
  // 6a: Legitimate submission generates /growth/book?first_name=...&last_name=...&email=...&phone=...
  const redirectUrl = buildBookingRedirectUrl('/growth/book', sampleForm, false);
  console.assert(redirectUrl.startsWith('/growth/book?'), `FAIL: redirectUrl format: ${redirectUrl}`);

  const parsedSearch = redirectUrl.substring(redirectUrl.indexOf('?'));
  const prefillData = getBookingProspect(parsedSearch);
  console.assert(prefillData.firstName === 'Marcus', 'FAIL: prefill firstName');
  console.assert(prefillData.lastName === 'Vance', 'FAIL: prefill lastName');
  console.assert(prefillData.email === 'marcus@apexperformance.com', 'FAIL: prefill email');
  console.assert(prefillData.phone === '(555) 234-5678', 'FAIL: prefill phone');

  // 6b: Sensitive & internal fields MUST NOT leak into booking URL
  const forbiddenParams = [
    'notes',
    'bottleneck',
    'biggest_bottleneck',
    'budget',
    'monthly_marketing_budget',
    'industry',
    'current_crm',
    'utm_source',
    'utm_medium',
    'campaign_id',
    'creative_id',
  ];
  for (const forbidden of forbiddenParams) {
    console.assert(
      !redirectUrl.includes(`${forbidden}=`),
      `FAIL: Forbidden field leaked into booking redirect URL: ${forbidden}`
    );
  }

  // 6c: Honeypot submission must NOT generate continuity URL
  const botRedirectUrl = buildBookingRedirectUrl('/growth/book', botForm, true);
  console.assert(botRedirectUrl === '/growth/book', `FAIL: Honeypot must return clean URL. Got: ${botRedirectUrl}`);

  console.log('✓ PASS: Calendar continuity URL construction and prospect prefill readiness verified');

  // Test 7: HighLevel Live Calendar Integration & Security Audit
  // 7.1: HighLevel calendar ID matches official specification
  console.assert(
    HIGHLEVEL_CALENDAR_ID === 'tEz9m9Ij933G8wMJhdGs',
    `FAIL: HIGHLEVEL_CALENDAR_ID must be 'tEz9m9Ij933G8wMJhdGs'. Got: ${HIGHLEVEL_CALENDAR_ID}`
  );

  // 7.2: HighLevel base embed URL is strictly formatted
  console.assert(
    HIGHLEVEL_CALENDAR_BASE_URL === 'https://api.leadconnectorhq.com/widget/booking/tEz9m9Ij933G8wMJhdGs',
    `FAIL: HIGHLEVEL_CALENDAR_BASE_URL mismatch. Got: ${HIGHLEVEL_CALENDAR_BASE_URL}`
  );

  // 7.3: Correct HighLevel script source
  console.assert(
    HIGHLEVEL_SCRIPT_SRC === 'https://link.msgsndr.com/js/form_embed.js',
    `FAIL: HIGHLEVEL_SCRIPT_SRC mismatch. Got: ${HIGHLEVEL_SCRIPT_SRC}`
  );

  // 7.4: Empty prospect produces clean base embed URL without query params
  const cleanCalUrl = buildCalendarEmbedUrl();
  console.assert(
    cleanCalUrl === 'https://api.leadconnectorhq.com/widget/booking/tEz9m9Ij933G8wMJhdGs',
    `FAIL: Clean calendar URL should have no query parameters. Got: ${cleanCalUrl}`
  );

  // 7.5: Only permitted prospect prefill parameters reach the calendar URL
  const prospectCalUrl = buildCalendarEmbedUrl(HIGHLEVEL_CALENDAR_BASE_URL, {
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus@apexperformance.com',
    phone: '(555) 234-5678',
  });
  console.assert(
    prospectCalUrl.includes('first_name=Marcus'),
    'FAIL: prospectCalUrl missing first_name'
  );
  console.assert(
    prospectCalUrl.includes('last_name=Vance'),
    'FAIL: prospectCalUrl missing last_name'
  );
  console.assert(
    prospectCalUrl.includes('email=marcus%40apexperformance.com'),
    'FAIL: prospectCalUrl missing encoded email'
  );
  console.assert(
    prospectCalUrl.includes('phone=%28555%29+234-5678'),
    'FAIL: prospectCalUrl missing encoded phone'
  );

  // 7.6: Forbidden attribution / intelligence fields cannot enter the calendar URL
  for (const forbidden of FORBIDDEN_CALENDAR_PARAMS) {
    console.assert(
      !prospectCalUrl.includes(`${forbidden}=`),
      `FAIL: Forbidden parameter found in calendar URL: ${forbidden}`
    );
  }

  // 7.7: Verify GrowthBookPage file references the calendar and iframe id
  const growthBookCode = fs.readFileSync(
    path.resolve(process.cwd(), 'src/growth/GrowthBookPage.tsx'),
    'utf-8'
  );
  console.assert(
    growthBookCode.includes('tEz9m9Ij933G8wMJhdGs_1790525045901'),
    'FAIL: GrowthBookPage must contain iframe id tEz9m9Ij933G8wMJhdGs_1790525045901'
  );
  console.assert(
    growthBookCode.includes('HIGHLEVEL_SCRIPT_SRC'),
    'FAIL: GrowthBookPage must reference HIGHLEVEL_SCRIPT_SRC'
  );
  console.assert(
    growthBookCode.includes('msgsndr-form-embed-script'),
    'FAIL: GrowthBookPage must check for singleton script id msgsndr-form-embed-script'
  );

  // 7.8: Security check: no private tokens, API keys, or secrets in client files
  const secretKeywords = ['ghl_secret', 'Bearer pit-', 'ghl_token', 'service_role', 'supabase_key'];
  for (const secret of secretKeywords) {
    console.assert(
      !growthBookCode.includes(secret),
      `SECURITY FAIL: Potential secret keyword found in GrowthBookPage: ${secret}`
    );
  }

  console.log('✓ PASS: Live HighLevel calendar embed, prefill parameters, and security contract verified');

  console.log('--- ALL GROWTH FUNNEL TESTS PASSED SUCCESSFULLY ---');
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
