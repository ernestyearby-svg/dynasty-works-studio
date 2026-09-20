import type {
  WorkflowAction,
  WorkflowApproval,
  ContentStatus,
} from "@/types/automation";
/** A planning validator only, never execution authorization. A future server must load verified records and roles. */
export function evaluateActionPlan(
  action: WorkflowAction,
  approval: WorkflowApproval | null,
  context: {
    now: string;
    authorizedActorIds: readonly string[];
    approvedLowRiskRule: boolean;
  },
) {
  if (action.mode === "draft-only")
    return { allowed: false, reason: "draft-only" };
  if (action.mode === "automated")
    return {
      allowed: action.risk === "low" && context.approvedLowRiskRule,
      reason: "low-risk-rule-required",
    };
  const time = Date.parse(context.now),
    expiry = Date.parse(approval?.expiresAt || "");
  const valid =
    !!approval &&
    approval.state === "approved" &&
    approval.actionId === action.id &&
    approval.tenantId === action.tenantId &&
    approval.revision === action.revision &&
    approval.payloadDigest === action.payloadDigest &&
    context.authorizedActorIds.includes(approval.authorizedActorId) &&
    Number.isFinite(time) &&
    Number.isFinite(expiry) &&
    expiry > time;
  return {
    allowed: valid,
    reason: valid ? "reviewed-action" : "current-authorized-approval-required",
  };
}
export const contentTransitions: Readonly<
  Record<ContentStatus, readonly ContentStatus[]>
> = {
  DRAFT: ["REVIEW", "ARCHIVED"],
  REVIEW: ["DRAFT", "APPROVED", "ARCHIVED"],
  APPROVED: ["DRAFT", "SCHEDULED", "ARCHIVED"],
  SCHEDULED: ["DRAFT", "PUBLISHED", "FAILED"],
  PUBLISHED: ["ARCHIVED"],
  FAILED: ["REVIEW", "ARCHIVED"],
  ARCHIVED: [],
};
export const contentActions = [
  "Preview",
  "Approve",
  "Request Revision",
  "Schedule",
  "Cancel",
] as const;
/** Transition graph alone never authorizes a change. Publish requires a verified provider receipt. */
export function validateContentTransition(
  from: ContentStatus,
  to: ContentStatus,
  evidence: {
    authorized: boolean;
    approvalCurrent: boolean;
    providerReceipt: boolean;
    cancelConfirmed: boolean;
  },
) {
  if (!evidence.authorized || !contentTransitions[from].includes(to))
    return false;
  if (
    (to === "APPROVED" || to === "SCHEDULED" || to === "PUBLISHED") &&
    !evidence.approvalCurrent
  )
    return false;
  if (to === "PUBLISHED" && !evidence.providerReceipt) return false;
  if (from === "SCHEDULED" && to === "DRAFT" && !evidence.cancelConfirmed)
    return false;
  return true;
}
