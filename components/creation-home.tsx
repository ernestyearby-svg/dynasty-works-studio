import Link from "@/components/site-link";
import { OptimizedImage as Image } from "@/components/optimized-image";
import { MymosaReveal, CliffsReveal } from "@/components/editorial-work";
import { Foundry } from "@/components/foundry";
import { StageArchitecture } from "@/components/company-creation";
import { BrandSymbol } from "@/components/brand-symbol";
export function CreationHomepage() {
  return (
    <div className="v3-home">
      <section className="v3-declaration">
        <div className="v3-register">
          <p>COMPANY CREATION STUDIO</p>
          <span>STRATEGY THROUGH EXECUTION</span>
        </div>
        <h1>
          <span>FROM IDEA</span>
          <em>
            <span>TO</span> COMPANY.
          </em>
        </h1>
        <div className="v3-workline" aria-hidden="true">
          <BrandSymbol />
        </div>
        <div className="v3-declaration-foot">
          <p>
            Strategy. Identity. Product.
            <br />
            Technology. Market.
          </p>
          <Link href="/start-a-business/builder" className="text-link">
            BUILD YOUR COMPANY ↗
          </Link>
          <a href="#selected-work" className="text-link">
            EXPLORE THE WORK ↓
          </a>
        </div>
      </section>
      <MymosaReveal />
      <section className="v3-disciplines">
        <div>
          <p className="eyebrow">WHAT WE BUILD</p>
          <h2>
            One idea.
            <br />
            <em>Many dimensions.</em>
          </h2>
        </div>
        <div className="v3-discipline-list">
          {[
            ["Strategy", "/capabilities/start"],
            ["Identity", "/capabilities/brand"],
            ["Product", "/capabilities/build"],
            ["Technology", "/automation"],
            ["Market", "/capabilities/launch"],
          ].map(([label, href], i) => (
            <Link key={label} href={href}>
              <span>0{i + 1}</span>
              <span>{label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="v3-family">
        <div className="v3-register">
          <p>INSIDE THE SYSTEM</p>
          <span>MY DRINK FAMILY / BRAND ARCHITECTURE</span>
        </div>
        <div className="v3-family-grid">
          <Image
            src="/assets/portfolio/mymosa/identity/my-drink-family-seal-primary-light.svg"
            width={800}
            height={800}
            alt="Official My Drink Family master seal"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">ONE MASTER. SEVENTEEN HOUSE IDENTITIES.</p>
            <h2>
              More than
              <br />
              <em>a single mark.</em>
            </h2>
            <p>
              The individual product and the wider family speak the same
              language. Explore the original identity system.
            </p>
            <Link href="/work/mymosa#mm-family" className="text-link">
              EXPLORE THE FAMILY →
            </Link>
          </div>
        </div>
      </section>
      <Foundry />
      <CliffsReveal />
      <section className="v3-process">
        <div className="v3-register">
          <p>HOW WE BUILD</p>
          <span>FOUR STAGES. ONE CONNECTED COMPANY.</span>
        </div>
        <StageArchitecture />
        <Link href="/how-we-build" className="text-link">
          OUR APPROACH →
        </Link>
      </section>
      <section className="v3-builder-entry">
        <div className="v3-register">
          <p>COMPANY BUILDER</p>
          <span>FOUNDER DIAGNOSTIC + ROADMAP ENGINE</span>
        </div>
        <h2>
          BRING US
          <br />
          <em>THE IDEA.</em>
        </h2>
        <div className="v3-builder-bottom">
          <p>
            Answer a focused set of questions.
            <br />
            We’ll map what it takes to move forward.
          </p>
          <Link href="/start-a-business/builder" className="v3-entry-link">
            START YOUR ROADMAP <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <p className="v3-small">
          Need a deeper strategic engagement?{" "}
          <Link href="/founder-blueprint">Founder Blueprint — $1,500 →</Link>
        </p>
      </section>
      <section className="v3-studio-pair">
        <article>
          <p className="eyebrow">CONCEPT LAB / EXPERIMENTAL PRACTICE</p>
          <h2>
            What if
            <br />
            <em>comes first.</em>
          </h2>
          <p>
            A space for identity, product and packaging explorations. Clearly
            distinguished from commercial work.
          </p>
          <Link href="/concept-lab" className="text-link">
            THE CONCEPT LAB →
          </Link>
        </article>
        <article>
          <p className="eyebrow">DYNASTY WORKS / THE STUDIO</p>
          <h2>
            Independent thinking.
            <br />
            <em>Connected execution.</em>
          </h2>
          <p>
            We connect strategy, identity, product, technology and market. One
            studio, from the first question to the next move.
          </p>
          <Link href="/studio" className="text-link">
            MEET THE STUDIO →
          </Link>
          <Link href="/automation" className="text-link">
            AI + AUTOMATION SYSTEMS →
          </Link>
        </article>
      </section>
      <section className="v3-threshold">
        <p className="eyebrow">WE BUILD WHAT’S NEXT.</p>
        <Link href="/start-a-business/builder">
          <h2>
            WHAT ARE
            <br />
            <em>WE BUILDING?</em>
          </h2>
          <span>
            START A COMPANY <span aria-hidden="true">↗</span>
          </span>
        </Link>
      </section>
    </div>
  );
}
