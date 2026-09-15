export type StudioEventName =
  | "view_project"
  | "view_service"
  | "start_company_builder"
  | "company_builder_step"
  | "complete_company_builder"
  | "start_project"
  | "submit_inquiry"
  | "view_template"
  | "contact_click";
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
