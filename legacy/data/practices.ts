export type PracticeId =
  | "start"
  | "brand"
  | "build"
  | "launch"
  | "distribute"
  | "activate"
  | "grow"
  | "publish";
export interface Practice {
  id: PracticeId;
  title: string;
  tagline: string;
  items: string[];
  related: PracticeId[];
  boundary?: "formation" | "market";
}
export const practices: Practice[] = [
  {
    id: "start",
    title: "Start",
    tagline: "Create the foundation.",
    items: [
      "Company strategy",
      "Formation coordination",
      "Administrative support",
      "Licensing research",
      "Trademark coordination",
      "Business documentation",
      "Professional referrals",
    ],
    related: ["brand", "build", "launch"],
    boundary: "formation",
  },
  {
    id: "brand",
    title: "Brand",
    tagline: "Build the identity.",
    items: [
      "Brand strategy",
      "Naming",
      "Identity",
      "Logo systems",
      "Packaging",
      "Illustration",
      "Vector production",
      "Brand guidelines",
      "Creative direction",
      "Fashion & merchandise",
    ],
    related: ["build", "launch", "distribute"],
  },
  {
    id: "build",
    title: "Build",
    tagline: "Create the infrastructure.",
    items: [
      "Websites",
      "E-commerce",
      "Applications",
      "Portals",
      "Databases",
      "Dashboards",
      "AI systems",
      "Automation",
      "Digital infrastructure",
    ],
    related: ["brand", "launch", "grow"],
  },
  {
    id: "launch",
    title: "Launch",
    tagline: "Enter the market.",
    items: [
      "Advertising",
      "Campaign development",
      "Social media creative",
      "YouTube Shorts / Reels / TikTok creative",
      "Video content",
      "Launch strategy",
      "Press materials",
      "Sales materials",
      "Email systems",
    ],
    related: ["distribute", "activate", "grow"],
  },
  {
    id: "distribute",
    title: "Distribute",
    tagline: "Build the route to market.",
    items: [
      "Distribution strategy",
      "Route-to-market planning",
      "Distributor research",
      "Distributor targeting",
      "Distributor outreach support",
      "Distributor presentation materials",
      "Distributor pitch decks",
      "Sell sheets",
      "Product catalogs",
      "Pricing architecture support using approved figures",
      "Wholesale readiness",
      "Retail readiness",
      "Channel strategy",
      "Territory planning",
      "Retailer targeting",
      "Buyer presentation preparation",
      "Broker / representative coordination",
      "Distributor relationship coordination",
      "Market expansion planning",
    ],
    related: ["brand", "activate", "grow"],
    boundary: "market",
  },
  {
    id: "activate",
    title: "Activate",
    tagline: "Create real-world demand.",
    items: [
      "Product launches",
      "Retail activations",
      "Sampling programs / tastings coordination",
      "Pop-ups",
      "Experiential marketing",
      "Brand ambassador program planning",
      "Event concepts",
      "Event creative",
      "Retail displays",
      "POS materials",
      "Trade-show creative and support",
      "Launch events",
      "Hospitality activations",
      "Influencer activation strategy",
      "Street-team concepts",
      "Promotional merchandise",
      "QR-driven campaigns",
      "Digital-to-physical campaigns",
      "Field marketing systems",
    ],
    related: ["distribute", "launch", "grow"],
    boundary: "market",
  },
  {
    id: "grow",
    title: "Grow",
    tagline: "Expand the business.",
    items: [
      "Ongoing creative services",
      "Optimization",
      "Analytics",
      "Automation",
      "Campaigns",
      "Expansion",
      "Brand extensions",
      "New product development",
    ],
    related: ["build", "activate", "publish"],
  },
  {
    id: "publish",
    title: "Publish",
    tagline: "Create knowledge and content products.",
    items: [
      "E-books",
      "Pitch decks",
      "Investor presentations",
      "Reports",
      "Business documents",
      "Courses",
      "Digital products",
      "Templates",
      "Content systems",
    ],
    related: ["brand", "launch", "grow"],
  },
];
export const serviceRelationships: Record<
  string,
  { label: string; href: string }[]
> = {
  "brand-identity": [
    { label: "Brand strategy", href: "/services#brand" },
    { label: "Brand guidelines", href: "/services#brand" },
    { label: "Website", href: "/services#build" },
    { label: "Packaging", href: "/services#brand" },
  ],
  packaging: [
    { label: "Brand strategy", href: "/services#brand" },
    { label: "3D visualization", href: "/services#specialist-disciplines" },
    { label: "Advertising", href: "/services#launch" },
    { label: "E-commerce", href: "/services#build" },
    { label: "Retail readiness", href: "/start-a-business#market-entry" },
  ],
  web: [
    { label: "Brand identity", href: "/services#brand" },
    { label: "Content", href: "/services#publish" },
    { label: "SEO foundations", href: "/services#build" },
    { label: "Automation", href: "/services#build" },
    { label: "Ongoing support", href: "/services#grow" },
  ],
};
