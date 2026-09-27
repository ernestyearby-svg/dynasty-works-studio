import { PageIntro, FinalCTA } from "@/components/studio";
import Link from "@/components/site-link";
export const metadata = {
  title: "Concept Lab — Explorations",
  description:
    "An experimental space for identity, packaging, products, fashion and technology. Concepts are clearly separated from commissioned work.",
  alternates: { canonical: "/concept-lab" },
};
export default function ConceptLab() {
  return (
    <div className="v2-page v2-lab">
      <PageIntro
        eyebrow="CONCEPT LAB / EXPERIMENTAL PRACTICE"
        title="Room for what could be."
        description="A place to explore an identity, an object or a possible future. Speculative work is always identified as such."
      />
      <section className="shell v2-lab-body">
        <div className="v2-lab-index">
          {[
            "Spirits",
            "Packaging",
            "Identity",
            "Products",
            "Fashion",
            "Technology",
            "Future Concepts",
          ].map((s, i) => (
            <div key={s}>
              <span className="eyebrow">0{i + 1}</span>
              <h2>{s}</h2>
            </div>
          ))}
        </div>
        <aside>
          <p className="eyebrow">THE PRACTICE</p>
          <h2>Explore before you commit.</h2>
          <p>
            Test a direction through identity studies, product visualizations
            and packaging explorations. Define the question, develop the idea
            and review what is worth taking further.
          </p>
          <Link href="/work" className="text-link">
            VIEW SELECTED WORK →
          </Link>
          <details>
            <summary>How work is classified</summary>
            <dl>
              <dt>CONCEPT</dt>
              <dd>A speculative direction.</dd>
              <dt>BRAND EXPLORATION</dt>
              <dd>
                An identity study, separate from commissioned production work.
              </dd>
              <dt>PRODUCT EXPLORATION</dt>
              <dd>A proposed object or experience.</dd>
              <dt>PACKAGING EXPLORATION</dt>
              <dd>A packaging study, not evidence of a released product.</dd>
            </dl>
          </details>
        </aside>
      </section>
      <FinalCTA />
    </div>
  );
}
