import { BlueprintProduct } from "@/components/experience-interactive";
import { founderBlueprint as blueprint } from "@/data/founder-blueprint";
import { BlueprintCTA, BlueprintEvent } from "@/components/blueprint-actions";
export const metadata = {
  title: "Founder Blueprint — $1,500",
  description:
    "Turn the idea into a buildable company roadmap. A 60–90 minute strategy session, research, company architecture and a reviewed 30/60/90-day Founder Blueprint.",
  alternates: { canonical: "/founder-blueprint" },
};
export default function FounderBlueprint() {
  return (
    <>
      <BlueprintEvent name="founder_blueprint_viewed" />
      <section className="shell blueprint-hero">
        <div>
          <span className="eyebrow">
            FOUNDER BLUEPRINT / STRATEGIC COMPANY DEVELOPMENT
          </span>
          <h1>
            Turn the idea into
            <br />a buildable
            <br />
            <em>company roadmap.</em>
          </h1>
          <p>{blueprint.description}</p>
          <BlueprintCTA />
          <p className="small-note">
            Intake preview available. Submission and payment are not yet
            connected.
          </p>
        </div>
        <aside className="blueprint-offer">
          <span className="eyebrow">ONE ENGAGEMENT. ONE ROADMAP.</span>
          <strong className="blueprint-price">{blueprint.priceLabel}</strong>
          <p>A clear path forward.</p>
          <dl>
            <div>
              <dt>Start with</dt>
              <dd>60–90 minute strategy session</dd>
            </div>
            <div>
              <dt>Work through</dt>
              <dd>Research + company architecture</dd>
            </div>
            <div>
              <dt>Leave with</dt>
              <dd>
                A reviewed digital Blueprint and 30 / 60 / 90-day execution
                sequence
              </dd>
            </div>
          </dl>
          <span className="small-note">
            Execution of the brand, website or other services is scoped
            separately.
          </span>
        </aside>
      </section>
      <section className="shell ex-blueprint-showcase" data-reveal>
        <div>
          <span className="eyebrow">THE DOCUMENT SYSTEM</span>
          <h2>
            A company.
            <br />
            <em>On paper.</em>
          </h2>
          <p>Explore the cover, architecture and roadmap format.</p>
        </div>
        <BlueprintProduct />
      </section>
      <section className="shell section blueprint-problem">
        <span className="eyebrow">BEFORE MAJOR EXECUTION</span>
        <h2>
          Organize the build.
          <br />
          <em>Then build with direction.</em>
        </h2>
        <p>
          A logo, website or package is easier to scope when the business model,
          positioning and route to market are clear. Founder Blueprint connects
          those decisions before major execution begins.
        </p>
        <p className="muted">
          For idea-stage founders, early businesses and existing concepts that
          need the remaining company architecture organized.
        </p>
      </section>
      <section className="shell section dark-section blueprint-map">
        <span className="eyebrow">WHAT WE MAP</span>
        <h2>
          The whole company.
          <br />
          The stages that matter.
        </h2>
        <ol>
          {blueprint.map.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <span className="eyebrow">WHAT YOU RECEIVE</span>
          <h2>Strategy made usable.</h2>
        </div>
        <div className="blueprint-deliverables">
          {blueprint.deliverables.map((item, i) => (
            <article key={item.title}>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell section">
        <span className="eyebrow">THE PROCESS</span>
        <h2>A considered sequence.</h2>
        <ol className="blueprint-process">
          {blueprint.process.map((step, i) => (
            <li key={step}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
            </li>
          ))}
        </ol>
      </section>
      <section className="shell section blueprint-horizons">
        <span className="eyebrow">FROM ROADMAP TO EXECUTION</span>
        <h2>30 / 60 / 90</h2>
        <p className="section-description">
          Priorities organized across three planning horizons. Your actual
          sequence is developed from your information and reviewed together;
          these are not promised delivery dates.
        </p>
        <div>
          {blueprint.horizons.map((h) => (
            <article key={h.days}>
              <span className="horizon-number">
                {h.days}
                <small>DAY</small>
              </span>
              <h3>{h.title}</h3>
              <p>{h.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell section blueprint-boundary">
        <span className="eyebrow">THE RIGHT EXPERTISE</span>
        <h2>
          One coordinated plan.
          <br />
          Clear professional responsibilities.
        </h2>
        <p>{blueprint.boundary}</p>
      </section>
      <section className="shell section blueprint-final">
        <span className="eyebrow">
          FOUNDER BLUEPRINT · {blueprint.priceLabel}
        </span>
        <h2>
          Ready to turn the idea
          <br />
          <em>into a plan?</em>
        </h2>
        <BlueprintCTA />
        <p className="small-note">
          Explore the intake and keep a local copy. No payment or submission
          takes place in this preview.
        </p>
      </section>
    </>
  );
}
