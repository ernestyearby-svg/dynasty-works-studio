export const businessTypes = [
  "Consumer Brand",
  "Consumer Product",
  "Food / Beverage",
  "Fashion",
  "Beauty",
  "Hospitality",
  "Retail",
  "Technology",
  "Professional Service",
  "Real Estate",
  "Entertainment",
  "Personal Brand",
  "E-commerce",
  "Other",
] as const;
export type BusinessType = (typeof businessTypes)[number];
export const physicalBusinessTypes: readonly BusinessType[] = [
  "Consumer Brand",
  "Consumer Product",
  "Food / Beverage",
  "Fashion",
  "Beauty",
  "Hospitality",
  "Retail",
];
export const startingPoints = [
  "I only have an idea.",
  "I have a name.",
  "I already formed the company.",
  "I already have branding.",
  "I already have a website.",
  "I already have customers.",
  "I have an established business.",
] as const;
export const coreNeeds = [
  "Company Setup",
  "Naming",
  "Trademark Coordination",
  "Licensing Research",
  "Brand Identity",
  "Packaging",
  "Website",
  "E-commerce",
  "Application",
  "AI / Automation",
  "Advertising",
  "Social Content",
  "Video",
  "Pitch Deck",
  "E-book / Publication",
  "Business Collateral",
  "Ongoing Support",
] as const;
export const marketNeeds = [
  "Distribution Strategy",
  "Retail Readiness",
  "Distributor Materials",
  "Buyer Presentation",
  "Market Activation",
  "Sampling / Tastings",
  "Brand Ambassador Program",
  "Retail Displays",
  "Trade Shows / Events",
  "Market Expansion",
] as const;
export const allNeeds = [...coreNeeds, ...marketNeeds] as const;
export type BuildNeed = (typeof allNeeds)[number];
export const launchWindows = [
  "ASAP",
  "30–60 Days",
  "60–90 Days",
  "3–6 Months",
  "6+ Months",
  "Exploring",
] as const;
export const budgetChoices = [
  "Let’s define the range together",
  "I have a range in mind",
] as const;
// Internal placeholders only: no figures or unapproved bands are sent to the UI.
export const budgetRangeDrafts = [
  {
    id: "foundation",
    label: "Foundation band — internal review",
    min: null,
    max: null,
    approved: false,
  },
  {
    id: "company",
    label: "Company build band — internal review",
    min: null,
    max: null,
    approved: false,
  },
  {
    id: "growth",
    label: "Growth band — internal review",
    min: null,
    max: null,
    approved: false,
  },
];
export const founderPathways = [
  {
    id: "idea",
    title: "I have an idea",
    quote: "I know what I want to create, but I don’t know where to begin.",
    description:
      "Start by framing the opportunity, the audience and the business around it.",
    recommended: ["Company Setup", "Naming", "Brand Identity"] as BuildNeed[],
    starting: [startingPoints[0]],
  },
  {
    id: "starting",
    title: "I’m starting a company",
    quote: "I need the structure, identity and infrastructure.",
    description:
      "Coordinate the foundation, create the brand and build the first working touchpoints.",
    recommended: ["Company Setup", "Brand Identity", "Website"] as BuildNeed[],
    starting: [startingPoints[1]],
  },
  {
    id: "existing",
    title: "I already have a company",
    quote: "I need better branding, technology, systems or execution.",
    description:
      "Connect what exists, identify the gaps and focus on the next useful improvement.",
    recommended: [
      "Website",
      "AI / Automation",
      "Ongoing Support",
    ] as BuildNeed[],
    starting: [startingPoints[2]],
  },
  {
    id: "growing",
    title: "I’m ready to grow",
    quote: "I have something working and want to expand it.",
    description:
      "Build the creative, systems and channel plan for the next stage.",
    recommended: [
      "Advertising",
      "Ongoing Support",
      "AI / Automation",
    ] as BuildNeed[],
    starting: [startingPoints[5], startingPoints[6]],
  },
];
export type JourneyStage = {
  id: string;
  title: string;
  description: string;
  items: string[];
  specialized?: boolean;
  futurePath?: string;
};
export const companyJourney: JourneyStage[] = [
  {
    id: "idea",
    title: "Idea",
    description: "Find the shape of the opportunity.",
    futurePath: "/start-a-business/idea",
    items: [
      "Concept development",
      "Opportunity framing",
      "Business model exploration",
      "Naming exploration",
      "Market research",
      "Competitive research",
      "Positioning",
    ],
  },
  {
    id: "form",
    title: "Form",
    description: "Coordinate a considered foundation.",
    futurePath: "/start-a-business/formation",
    items: [
      "Entity-formation process coordination",
      "Administrative filing support where legally permissible",
      "EIN process information and coordination",
      "Licensing research",
      "Permit research",
      "Domain acquisition strategy",
      "Trademark process coordination",
      "Professional referral coordination",
      "Business documentation organization",
    ],
  },
  {
    id: "brand",
    title: "Brand",
    description: "Give the idea a coherent identity.",
    futurePath: "/start-a-business/brand",
    items: [
      "Naming",
      "Brand strategy",
      "Logo systems",
      "Visual identity",
      "Typography",
      "Color system",
      "Brand guidelines",
      "Packaging",
      "Product design",
      "Marketing collateral",
    ],
  },
  {
    id: "build",
    title: "Build",
    description: "Create the infrastructure behind it.",
    futurePath: "/start-a-business/build",
    items: [
      "Website",
      "E-commerce",
      "Applications",
      "Customer portals",
      "Databases",
      "Dashboards",
      "AI integrations",
      "Automation",
      "Internal operating systems",
      "Digital infrastructure",
    ],
  },
  {
    id: "launch",
    title: "Launch",
    description: "Prepare the first introduction.",
    futurePath: "/start-a-business/launch",
    items: [
      "Launch strategy",
      "Campaign creative",
      "Social media assets",
      "YouTube Shorts",
      "Reels",
      "TikTok creative",
      "Advertising",
      "Press materials",
      "Email campaigns",
      "Sales collateral",
      "Pitch materials",
    ],
  },
  {
    id: "distribute",
    title: "Distribute",
    description: "Plan the route to market.",
    specialized: true,
    items: [
      "Distribution strategy",
      "Route-to-market planning",
      "Distributor research and targeting",
      "Outreach support",
      "Distributor materials",
      "Channel strategy",
      "Territory planning",
      "Retail readiness",
      "Relationship coordination",
    ],
  },
  {
    id: "activate",
    title: "Activate",
    description: "Connect the brand to real-world audiences.",
    specialized: true,
    items: [
      "Retail activation planning",
      "Sampling and tasting program coordination",
      "Pop-up concepts",
      "Ambassador program planning",
      "Retail displays and POS materials",
      "Event creative",
      "Digital-to-physical campaigns",
      "Field marketing systems",
    ],
  },
  {
    id: "grow",
    title: "Grow",
    description: "Improve, extend and expand.",
    futurePath: "/start-a-business/grow",
    items: [
      "Ongoing creative",
      "Website optimization",
      "Content systems",
      "Automation",
      "Analytics",
      "New products",
      "New markets",
      "Campaigns",
      "Brand extensions",
      "Digital transformation",
    ],
  },
];
export const marketEntryStages = [
  "Product ready",
  "Sales ready",
  "Distributor ready",
  "Retail ready",
  "Market ready",
  "Activation",
  "Reorder / expansion",
];
export const retailDeliverables = [
  "Brand presentation",
  "Buyer deck",
  "Distributor deck",
  "Sell sheet",
  "Wholesale pricing sheet using approved figures",
  "Product catalog",
  "Client-confirmed case configuration information",
  "Product photography",
  "Packaging renders",
  "Retail display concepts",
  "POS materials",
  "Sampling materials",
  "Launch calendar",
  "Market activation plan",
];
export const companyCopy = {
  heroTitle: "We’ll help build the company around it.",
  heroDescription:
    "From early strategy and formation coordination through branding, digital development, launch and growth, Dynasty Works Studio brings the pieces together.",
  proposition: "Come with the idea. We’ll build the system around it.",
  market: "Digital. Physical. Market.",
  marketDescription:
    "For consumer products, retail and hospitality, the journey can extend into distribution preparation, market activation and field execution coordination.",
};
export const professionalBoundaries = {
  formation:
    "Formation, EIN, trademark, licensing and tax-related work is limited to research, administrative support and coordination where permissible. Legal and tax advice, regulated filings and professional decisions belong with appropriately licensed professionals.",
  market:
    "Distribution and activation support covers strategy, research, materials and coordination. Dynasty Works Studio does not act as a licensed distributor, broker, wholesaler or regulatory adviser. Regulated activity, including sampling or tastings, requires appropriate licensed operators and approvals.",
  general:
    "Professional services are coordinated with appropriately licensed specialists where required. Scope and responsibilities are confirmed before work begins.",
};
