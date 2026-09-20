"use client";
import { useState } from "react";
import Link from "@legacy/components/site-link";
import { BrandSymbol } from "@legacy/components/brand-symbol";
import { BlueprintCover } from "@legacy/components/build-sequence";
const stories = [
  {
    title: "Idea",
    line: "Give the idea a foundation.",
    copy: "Clarify the company, the audience and the opportunity.",
    stages: ["Company", "Positioning", "Direction"],
  },
  {
    title: "Build",
    line: "Make every part belong.",
    copy: "Carry the direction into identity, digital products and the launch.",
    stages: ["Brand", "Digital", "Launch"],
  },
  {
    title: "Grow",
    line: "Connect the next chapter.",
    copy: "Bring the company to market, then improve the systems around it.",
    stages: ["Market", "Systems", "Growth"],
  },
];
export function AssemblyExperience() {
  const [active, setActive] = useState(0);
  return (
    <div className="ex-assembly" data-reveal>
      <div className="ex-assembly-stage" data-phase={active}>
        <span className="eyebrow">DWS / CONSTRUCTION LOGIC</span>
        <div className="ex-master-window">
          <BrandSymbol />
        </div>
        <div className="ex-axis" aria-hidden="true">
          <span>01</span>
          <span>02</span>
          <span>03</span>
        </div>
      </div>
      <div className="ex-assembly-controls">
        <div
          className="ex-selector"
          role="group"
          aria-label="Explore the company-building phases"
        >
          {stories.map((s, i) => (
            <button
              key={s.title}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <span>0{i + 1}</span>
              {s.title}
            </button>
          ))}
        </div>
        <div className="ex-assembly-copy" key={active}>
          <h3>{stories[active].line}</h3>
          <p>{stories[active].copy}</p>
          <ol>
            {stories[active].stages.map((s, i) => (
              <li key={s}>
                <span>0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
const flows = {
  Lead: ["Lead", "Database", "Qualify", "Approval", "Email", "Pipeline"],
  Content: ["Idea", "Brief", "Draft", "Approval", "Schedule", "Publish"],
};
export function LivingSystem({ compact = false }: { compact?: boolean }) {
  const [flow, setFlow] = useState<keyof typeof flows>("Lead");
  const [trace, setTrace] = useState(0);
  return (
    <div className={"ex-living-system" + (compact ? " compact" : "")}>
      <header>
        <span className="eyebrow">DWS / SYSTEM MAP</span>
        <div
          className="ex-selector"
          role="group"
          aria-label="Choose workflow architecture"
        >
          {(["Lead", "Content"] as const).map((x) => (
            <button
              aria-pressed={flow === x}
              onClick={() => {
                setFlow(x);
                setTrace(0);
              }}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </header>
      <ol
        className="ex-system-track"
        key={flow + "-" + trace}
        data-trace={trace > 0 ? "true" : "false"}
        aria-label={flow + " architecture"}
      >
        {flows[flow].map((s, i) => (
          <li
            key={s}
            className={s === "Approval" ? "ex-approval" : ""}
            style={{ "--node-index": i } as React.CSSProperties}
          >
            <span className="ex-node" aria-hidden="true" />
            <span className="eyebrow">0{i + 1}</span>
            <strong>{s}</strong>
            {s === "Approval" && <small>Human decision</small>}
          </li>
        ))}
      </ol>
      <footer>
        <p>Architecture preview. No connected workflow.</p>
        <button className="text-link" onClick={() => setTrace((t) => t + 1)}>
          Trace the sequence <span aria-hidden="true">↗</span>
        </button>
      </footer>
    </div>
  );
}
export function CapabilityExperience() {
  const [active, setActive] = useState("Brand");
  return (
    <section className="ex-capability shell ex-section" data-reveal>
      <div className="ex-section-top">
        <span className="eyebrow">DWS / IN-HOUSE SYSTEMS</span>
        <p>Identity. Interface. Information.</p>
      </div>
      <div
        className="ex-selector"
        role="group"
        aria-label="Explore studio systems"
      >
        {["Brand", "Digital", "Automation"].map((x) => (
          <button
            aria-pressed={active === x}
            onClick={() => setActive(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="ex-capability-display" key={active}>
        {active === "Brand" ? (
          <div className="ex-brand-specimen">
            <div>
              <BrandSymbol />
              <span>
                DYNASTY WORKS
                <br />
                <small>STUDIO</small>
              </span>
            </div>
            <p className="eyebrow">ONE GEOMETRY / EVERY EXPRESSION</p>
            <div
              className="ex-brand-swatches"
              aria-label="Obsidian, Bone, Graphite and Champagne palette"
            >
              {["Obsidian", "Bone", "Graphite", "Champagne"].map((c) => (
                <span key={c} className={c.toLowerCase()}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : active === "Digital" ? (
          <div className="ex-digital-specimen">
            <div>
              <span className="eyebrow">DWS / COMPANY BUILDER</span>
              <h3>
                One idea.
                <br />A considered
                <br />
                <em>next move.</em>
              </h3>
              <Link href="/start-a-business/builder" className="text-link">
                Open Company Builder ↗
              </Link>
            </div>
            <ol>
              {[
                "Your starting point",
                "Your priorities",
                "Your build roadmap",
              ].map((s, i) => (
                <li key={s}>
                  <span>0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <LivingSystem compact />
        )}
      </div>
      <p className="ex-specimen-caption">
        Dynasty Works identity and product interfaces. Client work is presented
        separately after approval.
      </p>
    </section>
  );
}
export function BlueprintProduct() {
  const [page, setPage] = useState("Cover");
  return (
    <div className="ex-blueprint-product">
      <div
        className="ex-selector"
        role="group"
        aria-label="Explore the Blueprint format"
      >
        {["Cover", "Architecture", "Roadmap"].map((x) => (
          <button key={x} aria-pressed={page === x} onClick={() => setPage(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="ex-document-stage" key={page}>
        {page === "Cover" ? (
          <BlueprintCover />
        ) : (
          <div className="ex-document-page">
            <header>
              <BrandSymbol />
              <span className="eyebrow">
                FOUNDER BLUEPRINT / FORMAT PREVIEW
              </span>
            </header>
            <span className="eyebrow">
              {page === "Architecture"
                ? "02 / COMPANY ARCHITECTURE"
                : "03 / EXECUTION SEQUENCE"}
            </span>
            <h3>
              {page === "Architecture"
                ? "The company, connected."
                : "From direction to execution."}
            </h3>
            {page === "Architecture" ? (
              <ol>
                {[
                  "Business model",
                  "Positioning",
                  "Brand + digital",
                  "Route to market",
                ].map((s, i) => (
                  <li key={s}>
                    <span>0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="ex-paper-horizons">
                {["30", "60", "90"].map((s) => (
                  <div key={s}>
                    <strong>{s}</strong>
                    <span>DAY HORIZON</span>
                  </div>
                ))}
              </div>
            )}
            <footer>
              Document structure only. Your content follows discovery and
              review.
            </footer>
          </div>
        )}
      </div>
      <p className="ex-specimen-caption">
        A preview of the document system. Every client roadmap is developed and
        reviewed individually.
      </p>
    </div>
  );
}
