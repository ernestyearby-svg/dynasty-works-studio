import type { Media } from "@/data/projects";
export interface ExperienceAsset {
  id: string;
  page: string;
  section: string;
  purpose: string;
  aspect: string;
  desktop: string;
  mobile: string;
  medium: "static" | "static + motion" | "native";
  creative: string;
  status: "required" | "implemented";
}
/** No substitute imagery. Future media must be explicitly approved before it reaches the page. */
export interface ApprovedExperienceMedia {
  approvalReference: string;
  poster: Media;
  mobilePoster?: Media;
  video?: string;
}
export const heroExperienceMedia: ApprovedExperienceMedia | null = null;
export const experienceAssets: ExperienceAsset[] = [
  {
    id: "DWS-HERO-01",
    page: "Home",
    section: "Hero",
    purpose: "Dimensional master mark",
    aspect: "4:3 desktop / 1:1 mobile",
    desktop: "1600w AVIF/WebP, <=240 KB",
    mobile: "800w art-directed crop, <=110 KB",
    medium: "static + motion",
    creative:
      "Manufactured graphite or smoked glass interpretation of the exact Direction 03 geometry. Quiet grazing light; no rotating logo. Future user-controlled film under 1.5 MB.",
    status: "required",
  },
  {
    id: "DWS-ARCH-01",
    page: "Home",
    section: "Build system",
    purpose: "Proprietary modular environment",
    aspect: "16:9 / 4:5",
    desktop: "1600w <=220 KB",
    mobile: "800w <=110 KB",
    medium: "static",
    creative:
      "Architectural scale, three connected volumes, stone and deep shadow. Original DWS environment; not a client project.",
    status: "required",
  },
  {
    id: "DWS-SYSTEM-01",
    page: "Home / Automation",
    section: "Workflow system",
    purpose: "Interactive architecture",
    aspect: "Fluid",
    desktop: "Native semantic nodes and connections",
    mobile: "Vertical sequence; tap and keyboard",
    medium: "native",
    creative:
      "Lead and Content pathways with explicit approval stops. A short user-triggered trace; no simulated live telemetry.",
    status: "implemented",
  },
  {
    id: "DWS-BLUEPRINT-01",
    page: "Home / Founder Blueprint",
    section: "Document product",
    purpose: "Tactile document environment",
    aspect: "3:2 / 4:5",
    desktop: "1400w <=200 KB",
    mobile: "800w <=100 KB",
    medium: "static",
    creative:
      "Real approved Blueprint cover, bone paper and macro print detail. No invented client data. Current fallback is a functional document specimen.",
    status: "required",
  },
  {
    id: "DWS-DIGITAL-01",
    page: "Home / Work",
    section: "Digital products",
    purpose: "Responsive interface composition",
    aspect: "16:10 / 9:16",
    desktop: "1400w <=180 KB",
    mobile: "720w <=100 KB",
    medium: "static + motion",
    creative:
      "Approved actual product screen captures and interaction clip. DWS Company Builder is the in-house example; future client screens require project approval.",
    status: "required",
  },
  {
    id: "DWS-MATERIAL-01",
    page: "Home / Creative review",
    section: "Material surfaces",
    purpose: "Proprietary material library",
    aspect: "1:1",
    desktop: "1200w <=140 KB each",
    mobile: "600w <=70 KB",
    medium: "static",
    creative:
      "Photographed or approved rendered macro studies of glass, graphite, metal, stone and paper. Present fallback uses CSS interface surfaces, not fake material photography.",
    status: "required",
  },
  {
    id: "DWS-OBJECT-01",
    page: "Work",
    section: "Physical products",
    purpose: "Product presentation support",
    aspect: "4:3 / 4:5",
    desktop: "1600w <=240 KB",
    mobile: "800w <=110 KB",
    medium: "static + motion",
    creative:
      "Approved product pedestals, lineups, exploded views, packaging flats and macro details. Use actual client design files, no invented labels.",
    status: "required",
  },
  {
    id: "DWS-STUDIO-01",
    page: "Studio",
    section: "Studio environment",
    purpose: "Editorial environment",
    aspect: "16:9 / 4:5",
    desktop: "1600w <=220 KB",
    mobile: "800w <=100 KB",
    medium: "static",
    creative:
      "Original future-facing DWS spatial study, explicitly identified as a concept if rendered; never a fictional office/team presented as real.",
    status: "required",
  },
  ...[
    "MyMosa / My Drink Family",
    "IKLA Maison",
    "SmokeSuite",
    "Mr. Cliff’s Premium Bourbon",
    "From Ohana to Alpine",
  ].map((name, i) => ({
    id: "DWS-WORK-0" + (i + 1),
    page: "Work / case study",
    section: name,
    purpose: "Flagship cinematic sequence",
    aspect: "16:10 / 4:5",
    desktop: "Approved hero, detail sequence and motion poster",
    mobile: "Dedicated crops, legible product/interface detail",
    medium: "static + motion" as const,
    creative:
      "Approved project media, scope, credits, rights and exact publication reference required. Project colors may frame the exhibition; artwork is never recolored.",
    status: "required" as const,
  })),
];
