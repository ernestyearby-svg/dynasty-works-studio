import { AutomationFeature } from "@/components/automation";
import Link from "@/components/site-link";
import { content } from "@/lib/content";
import {
  Hero,
  SectionHeading,
  ProjectCard,
  ProcessTimeline,
  FinalCTA,
} from "@/components/studio";
import { PracticeGrid } from "@/components/company-sections";
import { BuildSequence, BlueprintCover } from "@/components/build-sequence";
import { founderBlueprint } from "@/data/founder-blueprint";
export default async function Home() {
  const projects = await content.listProjects();
  const featured = projects.filter((p) => p.featured);
  const focus = featured[2];
  return (
    <>
      <Hero />
      <section className="shell section dw-selected">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title="The work is the proof."
        />
        {featured.length ? (
          <div className="selected-grid">
            {featured.slice(0, 2).map((p) => (
              <ProjectCard project={p} key={p.slug} />
            ))}
          </div>
        ) : (
          <div className="dw-work-intro">
            <p>
              Ideas take shape.
              <br />
              <em>Across every dimension.</em>
            </p>
            <div>
              <span className="eyebrow">THE PORTFOLIO</span>
              <p>Our selected case studies are being curated for release.</p>
              <Link className="text-link" href="/work">
                Explore the work index ↗
              </Link>
            </div>
          </div>
        )}
      </section>
      <section className="shell section dw-system">
        <span className="eyebrow">02 / THE BUILD SYSTEM</span>
        <h2>
          One idea.
          <br />
          <em>A connected company.</em>
        </h2>
        <BuildSequence />
        <p className="dw-offset">
          The strategy informs the brand. The brand shapes the product. The
          product meets the market. Every decision belongs to a larger whole.
        </p>
      </section>
      {focus && (
        <section className="shell section">
          <SectionHeading number="03" label="IN FOCUS" title={focus.title} />
          <ProjectCard project={focus} />
        </section>
      )}
      <section className="shell section dark-section">
        <SectionHeading
          number="04"
          label="EIGHT CONNECTED PRACTICES"
          title="One studio. The entire build."
        />
        <PracticeGrid compact />
        <Link className="text-link" href="/capabilities">
          Explore our capabilities ↗
        </Link>
      </section>
      <section className="shell section dw-product">
        <div>
          <span className="eyebrow">05 / COMPANY BUILDER</span>
          <h2>
            Your idea.
            <br />
            Your next move.
          </h2>
          <p>
            A guided starting point. Map what you have, what you need and the
            order to build it.
          </p>
          <Link className="button dark" href="/start-a-business/builder">
            Build your company ↗
          </Link>
        </div>
        <div className="dw-product-diagram">
          <span className="eyebrow">A GUIDED BUILD / 01—07</span>
          {["Define the idea", "Connect the needs", "Sequence the build"].map(
            (x, i) => (
              <div key={x}>
                <span>0{i + 1}</span>
                <strong>{x}</strong>
                <span>↗</span>
              </div>
            ),
          )}
          <p>From a starting point to a preliminary roadmap.</p>
        </div>
      </section>
      <section className="shell section dw-blueprint">
        <BlueprintCover />
        <div>
          <span className="eyebrow">06 / FOUNDER BLUEPRINT</span>
          <h2>
            Before you build.
            <br />
            <em>Know the company.</em>
          </h2>
          <p>
            A strategic engagement to turn the idea into a coordinated company
            roadmap.
          </p>
          <strong className="dw-price">{founderBlueprint.priceLabel}</strong>
          <p className="small-note">
            Strategy and roadmap. Execution scoped separately.
          </p>
          <Link className="button" href="/founder-blueprint">
            Explore Founder Blueprint ↗
          </Link>
        </div>
      </section>
      <section className="shell section">
        <SectionHeading
          number="07"
          label="PROCESS"
          title="Considered. Then constructed."
        />
        <ProcessTimeline />
      </section>
      <section className="shell section dw-archive-link">
        <span className="eyebrow">08 / SELECTED CREATIVE</span>
        <Link href="/work/archive">
          A wider field
          <br />
          <em>of expression.</em>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="shell section dw-statement">
        <span className="eyebrow">09 / THE STUDIO</span>
        <h2>
          An idea rarely
          <br />
          needs only one thing.
        </h2>
        <div className="dw-offset">
          <p>
            We connect strategy, design and technology around the whole company.
            One considered direction, carried through the build.
          </p>
          <Link className="text-link" href="/studio">
            Inside the studio ↗
          </Link>
        </div>
      </section>
      <AutomationFeature />
      <FinalCTA />
    </>
  );
}
