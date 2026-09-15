import {
  PageIntro,
  ServiceGrid,
  ProcessTimeline,
  FinalCTA,
  SectionHeading,
} from "@/components/studio";
export const metadata = {
  title: "Capabilities",
  description:
    "Strategy, branding, packaging, web, applications, AI, visualization and creative production.",
  alternates: { canonical: "/services" },
};
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="WHAT WE DO / 02"
        title="Built around the whole idea."
        description="A multidisciplinary practice connecting the thinking, the making and the technology. Bring us one challenge or the entire picture."
      />
      <section className="shell capabilities-page">
        <ServiceGrid />
      </section>
      <section className="shell section">
        <SectionHeading
          number="01–06"
          label="FROM IDEA TO EXECUTION"
          title="One connected process."
        />
        <ProcessTimeline />
      </section>
      <FinalCTA />
    </>
  );
}
