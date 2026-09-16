import type { MarketCaseSection } from "@/types/company";
export const categories = [
  "All",
  "Branding",
  "Packaging",
  "Web",
  "Apps",
  "AI",
  "3D",
  "Fashion",
  "Advertising",
  "Illustration",
  "Experiences",
] as const;
export type Category = (typeof categories)[number];
export type Media = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  srcSet?: string;
};
export type CaseModule =
  | { type: "text"; title: string; body: string }
  | { type: "gallery"; images: Media[] }
  | { type: "video"; src: string; poster: Media; title: string }
  | { type: "device"; image: Media; kind: "desktop" | "mobile" }
  | { type: "comparison"; before: Media; after: Media }
  | {
      type: "media-sequence";
      layout:
        | "packaging"
        | "lineup"
        | "details"
        | "dieline"
        | "environment"
        | "retail"
        | "technical"
        | "mobile-sequence";
      title: string;
      images: Media[];
    };
export interface Project {
  /** Approval covers copy, media rights, credits and the exact case-study revision. */
  exhibition?: {
    background: string;
    foreground: string;
    approvalReference: string;
  };
  publicationApproval?: { approved: true; reference: string };
  marketSections?: MarketCaseSection[];
  slug: string;
  title: string;
  client: string | null;
  year: number | null;
  category: Category[];
  industries: string[];
  services: string[];
  shortDescription: string;
  heroImage?: Media;
  heroVideo?: string;
  gallery: Media[];
  challenge?: string;
  strategy?: string;
  execution?: string;
  deliverables: string[];
  outcome?: string;
  featured: boolean;
  status: "placeholder" | "published" | "draft";
  order: number;
  art: string;
  modules: CaseModule[];
}
const mymosaExhibition: Media = {
  src: "/assets/portfolio/mymosa/web/flagship-eight-thumbnail.webp",
  alt: "The eight approved MyMosa can masters in a new architectural exhibition composition.",
  caption: "Original product artwork · New exhibition composition",
  width: 640,
  height: 389,
};
export const projects: Project[] = [
  {
    slug: "mymosa",
    title: "MyMosa / My Drink Family",
    client: null,
    year: null,
    category: ["Branding", "Packaging"],
    industries: ["Premium Wine Cocktails"],
    services: ["Product identity", "Packaging", "Brand architecture"],
    shortDescription:
      "MyMosa Premium Wine Cocktails: eight flagship flavors and the official My Drink Family brand architecture.",
    heroImage: mymosaExhibition,
    gallery: [mymosaExhibition],
    deliverables: [],
    featured: true,
    status: "published",
    publicationApproval: {
      approved: true,
      reference:
        "Portfolio Phase 1A: explicit user approval of eight unchanged -002 masters; official identity checkpoint sections 6–7; controlled brand canon. See MYMOSA-PORTFOLIO-SOURCE-MANIFEST.md.",
    },
    order: 1,
    art: "beverage",
    modules: [],
  },
  {
    slug: "ikla-maison",
    title: "IKLA Maison",
    client: null,
    year: null,
    category: ["Branding", "Fashion"],
    industries: ["To confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "An editorial space for IKLA Maison. Identity, collection and project details will be added after approval.",
    gallery: [],
    deliverables: [],
    featured: true,
    status: "placeholder",
    order: 2,
    art: "maison",
    modules: [],
  },
  {
    slug: "smokesuite",
    title: "SmokeSuite",
    client: null,
    year: null,
    category: ["Web", "Apps", "AI"],
    industries: ["To confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "A framework for the SmokeSuite case study, ready for approved product screens and the project narrative.",
    gallery: [],
    deliverables: [],
    featured: true,
    status: "placeholder",
    order: 3,
    art: "suite",
    modules: [],
  },
  {
    slug: "mr-cliffs",
    title: "Mr. Cliff’s Premium Bourbon",
    client: null,
    year: null,
    category: ["Branding", "Packaging"],
    industries: ["Spirits — to confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "A dedicated place for the bourbon project. The final bottle design, identity and scope remain to be confirmed.",
    gallery: [],
    deliverables: [],
    featured: false,
    status: "placeholder",
    order: 4,
    art: "bourbon",
    modules: [],
  },
  {
    slug: "ohana-to-alpine",
    title: "From Ohana to Alpine",
    client: null,
    year: null,
    category: ["Experiences", "3D"],
    industries: ["To confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "A future visual story for From Ohana to Alpine, awaiting approved imagery and project information.",
    gallery: [],
    deliverables: [],
    featured: false,
    status: "placeholder",
    order: 5,
    art: "alpine",
    modules: [],
  },
  {
    slug: "quick-fix",
    title: "Quick Fix",
    client: null,
    year: null,
    category: ["Web", "Advertising", "Illustration"],
    industries: ["To confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "A flexible case-study space for Quick Fix. Final categories, deliverables and story will follow approval.",
    gallery: [],
    deliverables: [],
    featured: false,
    status: "placeholder",
    order: 6,
    art: "quick",
    modules: [],
  },
];
// Placeholder categories are provisional content-planning assignments, not verified client claims.
