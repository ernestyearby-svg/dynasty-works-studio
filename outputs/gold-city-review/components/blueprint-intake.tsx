"use client";
import { useState, useRef, useEffect } from "react";
import { SubmissionFeedback } from "@/components/submission-feedback";
import {
  submissionAvailability,
  type SubmissionUIState,
} from "@/lib/submission-contracts";
import Link from "@/components/site-link";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { businessTypes, physicalBusinessTypes } from "@/data/company-builder";
import { businessStages } from "@/data/service-catalog";
import { founderBlueprint } from "@/data/founder-blueprint";
import {
  emptyBlueprintDraft,
  validateBlueprintStep,
  blueprintIntakeText,
  type BlueprintDraft,
} from "@/lib/blueprint-intake";
import { recordStudioEvent } from "@/lib/analytics";
const labels = [
  "Founder",
  "The idea",
  "What exists",
  "Market + timing",
  "Review",
];
const titles = [
  "Who is behind the idea?",
  "Give the idea some context.",
  "What can we build on?",
  "Where are you headed?",
  "Your Blueprint intake.",
];
export function BlueprintIntakeForm() {
  const [draft, setDraft] = useState<BlueprintDraft>(emptyBlueprintDraft),
    [step, setStep] = useState(0),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [acknowledged, setAcknowledged] = useState(false),
    [message, setMessage] = useState("");
  const [submission, setSubmission] = useState<SubmissionUIState>({
    state: "idle",
  });
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    recordStudioEvent({
      name: "founder_blueprint_intake_started",
      route: "/founder-blueprint/intake",
    });
  }, []);
  const physical =
    !!draft.businessType &&
    (draft.physicalMarket ||
      physicalBusinessTypes.includes(draft.businessType));
  function update(patch: Partial<BlueprintDraft>) {
    setDraft((d) => {
      const n = { ...d, ...patch };
      if (
        n.businessType &&
        !n.physicalMarket &&
        !physicalBusinessTypes.includes(n.businessType)
      )
        n.distributionGoals = "";
      return n;
    });
    setErrors({});
    setMessage("");
  }
  function go(n: number) {
    setSubmission({ state: "idle" });
    setStep(n);
    setErrors({});
    setMessage("");
    setTimeout(() => heading.current?.focus(), 20);
  }
  function advance() {
    const found = validateBlueprintStep(draft, step);
    if (step === 3 && !acknowledged)
      found.acknowledged = "Please acknowledge that this is a local preview.";
    setErrors(found);
    if (Object.keys(found).length) {
      setTimeout(
        () =>
          document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        20,
      );
      return;
    }
    if (step < 4) {
      go(step + 1);
      if (step === 3)
        recordStudioEvent({
          name: "founder_blueprint_intake_completed",
          route: "/founder-blueprint/intake",
        });
    } else
      setSubmission({
        state: "disabled",
        message:
          submissionAvailability.message +
          " Payment and booking are also inactive.",
      });
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([blueprintIntakeText(draft)], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "founder-blueprint-intake.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Local intake downloaded. Nothing has been submitted or paid.");
  }
  function field(
    key: Exclude<
      keyof BlueprintDraft,
      "physicalMarket" | "businessType" | "businessStage" | "references"
    >,
    label: string,
    max: number,
    required = false,
    multiline = false,
  ) {
    return (
      <label className="form-field" key={key}>
        {label}
        {!required && <span className="optional">Optional</span>}
        {multiline ? (
          <textarea
            rows={4}
            value={draft[key]}
            maxLength={max}
            onChange={(e) => update({ [key]: e.target.value })}
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? "intake-errors" : undefined}
          />
        ) : (
          <input
            type={
              key === "email"
                ? "email"
                : key === "phone"
                  ? "tel"
                  : key === "website"
                    ? "url"
                    : "text"
            }
            value={draft[key]}
            maxLength={max}
            onChange={(e) => update({ [key]: e.target.value })}
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? "intake-errors" : undefined}
            autoComplete={
              key === "name"
                ? "name"
                : key === "email"
                  ? "email"
                  : key === "phone"
                    ? "tel"
                    : key === "company"
                      ? "organization"
                      : "off"
            }
          />
        )}
      </label>
    );
  }
  function options(
    key: "businessType" | "businessStage",
    values: readonly string[],
  ) {
    return (
      <fieldset className="intake-choice">
        <legend>
          {key === "businessType" ? "Business type" : "Current stage"}
        </legend>
        <RadioGroup
          className="builder-options"
          value={draft[key]}
          onValueChange={(v) => update({ [key]: v })}
          aria-label={
            key === "businessType" ? "Business type" : "Current stage"
          }
        >
          {values.map((v, i) => (
            <label className="builder-option" htmlFor={key + i} key={v}>
              <RadioGroupItem
                id={key + i}
                value={v}
                aria-invalid={!!errors[key]}
              />
              <span>{v}</span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>
    );
  }
  return (
    <div className="company-builder shell blueprint-intake">
      <aside className="builder-sidebar">
        <Link href="/founder-blueprint" className="text-link">
          ← Founder Blueprint
        </Link>
        <span className="eyebrow">
          {founderBlueprint.priceLabel} / STRATEGIC ROADMAP
        </span>
        <h1>
          Start your
          <br />
          <em>Blueprint.</em>
        </h1>
        <ol className="builder-step-list">
          {labels.map((s, i) => (
            <li key={s} aria-current={step === i ? "step" : undefined}>
              <span>0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <p className="small-note">
          This intake stays in memory while the page is open. Reloading or
          leaving the page clears it. No submission, payment, booking or upload
          is active.
        </p>
        <button
          className="clear-draft"
          onClick={() => {
            setDraft(emptyBlueprintDraft);
            setAcknowledged(false);
            go(0);
            setMessage("Intake cleared.");
          }}
        >
          Clear this intake
        </button>
      </aside>
      <section className="builder-main">
        <div className="builder-progress-label">
          <span>STEP {step + 1} OF 5</span>
          <span>{labels[step]}</span>
        </div>
        <Progress
          value={((step + 1) / 5) * 100}
          className="builder-progress"
          aria-label="Blueprint intake progress"
        />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            advance();
          }}
        >
          <h2 ref={heading} tabIndex={-1}>
            {titles[step]}
          </h2>
          <p className="content-note">
            Provide information you would share for project evaluation and
            communication. Keep government IDs, passwords, bank credentials,
            payment-card details and confidential documents out of this preview.
          </p>
          {Object.keys(errors).length > 0 && (
            <div className="builder-errors" id="intake-errors" role="alert">
              {Object.entries(errors).map(([key, value]) => (
                <p key={key}>{value}</p>
              ))}
            </div>
          )}
          {step === 0 && (
            <>
              <div className="form-fields">
                {field("name", "Founder name", 120, true)}
                {field("email", "Email", 254, true)}
                {field("phone", "Phone", 40)}
                {field("company", "Company / working name", 150, true)}
                {field("website", "Website", 2000)}
              </div>
              {options("businessType", businessTypes)}
              {options("businessStage", businessStages)}
              {draft.businessType &&
                !physicalBusinessTypes.includes(draft.businessType) && (
                  <label className="builder-check-note">
                    <Checkbox
                      checked={draft.physicalMarket}
                      onCheckedChange={(v) =>
                        update({ physicalMarket: v === true })
                      }
                    />
                    <span>
                      This business also includes physical products, retail or
                      hospitality.
                    </span>
                  </label>
                )}
            </>
          )}
          {step === 1 && (
            <div className="form-fields">
              {field("ideaDescription", "Describe the idea", 3000, true, true)}
              {field(
                "problemDescription",
                "What problem does it solve?",
                2000,
                true,
                true,
              )}
              {field("targetCustomer", "Who is it for?", 1500, true, true)}
              {field(
                "biggestQuestion",
                "Your biggest current question",
                2000,
                true,
                true,
              )}
            </div>
          )}
          {step === 2 && (
            <>
              <div className="form-fields">
                {field(
                  "existingAssets",
                  "What already exists?",
                  2000,
                  false,
                  true,
                )}
                {field(
                  "requestedNeeds",
                  "What needs to be built?",
                  2000,
                  true,
                  true,
                )}
                {field(
                  "brandAssets",
                  "Current brand assets — describe only",
                  1500,
                  false,
                  true,
                )}
                {field(
                  "companyDocuments",
                  "Existing company documents — list types only",
                  1000,
                  false,
                  true,
                )}
                {field(
                  "digitalAssets",
                  "Existing website / digital assets",
                  1500,
                  false,
                  true,
                )}
                <label className="form-field">
                  Relevant reference links{" "}
                  <span className="optional">
                    Optional · up to five, one per line
                  </span>
                  <textarea
                    rows={3}
                    maxLength={10004}
                    value={draft.references.join("\n")}
                    onChange={(e) =>
                      update({ references: e.target.value.split("\n") })
                    }
                    onBlur={() =>
                      update({
                        references: draft.references
                          .map((v) => v.trim())
                          .filter(Boolean),
                      })
                    }
                    aria-invalid={!!errors.references}
                  />
                </label>
              </div>
              <p className="professional-boundary">
                File uploads will be available only after private storage and
                access controls are configured. Describe the assets here; do not
                paste private document contents.
              </p>
            </>
          )}
          {step === 3 && (
            <div className="form-fields">
              {field(
                "targetLaunch",
                "Target launch or planning horizon",
                200,
                true,
              )}
              {field("primaryMarket", "Primary market / geography", 200, true)}
              {field("competitors", "Known competitors", 1500, false, true)}
              {physical &&
                field(
                  "distributionGoals",
                  "Distribution / retail goals",
                  2000,
                  false,
                  true,
                )}
              <p className="professional-boundary">
                {founderBlueprint.boundary}
              </p>
              <label className="builder-check-note">
                <Checkbox
                  checked={acknowledged}
                  onCheckedChange={(v) => setAcknowledged(v === true)}
                  aria-invalid={!!errors.acknowledged}
                />
                <span>
                  I understand this is a memory-only local intake preview.
                  Nothing is sent to the studio or charged.
                </span>
              </label>
            </div>
          )}
          {step === 4 && (
            <>
              <div className="roadmap-engagement">
                <span className="eyebrow">FOUNDER BLUEPRINT</span>
                <h3>{founderBlueprint.priceLabel}</h3>
                <p>
                  {founderBlueprint.session}, research, company architecture and
                  a reviewed digital Blueprint. Completing this local intake
                  does not purchase the engagement.
                </p>
              </div>
              <dl className="brief-review">
                {Object.entries(draft)
                  .filter(([key]) => key !== "physicalMarket")
                  .map(([key, value]) => (
                    <div key={key}>
                      <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
                      <dd>
                        {Array.isArray(value)
                          ? value.join("\n") || "Not provided"
                          : value || "Not provided"}
                      </dd>
                    </div>
                  ))}
              </dl>
              <button className="button" type="button" onClick={download}>
                Download my intake ↓
              </button>
            </>
          )}
          <SubmissionFeedback result={submission} />
          {message && (
            <p className="submission-message" role="status">
              {message}
            </p>
          )}
          <div className="builder-actions">
            {step > 0 ? (
              <button
                type="button"
                className="back-button"
                onClick={() => go(step - 1)}
              >
                ← Back
              </button>
            ) : (
              <span className="small-note">Your starting point</span>
            )}
            <button className="button dark" type="submit">
              {step === 4
                ? "Check intake readiness"
                : step === 3
                  ? "Review my intake"
                  : "Continue"}{" "}
              ↗
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
