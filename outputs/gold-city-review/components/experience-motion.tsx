"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
const query = "(prefers-reduced-motion: reduce)";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const snapshot = () => window.matchMedia(query).matches;
/** Content is visible without JS. Device preferences always take precedence. */
export function ExperienceMotion() {
  const systemReduced = useSyncExternalStore(subscribe, snapshot, () => true);
  const [manualReduced, setManualReduced] = useState(false);
  const reduced = systemReduced || manualReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "standard";
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.removeAttribute("data-entered"));
    if (reduced || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-entered", "true");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduced]);
  return (
    <button
      type="button"
      className="ex-motion-toggle"
      aria-pressed={reduced}
      disabled={systemReduced}
      onClick={() => setManualReduced((v) => !v)}
    >
      {systemReduced
        ? "Reduced motion · device setting"
        : reduced
          ? "Motion: reduced"
          : "Reduce motion"}
    </button>
  );
}
