"use client";
import { useState } from "react";
import {
  archiveCategories,
  type ArchiveCategory,
  type ArchiveEntry,
} from "@/data/creative-direction";
import { MediaFrame } from "@/components/studio";
export function CreativeArchive({ entries }: { entries: ArchiveEntry[] }) {
  const [category, setCategory] = useState<ArchiveCategory | "All">("All");
  const visible = entries.filter(
    (e) =>
      e.approval.approved &&
      e.approval.reference.trim() &&
      (category === "All" || e.category === category),
  );
  return (
    <>
      <div
        className="filters"
        role="group"
        aria-label="Filter creative archive"
      >
        {["All", ...archiveCategories].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c as ArchiveCategory | "All")}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="eyebrow" aria-live="polite">
        {visible.length} works / {category}
      </p>
      {visible.length ? (
        <div className="dw-archive-grid">
          {visible.map((e) => (
            <article key={e.id}>
              <MediaFrame image={e.media} />
              <h2>{e.title}</h2>
              <p>{e.category}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="dw-archive-empty">
          <h2>
            A wider field
            <br />
            <em>of expression.</em>
          </h2>
          <p>
            The archive will bring together selected creative work across
            disciplines. This collection is being curated for release.
          </p>
        </div>
      )}
    </>
  );
}
