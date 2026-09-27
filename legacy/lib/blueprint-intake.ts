import { z } from "zod";
import { businessTypes, physicalBusinessTypes } from "@legacy/data/company-builder";
import { businessStages } from "@legacy/data/service-catalog";
export const intakeText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Please use at least ${min} characters.`)
    .max(max, `Please keep this to ${max} characters.`)
    .refine(
      (s) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(s),
      "Remove control characters.",
    );
export const safeOptionalUrl = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .url()
    .max(2000)
    .refine((s) => /^https?:\/\//i.test(s), "Use an http:// or https:// link."),
]);
export const blueprintIntakeSchema = z
  .object({
    name: intakeText(2, 120),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    phone: intakeText(0, 40),
    company: intakeText(1, 150),
    website: safeOptionalUrl,
    businessType: z.enum(businessTypes, {
      errorMap: () => ({ message: "Choose a business type." }),
    }),
    businessStage: z.enum(businessStages, {
      errorMap: () => ({ message: "Choose your current stage." }),
    }),
    physicalMarket: z.boolean(),
    ideaDescription: intakeText(20, 3000),
    problemDescription: intakeText(10, 2000),
    targetCustomer: intakeText(10, 1500),
    existingAssets: intakeText(0, 2000),
    requestedNeeds: intakeText(10, 2000),
    targetLaunch: intakeText(1, 200),
    primaryMarket: intakeText(1, 200),
    competitors: intakeText(0, 1500),
    brandAssets: intakeText(0, 1500),
    companyDocuments: intakeText(0, 1000),
    digitalAssets: intakeText(0, 1500),
    distributionGoals: intakeText(0, 2000),
    biggestQuestion: intakeText(10, 2000),
    references: z
      .array(
        z
          .string()
          .trim()
          .url()
          .max(2000)
          .refine(
            (s) => /^https?:\/\//i.test(s),
            "Use http:// or https:// links.",
          ),
      )
      .max(5),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (
      v.distributionGoals &&
      !v.physicalMarket &&
      !physicalBusinessTypes.includes(v.businessType)
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["distributionGoals"],
        message: "Distribution goals apply only to physical-market businesses.",
      });
  });
export type BlueprintIntake = z.infer<typeof blueprintIntakeSchema>;
export type BlueprintDraft = Omit<
  BlueprintIntake,
  "businessType" | "businessStage"
> & {
  businessType: BlueprintIntake["businessType"] | "";
  businessStage: BlueprintIntake["businessStage"] | "";
};
export const emptyBlueprintDraft: BlueprintDraft = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  businessType: "",
  businessStage: "",
  physicalMarket: false,
  ideaDescription: "",
  problemDescription: "",
  targetCustomer: "",
  existingAssets: "",
  requestedNeeds: "",
  targetLaunch: "",
  primaryMarket: "",
  competitors: "",
  brandAssets: "",
  companyDocuments: "",
  digitalAssets: "",
  distributionGoals: "",
  biggestQuestion: "",
  references: [],
};
export const blueprintStepFields: (keyof BlueprintDraft)[][] = [
  [
    "name",
    "email",
    "phone",
    "company",
    "website",
    "businessType",
    "businessStage",
  ],
  [
    "ideaDescription",
    "problemDescription",
    "targetCustomer",
    "biggestQuestion",
  ],
  [
    "existingAssets",
    "requestedNeeds",
    "brandAssets",
    "companyDocuments",
    "digitalAssets",
    "references",
  ],
  ["targetLaunch", "primaryMarket", "competitors", "distributionGoals"],
];
export function validateBlueprintStep(draft: BlueprintDraft, step: number) {
  const parsed = blueprintIntakeSchema.safeParse(draft);
  const errors: Record<string, string> = {};
  if (!parsed.success)
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (
        step === 4 ||
        blueprintStepFields[step]?.includes(key as keyof BlueprintDraft)
      )
        errors[key] = key.replace(/([A-Z])/g, " $1") + ": " + issue.message;
    }
  return errors;
}
export function blueprintIntakeText(draft: BlueprintDraft) {
  return [
    "DYNASTY WORKS STUDIO — FOUNDER BLUEPRINT INTAKE",
    "LOCAL COPY ONLY. Not submitted. No payment or booking.",
    ...Object.entries(draft).map(
      ([key, value]) =>
        key + ": " + (Array.isArray(value) ? value.join("\n") : String(value)),
    ),
  ].join("\n\n");
}
