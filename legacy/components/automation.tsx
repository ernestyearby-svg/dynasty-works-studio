import Link from "@legacy/components/site-link";
import { executionModes } from "@legacy/data/automation";
import type { recommendAutomation } from "@legacy/lib/automation-plan";
export function WorkflowMap({
  steps,
  label,
}: {
  steps: readonly string[];
  label: string;
}) {
  return (
    <ol className="automation-flow" aria-label={label}>
      {steps.map((step, i) => (
        <li key={step}>
          <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <span>{step}</span>
          {i < steps.length - 1 && (
            <span className="flow-connector" aria-hidden="true">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
export function AutomationFeature() {
  return (
    <section className="shell section automation-feature">
      <span className="eyebrow">BUILD / AI + AUTOMATION SYSTEMS</span>
      <div>
        <h2>
          The operating system
          <br />
          <em>behind the business.</em>
        </h2>
        <p>
          Faster follow-up. Fewer repetitive tasks. Connected information. We
          help design the systems that support the work, with clear points for
          human judgment.
        </p>
      </div>
      <Link className="text-link" href="/automation">
        Explore AI + Automation Systems ↗
      </Link>
    </section>
  );
}
export function AutomationPlan({
  plan,
}: {
  plan: NonNullable<ReturnType<typeof recommendAutomation>>;
}) {
  return (
    <section
      className="automation-plan"
      aria-label="Automation assessment roadmap"
    >
      <span className="eyebrow">
        AUTOMATION SYSTEM / {plan.maturity.toUpperCase()}
      </span>
      <h3>{plan.engagement}</h3>
      <p>{plan.reason}</p>
      <p>{plan.context}</p>
      {!!plan.goals.length && <p>Desired outcomes: {plan.goals.join(", ")}.</p>}
      <ul>
        {plan.services.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <ol>
        {plan.stages.map((s) => (
          <li key={s.name}>
            {s.name}{" "}
            <small>
              — {s.timing === "future" ? "Future phase" : "Scope and review"}
            </small>
          </li>
        ))}
      </ol>
      <p>
        Starting execution mode: <strong>{plan.mode}</strong>.{" "}
        {executionModes[0].description}
      </p>
      <p className="small-note">{plan.status}</p>
    </section>
  );
}
