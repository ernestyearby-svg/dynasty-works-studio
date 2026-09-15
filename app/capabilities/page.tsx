import { AutomationFeature } from "@/components/automation";
import { PageIntro, FinalCTA } from "@/components/studio";
import { PracticeCatalog, CommercialPaths } from "@/components/service-catalog";
export const metadata = {
  title: "Capabilities",
  description:
    "Explore eight connected studio practices, from company foundations to brand, digital, market activation and growth.",
  alternates: { canonical: "/capabilities" },
};
export default function Capabilities() {
  return (
    <>
      <PageIntro
        eyebrow="ONE STUDIO / EIGHT PRACTICES"
        title="The right expertise. In the right order."
        description="Start with one specific need or connect the disciplines around a complete company build. Explore each practice at your own pace."
      />
      <section className="shell section">
        <PracticeCatalog />
      </section>
      <AutomationFeature />
      <CommercialPaths />
      <FinalCTA />
    </>
  );
}
