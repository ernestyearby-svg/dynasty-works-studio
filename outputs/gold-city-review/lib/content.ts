import { projects, type Project } from "@/data/projects";
import { services } from "@/data/services";
import { templates, type TemplateProduct } from "@/data/templates";
export function isApprovedProject(p: Project) {
  return (
    p.status === "published" &&
    p.publicationApproval?.approved === true &&
    Boolean(p.publicationApproval.reference.trim())
  );
}
export interface ContentRepository {
  listProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  listTemplates(): Promise<TemplateProduct[]>;
  listServices(): Promise<typeof services>;
}
export const content: ContentRepository = {
  async listProjects() {
    return projects.filter(isApprovedProject).sort((a, b) => a.order - b.order);
  },
  async getProject(slug) {
    return projects.find((p) => p.slug === slug && isApprovedProject(p));
  },
  async listTemplates() {
    return templates.filter((t) => t.status !== "draft");
  },
  async listServices() {
    return services;
  },
};
