import Link from "@/components/site-link";
import { content } from "@/lib/content";
import { site } from "@/data/site";
import {
  Hero,
  SectionHeading,
  ProjectCard,
  ProcessTimeline,
  FinalCTA,
  ProjectArtwork,
} from "@/components/studio";
import {
  CompanyInvitation,
  CompanyJourney,
  PracticeGrid,
} from "@/components/company-sections";
export default async function Home() {
  const projects = await content.listProjects();
  const featured = projects.filter((p) => p.featured);
  const focus = projects.find((p) => p.slug === "smokesuite");
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
      <CompanyInvitation />
      <section className="shell home-journey">
        <span className="eyebrow">
          ONE ROADMAP / THE STAGES YOUR BUSINESS NEEDS
        </span>
        <CompanyJourney compact />
        <Link className="text-link" href="/start-a-business#journey">
          Explore the company-building process ↗
        </Link>
      </section>
      <section className="dark-section shell section">
        <SectionHeading
          number="02"
          label="CAPABILITIES"
          title="One idea. Every discipline."
        />
        <p className="section-description">
          Strategy, creative and technology, connected to the realities of
          launch and growth.
        </p>
        <PracticeGrid compact />
        <Link href="/services" className="text-link">
          Explore our capabilities ↗
        </Link>
      </section>
      {focus && (
        <section className="featured shell section">
          <div className="featured-copy">
            <span className="eyebrow">03 / IN FOCUS</span>
            <h2>
              Brand thinking.
              <br />
              Digital expression.
            </h2>
            <p>{focus.title}</p>
            <p className="muted">
              A case-study framework ready for the product story, from the first
              decision to the final interface.
            </p>
            <Link className="button" href={"/work/" + focus.slug}>
              Explore the project ↗
            </Link>
          </div>
          <Link
            href={"/work/" + focus.slug}
            aria-label={"Explore " + focus.title}
          >
            <ProjectArtwork project={focus} />
          </Link>
        </section>
      )}
      <section className="shell section">
        <SectionHeading
          number="04"
          label="HOW WE WORK"
          title="A clear path forward."
        />
        <ProcessTimeline />
      </section>
      <section className="home-template-preview shell section">
        <div>
          <span className="eyebrow">05 / TOOLS FOR FOUNDERS</span>
          <h2>
            A starting point
            <br />
            of your own.
          </h2>
        </div>
        <div>
          <p>
            Future templates, documents and creative systems for founders who
            want to build at their own pace.
          </p>
          <p className="small-note">
            Collections are in development. No products or prices have been
            released.
          </p>
          <Link className="text-link" href="/templates">
            Explore the planned collections ↗
          </Link>
        </div>
      </section>
      <section className="statement shell section">
        <span className="eyebrow">06 / THE STUDIO</span>
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
