import { EngagementPaths } from "@/components/studio-upgrade";
import Link from "@/components/site-link";
import { MasterEnvironment } from "@/components/master-home";
import { CompanySystem } from "@/components/company-system";
import {
  StageArchitecture,
  DigitalSystemsFeature,
} from "@/components/company-creation";
import { BlueprintProduct } from "@/components/experience-interactive";
import { BrandSymbol } from "@/components/brand-symbol";
import { founderBlueprint } from "@/data/founder-blueprint";
export function CreationHomepage() {
  return (
    <div className="v2-home">
      <section className="v2-hero">
        <MasterEnvironment name="DWS-ARCH-01" hero />
        <div className="shell">
          <p className="eyebrow">COMPANY CREATION STUDIO</p>
          <h1>
            FROM IDEA
            <br />
            <em>TO COMPANY.</em>
          </h1>
          <p className="v2-hero-support">
            Strategy. Identity. Product. Technology. Market.
          </p>
          <div className="v2-actions">
            <Link href="/start-a-business/builder" className="button light">
              BUILD YOUR COMPANY →
            </Link>
            <Link href="/work" className="text-link">
              EXPLORE THE WORK
            </Link>
          </div>
          <p className="v2-hero-foot">ONE STUDIO. FROM FIRST MOVE TO MARKET.</p>
        </div>
      </section>
      <section className="v2-system shell" id="the-system">
        <div className="v2-section-heading">
          <div>
            <p className="eyebrow">01 / THE SYSTEM</p>
            <h2>
              A COMPANY
              <br />
              <em>IS A SYSTEM.</em>
            </h2>
          </div>
          <p>
            Identity, product, technology, market and operations depend on each
            other. Dynasty Works connects the pieces.
          </p>
        </div>
        <CompanySystem />
      </section>
      <section className="v2-stage-section shell">
        <p className="eyebrow">02 / HOW WE BUILD</p>
        <h2>
          Four stages.
          <br />
          <em>One connected company.</em>
        </h2>
        <StageArchitecture />
        <Link href="/how-we-build" className="text-link">
          SEE HOW WE BUILD →
        </Link>
      </section>
      <section className="v2-builder shell">
        <div>
          <p className="eyebrow">03 / COMPANY BUILDER</p>
          <h2>
            BRING US
            <br />
            <em>THE IDEA.</em>
          </h2>
          <p>
            Answer a focused set of questions. We’ll map what it takes to move
            the idea toward a company.
          </p>
          <p className="small-note">
            Founder diagnostic + company roadmap. A considered starting point,
            not a quote.
          </p>
          <Link href="/start-a-business/builder" className="button dark">
            START YOUR COMPANY ROADMAP →
          </Link>
        </div>
        <div
          className="v2-roadmap-preview"
          aria-label="Company roadmap format preview"
        >
          <BrandSymbol />
          <p className="eyebrow">DYNASTY WORKS / COMPANY BUILDER</p>
          <h3>
            Your company.
            <br />
            <em>A clearer next move.</em>
          </h3>
          <ol>
            {["DEFINE", "BUILD", "LAUNCH", "SCALE"].map((s, i) => (
              <li key={s}>
                <span>0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="small-note">YOUR NEXT STEPS, ORGANIZED.</p>
        </div>
      </section>
      <EngagementPaths />
      <DigitalSystemsFeature />
      <section className="v2-lab-teaser shell">
        <p className="eyebrow">05 / CONCEPT LAB</p>
        <h2>
          See what
          <br />
          <em>could take shape.</em>
        </h2>
        <p>
          Photorealistic identity, packaging and product studies. An experimental
          space, clearly separated from commissioned work.
        </p>
        <Link href="/concept-lab" className="text-link">
          EXPLORE VISUAL STUDIES →
        </Link>
      </section>
      <section className="master-blueprint shell">
        <div>
          <p className="eyebrow">06 / FOUNDER BLUEPRINT</p>
          <h2>
            THE COMPANY.
            <br />
            <em>ON PAPER.</em>
          </h2>
          <p>
            A paid strategic engagement for founders who need a structured
            company-development roadmap before full execution.
          </p>
          <strong>{founderBlueprint.priceLabel}</strong>
          <p className="small-note">
            Strategy and roadmap. Execution scoped separately.
          </p>
          <Link href="/founder-blueprint" className="text-link">
            EXPLORE THE BLUEPRINT →
          </Link>
        </div>
        <BlueprintProduct />
      </section>
      <section className="master-closing">
        <MasterEnvironment name="DWS-FINAL-01" />
        <div className="shell master-closing-inner">
          <div>
            <p className="eyebrow">FROM FIRST MOVE TO MARKET.</p>
            <h2>
              BUILD WHAT
              <br />
              <em>COMES NEXT.</em>
            </h2>
          </div>
          <Link href="/start-a-business/builder" className="button light">
            BUILD YOUR COMPANY →
          </Link>
        </div>
      </section>
    </div>
  );
}


