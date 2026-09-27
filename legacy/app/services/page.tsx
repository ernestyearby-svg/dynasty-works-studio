import {
  PageIntro,
  ServiceGrid,
  ProcessTimeline,
  FinalCTA,
  SectionHeading,
} from "@legacy/components/studio";
import { PracticeGrid, MarketEntry } from "@legacy/components/company-sections";
export const metadata = {
  title: "Studio Disciplines",
  description:
    "Eight connected practices: company strategy and formation coordination, brand, digital build, launch, distribution preparation, activation, growth and publishing.",
  alternates: { canonical: "/services" },
};
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="EIGHT PRACTICES / ONE STUDIO"
        title="Built around the whole company."
        description="Start with the opportunity. Build the identity and infrastructure. Prepare for the market and keep moving forward."
      />
      <section className="shell capabilities-page">
        <PracticeGrid />
        <details className="specialist-disciplines" id="specialist-disciplines">
          <summary>
            <span>Explore our specialist disciplines</span>
            <span>12 disciplines +</span>
          </summary>
          <ServiceGrid />
        </details>
      </section>
      <MarketEntry />
      <section className="shell section">
        <SectionHeading
          number="01–06"
          label="HOW WE WORK"
          title="One connected process."
        />
        <ProcessTimeline />
      </section>
      <FinalCTA />
    </>
  );
}
