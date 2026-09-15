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
};
export type CaseModule =
  | { type: "text"; title: string; body: string }
  | { type: "gallery"; images: Media[] }
  | { type: "video"; src: string; poster: Media; title: string }
  | { type: "device"; image: Media; kind: "desktop" | "mobile" }
  | { type: "comparison"; before: Media; after: Media };
export interface Project {
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
const still: Media = {
  src: "/assets/projects/concept-beverage-still-life.webp",
  alt: "Concept study: an unbranded amber bottle and aluminum can on a stone plinth.",
  caption: "Illustrative concept study · not approved client artwork",
  width: 1536,
  height: 1024,
};
export const projects: Project[] = [
  {
    slug: "mymosa",
    title: "MyMosa / My Drink Family",
    client: null,
    year: null,
    category: ["Branding", "Packaging"],
    industries: ["Beverage — to confirm"],
    services: ["Scope awaiting approval"],
    shortDescription:
      "A place for the MyMosa / My Drink Family story. Final project scope and artwork are awaiting approval.",
    heroImage: still,
    gallery: [still],
    deliverables: [],
    featured: true,
    status: "placeholder",
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
