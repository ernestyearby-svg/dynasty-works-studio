import Link from "@/components/site-link";
import {
  flagshipPlans,
  processEvidenceStages,
  identityVariants,
} from "@/data/creative-direction";
import { PracticeGrid } from "@/components/company-sections";
import { BlueprintCover, BuildSequence } from "@/components/build-sequence";
export const metadata = {
  title: "Internal Creative Review",
  description:
    "Four identity explorations and the Dynasty Works Studio design direction. Not final brand assets.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/creative-review" },
};
export default function CreativeReview() {
  return (
    <div className="creative-review">
      <section className="shell page-intro">
        <span className="eyebrow">
          INTERNAL CREATIVE REVIEW / NOT FINAL BRAND ASSETS
        </span>
        <h1>
          Four territories.
          <br />
          <em>An open direction.</em>
        </h1>
        <p>
          Identity exploration / Not final. The typography-only production
          lockup remains temporary. No territory has been selected.
        </p>
      </section>
      <section className="shell review-territories">
        <article>
          <header>
            <span>01 / ARCHITECTURAL WORDMARK</span>
            <span>IDENTITY EXPLORATION / NOT FINAL</span>
          </header>
          <div className="territory territory-one">
            <strong>
              DYNASTY
              <br />
              WORKS
            </strong>
            <span>STUDIO —</span>
          </div>
          <p>
            A measured wordmark. Shared edges, generous margins and a quiet
            institutional rhythm.
          </p>
        </article>
        <article>
          <header>
            <span>02 / DW RELATIONSHIP</span>
            <span>IDENTITY EXPLORATION / NOT FINAL</span>
          </header>
          <div className="territory territory-two">
            <svg
              viewBox="0 0 280 150"
              role="img"
              aria-label="Exploratory geometric D and W sharing a continuous construction line"
            >
              <path
                d="M20 125V25H67Q117 25 117 75T67 125H20M127 25L154 125L184 59L214 125L245 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinejoin="miter"
              />
              <path d="M20 75H245" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span>DYNASTY WORKS / STUDIO</span>
          </div>
          <p>
            A curved enclosure meets a repeated structural span. Shared
            proportions, without overlapping initials.
          </p>
        </article>
        <article>
          <header>
            <span>03 / MODULAR SYSTEM</span>
            <span>IDENTITY EXPLORATION / NOT FINAL</span>
          </header>
          <div className="territory territory-three">
            <svg
              viewBox="0 0 280 150"
              role="img"
              aria-label="Exploratory connected modules progressing through three stages"
            >
              <path
                d="M20 125V95H90V60H160V25H230V125Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
              />
              <path
                d="M90 95V125M160 60V125"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span>IDEA → COMPANY → MARKET</span>
          </div>
          <p>
            A connected framework grows by addition. A modular grammar for
            progression, documents and motion.
          </p>
        </article>
        <article>
          <header>
            <span>04 / EDITORIAL DESIGN HOUSE</span>
            <span>IDENTITY EXPLORATION / NOT FINAL</span>
          </header>
          <div className="territory territory-four">
            <strong>
              Dynasty
              <br />
              <em>Works.</em>
            </strong>
            <span>S T U D I O</span>
          </div>
          <p>
            A typographic direction built around contrast, editorial scale and
            exceptionally quiet supporting detail.
          </p>
        </article>
      </section>
      <section className="shell section">
        <span className="eyebrow">TYPE / SYSTEM FONTS — NO FONT DOWNLOAD</span>
        <h2>
          Precision in scale.
          <br />
          <em>Expression in contrast.</em>
        </h2>
        <div className="review-type">
          {[
            "Display XL",
            "Display",
            "H1",
            "H2",
            "H3",
            "H4",
            "Body Large",
            "Body",
            "Small",
            "Caption",
            "Eyebrow",
            "Technical Label",
          ].map((x, i) => (
            <div key={x}>
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} / {x}
              </span>
              <p
                style={{
                  fontSize:
                    "var(--type-" +
                    [
                      "xl",
                      "display",
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "large",
                      "body",
                      "small",
                      "caption",
                      "eyebrow",
                      "technical",
                    ][i] +
                    ")",
                }}
              >
                From idea to execution.
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="shell section">
        <h2>Material, without ornament.</h2>
        <div className="review-palette">
          {["obsidian", "bone", "gray", "graphite", "bronze"].map((x) => (
            <div key={x} className={"swatch swatch-" + x}>
              <span>{x}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="shell section dark-section">
        <span className="eyebrow">ONE PRACTICE SYSTEM / 01—08</span>
        <h2>Connected disciplines.</h2>
        <PracticeGrid compact />
      </section>
      <section className="shell section">
        <span className="eyebrow">HOMEPAGE / EDITORIAL DIRECTION</span>
        <h2>
          The company
          <br />
          around the idea.
        </h2>
        <BuildSequence />
        <p>
          Type carries the first impression. Approved work will occupy the large
          selected-work and featured-case surfaces. No illustrative client work
          is used to fill them.
        </p>
        <Link className="text-link" href="/">
          View homepage direction ↗
        </Link>
      </section>
      <section className="shell section">
        <span className="eyebrow">
          CASE STUDY DIRECTION / INTERNAL ASSET REGISTER
        </span>
        <h2>Process becomes proof.</h2>
        <p>
          These are requested presentation areas, not claims of work completed.
          All five flagships need approved materials and copy. SmokeSuite must
          not imply engineering certification.
        </p>
        {flagshipPlans.map((p) => (
          <details className="review-project" key={p.slug}>
            <summary>
              {p.title}
              <span>ASSET NEEDED</span>
            </summary>
            <p>{p.areas.join(" · ")}</p>
            <p>
              Approval: unknown. Supply project-specific masters, rights,
              credits, approved scope and process evidence. Do not fabricate
              dates, results or before / after pairs.
            </p>
          </details>
        ))}
        <h3>Evidence-led sequence</h3>
        <p>{processEvidenceStages.join(" → ")}</p>
        <p>
          Only stages backed by real, approved material will render. Supported
          layouts: packaging hero, product family, details, flat artwork,
          dielines, environments and retail; 3D render, turntable, technical
          view and process; minimal browser, mobile sequence and responsive
          comparison.
        </p>
      </section>
      <section className="shell section dw-product">
        <div>
          <span className="eyebrow">COMPANY BUILDER DIRECTION</span>
          <h2>
            A considered
            <br />
            next move.
          </h2>
          <p>
            Precise progress, clear selection states, numbered roadmap phases
            and a distinct engagement recommendation. Existing recommendation
            logic is preserved.
          </p>
          <Link className="text-link" href="/start-a-business/builder">
            Review Company Builder ↗
          </Link>
        </div>
        <div>
          <span className="eyebrow">FOUNDER BLUEPRINT DIRECTION</span>
          <BlueprintCover />
          <Link className="text-link" href="/founder-blueprint">
            Review Founder Blueprint ↗
          </Link>
        </div>
      </section>
      <section className="shell section">
        <span className="eyebrow">FUTURE IDENTITY / APPROVAL REQUIRED</span>
        <h2>A family of expressions.</h2>
        <p>{identityVariants.join(" · ")}</p>
        <p>
          Approve a territory, refine letterforms and test small-scale use
          before producing these final assets. The current favicon is a
          temporary typographic label.
        </p>
      </section>
    </div>
  );
}
