import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(process.env.INDEXING_ENABLED === "true"
        ? { allow: "/", disallow: ["/api/", "/creative-review", "/founder-blueprint/intake"] }
        : { disallow: "/" }),
    },
    sitemap: site.origin + "/sitemap.xml",
  };
}
