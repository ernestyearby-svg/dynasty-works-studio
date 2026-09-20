"use client";
import { useEffect } from "react";
import Link from "@/components/site-link";
import { recordStudioEvent, type StudioEventName } from "@/lib/analytics";
export function BlueprintEvent({ name }: { name: StudioEventName }) {
  useEffect(() => {
    recordStudioEvent({ name, route: "/founder-blueprint" });
  }, [name]);
  return null;
}
export function BlueprintCTA({
  children = "Start my Blueprint",
  href = "/founder-blueprint/intake",
  className = "button dark",
}: {
  children?: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        recordStudioEvent({
          name: "founder_blueprint_cta_clicked",
          route: href,
        });
        if (href.endsWith("/intake"))
          recordStudioEvent({ name: "founder_blueprint_started", route: href });
      }}
    >
      {children} ↗
    </Link>
  );
}
