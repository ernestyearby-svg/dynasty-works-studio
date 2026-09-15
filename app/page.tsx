import Link from "@/components/site-link";
import { content } from "@/lib/content";
import {
  ExperienceHero,
  CinematicWork,
  ExperienceClosing,
} from "@/components/digital-experience";
import {
  AssemblyExperience,
  CapabilityExperience,
  BlueprintProduct,
  LivingSystem,
} from "@/components/experience-interactive";
import { founderBlueprint } from "@/data/founder-blueprint";
import { practices } from "@/data/practices";
export default async function Home() {
  const projects = (await content.listProjects()).filter((p) => p.featured);
  return (
    <div className="ex-home">
      <ExperienceHero />
      <section
        id="experience-intro"
        className="shell ex-intro ex-section"
        data-reveal
      >
        <span className="eyebrow">01 / THE WHOLE COMPANY</span>
        <h2>
          An idea is
          <br />
          only the
          <br />
          <em>beginning.</em>
        </h2>
        <div>
          <p>
            A company is everything that comes around it. The strategy. The
            identity. The product. The systems that bring it to life.
          </p>
          <p>We connect those pieces, from first direction to execution.</p>
          <Link href="/studio" className="text-link">
            Inside Dynasty Works ↗
          </Link>
        </div>
      </section>
      <section className="shell ex-section ex-selected">
        <div className="ex-section-top">
          <span className="eyebrow">02 / SELECTED WORK</span>
          <Link href="/work" className="text-link">
            The portfolio ↗
          </Link>
        </div>
        <CinematicWork projects={projects} />
      </section>
      <section className="ex-system-section">
        <div className="shell ex-section">
          <div className="ex-system-title" data-reveal>
            <span className="eyebrow">03 / THE BUILD SYSTEM</span>
            <h2>
              IDEAS
              <br />
              NEED
              <br />
              <em>SYSTEMS.</em>
            </h2>
            <p>
              One direction.
              <br />
              Every part connected.
            </p>
          </div>
          <AssemblyExperience />
          <div className="ex-practice-rail">
            {practices.map((p, i) => (
              <Link href={"/capabilities/" + p.id} key={p.id}>
                <span>0{i + 1}</span>
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="ex-builder-environment">
        <div className="shell ex-section ex-builder-product">
          <div data-reveal>
            <span className="eyebrow">04 / DWS COMPANY BUILDER</span>
            <h2>
              The first move.
              <br />
              <em>Made clear.</em>
            </h2>
            <p>
              Start with what you have. Define what you need. See a considered
              sequence for the company you want to build.
            </p>
            <Link href="/start-a-business/builder" className="button dark">
              Build your company ↗
            </Link>
          </div>
          <div className="ex-builder-window" data-reveal>
            <header>
              <BrandMarkLabel />
              <span className="eyebrow">01 — 07</span>
            </header>
            <span className="eyebrow">YOUR STARTING POINT</span>
            <h3>
              What are
              <br />
              we building?
            </h3>
            <div className="ex-window-options">
              <span>A new idea</span>
              <span>A growing company</span>
            </div>
            <div className="ex-window-roadmap">
              <span>IDEA</span>
              <span>BUILD</span>
              <span>GROW</span>
            </div>
            <Link href="/start-a-business/builder" className="text-link">
              Begin your build ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="shell ex-section ex-blueprint-section">
        <BlueprintProduct />
        <div data-reveal>
          <span className="eyebrow">05 / FOUNDER BLUEPRINT</span>
          <h2>
            Clarity.
            <br />
            <em>
              Before
              <br />
              commitment.
            </em>
          </h2>
          <p>
            A strategic engagement that makes the company tangible before major
            execution begins.
          </p>
          <strong className="ex-price">{founderBlueprint.priceLabel}</strong>
          <p className="small-note">
            Strategy and roadmap.
            <br />
            Execution scoped separately.
          </p>
          <Link href="/founder-blueprint" className="button">
            Explore the Blueprint ↗
          </Link>
        </div>
      </section>
      <section className="ex-automation-environment">
        <div className="shell ex-section">
          <div className="ex-automation-intro" data-reveal>
            <span className="eyebrow">06 / AI + AUTOMATION SYSTEMS</span>
            <h2>
              Behind the business.
              <br />
              <em>A better way to work.</em>
            </h2>
            <p>Connect the work. Keep the judgment.</p>
          </div>
          <LivingSystem />
          <Link href="/automation" className="text-link">
            Explore AI + Automation Systems ↗
          </Link>
        </div>
      </section>
      <CapabilityExperience />
      <section className="shell ex-section ex-gallery-invitation">
        <span className="eyebrow">THE CREATIVE ARCHIVE</span>
        <Link href="/work/archive">
          A wider field
          <br />
          <em>of expression.</em>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <ExperienceClosing />
    </div>
  );
}
function BrandMarkLabel() {
  return <span className="eyebrow">DYNASTY WORKS / COMPANY BUILDER</span>;
}
