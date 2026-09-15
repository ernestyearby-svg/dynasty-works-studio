import Link from "@/components/site-link";
import { site } from "@/data/site";
import { PageIntro, FinalCTA, MediaFrame } from "@/components/studio";
export const metadata = {
  title: "Studio",
  description:
    "An integrated creative and technology practice that connects strategy to execution.",
  alternates: { canonical: "/studio" },
};
export default function Studio() {
  return (
    <>
      <PageIntro
        eyebrow="THE STUDIO / 03"
        title="Independent minds. Connected thinking."
        description="Dynasty Works Studio brings creative direction and technical execution into one practice."
      />
      <div className="studio-image shell">
        <MediaFrame
          image={{
            src: site.hero.image,
            alt: "Original studio concept: sculptural brushed aluminum ribbon illuminated against a black background.",
            caption: "A study in form, material and possibility.",
          }}
          priority
        />
      </div>
      <section className="statement shell section">
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
      <FinalCTA />
    </>
  );
}
