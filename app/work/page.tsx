import { PageIntro, FinalCTA } from "@/components/studio";
import { FlagshipWork } from "@/components/company-creation";
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
    <div className="v2-page">
      <PageIntro
        eyebrow="SELECTED WORK / COMPANY CREATION"
        title="Different companies. Connected thinking."
        description="A brand ecosystem. A fashion house. A physical product. A hospitality platform. Each calls for a different system."
      />
      <section className="shell v2-work-page">
        <FlagshipWork full />
        <p className="small-note">
          Classifications describe the editorial direction for each case study.
          Only approved source material and verified scope appear in published
          cases; forthcoming disciplines are not completed-work claims.
        </p>
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
