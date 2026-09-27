export type StudioEventName =
  | "view_project"
  | "view_service"
  | "start_company_builder"
  | "company_builder_step"
  | "complete_company_builder"
  | "start_project"
  | "submit_inquiry"
  | "view_template"
  | "contact_click"
  | "builder_started"
  | "builder_completed"
  | "roadmap_generated"
  | "package_recommended"
  | "service_viewed"
  | "practice_viewed"
  | "roadmap_downloaded"
  | "strategy_review_clicked"
  | "template_viewed"
  | "project_inquiry_started"
  | "project_inquiry_submitted"
  | "founder_blueprint_viewed"
  | "founder_blueprint_started"
  | "founder_blueprint_intake_started"
  | "founder_blueprint_intake_completed"
  | "founder_blueprint_recommended"
  | "founder_blueprint_cta_clicked";
export type StudioEvent = {
  name: StudioEventName;
  route?: string;
  step?: number;
  contentId?: string;
};
export interface AnalyticsAdapter {
  record(event: StudioEvent): void;
}
// No adapter, cookies, network calls or identifiers are enabled in V1.2.
export function recordStudioEvent(event: StudioEvent) {
  void event;
}
