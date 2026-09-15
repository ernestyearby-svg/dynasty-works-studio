import { engagementPackages } from "./packages";
import { serviceById } from "./service-catalog";
export interface StudioPackage {
  id: string;
  name: string;
  services: string[];
  deliverables: string[];
  timeline: string | null;
  startingPrice: number | null;
  recommendedFor: string;
  addOns: string[];
  status: "draft" | "approved";
  cta: string;
}
// Compatibility adapter for V1.2 package cards. The authoritative package definitions live in packages.ts.
export const studioPackages: StudioPackage[] = engagementPackages.map((p) => ({
  id: p.id,
  name: p.name,
  services: p.services.map((id) => serviceById[id].name),
  deliverables: [],
  timeline: null,
  startingPrice: p.publicPrice,
  recommendedFor: p.idealFor,
  addOns: [],
  status: p.approvalStatus === "approved" ? "approved" : "draft",
  cta:
    p.id === "founder-blueprint"
      ? "/founder-blueprint"
      : "/start-a-business/builder",
}));

export const recurringOfferings = [
  "Creative Retainer",
  "Website Management",
  "Content Production",
  "Social Creative",
  "AI / Automation Management",
  "Brand Management",
  "Growth Support",
].map((name) => ({
  name,
  status: "draft" as const,
  price: null,
  cadence: null,
  scope: [] as string[],
}));
export const engagementLevels = [
  {
    id: "diy",
    name: "DIY",
    description:
      "Templates and digital products. Collections are in development.",
    href: "/templates",
  },
  {
    id: "guided",
    name: "Done with you",
    description:
      "A coordinated roadmap and focused guidance, with scope agreed together.",
    href: "/start-a-business/builder",
  },
  {
    id: "studio",
    name: "Done for you",
    description:
      "An integrated studio engagement from strategy through execution.",
    href: "/contact",
  },
];
export const founderTemplateIdeas = [
  "Business Launch Checklist",
  "Brand Brief",
  "Pitch Deck",
  "Business Plan Framework",
  "Social Templates",
  "Website Templates",
  "Brand Guidelines Template",
  "Marketing Calendar",
  "AI Workflow Templates",
  "E-book Templates",
  "Proposal Templates",
  "Presentation Templates",
].map((name) => ({ name, status: "draft" as const, price: null }));
export const professionalNetworkCategories = [
  "Attorneys",
  "Trademark Professionals",
  "Accountants",
  "Registered Agents",
  "Compliance Specialists",
  "Manufacturers",
  "Co-Packers",
  "Printers",
  "Packaging Suppliers",
  "Distributors",
  "Brokers",
  "Retail Specialists",
  "Developers",
  "Photographers",
  "Videographers",
  "Brand Ambassadors",
  "Event Professionals",
].map((name, i) => ({
  id: "network-" + i,
  name,
  requiresCredentialReview: true,
}));
// No unverified people, partners or testimonials are seeded.
