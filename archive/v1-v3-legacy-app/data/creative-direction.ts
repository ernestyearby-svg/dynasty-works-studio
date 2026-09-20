/** Internal editorial plan; these are requested capabilities, never claims of completed work. */
export const flagshipPlans = [
  {
    slug: "mymosa",
    title: "MyMosa / My Drink Family",
    areas: [
      "Brand architecture",
      "Beverage branding",
      "Packaging",
      "Can design",
      "Bottle design",
      "Product visualization",
      "Advertising",
      "Campaign creative",
      "Digital experience",
      "Website",
      "Application concepts",
      "Retail presentation",
      "Distributor materials",
      "Activation concepts",
      "Commercialization thinking",
    ],
  },
  {
    slug: "ikla-maison",
    title: "IKLA Maison",
    areas: [
      "Fashion branding",
      "Identity",
      "Apparel",
      "Merchandise",
      "Accessories",
      "Product visualization",
      "Campaign creative",
      "E-commerce",
      "Digital experience",
      "Collection systems",
    ],
  },
  {
    slug: "smokesuite",
    title: "SmokeSuite",
    areas: [
      "Product concept",
      "Industrial design thinking",
      "3D visualization",
      "Spatial design",
      "Environmental visualization",
      "Technical development",
      "Digital presentation",
    ],
  },
  {
    slug: "mr-cliffs",
    title: "Mr. Cliff’s Premium Bourbon",
    areas: [
      "Spirits branding",
      "Bottle / packaging presentation",
      "Advertising",
      "Campaign creative",
      "Web design",
      "Digital experience",
      "Sales collateral",
    ],
  },
  {
    slug: "ohana-to-alpine",
    title: "From Ohana to Alpine",
    areas: [
      "Luxury hospitality",
      "Digital strategy",
      "Website design",
      "Property presentation",
      "Editorial photography treatment",
      "Booking journey",
      "Responsive design",
      "Luxury experience design",
    ],
  },
];
export const processEvidenceStages = [
  "Idea",
  "Strategy",
  "Early concept",
  "Identity",
  "Design development",
  "Prototype / visualization",
  "Digital",
  "Campaign",
  "Market",
];
export const archiveCategories = [
  "Brand Identity",
  "Packaging",
  "Websites",
  "Applications",
  "Advertising",
  "3D",
  "Fashion",
  "Illustration",
  "Presentations",
  "Social",
  "Experiential",
  "Product Concepts",
] as const;
export type ArchiveCategory = (typeof archiveCategories)[number];
import type { Media } from "@/data/projects";
export interface ArchiveEntry {
  id: string;
  title: string;
  category: ArchiveCategory;
  media: Media;
  projectSlug?: string;
  approval: { approved: boolean; reference: string };
}
export const archiveEntries: ArchiveEntry[] = [
  {
    id: "mdf-seal",
    title: "My Drink Family / Master seal",
    category: "Brand Identity",
    projectSlug: "mymosa",
    media: {
      src: "/assets/portfolio/mymosa/identity/my-drink-family-seal-primary-light.svg",
      alt: "Official My Drink Family master seal",
      width: 800,
      height: 800,
      caption: "Official production vector / brand architecture",
    },
    approval: {
      approved: true,
      reference:
        "MYMOSA-PORTFOLIO-SOURCE-MANIFEST.md / identity checkpoint sections 6–7",
    },
  },
  {
    id: "mymosa-packaging",
    title: "MyMosa / The flagship eight",
    category: "Packaging",
    projectSlug: "mymosa",
    media: {
      src: "/assets/portfolio/mymosa/web/flagship-eight-thumbnail.webp",
      alt: "Eight approved MyMosa product masters",
      width: 640,
      height: 389,
      caption: "Unchanged product masters / exhibition composition",
    },
    approval: {
      approved: true,
      reference: "Explicit user approval of all eight exact -002 masters",
    },
  },
  {
    id: "cliffs-digital",
    title: "Mr. Cliff’s / Digital experience",
    category: "Websites",
    projectSlug: "mr-cliffs",
    media: {
      src: "/assets/portfolio/mr-cliffs/desktop-home.webp",
      alt: "Actual Mr. Cliff’s desktop website capture",
      width: 1440,
      height: 1000,
      caption: "Production project / actual interface capture",
    },
    approval: {
      approved: true,
      reference:
        "CREATIVE-BUILD-AUDIT.md / project inventory and source interface capture",
    },
  },
];
export const identityVariants = [
  "Primary logo",
  "Secondary logo",
  "Horizontal lockup",
  "Vertical lockup",
  "DW monogram",
  "Symbol",
  "Favicon",
  "App icon",
  "Social avatar",
  "Black",
  "White",
  "Single color",
  "Small scale",
  "Document mark",
  "Watermark",
  "Presentation mark",
  "Motion mark",
];
