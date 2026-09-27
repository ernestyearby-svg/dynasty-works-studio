"use client";
import { useState } from "react";
import {
  type ArchiveCategory,
  type ArchiveEntry,
} from "@/data/creative-direction";
import Link from "@/components/site-link";
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
        {["All", ...Array.from(new Set(entries.map((e) => e.category)))].map(
          (c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c as ArchiveCategory | "All")}
            >
              {c}
            </button>
          ),
        )}
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
              {e.projectSlug && (
                <Link href={"/work/" + e.projectSlug} className="text-link">
                  Explore the project →
                </Link>
              )}
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
