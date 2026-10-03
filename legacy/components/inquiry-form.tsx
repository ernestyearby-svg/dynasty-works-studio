"use client";
import { isMarketNeed } from "@legacy/lib/company-builder";
import { professionalBoundaries } from "@legacy/data/company-builder";
import { useState, useRef } from "react";
import { submitInquiry, generateIdempotencyKey } from "@/lib/submission-client";
import {
  inquiryServices,
  stages,
  budgets,
  timeframes,
  inquirySchema,
} from "@legacy/lib/inquiry";
type Draft = {
  services: string[];
  physicalMarket: boolean;
  description: string;
  company: string;
  stage: string;
  budget: string;
  timeframe: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  reference: string;
  consent: boolean;
  honeypot: string;
};
const initial: Draft = {
  services: [],
  physicalMarket: false,
  description: "",
  company: "",
  stage: "",
  budget: "",
  timeframe: "",
  name: "",
  email: "",
  phone: "",
  website: "",
  reference: "",
  consent: false,
  honeypot: "",
};
const steps = ["The scope", "The details", "About you", "Review"];
export function InquiryForm() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const idempotencyKeyRef = useRef<string>(generateIdempotencyKey());
  const titleRef = useRef<HTMLHeadingElement>(null);
  function change(key: keyof Draft, value: string | boolean | string[]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setMessage("");
    setHasFailed(false);
  }
  function validate() {
    const result = inquirySchema.safeParse(draft);
    const keys =
      step === 0
        ? ["services"]
        : step === 1
          ? ["description", "company", "stage", "budget", "timeframe"]
          : step === 2
            ? ["name", "email", "phone", "website", "reference", "consent"]
            : Object.keys(draft);
    const selected: Record<string, string> = {};
    if (!result.success)
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (keys.includes(key))
          selected[key] =
            key === "description"
              ? "Tell us a little more (20–5,000 characters)."
              : key === "consent"
                ? "Please acknowledge how your brief is handled."
                : key === "stage" || key === "budget" || key === "timeframe"
                  ? "Choose an option."
                  : key === "name"
                    ? "Enter your name (2–120 characters)."
                    : key === "company"
                      ? "Enter your company or brand."
                      : issue.message;
      }
    setErrors(selected);
    if (Object.keys(selected).length) {
      setTimeout(
        () =>
          document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        20,
      );
      return false;
    }
    return true;
  }
  function move(n: number) {
    setStep(n);
    setErrors({});
    setMessage("");
    setHasFailed(false);
    setTimeout(() => titleRef.current?.focus(), 20);
  }
  function download(manual = true) {
    const { honeypot: _trap, consent: _consent, ...brief } = draft;
    void _trap;
    void _consent;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            notice: "Local brief only. Not submitted to Dynasty Works Studio.",
            ...brief,
            generatedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dynasty-project-brief.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (manual) {
      setMessage("Brief downloaded locally. Nothing has been transmitted to the studio.");
    }
  }
  async function submit() {
    if (!validate()) return;
    setIsSubmitting(true);
    setMessage("");
    setHasFailed(false);

    const payload = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim() || "",
      company: draft.company.trim(),
      website: draft.website || "",
      services: draft.services,
      physicalMarket: Boolean(draft.physicalMarket),
      description: draft.description.trim(),
      stage: draft.stage,
      budget: draft.budget,
      timeframe: draft.timeframe,
      referenceUrl: draft.reference || "",
    };

    try {
      const result = await submitInquiry("general", payload, {
        idempotencyKey: idempotencyKeyRef.current,
        honeypot: draft.honeypot,
      });

      if (result.success) {
        setReceiptId(result.data.receiptId);
        setIsSubmitted(true);
        setHasFailed(false);
        setMessage("");
      } else {
        setIsSubmitted(false);
        setHasFailed(true);
        setReceiptId("");
        download(false);
        setMessage(
          "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.",
        );
      }
    } catch {
      setIsSubmitted(false);
      setHasFailed(true);
      setReceiptId("");
      download(false);
      setMessage(
        "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  function field(
    key: keyof Draft,
    label: string,
    type = "text",
    optional = false,
  ) {
    return (
      <label className="form-field" key={key}>
        {label}
        {optional && <span className="optional">Optional</span>}
        <input
          id={key}
          type={type}
          value={draft[key] as string}
          onChange={(e) => change(key, e.target.value)}
          required={!optional}
          maxLength={
            key === "email"
              ? 254
              : key === "website" || key === "reference"
                ? 2000
                : 150
          }
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
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        {errors[key] && (
          <span className="field-error" id={`${key}-error`}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  function select(
    key: "stage" | "budget" | "timeframe",
    label: string,
    options: readonly string[],
  ) {
    return (
      <label className="form-field">
        {label}
        <select
          id={key}
          value={draft[key]}
          onChange={(e) => change(key, e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        >
          <option value="">Select an option</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        {errors[key] && (
          <span className="field-error" id={`${key}-error`}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  return (
    <div className="inquiry">
      <aside>
        <span className="eyebrow">START SOMETHING / 05</span>
        <h1>
          What do you
          <br />
          have in <em>mind?</em>
        </h1>
        <p>
          A first idea. A new chapter.
          <br />
          Something that doesn’t exist yet.
        </p>
        <div className="inquiry-note">
          <span className="eyebrow">BEFORE YOU BEGIN</span>
          <p>
            Prepare and download your project brief here. Online submission is
            unavailable; nothing is sent or saved by the studio.
          </p>
        </div>
      </aside>
      <section className="form-panel">
        <ol className="form-steps" aria-label="Project inquiry steps">
          {steps.map((s, i) => (
            <li key={s} aria-current={step === i ? "step" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) {
              if (validate()) move(step + 1);
            } else void submit();
          }}
        >
          <h2 tabIndex={-1} ref={titleRef}>
            {step === 0
              ? "What do you need?"
              : step === 1
                ? "Tell us about the project."
                : step === 2
                  ? "Let’s get acquainted."
                  : "Your idea, at a glance."}
          </h2>
          {step === 0 && (
            <>
              <p className="muted">Select everything that applies.</p>
              <label className="builder-check-note">
                <input
                  type="checkbox"
                  checked={draft.physicalMarket}
                  onChange={(e) => {
                    const physicalMarket = e.target.checked;
                    setDraft((d) => ({
                      ...d,
                      physicalMarket,
                      services: physicalMarket
                        ? d.services
                        : d.services.filter((s) => !isMarketNeed(s)),
                    }));
                  }}
                />
                <span>
                  This project includes physical products, retail or
                  hospitality.
                </span>
              </label>
              <fieldset
                className="service-choices"
                aria-describedby={
                  errors.services ? "services-error" : undefined
                }
              >
                <legend className="sr-only">Project services</legend>
                {inquiryServices
                  .filter((s) => draft.physicalMarket || !isMarketNeed(s))
                  .map((s) => (
                    <label
                      key={s}
                      className={
                        draft.services.includes(s)
                          ? "choice selected"
                          : "choice"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={draft.services.includes(s)}
                        aria-invalid={!!errors.services}
                        onChange={() =>
                          change(
                            "services",
                            draft.services.includes(s)
                              ? draft.services.filter((x) => x !== s)
                              : [...draft.services, s],
                          )
                        }
                      />
                      <span>{s}</span>
                      <span aria-hidden="true">
                        {draft.services.includes(s) ? "✓" : "+"}
                      </span>
                    </label>
                  ))}
              </fieldset>
              {draft.physicalMarket && (
                <p className="professional-boundary">
                  {professionalBoundaries.market}
                </p>
              )}
              {errors.services && (
                <p id="services-error" className="field-error">
                  {errors.services}
                </p>
              )}
            </>
          )}
          {step === 1 && (
            <div className="form-fields">
              <label className="form-field">
                Project description
                <textarea
                  id="description"
                  rows={5}
                  value={draft.description}
                  placeholder="The idea, the challenge, and what you’d like to achieve…"
                  maxLength={5000}
                  onChange={(e) => change("description", e.target.value)}
                  aria-invalid={!!errors.description}
                  aria-describedby="description-error"
                />
                <span
                  className={errors.description ? "field-error" : "muted"}
                  id="description-error"
                >
                  {errors.description || "20–5,000 characters"}
                </span>
              </label>
              {field("company", "Company / brand")}
              {select("stage", "Project stage", stages)}
              {select("budget", "Estimated budget (USD)", budgets)}
              {select("timeframe", "Desired launch timeframe", timeframes)}
            </div>
          )}
          {step === 2 && (
            <div className="form-fields">
              {field("name", "Your name")}
              {field("email", "Email", "email")}
              {field("phone", "Phone", "tel", true)}
              {field("website", "Website", "url", true)}
              {field("reference", "Reference link", "url", true)}
              <label className="consent">
                <input
                  type="checkbox"
                  checked={draft.consent}
                  onChange={(e) => change("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                />
                <span>
                  I authorize Dynasty Works Studio to review this project brief and contact me regarding this inquiry, in accordance with the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Notice</a> and <a href="/terms" target="_blank" rel="noopener noreferrer">Advisory Terms</a>.
                </span>
              </label>
              {errors.consent && (
                <p className="field-error">{errors.consent}</p>
              )}
            </div>
          )}
          {step === 3 && (
            <>
              <dl className="brief-review">
                {[
                  ["Services", draft.services.join(", ")],
                  ["Project", draft.description],
                  ["Company / brand", draft.company],
                  ["Stage", draft.stage],
                  ["Budget", draft.budget],
                  ["Timeframe", draft.timeframe],
                  ["Name", draft.name],
                  ["Email", draft.email],
                  ["Phone", draft.phone || "Not provided"],
                  ["Website", draft.website || "Not provided"],
                  ["Reference", draft.reference || "Not provided"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              {receiptId && (
                <div style={{ margin: "14px 0", padding: "8px 12px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "4px", color: "#10b981", fontFamily: "monospace", fontSize: "13px" }}>
                  Receipt ID: <strong>{receiptId}</strong>
                </div>
              )}
              <p className="content-note">
                Transmit your brief securely to studio principals, or download a local copy to keep on your device.
              </p>
            </>
          )}
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave empty
              <input
                name="fax"
                tabIndex={-1}
                autoComplete="off"
                value={draft.honeypot}
                onChange={(e) => change("honeypot", e.target.value)}
              />
            </label>
          </div>
          {(message || isSubmitted) && (
            <div
              className={`submission-message ${isSubmitted ? "submission-success" : hasFailed ? "submission-error" : ""}`}
              role={isSubmitted ? "status" : hasFailed ? "alert" : "status"}
              style={
                isSubmitted
                  ? {
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      background: "rgba(16, 185, 129, 0.08)",
                      color: "#10b981",
                      padding: "16px 20px",
                      borderRadius: "6px",
                      marginBottom: "20px",
                    }
                  : hasFailed
                    ? {
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#f87171",
                        padding: "16px 20px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                      }
                    : undefined
              }
            >
              {hasFailed && (
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px", color: "#f87171" }}>
                    Transmission Note
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    {message}
                  </div>
                </div>
              )}
              {isSubmitted && (
                <div
                  className="submission-success-banner"
                  style={{
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "16px",
                      color: "#10b981",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    INTAKE RECEIVED
                  </div>
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      color: "#e5e7eb",
                      fontSize: "14.5px",
                      lineHeight: "1.5",
                    }}
                  >
                    Your information has been securely transmitted to Dynasty Works Studio. Our team will review your submission and follow up regarding the appropriate next step.
                  </p>
                  {receiptId && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginBottom: "16px",
                        fontFamily: "monospace",
                      }}
                    >
                      Receipt ID: {receiptId}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
                    <a
                      href="/growth/book"
                      className="button primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        textDecoration: "none",
                        background: "#d4af37",
                        color: "#050506",
                        fontWeight: 700,
                        padding: "10px 20px",
                        borderRadius: "6px",
                      }}
                    >
                      BOOK A STRATEGY CALL →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="form-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {step > 0 ? (
              <button
                type="button"
                onClick={() => move(step - 1)}
                className="back-button"
              >
                ← Back
              </button>
            ) : (
              <span className="muted">01 / 04</span>
            )}
            {step === 3 ? (
              <>
                <button className="button dark" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Transmitting brief..."
                    : isSubmitted
                      ? "Transmit another update"
                      : hasFailed
                        ? "Retry transmission to studio"
                        : "Transmit brief to studio"}{" "}
                  <span>↗</span>
                </button>
                <button className="button" type="button" onClick={() => download(true)}>
                  Download brief locally ↓
                </button>
              </>
            ) : (
              <button className="button dark" type="submit">
                Continue <span>↗</span>
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
