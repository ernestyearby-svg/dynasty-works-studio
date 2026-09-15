import { content } from "@/lib/content";
import { templateCategories } from "@/data/templates";
import { PageIntro, FinalCTA } from "@/components/studio";
import { TemplateCatalog } from "@/components/template-catalog";
export const metadata = {
  title: "Templates & Digital Assets",
  description:
    "The future home of Dynasty Works Studio templates, brand kits and digital assets.",
  alternates: { canonical: "/templates" },
};
export default async function Templates() {
  return (
    <>
      <PageIntro
        eyebrow="TOOLS FOR WHAT’S NEXT / 04"
        title="Good thinking. Ready to build on."
        description="Templates, assets and creative systems. A future collection of useful starting points, made with the same care as our custom work."
      />
      <section className="shell section catalog">
        <p className="content-note">
          Collection preview · These are planned categories, not available
          products. No purchases or downloads are currently offered.
        </p>
        <TemplateCatalog products={await content.listTemplates()} />
        <div className="future-categories">
          <span className="eyebrow">ON THE DRAWING BOARD</span>
          <p>{templateCategories.join(" / ")}</p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
