"use client";
import { useState, useEffect, useRef } from "react";
import Link from "@/components/site-link";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  businessTypes,
  startingPoints,
  launchWindows,
  budgetChoices,
  founderPathways,
  professionalBoundaries,
  physicalBusinessTypes,
  type BusinessType,
  type BuildNeed,
} from "@/data/company-builder";
import {
  emptyCompanyBuild,
  companyBuildStorageKey,
  parseSavedBuild,
  normalizeBuild,
  availableNeeds,
  recommendServices,
  validateCompanyStep,
  validateCompanyBuild,
  isMarketNeed,
  hasPhysicalMarket,
} from "@/lib/company-builder";
import { recordStudioEvent } from "@/lib/analytics";
import type { CompanyBuild } from "@/types/company";
const stepLabels = [
  "Business",
  "Starting point",
  "Scope",
  "Timing",
  "Range",
  "Contact",
  "Summary",
];
const stepTitles = [
  "What are we building?",
  "Where are we starting?",
  "What do we need?",
  "When do you want to launch?",
  "Let’s frame the project range.",
  "Who’s behind the idea?",
  "Your company build.",
];
export function CompanyBuilder() {
  const [build, setBuild] = useState<CompanyBuild>(emptyCompanyBuild);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let saved: null | ReturnType<typeof parseSavedBuild> = null;
    try {
      const raw = sessionStorage.getItem(companyBuildStorageKey);
      if (raw) saved = parseSavedBuild(raw);
    } catch {
      /* Private browsing may disallow storage. Memory remains usable. */
    }
    const pathway = founderPathways.find(
      (p) =>
        p.id === new URLSearchParams(window.location.search).get("pathway"),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the explicitly requested tab-session draft after hydration.
    setBuild(
      saved?.build ||
        (pathway
          ? { ...emptyCompanyBuild, starting: pathway.starting }
          : emptyCompanyBuild),
    );
    setStep(saved?.step || 0);
    setReady(true);
    recordStudioEvent({
      name: "start_company_builder",
      route: "/start-a-business/builder",
    });
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        companyBuildStorageKey,
        JSON.stringify({ build, step }),
      );
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Report unavailable browser storage, retaining the in-memory draft.
      setStorageWarning(
        "This browser cannot save the draft for reloads. Keep this tab open and download your summary.",
      );
    }
  }, [build, step, ready]);
  function update(patch: Partial<CompanyBuild>) {
    setBuild((b) => normalizeBuild({ ...b, ...patch }));
    setErrors({});
    setMessage("");
  }
  function go(next: number) {
    setStep(next);
    setErrors({});
    setMessage("");
    recordStudioEvent({
      name: "company_builder_step",
      step: next + 1,
      route: "/start-a-business/builder",
    });
    if (next === 6)
      recordStudioEvent({
        name: "complete_company_builder",
        route: "/start-a-business/builder",
      });
    setTimeout(() => title.current?.focus(), 20);
  }
  function proceed() {
    const found = validateCompanyStep(build, step);
    setErrors(found);
    if (Object.keys(found).length) {
      setTimeout(
        () =>
          document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        20,
      );
      return;
    }
    go(step + 1);
  }
  function toggleStart(value: string) {
    const selected = build.starting.includes(value)
      ? build.starting.filter((s) => s !== value)
      : value === startingPoints[0]
        ? [value]
        : [...build.starting.filter((s) => s !== startingPoints[0]), value];
    update({ starting: selected });
  }
  function toggleNeed(value: BuildNeed) {
    update({
      needs: build.needs.includes(value)
        ? build.needs.filter((n) => n !== value)
        : [...build.needs, value],
    });
  }
  function download() {
    const body = [
      "DYNASTY WORKS STUDIO — YOUR COMPANY BUILD",
      "LOCAL BRIEF ONLY. Not submitted or accepted. No quote or timeline commitment.",
      "",
      ...Object.entries({
        Business: build.businessType,
        "Starting point": build.starting.join(", "),
        "Selected scope": build.needs.join(" + "),
        "Desired launch": build.launch,
        "Project range":
          build.budgetChoice === budgetChoices[1]
            ? build.budgetNote
            : build.budgetChoice,
        Name: build.name,
        Company: build.company,
        Email: build.email,
        Phone: build.phone || "Not provided",
        Website: build.website || "Not provided",
      }).map(([key, value]) => key + ": " + value),
      "",
      professionalBoundaries.general,
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "dynasty-company-build.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Summary downloaded. Nothing has been submitted.");
  }
  function startBuild() {
    const found = validateCompanyBuild(build);
    if (Object.keys(found).length) {
      const first = [0, 1, 2, 3, 4, 5].find(
        (s) => Object.keys(validateCompanyStep(build, s)).length,
      )!;
      go(first);
      setErrors(found);
      return;
    }
    setMessage(
      "Your brief is ready, but it has not been submitted. Delivery is not connected yet. Download the summary to keep a copy.",
    );
  }
  function reset() {
    try {
      sessionStorage.removeItem(companyBuildStorageKey);
    } catch {
      /* In-memory clear still works. */
    }
    setBuild(emptyCompanyBuild);
    go(0);
    setMessage("Draft cleared from this tab.");
  }
  function radios(
    key: "businessType" | "launch" | "budgetChoice",
    options: readonly string[],
  ) {
    return (
      <RadioGroup
        aria-label={stepTitles[step]}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? "builder-errors" : undefined}
        value={build[key]}
        onValueChange={(value) => update({ [key]: value })}
        className="builder-options"
      >
        {options.map((option, i) => (
          <label
            htmlFor={key + "-" + i}
            key={option}
            className={
              "builder-option " + (build[key] === option ? "selected" : "")
            }
          >
            <RadioGroupItem
              id={key + "-" + i}
              value={option}
              className="builder-radio"
              aria-invalid={!!errors[key]}
            />
            <span>{option}</span>
          </label>
        ))}
      </RadioGroup>
    );
  }
  function field(
    key: "name" | "company" | "email" | "phone" | "website",
    label: string,
    type = "text",
    optional = false,
  ) {
    return (
      <label className="form-field">
        {label}
        {optional && <span className="optional">Optional</span>}
        <input
          value={build[key]}
          type={type}
          maxLength={
            key === "website"
              ? 2000
              : key === "email"
                ? 254
                : key === "phone"
                  ? 40
                  : key === "name"
                    ? 120
                    : 150
          }
          autoComplete={
            key === "name"
              ? "name"
              : key === "company"
                ? "organization"
                : key === "email"
                  ? "email"
                  : key === "phone"
                    ? "tel"
                    : "url"
          }
          placeholder={
            key === "company" ? "Company name or ‘Not named yet’" : undefined
          }
          onChange={(e) => update({ [key]: e.target.value })}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? "builder-errors" : undefined}
        />
      </label>
    );
  }
  const recommendations = recommendServices(build);
  const physical = hasPhysicalMarket(build);
  return (
    <div className="company-builder shell">
      <aside className="builder-sidebar">
        <Link href="/start-a-business" className="text-link">
          ← Start a Business
        </Link>
        <span className="eyebrow">A GUIDED START</span>
        <h1>
          Build my
          <br />
          <em>company.</em>
        </h1>
        <ol className="builder-step-list">
          {stepLabels.map((label, i) => (
            <li key={label} aria-current={step === i ? "step" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className="small-note">
          This is a local planning brief. Nothing is sent to the studio. Your
          draft is saved in this browser tab for the session.
        </p>
        <button className="clear-draft" onClick={reset} disabled={!ready}>
          Clear this draft
        </button>
      </aside>
      <section className="builder-main">
        <div className="builder-progress-label">
          <span>STEP {step + 1} OF 7</span>
          <span>{stepLabels[step]}</span>
        </div>
        <Progress
          value={((step + 1) / 7) * 100}
          className="builder-progress"
          aria-label="Company brief progress"
        />
        {!ready ? (
          <p role="status">Preparing your brief…</p>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 6) proceed();
              else startBuild();
            }}
          >
            <h2 ref={title} tabIndex={-1}>
              {stepTitles[step]}
            </h2>
            {Object.keys(errors).length > 0 && (
              <div id="builder-errors" className="builder-errors" role="alert">
                {Object.values(errors).map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
            {step === 0 && (
              <>
                <p className="muted">
                  Choose the closest fit. We can refine the details together.
                </p>
                {radios("businessType", businessTypes)}
                {build.businessType &&
                  !physicalBusinessTypes.includes(
                    build.businessType as BusinessType,
                  ) && (
                    <label className="builder-check-note">
                      <Checkbox
                        checked={build.physicalMarket}
                        onCheckedChange={(checked) =>
                          update({ physicalMarket: checked === true })
                        }
                      />
                      <span>
                        My business also includes physical products, retail or
                        hospitality.
                      </span>
                    </label>
                  )}
              </>
            )}
            {step === 1 && (
              <>
                <p className="muted">
                  Select what you already have. More than one can apply.
                </p>
                <fieldset className="builder-options">
                  <legend className="sr-only">Your starting point</legend>
                  {startingPoints.map((point, i) => (
                    <label
                      key={point}
                      htmlFor={"starting-" + i}
                      className={
                        "builder-option " +
                        (build.starting.includes(point) ? "selected" : "")
                      }
                    >
                      <Checkbox
                        id={"starting-" + i}
                        checked={build.starting.includes(point)}
                        onCheckedChange={() => toggleStart(point)}
                        aria-invalid={!!errors.starting}
                      />
                      <span>{point}</span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}
            {step === 2 && (
              <>
                <p className="muted">
                  Build the scope around your needs. Suggestions are optional.
                </p>
                {recommendations.length > 0 && (
                  <div className="builder-recommendations">
                    <span className="eyebrow">A CONSIDERED START</span>
                    {recommendations.map((rec) => (
                      <button
                        type="button"
                        key={rec.service}
                        onClick={() => toggleNeed(rec.service)}
                      >
                        <span>
                          <strong>{rec.service}</strong>
                          <span>{rec.reason}</span>
                        </span>
                        <span aria-hidden="true">+</span>
                      </button>
                    ))}
                  </div>
                )}
                <fieldset className="builder-options">
                  <legend>Select your services</legend>
                  {availableNeeds(build).map((need, i) => (
                    <label
                      key={need}
                      htmlFor={"need-" + i}
                      className={
                        "builder-option " +
                        (build.needs.includes(need) ? "selected" : "")
                      }
                    >
                      <Checkbox
                        id={"need-" + i}
                        checked={build.needs.includes(need)}
                        onCheckedChange={() => toggleNeed(need)}
                        aria-invalid={!!errors.needs}
                      />
                      <span>
                        {need}
                        {isMarketNeed(need) && <small>PHYSICAL + MARKET</small>}
                      </span>
                    </label>
                  ))}
                </fieldset>
                {build.needs.some((n) =>
                  [
                    "Company Setup",
                    "Trademark Coordination",
                    "Licensing Research",
                  ].includes(n),
                ) && (
                  <p className="professional-boundary">
                    {professionalBoundaries.formation}
                  </p>
                )}
                {physical && (
                  <p className="professional-boundary">
                    {professionalBoundaries.market}
                  </p>
                )}
              </>
            )}
            {step === 3 && (
              <>
                <p className="muted">
                  A planning preference, not a promised delivery date. Timing
                  depends on the agreed scope and any outside approvals.
                </p>
                {radios("launch", launchWindows)}
              </>
            )}
            {step === 4 && (
              <>
                <p className="muted">
                  Budget bands are under internal review. There are no published
                  prices or estimates here.
                </p>
                {radios("budgetChoice", budgetChoices)}
                {build.budgetChoice === budgetChoices[1] && (
                  <label className="form-field budget-note">
                    Your available range and currency
                    <input
                      value={build.budgetNote}
                      maxLength={200}
                      onChange={(e) => update({ budgetNote: e.target.value })}
                      aria-invalid={!!errors.budgetNote}
                      aria-describedby={
                        errors.budgetNote ? "builder-errors" : undefined
                      }
                    />
                  </label>
                )}
                <p className="small-note">
                  Your budget helps frame a conversation. It is not a quote or
                  an agreement.
                </p>
              </>
            )}
            {step === 5 && (
              <div className="form-fields">
                {field("name", "Name")}
                {field("company", "Company")}
                {field("email", "Email", "email")}
                {field("phone", "Phone", "tel", true)}
                {field("website", "Website", "url", true)}
                <label className="builder-check-note">
                  <Checkbox
                    checked={build.acknowledged}
                    onCheckedChange={(checked) =>
                      update({ acknowledged: checked === true })
                    }
                    aria-invalid={!!errors.acknowledged}
                  />
                  <span>
                    I understand this brief is saved in this browser tab for the
                    session. It is not sent to the studio, and I can clear it or
                    download a copy.
                  </span>
                </label>
                <p className="small-note">
                  Please keep confidential business plans, financial records and
                  unpublished intellectual property out of this preview.
                </p>
              </div>
            )}
            {step === 6 && (
              <>
                <div className="build-summary">
                  <span className="eyebrow">{build.businessType}</span>
                  <div className="build-equation">
                    {build.needs.map((need, i) => (
                      <span key={need}>
                        {i > 0 && <b aria-hidden="true">+</b>}
                        {need}
                      </span>
                    ))}
                  </div>
                  <dl className="brief-review">
                    {[
                      ["Starting point", build.starting.join(" / ")],
                      ["Desired launch", build.launch],
                      [
                        "Range",
                        build.budgetChoice === budgetChoices[1]
                          ? build.budgetNote
                          : build.budgetChoice,
                      ],
                      ["Company", build.company],
                      ["Name", build.name],
                      ["Email", build.email],
                      ["Phone", build.phone || "Not provided"],
                      ["Website", build.website || "Not provided"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="professional-boundary">
                  {professionalBoundaries.general}
                </p>
                <p className="content-note">
                  A scope to discuss, not a confirmed engagement. Delivery is
                  not connected; no submission is saved by the studio.
                </p>
                <button className="button" type="button" onClick={download}>
                  Download my summary ↓
                </button>
              </>
            )}
            {storageWarning && (
              <p role="status" className="small-note">
                {storageWarning}
              </p>
            )}
            {message && (
              <p role="status" className="submission-message">
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
                {step === 6
                  ? "Start the build"
                  : step === 5
                    ? "Review my build"
                    : "Continue"}{" "}
                ↗
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
