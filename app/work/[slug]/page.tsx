import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { content } from "@/lib/content";
import {
  ProjectArtwork,
  CaseStudySection,
  ProjectGallery,
  CaseModuleView,
  VideoFrame,
  FinalCTA,
} from "@/components/studio";
export async function generateStaticParams() {
  return (await content.listProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await content.getProject(slug);
  return p
    ? {
        title: p.title,
        description: p.shortDescription,
        alternates: { canonical: `/work/${slug}` },
        openGraph: {
          title: p.title,
          description: p.shortDescription,
          images: p.heroImage ? [p.heroImage.src] : [],
        },
        twitter: {
          title: p.title,
          description: p.shortDescription,
          images: p.heroImage ? [p.heroImage.src] : [],
        },
      }
    : { title: "Project not found" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await content.getProject(slug);
  if (!p) notFound();
  const all = await content.listProjects();
  const next =
    all[(all.findIndex((item) => item.slug === slug) + 1) % all.length];
  return (
    <>
      <section className="case-intro shell">
        <Link className="text-link" href="/work">
          ← All work
        </Link>
        <div className="case-title">
          <h1>{p.title}</h1>
          <span className="eyebrow">
            {p.status === "placeholder"
              ? "PROJECT PREVIEW / CONTENT PENDING"
              : p.category.join(" / ")}
          </span>
        </div>
        <div className="project-facts">
          {[
            ["Client", p.client || "Awaiting approval"],
            ["Industry", p.industries.join(", ")],
            ["Year", p.year?.toString() || "To confirm"],
            ["Services", p.services.join(", ")],
          ].map(([label, value]) => (
            <div key={label}>
              <span className="eyebrow">{label}</span>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="shell case-hero">
        <ProjectArtwork project={p} priority />
      </div>
      <div className="shell case-body">
        {p.status === "placeholder" && (
          <p className="content-note">
            Concept placeholder · The presentation shown here is illustrative
            and is not an approved client deliverable. No project results are
            claimed.
          </p>
        )}
        <CaseStudySection title="Overview">
          <p>{p.shortDescription}</p>
        </CaseStudySection>
        {p.challenge && (
          <CaseStudySection title="The challenge">
            <p>{p.challenge}</p>
          </CaseStudySection>
        )}
        {p.strategy && (
          <CaseStudySection title="The strategy">
            <p>{p.strategy}</p>
          </CaseStudySection>
        )}
        {p.execution && (
          <CaseStudySection title="The solution">
            <p>{p.execution}</p>
          </CaseStudySection>
        )}
        {p.modules.map((module, i) => (
          <CaseModuleView key={i} module={module} />
        ))}
        {p.gallery.length > 0 && <ProjectGallery images={p.gallery} />}{" "}
        {p.heroVideo && p.heroImage && (
          <VideoFrame
            src={p.heroVideo}
            poster={p.heroImage}
            title={p.title + " film"}
          />
        )}
        <CaseStudySection title="Final deliverables">
          {p.deliverables.length ? (
            <ul>
              {p.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : (
            <p>
              Approved deliverables will be added with the complete case study.
            </p>
          )}
        </CaseStudySection>
        <CaseStudySection title="Outcome">
          <p>
            {p.outcome ||
              "The project story and verified outcomes are awaiting approval."}
          </p>
        </CaseStudySection>
        <Link className="next-project" href={`/work/${next.slug}`}>
          <span className="eyebrow">NEXT PROJECT</span>
          <h2>{next.title} ↗</h2>
        </Link>
      </div>
      <FinalCTA />
    </>
  );
}

