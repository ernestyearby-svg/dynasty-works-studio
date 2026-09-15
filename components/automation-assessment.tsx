"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  automationGoals,
  automationMaturities,
  currentSystems,
  maturityDescriptions,
  type AutomationAssessment as Assessment,
} from "@/data/automation";
import type { CompanyBuild } from "@/types/company";
export function AutomationAssessment({
  build,
  onChange,
}: {
  build: CompanyBuild;
  onChange: (patch: Partial<CompanyBuild>) => void;
}) {
  if (!build.needs.includes("AI / Automation")) return null;
  const a = build.automation || {};
  const update = (patch: Partial<Assessment>) =>
    onChange({ automation: { ...a, ...patch } });
  return (
    <section
      className="automation-assessment"
      aria-label="Automation assessment"
    >
      <span className="eyebrow">OPTIONAL / AUTOMATION ASSESSMENT</span>
      <h3>What would you like the business to handle more automatically?</h3>
      <p>
        Select the work that takes time away from the business. You can leave
        these questions for discovery.
      </p>
      <fieldset className="builder-options">
        <legend>Processes to explore</legend>
        {automationGoals.map((goal, i) => (
          <label
            className="builder-option"
            htmlFor={"auto-goal-" + i}
            key={goal}
          >
            <Checkbox
              id={"auto-goal-" + i}
              checked={a.goals?.includes(goal) || false}
              onCheckedChange={(v) =>
                update({
                  goals:
                    v === true
                      ? [...(a.goals || []), goal]
                      : (a.goals || []).filter((x) => x !== goal),
                })
              }
            />
            <span>{goal}</span>
          </label>
        ))}
      </fieldset>
      <h4 id="automation-maturity">How does the business work today?</h4>
      <p>This describes your starting point. It is not a score.</p>
      <RadioGroup
        aria-labelledby="automation-maturity"
        value={a.maturity || ""}
        onValueChange={(value) =>
          update({ maturity: value as Assessment["maturity"] })
        }
        className="automation-maturity"
      >
        {automationMaturities.map((m) => (
          <label htmlFor={"auto-" + m} key={m}>
            <RadioGroupItem id={"auto-" + m} value={m} />
            <span>
              <strong>{m}</strong>
              <small>{maturityDescriptions[m]}</small>
            </span>
          </label>
        ))}
      </RadioGroup>
      <details className="automation-context">
        <summary>Add current systems and process context</summary>
        <fieldset className="builder-options">
          <legend>Systems already in use</legend>
          {currentSystems.map((s, i) => (
            <label
              className="builder-option"
              htmlFor={"auto-system-" + i}
              key={s}
            >
              <Checkbox
                id={"auto-system-" + i}
                checked={a.systems?.includes(s) || false}
                onCheckedChange={(v) =>
                  update({
                    systems:
                      v === true
                        ? [...(a.systems || []), s]
                        : (a.systems || []).filter((x) => x !== s),
                  })
                }
              />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>
        <label className="form-field">
          Which manual process would you change first?
          <textarea
            value={a.manualProcess || ""}
            maxLength={400}
            rows={3}
            aria-describedby="auto-privacy"
            onChange={(e) => update({ manualProcess: e.target.value })}
          />
        </label>
        <p className="small-note" id="auto-privacy">
          Optional. Avoid client details, passwords or sensitive data. This note
          stays in memory and is cleared on reload; it is not sent.
        </p>
      </details>
    </section>
  );
}
