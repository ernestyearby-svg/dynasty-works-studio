import { PageIntro, FinalCTA } from "@/components/studio";
import { MymosaReveal, CliffsReveal } from "@/components/editorial-work";
import { WorkExplorer } from "@/components/work-explorer";
import { content } from "@/lib/content";
import Link from "@/components/site-link";
export const metadata = {
  title: "Company Creation — Selected Work",
  description:
    "Explore company-building systems through approved brand, packaging, product and digital work. Each project retains its own identity.",
  alternates: { canonical: "/work" },
};
export default async function Work() {
  return (
    <div className="v3-home v3-work-index">
      <PageIntro
        eyebrow="SELECTED WORK / COMPANY CREATION"
        title="Work, in its many forms."
        description="Identity, packaging and digital experiences. Explore the work through the systems behind it."
      />
      <MymosaReveal />
      <CliffsReveal />
      <section className="shell v2-work-page">
        <details className="v2-deep-catalog">
          <summary>Browse published work by discipline</summary>
          <WorkExplorer projects={await content.listProjects()} />
        </details>
        <Link href="/concept-lab" className="text-link">
          EXPLORE CONCEPT LAB →
        </Link>
      </section>
      <FinalCTA />
    </div>
  );
}
