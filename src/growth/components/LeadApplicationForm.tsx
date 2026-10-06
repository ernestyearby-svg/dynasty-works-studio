import React, { useState, useEffect } from 'react';
import {
  submitGrowthApplication,
  buildBookingRedirectUrl,
  type GrowthApplicationFormData,
} from '../lib/growth-integration-adapter';
import { trackGrowthEvent } from '../lib/growth-tracking';

interface LeadApplicationFormProps {
  onSuccessRedirect?: string;
  isStandalone?: boolean;
}

const industries = [
  'Automotive',
  'MedSpa / Aesthetics',
  'Fitness / Gym',
  'Restaurant / Hospitality',
  'Professional Services',
  'Consumer Brand',
  'Real Estate',
  'Home Services',
  'Other',
];

const budgetTiers = [
  'Under $1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  '$5,000–$10,000',
  '$10,000+',
  'Not currently advertising',
];

const primaryGoals = [
  'Generate More Leads',
  'Book More Appointments',
  'Improve Follow-Up',
  'Build/Replace Website',
  'Install CRM',
  'Automate Sales Process',
  'Improve Advertising',
  'Track ROI',
  'Full Growth System',
  'Other',
];

const stepLabels = [
  { num: '01', title: 'COMPANY' },
  { num: '02', title: 'ACQUISITION' },
  { num: '03', title: 'SALES SYSTEM' },
  { num: '04', title: 'GROWTH OBJECTIVE' },
  { num: '05', title: 'CONTACT & VERIFICATION' },
];

export const LeadApplicationForm: React.FC<LeadApplicationFormProps> = ({
  onSuccessRedirect = '/growth/book',
  isStandalone = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GrowthApplicationFormData>({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    monthlyMarketingBudget: '',
    primaryGoal: '',
    currentCrm: '',
    leadGenerationMethod: '',
    biggestBottleneck: '',
    notes: '',
    consent: true,
    honeypot: '',
  });

  const [selectedTierInfo, setSelectedTierInfo] = useState<{
    tierKey: string;
    title: string;
    adBudget: string;
    totalInvestment: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const tier = sp.get('tier')?.toLowerCase();
      if (tier === 'starter') {
        setSelectedTierInfo({
          tierKey: 'starter',
          title: 'Starter',
          adBudget: '$250/mo Client Ad Budget',
          totalInvestment: '$749/mo Total Monthly Investment ($499 DWS + $250 Media)',
        });
        setFormData((prev) => ({
          ...prev,
          monthlyMarketingBudget: prev.monthlyMarketingBudget || 'Under $1,000',
          notes: prev.notes
            ? prev.notes
            : 'Target Growth Level: Starter ($250/mo Ad Budget + $499/mo DWS = $749/mo Total Monthly Investment)',
        }));
      } else if (tier === 'growth') {
        setSelectedTierInfo({
          tierKey: 'growth',
          title: 'Growth — Recommended',
          adBudget: '$500/mo Client Ad Budget',
          totalInvestment: '$999/mo Total Monthly Investment ($499 DWS + $500 Media)',
        });
        setFormData((prev) => ({
          ...prev,
          monthlyMarketingBudget: prev.monthlyMarketingBudget || 'Under $1,000',
          notes: prev.notes
            ? prev.notes
            : 'Target Growth Level: Growth [Recommended] ($500/mo Ad Budget + $499/mo DWS = $999/mo Total Monthly Investment)',
        }));
      } else if (tier === 'accelerate') {
        setSelectedTierInfo({
          tierKey: 'accelerate',
          title: 'Accelerate',
          adBudget: '$1,000+/mo Client Ad Budget',
          totalInvestment: '$1,499+/mo Total Monthly Investment ($499 DWS + $1,000+ Media)',
        });
        setFormData((prev) => ({
          ...prev,
          monthlyMarketingBudget: prev.monthlyMarketingBudget || '$1,000–$2,500',
          notes: prev.notes
            ? prev.notes
            : 'Target Growth Level: Accelerate ($1,000+/mo Ad Budget + $499/mo DWS = $1,499+/mo Total Monthly Investment)',
        }));
      }
    }
  }, []);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (!hasStarted) {
      setHasStarted(true);
      trackGrowthEvent('growth_review_started', {
        page: isStandalone ? '/growth/apply' : '/growth',
        step: 'company',
      });
      trackGrowthEvent('growth_form_start', {
        page: isStandalone ? '/growth/apply' : '/growth',
        step: 'company',
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Please enter your business name';
      if (!formData.industry) newErrors.industry = 'Please select your industry';
    } else if (step === 2) {
      if (!formData.monthlyMarketingBudget)
        newErrors.monthlyMarketingBudget = 'Please select your monthly marketing budget';
    } else if (step === 3) {
      // Step 3 optional fields, but validate if needed
    } else if (step === 4) {
      if (!formData.primaryGoal) newErrors.primaryGoal = 'Please select your primary growth goal';
    } else if (step === 5) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Mobile phone is required';
      if (!formData.consent) newErrors.consent = 'Please agree to terms to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitGrowthApplication(formData);

      if (result.success) {
        const isHoneypot = Boolean(formData.honeypot && formData.honeypot.trim().length > 0) || !result.payload;
        const redirectUrl = buildBookingRedirectUrl(onSuccessRedirect, formData, isHoneypot);
        window.location.href = redirectUrl;
      } else {
        setErrorMessage(result.message || 'Submission failed. Please check your inputs.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="growth-diagnostic-wrap" id="growth-review-diagnostic">
      {/* 5-Step Progress Indicators */}
      <div className="growth-diagnostic-progress-bar" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={5}>
        {stepLabels.map((st, i) => (
          <div
            key={st.num}
            className={`growth-diagnostic-step-pill ${i + 1 <= currentStep ? 'complete' : ''}`}
            title={`Step ${st.num}: ${st.title}`}
          />
        ))}
      </div>

      {selectedTierInfo && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            padding: '7px 14px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: '#d4af37',
            marginBottom: '16px',
            maxWidth: '100%',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: '#10b981', fontSize: '10px' }}>●</span>
          <span>SELECTED GROWTH LEVEL: <strong>{selectedTierInfo.title.toUpperCase()}</strong> ({selectedTierInfo.totalInvestment})</span>
        </div>
      )}

      <div className="growth-diagnostic-step-kicker">
        STEP 0{currentStep} OF 05 · {stepLabels[currentStep - 1].title}
      </div>

      {errorMessage && (
        <div
          role="alert"
          style={{
            background: 'rgba(224, 68, 68, 0.1)',
            border: '1px solid #e04444',
            padding: '14px 18px',
            color: '#ff8a8a',
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Hidden Honeypot Field */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="website_confirm">Leave this field blank</label>
          <input
            type="text"
            id="website_confirm"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleFieldChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* STEP 01 — COMPANY */}
        {currentStep === 1 && (
          <div>
            <h3 className="growth-diagnostic-question">
              Tell us about your business.
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-businessName">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="field-businessName"
                  name="businessName"
                  className={`growth-diagnostic-input ${errors.businessName ? 'error' : ''}`}
                  placeholder="e.g. Apex Performance Studio"
                  value={formData.businessName}
                  onChange={handleFieldChange}
                  autoFocus
                />
                {errors.businessName && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.businessName}</div>}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-industry">
                  Industry *
                </label>
                <select
                  id="field-industry"
                  name="industry"
                  className={`growth-diagnostic-select ${errors.industry ? 'error' : ''}`}
                  value={formData.industry}
                  onChange={handleFieldChange}
                >
                  <option value="">Select your commercial vertical...</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                {errors.industry && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.industry}</div>}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-website">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  id="field-website"
                  name="website"
                  className="growth-diagnostic-input"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 02 — ACQUISITION */}
        {currentStep === 2 && (
          <div>
            <h3 className="growth-diagnostic-question">
              How do you currently acquire customers?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-monthlyMarketingBudget">
                  Monthly Marketing Budget *
                </label>
                <select
                  id="field-monthlyMarketingBudget"
                  name="monthlyMarketingBudget"
                  className={`growth-diagnostic-select ${errors.monthlyMarketingBudget ? 'error' : ''}`}
                  value={formData.monthlyMarketingBudget}
                  onChange={handleFieldChange}
                  autoFocus
                >
                  <option value="">Select your monthly advertising budget...</option>
                  {budgetTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
                {errors.monthlyMarketingBudget && (
                  <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.monthlyMarketingBudget}</div>
                )}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-leadGenerationMethod">
                  Current Lead Generation Channels
                </label>
                <textarea
                  id="field-leadGenerationMethod"
                  name="leadGenerationMethod"
                  className="growth-diagnostic-textarea"
                  placeholder="e.g. Referrals, local Meta ads, Google Search, agency retainer..."
                  value={formData.leadGenerationMethod}
                  onChange={handleFieldChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 03 — SALES SYSTEM */}
        {currentStep === 3 && (
          <div>
            <h3 className="growth-diagnostic-question">
              Where do opportunities stall?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-currentCrm">
                  Current CRM / Lead Tracking Tool
                </label>
                <input
                  type="text"
                  id="field-currentCrm"
                  name="currentCrm"
                  className="growth-diagnostic-input"
                  placeholder="e.g. HubSpot, GoHighLevel, None / Spreadsheets"
                  value={formData.currentCrm}
                  onChange={handleFieldChange}
                  autoFocus
                />
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-biggestBottleneck">
                  Biggest Growth Bottleneck
                </label>
                <textarea
                  id="field-biggestBottleneck"
                  name="biggestBottleneck"
                  className="growth-diagnostic-textarea"
                  placeholder="e.g. Qualified inquiries slipping away before booking, slow manual response times, blind ad attribution..."
                  value={formData.biggestBottleneck}
                  onChange={handleFieldChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 04 — GROWTH OBJECTIVE */}
        {currentStep === 4 && (
          <div>
            <h3 className="growth-diagnostic-question">
              What is your primary growth goal?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-primaryGoal">
                  Primary Objective *
                </label>
                <select
                  id="field-primaryGoal"
                  name="primaryGoal"
                  className={`growth-diagnostic-select ${errors.primaryGoal ? 'error' : ''}`}
                  value={formData.primaryGoal}
                  onChange={handleFieldChange}
                  autoFocus
                >
                  <option value="">Select your primary strategic objective...</option>
                  {primaryGoals.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
                {errors.primaryGoal && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.primaryGoal}</div>}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-notes">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="field-notes"
                  name="notes"
                  className="growth-diagnostic-textarea"
                  placeholder="Any specific targets, timeline constraints, or existing software requirements..."
                  value={formData.notes}
                  onChange={handleFieldChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 05 — CONTACT & VERIFICATION */}
        {currentStep === 5 && (
          <div>
            <h3 className="growth-diagnostic-question">
              Where should we send your growth audit?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-firstName">
                  First Name *
                </label>
                <input
                  type="text"
                  id="field-firstName"
                  name="firstName"
                  className={`growth-diagnostic-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="e.g. Marcus"
                  value={formData.firstName}
                  onChange={handleFieldChange}
                  autoFocus
                />
                {errors.firstName && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.firstName}</div>}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-lastName">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="field-lastName"
                  name="lastName"
                  className={`growth-diagnostic-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="e.g. Vance"
                  value={formData.lastName}
                  onChange={handleFieldChange}
                />
                {errors.lastName && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.lastName}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label className="growth-eyebrow" htmlFor="field-email">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="field-email"
                  name="email"
                  className={`growth-diagnostic-input ${errors.email ? 'error' : ''}`}
                  placeholder="marcus@apexperformance.com"
                  value={formData.email}
                  onChange={handleFieldChange}
                />
                {errors.email && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.email}</div>}
              </div>

              <div>
                <label className="growth-eyebrow" htmlFor="field-phone">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  id="field-phone"
                  name="phone"
                  className={`growth-diagnostic-input ${errors.phone ? 'error' : ''}`}
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={handleFieldChange}
                />
                {errors.phone && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '6px' }}>{errors.phone}</div>}
              </div>
            </div>

            {/* Consent Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: '20px 0' }}>
              <input
                type="checkbox"
                id="field-consent"
                name="consent"
                checked={formData.consent}
                onChange={handleFieldChange}
                style={{ marginTop: '4px', accentColor: 'var(--dws-signal)', width: '16px', height: '16px' }}
              />
              <label htmlFor="field-consent" style={{ fontSize: '12px', color: '#8c8f9a', lineHeight: '1.5' }}>
                I consent to receive diagnostic assessments and strategic follow-up communications from Dynasty Works Studio.
                Review our <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dws-signal)' }}>Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dws-signal)' }}>Terms of Service</a>.
              </label>
            </div>
            {errors.consent && <div style={{ color: '#e04444', fontSize: '12px', marginTop: '-12px', marginBottom: '16px' }}>{errors.consent}</div>}
          </div>
        )}

        {/* Action Controls */}
        <div className="growth-diagnostic-actions">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="growth-btn growth-btn-outline-dark"
              style={{ minHeight: '48px', padding: '12px 20px', fontSize: '11px' }}
            >
              ← BACK
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="growth-btn growth-btn-signal"
              style={{ minHeight: '48px', padding: '12px 28px', fontSize: '11px' }}
            >
              <span>CONTINUE TO STEP 0{currentStep + 1}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="growth-btn growth-btn-signal"
              style={{ minHeight: '52px', padding: '14px 32px', fontSize: '12px' }}
            >
              <span>{isSubmitting ? 'TRANSMITTING AUDIT...' : 'REQUEST MY GROWTH REVIEW'}</span>
              <span className="arrow" aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
