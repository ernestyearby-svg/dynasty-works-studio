
import { practices } from "@legacy/data/practices";
import { PageIntro, FinalCTA } from "@legacy/components/studio";
import {
  PracticeCatalog,
  PracticeWork,
  practiceAudiences,
} from "@legacy/components/service-catalog";
import Link from "@legacy/components/site-link";
export default function PracticePage() { const practice=window.location.pathname.split("/")[2];
  const p = practices.find((p) => p.id === practice);
  if (!p) return <PageIntro eyebrow="404" title="Page not found." description="Return to the studio."/>;
  return (
    <>
      <PageIntro
        eyebrow={"CAPABILITIES / " + p.title.toUpperCase()}
        title={p.tagline}
        description={practiceAudiences[p.id]}
      />
      <div className="shell">
        <PracticeCatalog id={p.id} />
        <PracticeWork id={p.id} />
        <section className="section">
          <span className="eyebrow">CONNECTED PRACTICES</span>
          <div className="catalog-next">
            {p.related.map((id) => (
              <Link href={"/capabilities/" + id} className="text-link" key={id}>
                {practices.find((x) => x.id === id)!.title} ↗
              </Link>
            ))}
          </div>
        </section>
      </div>
      <FinalCTA />
    </>
  );
}
