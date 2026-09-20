export const founderBlueprint = {
  id: "founder-blueprint",
  name: "Founder Blueprint",
  publicPrice: 1500,
  currency: "USD",
  priceLabel: "$1,500",
  approvalStatus: "approved",
  proposition: "Turn the idea into a buildable company roadmap.",
  description:
    "A strategic company-development engagement. Before the brand, website, product or campaign, determine what actually needs to be built.",
  session: "60–90 minute strategy session",
  deliverables: [
    {
      title: "Strategy session",
      description:
        "A 60–90 minute working session to understand the idea, decisions and constraints.",
    },
    {
      title: "Concept assessment",
      description:
        "Business concept, opportunity framing, business model considerations and current stage assessment.",
    },
    {
      title: "Market foundation",
      description:
        "Initial market research, competitive landscape research and positioning considerations.",
    },
    {
      title: "Company foundation roadmap",
      description:
        "Entity-formation process, administrative requirements, applicable licensing/permit research, trademark process and professional-resource requirements. Research and coordination only.",
    },
    {
      title: "Brand roadmap",
      description:
        "Naming assessment where required, brand strategy, identity, applicable packaging and creative requirements.",
    },
    {
      title: "Digital roadmap",
      description:
        "Website, applicable e-commerce or application requirements, automation opportunities and customer journey considerations.",
    },
    {
      title: "Commercialization roadmap",
      description:
        "Sales materials and, where applicable, distribution readiness, retail readiness and buyer/distributor materials.",
    },
    {
      title: "Launch roadmap",
      description: "Launch, content, campaign and activation considerations.",
    },
    {
      title: "Execution roadmap",
      description:
        "A prioritized 30-, 60- and 90-day sequence of work, dependencies and next decisions.",
    },
    {
      title: "Your Founder Blueprint",
      description:
        "A professionally designed Dynasty Works Founder Blueprint digital document/PDF, reviewed before delivery.",
    },
  ],
  map: [
    "Foundation",
    "Brand",
    "Product / Service",
    "Digital",
    "Commercialization",
    "Launch",
    "Distribution · when applicable",
    "Activation · when applicable",
    "Growth",
  ],
  process: [
    "Complete intake",
    "Strategy session",
    "Research + architecture",
    "Blueprint development",
    "Blueprint delivery",
    "Next-step review",
  ],
  horizons: [
    {
      days: 30,
      title: "Establish the foundation",
      description:
        "Prioritize the first decisions, assumptions to test and professional input required.",
    },
    {
      days: 60,
      title: "Organize the build",
      description:
        "Sequence brand, product and digital requirements around the agreed foundation.",
    },
    {
      days: 90,
      title: "Prepare execution",
      description:
        "Identify launch, market-entry and next-engagement priorities where relevant.",
    },
  ],
  boundary:
    "Company formation, licensing, permits, trademarks and regulated market activity are addressed through research, coordination and roadmaps. Legal, tax and other regulated professional services must be provided by qualified outside professionals. Their fees and execution are separate from this engagement.",
} as const;
export const blueprintDocumentSections = [
  "Cover",
  "Executive Snapshot",
  "The Idea",
  "Current Position",
  "Opportunity",
  "Business Model",
  "Market Landscape",
  "Company Foundation",
  "Brand Architecture",
  "Product / Service Requirements",
  "Digital Infrastructure",
  "Commercialization",
  "Launch",
  "Distribution / Retail",
  "Activation",
  "Professional Resources Required",
  "30-Day Roadmap",
  "60-Day Roadmap",
  "90-Day Roadmap",
  "Recommended Dynasty Works Engagement",
  "Next Actions",
].map((title) => ({
  title,
  conditional: ["Distribution / Retail", "Activation"].includes(title),
  requiresHumanReview: true as const,
}));
