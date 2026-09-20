"use client";
import { OptimizedImage } from "@legacy/components/optimized-image";
import { useState } from "react";
import type { Media } from "@legacy/data/projects";
export function BeforeAfter({
  before,
  after,
}: {
  before: Media;
  after: Media;
}) {
  const [value, setValue] = useState(50);
  return (
    <figure className="comparison">
      <div className="comparison-images">
        <OptimizedImage
          src={before.src}
          srcSet={before.srcSet}
          alt={before.alt}
          loading="lazy"
          width={1536}
          height={1024}
        />
        <OptimizedImage
          src={after.src}
          srcSet={after.srcSet}
          alt={after.alt}
          width={1536}
          height={1024}
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        />
      </div>
      <label>
        Before / after comparison
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Reveal after image"
        />
      </label>
    </figure>
  );
}
