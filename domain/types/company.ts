import type { AutomationAssessment } from "@/data/automation";
import type { BuildNeed, BusinessType } from "@/data/company-builder";
export type EntityId = string;
export type ApprovalState =
  | "draft"
  | "pending"
  | "approved"
  | "revision_requested";
export interface Client {
  id: EntityId;
  displayName: string;
  companyIds: EntityId[];
}
export interface Company {
  id: EntityId;
  clientId: EntityId;
  name: string;
  businessType: BusinessType;
}
export interface CompanyBuild {
  version: 1;
  automation?: AutomationAssessment;
  businessStage?: "Idea" | "Preparing to launch" | "Operating" | "Growing";
  productReady?: boolean;
  storefrontReady?: boolean;
  uncertainNeeds?: boolean;
  redesignIdentity?: boolean;
  engagementPreference?:
    | "Explore together"
    | "Do it myself"
    | "Guide me"
    | "Build it for me";
  referralSource?: string;
  businessType: BusinessType | "";
  physicalMarket: boolean;
  starting: string[];
  needs: BuildNeed[];
  launch: string;
  budgetChoice: string;
  budgetNote: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  acknowledged: boolean;
}
export interface RecommendedService {
  service: BuildNeed;
  reason: string;
  source: "starting-point" | "business-type";
  optional: true;
}
export interface StudioProject {
  id: EntityId;
  companyId: EntityId;
  name: string;
  phaseIds: EntityId[];
}
export interface ProjectPhase {
  id: EntityId;
  projectId: EntityId;
  stage: string;
  state: "planned" | "active" | "complete";
  milestone?: string;
}
export interface Service {
  id: EntityId;
  practice: string;
  name: string;
  requiresLicensedProfessional: boolean;
}
export interface Deliverable {
  id: EntityId;
  projectId: EntityId;
  title: string;
  approvalId?: EntityId;
}
export interface Task {
  id: EntityId;
  projectId: EntityId;
  title: string;
  assignedRole: "client" | "studio" | "professional";
  state: "open" | "done";
  dueAt?: string;
}
export interface Approval {
  id: EntityId;
  projectId: EntityId;
  state: ApprovalState;
  subjectId: EntityId;
  decidedBy?: EntityId;
  decidedAt?: string;
}
export interface Asset {
  id: EntityId;
  projectId: EntityId;
  visibility: "private" | "approved-public";
  storageKey: string;
  mimeType: string;
}
export interface CompanyDocument extends Asset {
  documentType: "formation" | "contract" | "brand" | "business" | "reference";
  retentionPolicyId: string;
}
export interface Invoice {
  id: EntityId;
  projectId: EntityId;
  providerRef: string;
  currency: string;
  amountMinor: number;
  state: "draft" | "issued" | "paid" | "void";
}
export interface Message {
  id: EntityId;
  projectId: EntityId;
  senderId: EntityId;
  body: string;
  createdAt: string;
}
export interface CompanyInquiry {
  id: EntityId;
  build: CompanyBuild;
  state: "received" | "reviewed";
  receivedAt: string;
}
export type { TemplateProduct as Template } from "@/data/templates";
export type { Inquiry } from "@/lib/inquiry";
export interface ProfessionalNetworkCategory {
  id: string;
  name: string;
  requiresCredentialReview: boolean;
}
export interface NetworkMember {
  id: EntityId;
  categoryId: string;
  name: string;
  permissionToPublish: boolean;
  credentialsVerifiedAt?: string;
}
export interface VerifiedProof {
  id: string;
  type:
    | "portfolio"
    | "case-study"
    | "client-work"
    | "founder-experience"
    | "retail-experience"
    | "launch"
    | "testimonial"
    | "press"
    | "partner"
    | "professional-network";
  title: string;
  body: string;
  sourceRef: string;
  approvedAt: string | null;
  status: ApprovalState;
}
export const marketCaseTitles = [
  "Distribution Strategy",
  "Retail Strategy",
  "Retail Placement",
  "Distributor Development",
  "Market Activation",
  "Sampling",
  "Events",
  "Retail Displays",
  "Channel Expansion",
] as const;
export interface MarketCaseSection {
  title: (typeof marketCaseTitles)[number];
  body: string;
  status: ApprovalState;
  approvedAt: string | null;
  proofRef: string | null;
}
export function approvedMarketSections(sections: MarketCaseSection[] = []) {
  return sections.filter(
    (s) =>
      s.status === "approved" &&
      !!s.approvedAt &&
      !!s.proofRef &&
      s.body.trim().length > 0,
  );
}

export type Project = StudioProject;
export type Document = CompanyDocument;
