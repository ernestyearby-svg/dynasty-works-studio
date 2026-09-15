import { businessStages } from "@/data/service-catalog";
import { z } from "zod";
import {
  businessTypes,
  physicalBusinessTypes,
  startingPoints,
  allNeeds,
  coreNeeds,
  marketNeeds,
  launchWindows,
  budgetChoices,
  type BuildNeed,
} from "@/data/company-builder";
import type { CompanyBuild, RecommendedService } from "@/types/company";
export const emptyCompanyBuild: CompanyBuild = {
  version: 1,
  businessType: "",
  physicalMarket: false,
  starting: [],
  needs: [],
  launch: "",
  budgetChoice: "",
  budgetNote: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  acknowledged: false,
};
export const companyDraftSchema = z
  .object({
    version: z.literal(1),
    businessStage: z.enum(businessStages).optional(),
    productReady: z.boolean().optional(),
    storefrontReady: z.boolean().optional(),
    uncertainNeeds: z.boolean().optional(),
    redesignIdentity: z.boolean().optional(),
    engagementPreference: z
      .enum(["Explore together", "Do it myself", "Guide me", "Build it for me"])
      .optional(),
    referralSource: z.string().max(200).optional(),
    businessType: z.union([z.enum(businessTypes), z.literal("")]),
    physicalMarket: z.boolean(),
    starting: z.array(z.enum(startingPoints)).max(7),
    needs: z.array(z.enum(allNeeds)).max(allNeeds.length),
    launch: z.union([z.enum(launchWindows), z.literal("")]),
    budgetChoice: z.union([z.enum(budgetChoices), z.literal("")]),
    budgetNote: z.string().max(200),
    name: z.string().max(120),
    company: z.string().max(150),
    email: z.string().max(254),
    phone: z.string().max(40),
    website: z.string().max(2000),
    acknowledged: z.boolean(),
  })
  .strict();
export function hasPhysicalMarket(
  build: Pick<CompanyBuild, "businessType" | "physicalMarket">,
) {
  return (
    !!build.businessType &&
    (physicalBusinessTypes.includes(build.businessType) || build.physicalMarket)
  );
}
export function availableNeeds(
  build: Pick<CompanyBuild, "businessType" | "physicalMarket">,
): readonly BuildNeed[] {
  return hasPhysicalMarket(build) ? allNeeds : coreNeeds;
}
export function normalizeBuild(build: CompanyBuild): CompanyBuild {
  const allowed = availableNeeds(build);
  return {
    ...build,
    needs: [...new Set(build.needs)].filter((n) => allowed.includes(n)),
    starting: [...new Set(build.starting)].filter(
      (s) => s !== startingPoints[0] || build.starting.length === 1,
    ),
  };
}
export function recommendServices(build: CompanyBuild): RecommendedService[] {
  const rec: RecommendedService[] = [];
  const add = (
    service: BuildNeed,
    reason: string,
    source: RecommendedService["source"] = "starting-point",
  ) => {
    if (
      !build.needs.includes(service) &&
      !rec.some((r) => r.service === service)
    )
      rec.push({ service, reason, source, optional: true });
  };
  if (
    !build.starting.includes(startingPoints[2]) &&
    !build.starting.includes(startingPoints[6])
  )
    add(
      "Company Setup",
      "Coordinate the foundation and identify where licensed professionals are needed.",
    );
  if (!build.starting.includes(startingPoints[3]))
    add(
      "Brand Identity",
      "Create a coherent identity before expanding the touchpoints.",
    );
  if (!build.starting.includes(startingPoints[4]))
    add("Website", "Give the company a clear digital home.");
  if (
    build.starting.includes(startingPoints[5]) ||
    build.starting.includes(startingPoints[6])
  )
    add("Ongoing Support", "Build on what is already working.");
  if (hasPhysicalMarket(build)) {
    add(
      "Retail Readiness",
      "Prepare buyer materials and the product presentation.",
      "business-type",
    );
    add(
      "Distribution Strategy",
      "Explore suitable channels and a route to market.",
      "business-type",
    );
    add(
      "Market Activation",
      "Connect the brand to real-world audiences.",
      "business-type",
    );
  }
  return rec;
}
export function validateCompanyStep(
  build: CompanyBuild,
  step: number,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0 && !build.businessType)
    errors.businessType = "Choose a business type.";
  if (step === 1 && !build.starting.length)
    errors.starting = "Select at least one starting point.";
  if (step === 2 && !build.needs.length && !build.uncertainNeeds)
    errors.needs = "Select at least one need.";
  if (step === 3 && !build.launch) errors.launch = "Choose a launch window.";
  if (step === 4) {
    if (!build.budgetChoice)
      errors.budgetChoice = "Choose how to discuss the project range.";
    if (build.budgetChoice === budgetChoices[1] && !build.budgetNote.trim())
      errors.budgetNote = "Enter your range or choose to define it together.";
  }
  if (step === 5) {
    if (build.name.trim().length < 2) errors.name = "Enter your name.";
    if (!build.company.trim())
      errors.company = "Enter a company name or ‘Not named yet’.";
    if (!z.string().email().safeParse(build.email.trim()).success)
      errors.email = "Enter a valid email address.";
    if (
      build.website &&
      !z
        .string()
        .url()
        .refine((s) => /^https?:\/\//i.test(s))
        .safeParse(build.website.trim()).success
    )
      errors.website = "Use a full https:// or http:// address.";
    if (!build.acknowledged)
      errors.acknowledged =
        "Acknowledge how this local preview handles your details.";
  }
  return errors;
}
export function validateCompanyBuild(build: CompanyBuild) {
  return Object.assign(
    {},
    ...[0, 1, 2, 3, 4, 5].map((step) => validateCompanyStep(build, step)),
  ) as Record<string, string>;
}
export function parseSavedBuild(
  raw: string,
): { build: CompanyBuild; step: number } | null {
  try {
    if (raw.length > 20000) return null;
    const parsed = JSON.parse(raw);
    const result = companyDraftSchema.safeParse(parsed.build);
    if (
      !result.success ||
      !Number.isInteger(parsed.step) ||
      parsed.step < 0 ||
      parsed.step > 6
    )
      return null;
    const build = normalizeBuild(result.data);
    let step = parsed.step;
    for (let i = 0; i < step; i++)
      if (Object.keys(validateCompanyStep(build, i)).length) {
        step = i;
        break;
      }
    return { build, step };
  } catch {
    return null;
  }
}
export const companyBuildStorageKey = "dynasty-company-build-v1";
export function isMarketNeed(value: string) {
  return (marketNeeds as readonly string[]).includes(value);
}
