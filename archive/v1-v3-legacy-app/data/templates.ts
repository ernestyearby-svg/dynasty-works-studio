export const templateCategories = [
  "Website Templates",
  "Brand Kits",
  "Social Media Packs",
  "Presentation Templates",
  "Business Documents",
  "Mockups",
  "AI Workflow Templates",
  "Creative Systems",
  "Marketing Kits",
];
export interface TemplateProduct {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  currency: string;
  image?: { src: string; alt: string };
  previewUrl?: string;
  status: "placeholder" | "available" | "draft";
  details: string[];
}
export const templates: TemplateProduct[] = [
  {
    slug: "website-template-preview",
    name: "Website templates",
    category: "Website Templates",
    description: "A future collection of considered digital starting points.",
    price: null,
    currency: "USD",
    status: "placeholder",
    details: [
      "Catalog preview only. No downloadable product is available.",
      "Format, license, compatibility and price will be published with the first release.",
    ],
  },
  {
    slug: "identity-kit-preview",
    name: "Brand kits",
    category: "Brand Kits",
    description: "A future collection for building a cohesive brand presence.",
    price: null,
    currency: "USD",
    status: "placeholder",
    details: [
      "Catalog preview only. No downloadable product is available.",
      "Contents, license and price are awaiting approval.",
    ],
  },
  {
    slug: "presentation-preview",
    name: "Presentation templates",
    category: "Presentation Templates",
    description: "A future collection for presenting ideas with clarity.",
    price: null,
    currency: "USD",
    status: "placeholder",
    details: [
      "Catalog preview only. No downloadable product is available.",
      "File formats, slide contents and price will be confirmed before release.",
    ],
  },
];
