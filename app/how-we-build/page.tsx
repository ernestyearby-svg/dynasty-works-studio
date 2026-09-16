import { PageIntro, FinalCTA } from "@/components/studio";
import {
  StageArchitecture,
  CreationNetwork,
} from "@/components/company-creation";
import { CompanySystem } from "@/components/company-system";
import { Foundry } from "@/components/foundry";
export const metadata = {
  title: "How We Build — Define, Build, Launch, Scale",
  description:
    "Four connected stages from idea to company: strategy, identity, product, digital infrastructure, market preparation and operational growth.",
  alternates: { canonical: "/how-we-build" },
};
export default function HowWeBuild() {
  return (
    <div className="v2-page">
      <PageIntro
        eyebrow="COMPANY CREATION STUDIO / THE METHOD"
        title="From first move to market."
        description="Define the direction. Build the company. Prepare the launch. Strengthen what comes next. Start at the stage your business needs."
      />
      <Foundry />
      <section className="shell v2-stage-section">
        <StageArchitecture expanded />
      </section>
      <section className="v2-system shell">
        <p className="eyebrow">A COMPANY IS A SYSTEM</p>
        <h2>
          The connections
          <br />
          <em>matter.</em>
        </h2>
        <CompanySystem />
      </section>
      <CreationNetwork />
      <FinalCTA />
    </div>
  );
}
