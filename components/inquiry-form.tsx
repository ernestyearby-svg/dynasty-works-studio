"use client";
import { useState, useRef } from "react";
import {
  inquiryServices,
  stages,
  budgets,
  timeframes,
  inquirySchema,
} from "@/lib/inquiry";
type Draft = {
  services: string[];
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  function change(key: keyof Draft, value: string | boolean | string[]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setMessage("");
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
                ? "Please acknowledge how this preview handles your details."
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
    setTimeout(() => titleRef.current?.focus(), 20);
  }
  function download() {
    const { honeypot: _trap, consent: _consent, ...brief } = draft;
    void _trap;
    void _consent;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            notice: "Local brief only. Not submitted to Dynasty Works Studio.",
            ...brief,
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
    setMessage("Brief downloaded. Nothing has been submitted.");
  }
  function submit() {
    if (!validate()) return;
    // Never transmit personal details until a real delivery provider is connected.
    setMessage(
      "Your project has not been submitted. Inquiry delivery is not connected yet. Download your brief to keep a copy.",
    );
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
            Inquiry delivery is being connected. You can prepare and download
            your brief here. It will not be sent or saved by the studio.
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
              <fieldset
                className="service-choices"
                aria-describedby={
                  errors.services ? "services-error" : undefined
                }
              >
                <legend className="sr-only">Project services</legend>
                {inquiryServices.map((s) => (
                  <label
                    key={s}
                    className={
                      draft.services.includes(s) ? "choice selected" : "choice"
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
              <div className="upload-placeholder">
                <span>Files & references</span>
                <p>
                  File uploads will be available when inquiry delivery launches.
                  For now, include a reference link above.
                </p>
                <input
                  type="file"
                  disabled
                  aria-label="File upload unavailable"
                />
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={draft.consent}
                  onChange={(e) => change("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                />
                <span>
                  I understand this is a preview. My brief stays in this browser
                  tab unless I download it, and submission is not yet available.
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
              <p className="content-note">
                Submission is not connected. Download a copy to keep your brief.
                This form does not store your details.
              </p>
              <button className="button" type="button" onClick={download}>
                Download brief ↓
              </button>
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
          {message && (
            <p className="submission-message" role="status">
              {message}
            </p>
          )}
          <div className="form-actions">
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
            <button className="button dark" type="submit">
              {step === 3 ? "Submit project" : "Continue"} <span>↗</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
