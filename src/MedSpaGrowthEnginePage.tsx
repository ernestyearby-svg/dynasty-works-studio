import React, { useState, useEffect, useRef } from 'react';
import './medspa-growth-engine.css';
import { trackMedspaEvent } from './lib/medspa-analytics';
import {
  submitGrowthPlan,
  type MedSpaGrowthPlanFormData,
  type SubmissionResult,
} from './lib/highlevel-adapter';

// Checkmark Icon
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Arrow Right Icon
const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const treatments = [
  'Injectables',
  'Laser',
  'Body Contouring',
  'Skin / Facial',
  'Hair Restoration',
  'Weight Management',
  'Other',
];

const budgetTiers = [
  'Under $1,500',
  '$1,500–$3,000',
  '$3,000–$5,000',
  '$5,000–$10,000',
  '$10,000+',
];

const leadVolumes = [
  '0–25',
  '26–50',
  '51–100',
  '101–250',
  '250+',
  'Not Sure',
];

// Interactive Patient Journey Stages
const journeyStages = [
  {
    id: 'targeted-ad',
    num: '01',
    name: 'Targeted Ad',
    kicker: 'Step 01 / Patient Acquisition',
    title: 'Targeted Treatment Campaigns',
    description:
      'Targeted campaigns reach high-intent prospective patients seeking specific aesthetic procedures, eliminating wasted budget on untargeted impressions.',
    features: [
      'Treatment-specific positioning and offer design',
      'Exclusion of non-qualified and low-intent audiences',
      'Immediate routing into structured conversion flow',
    ],
    metricLabel: 'Attribution',
    metricValue: 'End-to-End Tracking',
  },
  {
    id: 'treatment-page',
    num: '02',
    name: 'Treatment Page',
    kicker: 'Step 02 / Conversion Experience',
    title: 'Dedicated Treatment Pages',
    description:
      'Focused landing experiences showcase practice credibility, clinician standards, and treatment details without distracting navigation.',
    features: [
      'Quiet-luxury medical aesthetic design standard',
      'Clear consultation expectations & clinician standards',
      'High-speed mobile optimization and clean consultation flows',
    ],
    metricLabel: 'Conversion Focus',
    metricValue: 'Single-Action Design',
  },
  {
    id: 'lead-capture',
    num: '03',
    name: 'Lead Capture',
    kicker: 'Step 03 / Inquiry Routing',
    title: 'Inquiry Capture & CRM Sync',
    description:
      'Captures consultation intent, specific aesthetic goals, and contact details with instant field validation and real-time CRM ingestion.',
    features: [
      'Instant verification and duplicate prevention',
      'Automated routing into HighLevel pipeline architecture',
      'Immediate lead source and campaign attribution logging',
    ],
    metricLabel: 'Data Flow',
    metricValue: 'Immediate CRM Ingestion',
  },
  {
    id: 'immediate-followup',
    num: '04',
    name: 'Immediate Follow-Up',
    kicker: 'Step 04 / Automated Response',
    title: 'Immediate Multi-Channel Follow-Up',
    description:
      'Inquiries are acknowledged immediately via personalized SMS and email sequences, dramatically reducing lead drop-off.',
    features: [
      'Immediate SMS confirmation and clinician availability notice',
      'Direct scheduling link sent before interest cools',
      'Structured multi-touch follow-up sequence for non-schedulers',
    ],
    metricLabel: 'Response Protocol',
    metricValue: 'Immediate Workflow',
  },
  {
    id: 'consultation',
    num: '05',
    name: 'Consultation',
    kicker: 'Step 05 / Booking & Reminders',
    title: 'Frictionless Consultation Scheduling',
    description:
      'Patients select available time slots directly synced with your clinic calendar, backed by automated reminder protocols.',
    features: [
      '2-way calendar sync with aesthetic clinic schedule',
      'Automated confirmation and timely multi-touch reminders',
      'Easy rescheduling pathway preventing silent no-shows',
    ],
    metricLabel: 'Show-Up Impact',
    metricValue: 'Automated Reminders',
  },
  {
    id: 'pipeline',
    num: '06',
    name: 'Pipeline',
    kicker: 'Step 06 / Pipeline Oversight',
    title: 'Clear Pipeline Visibility',
    description:
      'Practice owners and clinic coordinators maintain complete visibility over lead status, booked appointments, and pipeline revenue velocity.',
    features: [
      'Visual deal stages: Inquired → Contacted → Scheduled → Attended',
      'Instant notifications to practice staff upon booking',
      'No-show recovery triggers and follow-up flags',
    ],
    metricLabel: 'Operating Status',
    metricValue: 'Live Pipeline Board',
  },
  {
    id: 'reactivation',
    num: '07',
    name: 'Reactivation',
    kicker: 'Step 07 / Patient Lifetime Value',
    title: 'Patient & Database Reactivation',
    description:
      'Past inquiries and dormant patients are systematically re-engaged around seasonal treatments, maximizing returns on previous marketing spend.',
    features: [
      'Segmented outreach to cold and unbooked historical leads',
      'Automated reactivation workflows with zero staff chasing',
      'Compound practice growth without increasing ad spend',
    ],
    metricLabel: 'Opportunity Source',
    metricValue: 'Untapped Practice Data',
  },
];

export default function MedSpaGrowthEnginePage() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Form State — Preserving existing fields & architecture
  const [formData, setFormData] = useState<MedSpaGrowthPlanFormData>({
    firstName: '',
    lastName: '',
    practiceName: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    primaryTreatment: 'Injectables',
    monthlyBudget: '$3,000–$5,000',
    currentLeadVolume: '0–25',
    successCriteria: '',
    consent: false,
  });

  const [formStarted, setFormStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    // Set Page SEO Title & Meta
    document.title = 'MedSpa Growth Engine | Dynasty Works Studio';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Customer acquisition, automated follow-up and consultation pipeline systems for med spas and aesthetic practices.'
    );

    // Track Page View
    trackMedspaEvent('medspa_page_view', { route: '/growth/medspa' });
  }, []);

  const scrollToSection = (id: string, isPrimaryCta = false) => {
    if (isPrimaryCta) {
      trackMedspaEvent('medspa_primary_cta_click', { target: id });
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (!formStarted) {
      setFormStarted(true);
      trackMedspaEvent('medspa_form_start');
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectOption = (
    field: 'primaryTreatment' | 'monthlyBudget' | 'currentLeadVolume',
    value: string
  ) => {
    if (!formStarted) {
      setFormStarted(true);
      trackMedspaEvent('medspa_form_start');
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.practiceName.trim()) newErrors.practiceName = 'Practice name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Please provide a valid contact phone number.';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.primaryTreatment) newErrors.primaryTreatment = 'Please select a primary treatment.';
    if (!formData.monthlyBudget) newErrors.monthlyBudget = 'Please select your monthly budget.';
    if (!formData.consent) {
      newErrors.consent = 'Consent is required to receive your Growth Plan mapping.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    setIsSubmitting(true);
    trackMedspaEvent('medspa_form_submit', {
      treatment: formData.primaryTreatment,
      budget: formData.monthlyBudget,
    });

    try {
      const result = await submitGrowthPlan(formData);
      setSubmissionResult(result);
      trackMedspaEvent('medspa_form_success', {
        referenceId: result.referenceId,
        mode: result.mode,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during submission.';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStrategyModal = () => {
    trackMedspaEvent('medspa_booking_click');
    setStrategyModalOpen(true);
    dialogRef.current?.showModal();
  };

  const closeStrategyModal = () => {
    dialogRef.current?.close();
    setStrategyModalOpen(false);
  };

  const activeStage = journeyStages[activeStageIndex];

  return (
    <div className="medspa-page">
      {/* 00 Navigation — Minimal & Industry-Aligned */}
      <header className="ms-nav" role="banner">
        <div className="ms-container ms-nav-inner">
          <a href="#hero" className="ms-brand-lockup" aria-label="MedSpa Growth Engine Home">
            <span className="ms-brand-product">
              MEDSPA GROWTH ENGINE<span>™</span>
            </span>
            <span className="ms-brand-endorsement">
              A Dynasty Works Studio Growth System
            </span>
          </a>

          <nav className="ms-nav-links" aria-label="Funnel Navigation">
            <a href="#engine" className="ms-nav-link" onClick={() => scrollToSection('engine')}>
              How It Works
            </a>
            <a href="#journey" className="ms-nav-link" onClick={() => scrollToSection('journey')}>
              Patient Journey
            </a>
            <a href="#infrastructure" className="ms-nav-link" onClick={() => scrollToSection('infrastructure')}>
              What We Install
            </a>
            <a href="#growth-plan-offer" className="ms-nav-link" onClick={() => scrollToSection('growth-plan-offer')}>
              Complimentary Plan
            </a>
          </nav>

          <button
            type="button"
            className="ms-btn ms-btn-primary"
            onClick={() => scrollToSection('growth-plan', true)}
          >
            Get a Growth Plan
          </button>
        </div>
      </header>

      <main id="main-content">
        {/* 01 Hero Section — Lifestyle & Industry Hero */}
        <section id="hero" className="ms-hero-section" aria-labelledby="hero-title">
          <div className="ms-container ms-hero-grid">
            <div className="ms-hero-content">
              <div className="ms-eyebrow">
                MEDSPA GROWTH ENGINE™ · A DYNASTY WORKS STUDIO GROWTH SYSTEM
              </div>
              <h1 id="hero-title" className="ms-hero-headline">
                TURN YOUR MED SPA
                <span>INTO A CONSULTATION ENGINE.</span>
              </h1>
              <p className="ms-hero-copy">
                Patient acquisition systems built specifically for aesthetic practices.
                From the first click to the booked consultation, we connect advertising,
                treatment-specific landing pages, immediate follow-up, appointment scheduling
                and lead recovery into one managed growth system.
              </p>

              <div className="ms-hero-badges">
                <div className="ms-badges-label">Built specifically for</div>
                <div className="ms-badges-list">
                  <span className="ms-badge-pill">Med Spas</span>
                  <span className="ms-badge-pill">Injectables</span>
                  <span className="ms-badge-pill">Laser</span>
                  <span className="ms-badge-pill">Body Contouring</span>
                  <span className="ms-badge-pill">Skin</span>
                  <span className="ms-badge-pill">Premium Wellness</span>
                </div>
              </div>

              <div className="ms-hero-actions">
                <button
                  type="button"
                  className="ms-btn ms-btn-primary"
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  GET MY GROWTH PLAN
                </button>
                <button
                  type="button"
                  className="ms-btn ms-btn-secondary"
                  onClick={() => scrollToSection('engine')}
                >
                  SEE HOW IT WORKS
                </button>
              </div>
            </div>

            {/* Dominant MedSpa Hero Visual Placements */}
            <div className="ms-hero-image-frame" aria-hidden="true">
              <img
                src="/medspa/01-hero-lounge.jpg"
                alt="Luxury medical spa consultation lounge and interior"
                loading="eager"
              />
              <div className="ms-hero-floating-card">
                <div className="ms-float-item">
                  <span className="ms-float-label">Response Protocol</span>
                  <span className="ms-float-val">Immediate Response Workflow</span>
                </div>
                <div className="ms-float-item">
                  <span className="ms-float-label">Booking Infrastructure</span>
                  <span className="ms-float-val">Automated Reminders</span>
                </div>
                <div className="ms-float-item">
                  <span className="ms-float-label">Pipeline Status</span>
                  <span className="ms-float-val" style={{ color: 'var(--ms-champagne)' }}>
                    Active Consultations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Specialization Section — Who We Serve */}
        <section id="specialization" className="ms-spec-section" aria-labelledby="spec-title">
          <div className="ms-container ms-spec-grid">
            <div className="ms-spec-image-wrap">
              <img
                src="/medspa/02-treatment-suite.jpg"
                alt="Pristine modern aesthetic medicine treatment suite"
                loading="lazy"
              />
            </div>
            <div className="ms-spec-content">
              <span className="ms-eyebrow">CATEGORY SPECIALIZATION</span>
              <h2 id="spec-title" className="ms-spec-headline">
                BUILT SPECIFICALLY FOR AESTHETIC PRACTICES.
              </h2>
              <p className="ms-spec-desc">
                We build patient-acquisition infrastructure around the economics, treatments and
                consultation journey of modern aesthetic practices. We connect every step so your team
                answers more inquiries, books more high-value consultations, and eliminates lost patient opportunities.
              </p>
              <div className="ms-spec-categories" role="list">
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Med Spas
                </div>
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Aesthetic Clinics
                </div>
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Injectable Practices
                </div>
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Laser Clinics
                </div>
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Body Contouring
                </div>
                <div className="ms-spec-cat-item" role="listitem">
                  <span className="ms-spec-cat-dot"></span> Skin / Facial Studios
                </div>
                <div className="ms-spec-cat-item" role="listitem" style={{ gridColumn: 'span 2' }}>
                  <span className="ms-spec-cat-dot"></span> Premium Wellness & Aesthetic Concepts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 The Revenue Leak / Business Problem */}
        <section id="problem" className="ms-problem-section" aria-labelledby="problem-title">
          <div className="ms-container">
            {/* Core Strategic Positioning Message */}
            <div className="ms-lead-statement">
              <span className="ms-eyebrow">THE STRATEGIC REALITY</span>
              <h2 className="ms-lead-statement-title">
                GETTING THE LEAD IS ONLY HALF THE JOB.
              </h2>
              <p className="ms-lead-statement-copy">
                What happens after the inquiry determines whether that opportunity becomes a
                booked consultation—or disappears into lost practice revenue.
              </p>
            </div>

            <div className="ms-section-header">
              <span className="ms-eyebrow">WHERE PRACTICES LEAK OPPORTUNITY</span>
              <h2 id="problem-title" className="ms-section-headline">
                THE LEAD IS NOT THE FINISH LINE.
              </h2>
              <p className="ms-section-desc">
                Advertising creates attention, but front desks are consumed by in-clinic patients.
                Without automated acquisition infrastructure, high-value aesthetic consultations are consistently lost.
              </p>
            </div>

            {/* Asymmetrical Editorial Leak Grid */}
            <div className="ms-leak-grid">
              <div className="ms-leak-card">
                <div className="ms-leak-num">01 / RESPONSE SPEED</div>
                <h3 className="ms-leak-title">Slow Response & Missed Inquiries</h3>
                <p className="ms-leak-desc">
                  Fewer leads forgotten. When inquiries wait hours or calls go to voicemail during peak clinic hours,
                  high-intent prospective patients reach out to another provider.
                </p>
              </div>

              <div className="ms-leak-card">
                <div className="ms-leak-num">02 / FOLLOW-UP</div>
                <h3 className="ms-leak-title">Inconsistent Follow-Up & Unbooked Prospects</h3>
                <p className="ms-leak-desc">
                  Better follow-up consistency. Leads are contacted once or twice then dropped. Without a structured,
                  multi-touch follow-up workflow, interested prospective patients routinely slip away before scheduling.
                </p>
              </div>

              <div className="ms-leak-card">
                <div className="ms-leak-num">03 / APPOINTMENT INTEGRITY</div>
                <h3 className="ms-leak-title">Forgotten Appointments & Vanished No-Shows</h3>
                <p className="ms-leak-desc">
                  No-show recovery. Without automated SMS confirmations and proactive 2-way rescheduling protocols,
                  no-shows disappear without rebooking, leaving clinicians with empty treatment chairs.
                </p>
              </div>

              <div className="ms-leak-card">
                <div className="ms-leak-num">04 / DATABASE & PIPELINE</div>
                <h3 className="ms-leak-title">Dormant Patient Lists & Blind Pipeline</h3>
                <p className="ms-leak-desc">
                  Clear pipeline visibility & reactivation. Past inquiries sit untouched in spreadsheets while leadership
                  lacks clear visibility into consultation volume, response times, and pipeline conversion health.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 Premium Med-Spa Visual Break */}
        <section className="ms-visual-break-section" aria-hidden="true">
          <div className="ms-container">
            <div className="ms-visual-break-frame">
              <img
                src="/medspa/03-consultation-experience.jpg"
                alt="Aesthetic consultation in a luxury med spa environment"
                loading="lazy"
              />
              <div className="ms-visual-break-overlay">
                <p className="ms-visual-break-text">
                  "Where patient interest becomes a connected consultation journey."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 How The Engine Works */}
        <section id="engine" className="ms-engine-section" aria-labelledby="engine-title">
          <div className="ms-container">
            <div className="ms-section-header">
              <span className="ms-eyebrow">HOW THE ENGINE WORKS</span>
              <h2 id="engine-title" className="ms-section-headline">
                ONE CONNECTED ACQUISITION SYSTEM.
              </h2>
              <p className="ms-section-desc">
                We replace disjointed marketing tactics with six synchronized operational components
                engineered to move patients seamlessly from inquiry to consultation.
              </p>
            </div>

            <div className="ms-engine-grid">
              <article className="ms-engine-card">
                <span className="ms-engine-index">01 / GENERATE</span>
                <div>
                  <h3 className="ms-engine-title">Generate</h3>
                  <p className="ms-engine-copy">
                    Targeted campaigns attract prospective patients seeking specific high-value procedures.
                  </p>
                </div>
              </article>

              <article className="ms-engine-card">
                <span className="ms-engine-index">02 / CAPTURE</span>
                <div>
                  <h3 className="ms-engine-title">Capture</h3>
                  <p className="ms-engine-copy">
                    Dedicated treatment pages turn attention into qualified, actionable inquiries.
                  </p>
                </div>
              </article>

              <article className="ms-engine-card">
                <span className="ms-engine-index">03 / RESPOND</span>
                <div>
                  <h3 className="ms-engine-title">Respond</h3>
                  <p className="ms-engine-copy">
                    Immediate response workflows engage new inquiries before interest cools.
                  </p>
                </div>
              </article>

              <article className="ms-engine-card">
                <span className="ms-engine-index">04 / BOOK</span>
                <div>
                  <h3 className="ms-engine-title">Book</h3>
                  <p className="ms-engine-copy">
                    Frictionless scheduling directs qualified prospects straight into your consultation calendar.
                  </p>
                </div>
              </article>

              <article className="ms-engine-card">
                <span className="ms-engine-index">05 / RECOVER</span>
                <div>
                  <h3 className="ms-engine-title">Recover</h3>
                  <p className="ms-engine-copy">
                    Automated follow-up workflows recover unresponsive inquiries and rebook missed appointments.
                  </p>
                </div>
              </article>

              <article className="ms-engine-card">
                <span className="ms-engine-index">06 / MEASURE</span>
                <div>
                  <h3 className="ms-engine-title">Measure</h3>
                  <p className="ms-engine-copy">
                    Real-time pipeline tracking gives you clear visibility into inquiries, booked consultations, and treatment value.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 06 Interactive Patient Journey — Preserved Functionality on Contrast Dark Stage */}
        <section id="journey" className="ms-journey-section" aria-labelledby="journey-title">
          <div className="ms-container">
            <div className="ms-section-header">
              <span className="ms-eyebrow" style={{ color: 'var(--ms-dark-champagne)' }}>
                THE PATIENT JOURNEY
              </span>
              <h2 id="journey-title" className="ms-section-headline">
                FROM FIRST CLICK TO<br />BOOKED CONSULTATION.
              </h2>
              <p className="ms-section-desc">
                Select any stage below to see how each step connects to protect your pipeline and book more consultations.
              </p>
            </div>

            {/* Navigation / Step Selector */}
            <div className="ms-journey-nav" role="tablist" aria-label="Patient Journey Stages">
              {journeyStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  id={`tab-${stage.id}`}
                  aria-selected={activeStageIndex === idx}
                  aria-controls={`panel-${stage.id}`}
                  className={`ms-journey-btn ${activeStageIndex === idx ? 'is-active' : ''}`}
                  onClick={() => setActiveStageIndex(idx)}
                >
                  <span className="ms-journey-num">{stage.num}</span>
                  <span className="ms-journey-label">{stage.name}</span>
                </button>
              ))}
            </div>

            {/* Active Stage Detail Inspection Card */}
            <div
              id={`panel-${activeStage.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeStage.id}`}
              className="ms-journey-detail-card"
            >
              <div>
                <div className="ms-detail-kicker">{activeStage.kicker}</div>
                <h3 className="ms-detail-title">{activeStage.title}</h3>
                <p className="ms-detail-desc">{activeStage.description}</p>
                <ul className="ms-detail-features">
                  {activeStage.features.map((feat, fIdx) => (
                    <li key={fIdx} className="ms-detail-feature-item">
                      <CheckIcon />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ms-detail-status-box">
                <div className="ms-status-box-title">STAGE OVERVIEW</div>
                <div className="ms-status-metric">
                  <div className="ms-status-metric-label">PRIMARY OBJECTIVE</div>
                  <div className="ms-status-metric-value">{activeStage.name}</div>
                </div>
                <div className="ms-status-metric">
                  <div className="ms-status-metric-label">{activeStage.metricLabel}</div>
                  <div className="ms-status-metric-value">{activeStage.metricValue}</div>
                </div>
                <button
                  type="button"
                  className="ms-btn ms-btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  Install This System <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 07 Infrastructure Behind the Campaign */}
        <section id="infrastructure" className="ms-infra-section" aria-labelledby="infra-title">
          <div className="ms-container">
            <div className="ms-section-header">
              <span className="ms-eyebrow">WHAT WE INSTALL</span>
              <h2 id="infra-title" className="ms-section-headline">
                THE INFRASTRUCTURE BEHIND THE CAMPAIGN.
              </h2>
              <p className="ms-section-desc">
                A complete connected acquisition and operational system installed and managed for your practice.
              </p>
            </div>

            <div className="ms-infra-columns">
              {/* Group 1: Acquisition & Capture */}
              <div className="ms-infra-group">
                <div className="ms-infra-group-title">01 / Acquisition &amp; Capture</div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Campaign Strategy</h3>
                  <p className="ms-infra-desc">Precision targeting blueprints tailored to high-value aesthetic procedures.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Treatment Landing Page</h3>
                  <p className="ms-infra-desc">High-converting, luxury landing experiences focused on single-service clarity.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Lead Capture</h3>
                  <p className="ms-infra-desc">Frictionless inquiry forms with real-time field validation and data integrity.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">CRM Pipeline</h3>
                  <p className="ms-infra-desc">Structured stage visualization from new prospect to completed consultation.</p>
                </div>
              </div>

              {/* Group 2: Follow-Up & Scheduling */}
              <div className="ms-infra-group">
                <div className="ms-infra-group-title">02 / Engagement &amp; Scheduling</div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">SMS Follow-Up</h3>
                  <p className="ms-infra-desc">Instant, personalized text workflows that engage prospects while intent is peak.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Email Follow-Up</h3>
                  <p className="ms-infra-desc">Editorial email sequences reinforcing practice authority and treatment details.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Consultation Calendar</h3>
                  <p className="ms-infra-desc">Seamless self-booking engine integrated directly with clinic availability.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Appointment Reminders</h3>
                  <p className="ms-infra-desc">Automated multi-channel confirmations designed to maximize show-up rates.</p>
                </div>
              </div>

              {/* Group 3: Retention & Intelligence */}
              <div className="ms-infra-group">
                <div className="ms-infra-group-title">03 / Retention &amp; Intelligence</div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">No-Show Follow-Up</h3>
                  <p className="ms-infra-desc">Automated re-booking workflows that recover missed appointments systematically.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Lead Nurture</h3>
                  <p className="ms-infra-desc">Ongoing educational value sequences for prospects not yet ready to book today.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Database Reactivation</h3>
                  <p className="ms-infra-desc">Systematic campaigns that unlock hidden revenue from existing patient lists.</p>
                </div>
                <div className="ms-infra-item">
                  <h3 className="ms-infra-name">Performance Reporting</h3>
                  <p className="ms-infra-desc">Transparent weekly metrics tracking lead volume, cost, and booked pipeline.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 08 Comparison Section — Traditional Model vs Connected Model */}
        <section id="comparison" className="ms-comp-section" aria-labelledby="comp-title">
          <div className="ms-container">
            <div className="ms-section-header">
              <span className="ms-eyebrow">STRUCTURAL ADVANTAGE</span>
              <h2 id="comp-title" className="ms-section-headline">
                MORE THAN LEAD GENERATION.
              </h2>
              <p className="ms-section-desc">
                Traditional marketing stops when a lead is delivered, leaving the hardest operational follow-through on your front desk. The Connected Model automates the entire bridge from interest to consultation.
              </p>
            </div>

            <div className="ms-comp-grid">
              {/* Traditional Model */}
              <div className="ms-comp-card traditional">
                <span className="ms-comp-kicker">TRADITIONAL LEAD GENERATION</span>
                <h3 className="ms-comp-title">Fragmented Chasing</h3>
                <div className="ms-comp-flow">
                  <div className="ms-comp-step"><span className="ms-comp-step-num">01</span> Ad Campaign</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">02</span> Generic Website Click</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">03</span> Unverified Lead</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">04</span> Manual Front-Desk Chasing</div>
                </div>
              </div>

              {/* Connected Model */}
              <div className="ms-comp-card connected">
                <span className="ms-comp-kicker">THE CONNECTED ACQUISITION ENGINE</span>
                <h3 className="ms-comp-title">End-to-End System</h3>
                <div className="ms-comp-flow">
                  <div className="ms-comp-step"><span className="ms-comp-step-num">01</span> Targeted Treatment Campaign</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">02</span> Dedicated Conversion Experience</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">03</span> Validated Lead Capture</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">04</span> Immediate Response Workflow</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">05</span> Frictionless Consultation Booking</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">06</span> Live CRM Pipeline Oversight</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">07</span> Automated No-Show Recovery</div>
                  <div className="ms-comp-step"><span className="ms-comp-step-num">08</span> Continuous Acquisition Optimization</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 09 Complimentary Growth Plan Offer Section */}
        <section id="growth-plan-offer" className="ms-offer-section" aria-labelledby="offer-title">
          <div className="ms-container">
            <div className="ms-offer-card">
              <div className="ms-offer-header">
                <span className="ms-eyebrow">CUSTOM PRACTICE AUDIT</span>
                <h2 id="offer-title" className="ms-offer-headline">
                  YOUR COMPLIMENTARY<br />MEDSPA GROWTH PLAN.
                </h2>
                <p className="ms-offer-desc">
                  We'll review your current patient-acquisition process and identify
                  where stronger follow-up, booking and reactivation systems could
                  create additional opportunity.
                </p>
              </div>

              <div className="ms-offer-grid">
                <div className="ms-offer-item">
                  <div className="ms-offer-num">01 / AUDIT</div>
                  <h3 className="ms-offer-title">CURRENT LEAD FLOW</h3>
                  <p className="ms-offer-copy">
                    An objective assessment of your current inquiry volume, advertising channels, and patient acquisition sources.
                  </p>
                </div>

                <div className="ms-offer-item">
                  <div className="ms-offer-num">02 / FOCUS</div>
                  <h3 className="ms-offer-title">HIGH-VALUE TREATMENT OPPORTUNITY</h3>
                  <p className="ms-offer-copy">
                    Identification of your highest-margin procedures with strong local demand to prioritize in your acquisition funnel.
                  </p>
                </div>

                <div className="ms-offer-item">
                  <div className="ms-offer-num">03 / SPEED</div>
                  <h3 className="ms-offer-title">INQUIRY RESPONSE + FOLLOW-UP</h3>
                  <p className="ms-offer-copy">
                    An audit of response speed and follow-up consistency to eliminate forgotten inquiries and stop leads from slipping away.
                  </p>
                </div>

                <div className="ms-offer-item">
                  <div className="ms-offer-num">04 / BOOKING</div>
                  <h3 className="ms-offer-title">CONSULTATION BOOKING PROCESS</h3>
                  <p className="ms-offer-copy">
                    A thorough review of your scheduling pathway to remove booking friction and increase consultation attendance.
                  </p>
                </div>

                <div className="ms-offer-item">
                  <div className="ms-offer-num">05 / RETENTION</div>
                  <h3 className="ms-offer-title">DORMANT DATABASE OPPORTUNITY</h3>
                  <p className="ms-offer-copy">
                    Evaluating past inquiries and inactive patient records to reactivate revenue without additional advertising spend.
                  </p>
                </div>

                <div className="ms-offer-item">
                  <div className="ms-offer-num">06 / STRATEGY</div>
                  <h3 className="ms-offer-title">RECOMMENDED ACQUISITION ROADMAP</h3>
                  <p className="ms-offer-copy">
                    A prioritized, step-by-step implementation plan tailored specifically to your practice economics and staff capacity.
                  </p>
                </div>
              </div>

              <div className="ms-offer-action-bar">
                <button
                  type="button"
                  className="ms-btn ms-btn-primary"
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  GET MY GROWTH PLAN
                </button>
                <span className="ms-offer-note">
                  No cost. No obligation. Zero disruption to your clinic operations.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 11 Growth Plan Form — Preserving all architecture & validation */}
        <section id="growth-plan" className="ms-form-section" aria-labelledby="form-title">
          <div className="ms-container">
            <div className="ms-form-card">
              <div className="ms-form-header">
                <span className="ms-eyebrow">CONSULTATION PIPELINE SCOPING</span>
                <h2 id="form-title" className="ms-form-headline">
                  LET'S BUILD YOUR CONSULTATION PIPELINE.
                </h2>
                <p className="ms-form-subhead">
                  Tell us where your practice is today and which treatment or service you want to grow.
                  We will design a custom patient-acquisition and follow-up roadmap for your clinic.
                </p>
              </div>

              {submissionResult?.success ? (
                <div className="ms-success-view">
                  <div className="ms-success-icon">✓</div>
                  <h3 className="ms-success-title">Growth Plan Request Received</h3>
                  <p className="ms-success-desc">
                    Thank you, {formData.firstName}. We have initiated your consultation pipeline analysis for{' '}
                    <strong>{formData.practiceName}</strong>. Our senior growth strategist will review your market and deliver your custom pipeline map.
                  </p>
                  <div className="ms-success-meta">
                    REFERENCE ID: <strong>{submissionResult.referenceId}</strong>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="ms-btn ms-btn-secondary"
                      onClick={() => {
                        setSubmissionResult(null);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          practiceName: '',
                          website: '',
                          email: '',
                          phone: '',
                          city: '',
                          state: '',
                          primaryTreatment: 'Injectables',
                          monthlyBudget: '$3,000–$5,000',
                          currentLeadVolume: '0–25',
                          successCriteria: '',
                          consent: false,
                        });
                      }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {errors.form && (
                    <div style={{ color: '#d9534f', marginBottom: '1.5rem', textAlign: 'center' }}>
                      {errors.form}
                    </div>
                  )}

                  <div className="ms-form-grid">
                    {/* First Name */}
                    <div className="ms-form-group">
                      <label htmlFor="firstName" className="ms-label">
                        First Name <span className="req">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.firstName ? 'has-error' : ''}`}
                        placeholder="e.g. Dr. Claire"
                      />
                      {errors.firstName && <span className="ms-error-text">{errors.firstName}</span>}
                    </div>

                    {/* Last Name */}
                    <div className="ms-form-group">
                      <label htmlFor="lastName" className="ms-label">
                        Last Name <span className="req">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.lastName ? 'has-error' : ''}`}
                        placeholder="e.g. Vance"
                      />
                      {errors.lastName && <span className="ms-error-text">{errors.lastName}</span>}
                    </div>

                    {/* Practice Name */}
                    <div className="ms-form-group">
                      <label htmlFor="practiceName" className="ms-label">
                        Practice Name <span className="req">*</span>
                      </label>
                      <input
                        id="practiceName"
                        name="practiceName"
                        type="text"
                        autoComplete="organization"
                        value={formData.practiceName}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.practiceName ? 'has-error' : ''}`}
                        placeholder="e.g. Lumina Aesthetics"
                      />
                      {errors.practiceName && <span className="ms-error-text">{errors.practiceName}</span>}
                    </div>

                    {/* Website */}
                    <div className="ms-form-group">
                      <label htmlFor="website" className="ms-label">
                        Website
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        autoComplete="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="ms-input"
                        placeholder="https://yourpractice.com"
                      />
                    </div>

                    {/* Email */}
                    <div className="ms-form-group">
                      <label htmlFor="email" className="ms-label">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.email ? 'has-error' : ''}`}
                        placeholder="claire@luminaaesthetics.com"
                      />
                      {errors.email && <span className="ms-error-text">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="ms-form-group">
                      <label htmlFor="phone" className="ms-label">
                        Phone Number <span className="req">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.phone ? 'has-error' : ''}`}
                        placeholder="(555) 234-5678"
                      />
                      {errors.phone && <span className="ms-error-text">{errors.phone}</span>}
                    </div>

                    {/* City */}
                    <div className="ms-form-group">
                      <label htmlFor="city" className="ms-label">
                        City <span className="req">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.city ? 'has-error' : ''}`}
                        placeholder="Beverly Hills"
                      />
                      {errors.city && <span className="ms-error-text">{errors.city}</span>}
                    </div>

                    {/* State */}
                    <div className="ms-form-group">
                      <label htmlFor="state" className="ms-label">
                        State <span className="req">*</span>
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="address-level1"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`ms-input ${errors.state ? 'has-error' : ''}`}
                        placeholder="CA"
                      />
                      {errors.state && <span className="ms-error-text">{errors.state}</span>}
                    </div>

                    {/* Primary Treatment to Grow */}
                    <div className="ms-form-group col-span-2">
                      <label className="ms-label">
                        Primary Treatment to Grow <span className="req">*</span>
                      </label>
                      <div className="ms-options-grid" role="radiogroup" aria-label="Primary Treatment Options">
                        {treatments.map((t) => (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={formData.primaryTreatment === t}
                            className={`ms-option-btn ${formData.primaryTreatment === t ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('primaryTreatment', t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {errors.primaryTreatment && <span className="ms-error-text">{errors.primaryTreatment}</span>}
                    </div>

                    {/* Monthly Marketing Budget */}
                    <div className="ms-form-group col-span-2">
                      <label className="ms-label">
                        Monthly Marketing Budget <span className="req">*</span>
                      </label>
                      <div className="ms-options-grid" role="radiogroup" aria-label="Monthly Marketing Budget Tiers">
                        {budgetTiers.map((b) => (
                          <button
                            key={b}
                            type="button"
                            role="radio"
                            aria-checked={formData.monthlyBudget === b}
                            className={`ms-option-btn ${formData.monthlyBudget === b ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('monthlyBudget', b)}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      {errors.monthlyBudget && <span className="ms-error-text">{errors.monthlyBudget}</span>}
                    </div>

                    {/* Current Monthly Lead Volume */}
                    <div className="ms-form-group col-span-2">
                      <label className="ms-label">Current Monthly Lead Volume</label>
                      <div className="ms-options-grid" role="radiogroup" aria-label="Current Monthly Lead Volume Range">
                        {leadVolumes.map((v) => (
                          <button
                            key={v}
                            type="button"
                            role="radio"
                            aria-checked={formData.currentLeadVolume === v}
                            className={`ms-option-btn ${formData.currentLeadVolume === v ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('currentLeadVolume', v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Long Answer */}
                    <div className="ms-form-group col-span-2">
                      <label htmlFor="successCriteria" className="ms-label">
                        What would make this growth program successful for your practice?
                      </label>
                      <textarea
                        id="successCriteria"
                        name="successCriteria"
                        value={formData.successCriteria}
                        onChange={handleInputChange}
                        className="ms-textarea"
                        placeholder="Tell us about your target consultation volume, high-margin procedures, current front-desk workflow, or revenue goals..."
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <label className="ms-consent-wrapper">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className="ms-consent-checkbox"
                    />
                    <span className="ms-consent-text">
                      I agree to be contacted regarding my Growth Plan request. We respect your confidentiality. Review our{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent && (
                    <div className="ms-error-text" style={{ marginBottom: '1.5rem' }}>
                      {errors.consent}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ms-btn ms-btn-primary"
                    style={{ width: '100%', padding: '1.15rem' }}
                  >
                    {isSubmitting ? 'ANALYZING & MAPPING...' : 'GET MY GROWTH PLAN'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 12 Final CTA — Full-Width Visual Section */}
        <section className="ms-final-section" aria-labelledby="final-title">
          <img
            src="/medspa/06-final-sanctuary.jpg"
            alt="Aspirational luxury aesthetic medical clinic sanctuary"
            className="ms-final-bg-image"
            loading="lazy"
          />
          <div className="ms-container ms-final-card">
            <span className="ms-eyebrow" style={{ color: 'var(--ms-dark-champagne)' }}>
              TAKE CONTROL OF YOUR PRACTICE GROWTH
            </span>
            <h2 id="final-title" className="ms-final-headline">
              YOUR NEXT PATIENT
              <span style={{ display: 'block' }}>IS ALREADY LOOKING.</span>
            </h2>
            <p className="ms-final-copy">
              Build the acquisition system that turns attention into conversations,
              consultations and measurable pipeline activity.
            </p>
            <div className="ms-hero-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="ms-btn ms-btn-primary"
                onClick={() => scrollToSection('growth-plan', true)}
              >
                GET MY GROWTH PLAN
              </button>
              <button
                type="button"
                className="ms-btn ms-btn-secondary"
                onClick={openStrategyModal}
              >
                BOOK A STRATEGY CALL
              </button>
            </div>
            <div className="ms-final-endorsement">
              <strong>MEDSPA GROWTH ENGINE™</strong> · A Dynasty Works Studio Growth System
            </div>
          </div>
        </section>
      </main>

      {/* Footer Lockup */}
      <footer style={{ background: '#141312', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3.5rem 0' }}>
        <div
          className="ms-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '0.1em', color: '#f5f2eb', textTransform: 'uppercase' }}>
              MEDSPA GROWTH ENGINE™
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a69f93', letterSpacing: '0.05em' }}>
              © {new Date().getFullYear()} Dynasty Works Studio. Automation • Systems • Brands.
            </span>
          </div>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1.75rem', fontSize: '0.8125rem' }}>
            <a href="/" style={{ color: '#a69f93', textDecoration: 'none' }}>Home</a>
            <a href="/work" style={{ color: '#a69f93', textDecoration: 'none' }}>Work</a>
            <a href="/capabilities" style={{ color: '#a69f93', textDecoration: 'none' }}>Capabilities</a>
            <a href="/studio" style={{ color: '#a69f93', textDecoration: 'none' }}>Studio</a>
            <a href="/contact" style={{ color: '#a69f93', textDecoration: 'none' }}>Contact</a>
            <a href="/privacy" style={{ color: '#a69f93', textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ color: '#a69f93', textDecoration: 'none' }}>Terms</a>
          </nav>
        </div>
      </footer>

      {/* Strategy Demonstration Dialog */}
      <dialog ref={dialogRef} className="ms-dialog" aria-labelledby="dialog-title">
        <div className="ms-dialog-head">
          <span className="ms-eyebrow" style={{ margin: 0 }}>PHASE 2 ENGAGEMENT</span>
          <button type="button" className="ms-dialog-close" onClick={closeStrategyModal} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <h3 id="dialog-title" style={{ fontFamily: 'var(--ms-font-serif)', fontSize: '1.75rem', margin: '0 0 1rem', color: 'var(--ms-text-dark)' }}>
          Strategy Demonstration & Calendar
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--ms-text-body)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
          Direct calendar booking is provisioned in Phase 2 of our deployment. To reserve your consultation strategy review immediately, complete the Growth Plan mapping form. Our team will review your practice requirements and provide direct executive calendar access within 1 business day.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button
            type="button"
            className="ms-btn ms-btn-primary"
            onClick={() => {
              closeStrategyModal();
              scrollToSection('growth-plan', true);
            }}
          >
            Complete Growth Plan Form
          </button>
          <button
            type="button"
            className="ms-btn ms-btn-secondary"
            onClick={closeStrategyModal}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
