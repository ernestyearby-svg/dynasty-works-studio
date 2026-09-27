import { PageIntro, FinalCTA } from "@/components/studio";
import { CreativeArchive } from "@/components/creative-archive";
import { archiveEntries } from "@/data/creative-direction";
export const metadata = {
  title: "Creative Archive",
  description:
    "A curated field of creative work across identity, packaging, digital, fashion and experiences.",
  alternates: { canonical: "/work/archive" },
};
export default function Archive() {
  return (
    <>
      <PageIntro
        eyebrow="THE CREATIVE ARCHIVE"
        title="Beyond a single discipline."
        description="A closer look at the ideas, objects and experiences that make up the work."
      />
      <section className="shell section">
        <CreativeArchive
          entries={archiveEntries.filter(
            (e) => e.approval.approved && e.approval.reference.trim(),
          )}
        />
      </section>
      <FinalCTA />
    </>
  );
}
