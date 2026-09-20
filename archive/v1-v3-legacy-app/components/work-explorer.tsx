"use client";
import { useState, useEffect } from "react";
import { categories, type Category, type Project } from "@/data/projects";
import { CinematicWork } from "@/components/digital-experience";
export function WorkExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category>("All");
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: unknown,
          ) => Promise<void> | void;
        };
      }
    ).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: "filter_portfolio",
            description: "Filter approved portfolio projects by discipline.",
            inputSchema: {
              type: "object",
              properties: {
                category: { type: "string", enum: [...categories] },
              },
              required: ["category"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false },
            execute: async (input: unknown) => {
              const category = (input as { category?: unknown })?.category;
              if (
                typeof category !== "string" ||
                !categories.includes(category as Category)
              )
                throw new Error("Choose a listed category.");
              setActive(category as Category);
              await new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              );
              return {
                category,
                projects: projects
                  .filter(
                    (p) =>
                      category === "All" ||
                      p.category.includes(category as Category),
                  )
                  .map((p) => p.title),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [projects]);
  const filtered = projects.filter(
    (p) => active === "All" || p.category.includes(active),
  );
  return (
    <>
      <div
        className="filters"
        role="group"
        aria-label="Filter work by discipline"
      >
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={active === c}
            className={active === c ? "active" : ""}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="work-count" aria-live="polite">
        {String(filtered.length).padStart(2, "0")} projects / {active}
      </div>
      {filtered.length ? (
        <CinematicWork projects={filtered} />
      ) : (
        <div className="empty-state">
          <h2>More work is taking shape.</h2>
          <p>No approved projects have been added in this category yet.</p>
          <button className="button" onClick={() => setActive("All")}>
            Explore all work ↗
          </button>
        </div>
      )}
    </>
  );
}
