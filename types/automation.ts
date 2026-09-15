/** V1.7 proposed contracts, not a running workflow engine. */
export type ExecutionMode = "draft-only" | "approval-required" | "automated";
export type WorkflowRisk = "low" | "medium" | "higher-consequence";
export type ContentStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "FAILED"
  | "ARCHIVED";
export type IntegrationHealth = "HEALTHY" | "ATTENTION" | "FAILED" | "DISABLED";
export type SocialPlatform = "Instagram" | "YouTube" | "TikTok" | "LinkedIn";
export interface WorkflowAction {
  id: string;
  tenantId: string;
  workflowId: string;
  recordId: string;
  revision: number;
  /** Server-generated digest covering recipients, account, schedule, assets and payload. */
  payloadDigest: string;
  idempotencyKey: string;
  mode: ExecutionMode;
  risk: WorkflowRisk;
}
export interface WorkflowApproval {
  actionId: string;
  tenantId: string;
  revision: number;
  payloadDigest: string;
  state: "pending" | "approved" | "rejected" | "expired" | "revoked";
  authorizedActorId: string;
  expiresAt: string;
}
export interface ContentQueueItem {
  id: string;
  tenantId: string;
  campaignId: string;
  platform: SocialPlatform;
  privateAssetIds: string[];
  caption: string;
  scheduledAt: string | null;
  timeZone: string;
  status: ContentStatus;
  revision: number;
  approvalId: string | null;
  providerPublicationId: string | null;
}
export interface AuditEvent {
  id: string;
  tenantId: string;
  occurredAt: string;
  workflowId: string;
  runId: string;
  actionId: string;
  recordId: string;
  executionMode: ExecutionMode;
  approvalState: WorkflowApproval["state"] | "not-required";
  actorId: string | null;
  result: "prepared" | "blocked" | "succeeded" | "failed" | "unknown";
  /** Allowlisted error code only. Never tokens or full sensitive payloads. */
  reasonCode: string | null;
}
export interface WorkflowMonitoring {
  workflowId: string;
  health: IntegrationHealth;
  lastRunAt: string | null;
  successfulRuns: number;
  failedRuns: number;
  lastErrorCode: string | null;
  retryState: "none" | "scheduled" | "exhausted" | "manual-review";
  integrationHealth: IntegrationHealth;
}
export interface WorkflowFailure {
  runId: string;
  actionId: string;
  attempt: number;
  retryAt: string | null;
  category:
    | "timeout"
    | "rate-limit"
    | "outage"
    | "expired-authorization"
    | "validation"
    | "partial-failure"
    | "unknown-result";
  queue: "retry" | "failure" | "manual-review";
  safeReason: string;
}
export interface AutomationCaseStudy {
  projectId: string;
  status: "draft" | "approved";
  approvalReference: string | null;
  before: string;
  systemMap: string[];
  automation: string;
  approvalLogic: string;
  results: {
    metric: string;
    baseline: number;
    observed: number;
    unit: string;
    measurementWindow: string;
    evidenceReference: string;
  }[];
}
/** Configuration is reviewed per workflow; it cannot be inferred from a client form. */
export interface WorkflowDefinition {
  id: string;
  revision: number;
  ownerId: string;
  risk: WorkflowRisk;
  mode: ExecutionMode;
  enabled: false;
  allowedActionTypes: string[];
  approvalRoles: string[];
  retentionPolicyId: string;
  timeoutMs: number;
  maxAttempts: number;
}
