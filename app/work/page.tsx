import Link from "@/components/site-link";
import { content } from "@/lib/content";
import { PageIntro, FinalCTA } from "@/components/studio";
import { WorkExplorer } from "@/components/work-explorer";
export const metadata = {
  title: "Work",
  description:
    "Explore the evolving Dynasty Works Studio portfolio across brand, packaging, digital and experiences.",
  alternates: { canonical: "/work" },
};
export default async function Work() {
  return (
    <>
      <PageIntro
        eyebrow="THE PORTFOLIO / 01"
        title="Work, in every dimension."
        description="Ideas made visible. Systems made useful. A growing collection of creative and technical work."
      />
      <section className="shell work-section">

        <WorkExplorer projects={await content.listProjects()} /><Link className="text-link" href="/work/archive">The creative archive ↗</Link>
      </section>
      <FinalCTA />
    </>
  );
}
