import { projects, type Project } from "@/data/projects";
import { services } from "@/data/services";
import { templates, type TemplateProduct } from "@/data/templates";
export interface ContentRepository {
  listProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  listTemplates(): Promise<TemplateProduct[]>;
  listServices(): Promise<typeof services>;
}
export const content: ContentRepository = {
  async listProjects() {
    return projects
      .filter((p) => p.status !== "draft")
      .sort((a, b) => a.order - b.order);
  },
  async getProject(slug) {
    return projects.find((p) => p.slug === slug && p.status !== "draft");
  },
  async listTemplates() {
    return templates.filter((t) => t.status !== "draft");
  },
  async listServices() {
    return services;
  },
};
