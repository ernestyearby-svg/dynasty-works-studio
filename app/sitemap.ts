import { practices } from "@/data/practices";
import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { content } from "@/lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    "/",
    "/work",
    "/work/archive",
    "/start-a-business",
    "/services",
    "/capabilities",
    "/automation",
    "/founder-blueprint",
    "/growth-partnership",
    ...practices.map((p) => "/capabilities/" + p.id),
    "/studio",
    "/templates",
    "/contact",
    ...(await content.listProjects()).map((p) => "/work/" + p.slug),
  ].map((path) => ({ url: site.origin + path }));
}
