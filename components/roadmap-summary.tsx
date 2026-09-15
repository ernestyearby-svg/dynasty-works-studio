import { AutomationPlan } from "@/components/automation";
import { BrandProgression } from "@/components/brand-progression";
import { founderBlueprint } from "@/data/founder-blueprint";
import { BlueprintCTA } from "@/components/blueprint-actions";
import Link from "@/components/site-link";
import { generateRoadmap } from "@/lib/recommendation-engine";
import { serviceById, boundaryCopy } from "@/data/service-catalog";
import { preliminaryNotice } from "@/data/packages";
import { templates } from "@/data/templates";
import type { CompanyBuild } from "@/types/company";
export function RoadmapSummary({ build }: { build: CompanyBuild }) {
  const r = generateRoadmap(build);
  const approvedTools = templates.filter((t) => t.status === "available");
  return (
    <section
      className="roadmap-summary"
      aria-label="Your Dynasty Build Roadmap"
    >
      <div className="roadmap-heading">
        <BrandProgression complete />
        <h3>
          {build.businessType}
          <br />
          <em>
            {r.stage} →{" "}
            {r.stage === "Growing" ? "Next market" : "Your next chapter"}
          </em>
        </h3>
        <p>
          {r.phases.length} recommended phases <span aria-hidden="true">/</span>{" "}
          {r.items.length} potential services
        </p>
      </div>
      <p className="content-note">
        A rule-based starting point. Suggested items are optional; initial scope
        and future work remain subject to review.
      </p>
      <ol className="roadmap-phases ex-roadmap-assembly">
        {r.phases.map((p, i) => (
          <li key={p.name}>
            <div className="roadmap-phase-title">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h4>{p.name}</h4>
            </div>
            <ul>
              {p.items.map((item) => (
                <li key={item.serviceId}>
                  <div>
                    <strong>{serviceById[item.serviceId].name}</strong>
                    <span className={"roadmap-timing " + item.timing}>
                      {item.timing === "future"
                        ? "Future phase"
                        : "Initial scope"}{" "}
                      · {item.source}
                    </span>
                  </div>
                  <p>{item.reason}</p>
                  {item.prerequisiteNotes.map((n) => (
                    <p className="small-note" key={n}>
                      {n}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {r.automation && <AutomationPlan plan={r.automation} />}
      <p className="professional-boundary">{r.timelineNote}</p>
      <div className="roadmap-responsibilities">
        {(["DIRECT", "COORDINATED", "PROFESSIONAL_REQUIRED"] as const).map(
          (boundary) => (
            <details key={boundary}>
              <summary>
                {boundary === "DIRECT"
                  ? "What we build"
                  : boundary === "COORDINATED"
                    ? "What we coordinate"
                    : "Where specialists may be required"}
              </summary>
              <p>{boundaryCopy[boundary]}</p>
              {boundary === "PROFESSIONAL_REQUIRED" ? (
                <p>
                  {r.specialistNotes.join(" ") ||
                    "Any regulated questions identified during review will be referred to the appropriate outside professional."}
                </p>
              ) : (
                <ul>
                  {r.items
                    .filter(
                      (i) =>
                        serviceById[i.serviceId].professionalBoundary ===
                        boundary,
                    )
                    .map((i) => (
                      <li key={i.serviceId}>{serviceById[i.serviceId].name}</li>
                    ))}
                </ul>
              )}
            </details>
          ),
        )}
      </div>
      <div className="roadmap-engagement">
        <span className="eyebrow">RECOMMENDED ENGAGEMENT</span>
        <h3>{r.engagement.name}</h3>
        {r.engagement.id === founderBlueprint.id && (
          <>
            <p className="blueprint-result-price">
              {founderBlueprint.priceLabel}
            </p>
            <p className="small-note">
              Strategy and roadmap engagement. Execution of the recommended
              services is scoped separately.
            </p>
          </>
        )}
        <p>{r.engagement.reason}</p>
        <p className="small-note">{preliminaryNotice}</p>
        {r.engagement.id === founderBlueprint.id && (
          <>
            <Link href="/founder-blueprint" className="text-link">
              Review the Blueprint scope ↗
            </Link>
            <BlueprintCTA>Start Founder Blueprint</BlueprintCTA>
          </>
        )}
      </div>
      {(r.stage === "Idea" || r.engagement.id === "dynasty-tools") && (
        <div className="roadmap-tools">
          <span className="eyebrow">DYNASTY TOOLS</span>
          <h4>
            {approvedTools.length
              ? "Explore self-guided starting points."
              : "Coming soon."}
          </h4>
          <p>
            Checklists, briefs and frameworks for the steps you want to take
            yourself.
          </p>
          <Link href="/templates" className="text-link">
            Explore Templates ↗
          </Link>
        </div>
      )}
    </section>
  );
}
