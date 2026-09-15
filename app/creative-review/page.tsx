import { BrandSymbol } from "@/components/brand-symbol";
import { BrandProgression } from "@/components/brand-progression";
import { OptimizedImage } from "@/components/optimized-image";
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
    "Approved Direction 03 production identity, application standards and archived explorations.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/creative-review" },
};
export default function CreativeReview() {
  return (
    <div className="creative-review">
      <section className="shell page-intro">
        <span className="eyebrow">INTERNAL BRAND REGISTER / V1.6</span>
        <h1>
          One identity.
          <br />
          <em>Built to belong.</em>
        </h1>
        <p>
          Direction 03 — Modular System Mark is approved as the production
          identity. Directions 01, 02 and 04 are archived explorations, retained
          only as historical records.
        </p>
      </section>
      <section className="shell review-territories">
        <article className="review-approved">
          <header>
            <span>03 / MODULAR SYSTEM</span>
            <span>APPROVED / PRODUCTION DIRECTION</span>
          </header>
          <div className="territory territory-three">
            <BrandSymbol />
            <span>IDEA → BUILD → GROW</span>
          </div>
          <p>
            The approved master: construction through progression. A modular
            grammar for progression, documents and motion.
          </p>
        </article>
        <article>
          <header>
            <span>01 / ARCHITECTURAL WORDMARK</span>
            <span>ARCHIVED EXPLORATIONS</span>
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
            <span>ARCHIVED EXPLORATIONS</span>
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
            <span>04 / EDITORIAL DESIGN HOUSE</span>
            <span>ARCHIVED EXPLORATIONS</span>
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
        <span className="eyebrow">PRODUCTION ASSETS / ONE VECTOR MASTER</span>
        <h2>One system. Every scale.</h2>
        <div className="brand-asset-links">
          {[
            "logo/logo-primary.svg",
            "logo/logo-horizontal.svg",
            "logo/logo-stacked.svg",
            "logo/wordmark.svg",
            "symbol/symbol.svg",
            "symbol/symbol-outline.svg",
            "symbol/symbol-reversed.svg",
          ].map((file) => (
            <a key={file} href={"/assets/brand/" + file} download>
              {file.split("/")[1]}
            </a>
          ))}
        </div>
        <div className="identity-size-strip">
          {[16, 32, 48, 180, 192, 512].map((size) => (
            <figure key={size}>
              <OptimizedImage
                src={"/assets/brand/icons/icon-" + size + ".png"}
                width={Math.min(size, 96)}
                height={Math.min(size, 96)}
                alt={"Modular icon at " + size + " pixels"}
              />
              <figcaption>
                {size} × {size}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          16–48px uses the optical small-size derivative. Larger assets retain
          the master hairline divisions. Above 96px, the previews here are
          scaled down; the source files retain their labeled dimensions.
        </p>
        <h3>Motion: idea, build, grow.</h3>
        <BrandProgression complete />
        <p>
          Three connected modules resolve in under one second. The full static
          mark remains visible when reduced motion is requested. No forced site
          introduction.
        </p>
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
            "Navigation",
            "Button",
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
                      "navigation",
                      "button",
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
          {[
            "obsidian",
            "graphite",
            "stone",
            "bone",
            "champagne",
            "warm-taupe",
            "soft-sand",
            "bronze",
          ].map((x) => (
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
        <span className="eyebrow">
          DOCUMENT / PRESENTATION / SOCIAL ARCHITECTURE
        </span>
        <h2>A consistent institution.</h2>
        <div className="dw-product">
          <BlueprintCover template />
          <div>
            <h3>Documents</h3>
            <p>
              Founder Blueprint, proposals, pitch decks, reports, invoices,
              strategy documents, case studies, sales sheets and project
              roadmaps share a cover, technical header, restrained footer and
              page-number grid.
            </p>
            <h3>Presentations</h3>
            <p>
              Obsidian covers. Bone editorial pages. Large type, approved
              full-bleed imagery and quiet technical captions.
            </p>
            <h3>Social</h3>
            <p>
              One avatar across Instagram, LinkedIn, YouTube, TikTok, X and
              future platforms. Announcement, case study, project reveal, quote,
              education, process, Blueprint and Builder formats share the same
              margins and type hierarchy. No content calendar or fabricated
              posts are included.
            </p>
          </div>
        </div>
        <div className="document-system-example">
          <header>
            <BrandSymbol />
            <span className="eyebrow">[DOCUMENT TYPE] / [SECTION]</span>
          </header>
          <h3>[Section title]</h3>
          <p>
            [Approved content uses the shared editorial grid. Bracketed labels
            are template fields, not client information.]
          </p>
          <footer>
            <span>DYNASTY WORKS / STUDIO</span>
            <span>[DATE] / [PAGE NUMBER]</span>
          </footer>
        </div>
        <div className="brand-asset-links">
          <a
            href="/assets/brand/documents/blueprint-cover-template.svg"
            download
          >
            Blueprint cover template
          </a>
          <a
            href="/assets/brand/documents/presentation-cover-template.svg"
            download
          >
            Presentation cover template
          </a>
          <a href="/assets/brand/social/avatar.svg" download>
            Social avatar
          </a>
          <a href="/assets/brand/social/opengraph-template.svg" download>
            OpenGraph architecture
          </a>
        </div>
        <p>
          The OpenGraph SVG is an editable layout template. It is not wired as a
          crawler image: broad social previews need a separately approved raster
          export. No project imagery is fabricated.
        </p>
      </section>
      <section className="shell section">
        <span className="eyebrow">PRODUCTION IDENTITY / DIRECTION 03</span>
        <h2>A family of expressions.</h2>
        <p>{identityVariants.join(" · ")}</p>
        <p>
          The modular symbol is locked. All variants derive from one vector
          master. Small icons omit the hairline dividers and strengthen the
          outer stroke; the module positions are unchanged.
        </p>
      </section>
    </div>
  );
}
