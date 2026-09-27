import React, { useState } from 'react';
import {
  submitGrowthApplication,
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

export const LeadApplicationForm: React.FC<LeadApplicationFormProps> = ({
  onSuccessRedirect = '/growth/book',
  isStandalone = false,
}) => {
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (!hasStarted) {
      setHasStarted(true);
      trackGrowthEvent('growth_form_start', {
        page: isStandalone ? '/growth/apply' : '/growth',
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Mobile phone number is required';
    if (!formData.industry) newErrors.industry = 'Please select your industry';
    if (!formData.monthlyMarketingBudget)
      newErrors.monthlyMarketingBudget = 'Please select your marketing budget';
    if (!formData.primaryGoal) newErrors.primaryGoal = 'Please select your primary goal';
    if (!formData.consent)
      newErrors.consent = 'You must accept the communication consent to proceed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) element.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitGrowthApplication(formData);

      if (result.success) {
        // Redirect to booking route as designated
        window.location.href = onSuccessRedirect;
      } else {
        setErrorMessage(result.message || 'Submission failed. Please check your answers.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="growth-form-card" id="growth-review-form">
      {errorMessage && (
        <div
          role="alert"
          style={{
            background: 'rgba(224, 82, 82, 0.1)',
            border: '1px solid #e05252',
            borderRadius: 'var(--dws-radius-sm)',
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

        {/* Row 1: Name */}
        <div className="growth-grid-2">
          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-firstName">
              First Name <span className="growth-label-required">*</span>
            </label>
            <input
              type="text"
              id="field-firstName"
              name="firstName"
              className={`growth-input ${errors.firstName ? 'error' : ''}`}
              placeholder="e.g. Marcus"
              value={formData.firstName}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <div className="growth-error-msg">{errors.firstName}</div>}
          </div>

          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-lastName">
              Last Name <span className="growth-label-required">*</span>
            </label>
            <input
              type="text"
              id="field-lastName"
              name="lastName"
              className={`growth-input ${errors.lastName ? 'error' : ''}`}
              placeholder="e.g. Vance"
              value={formData.lastName}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <div className="growth-error-msg">{errors.lastName}</div>}
          </div>
        </div>

        {/* Row 2: Business & Website */}
        <div className="growth-grid-2">
          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-businessName">
              Business Name <span className="growth-label-required">*</span>
            </label>
            <input
              type="text"
              id="field-businessName"
              name="businessName"
              className={`growth-input ${errors.businessName ? 'error' : ''}`}
              placeholder="e.g. Apex Performance"
              value={formData.businessName}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.businessName}
            />
            {errors.businessName && <div className="growth-error-msg">{errors.businessName}</div>}
          </div>

          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-website">
              Website
            </label>
            <input
              type="url"
              id="field-website"
              name="website"
              className="growth-input"
              placeholder="https://yourcompany.com"
              value={formData.website}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Row 3: Email & Phone */}
        <div className="growth-grid-2">
          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-email">
              Email Address <span className="growth-label-required">*</span>
            </label>
            <input
              type="email"
              id="field-email"
              name="email"
              className={`growth-input ${errors.email ? 'error' : ''}`}
              placeholder="marcus@apexperformance.com"
              value={formData.email}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && <div className="growth-error-msg">{errors.email}</div>}
          </div>

          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-phone">
              Mobile Phone <span className="growth-label-required">*</span>
            </label>
            <input
              type="tel"
              id="field-phone"
              name="phone"
              className={`growth-input ${errors.phone ? 'error' : ''}`}
              placeholder="(555) 000-0000"
              value={formData.phone}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <div className="growth-error-msg">{errors.phone}</div>}
          </div>
        </div>

        {/* Row 4: Industry & Budget */}
        <div className="growth-grid-2">
          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-industry">
              Industry <span className="growth-label-required">*</span>
            </label>
            <select
              id="field-industry"
              name="industry"
              className={`growth-select ${errors.industry ? 'error' : ''}`}
              value={formData.industry}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.industry}
            >
              <option value="">Select your industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && <div className="growth-error-msg">{errors.industry}</div>}
          </div>

          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-monthlyMarketingBudget">
              Monthly Marketing Budget <span className="growth-label-required">*</span>
            </label>
            <select
              id="field-monthlyMarketingBudget"
              name="monthlyMarketingBudget"
              className={`growth-select ${errors.monthlyMarketingBudget ? 'error' : ''}`}
              value={formData.monthlyMarketingBudget}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.monthlyMarketingBudget}
            >
              <option value="">Select budget tier...</option>
              {budgetTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
            {errors.monthlyMarketingBudget && (
              <div className="growth-error-msg">{errors.monthlyMarketingBudget}</div>
            )}
          </div>
        </div>

        {/* Row 5: Primary Goal & Current CRM */}
        <div className="growth-grid-2">
          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-primaryGoal">
              Primary Goal <span className="growth-label-required">*</span>
            </label>
            <select
              id="field-primaryGoal"
              name="primaryGoal"
              className={`growth-select ${errors.primaryGoal ? 'error' : ''}`}
              value={formData.primaryGoal}
              onChange={handleFieldChange}
              aria-required="true"
              aria-invalid={!!errors.primaryGoal}
            >
              <option value="">Select primary goal...</option>
              {primaryGoals.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            {errors.primaryGoal && <div className="growth-error-msg">{errors.primaryGoal}</div>}
          </div>

          <div className="growth-form-group">
            <label className="growth-label" htmlFor="field-currentCrm">
              Current CRM
            </label>
            <input
              type="text"
              id="field-currentCrm"
              name="currentCrm"
              className="growth-input"
              placeholder="e.g. HubSpot, GoHighLevel, None / Spreadsheets"
              value={formData.currentCrm}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Lead Generation Method */}
        <div className="growth-form-group">
          <label className="growth-label" htmlFor="field-leadGenerationMethod">
            How Are You Currently Generating Leads?
          </label>
          <textarea
            id="field-leadGenerationMethod"
            name="leadGenerationMethod"
            className="growth-textarea"
            placeholder="e.g. Referrals, local Meta ads, Google search, agency retainer, or cold outreach..."
            value={formData.leadGenerationMethod}
            onChange={handleFieldChange}
          />
        </div>

        {/* Biggest Growth Bottleneck */}
        <div className="growth-form-group">
          <label className="growth-label" htmlFor="field-biggestBottleneck">
            Biggest Growth Bottleneck?
          </label>
          <textarea
            id="field-biggestBottleneck"
            name="biggestBottleneck"
            className="growth-textarea"
            placeholder="e.g. Leads slipping away before booking, slow manual follow-up, inability to track which ad produces revenue..."
            value={formData.biggestBottleneck}
            onChange={handleFieldChange}
          />
        </div>

        {/* Anything Else */}
        <div className="growth-form-group">
          <label className="growth-label" htmlFor="field-notes">
            Anything Else We Should Know?
          </label>
          <textarea
            id="field-notes"
            name="notes"
            className="growth-textarea"
            placeholder="Any specific targets, timeline constraints, or existing tool integrations..."
            value={formData.notes}
            onChange={handleFieldChange}
            style={{ minHeight: '70px' }}
          />
        </div>

        {/* Configurable Consent Area */}
        <div className="growth-checkbox-wrap">
          <input
            type="checkbox"
            id="field-consent"
            name="consent"
            checked={formData.consent}
            onChange={handleFieldChange}
            aria-required="true"
          />
          <label htmlFor="field-consent" className="growth-consent-text">
            By requesting this review, you consent to receive strategic follow-up communications, SMS
            confirmations, and diagnostic assessments from Dynasty Works Studio regarding your business
            growth infrastructure. You may opt out at any time. Review our{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            .
          </label>
        </div>
        {errors.consent && <div className="growth-error-msg" style={{ marginTop: '-16px', marginBottom: '20px' }}>{errors.consent}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="growth-btn growth-btn-primary"
          style={{ width: '100%', padding: '16px 28px', fontSize: '14px', letterSpacing: '0.1em' }}
        >
          {isSubmitting ? 'TRANSMITTING AUDIT DATA...' : 'REQUEST MY GROWTH REVIEW'}
        </button>
      </form>
    </div>
  );
};
