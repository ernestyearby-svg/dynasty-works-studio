import { founderBlueprint } from "./founder-blueprint";
import { businessTypes } from "./company-builder";
import {
  businessStages,
  type BuyingMode,
  type BusinessStage,
} from "./service-catalog";
import type { BusinessType } from "./company-builder";
export interface EngagementPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  idealFor: string;
  services: string[];
  optionalServices: string[];
  buyingMode: BuyingMode;
  businessTypes: readonly BusinessType[];
  businessStages: readonly BusinessStage[];
  featured: boolean;
  active: boolean;
  publicPrice: number | null;
  approvalStatus: "approved" | "preliminary";
}
const definitions: [string, string, string, string[]][] = [
  [
    "founder-blueprint",
    "Founder Blueprint",
    "Early-stage founders framing the opportunity",
    [
      "start-business-concept-strategy",
      "start-market-research",
      "start-naming-strategy",
      "start-launch-roadmap-development",
      "start-company-formation-process-coordination",
      "brand-brand-strategy",
    ],
  ],
  [
    "identity-build",
    "Identity Build",
    "Businesses defining or explicitly refreshing their identity",
    [
      "brand-brand-strategy",
      "brand-logo-design",
      "brand-identity-systems",
      "brand-typography-systems",
      "brand-color-systems",
      "brand-brand-guidelines",
      "brand-marketing-collateral",
    ],
  ],
  [
    "company-launch",
    "Company Launch",
    "Companies connecting foundation, identity and digital launch",
    [
      "start-company-formation-process-coordination",
      "brand-identity-systems",
      "build-website-development",
      "brand-marketing-collateral",
      "launch-launch-strategy",
    ],
  ],
  [
    "brand-to-market",
    "Brand-to-Market",
    "Physical brands preparing for buyers and audiences",
    [
      "brand-brand-strategy",
      "brand-packaging-design",
      "build-website-development",
      "distribute-sell-sheets",
      "distribute-distribution-readiness",
      "launch-campaign-creative",
      "activate-market-activation-strategy",
    ],
  ],
  [
    "full-company-build",
    "Full Company Build",
    "Founders coordinating a broad company build",
    [
      "start-business-concept-strategy",
      "start-company-formation-process-coordination",
      "brand-identity-systems",
      "brand-product-visualization",
      "build-website-development",
      "launch-launch-strategy",
      "distribute-distribution-readiness",
      "activate-market-activation-strategy",
    ],
  ],
  [
    "market-expansion",
    "Market Expansion",
    "Established physical businesses exploring new channels",
    [
      "distribute-route-to-market-strategy",
      "distribute-retail-readiness",
      "grow-market-expansion",
      "activate-market-activation-strategy",
      "launch-campaign-creative",
    ],
  ],
  [
    "growth-partnership",
    "Growth Partnership",
    "Operating businesses seeking ongoing improvement",
    [
      "grow-creative-retainers",
      "grow-website-optimization",
      "grow-analytics-review",
      "grow-growth-strategy",
    ],
  ],
];
export const engagementPackages: EngagementPackage[] = definitions.map(
  ([id, name, idealFor, services]) => ({
    id,
    slug: id,
    name,
    idealFor,
    description:
      id === founderBlueprint.id
        ? founderBlueprint.description
        : idealFor +
          ". A starting point for project review, with final scope agreed together.",
    services,
    optionalServices: [],
    buyingMode:
      id === "growth-partnership"
        ? "GROWTH"
        : id === "founder-blueprint"
          ? "DWY"
          : "DFY",
    businessTypes,
    businessStages,
    featured: ["company-launch", "brand-to-market"].includes(id),
    active: true,
    publicPrice:
      id === founderBlueprint.id ? founderBlueprint.publicPrice : null,
    approvalStatus: id === founderBlueprint.id ? "approved" : "preliminary",
  }),
);
export const growthPartnerships = [
  {
    id: "studio-partner",
    name: "Studio Partner",
    description: "Ongoing design and creative.",
    services: ["grow-creative-retainers", "grow-brand-management"],
  },
  {
    id: "digital-partner",
    name: "Digital Partner",
    description: "Website, e-commerce and digital optimization.",
    services: ["grow-website-optimization", "grow-e-commerce-optimization"],
  },
  {
    id: "content-partner",
    name: "Content Partner",
    description: "Recurring social, video and campaign creative.",
    services: ["grow-content-production", "grow-campaign-management"],
  },
  {
    id: "automation-partner",
    name: "Automation Partner",
    description: "Workflow maintenance and optimization.",
    services: ["grow-automation-management"],
  },
  {
    id: "growth-partner",
    name: "Growth Partner",
    description: "Integrated creative, digital and commercialization support.",
    services: ["grow-growth-strategy", "grow-market-expansion"],
  },
].map((p) => ({
  ...p,
  publicPrice: null,
  scopeStatus: "preliminary" as const,
}));
export const preliminaryNotice =
  "Preliminary recommendation based on the information provided. Final scope is determined after project review.";
