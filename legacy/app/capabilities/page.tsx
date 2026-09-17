import { PageIntro, FinalCTA } from "@legacy/components/studio";
import {
  StageArchitecture,
  DigitalSystemsFeature,
} from "@legacy/components/company-creation";
import { PracticeCatalog, CommercialPaths } from "@legacy/components/service-catalog";
export const metadata = {
  title: "Company Creation Capabilities",
  description:
    "Explore company strategy, brand and packaging design, product development, websites and applications, launch and automation through four connected stages.",
  alternates: { canonical: "/capabilities" },
};
export default function Capabilities() {
  return (
    <div className="v2-page">
      <PageIntro
        eyebrow="DEFINE / BUILD / LAUNCH / SCALE"
        title="The right capability. At the right stage."
        description="Four stages organize the work. Open a stage to discover what it involves, then explore the disciplines behind it."
      />
      <section className="shell v2-stage-section">
        <StageArchitecture />
        <details className="v2-deep-catalog">
          <summary>Explore all eight specialist practices</summary>
          <PracticeCatalog />
        </details>
      </section>
      <DigitalSystemsFeature />
      <CommercialPaths />
      <FinalCTA />
    </div>
  );
}
