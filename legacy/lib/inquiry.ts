import { marketNeeds } from "@legacy/data/company-builder";
import { z } from "zod";
export const inquiryServices = [
  "Brand Strategy",
  "Brand Identity",
  "Packaging",
  "Website",
  "E-commerce",
  "App / Digital Product",
  "AI / Automation",
  "3D / Visualization",
  "Advertising",
  "Fashion / Merchandise",
  "Illustration",
  "Presentation / Collateral",
  "Multiple Services",
  "Other",
  "Company Setup",
  "Trademark Coordination",
  "Licensing Research",
  ...marketNeeds,
] as const;
export const stages = [
  "Idea",
  "Existing Brand",
  "Relaunch",
  "Expansion",
] as const;
export const budgets = [
  "Let’s discuss",
  "I have a range to discuss",
  "Range not decided",
] as const;
export const timeframes = [
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Flexible",
] as const;
const clean = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine(
      (s) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s),
      "Remove control characters.",
    );
const optionalUrl = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .url()
    .max(2000)
    .refine((s) => /^https?:\/\//i.test(s), "Use an https:// or http:// URL."),
]);
export const inquirySchema = z
  .object({
    services: z
      .array(z.enum(inquiryServices))
      .min(1, "Select at least one service.")
      .max(inquiryServices.length),
    physicalMarket: z.boolean().default(false),
    description: clean(20, 5000),
    company: clean(1, 150),
    stage: z.enum(stages),
    budget: z.enum(budgets),
    timeframe: z.enum(timeframes),
    name: clean(2, 120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40),
    website: optionalUrl,
    reference: optionalUrl,
    consent: z.literal(true),
    honeypot: z.string().max(0),
  })
  .strict();
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryAdapter = {
  submit: (inquiry: Inquiry) => Promise<{ id: string }>;
  createUpload: (file: {
    name: string;
    size: number;
    type: string;
  }) => Promise<{ uploadUrl: string; key: string }>;
};
// Intentionally absent. Implement durable storage, abuse prevention and consent handling before attaching a provider.
export const inquiryAdapter: InquiryAdapter | null = null;
export const uploadPolicy = {
  maxFiles: 5,
  maxBytesPerFile: 10 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};
