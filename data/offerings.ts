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
export const studioPackages: StudioPackage[] = [
  {
    id: "idea-identity",
    name: "Idea to Identity",
    services: ["Company strategy", "Naming", "Brand identity"],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Founders shaping an idea.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
  {
    id: "company-launch",
    name: "Company Launch",
    services: [
      "Formation coordination",
      "Brand identity",
      "Website",
      "Launch strategy",
    ],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Founders preparing to launch.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
  {
    id: "brand-build",
    name: "Brand Build",
    services: ["Brand strategy", "Identity", "Packaging"],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Businesses building or refreshing a brand.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
  {
    id: "digital-build",
    name: "Digital Build",
    services: ["Websites", "Applications", "Automation"],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Businesses improving their digital infrastructure.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
  {
    id: "full-company",
    name: "Full Company Build",
    services: [
      "Company strategy",
      "Formation coordination",
      "Brand",
      "Build",
      "Launch",
    ],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Founders coordinating a complete build.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
  {
    id: "growth",
    name: "Growth Partnership",
    services: ["Ongoing creative", "Optimization", "Campaigns"],
    deliverables: [],
    timeline: null,
    startingPrice: null,
    recommendedFor: "Established businesses planning their next stage.",
    addOns: [],
    status: "draft",
    cta: "/start-a-business/builder",
  },
];
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
