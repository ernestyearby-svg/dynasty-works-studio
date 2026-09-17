import { DigitalSystemsFeature } from "@legacy/components/company-creation";
import { LivingSystem } from "@legacy/components/experience-interactive";
import Link from "@legacy/components/site-link";
import { WorkflowMap } from "@legacy/components/automation";
import {
  automationServices,
  automationEngagements,
  executionModes,
  riskLevels,
  workflowExamples,
} from "@legacy/data/automation";
export const metadata = {
  title: "Digital Systems — AI + Automation",
  description:
    "Build the operating system behind your business: connected workflows, considered AI integration and clear human approval.",
  alternates: { canonical: "/automation" },
};
export default function AutomationPage() {
  return (
    <>
      <section className="shell automation-hero">
        <div>
          <span className="eyebrow">DIGITAL SYSTEMS / BUILD + SCALE</span>
          <h1>
            Build the business.
            <br />
            <em>
              Then build the system
              <br />
              that helps run it.
            </em>
          </h1>
          <p className="automation-lead">AI + Automation Systems</p>
          <p>
            Turn repeated tasks into considered workflows. Organize leads,
            connect information and give your team more room for the work that
            needs them.
          </p>
          <Link href="/start-a-business/builder" className="button">
            Build your company ↗
          </Link>
        </div>
        <aside
          className="automation-structure"
          aria-label="A controlled workflow"
        >
          <span className="eyebrow">THE OPERATING SYSTEM</span>
          <WorkflowMap
            label="From input to result"
            steps={[
              "Input",
              "Process",
              "Decision",
              "Approval",
              "Action",
              "Result",
            ]}
          />
          <p>
            Designed around your business.
            <br />
            Directed by human judgment.
          </p>
        </aside>
      </section>
      <DigitalSystemsFeature />
      <section className="ex-automation-environment">
        <div className="shell ex-section">
          <LivingSystem />
        </div>
      </section>
      <section className="shell section">
        <div className="automation-heading">
          <span className="eyebrow">01 / CONNECTED OPERATIONS</span>
          <h2>
            Less administration.
            <br />
            <em>More useful information.</em>
          </h2>
        </div>
        <div className="automation-outcomes">
          {[
            [
              "Workflow automation",
              "Fewer repetitive tasks. A defined sequence, a responsible owner and a clear next step.",
            ],
            [
              "AI integration",
              "Help with classification, drafting and finding information, grounded in approved sources and review.",
            ],
            [
              "Connected operations",
              "Organized leads, structured onboarding and information that reaches the right place.",
            ],
            [
              "Approval systems",
              "Control over what is prepared, what needs review and what can execute.",
            ],
            [
              "Reporting",
              "Consistent reports and visibility into both business activity and workflow health.",
            ],
            [
              "Content systems",
              "A shared process for briefs, assets, captions, approvals and publishing preparation.",
            ],
          ].map(([title, body], i) => (
            <article key={title}>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="content-note">
          A BUILD capability supporting START, BRAND, LAUNCH, DISTRIBUTE,
          ACTIVATE, GROW and PUBLISH. Scope follows the business need.
        </p>
      </section>
      <section className="automation-dark">
        <div className="shell section">
          <span className="eyebrow">02 / HUMAN CONTROL</span>
          <h2>
            Choose what the system
            <br />
            <em>is allowed to do.</em>
          </h2>
          <div className="automation-modes">
            {executionModes.map((m, i) => (
              <article key={m.id}>
                <span className="eyebrow">
                  MODE {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
              </article>
            ))}
          </div>
          <div className="automation-risks">
            {riskLevels.map((r) => (
              <div key={r.id}>
                <h4>{r.name}</h4>
                <p>{r.examples}</p>
              </div>
            ))}
          </div>
          <p>
            Higher-consequence actions default to human approval and appropriate
            safeguards. Sensitive decisions need qualified people, clear limits
            and a record of what happened.
          </p>
        </div>
      </section>
      <section className="shell section">
        <span className="eyebrow">03 / WORKFLOW ARCHITECTURE</span>
        <h2>
          From one task
          <br />
          <em>to a connected system.</em>
        </h2>
        <p className="automation-status">
          Planned architecture. These examples are not live integrations.
        </p>
        <div className="automation-engines">
          {workflowExamples.map((w, i) => (
            <details key={w.id} open={i < 2}>
              <summary>
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{w.name}</strong>
                  <small>{w.outcome}</small>
                </span>
                <span aria-hidden="true">+</span>
              </summary>
              <div className="automation-engine-body">
                <WorkflowMap steps={w.steps} label={w.name + " sequence"} />
                <p>{w.note}</p>
              </div>
            </details>
          ))}
        </div>
        <p className="content-note">
          Every implemented workflow needs an owner, monitoring, failure
          recovery and an audit trail. A connection is the beginning of the
          responsibility.
        </p>
      </section>
      <section className="shell section automation-scope">
        <div>
          <span className="eyebrow">04 / THE RIGHT STARTING POINT</span>
          <h2>
            Start with a process.
            <br />
            <em>Build what earns its place.</em>
          </h2>
          <p>
            For a new idea, we begin with the work itself. For an operating
            business, we review existing systems, manual steps and the outcomes
            that matter.
          </p>
          <p>
            Our first internal priorities are the Lead Engine and Content
            Engine. Evidence from actual operation will inform future case
            studies. No performance claims are made before measurement.
          </p>
          <Link className="text-link" href="/start-a-business/builder">
            Explore your automation needs ↗
          </Link>
        </div>
        <div className="automation-engagements">
          {automationEngagements.map(([name, body]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{body}</p>
            </article>
          ))}
          <Link href="/growth-partnership" className="text-link">
            Explore the Automation Partner model ↗
          </Link>
        </div>
      </section>
      <section className="shell section">
        <span className="eyebrow">05 / SPECIALIST SCOPE</span>
        <h2>The tools follow the process.</h2>
        <p>
          Workflow orchestration, secure email connections, shared data and
          platform-specific adapters are selected around the requirements. n8n
          may coordinate workflows; Supabase may hold approved business records.
          Provider choice follows security and scope review.
        </p>
        <details className="automation-specializations">
          <summary>Explore automation services</summary>
          <ul>
            {automationServices.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        </details>
        <p className="small-note">
          Integrations remain disabled. Account authorization, data access,
          approval owners and deployment safeguards must be agreed before
          implementation.
        </p>
      </section>
      <section className="shell section automation-close">
        <span className="eyebrow">DYNASTY WORKS STUDIO</span>
        <h2>
          Build the company.
          <br />
          Build the brand.
          <br />
          <em>Build the system.</em>
        </h2>
        <Link className="button" href="/start-a-business/builder">
          Build your company ↗
        </Link>
      </section>
    </>
  );
}
