import type { RoadmapPhase } from "@/data/service-catalog";
export const creationStages = [
  {
    id: "define",
    name: "DEFINE",
    line: "Find the company inside the idea.",
    description:
      "Understand the opportunity, make the important choices and establish a company roadmap.",
    items: [
      "Idea development, research and validation",
      "Positioning, naming and business model",
      "Company roadmap and market planning",
      "Formation and trademark coordination",
      "Regulatory preparation with qualified specialists",
    ],
    practices: ["start", "brand"],
  },
  {
    id: "build",
    name: "BUILD",
    line: "Make the parts work together.",
    description:
      "Create the identity, product and infrastructure the company needs to operate.",
    items: [
      "Brand identity and visual systems",
      "Product, packaging, fashion and apparel",
      "Industrial and engineering visualization",
      "Websites, applications and commerce",
      "Content systems, sales materials and operational infrastructure",
    ],
    practices: ["brand", "build", "publish"],
  },
  {
    id: "launch",
    name: "LAUNCH",
    line: "Prepare the company for the market.",
    description:
      "Connect the story, the channels and the commercial materials around a considered first move.",
    items: [
      "Campaign development and content production",
      "Launch strategy and go-to-market execution",
      "Sales enablement and distribution preparation",
      "Retail readiness and distributor materials",
      "Sampling strategy, events and field activation",
    ],
    practices: ["launch", "distribute", "activate", "publish"],
  },
  {
    id: "scale",
    name: "SCALE",
    line: "Strengthen what comes next.",
    description:
      "Connect operations, learn from performance and prepare for new products and markets.",
    items: [
      "AI workflows, automation and n8n systems",
      "Email, social, CRM and data workflows",
      "Analytics and optimization",
      "New products, markets and distribution expansion",
      "Ongoing creative and operational systems",
    ],
    practices: ["grow", "build", "distribute"],
  },
] as const;
export type CreationStage = (typeof creationStages)[number]["id"];
export const stageForPhase: Record<RoadmapPhase, CreationStage> = {
  Foundation: "define",
  Brand: "build",
  "Product / Infrastructure": "build",
  Digital: "build",
  Commercialization: "launch",
  Launch: "launch",
  Distribution: "launch",
  Activation: "launch",
  "Automation System": "scale",
  Growth: "scale",
};
export const flagshipDirections = [
  {
    slug: "mymosa",
    name: "MyMosa / My Drink Family",
    classification: "CATEGORY + BRAND ECOSYSTEM",
    disciplines: [
      "Brand",
      "Packaging",
      "Product",
      "Digital",
      "Campaign",
      "Market",
    ],
    status: "Approved identity and product exhibition",
  },
  {
    slug: "ikla-maison",
    name: "IKLA Maison",
    classification: "FASHION HOUSE CREATION",
    disciplines: [
      "Identity",
      "Emblem",
      "Pattern",
      "Materials",
      "Apparel",
      "Accessories",
      "Packaging",
      "Retail",
      "Commerce",
    ],
    status: "Case study in preparation",
  },
  {
    slug: "smokesuite",
    name: "SmokeSuite",
    classification: "PHYSICAL PRODUCT DEVELOPMENT",
    disciplines: [
      "Concept",
      "Industrial Design",
      "3D",
      "Engineering Visualization",
      "Product Architecture",
      "Commercialization",
    ],
    status: "Case study in preparation",
  },
  {
    slug: "mr-cliffs",
    name: "Mr. Cliff’s",
    classification: "HERITAGE BRAND TRANSFORMATION",
    disciplines: ["Brand", "Packaging", "Story", "Digital", "Campaign"],
    status: "Case study in preparation",
  },
  {
    slug: "ohana-to-alpine",
    name: "From Ohana to Alpine",
    classification: "LUXURY HOSPITALITY PLATFORM",
    disciplines: [
      "Positioning",
      "Digital Experience",
      "Property Storytelling",
      "Conversion Architecture",
    ],
    status: "Case study in preparation",
  },
] as const;
export const networkCategories = [
  "Legal",
  "Trademark",
  "Accounting",
  "Compliance",
  "Engineering",
  "Production",
  "Distribution",
  "Technology",
];
