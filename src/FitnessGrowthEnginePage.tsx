import React, { useState, useEffect } from 'react';
import './fitness-growth-engine.css';
import { trackFitnessEvent } from './lib/fitness-analytics';
import {
  submitFitnessGrowthPlan,
  type FitnessGrowthPlanFormData,
  type FitnessSubmissionResult,
} from './lib/fitness-highlevel-adapter';

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

const businessTypes = [
  'Strength & Conditioning',
  'HIIT',
  'Boxing / Kickboxing',
  'Personal Training',
  'Transformation Program',
  'Women\'s Fitness',
  'Sports Performance',
  'Boutique Fitness',
  'Other',
];

const primaryOffers = [
  'Monthly Membership',
  'Personal Training',
  'Small Group Training',
  'Transformation Challenge',
  'Trial Membership',
  'Intro Package',
  'Youth / Sports Performance',
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

// Interactive Member Journey Stages
const journeyStages = [
  {
    id: 'targeted-ad',
    num: '01',
    name: 'Targeted Ad',
    kicker: 'Stage 01 / Member Acquisition',
    title: 'High-Intent Local Campaigns',
    description:
      'Targeted local campaigns reach fitness prospects actively seeking coaching, body transformation, or dedicated gym memberships within your immediate territory.',
    features: [
      'Offer-specific positioning tailored to independent gym economics',
      'Hyper-local radius targeting excluding non-converting demographics',
      'Direct routing into frictionless introductory conversion flows',
    ],
    metricLabel: 'Acquisition Focus',
    metricValue: 'Local Geographic Intent',
  },
  {
    id: 'intro-offer',
    num: '02',
    name: 'Intro Offer',
    kicker: 'Stage 02 / Offer Experience',
    title: 'Dedicated Offer Landing Pages',
    description:
      'Laser-focused landing pages showcase your facility culture, coaching caliber, and introductory trial offer without distracting website clutter.',
    features: [
      'Architectural athletic visual standard establishing premium value',
      'Clear trial expectations, coach qualifications, and facility standards',
      'High-velocity mobile optimization with single-action focus',
    ],
    metricLabel: 'Page Architecture',
    metricValue: 'Zero-Distraction Flow',
  },
  {
    id: 'lead-capture',
    num: '03',
    name: 'Lead Capture',
    kicker: 'Stage 03 / Inquiry Routing',
    title: 'Intent Capture & CRM Ingestion',
    description:
      'Captures prospect training goals, preferred schedule, and verified contact details with instant field validation and automatic CRM routing.',
    features: [
      'Instant mobile phone and email formatting verification',
      'Real-time ingestion into Fitness HighLevel pipeline',
      'Immediate lead source and campaign attribution tagging',
    ],
    metricLabel: 'Data Pipeline',
    metricValue: 'Instant CRM Routing',
  },
  {
    id: 'follow-up',
    num: '04',
    name: 'Follow-Up',
    kicker: 'Stage 04 / Automated Response',
    title: 'Immediate Multi-Touch Follow-Up',
    description:
      'Inquiries receive immediate, personalized SMS and email responses within minutes, engaging prospects before their motivation fades.',
    features: [
      'Immediate automated SMS confirmation with coach introduction',
      'Direct calendar booking link delivered within seconds',
      'Structured conversational nurture for prospects who hesitate',
    ],
    metricLabel: 'Response Protocol',
    metricValue: 'Immediate Speed-to-Lead',
  },
  {
    id: 'trial-consultation',
    num: '05',
    name: 'Trial / Consultation',
    kicker: 'Stage 05 / Booking & Attendance',
    title: 'Frictionless Calendar Scheduling',
    description:
      'Prospects select their preferred assessment, first workout, or consultation directly on a live calendar backed by automated attendance reminders.',
    features: [
      'Live 2-way calendar sync with coaching staff availability',
      'Multi-touch SMS & email reminders with facility directions',
      'Frictionless rescheduling links preventing silent no-shows',
    ],
    metricLabel: 'Show-Up Security',
    metricValue: 'Automated Reminders',
  },
  {
    id: 'membership-opportunity',
    num: '06',
    name: 'Membership Opportunity',
    kicker: 'Stage 06 / Pipeline Visibility',
    title: 'Structured Membership Conversion',
    description:
      'Gym owners and head coaches maintain complete pipeline visibility over trial attendance, membership presentations, and recurring revenue velocity.',
    features: [
      'Visual deal stages: Inquired → Scheduled → Attended → Enrolled',
      'Instant notification to front desk staff upon trial check-in',
      'Automated post-workout follow-up and membership enrollment prompts',
    ],
    metricLabel: 'Pipeline Control',
    metricValue: 'Live Deal Board',
  },
  {
    id: 'reactivation',
    num: '07',
    name: 'Reactivation',
    kicker: 'Stage 07 / Lifetime Value',
    title: 'Dormant Lead & Ex-Member Reactivation',
    description:
      'Historical inquiries, past trial visitors, and former members are systematically re-engaged around seasonal challenges and new programming.',
    features: [
      'Segmented campaigns to untouched historical prospect databases',
      'Automated re-engagement sequences requiring zero front-desk chasing',
      'Generates steady new member signups without increasing ad spend',
    ],
    metricLabel: 'Opportunity Source',
    metricValue: 'Untapped Gym Database',
  },
];

export default function FitnessGrowthEnginePage() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State — Matching exact required fields
  const [formData, setFormData] = useState<FitnessGrowthPlanFormData>({
    firstName: '',
    lastName: '',
    gymName: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    businessType: 'Strength & Conditioning',
    primaryOffer: 'Monthly Membership',
    monthlyBudget: '$3,000–$5,000',
    currentLeadVolume: '0–25',
    successCriteria: '',
    consent: false,
  });

  const [formStarted, setFormStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<FitnessSubmissionResult | null>(null);

  useEffect(() => {
    // Set Page SEO Title & Meta
    document.title = 'Fitness Growth Engine™ | Dynasty Works Studio';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Member acquisition, immediate follow-up, trial booking and conversion infrastructure built specifically for independent gyms and boutique fitness operators.'
    );

    // Track Page View
    trackFitnessEvent('fitness_page_view', { route: '/growth/fitness' });
  }, []);

  const scrollToSection = (id: string, isPrimaryCta = false) => {
    if (isPrimaryCta) {
      trackFitnessEvent('fitness_primary_cta_click', { target: id });
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
      trackFitnessEvent('fitness_form_start');
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.gymName.trim()) errs.gymName = 'Gym / Studio name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      errs.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    if (!formData.businessType) errs.businessType = 'Please select your business type';
    if (!formData.primaryOffer) errs.primaryOffer = 'Please select your primary offer';
    if (!formData.monthlyBudget) errs.monthlyBudget = 'Please select your marketing budget';

    if (!formData.consent) {
      errs.consent = 'Consent is required to receive your complimentary growth plan';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFitnessEvent('fitness_form_submit', {
      businessType: formData.businessType,
      offer: formData.primaryOffer,
      budget: formData.monthlyBudget,
    });

    if (!validateForm()) {
      const firstErrKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFitnessGrowthPlan(formData);
      setSubmissionResult(result);
      trackFitnessEvent('fitness_form_success', {
        referenceId: result.referenceId,
        mode: result.mode,
      });
      setModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStage = journeyStages[activeStageIndex];

  return (
    <div className="fitness-page">
      {/* 00 Sticky Header Navigation */}
      <header className="fit-nav" role="banner">
        <div className="fit-container fit-nav-inner">
          <a href="/growth/fitness" className="fit-brand-group" aria-label="Fitness Growth Engine Home">
            <span className="fit-brand-studio">
              <span className="fit-brand-dot" aria-hidden="true" />
              DYNASTY WORKS STUDIO
            </span>
            <span className="fit-brand-divider" aria-hidden="true" />
            <span className="fit-brand-vertical">FITNESS GROWTH ENGINE™</span>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="fit-nav-links">
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('specialization')}
                >
                  Specialization
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('leak')}
                >
                  The Revenue Leak
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('engine')}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('journey')}
                >
                  Member Journey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('install')}
                >
                  What We Install
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="fit-nav-link"
                  onClick={() => scrollToSection('compare')}
                >
                  Comparison
                </button>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            className="fit-nav-cta-btn"
            onClick={() => scrollToSection('growth-plan', true)}
          >
            GET MY GROWTH PLAN
          </button>
        </div>
      </header>

      <main>
        {/* 01 HERO SECTION */}
        <section className="fit-hero-section" aria-labelledby="hero-title">
          <div className="fit-container fit-hero-grid">
            <div className="fit-hero-content">
              <div className="fit-hero-brand-kicker">
                <span className="fit-hero-brand">FITNESS GROWTH ENGINE™</span>
                <span className="fit-hero-endorsement">A Dynasty Works Studio Growth System</span>
              </div>

              <h1 id="hero-title" className="fit-hero-headline">
                TURN LOCAL INTEREST
                <span style={{ display: 'block' }}>INTO NEW MEMBERS.</span>
              </h1>

              <p className="fit-hero-copy">
                A member-acquisition and follow-up system built specifically for independent gyms and boutique fitness operators.
              </p>
              <p className="fit-hero-copy" style={{ marginTop: '-1rem', fontSize: '1rem', color: 'var(--fit-text-muted)' }}>
                From the first click to the first workout, we connect targeted campaigns, high-converting offers, immediate follow-up, trial or consultation booking, reminders and lead reactivation into one managed growth system.
              </p>

              <div className="fit-hero-actions">
                <button
                  type="button"
                  className="fit-btn fit-btn-primary"
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  GET MY GROWTH PLAN
                  <ArrowRight />
                </button>
                <button
                  type="button"
                  className="fit-btn fit-btn-secondary"
                  onClick={() => scrollToSection('engine')}
                >
                  SEE HOW IT WORKS
                </button>
              </div>

              <div className="fit-category-bar">
                <span className="fit-category-label">SPECIALIZED ARCHITECTURE FOR</span>
                <div className="fit-category-tags">
                  <span className="fit-category-tag">STRENGTH</span>
                  <span className="fit-category-tag">HIIT</span>
                  <span className="fit-category-tag">BOXING</span>
                  <span className="fit-category-tag">PERSONAL TRAINING</span>
                  <span className="fit-category-tag">TRANSFORMATION</span>
                  <span className="fit-category-tag">SPORTS PERFORMANCE</span>
                </div>
              </div>
            </div>

            {/* Dominant Hero Visual Placement */}
            <div className="fit-hero-image-frame" aria-hidden="true">
              <img
                src="/fitness/01-hero-facility.jpg"
                alt="Pristine architectural boutique gym strength floor with matte black racks"
                loading="eager"
              />
              <div className="fit-hero-floating-card">
                <div className="fit-float-item">
                  <span className="fit-float-label">Response Protocol</span>
                  <span className="fit-float-val">Immediate Multi-Touch</span>
                </div>
                <div className="fit-float-item">
                  <span className="fit-float-label">Booking Rate</span>
                  <span className="fit-float-val">Direct Calendar Sync</span>
                </div>
                <div className="fit-float-item">
                  <span className="fit-float-label">Pipeline Status</span>
                  <span className="fit-float-val" style={{ color: 'var(--fit-volt)' }}>
                    Active Member Opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 SPECIALIZATION SECTION */}
        <section id="specialization" className="fit-spec-section" aria-labelledby="spec-title">
          <div className="fit-container fit-spec-grid">
            <div className="fit-spec-image-wrap">
              <img
                src="/fitness/02-specialization-training.jpg"
                alt="High-end functional boutique training facility with turf and racks"
                loading="lazy"
              />
            </div>
            <div className="fit-spec-content">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>CATEGORY SPECIALIZATION</span>
              </div>
              <h2 id="spec-title" className="fit-section-headline" style={{ textAlign: 'left' }}>
                BUILT FOR
                <span style={{ display: 'block' }}>INDEPENDENT FITNESS OPERATORS.</span>
              </h2>
              <p className="fit-section-desc" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
                We build member-acquisition systems around the economics, offers and sales journey of local fitness businesses.
              </p>

              <div className="fit-spec-categories-grid">
                {[
                  'Strength & Conditioning',
                  'HIIT',
                  'Boxing / Kickboxing',
                  'Personal Training',
                  'Transformation Programs',
                  'Women\'s Fitness',
                  'Sports Performance',
                  'Boutique Fitness',
                ].map((cat) => (
                  <div key={cat} className="fit-spec-card">
                    <span className="fit-spec-dot" />
                    <h3 className="fit-spec-card-title">{cat}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 03 THE REVENUE LEAK SECTION */}
        <section id="leak" className="fit-leak-section" aria-labelledby="leak-title">
          <div className="fit-container">
            <div className="fit-section-header">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>OPERATIONAL FRICTION POINTS</span>
              </div>
              <h2 id="leak-title" className="fit-section-headline">
                THE LEAD IS NOT
                <span style={{ display: 'block' }}>THE NEW MEMBER.</span>
              </h2>
              <p className="fit-section-desc">
                Generating an inquiry is only the beginning. Fitness businesses lose opportunities when systems fail between the first click and the first workout.
              </p>
            </div>

            <div className="fit-leak-grid">
              {[
                {
                  num: '01',
                  title: 'Slow Follow-Up',
                  desc: 'Leads receive delayed responses while local interest is at its absolute peak, allowing motivation to drop.',
                },
                {
                  num: '02',
                  title: 'Unanswered Calls',
                  desc: 'Inbound calls and text inquiries go unreturned during peak floor coaching and training hours.',
                },
                {
                  num: '03',
                  title: 'Forgotten Trial Requests',
                  desc: 'Trial requests get buried in email inboxes or front-desk clipboards without structured tracking.',
                },
                {
                  num: '04',
                  title: 'Prospects Never Schedule',
                  desc: 'Inquirers are left without immediate self-scheduling options, delaying trial booking indefinitely.',
                },
                {
                  num: '05',
                  title: 'Trials Don\'t Show',
                  desc: 'Booked consultations and trial sessions suffer from no-shows due to missing reminder protocols.',
                },
                {
                  num: '06',
                  title: 'Inconsistent Staff Follow-Up',
                  desc: 'Floor trainers and desk staff juggle manual outreach without a standardized follow-up cadence.',
                },
                {
                  num: '07',
                  title: 'Untouched Old Leads',
                  desc: 'Valuable historical inquiries and past trial visitors sit dormant in spreadsheets without reactivation.',
                },
                {
                  num: '08',
                  title: 'Poor Pipeline Visibility',
                  desc: 'Gym operators lack real-time visibility into lead flow, booking rates, and membership close velocity.',
                },
              ].map((leak) => (
                <div key={leak.num} className="fit-leak-card">
                  <span className="fit-leak-num">LEAK // {leak.num}</span>
                  <h3 className="fit-leak-title">{leak.title}</h3>
                  <p className="fit-leak-desc">{leak.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 HUMAN / FITNESS VISUAL BREAK */}
        <section className="fit-visual-break-section" aria-hidden="true">
          <div className="fit-container">
            <div className="fit-visual-break-frame">
              <img
                src="/fitness/03-coach-member-break.jpg"
                alt="Professional coach consulting with adult member in an architectural private training facility"
                loading="lazy"
              />
              <div className="fit-visual-break-overlay">
                <div className="fit-visual-break-inner">
                  <div className="fit-visual-break-kicker">ATHLETIC STANDARDS</div>
                  <h2 className="fit-visual-break-headline">
                    FROM INTEREST
                    <span style={{ display: 'block' }}>TO FIRST WORKOUT.</span>
                  </h2>
                  <p className="fit-visual-break-subtext">
                    Connecting every operational touchpoint so that prospective members arrive prepared, committed, and ready to train.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 HOW IT WORKS SECTION */}
        <section id="engine" className="fit-engine-section" aria-labelledby="engine-title">
          <div className="fit-container">
            <div className="fit-section-header">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>THE ACQUISITION ARCHITECTURE</span>
              </div>
              <h2 id="engine-title" className="fit-section-headline">
                ONE CONNECTED
                <span style={{ display: 'block' }}>MEMBER ACQUISITION SYSTEM.</span>
              </h2>
              <p className="fit-section-desc">
                We replace fragmented ad campaigns and manual front-desk chasing with six synchronized operational phases.
              </p>
            </div>

            <div className="fit-engine-grid">
              {[
                {
                  num: '01',
                  title: 'GENERATE',
                  desc: 'Target local prospects around a specific introductory offer, assessment or program engineered for independent gym economics.',
                },
                {
                  num: '02',
                  title: 'CAPTURE',
                  desc: 'Dedicated conversion experiences turn interest into actionable inquiries with instant contact verification.',
                },
                {
                  num: '03',
                  title: 'RESPOND',
                  desc: 'New inquiries enter structured multi-channel follow-up immediately, reaching prospects while intent is highest.',
                },
                {
                  num: '04',
                  title: 'BOOK',
                  desc: 'Prospects schedule a trial, consultation, fitness assessment or first session directly onto your coaching calendar.',
                },
                {
                  num: '05',
                  title: 'RECOVER',
                  desc: 'No-shows and unresponsive prospects continue through structured follow-up sequences to reschedule without staff friction.',
                },
                {
                  num: '06',
                  title: 'MEASURE',
                  desc: 'Track inquiries, appointments, trials, and membership opportunities across every marketing channel in real time.',
                },
              ].map((step) => (
                <div key={step.num} className="fit-engine-card">
                  <div className="fit-engine-num">
                    <span>PHASE</span>
                    <span style={{ color: 'var(--fit-volt)' }}>{step.num}</span>
                  </div>
                  <h3 className="fit-engine-title">{step.title}</h3>
                  <p className="fit-engine-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 MEMBER JOURNEY SECTION */}
        <section id="journey" className="fit-journey-section" aria-labelledby="journey-title">
          <div className="fit-container">
            <div className="fit-section-header">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>INTERACTIVE CONSUMER JOURNEY</span>
              </div>
              <h2 id="journey-title" className="fit-section-headline">
                FROM FIRST CLICK
                <span style={{ display: 'block' }}>TO FIRST WORKOUT.</span>
              </h2>
              <p className="fit-section-desc">
                Explore the synchronized seven-stage path every prospect experiences from the initial impression through to long-term membership.
              </p>
            </div>

            {/* Stages Navigation Bar */}
            <div className="fit-journey-stages-nav" role="tablist" aria-label="Member Journey Stages">
              {journeyStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStageIndex === idx}
                  className={`fit-journey-stage-btn ${activeStageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveStageIndex(idx)}
                >
                  <span className="fit-journey-stage-num">{stage.num}</span>
                  <span>{stage.name}</span>
                </button>
              ))}
            </div>

            {/* Active Stage Detail Card */}
            <div className="fit-journey-card" role="tabpanel">
              <div className="fit-journey-card-left">
                <span className="fit-journey-card-kicker">{activeStage.kicker}</span>
                <h3 className="fit-journey-card-title">{activeStage.title}</h3>
                <p className="fit-journey-card-desc">{activeStage.description}</p>

                <ul className="fit-journey-features-list">
                  {activeStage.features.map((feature, i) => (
                    <li key={i} className="fit-journey-feature-item">
                      <span className="fit-journey-feature-icon">
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fit-journey-card-right">
                <div className="fit-journey-metric-block">
                  <span className="fit-journey-metric-label">{activeStage.metricLabel}</span>
                  <div className="fit-journey-metric-val">{activeStage.metricValue}</div>
                </div>
                <div className="fit-journey-metric-block">
                  <span className="fit-journey-metric-label">Execution Architecture</span>
                  <div className="fit-journey-metric-val" style={{ fontSize: '1.05rem', color: 'var(--fit-text-white)' }}>
                    Fully Automated Protocol
                  </div>
                </div>
                <button
                  type="button"
                  className="fit-btn fit-btn-primary"
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  INSTALL THIS STAGE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 07 WHAT WE INSTALL SECTION */}
        <section id="install" className="fit-install-section" aria-labelledby="install-title">
          <div className="fit-container">
            <div className="fit-section-header">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>INFRASTRUCTURE SPECIFICATION</span>
              </div>
              <h2 id="install-title" className="fit-section-headline">
                THE SYSTEM BEHIND
                <span style={{ display: 'block' }}>MEMBER ACQUISITION.</span>
              </h2>
              <p className="fit-section-desc">
                We install and connect twelve dedicated operational assets engineered specifically for local fitness businesses.
              </p>
            </div>

            <div className="fit-install-grid">
              {[
                { title: 'Campaign Strategy', desc: 'Targeted local acquisition campaigns built around high-converting introductory offers.' },
                { title: 'Offer Landing Page', desc: 'Conversion-engineered landing pages presenting your facility culture and membership offer.' },
                { title: 'Lead Capture', desc: 'Validated multi-step capture forms with instant duplicate check and territory routing.' },
                { title: 'CRM Pipeline', desc: 'Tailored HighLevel pipeline with custom stages for fitness trials, consults, and memberships.' },
                { title: 'SMS Follow-Up', desc: 'Immediate two-way conversational SMS sequences introducing coaches and confirming intent.' },
                { title: 'Email Follow-Up', desc: 'Branded email sequences communicating gym culture, preparation guidelines, and expectations.' },
                { title: 'Trial / Consultation Calendar', desc: 'Seamless online calendar sync directly mapped to coaching availability and floor capacity.' },
                { title: 'Appointment Reminders', desc: 'Automated multi-channel reminders drastically reducing consultation and trial no-shows.' },
                { title: 'No-Show Recovery', desc: 'Automated recovery sequences reconnecting missed sessions and rescheduling trials automatically.' },
                { title: 'Lead Nurture', desc: 'Structured educational sequences maintaining contact with undecided prospects.' },
                { title: 'Database Reactivation', desc: 'Seasonal campaigns awakening dormant leads and past gym members without ad spend.' },
                { title: 'Performance Reporting', desc: 'Clear visibility into lead cost, booking rates, show-up percentages, and new member revenue.' },
              ].map((item, idx) => (
                <div key={idx} className="fit-install-card">
                  <div className="fit-install-badge">
                    <CheckIcon />
                  </div>
                  <h3 className="fit-install-title">{item.title}</h3>
                  <p className="fit-install-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 08 COMPARISON SECTION */}
        <section id="compare" className="fit-compare-section" aria-labelledby="compare-title">
          <div className="fit-container">
            <div className="fit-section-header">
              <div className="fit-eyebrow">
                <span className="fit-eyebrow-line" />
                <span>OPERATING MODEL COMPARISON</span>
              </div>
              <h2 id="compare-title" className="fit-section-headline">
                MORE THAN
                <span style={{ display: 'block' }}>GYM LEADS.</span>
              </h2>
              <p className="fit-section-desc">
                Traditional marketing dumps raw leads into busy gyms. A connected system automates the journey all the way to enrollment.
              </p>
            </div>

            <div className="fit-compare-grid">
              {/* Traditional Column */}
              <div className="fit-compare-col">
                <span className="fit-compare-tag standard">TRADITIONAL APPROACH</span>
                <h3 className="fit-compare-title">FRAGMENTED LEAD GEN</h3>

                <div className="fit-compare-steps">
                  <div className="fit-compare-step dimmed">Ad</div>
                  <div className="fit-compare-step dimmed">Generic Website</div>
                  <div className="fit-compare-step dimmed">Lead</div>
                  <div className="fit-compare-step dimmed">Manual Follow-Up</div>
                </div>

                <p style={{ color: 'var(--fit-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginTop: 'auto' }}>
                  Front-desk staff struggle to chase unvetted leads between coaching sessions. Inquiries grow cold, appointments are forgotten, and ad spend is squandered on unmeasured clicks.
                </p>
              </div>

              {/* Connected Column */}
              <div className="fit-compare-col highlight">
                <span className="fit-compare-tag volt">DYNASTY CONNECTED SYSTEM</span>
                <h3 className="fit-compare-title">CONNECTED ACQUISITION ENGINE</h3>

                <div className="fit-compare-steps">
                  {[
                    'Targeted Campaign',
                    'Dedicated Offer',
                    'Lead Capture',
                    'Immediate Response Workflow',
                    'Trial / Consultation',
                    'Membership Pipeline',
                    'No-Show Recovery',
                    'Reactivation',
                    'Optimization',
                  ].map((step, i) => (
                    <div key={i} className="fit-compare-step connected">
                      <span className="fit-step-arrow">→</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <p style={{ color: 'var(--fit-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginTop: 'auto' }}>
                  A unified operating system engineered around your actual member economics. Every inquiry is verified, engaged instantly, scheduled, and tracked into active membership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 09 FRONT-END OFFER SECTION */}
        <section id="offer" className="fit-offer-section" aria-labelledby="offer-title">
          <div className="fit-container">
            <div className="fit-offer-card">
              <div className="fit-offer-header">
                <span className="fit-offer-badge">COMPLIMENTARY CONSULTATION & AUDIT</span>
                <h2 id="offer-title" className="fit-offer-headline">
                  YOUR COMPLIMENTARY
                  <span style={{ display: 'block' }}>FITNESS GROWTH PLAN.</span>
                </h2>
                <p className="fit-offer-subcopy">
                  We'll review your current member-acquisition process and identify where stronger offers, follow-up, booking and reactivation systems could create additional opportunity.
                </p>
              </div>

              <div className="fit-offer-review-grid">
                {[
                  { num: '01', title: 'CURRENT LEAD FLOW', desc: 'Comprehensive audit of your existing traffic channels, inquiries, and conversion touchpoints.' },
                  { num: '02', title: 'PRIMARY MEMBERSHIP / PROGRAM OFFER', desc: 'Evaluation of your introductory packages, pricing structure, and front-end positioning.' },
                  { num: '03', title: 'LEAD RESPONSE + FOLLOW-UP', desc: 'Analysis of speed-to-lead response cadence, staff workload, and communication friction.' },
                  { num: '04', title: 'TRIAL / CONSULTATION PROCESS', desc: 'Review of scheduling pathways, reminder automation, and attendance rates.' },
                  { num: '05', title: 'DORMANT LEAD DATABASE', desc: 'Assessment of untapped past inquiries and former members eligible for reactivation.' },
                  { num: '06', title: 'RECOMMENDED ACQUISITION ROADMAP', desc: 'Custom strategic blueprint outlining the exact infrastructure required to scale.' },
                ].map((item) => (
                  <div key={item.num} className="fit-offer-item">
                    <span className="fit-offer-item-num">{item.num}</span>
                    <div>
                      <h3 className="fit-offer-item-title">{item.title}</h3>
                      <p className="fit-offer-item-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fit-offer-footer">
                <button
                  type="button"
                  className="fit-btn fit-btn-primary"
                  onClick={() => scrollToSection('growth-plan', true)}
                >
                  GET MY GROWTH PLAN
                  <ArrowRight />
                </button>
                <div className="fit-offer-assurances">
                  <span className="fit-assurance-item">
                    <span>✓</span> No Cost
                  </span>
                  <span className="fit-assurance-item">
                    <span>✓</span> No Obligation
                  </span>
                  <span className="fit-assurance-item">
                    <span>✓</span> Confidential Operational Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10 QUALIFICATION FORM SECTION */}
        <section id="growth-plan" className="fit-form-section" aria-labelledby="form-title">
          <div className="fit-container">
            <div className="fit-form-wrapper">
              <div className="fit-form-header">
                <div className="fit-eyebrow">
                  <span className="fit-eyebrow-line" />
                  <span>COMMENCE OPERATIONAL AUDIT</span>
                </div>
                <h2 id="form-title" className="fit-form-title">
                  LET'S BUILD YOUR
                  <span style={{ display: 'block' }}>MEMBER ACQUISITION PIPELINE.</span>
                </h2>
                <p className="fit-form-subtitle">
                  Provide your gym details below. We'll examine your local market, evaluate your current conversion flow, and deliver a custom acquisition roadmap.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {errors.form && (
                  <div
                    style={{
                      background: 'rgba(255, 107, 107, 0.15)',
                      border: '1px solid #ff6b6b',
                      borderRadius: 'var(--fit-radius-xs)',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      color: '#ff6b6b',
                      fontSize: '0.875rem',
                    }}
                  >
                    {errors.form}
                  </div>
                )}

                <div className="fit-form-grid">
                  {/* First Name */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-firstName" className="fit-label">
                      First Name <span className="req">*</span>
                    </label>
                    <input
                      id="fit-firstName"
                      type="text"
                      name="firstName"
                      className="fit-input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Marcus"
                      required
                    />
                    {errors.firstName && <span className="fit-field-error">{errors.firstName}</span>}
                  </div>

                  {/* Last Name */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-lastName" className="fit-label">
                      Last Name <span className="req">*</span>
                    </label>
                    <input
                      id="fit-lastName"
                      type="text"
                      name="lastName"
                      className="fit-input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Vance"
                      required
                    />
                    {errors.lastName && <span className="fit-field-error">{errors.lastName}</span>}
                  </div>

                  {/* Gym / Studio Name */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-gymName" className="fit-label">
                      Gym / Studio Name <span className="req">*</span>
                    </label>
                    <input
                      id="fit-gymName"
                      type="text"
                      name="gymName"
                      className="fit-input"
                      value={formData.gymName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Strength & Conditioning"
                      required
                    />
                    {errors.gymName && <span className="fit-field-error">{errors.gymName}</span>}
                  </div>

                  {/* Website */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-website" className="fit-label">
                      Website
                    </label>
                    <input
                      id="fit-website"
                      type="url"
                      name="website"
                      className="fit-input"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g. https://apexstrength.com"
                    />
                  </div>

                  {/* Email */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-email" className="fit-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="fit-email"
                      type="email"
                      name="email"
                      className="fit-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. marcus@apexstrength.com"
                      required
                    />
                    {errors.email && <span className="fit-field-error">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-phone" className="fit-label">
                      Direct Phone <span className="req">*</span>
                    </label>
                    <input
                      id="fit-phone"
                      type="tel"
                      name="phone"
                      className="fit-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. (555) 234-5678"
                      required
                    />
                    {errors.phone && <span className="fit-field-error">{errors.phone}</span>}
                  </div>

                  {/* City */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-city" className="fit-label">
                      City <span className="req">*</span>
                    </label>
                    <input
                      id="fit-city"
                      type="text"
                      name="city"
                      className="fit-input"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Austin"
                      required
                    />
                    {errors.city && <span className="fit-field-error">{errors.city}</span>}
                  </div>

                  {/* State */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-state" className="fit-label">
                      State <span className="req">*</span>
                    </label>
                    <input
                      id="fit-state"
                      type="text"
                      name="state"
                      className="fit-input"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. TX"
                      required
                    />
                    {errors.state && <span className="fit-field-error">{errors.state}</span>}
                  </div>

                  {/* Business Type */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-businessType" className="fit-label">
                      Business Type <span className="req">*</span>
                    </label>
                    <select
                      id="fit-businessType"
                      name="businessType"
                      className="fit-select"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                    >
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && <span className="fit-field-error">{errors.businessType}</span>}
                  </div>

                  {/* Primary Offer To Grow */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-primaryOffer" className="fit-label">
                      Primary Offer To Grow <span className="req">*</span>
                    </label>
                    <select
                      id="fit-primaryOffer"
                      name="primaryOffer"
                      className="fit-select"
                      value={formData.primaryOffer}
                      onChange={handleInputChange}
                      required
                    >
                      {primaryOffers.map((offer) => (
                        <option key={offer} value={offer}>
                          {offer}
                        </option>
                      ))}
                    </select>
                    {errors.primaryOffer && <span className="fit-field-error">{errors.primaryOffer}</span>}
                  </div>

                  {/* Approximate Monthly Marketing Budget */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-monthlyBudget" className="fit-label">
                      Approximate Monthly Marketing Budget <span className="req">*</span>
                    </label>
                    <select
                      id="fit-monthlyBudget"
                      name="monthlyBudget"
                      className="fit-select"
                      value={formData.monthlyBudget}
                      onChange={handleInputChange}
                      required
                    >
                      {budgetTiers.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                    {errors.monthlyBudget && <span className="fit-field-error">{errors.monthlyBudget}</span>}
                  </div>

                  {/* Current Monthly Lead Volume */}
                  <div className="fit-form-group">
                    <label htmlFor="fit-currentLeadVolume" className="fit-label">
                      Current Monthly Lead Volume
                    </label>
                    <select
                      id="fit-currentLeadVolume"
                      name="currentLeadVolume"
                      className="fit-select"
                      value={formData.currentLeadVolume}
                      onChange={handleInputChange}
                    >
                      {leadVolumes.map((vol) => (
                        <option key={vol} value={vol}>
                          {vol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question: Success Criteria */}
                  <div className="fit-form-group full-width">
                    <label htmlFor="fit-successCriteria" className="fit-label">
                      What would make this growth program successful for your gym or studio?
                    </label>
                    <textarea
                      id="fit-successCriteria"
                      name="successCriteria"
                      className="fit-textarea"
                      value={formData.successCriteria}
                      onChange={handleInputChange}
                      placeholder="e.g. Adding 30 committed recurring members over the next 90 days, filling our morning small-group slots, and automating trial follow-up."
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="fit-consent-group">
                  <input
                    type="checkbox"
                    id="fit-consent"
                    name="consent"
                    className="fit-checkbox"
                    checked={formData.consent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="fit-consent" className="fit-consent-text">
                    I agree to receive communications regarding my complimentary Fitness Growth Plan from Dynasty Works Studio. I understand that I can unsubscribe at any time and that my information will remain strictly confidential.
                  </label>
                </div>
                {errors.consent && (
                  <div className="fit-field-error" style={{ marginBottom: '1.5rem', marginTop: '-1rem' }}>
                    {errors.consent}
                  </div>
                )}

                <div className="fit-form-actions">
                  <button
                    type="submit"
                    className="fit-btn fit-btn-primary fit-form-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'GENERATING YOUR PLAN...' : 'GET MY GROWTH PLAN'}
                    {!isSubmitting && <ArrowRight />}
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fit-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Strict Privacy · No Obligation · Built For Independent Operators
                  </span>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 11 FINAL VISUAL SECTION */}
        <section className="fit-final-section" aria-labelledby="final-title">
          <img
            src="/fitness/06-final-sanctuary.jpg"
            alt="Atmospheric architectural private gym sanctuary at dusk"
            className="fit-final-bg-image"
            loading="lazy"
          />
          <div className="fit-container fit-final-card">
            <div className="fit-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="fit-eyebrow-line" />
              <span>COMMENCE ACQUISITION ROADMAP</span>
              <span className="fit-eyebrow-line" />
            </div>
            <h2 id="final-title" className="fit-final-headline">
              YOUR NEXT MEMBER
              <span style={{ display: 'block' }}>IS ALREADY LOOKING.</span>
            </h2>
            <p className="fit-final-copy">
              Install the connected acquisition system that turns local interest into trial sessions, assessments, and committed long-term members.
            </p>
            <div className="fit-hero-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="fit-btn fit-btn-primary"
                onClick={() => scrollToSection('growth-plan', true)}
              >
                GET MY GROWTH PLAN
                <ArrowRight />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 12 FOOTER */}
      <footer className="fit-footer" role="contentinfo">
        <div className="fit-container fit-footer-inner">
          <p className="fit-footer-copy">
            © {new Date().getFullYear()} Dynasty Works Studio. Fitness Growth Engine™ is a proprietary vertical acquisition system.
          </p>
          <div className="fit-footer-links">
            <a href="/" className="fit-footer-link">Home</a>
            <a href="/growth/medspa" className="fit-footer-link">MedSpa Engine</a>
            <a href="/work" className="fit-footer-link">Selected Work</a>
            <a href="/capabilities" className="fit-footer-link">Capabilities</a>
            <a href="/privacy" className="fit-footer-link">Privacy</a>
            <a href="/terms" className="fit-footer-link">Terms</a>
          </div>
        </div>
      </footer>

      {/* SUCCESS CONFIRMATION MODAL */}
      {modalOpen && submissionResult && (
        <div
          className="fit-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div className="fit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fit-modal-badge">
              <CheckIcon />
            </div>
            <h3 id="modal-title" className="fit-modal-title">
              GROWTH PLAN REQUEST RECEIVED
            </h3>
            <p className="fit-modal-desc">
              Thank you, <strong>{formData.firstName}</strong>. We've initiated the operational review for <strong>{formData.gymName}</strong>. Our team is analyzing your local market and preparing your custom Member Acquisition Roadmap.
            </p>
            <div className="fit-modal-ref">
              REFERENCE ID: {submissionResult.referenceId}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--fit-text-muted)', marginBottom: '1.5rem' }}>
              Mode: {submissionResult.mode === 'live_webhook' ? 'Dispatched to Live HighLevel Pipeline' : 'Preview Mode (Local Ingestion Ready)'}
            </p>
            <button
              type="button"
              className="fit-btn fit-btn-primary"
              style={{ width: '100%' }}
              onClick={() => setModalOpen(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
