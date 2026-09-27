import Link from "@legacy/components/site-link";
import { creationStages, networkCategories } from "@legacy/data/company-creation";
import { projects } from "@legacy/data/projects";
import { isApprovedProject } from "@legacy/lib/content";
import { OptimizedImage as Image } from "@legacy/components/optimized-image";
export function StageArchitecture({
  expanded = false,
}: {
  expanded?: boolean;
}) {
  return (
    <div className="v2-stages">
      {creationStages.map((stage, i) => (
        <details
          key={stage.id}
          id={"stage-" + stage.id}
          open={expanded || undefined}
        >
          <summary>
            <span className="eyebrow">0{i + 1}</span>
            <h3>{stage.name}</h3>
            <span>{stage.line}</span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="v2-stage-content">
            <p>{stage.description}</p>
            <ul>
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="v2-stage-links">
              {stage.practices.map((p) => (
                <Link key={p} href={"/capabilities/" + p}>
                  {p.toUpperCase()} ↗
                </Link>
              ))}
            </div>
            {stage.id === "define" && (
              <p className="small-note">
                Licensed advice and filings are handled by qualified
                professionals. Dynasty Works coordinates the brief and
                specialist integration.
              </p>
            )}
            {(stage.id === "launch" || stage.id === "scale") && (
              <p className="small-note">
                Distribution preparation and coordination do not imply that
                Dynasty Works holds a distribution license.
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
export function FlagshipWork({ full = false }: { full?: boolean }) {
  const published = projects
    .filter((p) => isApprovedProject(p) && p.heroImage)
    .sort((a, b) => a.order - b.order);
  return (
    <div
      className={"v2-work-list" + (full ? " v2-work-full" : "")}
      tabIndex={0}
      role="region"
      aria-label="Flagship company creation work; scroll horizontally on mobile"
    >
      {published.map((project, i) => (
        <article key={project.slug} className="v2-work-approved">
          <Link href={"/work/" + project.slug} className="v2-work-image">
            <Image
              src={project.heroImage!.src}
              srcSet={project.heroImage!.srcSet}
              sizes="(max-width: 700px) 85vw, 50vw"
              width={project.heroImage!.width || 640}
              height={project.heroImage!.height || 389}
              alt={project.heroImage!.alt}
              loading="lazy"
            />
          </Link>
          <div className="v2-work-caption">
            <span className="eyebrow">
              0{i + 1} /{" "}
              {project.slug === "mymosa"
                ? "BRAND ECOSYSTEM"
                : "DIGITAL EXPERIENCE"}
            </span>
            <h3>{project.title}</h3>
            <p>{project.services.join(" / ")}</p>
            {full && (
              <p className="v2-disciplines">{project.shortDescription}</p>
            )}
            <Link href={"/work/" + project.slug} className="text-link">
              EXPLORE THE CASE STUDY →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
export function CreationNetwork() {
  return (
    <section className="v2-network shell">
      <div>
        <p className="eyebrow">COMPANY CREATION NETWORK</p>
        <h2>
          One lead.
          <br />
          <em>The right specialists.</em>
        </h2>
      </div>
      <div>
        <p>
          Dynasty Works leads the project and connects creative, product and
          technology work. Where licensed or specialized work is required, we
          coordinate with qualified professionals selected for the engagement.
        </p>
        <ul>
          {networkCategories.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="small-note">
          These are specialist categories, not a claim of retained partners or
          in-house licenses. Professional scope and credentials are confirmed
          before engagement.
        </p>
      </div>
    </section>
  );
}
export function DigitalSystemsFeature() {
  return (
    <section className="v2-digital shell">
      <div>
        <p className="eyebrow">DIGITAL SYSTEMS / SCALE</p>
        <h2>
          The operating system
          <br />
          <em>behind the company.</em>
        </h2>
        <p>
          Lead routing. Content pipelines. CRM connections. Email and social
          workflows. Less manual administration; better information flow.
        </p>
        <Link href="/automation" className="text-link">
          AI + AUTOMATION SYSTEMS →
        </Link>
      </div>
      <ol>
        <li>
          <span>01 / CAPABILITY</span>
          <p>Workflow architecture, AI integration and connected operations.</p>
        </li>
        <li>
          <span>02 / AVAILABLE IMPLEMENTATION</span>
          <p>
            Scoped workflow builds, subject to discovery, permissions and
            provider configuration.
          </p>
        </li>
        <li>
          <span>03 / CURRENTLY CONNECTED</span>
          <p>
            No production email, social, CRM or orchestration integrations are
            active on this site.
          </p>
        </li>
      </ol>
    </section>
  );
}
