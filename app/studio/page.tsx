import { CreationNetwork } from "@/components/company-creation";
import Link from "@/components/site-link";
import { site } from "@/data/site";
import { PageIntro, FinalCTA } from "@/components/studio";
export const metadata = {
  title: "Studio",
  description:
    "A company creation studio connecting strategy, identity, product, technology and market.",
  alternates: { canonical: "/studio" },
};
export default function Studio() {
  return (
    <>
      <PageIntro
        eyebrow="COMPANY CREATION STUDIO"
        title="An idea rarely needs only one thing."
        description="One studio. From first move to market. We connect the work required to turn an idea into a functioning company."
      />

      <section id="about" className="statement shell section">
        <span className="eyebrow">OUR POINT OF VIEW</span>
        <h2>{site.statement}</h2>
        <div>
          <p>{site.description}</p>
          <Link href="/services" className="text-link">
            Explore our capabilities ↗
          </Link>
        </div>
      </section>
      <section className="studio-principles shell section">
        {[
          [
            "Think beyond the brief.",
            "Start with the problem behind the request. Find the opportunity that makes the work matter.",
          ],
          [
            "Make the parts work together.",
            "Connect identity, experience and technology so every touchpoint feels like part of the same idea.",
          ],
          [
            "Carry it through.",
            "Move from a direction on paper to a considered, working expression in the world.",
          ],
        ].map(([title, body], i) => (
          <article key={title}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <CreationNetwork />
      <FinalCTA />
    </>
  );
}
