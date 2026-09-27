import type { SubmissionEnvelope } from "@/lib/submission-contracts";
import type { BuildRoadmap } from "@/lib/recommendation-engine";
// Private server contracts. No credentials, project IDs or runtime connections.
export type LeadStatus =
  | "NEW"
  | "REVIEWING"
  | "QUALIFIED"
  | "STRATEGY_SCHEDULED"
  | "PROPOSAL"
  | "ENGAGED"
  | "NOT_NOW"
  | "CLOSED";
export interface LeadRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string;
  website: string | null;
  source: string;
  status: LeadStatus;
}
export interface SubmissionRepository {
  // Atomic transaction: claim idempotency key + payload hash, create lead and matching detail row.
  // Replay returns the same receipt only for identical payloads; mismatches return conflict.
  persistAtomic(
    input: SubmissionEnvelope,
    derived: { roadmap?: BuildRoadmap },
  ): Promise<
    { status: "accepted"; receiptId: string } | { status: "conflict" }
  >;
}
export interface SubmissionDependencies {
  enabled: boolean;
  repository: SubmissionRepository | null;
  limiter: {
    consume(
      request: Request,
    ): Promise<{ allowed: boolean; retryAfterSeconds: number }>;
  } | null;
  botVerifier: {
    verify(token: string, request: Request): Promise<boolean>;
  } | null;
}
export const disabledSubmissionDependencies: SubmissionDependencies = {
  enabled: false,
  repository: null,
  limiter: null,
  botVerifier: null,
};
export interface PrivateUploadProvider {
  authorizeUpload(input: {
    engagementId: string;
    filename: string;
    mimeType: string;
    size: number;
  }): Promise<{ uploadUrl: string; objectPath: string; expiresAt: string }>;
}
export interface PaymentProvider {
  createApprovedCheckout(input: {
    engagementId: string;
    offerId: "founder-blueprint";
    idempotencyKey: string;
  }): Promise<{ checkoutUrl: string }>;
  verifyWebhook(
    request: Request,
  ): Promise<{
    eventId: string;
    engagementId: string;
    state: "paid" | "failed" | "refunded";
  }>;
}
export const paymentProvider: PaymentProvider | null = null;
export const privateUploadProvider: PrivateUploadProvider | null = null;
