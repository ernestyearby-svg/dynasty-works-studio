export const site = {
  name: "Dynasty Works Studio",
  hero: {
    firstLine: "We build",
    secondLine: "what comes",
    accent: "next.",
    description: "Brands. Products. Experiences. Systems.",
    support: "From the first idea to the final detail.",
    image: "/assets/studio/concept-aluminum-ribbon.webp",
    video: undefined as string | undefined,
  },
  statement: "We don’t separate strategy from execution.",
  description:
    "We connect branding, digital products, packaging, visualization, AI and development so an idea can move through one coordinated creative system.",
  origin:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://dynasty-works-studio.ernestyearby.chatgpt.site",
};
export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Capabilities", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Templates", href: "/templates" },
  { label: "Start a Project ↗", href: "/contact" },
];
export const processSteps = [
  ["Discover", "Understand the opportunity."],
  ["Define", "Build the strategy."],
  ["Design", "Create the system."],
  ["Develop", "Build the product."],
  ["Deploy", "Launch into the market."],
  ["Evolve", "Measure, refine, expand."],
];
