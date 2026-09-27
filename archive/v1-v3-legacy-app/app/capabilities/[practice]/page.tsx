import { notFound } from "next/navigation";
import { practices } from "@/data/practices";
import { PageIntro, FinalCTA } from "@/components/studio";
import {
  PracticeCatalog,
  PracticeWork,
  practiceAudiences,
} from "@/components/service-catalog";
import Link from "@/components/site-link";
type Props = { params: Promise<{ practice: string }> };
export async function generateMetadata({ params }: Props) {
  const { practice } = await params;
  const p = practices.find((p) => p.id === practice);
  return {
    title: p ? `${p.title} — Capabilities` : "Practice not found",
    description: p ? practiceAudiences[p.id] : undefined,
    alternates: { canonical: "/capabilities/" + practice },
  };
}
export default async function PracticePage({ params }: Props) {
  const { practice } = await params;
  const p = practices.find((p) => p.id === practice);
  if (!p) notFound();
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
