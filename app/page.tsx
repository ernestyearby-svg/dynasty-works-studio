import Link from "@/components/site-link";
import { content } from "@/lib/content";
import { site } from "@/data/site";
import {
  Hero,
  SectionHeading,
  ProjectCard,
  ServiceGrid,
  ProcessTimeline,
  FinalCTA,
  ProjectArtwork,
} from "@/components/studio";
export default async function Home() {
  const projects = await content.listProjects();
  const featured = projects.filter((p) => p.featured);
  return (
    <>
      <Hero />
      <section className="shell section selected">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title="Ideas made tangible."
        />
        <div className="section-sub">
          <p>Across brands, screens and physical spaces.</p>
          <Link href="/work" className="text-link">
            View all work ↗
          </Link>
        </div>
        <p className="content-note">
          Portfolio preview · Project names supplied by the studio. Visuals and
          category assignments are illustrative, pending approval.
        </p>
        <div className="selected-grid">
          {featured.slice(0, 2).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="dark-section shell section">
        <SectionHeading
          number="02"
          label="CAPABILITIES"
          title="Many disciplines. One studio."
        />
        <p className="section-description">
          From the strategy behind a brand to the systems that move it forward.
        </p>
        <ServiceGrid compact />
        <Link href="/services" className="text-link">
          Explore our capabilities ↗
        </Link>
      </section>
      <section className="shell section">
        <SectionHeading
          number="03"
          label="OUR PROCESS"
          title="A clear path forward."
        />
        <ProcessTimeline />
      </section>
      <section className="featured shell section">
        <div className="featured-copy">
          <span className="eyebrow">04 / IN FOCUS</span>
          <h2>
            Brand thinking.
            <br />
            Digital expression.
          </h2>
          <p>SmokeSuite</p>
          <p className="muted">
            A case-study framework ready for the product story, from the first
            decision to the final interface.
          </p>
          <Link className="button" href="/work/smokesuite">
            Explore the project ↗
          </Link>
        </div>
        <Link href="/work/smokesuite" aria-label="Explore SmokeSuite">
          <ProjectArtwork
            project={projects.find((p) => p.slug === "smokesuite")!}
          />
        </Link>
      </section>
      <section className="statement shell section">
        <span className="eyebrow">05 / THE STUDIO</span>
        <h2>{site.statement}</h2>
        <div>
          <p>{site.description}</p>
          <Link className="text-link" href="/studio">
            Meet the studio ↗
          </Link>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}

