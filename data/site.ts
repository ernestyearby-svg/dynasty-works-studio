export const site = {
  name: "Dynasty Works Studio",
  hero: {
    firstLine: "From idea",
    secondLine: "to",
    accent: "company.",
    description: "Strategy. Brand. Technology.",
    support: "From the first idea to the next stage of growth.",
    image: undefined as string | undefined,
    video: undefined as string | undefined,
  },
  statement: "We don’t separate strategy from execution.",
  description:
    "We connect company strategy, formation coordination, branding, digital development, launch and growth. For physical-market businesses, that can include distribution preparation and market activation.",
  origin:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://dynasty-works-studio.ernestyearby.chatgpt.site",
};
export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Start a Business", href: "/start-a-business" },
  { label: "Studio", href: "/studio" },
  { label: "About", href: "/studio#about" },
  { label: "BUILD YOUR COMPANY →", href: "/start-a-business/builder" },
];
export const processSteps = [
  ["Discover", "Understand the opportunity."],
  ["Define", "Build the strategy."],
  ["Design", "Create the system."],
  ["Develop", "Build the product."],
  ["Deploy", "Launch into the market."],
  ["Evolve", "Measure, refine, expand."],
];
