import { creationStages, stageForPhase } from "@legacy/data/company-creation";
import { recommendAutomation } from "@legacy/lib/automation-plan";
import { founderBlueprint } from "@legacy/data/founder-blueprint";
import {
  serviceById,
  roadmapPhases,
  type CatalogService,
  type BusinessStage,
  type RoadmapPhase,
} from "@legacy/data/service-catalog";
import { engagementPackages } from "@legacy/data/packages";
import { startingPoints, type BuildNeed } from "@legacy/data/company-builder";
import { hasPhysicalMarket, normalizeBuild } from "./company-builder";
import type { CompanyBuild } from "@legacy/types/company";
export interface RoadmapItem {
  serviceId: string;
  reason: string;
  timing: "initial" | "future";
  prerequisiteNotes: string[];
  source: "requested" | "dependency" | "suggested";
}
export interface BuildRoadmap {
  automation: ReturnType<typeof recommendAutomation>;
  stage: BusinessStage;
  phases: { name: RoadmapPhase; items: RoadmapItem[] }[];
  items: RoadmapItem[];
  engagement: { id: string; name: string; reason: string };
  timelineNote: string;
  specialistNotes: string[];
}
export const needServices: Record<BuildNeed, string[]> = {
  "Company Setup": [
    "start-business-concept-strategy",
    "start-company-formation-process-coordination",
    "start-launch-roadmap-development",
  ],
  Naming: ["start-naming-strategy", "brand-naming"],
  "Trademark Coordination": ["start-trademark-process-coordination"],
  "Licensing Research": ["start-licensing-research"],
  "Brand Identity": [
    "brand-brand-strategy",
    "brand-logo-design",
    "brand-identity-systems",
    "brand-brand-guidelines",
  ],
  Packaging: ["brand-packaging-design", "brand-label-design"],
  Website: [
    "build-website-strategy",
    "build-website-design",
    "build-website-development",
  ],
  "E-commerce": ["build-e-commerce"],
  Application: ["build-web-applications"],
  "AI / Automation": ["build-ai-integrations", "build-workflow-automation"],
  Advertising: ["launch-advertising-creative"],
  "Social Content": ["launch-social-media-creative"],
  Video: ["launch-vertical-video"],
  "Pitch Deck": ["publish-pitch-decks"],
  "E-book / Publication": ["publish-e-books"],
  "Business Collateral": ["brand-marketing-collateral"],
  "Ongoing Support": ["grow-creative-retainers", "grow-growth-strategy"],
  Launch: [
    "launch-launch-strategy",
    "launch-campaign-creative",
    "launch-launch-calendar",
  ],
  "Website Optimization": [
    "grow-website-optimization",
    "grow-analytics-review",
  ],
  "E-commerce Optimization": [
    "grow-e-commerce-optimization",
    "grow-analytics-review",
  ],
  "Distribution Strategy": [
    "distribute-route-to-market-strategy",
    "distribute-distribution-readiness",
    "distribute-distributor-targeting",
  ],
  "Retail Readiness": ["distribute-retail-readiness", "distribute-sell-sheets"],
  "Distributor Materials": [
    "distribute-distributor-presentation",
    "distribute-product-catalogs",
  ],
  "Buyer Presentation": ["distribute-buyer-presentation"],
  "Market Activation": [
    "activate-market-activation-strategy",
    "activate-product-launch-activation",
  ],
  "Sampling / Tastings": [
    "activate-sampling-programs",
    "activate-tasting-programs",
  ],
  "Brand Ambassador Program": ["activate-brand-ambassador-programs"],
  "Retail Displays": ["activate-retail-display-design"],
  "Trade Shows / Events": ["activate-trade-show-creative"],
  "Market Expansion": [
    "distribute-market-expansion-planning",
    "grow-market-expansion",
  ],
};
export function inferStage(build: CompanyBuild): BusinessStage {
  return (
    build.businessStage ||
    (build.starting.includes(startingPoints[6])
      ? "Growing"
      : build.starting.includes(startingPoints[5])
        ? "Operating"
        : build.starting.includes(startingPoints[0])
          ? "Idea"
          : "Preparing to launch")
  );
}
const identityAssets = new Set([
  "brand-logo-design",
  "brand-identity-systems",
  "brand-typography-systems",
  "brand-color-systems",
  "brand-brand-guidelines",
  "brand-brand-strategy",
]);
export function generateRoadmap(input: CompanyBuild): BuildRoadmap {
  const b = normalizeBuild(input),
    stage = inferStage(b),
    physical = hasPhysicalMarket(b);
  const existingIdentity = b.starting.includes(startingPoints[3]),
    existingWebsite = b.starting.includes(startingPoints[4]);
  const existingCompany =
    b.starting.includes(startingPoints[2]) ||
    b.starting.includes(startingPoints[6]);
  const items = new Map<string, RoadmapItem>();
  const fulfilled = (id: string) =>
    (existingIdentity && !b.redesignIdentity && identityAssets.has(id)) ||
    (b.starting.includes(startingPoints[1]) &&
      ["brand-naming", "start-naming-strategy"].includes(id)) ||
    (existingCompany && id === "start-company-formation-process-coordination");
  const eligible = (s: CatalogService) =>
    s.active && (physical || !["distribute", "activate"].includes(s.practice));
  function add(
    id: string,
    reason: string,
    source: RoadmapItem["source"] = "suggested",
    forceFuture = false,
    visiting = new Set<string>(),
  ) {
    const s = serviceById[id];
    if (!s || !eligible(s) || fulfilled(id) || visiting.has(id)) return;
    if (id === "grow-website-optimization" && !existingWebsite) {
      add(
        "build-website-development",
        "A website foundation is needed before optimization.",
        "dependency",
      );
      return;
    }
    if (id === "grow-e-commerce-optimization" && !b.storefrontReady) {
      add(
        "build-e-commerce",
        "Create the storefront before optimizing it.",
        "dependency",
      );
      return;
    }
    if (
      existingWebsite &&
      b.needs.includes("Website") &&
      id.startsWith("build-website-")
    ) {
      add(
        "grow-website-optimization",
        "Review the existing website before deciding whether a rebuild is needed.",
        "requested",
      );
      return;
    }
    const old = items.get(id);
    if (old) {
      if (source === "requested") {
        old.source = source;
        old.reason = reason;
      }
      return;
    }
    const next = new Set(visiting).add(id);
    for (const dep of s.dependencies)
      add(
        dep,
        "A foundation for " + s.name.toLowerCase() + ".",
        "dependency",
        false,
        next,
      );
    const notes: string[] = [];
    if (
      (s.practice === "distribute" || s.practice === "activate") &&
      !b.productReady
    )
      notes.push(
        "Confirm product or location readiness, operational capacity and required permissions before execution.",
      );
    if (s.practice === "activate" && stage === "Idea")
      notes.push("Complete the company, product and launch foundations first.");
    const future =
      forceFuture ||
      notes.length > 0 ||
      (s.practice === "grow" &&
        ["Idea", "Preparing to launch"].includes(stage));
    const deps = s.dependencies.filter(
      (dep) => items.get(dep)?.timing === "future",
    );
    if (deps.length)
      notes.push("Complete the earlier prerequisite work first.");
    items.set(id, {
      serviceId: id,
      reason,
      timing: future || deps.length ? "future" : "initial",
      prerequisiteNotes: notes,
      source,
    });
  }
  const automation = recommendAutomation(b, stage);
  for (const need of b.needs)
    for (const id of need === "AI / Automation"
      ? [...new Set(automation?.services.map((s) => s.parentServiceId) || [])]
      : needServices[need])
      add(
        id,
        need === "AI / Automation"
          ? automation!.reason
          : "Included because you selected " + need.toLowerCase() + ".",
        "requested",
      );
  if (stage === "Idea" && b.needs.length > 1) {
    add(
      "start-business-concept-strategy",
      "Frame the opportunity before committing to an integrated build.",
    );
    add("start-market-research", "Test the audience and market assumptions.");
  }
  const marketIntent = b.needs.some((n) =>
    [
      "Distribution Strategy",
      "Retail Readiness",
      "Distributor Materials",
      "Market Expansion",
      "Market Activation",
      "Sampling / Tastings",
    ].includes(n),
  );
  if (physical && marketIntent) {
    add("distribute-sell-sheets", "Give buyers a concise product story.");
    add(
      "distribute-distributor-presentation",
      "Prepare a coherent buyer conversation.",
    );
  }
  // Business type adds a small set of relevant suggestions, only within the expressed scope.
  if (
    b.businessType === "Food / Beverage" &&
    (b.needs.includes("Packaging") || marketIntent)
  ) {
    add(
      "brand-product-visualization",
      "Explore the product presentation before production.",
    );
    add(
      "start-licensing-research",
      "Identify jurisdiction-specific questions for authorized specialists.",
    );
    if (marketIntent) {
      add(
        "activate-tasting-programs",
        "Optional future audience testing for the food or beverage offer.",
        "suggested",
        true,
      );
      add(
        "distribute-market-expansion-planning",
        "Revisit wider markets after the initial channel is proven.",
        "suggested",
        true,
      );
    }
  }
  if (
    b.businessType === "Fashion" &&
    b.needs.some((n) =>
      ["E-commerce", "Launch", "Advertising", "Packaging"].includes(n),
    )
  ) {
    add(
      "brand-product-visualization",
      "Shape the presentation of the collection.",
    );
    add(
      "launch-campaign-creative",
      "Connect the collection to launch creative.",
    );
  }
  if (
    b.businessType === "Technology" &&
    b.needs.some((n) =>
      ["Application", "Website", "AI / Automation"].includes(n),
    )
  ) {
    add(
      "build-analytics-foundations",
      "Establish a way to evaluate the digital experience.",
    );
    if (b.needs.includes("Application"))
      add(
        "build-database-architecture",
        "Plan the data model for the application.",
      );
  }
  if (
    b.businessType === "Professional Service" &&
    b.needs.some((n) => ["Website", "Brand Identity", "Launch"].includes(n))
  ) {
    add(
      "brand-brand-positioning",
      "Clarify the service offer and intended clients.",
    );
    add("build-landing-pages", "Provide a focused enquiry path.");
  }
  if (
    b.businessType === "Hospitality" &&
    (marketIntent || stage === "Growing")
  ) {
    add(
      "activate-hospitality-activations",
      "Plan an experience around the venue and guests.",
    );
    add(
      "grow-brand-management",
      "Keep the customer experience coherent as the business grows.",
    );
  }
  if (
    b.businessType === "E-commerce" &&
    b.needs.some((n) =>
      ["E-commerce", "E-commerce Optimization", "Launch"].includes(n),
    )
  ) {
    add(
      "launch-email-campaign-assets",
      "Support the customer journey beyond the storefront.",
    );
    add(
      "build-analytics-foundations",
      "Measure the storefront journey before making changes.",
    );
  }
  if (b.uncertainNeeds) {
    add(
      "start-business-concept-strategy",
      "Clarify the idea and the decisions you want help making.",
    );
    add(
      "start-launch-roadmap-development",
      "Determine which work is needed and in what order.",
    );
  }
  const all = [...items.values()];
  const phases = roadmapPhases
    .map((name) => ({
      name,
      items: all.filter(
        (i) =>
          (automation?.services.some((s) => s.parentServiceId === i.serviceId)
            ? "Automation System"
            : serviceById[i.serviceId].phase) === name,
      ),
    }))
    .filter((p) => p.items.length);
  const has = (p: RoadmapPhase) => phases.some((x) => x.name === p);
  const early = stage === "Idea" || stage === "Preparing to launch";
  const assetCount = [
    existingIdentity,
    existingWebsite,
    existingCompany,
    b.productReady,
    b.storefrontReady,
  ].filter(Boolean).length;
  const blueprintFit =
    (early &&
      ((assetCount <= 1 && (b.needs.length > 0 || b.uncertainNeeds)) ||
        (b.needs.length >= 3 && phases.length >= 3))) ||
    (!!b.uncertainNeeds && (b.needs.length !== 1 || early));
  let packageId = "company-launch";
  if (stage === "Growing" && marketIntent) packageId = "market-expansion";
  else if (
    b.needs.includes("Ongoing Support") ||
    b.needs.some((n) => n.includes("Optimization"))
  )
    packageId = "growth-partnership";
  else if (phases.length >= 7 && b.needs.includes("Company Setup"))
    packageId = "full-company-build";
  else if (physical && marketIntent) packageId = "brand-to-market";
  else if (has("Digital") && (has("Brand") || has("Launch")))
    packageId = "company-launch";
  else if (has("Brand") && !has("Digital")) packageId = "identity-build";
  else if (all.length > 7) packageId = "company-launch";
  if (blueprintFit) packageId = "founder-blueprint";
  const pkg = engagementPackages.find((p) => p.id === packageId)!;
  const engagement =
    b.engagementPreference === "Do it myself"
      ? {
          id: "dynasty-tools",
          name: "Dynasty Tools",
          reason:
            "You prefer self-guided resources. Approved tools will be offered when available; specialist tasks still require professional review.",
        }
      : (!blueprintFit && b.engagementPreference === "Guide me") ||
          (!blueprintFit &&
            all.length <= 4 &&
            packageId !== "growth-partnership" &&
            b.engagementPreference !== "Build it for me")
        ? {
            id: "dynasty-guided",
            name: "Dynasty Guided",
            reason:
              "A focused strategy or review engagement may fit this scope.",
          }
        : {
            id: pkg.id,
            name: pkg.name,
            reason: blueprintFit
              ? b.uncertainNeeds
                ? "You want help deciding what needs to be built. Founder Blueprint clarifies the requirements and organizes a reviewed execution sequence."
                : "Your " +
                  stage.toLowerCase() +
                  "-stage build spans " +
                  phases.map((p) => p.name.toLowerCase()).join(", ") +
                  ". Founder Blueprint organizes those dependencies before execution begins."
              : pkg.idealFor +
                ". The roadmap, rather than every package service, defines the starting discussion.",
          };
  return {
    stage,
    automation,
    phases,
    items: all,
    engagement,
    timelineNote: ["ASAP", "30–60 Days"].includes(b.launch)
      ? "For this near-term window, review the initial phase first and sequence later work separately. No delivery date is promised."
      : b.launch === "Exploring"
        ? "Use this roadmap to explore the sequence before committing to a launch date."
        : "Phase order reflects dependencies. Scheduling follows scope review and any external approvals.",
    specialistNotes: all.some(
      (i) => serviceById[i.serviceId].professionalBoundary === "COORDINATED",
    )
      ? [
          "Legal and tax advice, regulated filings, licensing decisions and regulated distribution must be handled by appropriately authorized specialists. No professional partner is confirmed by this roadmap.",
        ]
      : [],
  };
}
export interface BuilderLeadPayload {
  builderSessionId: string;
  createdAt: string;
  businessType: string;
  businessStage: BusinessStage;
  existingAssets: string[];
  selectedNeeds: string[];
  automation?: CompanyBuild["automation"];
  launchTimeline: string;
  budgetRange: string;
  recommendedServices: RoadmapItem[];
  recommendedPhases: RoadmapPhase[];
  recommendedPackage: string;
  contactInformation: {
    name: string;
    company: string;
    email: string;
    phone: string;
    website: string;
  };
  consentState: { localDraftAcknowledged: boolean; submissionConsent: false };
  referralSource: string | null;
}
export function createLeadPayload(
  b: CompanyBuild,
  identity: { builderSessionId: string; createdAt: string },
): BuilderLeadPayload {
  const r = generateRoadmap(b);
  return {
    ...identity,
    businessType: b.businessType,
    businessStage: r.stage,
    existingAssets: [
      ...b.starting,
      ...(b.productReady ? ["Product or location ready"] : []),
      ...(b.storefrontReady ? ["Existing e-commerce store"] : []),
    ],
    selectedNeeds: b.needs,
    automation: normalizeBuild(b).automation,
    launchTimeline: b.launch,
    budgetRange: b.budgetNote || b.budgetChoice,
    recommendedServices: r.items,
    recommendedPhases: r.phases.map((p) => p.name),
    recommendedPackage: r.engagement.id,
    contactInformation: {
      name: b.name,
      company: b.company,
      email: b.email,
      phone: b.phone,
      website: b.website,
    },
    consentState: {
      localDraftAcknowledged: b.acknowledged,
      submissionConsent: false,
    },
    referralSource: b.referralSource || null,
  };
}
export function roadmapText(b: CompanyBuild): string {
  const r = generateRoadmap(b);
  const names = (timing: "initial" | "future") =>
    r.items
      .filter((i) => i.timing === timing)
      .map((i) => "- " + serviceById[i.serviceId].name);
  return [
    "DYNASTY WORKS STUDIO",
    "COMPANY BUILD ROADMAP",
    "Business type: " + b.businessType,
    "Current stage: " + r.stage,
    "",
    r.timelineNote,
    "",
    "COMPANY CREATION / FOUR-STAGE OVERVIEW",
    ...creationStages.map(
      (stage) =>
        stage.name +
        ": " +
        (r.phases
          .filter((p) => stageForPhase[p.name] === stage.id)
          .map((p) => p.name)
          .join(", ") || "No additional scope indicated by this diagnostic."),
    ),
    "",
    "RECOMMENDED PHASES + SERVICES",
    ...r.phases.flatMap((p, i) => [
      "",
      String(i + 1).padStart(2, "0") + " " + p.name.toUpperCase(),
      ...p.items.map(
        (x) =>
          "- " +
          serviceById[x.serviceId].name +
          " [" +
          (x.timing === "initial" ? "Initial priority" : "Future phase") +
          "] — " +
          x.reason +
          " " +
          x.prerequisiteNotes.join(" "),
      ),
    ]),
    "",
    ...(r.automation
      ? [
          "AUTOMATION SYSTEM",
          r.automation.engagement,
          r.automation.reason,
          r.automation.context,
          "Desired outcomes: " + r.automation.goals.join(", "),
          "Starting mode: " + r.automation.mode,
          ...r.automation.services.map((s) => "- " + s.name),
          ...r.automation.stages.map((s) => s.name + " [" + s.timing + "]"),
          r.automation.status,
          "",
        ]
      : []),
    "IMMEDIATE PRIORITIES",
    ...names("initial"),
    "",
    "FUTURE PHASES",
    ...names("future"),
    "",
    "RECOMMENDED ENGAGEMENT: " + r.engagement.name,
    ...(r.engagement.id === founderBlueprint.id
      ? [
          founderBlueprint.priceLabel,
          "Strategy and roadmap engagement. Execution of the recommended services is scoped separately.",
          "Review the approved scope: /founder-blueprint",
          "Start the intake preview: /founder-blueprint/intake",
        ]
      : []),
    r.engagement.reason,
    ...r.specialistNotes,
    "Preliminary roadmap. Final scope follows review. No submission, purchase or delivery commitment.",
  ].join("\n");
}
