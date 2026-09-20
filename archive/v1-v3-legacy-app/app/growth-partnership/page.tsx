import { PageIntro, FinalCTA } from "@/components/studio";
import Link from "@/components/site-link";
import { growthPartnerships, preliminaryNotice } from "@/data/packages";
export const metadata = {
  title: "Growth Partnerships",
  description:
    "Explore ongoing creative, digital, content, automation and growth support with scope defined through review.",
  alternates: { canonical: "/growth-partnership" },
};
export default function Growth() {
  return (
    <>
      <PageIntro
        eyebrow="BEYOND THE FIRST LAUNCH"
        title="Build momentum. Keep improving."
        description="Five starting points for an ongoing partnership. We review priorities, capacity and cadence together before defining the engagement."
      />
      <section className="shell section">
        <div className="growth-partners">
          {growthPartnerships.map((p) => (
            <article key={p.id}>
              <span className="eyebrow">ONGOING SUPPORT</span>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <Link
                href="/start-a-business/builder?pathway=growth"
                className="text-link"
              >
                Explore a growth roadmap ↗
              </Link>
            </article>
          ))}
        </div>
        <p className="professional-boundary">
          {preliminaryNotice} No recurring plan, billing or delivery commitment
          is active.
        </p>
      </section>
      <FinalCTA />
    </>
  );
}
