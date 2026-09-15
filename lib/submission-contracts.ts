import { z } from "zod";
import { inquirySchema } from "@/lib/inquiry";
import {
  companyDraftSchema,
  validateCompanyBuild,
} from "@/lib/company-builder";
import { blueprintIntakeSchema } from "@/lib/blueprint-intake";
const consent = z
  .object({
    evaluation: z.literal(true),
    communication: z.literal(true),
    noticeVersion: z.literal("project-evaluation-v1"),
  })
  .strict();
const common = {
  version: z.literal(1),
  idempotencyKey: z.string().uuid(),
  consent,
  honeypot: z.string().max(0),
  botToken: z.string().max(4096).optional(),
};
const builderSchema = companyDraftSchema.superRefine((b, ctx) => {
  for (const [key, message] of Object.entries(validateCompanyBuild(b)))
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
});
export const submissionSchemas = {
  general: z.object({ ...common, data: inquirySchema }).strict(),
  builder: z.object({ ...common, data: builderSchema }).strict(),
  blueprint: z.object({ ...common, data: blueprintIntakeSchema }).strict(),
};
export type SubmissionKind = keyof typeof submissionSchemas;
export type SubmissionEnvelope = {
  [K in SubmissionKind]: {
    kind: K;
    payload: z.infer<(typeof submissionSchemas)[K]>;
  };
}[SubmissionKind];
export type SubmissionResult =
  | { status: "accepted"; receiptId: string }
  | {
      status:
        | "not_configured"
        | "validation_error"
        | "rate_limited"
        | "rejected"
        | "conflict"
        | "unavailable";
      message: string;
      errors?: Record<string, string[]>;
    };
export type SubmissionUIState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | { state: "disabled"; message: string }
  | { state: "success"; receiptId: string };
// The intake uses only the disabled state. Future success UI requires a confirmed persisted receipt.
export const submissionAvailability = {
  enabled: false as const,
  message:
    "Secure submission is not connected. Nothing has been sent. You can download a local copy.",
};
