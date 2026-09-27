import type {
  SocialPlatform,
  WorkflowAction,
  IntegrationHealth,
} from "@/types/automation";
/** Server-side contracts only. No provider SDKs, credentials, endpoints or implementations. */
export interface SystemOfRecordAdapter {
  reserveAction(
    action: WorkflowAction,
  ): Promise<"reserved" | "duplicate" | "conflict">;
  recordResult(
    actionId: string,
    result: "succeeded" | "failed" | "unknown",
    providerReference?: string,
  ): Promise<void>;
}
export interface OrchestrationAdapter {
  enqueue(actionId: string): Promise<void>;
  cancel(actionId: string): Promise<void>;
}
export interface EmailAdapter {
  search(tenantId: string, query: string): Promise<{ threadId: string }[]>;
  classify(
    threadId: string,
  ): Promise<{ category: string; requiresReview: boolean }>;
  draft(actionId: string): Promise<{ draftId: string }>;
  sendApproved(actionId: string): Promise<{ messageId: string }>;
  associate(threadId: string, recordId: string): Promise<void>;
  trackFollowUp(threadId: string, dueAt: string): Promise<void>;
}
export interface SocialAdapter {
  platform: SocialPlatform;
  /** Resolve current API availability, auth scopes, media/caption/video/metadata constraints and quotas server-side. */
  capabilities(
    accountId: string,
  ): Promise<{
    canPublish: boolean;
    canSchedule: boolean;
    health: IntegrationHealth;
    requirements: Record<string, string>;
    checkedAt: string;
  }>;
  validateDraft(
    contentId: string,
  ): Promise<{ valid: boolean; issues: string[] }>;
  publishApproved(actionId: string): Promise<{ publicationId: string }>;
  reconcile(
    actionId: string,
  ): Promise<{
    state: "published" | "not-published" | "unknown";
    publicationId?: string;
  }>;
  cancelScheduled(actionId: string): Promise<{ cancelled: boolean }>;
}
export interface AutomationAdapters {
  recordStore: SystemOfRecordAdapter | null;
  orchestration: OrchestrationAdapter | null;
  email: EmailAdapter | null;
  social: Partial<Record<SocialPlatform, SocialAdapter>>;
}
export const automationAdapters: Readonly<AutomationAdapters> = Object.freeze({
  recordStore: null,
  orchestration: null,
  email: null,
  social: Object.freeze({}),
});
/** Deliberately has no enable switch or dispatch path in V1.7. */
export async function executeAutomation(): Promise<{
  status: "disabled";
  executed: false;
}> {
  return { status: "disabled", executed: false };
}
