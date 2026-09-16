/* DWS environments are pre-optimized responsive WebP assets. */
import { OptimizedImage } from "@/components/optimized-image";
import Link from "@/components/site-link";
import { BrandSymbol } from "@/components/brand-symbol";
import { BlueprintProduct } from "@/components/experience-interactive";
import { founderBlueprint } from "@/data/founder-blueprint";
import { isApprovedProject } from "@/lib/content";
import type { Project } from "@/data/projects";
const phases = [
  "Strategy",
  "Brand",
  "Product",
  "Digital",
  "Launch",
  "Market",
  "Growth",
];
export function MasterEnvironment({
  name,
  hero = false,
}: {
  name: string;
  hero?: boolean;
}) {
  return (
    <picture className="master-environment">
      <source
        media="(max-width: 700px)"
        srcSet={"/assets/experience/" + name + "-mobile.webp"}
      />
      <OptimizedImage
        src={"/assets/experience/" + name + ".webp"}
        width="1920"
        height="1024"
        alt=""
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
export function MasterHomepage({ projects }: { projects: Project[] }) {
  return (
    <div className="master-home">
      <section className="master-hero" aria-labelledby="master-title">
        <MasterEnvironment name="DWS-ARCH-01" hero />
        <div className="shell master-hero-grid">
          <div className="master-hero-copy">
            <p className="eyebrow">IDEAS. SYSTEMS. EXECUTION.</p>
            <h1 id="master-title">
              WE BUILD
              <br />
              THE COMPANY
              <br />
              <em>
                AROUND
                <br />
                THE IDEA.
              </em>
            </h1>
            <p className="master-support">
              Strategy. Identity. Technology. Execution.
              <br />A modern studio for visionary founders.
            </p>
          </div>
          <aside className="master-side eyebrow">
            FROM
            <br />
            CONCEPT
            <br />
            TO COMPANY.
            <br />
            TO MARKET.
            <br />
            TO LEGACY.
            <span aria-hidden="true" />
          </aside>
          <div className="master-hero-actions">
            <Link href="/start-a-business/builder" className="button light">
              BUILD YOUR COMPANY <span aria-hidden="true">→</span>
            </Link>
            <Link href="/work" className="text-link">
              EXPLORE THE WORK
            </Link>
          </div>
          <div className="master-hero-foot eyebrow">
            <span>IDEA. BUILD. GROW.</span>
            <a href="#approach">
              DISCOVER OUR APPROACH <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
      <section
        className="master-approach shell"
        id="approach"
        aria-labelledby="approach-title"
      >
        <div className="master-approach-copy" data-reveal>
          <p className="eyebrow master-rule">01 / APPROACH</p>
          <h2 id="approach-title">
            IDEAS
            <br />
            NEED
            <br />
            SYSTEMS.
          </h2>
          <p>
            We combine strategy, brand, product, digital, launch and growth into
            one coordinated build system. From the first idea to the company
            around it.
          </p>
          <Link href="/studio" className="text-link">
            OUR APPROACH <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="master-layers">
          <MasterEnvironment name="DWS-ARCH-02" />
        </div>
        <ol className="master-phase-list">
          {phases.map((p, i) => (
            <li key={p}>
              <span>0{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
        <aside className="master-approach-aside eyebrow">
          ONE IDEA.
          <br />
          MULTIPLE SYSTEMS.
          <br />
          ONE COORDINATED
          <br />
          COMPANY.
          <span aria-hidden="true" />
          <p>
            CREATIVE
            <br />
            TECHNOLOGY
            <br />
            COMMERCE
            <br />
            CULTURE
            <br />
            LEGACY
          </p>
        </aside>
      </section>
      <section className="master-work" aria-labelledby="work-title">
        <div className="shell master-section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK</p>
            <h2 id="work-title">
              REAL BRANDS.
              <br />
              REAL WORK.
            </h2>
          </div>
          <Link href="/work" className="text-link">
            VIEW ALL WORK <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="master-work-gallery"
          tabIndex={0}
          role="region"
          aria-label="Selected project gallery"
        >
          {[
            "mymosa",
            "ikla-maison",
            "smokesuite",
            "mr-cliffs",
            "ohana-to-alpine",
          ].map((slug, i) => {
            const p = projects.find((p) => p.slug === slug)!;
            const approved = isApprovedProject(p) && p.heroImage;
            return (
              <article className="master-project" key={slug}>
                {approved ? (
                  <Link href={"/work/" + p.slug}>
                    <OptimizedImage
                      src={p.heroImage!.src}
                      alt={p.heroImage!.alt}
                      width="640"
                      height="440"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <div className="master-project-reserved">
                    <span className="eyebrow">SELECTED WORK / 0{i + 1}</span>
                    <span>
                      Case study
                      <br />
                      <em>forthcoming.</em>
                    </span>
                  </div>
                )}
                <div className="master-project-caption">
                  <h3>{p.title}</h3>
                  <span>0{i + 1}</span>
                </div>
                <p className="eyebrow">
                  {approved
                    ? p.services.join(" / ")
                    : "PROJECT STORY IN PREPARATION"}
                </p>
              </article>
            );
          })}
        </div>
        <p className="master-work-note shell">
          Approved project imagery and scope will accompany each case study.
        </p>
      </section>
      <section className="master-builder shell" aria-labelledby="builder-title">
        <div className="master-builder-copy" data-reveal>
          <p className="eyebrow">COMPANY BUILDER</p>
          <h2 id="builder-title">
            A SMARTER
            <br />
            WAY TO START.
          </h2>
          <p>
            Answer a few questions and receive a personalized
            company-development roadmap — with recommended services, structure
            and next steps.
          </p>
          <Link href="/start-a-business/builder" className="button dark">
            START YOUR BUILD <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="master-device-stage"
          aria-label="Company Builder roadmap interface preview"
        >
          <div className="master-device">
            <header>
              <span>
                <BrandSymbol /> DYNASTY WORKS STUDIO
              </span>
              <span>01 / 06</span>
            </header>
            <div className="master-device-body">
              <div>
                <p className="eyebrow">COMPANY BUILDER / FORMAT PREVIEW</p>
                <h3>
                  Your Company
                  <br />
                  <em>Roadmap</em>
                </h3>
                <BrandSymbol />
                <p className="eyebrow">
                  FROM IDEA
                  <br />
                  TO EXECUTION.
                </p>
              </div>
              <ol>
                {[
                  "Strategy",
                  "Brand",
                  "Build",
                  "Launch",
                  "Market",
                  "Growth",
                ].map((p, i) => (
                  <li key={p}>
                    <span>0{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
            <footer>YOUR IDEA. A CONSIDERED NEXT MOVE.</footer>
          </div>
        </div>
        <aside className="master-builder-aside eyebrow">
          IDEA
          <br />
          TO
          <br />
          EXECUTION
          <br />
          AND BEYOND.
          <span aria-hidden="true" />
        </aside>
      </section>
      <section
        className="master-blueprint shell"
        aria-labelledby="blueprint-title"
      >
        <div>
          <p className="eyebrow">FOUNDER BLUEPRINT / STRATEGIC SERIES 01</p>
          <h2 id="blueprint-title">
            THE COMPANY.
            <br />
            <em>ON PAPER.</em>
          </h2>
          <p>
            A strategic engagement that makes the company tangible before major
            execution begins.
          </p>
          <strong>{founderBlueprint.priceLabel}</strong>
          <p className="small-note">
            Strategy and roadmap. Execution scoped separately.
          </p>
          <Link href="/founder-blueprint" className="text-link">
            EXPLORE THE BLUEPRINT <span aria-hidden="true">→</span>
          </Link>
          <Link href="/automation" className="master-automation-link text-link">
            AI + AUTOMATION SYSTEMS <span aria-hidden="true">→</span>
          </Link>
        </div>
        <BlueprintProduct />
      </section>
      <section className="master-closing" aria-labelledby="closing-title">
        <MasterEnvironment name="DWS-FINAL-01" />
        <div className="shell master-closing-inner">
          <div>
            <p className="eyebrow">
              THE NEXT GENERATION
              <br />
              OF COMPANIES WON’T BUILD THEMSELVES.
            </p>
            <h2 id="closing-title">
              <em>LET’S BUILD</em>
              <br />
              WHAT COMES NEXT.
            </h2>
          </div>
          <div>
            <Link href="/contact" className="button light">
              WORK WITH US <span aria-hidden="true">→</span>
            </Link>
            <p className="eyebrow">
              BOLDER IDEAS.
              <br />A MORE AMBITIOUS
              <br />
              TOMORROW.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
