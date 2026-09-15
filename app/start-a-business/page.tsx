import Link from "@/components/site-link";
import { companyCopy } from "@/data/company-builder";
import {
  CompanyJourney,
  MarketEntry,
  EngagementLevels,
  ProfessionalBoundary,
} from "@/components/company-sections";
import { FounderPathways } from "@/components/founder-pathways";
import { FinalCTA } from "@/components/studio";
export const metadata = {
  title: "Start a Business",
  description:
    "From concept to company: strategy, formation coordination, branding, digital infrastructure, launch, distribution preparation and growth.",
  alternates: { canonical: "/start-a-business" },
};
export default function StartBusiness() {
  return (
    <>
      <section className="business-hero shell">
        <div className="eyebrow hero-top">
          HAVE AN IDEA?<span>DIGITAL + PHYSICAL + MARKET</span>
        </div>
        <h1>
          We’ll help build
          <br />
          the company
          <br />
          around <em>it.</em>
        </h1>
        <div className="business-hero-bottom">
          <p>{companyCopy.heroDescription}</p>
          <div>
            <Link href="/start-a-business/builder" className="button light">
              Build my company ↗
            </Link>
            <Link href="#journey" className="text-link">
              Explore the process ↓
            </Link>
          </div>
        </div>
        <span className="business-hero-note">
          STRATEGY → FORMATION → BRAND → BUILD → LAUNCH → GROWTH
        </span>
      </section>
      <FounderPathways />
      <section id="journey" className="shell section journey-section">
        <div className="section-title">
          <span className="eyebrow">ONE CONNECTED SYSTEM</span>
          <h2>From concept to company.</h2>
        </div>
        <p className="section-description">
          Start where you are. Follow the stages your business needs. Open a
          stage to explore its scope.
        </p>
        <CompanyJourney />
        <ProfessionalBoundary />
      </section>
      <MarketEntry />
      <section className="shell section">
        <div className="section-title">
          <span className="eyebrow">WAYS TO WORK TOGETHER</span>
          <h2>Your pace. Your level of support.</h2>
        </div>
        <EngagementLevels />
      </section>
      <section className="shell section">
        <span className="eyebrow">THE FIRST ENGAGEMENT</span>
        <h2>Founder Blueprint · $1,500</h2>
        <p className="section-description">
          A strategy session, research and a reviewed company-development
          roadmap before major execution begins.
        </p>
        <Link href="/founder-blueprint" className="button dark">
          Explore Founder Blueprint ↗
        </Link>
      </section>
      <FinalCTA />
    </>
  );
}
