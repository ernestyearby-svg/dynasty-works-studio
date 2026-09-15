import type { BlueprintIntake } from "@/lib/blueprint-intake";
// Internal document-generation contract. No content is generated or delivered automatically.
export interface BlueprintDraftDocument {
  id: string;
  intakeId: string;
  revision: number;
  state:
    | "research_pending"
    | "draft"
    | "human_review"
    | "revision_requested"
    | "approved"
    | "delivered";
  sections: {
    title: string;
    body: string | null;
    researchSources: string[];
    clientSourceFields: (keyof BlueprintIntake)[];
    applicable: boolean;
  }[];
  reviewedBy: string | null;
  reviewedAt: string | null;
  approvedRevision: number | null;
  privatePdfObjectPath: string | null;
}
export interface BlueprintProjectView {
  engagementId: string;
  status: "onboarding" | "in_progress" | "awaiting_review" | "delivered";
  sessionAt: string | null;
  researchStatus: "not_started" | "in_progress" | "ready";
  targetDeliveryDate: string | null;
  documentId: string | null;
  fileIds: string[];
  messageThreadId: string | null;
  approvalIds: string[];
  nextEngagementId: string | null;
}
export function canDeliverBlueprint(draft: BlueprintDraftDocument) {
  return (
    draft.state === "approved" &&
    draft.approvedRevision === draft.revision &&
    !!draft.reviewedBy &&
    !!draft.reviewedAt &&
    !!draft.privatePdfObjectPath
  );
}
