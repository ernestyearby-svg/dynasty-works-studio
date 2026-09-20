import type { PracticeId } from "./practices";
import { businessTypes, type BusinessType } from "./company-builder";
export const businessStages = [
  "Idea",
  "Preparing to launch",
  "Operating",
  "Growing",
] as const;
export type BusinessStage = (typeof businessStages)[number];
export type BuyingMode = "DIY" | "DWY" | "DFY" | "GROWTH";
export type ProfessionalBoundary =
  | "DIRECT"
  | "COORDINATED"
  | "PROFESSIONAL_REQUIRED";
export type RoadmapPhase =
  | "Foundation"
  | "Brand"
  | "Product / Infrastructure"
  | "Digital"
  | "Commercialization"
  | "Launch"
  | "Distribution"
  | "Activation"
  | "Automation System"
  | "Growth";
export const roadmapPhases: RoadmapPhase[] = [
  "Foundation",
  "Brand",
  "Product / Infrastructure",
  "Digital",
  "Commercialization",
  "Launch",
  "Distribution",
  "Activation",
  "Automation System",
  "Growth",
];
export interface CatalogService {
  id: string;
  slug: string;
  name: string;
  practice: PracticeId;
  shortDescription: string;
  longDescription: string;
  buyingModes: BuyingMode[];
  businessTypes: readonly BusinessType[];
  businessStages: readonly BusinessStage[];
  dependencies: string[];
  recommendedNextServices: string[];
  deliverables: string[];
  estimatedComplexity: "focused" | "integrated";
  deliveryType: "project" | "coordination" | "recurring";
  professionalBoundary: ProfessionalBoundary;
  featured: boolean;
  active: boolean;
  phase: RoadmapPhase;
}
const definitions = [
  {
    id: "start-business-concept-strategy",
    practice: "start",
    name: "Business Concept Strategy",
  },
  {
    id: "start-business-model-exploration",
    practice: "start",
    name: "Business Model Exploration",
  },
  {
    id: "start-market-research",
    practice: "start",
    name: "Market Research",
  },
  {
    id: "start-competitive-research",
    practice: "start",
    name: "Competitive Research",
  },
  {
    id: "start-naming-strategy",
    practice: "start",
    name: "Naming Strategy",
  },
  {
    id: "start-domain-strategy",
    practice: "start",
    name: "Domain Strategy",
  },
  {
    id: "start-company-formation-process-coordination",
    practice: "start",
    name: "Company Formation Process Coordination",
  },
  {
    id: "start-ein-process-guidance",
    practice: "start",
    name: "EIN Process Guidance",
  },
  {
    id: "start-licensing-research",
    practice: "start",
    name: "Licensing Research",
  },
  {
    id: "start-permit-research",
    practice: "start",
    name: "Permit Research",
  },
  {
    id: "start-trademark-process-coordination",
    practice: "start",
    name: "Trademark Process Coordination",
  },
  {
    id: "start-business-documentation-organization",
    practice: "start",
    name: "Business Documentation Organization",
  },
  {
    id: "start-professional-referral-coordination",
    practice: "start",
    name: "Professional Referral Coordination",
  },
  {
    id: "start-launch-roadmap-development",
    practice: "start",
    name: "Launch Roadmap Development",
  },
  {
    id: "brand-brand-strategy",
    practice: "brand",
    name: "Brand Strategy",
  },
  {
    id: "brand-brand-positioning",
    practice: "brand",
    name: "Brand Positioning",
  },
  {
    id: "brand-naming",
    practice: "brand",
    name: "Naming",
  },
  {
    id: "brand-messaging",
    practice: "brand",
    name: "Messaging",
  },
  {
    id: "brand-logo-design",
    practice: "brand",
    name: "Logo Design",
  },
  {
    id: "brand-identity-systems",
    practice: "brand",
    name: "Identity Systems",
  },
  {
    id: "brand-typography-systems",
    practice: "brand",
    name: "Typography Systems",
  },
  {
    id: "brand-color-systems",
    practice: "brand",
    name: "Color Systems",
  },
  {
    id: "brand-brand-guidelines",
    practice: "brand",
    name: "Brand Guidelines",
  },
  {
    id: "brand-packaging-design",
    practice: "brand",
    name: "Packaging Design",
  },
  {
    id: "brand-label-design",
    practice: "brand",
    name: "Label Design",
  },
  {
    id: "brand-vector-artwork",
    practice: "brand",
    name: "Vector Artwork",
  },
  {
    id: "brand-illustration",
    practice: "brand",
    name: "Illustration",
  },
  {
    id: "brand-product-visualization",
    practice: "brand",
    name: "Product Visualization",
  },
  {
    id: "brand-marketing-collateral",
    practice: "brand",
    name: "Marketing Collateral",
  },
  {
    id: "brand-sales-collateral",
    practice: "brand",
    name: "Sales Collateral",
  },
  {
    id: "brand-merchandise-design",
    practice: "brand",
    name: "Merchandise Design",
  },
  {
    id: "brand-creative-direction",
    practice: "brand",
    name: "Creative Direction",
  },
  {
    id: "build-website-strategy",
    practice: "build",
    name: "Website Strategy",
  },
  {
    id: "build-website-design",
    practice: "build",
    name: "Website Design",
  },
  {
    id: "build-website-development",
    practice: "build",
    name: "Website Development",
  },
  {
    id: "build-landing-pages",
    practice: "build",
    name: "Landing Pages",
  },
  {
    id: "build-e-commerce",
    practice: "build",
    name: "E-commerce",
  },
  {
    id: "build-web-applications",
    practice: "build",
    name: "Web Applications",
  },
  {
    id: "build-mobile-product-concepts",
    practice: "build",
    name: "Mobile Product Concepts",
  },
  {
    id: "build-customer-portals",
    practice: "build",
    name: "Customer Portals",
  },
  {
    id: "build-internal-dashboards",
    practice: "build",
    name: "Internal Dashboards",
  },
  {
    id: "build-database-architecture",
    practice: "build",
    name: "Database Architecture",
  },
  {
    id: "build-ai-integrations",
    practice: "build",
    name: "AI Integrations",
  },
  {
    id: "build-workflow-automation",
    practice: "build",
    name: "Workflow Automation",
  },
  {
    id: "build-internal-business-systems",
    practice: "build",
    name: "Internal Business Systems",
  },
  {
    id: "build-analytics-foundations",
    practice: "build",
    name: "Analytics Foundations",
  },
  {
    id: "build-seo-foundations",
    practice: "build",
    name: "SEO Foundations",
  },
  {
    id: "launch-launch-strategy",
    practice: "launch",
    name: "Launch Strategy",
  },
  {
    id: "launch-campaign-strategy",
    practice: "launch",
    name: "Campaign Strategy",
  },
  {
    id: "launch-campaign-creative",
    practice: "launch",
    name: "Campaign Creative",
  },
  {
    id: "launch-social-media-creative",
    practice: "launch",
    name: "Social Media Creative",
  },
  {
    id: "launch-youtube-shorts",
    practice: "launch",
    name: "YouTube Shorts",
  },
  {
    id: "launch-vertical-video",
    practice: "launch",
    name: "Vertical Video",
  },
  {
    id: "launch-reels-tiktok-creative",
    practice: "launch",
    name: "Reels / TikTok Creative",
  },
  {
    id: "launch-advertising-creative",
    practice: "launch",
    name: "Advertising Creative",
  },
  {
    id: "launch-email-campaign-assets",
    practice: "launch",
    name: "Email Campaign Assets",
  },
  {
    id: "launch-press-materials",
    practice: "launch",
    name: "Press Materials",
  },
  {
    id: "launch-press-release-creative-support",
    practice: "launch",
    name: "Press Release Creative Support",
  },
  {
    id: "launch-sales-materials",
    practice: "launch",
    name: "Sales Materials",
  },
  {
    id: "launch-pitch-materials",
    practice: "launch",
    name: "Pitch Materials",
  },
  {
    id: "launch-launch-calendar",
    practice: "launch",
    name: "Launch Calendar",
  },
  {
    id: "launch-content-systems",
    practice: "launch",
    name: "Content Systems",
  },
  {
    id: "distribute-route-to-market-strategy",
    practice: "distribute",
    name: "Route-to-Market Strategy",
  },
  {
    id: "distribute-distribution-readiness",
    practice: "distribute",
    name: "Distribution Readiness",
  },
  {
    id: "distribute-distributor-research",
    practice: "distribute",
    name: "Distributor Research",
  },
  {
    id: "distribute-distributor-targeting",
    practice: "distribute",
    name: "Distributor Targeting",
  },
  {
    id: "distribute-distributor-outreach-support",
    practice: "distribute",
    name: "Distributor Outreach Support",
  },
  {
    id: "distribute-distributor-presentation",
    practice: "distribute",
    name: "Distributor Presentation",
  },
  {
    id: "distribute-wholesale-readiness",
    practice: "distribute",
    name: "Wholesale Readiness",
  },
  {
    id: "distribute-retail-readiness",
    practice: "distribute",
    name: "Retail Readiness",
  },
  {
    id: "distribute-buyer-presentation",
    practice: "distribute",
    name: "Buyer Presentation",
  },
  {
    id: "distribute-sell-sheets",
    practice: "distribute",
    name: "Sell Sheets",
  },
  {
    id: "distribute-product-catalogs",
    practice: "distribute",
    name: "Product Catalogs",
  },
  {
    id: "distribute-pricing-architecture-support",
    practice: "distribute",
    name: "Pricing Architecture Support",
  },
  {
    id: "distribute-channel-strategy",
    practice: "distribute",
    name: "Channel Strategy",
  },
  {
    id: "distribute-territory-planning",
    practice: "distribute",
    name: "Territory Planning",
  },
  {
    id: "distribute-retailer-targeting",
    practice: "distribute",
    name: "Retailer Targeting",
  },
  {
    id: "distribute-broker-representative-coordination",
    practice: "distribute",
    name: "Broker / Representative Coordination",
  },
  {
    id: "distribute-market-expansion-planning",
    practice: "distribute",
    name: "Market Expansion Planning",
  },
  {
    id: "activate-market-activation-strategy",
    practice: "activate",
    name: "Market Activation Strategy",
  },
  {
    id: "activate-product-launch-activation",
    practice: "activate",
    name: "Product Launch Activation",
  },
  {
    id: "activate-sampling-programs",
    practice: "activate",
    name: "Sampling Programs",
  },
  {
    id: "activate-tasting-programs",
    practice: "activate",
    name: "Tasting Programs",
  },
  {
    id: "activate-pop-up-concepts",
    practice: "activate",
    name: "Pop-Up Concepts",
  },
  {
    id: "activate-experiential-marketing",
    practice: "activate",
    name: "Experiential Marketing",
  },
  {
    id: "activate-brand-ambassador-programs",
    practice: "activate",
    name: "Brand Ambassador Programs",
  },
  {
    id: "activate-event-creative",
    practice: "activate",
    name: "Event Creative",
  },
  {
    id: "activate-retail-display-design",
    practice: "activate",
    name: "Retail Display Design",
  },
  {
    id: "activate-pos-materials",
    practice: "activate",
    name: "POS Materials",
  },
  {
    id: "activate-trade-show-creative",
    practice: "activate",
    name: "Trade Show Creative",
  },
  {
    id: "activate-hospitality-activations",
    practice: "activate",
    name: "Hospitality Activations",
  },
  {
    id: "activate-promotional-merchandise",
    practice: "activate",
    name: "Promotional Merchandise",
  },
  {
    id: "activate-qr-campaigns",
    practice: "activate",
    name: "QR Campaigns",
  },
  {
    id: "activate-digital-to-physical-campaigns",
    practice: "activate",
    name: "Digital-to-Physical Campaigns",
  },
  {
    id: "activate-field-marketing-systems",
    practice: "activate",
    name: "Field Marketing Systems",
  },
  {
    id: "grow-creative-retainers",
    practice: "grow",
    name: "Creative Retainers",
  },
  {
    id: "grow-website-optimization",
    practice: "grow",
    name: "Website Optimization",
  },
  {
    id: "grow-e-commerce-optimization",
    practice: "grow",
    name: "E-commerce Optimization",
  },
  {
    id: "grow-content-production",
    practice: "grow",
    name: "Content Production",
  },
  {
    id: "grow-brand-management",
    practice: "grow",
    name: "Brand Management",
  },
  {
    id: "grow-campaign-management",
    practice: "grow",
    name: "Campaign Management",
  },
  {
    id: "grow-automation-management",
    practice: "grow",
    name: "Automation Management",
  },
  {
    id: "grow-analytics-review",
    practice: "grow",
    name: "Analytics Review",
  },
  {
    id: "grow-new-product-development",
    practice: "grow",
    name: "New Product Development",
  },
  {
    id: "grow-brand-extensions",
    practice: "grow",
    name: "Brand Extensions",
  },
  {
    id: "grow-market-expansion",
    practice: "grow",
    name: "Market Expansion",
  },
  {
    id: "grow-digital-transformation",
    practice: "grow",
    name: "Digital Transformation",
  },
  {
    id: "grow-growth-strategy",
    practice: "grow",
    name: "Growth Strategy",
  },
  {
    id: "publish-e-books",
    practice: "publish",
    name: "E-books",
  },
  {
    id: "publish-pitch-decks",
    practice: "publish",
    name: "Pitch Decks",
  },
  {
    id: "publish-investor-presentations",
    practice: "publish",
    name: "Investor Presentations",
  },
  {
    id: "publish-reports",
    practice: "publish",
    name: "Reports",
  },
  {
    id: "publish-business-documents",
    practice: "publish",
    name: "Business Documents",
  },
  {
    id: "publish-proposals",
    practice: "publish",
    name: "Proposals",
  },
  {
    id: "publish-courses",
    practice: "publish",
    name: "Courses",
  },
  {
    id: "publish-digital-products",
    practice: "publish",
    name: "Digital Products",
  },
  {
    id: "publish-website-templates",
    practice: "publish",
    name: "Website Templates",
  },
  {
    id: "publish-presentation-templates",
    practice: "publish",
    name: "Presentation Templates",
  },
  {
    id: "publish-social-templates",
    practice: "publish",
    name: "Social Templates",
  },
  {
    id: "publish-brand-templates",
    practice: "publish",
    name: "Brand Templates",
  },
  {
    id: "publish-ai-workflow-templates",
    practice: "publish",
    name: "AI Workflow Templates",
  },
  {
    id: "publish-content-systems",
    practice: "publish",
    name: "Content Systems",
  },
] as const;
const dependencies: Record<string, string[]> = {
  "brand-logo-design": ["brand-brand-strategy"],
  "brand-identity-systems": ["brand-brand-strategy"],
  "brand-typography-systems": ["brand-identity-systems"],
  "brand-color-systems": ["brand-identity-systems"],
  "brand-brand-guidelines": ["brand-identity-systems"],
  "brand-packaging-design": ["brand-brand-strategy", "brand-identity-systems"],
  "brand-label-design": ["brand-packaging-design"],
  "build-website-design": ["build-website-strategy"],
  "build-website-development": ["build-website-design"],
  "build-e-commerce": ["build-website-strategy"],
  "build-web-applications": ["build-database-architecture"],
  "distribute-distribution-readiness": ["distribute-retail-readiness"],
  "distribute-distributor-targeting": ["distribute-distribution-readiness"],
  "distribute-distributor-outreach-support": [
    "distribute-distributor-targeting",
    "distribute-distributor-presentation",
  ],
  "distribute-distributor-presentation": ["distribute-sell-sheets"],
  "activate-sampling-programs": ["activate-market-activation-strategy"],
  "activate-tasting-programs": ["activate-market-activation-strategy"],
  "launch-campaign-creative": ["launch-launch-strategy"],
};
const coordinated =
  /Coordination|Process Guidance|Licensing Research|Permit Research|Distributor Research|Distributor Targeting|Distributor Outreach|Distribution Readiness|Sampling Programs|Tasting Programs|Brand Ambassador Programs/;
const phaseFor = (practice: PracticeId, name: string): RoadmapPhase => {
  if (practice === "start") return "Foundation";
  if (practice === "brand")
    return /Packaging|Label|Product Visualization/.test(name)
      ? "Product / Infrastructure"
      : "Brand";
  if (practice === "build")
    return /Database|Internal Business Systems/.test(name)
      ? "Product / Infrastructure"
      : "Digital";
  if (practice === "distribute")
    return /Presentation|Sell Sheets|Catalogs|Retail Readiness|Wholesale|Pricing Architecture/.test(
      name,
    )
      ? "Commercialization"
      : "Distribution";
  return (
    {
      launch: "Launch",
      activate: "Activation",
      grow: "Growth",
      publish: "Commercialization",
    } as const
  )[practice];
};
const purpose: Record<PracticeId, string> = {
  start: "Clarify the opportunity and organize the foundation",
  brand: "Create a coherent expression of the business",
  build: "Connect the customer experience and operational tools",
  launch: "Prepare a coordinated introduction to the market",
  distribute: "Prepare channels and buyer conversations",
  activate: "Plan real-world audience experiences",
  grow: "Improve the systems and creative already in use",
  publish: "Turn expertise into clear, useful communication",
};
export const serviceCatalog: CatalogService[] = definitions.map((d) => ({
  ...d,
  slug: d.id,
  shortDescription: d.name + " — " + purpose[d.practice].toLowerCase() + ".",
  longDescription:
    purpose[d.practice] +
    ". We begin with the existing materials, define the intended audience and agree the scope for " +
    d.name.toLowerCase() +
    ". Deliverables and dependencies are confirmed during project review.",
  buyingModes:
    d.practice === "grow"
      ? ["DWY", "DFY", "GROWTH"]
      : d.practice === "publish"
        ? ["DIY", "DWY", "DFY"]
        : ["DWY", "DFY"],
  businessTypes,
  businessStages,
  dependencies: dependencies[d.id] || [],
  recommendedNextServices: Object.entries(dependencies)
    .filter(([, deps]) => deps.includes(d.id))
    .map(([id]) => id),
  deliverables: [
    d.name + " scope and working brief",
    d.name + " materials for review",
  ],
  estimatedComplexity: /Architecture|Systems|Application|Strategy/.test(d.name)
    ? "integrated"
    : "focused",
  deliveryType: coordinated.test(d.name)
    ? "coordination"
    : d.practice === "grow"
      ? "recurring"
      : "project",
  professionalBoundary: coordinated.test(d.name) ? "COORDINATED" : "DIRECT",
  featured: [
    "start-business-concept-strategy",
    "brand-brand-strategy",
    "build-website-development",
    "distribute-distribution-readiness",
  ].includes(d.id),
  active: true,
  phase: phaseFor(d.practice, d.name),
}));
export const serviceById = Object.fromEntries(
  serviceCatalog.map((s) => [s.id, s]),
) as Record<string, CatalogService>;
export const boundaryCopy: Record<ProfessionalBoundary, string> = {
  DIRECT:
    "Creative, strategy and technology work scoped and delivered by the studio.",
  COORDINATED:
    "Research, planning and administrative coordination. Regulated execution and required approvals remain with authorized professionals.",
  PROFESSIONAL_REQUIRED:
    "A suitably licensed or authorized outside specialist must provide legal or tax advice, regulated filings, or regulated distribution work.",
};
