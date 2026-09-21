import React, { useEffect, useRef, useState } from 'react';
import {
  startingPoints,
  launchWindows,
  budgetChoices,
  type BusinessType,
  type BuildNeed,
} from '@/data/company-builder';
import { emptyCompanyBuild, availableNeeds, normalizeBuild } from '@/lib/company-builder';
import {
  generateRoadmap,
  roadmapText,
  createLeadPayload,
  type BuildRoadmap,
} from '@/lib/recommendation-engine';
import { businessStages, serviceById, type BusinessStage, type RoadmapPhase } from '@/data/service-catalog';
import { creationStages, stageForPhase, type CreationStage } from '@/data/company-creation';
import type { CompanyBuild } from '@/types/company';
import { submitInquiry, generateIdempotencyKey } from '@/lib/submission-client';
import { FounderAssetUpload } from './FounderAssetUpload';
import { type FounderAsset, uploadInquiryAssets } from '@/lib/asset-client';
import './ReviewDiagnostic.css';

const suggested: BuildNeed[] = [
  'Brand Identity',
  'Packaging',
  'Website',
  'E-commerce',
  'Application',
  'Launch',
  'AI / Automation',
  'Ongoing Support',
  'Distribution Strategy',
  'Retail Readiness',
  'Market Activation',
  'Advertising',
  'Social Content',
  'Video',
  'Pitch Deck',
  'Business Collateral',
];

interface ReviewDiagnosticProps {
  businessType: BusinessType;
  onRestart: () => void;
  onMapChange: (map: { phases: string[]; complete: boolean }) => void;
}

export default function ReviewDiagnostic({
  businessType,
  onRestart,
  onMapChange,
}: ReviewDiagnosticProps) {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<BusinessStage>('Idea');
  const [starting, setStarting] = useState<CompanyBuild['starting']>([]);
  const [needs, setNeeds] = useState<BuildNeed[]>([]);
  const [error, setError] = useState('');
  const [downloadPrepared, setDownloadPrepared] = useState(false);

  // Optional Planning Context
  const [companyName, setCompanyName] = useState('');
  const [launchWindow, setLaunchWindow] = useState('Exploring');
  const [budgetChoice, setBudgetChoice] = useState('Let’s define the range together');
  const [budgetNote, setBudgetNote] = useState('');
  const [contextExpanded, setContextExpanded] = useState(false);

  // Post-Roadmap Studio Brief Preparation
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadAmbition, setLeadAmbition] = useState('');
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadHoneypot, setLeadHoneypot] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadReceiptId, setLeadReceiptId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState('');
  const [assets, setAssets] = useState<FounderAsset[]>([]);
  const [assetUploadStatus, setAssetUploadStatus] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>(generateIdempotencyKey());

  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    title.current?.focus();
  }, [step]);

  const build = normalizeBuild({
    ...emptyCompanyBuild,
    businessType,
    businessStage: stage,
    starting: starting.length ? starting : [startingPoints[0]],
    needs,
    uncertainNeeds: !needs.length,
    company: companyName,
    launch: (launchWindow as any) || 'Exploring',
    budgetChoice: (budgetChoice as any) || 'Let’s define the range together',
    budgetNote,
  });

  useEffect(() => {
    onMapChange({
      phases: generateRoadmap(build).phases.map((p) => p.name),
      complete: step === 2,
    });
  }, [businessType, stage, starting, needs, step, companyName, launchWindow, budgetChoice, budgetNote]);

  const permitted = availableNeeds(build);
  const result: BuildRoadmap | null = step === 2 ? generateRoadmap(build) : null;

  function next() {
    if (step === 0 && !starting.length) {
      setError('Select your current starting point to continue.');
      return;
    }
    setError('');
    setStep(step + 1);
  }

  function toggleAsset(item: CompanyBuild['starting'][number]) {
    setStarting((current) =>
      current.includes(item)
        ? current.filter((x) => x !== item)
        : item === startingPoints[0]
        ? [item]
        : [...current.filter((x) => x !== startingPoints[0]), item]
    );
  }

  function toggleNeed(item: BuildNeed) {
    setNeeds((current) =>
      current.includes(item) ? current.filter((n) => n !== item) : [...current, item]
    );
  }

  function download() {
    const slug = (companyName || businessType).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `dynasty-works-${slug}-roadmap.txt`;
    const url = URL.createObjectURL(
      new Blob([roadmapText(build)], { type: 'text/plain;charset=utf-8' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloadPrepared(true);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handlePrint() {
    window.print();
  }

  function triggerBriefJsonDownload(payload?: unknown) {
    const slug = (companyName || businessType).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const briefFilename = `dynasty-works-${slug}-brief.json`;
    const dataToSave = payload || createLeadPayload(
      {
        ...build,
        name: leadName.trim() || 'Confidential Founder',
        email: leadEmail.trim(),
        phone: leadPhone.trim(),
        company: companyName.trim() || build.company || 'Confidential Venture',
      },
      {
        builderSessionId: idempotencyKeyRef.current,
        createdAt: new Date().toISOString(),
      }
    );
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = briefFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleSaveLead(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadEmail.includes('@')) {
      setLeadError('Please provide your name and a valid work email.');
      return;
    }
    if (!leadConsent) {
      setLeadError('Please confirm consent for Dynasty Works Studio to evaluate your brief.');
      return;
    }
    setLeadError('');
    setIsSubmitting(true);

    const leadBuild: CompanyBuild = {
      ...build,
      name: leadName.trim(),
      email: leadEmail.trim(),
      phone: leadPhone.trim(),
      company: companyName.trim() || build.company || 'Confidential Venture',
    };
    const identity = {
      builderSessionId: idempotencyKeyRef.current,
      createdAt: new Date().toISOString(),
    };
    const localPayload = createLeadPayload(leadBuild, identity);

    try {
      localStorage.setItem('dws_company_builder_lead', JSON.stringify(localPayload));
    } catch {
      // Local storage fallback
    }

    const remotePayload = {
      name: leadName.trim(),
      email: leadEmail.trim(),
      phone: leadPhone.trim() || '',
      company: companyName.trim() || build.company || 'Confidential Venture',
      website: '',
      businessType,
      businessStage: stage,
      existingAssets: starting,
      selectedNeeds: needs,
      launchTimeline: launchWindow || 'Exploring',
      budgetRange: budgetChoice || '',
      ambitionNotes: leadAmbition.trim() || '',
    };

    try {
      const res = await submitInquiry('builder', remotePayload, {
        idempotencyKey: idempotencyKeyRef.current,
        honeypot: leadHoneypot,
      });

      if (res.success) {
        const confirmedReceipt = res.data.receiptId;
        setLeadReceiptId(confirmedReceipt);
        setLeadSaved(true);
        setSubmissionFeedback(res.data.message || 'Brief securely received.');
        download();
        triggerBriefJsonDownload(localPayload);

        if (assets.length > 0) {
          setAssetUploadStatus('Securing venture documents in encrypted vault...');
          setAssets((prev) => prev.map((a) => ({ ...a, status: 'uploading', progress: 15 })));

          try {
            const rawFiles = assets.map((a) => a.file);
            const uploadBatch = await uploadInquiryAssets(
              confirmedReceipt,
              rawFiles,
              (fileIndex, progress, status, error) => {
                setAssets((prev) => {
                  const copy = [...prev];
                  if (copy[fileIndex]) {
                    copy[fileIndex] = {
                      ...copy[fileIndex],
                      progress,
                      status,
                      error,
                    };
                  }
                  return copy;
                });
              }
            );

            if (uploadBatch.uploadedCount > 0) {
              setAssetUploadStatus(
                `✓ ${uploadBatch.uploadedCount} of ${uploadBatch.totalFiles} confidential document(s) securely vault-stored with your brief.`
              );
            } else if (uploadBatch.failedCount > 0) {
              setAssetUploadStatus(
                'Note: Document vault transfer encountered an issue. Your brief remains securely received.'
              );
            }
          } catch (assetErr) {
            console.error('Asset upload batch exception:', assetErr);
            setAssetUploadStatus(
              'Note: Document vault transfer encountered an issue. Your brief remains securely received.'
            );
          }
        }
      } else {
        if (res.error.status === 'not_configured' || res.error.status === 'unavailable' || res.error.status === 'network_error') {
          setLeadSaved(true);
          setSubmissionFeedback(
            res.error.message ||
              'Remote submission endpoint is not enabled. Your brief and roadmap are preserved locally.'
          );
          download();
          triggerBriefJsonDownload(localPayload);
        } else {
          setLeadError(res.error.message || 'Submission could not be completed.');
        }
      }
    } catch {
      setLeadSaved(true);
      setSubmissionFeedback(
        'Unable to connect to submission service. Your brief and roadmap have been saved locally.'
      );
      download();
      triggerBriefJsonDownload(localPayload);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDownloadOnly() {
    if (!leadName.trim() || !leadEmail.trim() || !leadEmail.includes('@')) {
      setLeadError('Please provide your name and a valid work email.');
      return;
    }
    setLeadError('');
    download();
    triggerBriefJsonDownload();
    setLeadSaved(true);
    setSubmissionFeedback('Local project dossier downloaded. No remote submission was made.');
  }

  return (
    <div className="diagnostic r51-diagnostic dws-diagnostic-shell">
      {/* Step Indicators */}
      <div className="diagnostic-progress" aria-label={`Roadmap step ${step + 1} of 3`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={i <= step ? 'complete' : ''} />
        ))}
      </div>

      <div className="dws-diag-meta">
        <span className="step-count">{businessType} · Step {step + 1} of 3</span>
        <span>
          {step === 0
            ? '02 / OPERATIONAL STAGE'
            : step === 1
            ? '03 / STRATEGIC PRIORITIES'
            : '04 / EXECUTIVE ROADMAP'}
        </span>
      </div>

      <h3 ref={title} tabIndex={-1} className="dws-diag-step-title">
        {step === 0
          ? 'Where does it stand?'
          : step === 1
          ? 'What does it need?'
          : 'Executive Company Build Roadmap'}
      </h3>

      <p className="dws-diag-step-desc">
        {step === 0
          ? 'Establish the operational starting point so our engine sequences the foundational dependencies.'
          : step === 1
          ? 'Select the critical capabilities required to transform this concept into a functional operating company.'
          : 'A boardroom-grade strategic architecture organizing proprietary services across four macro execution phases.'}
      </p>

      {/* STEP 0: STAGE & EXISTING ASSETS */}
      {step === 0 && (
        <>
          <div className="dws-diag-field">
            <label htmlFor="business-stage" className="dws-diag-label">
              Operational Stage
            </label>
            <select
              id="business-stage"
              className="dws-diag-select"
              value={stage}
              onChange={(e) => setStage(e.target.value as BusinessStage)}
            >
              {businessStages.map((s) => (
                <option key={s} value={s}>
                  {s} Stage
                </option>
              ))}
            </select>
          </div>

          <fieldset className="dws-diag-field">
            <legend className="dws-diag-label">What already exists?</legend>
            <div className="dws-check-grid">
              {startingPoints.map((item) => (
                <label
                  className={`check-choice dws-check-card ${starting.includes(item) ? 'is-checked' : ''}`}
                  key={item}
                >
                  <input
                    type="checkbox"
                    checked={starting.includes(item)}
                    onChange={() => toggleAsset(item)}
                  />
                  <span className="dws-check-label">{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {/* STEP 1: PRIORITIES & OPTIONAL PLANNING CONTEXT */}
      {step === 1 && (
        <>
          <fieldset className="dws-diag-field">
            <legend className="dws-diag-label">
              Select Build Priorities (or continue with foundational defaults)
            </legend>
            <div className="dws-check-grid">
              {suggested
                .filter((n) => permitted.includes(n))
                .map((item) => (
                  <label
                    className={`check-choice dws-check-card ${needs.includes(item) ? 'is-checked' : ''}`}
                    key={item}
                  >
                    <input
                      type="checkbox"
                      checked={needs.includes(item)}
                      onChange={() => toggleNeed(item)}
                    />
                    <span className="dws-check-label">{item}</span>
                  </label>
                ))}
            </div>
          </fieldset>

          {/* Optional Planning Context */}
          <div className="dws-context-accordion">
            <button
              type="button"
              className="dws-context-toggle"
              onClick={() => setContextExpanded(!contextExpanded)}
              aria-expanded={contextExpanded}
            >
              <span className="dws-context-toggle-title">
                {contextExpanded ? '− Close Planning Context' : '+ Add Planning Context'}
                <span className="dws-context-tag">Improves Qualification · Optional</span>
              </span>
              <span aria-hidden="true">{contextExpanded ? '▲' : '▼'}</span>
            </button>

            {contextExpanded && (
              <div className="dws-context-fields">
                <div>
                  <label htmlFor="company-name" className="dws-diag-label">
                    Company / Project Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    className="dws-diag-input"
                    placeholder="e.g. Sovereign Living"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="launch-window" className="dws-diag-label">
                    Target Launch Window
                  </label>
                  <select
                    id="launch-window"
                    className="dws-diag-select"
                    value={launchWindow}
                    onChange={(e) => setLaunchWindow(e.target.value)}
                  >
                    {launchWindows.map((lw) => (
                      <option key={lw} value={lw}>
                        {lw}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget-choice" className="dws-diag-label">
                    Approximate Build Budget
                  </label>
                  <select
                    id="budget-choice"
                    className="dws-diag-select"
                    value={budgetChoice}
                    onChange={(e) => setBudgetChoice(e.target.value)}
                  >
                    {budgetChoices.map((bc) => (
                      <option key={bc} value={bc}>
                        {bc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget-note" className="dws-diag-label">
                    Budget Guidance Notes
                  </label>
                  <input
                    id="budget-note"
                    type="text"
                    className="dws-diag-input"
                    placeholder="e.g. Seeking seed-stage foundation"
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {/* STEP 2: EXECUTIVE COMPANY BUILD ROADMAP */}
      {result && (
        <div className="roadmap-result dws-executive-roadmap" id="executive-roadmap">
          {/* Executive Header */}
          <div className="dws-roadmap-head">
            <div className="dws-roadmap-super">
              <span>DYNASTY WORKS STUDIO / STRATEGIC ARCHITECTURE</span>
              <span>CONFIDENTIAL ROADMAP</span>
            </div>
            <h3 className="dws-roadmap-title">
              {companyName ? `${companyName} — Company Build Roadmap` : `${businessType} Build Roadmap`}
            </h3>

            <div className="dws-roadmap-meta-grid">
              <div className="dws-meta-item">
                <small>Business Type</small>
                <strong>{businessType}</strong>
              </div>
              <div className="dws-meta-item">
                <small>Current Stage</small>
                <strong>{result.stage}</strong>
              </div>
              <div className="dws-meta-item">
                <small>Target Window</small>
                <strong>{launchWindow}</strong>
              </div>
              <div className="dws-meta-item">
                <small>Recommended Scope</small>
                <strong>{result.items.length} Disciplines</strong>
              </div>
            </div>
          </div>

          {/* 4-Stage Macro Architecture Overview */}
          <div className="dws-macro-architecture">
            <div className="dws-section-subtitle">
              01 / FOUR-STAGE MACRO CREATION SYSTEM
            </div>
            <div className="dws-macro-grid">
              {creationStages.map((stageItem) => {
                const activeServices = result.phases
                  .filter((p) => stageForPhase[p.name] === stageItem.id)
                  .flatMap((p) => p.items);
                const isActive = activeServices.length > 0;
                return (
                  <div
                    key={stageItem.id}
                    className={`dws-macro-card ${isActive ? 'is-active' : 'is-idle'}`}
                  >
                    <div>
                      <span className="dws-macro-step">{stageItem.id.toUpperCase()}</span>
                      <h4 className="dws-macro-name">{stageItem.name}</h4>
                      <p className="dws-macro-line">{stageItem.line}</p>
                    </div>
                    <span className="dws-macro-badge">
                      {isActive ? `${activeServices.length} Recommended` : 'Foundation Only'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immediate Priorities Callout */}
          {(() => {
            const initials = result.items.filter((i) => i.timing === 'initial');
            return initials.length > 0 ? (
              <div className="dws-immediate-callout">
                <h4>Immediate First Moves ({initials.length} Critical Path Services)</h4>
                <p>
                  These capabilities represent Day 1 dependencies. Downstream product,
                  market activation, and automated scaling rely on these foundations:
                </p>
                <div className="dws-immediate-chips">
                  {initials.map((item) => (
                    <span key={item.serviceId} className="dws-immediate-chip">
                      {serviceById[item.serviceId]?.name || item.serviceId}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Sequential Service Architecture Organized by Macro Landmarks */}
          <div className="dws-phase-sequence">
            <div className="dws-section-subtitle">
              02 / SEQUENTIAL PHASES & SERVICE DEPENDENCIES
            </div>
            
            {creationStages.map((stageItem) => {
              const stagePhases = result.phases.filter(
                (p) => stageForPhase[p.name] === stageItem.id
              );
              if (stagePhases.length === 0) return null;

              return (
                <div key={stageItem.id} className="dws-macro-landmark">
                  <div className="dws-macro-landmark-head">
                    <span className="dws-macro-landmark-tag">
                      STAGE {stageItem.id.toUpperCase()}
                    </span>
                    <h4 className="dws-macro-landmark-title">{stageItem.name}</h4>
                  </div>
                  <p className="dws-macro-landmark-desc">{stageItem.line}</p>

                  <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {stagePhases.map((phase) => (
                      <li key={phase.name} className="dws-phase-block">
                        <div className="dws-phase-head">
                          <h4>{phase.name}</h4>
                          <span className="dws-phase-count">
                            {phase.items.length} {phase.items.length === 1 ? 'service' : 'services'}
                          </span>
                        </div>

                        <div className="dws-service-table">
                          {phase.items.map((item) => {
                            const svc = serviceById[item.serviceId];
                            return (
                              <div key={item.serviceId} className="dws-service-row">
                                <div className="dws-service-name">
                                  {svc?.name || item.serviceId}
                                </div>
                                <div className="dws-service-desc">
                                  {item.reason}
                                  {item.prerequisiteNotes.length > 0 && (
                                    <span className="dws-service-dependency">
                                      ↳ {item.prerequisiteNotes.join(' ')}
                                    </span>
                                  )}
                                </div>
                                <div className="dws-service-badge-col">
                                  <span
                                    className={`dws-timing-badge ${
                                      item.timing === 'initial' ? 'initial' : 'future'
                                    }`}
                                  >
                                    {item.timing === 'initial' ? 'Initial priority' : 'Future phase'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          {/* Strategic Guidance & Regulatory Boundaries */}
          <div className="dws-guidance-panel">
            <div className="dws-guidance-title">Timeline & Dependency Notice</div>
            <p className="dws-guidance-text">{result.timelineNote}</p>

            {result.specialistNotes.length > 0 && (
              <>
                <div className="dws-guidance-title" style={{ marginTop: '14px' }}>
                  Professional Boundaries
                </div>
                {result.specialistNotes.map((note, idx) => (
                  <p key={idx} className="dws-guidance-text">
                    {note}
                  </p>
                ))}
              </>
            )}

            <div className="dws-guidance-title" style={{ marginTop: '14px' }}>
              Recommended Studio Engagement
            </div>
            <p className="dws-guidance-text result-engagement">
              Primary Vehicle: <strong>{result.engagement.name}</strong> — {result.engagement.reason}
            </p>
          </div>

          {/* Commercial Boundaries Elegant Notice */}
          <div className="dws-boundaries-note">
            Preliminary strategic diagnostic. Final scope, commercial terms, and execution timeline
            are established through direct studio review. Non-binding advisory roadmap.
          </div>

          {/* RECOMMENDED NEXT DECISION — COMMERCIAL ENGAGEMENT LADDER */}
          <div className="dws-commercial-ladder">
            <div className="dws-ladder-title">RECOMMENDED NEXT DECISION · COMMERCIAL ENGAGEMENT LADDER</div>
            <div className="dws-ladder-grid">
              <div className="dws-ladder-step">
                <div>
                  <span className="dws-ladder-num">TIER 01 / INITIAL ROADMAP</span>
                  <div className="dws-ladder-name">Company Builder</div>
                  <div className="dws-ladder-price">Free / Completed Above</div>
                  <p className="dws-ladder-desc">
                    Deterministic strategic assessment mapping initial scope, sequence, and service
                    dependencies.
                  </p>
                </div>
              </div>

              <div className="dws-ladder-step is-highlighted">
                <span className="dws-ladder-badge">RECOMMENDED NEXT STEP</span>
                <div>
                  <span className="dws-ladder-num">TIER 02 / STRATEGIC ADVISORY</span>
                  <div className="dws-ladder-name">Founder Blueprint</div>
                  <div className="dws-ladder-price">$1,500 Strategic Scoping</div>
                  <p className="dws-ladder-desc">
                    A high-conviction 2–3 week strategic engagement clarifying brand architecture,
                    technical requirements, and exact execution specs.
                  </p>
                </div>
                <a href="/founder-blueprint" className="dws-ladder-cta-primary">
                  Explore Founder Blueprint <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="dws-ladder-step">
                <div>
                  <span className="dws-ladder-num">TIER 03 / VENTURE CREATION</span>
                  <div className="dws-ladder-name">Full Company Build</div>
                  <div className="dws-ladder-price">Custom Scope</div>
                  <p className="dws-ladder-desc">
                    End-to-end execution across Strategy, Identity, Product, Packaging, Digital,
                    Automation, and Market launch.
                  </p>
                </div>
                <a href="/contact" className="dws-ladder-action">
                  Talk to the Studio <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Export Utilities */}
          <div className="dws-export-bar">
            <button className="primary-action" onClick={download}>
              Download your roadmap <span aria-hidden="true">↓</span>
            </button>
            <button className="dws-btn-secondary" onClick={handlePrint}>
              Print / Save as PDF <span aria-hidden="true">↗</span>
            </button>
          </div>

          <p className="instrument-note" role="status">
            {downloadPrepared
              ? 'Roadmap file prepared and downloaded. You can also review the complete raw output below.'
              : 'This preliminary roadmap is generated locally in your browser. All inputs remain private.'}
          </p>

          {/* Collapsible raw text output */}
          <details className="roadmap-text">
            <summary>Read raw engine output</summary>
            <pre>{roadmapText(build)}</pre>
          </details>

          {/* POST-ROADMAP STUDIO BRIEF PREPARATION (TRUTHFUL CTA LANGUAGE & DELIBERATE INPUTS) */}
          <div className="dws-lead-capture-box">
            <div className="dws-lead-header">
              <span className="dws-lead-kicker">STUDIO BRIEF & TRANSMISSION</span>
              <h4 className="dws-lead-title">Save Roadmap & Transmit Studio Brief</h4>
              <p className="dws-lead-subtitle">
                Your strategic roadmap has been sequenced above. Submit your brief for confidential
                review by studio principals, or download your complete project dossier locally.
                Your roadmap and brief are always preserved.
              </p>
            </div>

            {leadSaved ? (
              <div className="dws-lead-success" role="status">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <strong style={{ color: leadReceiptId ? '#10b981' : '#f59e0b', fontSize: '15px' }}>
                    {leadReceiptId ? '✓ Brief Securely Received' : '✓ Brief Saved Locally'}
                  </strong>
                  {leadReceiptId && (
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      Receipt: {leadReceiptId}
                    </span>
                  )}
                </div>
                <p style={{ margin: '8px 0 12px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
                  {submissionFeedback ||
                    (leadReceiptId
                      ? 'Your company build roadmap and founder brief have been securely transmitted to Dynasty Works Studio principals under confidential review.'
                      : 'Your confidential company creation brief has been compiled and downloaded to your device.')}
                </p>
                {assetUploadStatus && (
                  <p style={{ margin: '8px 0 12px', color: '#10b981', fontSize: '13px', fontWeight: 500 }}>
                    {assetUploadStatus}
                  </p>
                )}
                {assets.length > 0 && (
                  <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                    <FounderAssetUpload assets={assets} onChange={setAssets} disabled={true} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <button type="button" className="quiet-button" onClick={download}>
                    Download Roadmap (.txt) ↓
                  </button>
                  <button type="button" className="quiet-button" onClick={() => triggerBriefJsonDownload()}>
                    Download Brief (.json) ↓
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveLead}>
                <div className="dws-lead-grid">
                  <div>
                    <label htmlFor="lead-name" className="dws-diag-label">
                      Founder Name *
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      className="dws-diag-input"
                      placeholder="Your full name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="dws-diag-label">
                      Work Email *
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      className="dws-diag-input"
                      placeholder="founder@venture.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-company" className="dws-diag-label">
                      Company / Venture Name (Optional)
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      className="dws-diag-input"
                      placeholder="e.g. Sovereign Living"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="dws-diag-label">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      className="dws-diag-input"
                      placeholder="+1 (555) 000-0000"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                    />
                  </div>

                  <div className="dws-lead-full">
                    <label htmlFor="lead-ambition" className="dws-diag-label">
                      Core Ambition / Target Notes (Optional)
                    </label>
                    <textarea
                      id="lead-ambition"
                      rows={3}
                      className="dws-diag-textarea"
                      placeholder="e.g. Target launch Q4, seeking retail placement and premium e-commerce flagship."
                      value={leadAmbition}
                      onChange={(e) => setLeadAmbition(e.target.value)}
                    />
                  </div>

                  <div className="dws-lead-full" style={{ marginTop: '4px' }}>
                    <label className="dws-diag-consent-label" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '13px', color: '#94a3b8' }}>
                      <input
                        type="checkbox"
                        id="builder-consent"
                        checked={leadConsent}
                        onChange={(e) => setLeadConsent(e.target.checked)}
                        style={{ marginTop: '3px', cursor: 'pointer' }}
                      />
                      <span>
                        I authorize Dynasty Works Studio to review this company build roadmap and contact me regarding this strategic brief. (Decline or uncheck to proceed with local-only download).
                      </span>
                    </label>
                  </div>
                </div>

                {/* Confidential Founder Asset Intake */}
                <FounderAssetUpload
                  assets={assets}
                  onChange={setAssets}
                  disabled={isSubmitting}
                />

                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="builder-hp-fax">Leave this field blank</label>
                  <input
                    id="builder-hp-fax"
                    type="text"
                    name="fax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={leadHoneypot}
                    onChange={(e) => setLeadHoneypot(e.target.value)}
                  />
                </div>

                {leadError && (
                  <p role="alert" className="form-error" style={{ marginBottom: '14px', marginTop: '12px' }}>
                    {leadError}
                  </p>
                )}

                <div className="dws-lead-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button type="submit" className="primary-action" disabled={isSubmitting}>
                    {isSubmitting ? 'Transmitting Brief...' : 'Transmit Brief to Studio'} <span aria-hidden="true">→</span>
                  </button>
                  <button type="button" className="quiet-button" onClick={handleDownloadOnly}>
                    Download Brief Locally <span aria-hidden="true">↓</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="diagnostic-actions">
        <button
          className="quiet-button"
          onClick={() => (step ? setStep(step - 1) : onRestart())}
        >
          {step ? 'Back' : 'Change business type'}
        </button>

        {step < 2 ? (
          <button className="primary-action" onClick={next}>
            {step === 1 ? 'Create roadmap' : 'Continue'}{' '}
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="quiet-button" onClick={onRestart}>
            Start again
          </button>
        )}
      </div>
    </div>
  );
}
