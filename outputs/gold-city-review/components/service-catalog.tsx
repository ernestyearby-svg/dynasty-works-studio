import { automationServices } from "@/data/automation";
import Link from "@/components/site-link";
import { practices, type PracticeId } from "@/data/practices";
import { serviceCatalog, boundaryCopy } from "@/data/service-catalog";
import { projects, type Category } from "@/data/projects";
import { ProjectCard } from "@/components/studio";
export const practiceAudiences: Record<PracticeId, string> = {
  start:
    "Founders making their first decisions and companies organizing a new direction.",
  brand:
    "Businesses defining a recognizable identity or a considered next expression.",
  build:
    "Companies connecting customer experiences with useful digital infrastructure.",
  launch: "Teams preparing a coordinated introduction, campaign or release.",
  distribute:
    "Physical-product businesses preparing for buyer and channel conversations.",
  activate:
    "Brands connecting with audiences in retail, hospitality and real-world settings.",
  grow: "Operating businesses improving creative, digital and commercial systems.",
  publish:
    "Founders and teams turning ideas and expertise into useful communication.",
};
const relatedCategories: Partial<Record<PracticeId, Category[]>> = {
  brand: ["Branding", "Packaging"],
  build: ["Web", "Apps", "AI"],
  launch: ["Advertising"],
  activate: ["Experiences"],
  publish: ["Illustration"],
};
export function PracticeCatalog({ id }: { id?: PracticeId }) {
  return (
    <div className="catalog-practices">
      {practices
        .filter((p) => !id || p.id === id)
        .map((p, i) => {
          const services = serviceCatalog.filter(
            (s) => s.practice === p.id && s.active,
          );
          return (
            <details
              className="catalog-practice"
              key={p.id}
              open={!!id}
              id={p.id}
            >
              <summary>
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")} / {services.length} SERVICES
                </span>
                <h2>{p.title}</h2>
                <span>{p.tagline}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <div className="catalog-body">
                <p className="catalog-audience">{practiceAudiences[p.id]}</p>
                <div className="catalog-services">
                  {services.map((s) => (
                    <details key={s.id}>
                      <summary>
                        {s.name}
                        <span aria-hidden="true">+</span>
                      </summary>
                      <p>{s.longDescription}</p>
                      {automationServices.some(
                        (a) => a.parentServiceId === s.id,
                      ) && (
                        <ul className="automation-service-list">
                          {automationServices
                            .filter(
                              (a) =>
                                a.parentServiceId === s.id && a.name !== s.name,
                            )
                            .map((a) => (
                              <li key={a.id}>{a.name}</li>
                            ))}
                        </ul>
                      )}
                      <p className="small-note">
                        {boundaryCopy[s.professionalBoundary]}
                      </p>
                      <Link
                        href="/start-a-business/builder"
                        className="text-link"
                      >
                        Build a brief around this ↗
                      </Link>
                    </details>
                  ))}
                </div>
                {p.id === "build" && (
                  <p className="automation-catalog-link">
                    <Link href="/automation" className="text-link">
                      AI + Automation Systems — explore connected operations ↗
                    </Link>
                  </p>
                )}
                <div className="catalog-next">
                  <Link href={"/capabilities/" + p.id} className="text-link">
                    Explore the {p.title.toLowerCase()} practice ↗
                  </Link>
                  <Link
                    href={
                      p.id === "grow"
                        ? "/growth-partnership"
                        : "/start-a-business/builder"
                    }
                    className="text-link"
                  >
                    {p.id === "grow"
                      ? "Explore ongoing support"
                      : "Build your roadmap"}{" "}
                    ↗
                  </Link>
                </div>
              </div>
            </details>
          );
        })}
    </div>
  );
}
export function PracticeWork({ id }: { id: PracticeId }) {
  const related = projects
    .filter(
      (p) =>
        p.status === "published" &&
        p.category.some((c) => relatedCategories[id]?.includes(c)),
    )
    .slice(0, 2);
  return (
    <section className="section">
      <span className="eyebrow">RELATED WORK</span>
      <h2>Proof belongs in the work.</h2>
      {related.length ? (
        <div className="selected-grid">
          {related.map((p) => (
            <ProjectCard project={p} key={p.slug} />
          ))}
        </div>
      ) : (
        <p className="section-description">
          Explore selected identity, packaging and digital work from the studio.
        </p>
      )}
      <Link href="/work" className="text-link">
        Explore the portfolio ↗
      </Link>
    </section>
  );
}
export function CommercialPaths() {
  return (
    <section className="shell section commercial-paths">
      <span className="eyebrow">FIND YOUR STARTING POINT</span>
      <p>
        <Link href="/founder-blueprint" className="text-link">
          Founder Blueprint — $1,500 · Turn the idea into a buildable company
          roadmap ↗
        </Link>
      </p>
      <div>
        {[
          ["I have an idea", "/start-a-business/builder"],
          ["I need a specific service", "/capabilities"],
          ["I want to see your work", "/work"],
          ["I need a full build", "/contact"],
          ["I need ongoing support", "/growth-partnership"],
          ["I want to do it myself", "/templates"],
        ].map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
            <span>↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
