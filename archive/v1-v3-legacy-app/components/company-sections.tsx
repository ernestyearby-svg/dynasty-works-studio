import { serviceCatalog } from "@/data/service-catalog";
import Link from "@/components/site-link";
import {
  companyJourney,
  companyCopy,
  professionalBoundaries,
  marketEntryStages,
  retailDeliverables,
} from "@/data/company-builder";
import { practices, serviceRelationships } from "@/data/practices";
import { engagementLevels, type StudioPackage } from "@/data/offerings";
import type { VerifiedProof, MarketCaseSection } from "@/types/company";
import { approvedMarketSections } from "@/types/company";
export function ProfessionalBoundary({
  kind = "general",
}: {
  kind?: keyof typeof professionalBoundaries;
}) {
  return (
    <p className="professional-boundary">{professionalBoundaries[kind]}</p>
  );
}
export function CompanyJourney({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact ? "company-journey compact-journey" : "company-journey"
      }
    >
      {companyJourney.map((stage, i) => (
        <details className="journey-node" key={stage.id}>
          <summary>
            <span className="journey-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <strong>{stage.title}</strong>
              {!compact && (
                <span className="journey-description">{stage.description}</span>
              )}
            </span>
            {stage.specialized && (
              <span className="specialized-tag">WHEN RELEVANT</span>
            )}
            <span className="journey-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="journey-content">
            <ul>
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {stage.id === "form" && <ProfessionalBoundary kind="formation" />}
            {stage.specialized && <ProfessionalBoundary kind="market" />}
          </div>
        </details>
      ))}
    </div>
  );
}
export function PracticeGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? "practice-grid compact-practices" : "practice-grid"}
    >
      {practices.map((practice, i) => (
        <details className="practice-item" id={practice.id} key={practice.id}>
          <summary>
            <span className="eyebrow">0{i + 1}</span>
            <span>
              <strong>{practice.title}</strong>
              <span>{practice.tagline}</span>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="practice-content">
            <ul>
              {serviceCatalog
                .filter((s) => s.practice === practice.id && s.active)
                .slice(0, compact ? 5 : 8)
                .map((s) => s.name)
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
            {practice.boundary && (
              <ProfessionalBoundary kind={practice.boundary} />
            )}
            <div className="related-services">
              <span className="eyebrow">CONSIDER ALONGSIDE</span>
              <div>
                {practice.related.map((id) => (
                  <Link key={id} href={"/services#" + id}>
                    {practices.find((p) => p.id === id)!.title} ↗
                  </Link>
                ))}
              </div>
            </div>
            <Link href={"/capabilities/" + practice.id} className="text-link">
              Explore this practice ↗
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
export function RelatedServices({ slug }: { slug: string }) {
  const related = serviceRelationships[slug];
  if (!related) return null;
  return (
    <div className="related-services">
      <span className="eyebrow">OFTEN CONSIDERED TOGETHER</span>
      <div>
        {related.map((r) => (
          <Link key={r.label} href={r.href}>
            {r.label} ↗
          </Link>
        ))}
      </div>
    </div>
  );
}
export function CompanyInvitation() {
  return (
    <section className="company-invitation shell section">
      <div>
        <span className="eyebrow">HAVE AN IDEA?</span>
        <h2>
          Build the company
          <br />
          around <em>it.</em>
        </h2>
      </div>
      <div>
        <p>{companyCopy.proposition}</p>
        <p className="muted">
          Enter at the idea, the brand, the build or the next stage of growth.
          We’ll help connect the pieces.
        </p>
        <Link className="button" href="/start-a-business">
          Start a business ↗
        </Link>
      </div>
    </section>
  );
}
export function MarketEntry() {
  return (
    <section id="market-entry" className="market-entry shell section">
      <div className="section-title">
        <span className="eyebrow">BEYOND THE LAUNCH</span>
        <h2>Ready for the market.</h2>
      </div>
      <p className="section-description">
        {companyCopy.marketDescription} Not every business needs every stage.
      </p>
      <ol className="market-track">
        {marketEntryStages.map((stage, i) => (
          <li key={stage}>
            <span className="eyebrow">0{i + 1}</span>
            <strong>{stage}</strong>
          </li>
        ))}
      </ol>
      <details className="retail-readiness">
        <summary>
          <span>What retail readiness can include</span>
          <span aria-hidden="true">+</span>
        </summary>
        <ul>
          {retailDeliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted">
          Requirements depend on the product, channel and territory. Pricing,
          case configurations, licenses, certifications and approvals must be
          supplied or confirmed by the client and appropriate specialists.
        </p>
      </details>
      <ProfessionalBoundary kind="market" />
    </section>
  );
}
export function EngagementLevels() {
  return (
    <div className="engagement-levels">
      {engagementLevels.map((level, i) => (
        <article key={level.id}>
          <span className="eyebrow">
            0{i + 1} / {level.name}
          </span>
          <p>{level.description}</p>
          <Link className="text-link" href={level.href}>
            {i === 0
              ? "Explore the planned collections"
              : "Explore an engagement"}{" "}
            ↗
          </Link>
        </article>
      ))}
    </div>
  );
}
export function PackageCard({ offering }: { offering: StudioPackage }) {
  if (offering.status !== "approved") return null;
  return (
    <article>
      <h3>{offering.name}</h3>
      <p>{offering.recommendedFor}</p>
      <ul>
        {offering.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {offering.timeline && <p>{offering.timeline}</p>}
      <Link href={offering.cta}>Discuss the scope ↗</Link>
    </article>
  );
}
export function TrustEvidence({ items }: { items: VerifiedProof[] }) {
  const approved = items.filter(
    (item) => item.status === "approved" && item.approvedAt && item.sourceRef,
  );
  if (!approved.length) return null;
  return (
    <section className="trust-evidence">
      {approved.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </section>
  );
}
export function MarketCaseSections({
  sections,
}: {
  sections?: MarketCaseSection[];
}) {
  return (
    <>
      {approvedMarketSections(sections).map((section) => (
        <section className="case-section" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </>
  );
}
