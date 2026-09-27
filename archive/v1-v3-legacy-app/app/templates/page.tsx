import Link from "@/components/site-link";
import { PageIntro, FinalCTA } from "@/components/studio";
import { TemplateCatalog } from "@/components/template-catalog";
import { content } from "@/lib/content";
export const metadata = {
  title: "Founder Tools & Templates",
  description:
    "A working brief, a personalized company roadmap and a strategic Blueprint for your next move.",
  alternates: { canonical: "/templates" },
};
export default async function Templates() {
  const available = (await content.listTemplates()).filter(
    (t) => t.status !== "placeholder",
  );
  return (
    <div className="v2-page">
      <PageIntro
        eyebrow="FOUNDER TOOLS"
        title="Give the idea a starting point."
        description="Organize what you know. Identify what needs to happen next."
      />
      <section className="shell section resource-grid">
        <article>
          <p className="eyebrow">01 / WORKSHEET</p>
          <h2>The working brief.</h2>
          <p>
            A blank worksheet for the idea, audience, build, launch and next
            move.
          </p>
          <a
            className="text-link"
            href="/downloads/founder-working-brief.txt"
            download
          >
            DOWNLOAD THE WORKSHEET ↓
          </a>
        </article>
        <article>
          <p className="eyebrow">02 / COMPANY BUILDER</p>
          <h2>A clearer roadmap.</h2>
          <p>
            A focused diagnostic that turns your answers into recommended phases
            and a downloadable roadmap.
          </p>
          <Link className="text-link" href="/start-a-business/builder">
            BUILD YOUR ROADMAP →
          </Link>
        </article>
        <article>
          <p className="eyebrow">03 / STRATEGIC ENGAGEMENT</p>
          <h2>Founder Blueprint.</h2>
          <p>
            A structured company-development plan before full execution. $1,500.
            Execution scoped separately.
          </p>
          <Link className="text-link" href="/founder-blueprint">
            EXPLORE THE BLUEPRINT →
          </Link>
        </article>
      </section>
      {available.length > 0 && (
        <section className="shell section">
          <TemplateCatalog products={available} />
        </section>
      )}
      <FinalCTA />
    </div>
  );
}
