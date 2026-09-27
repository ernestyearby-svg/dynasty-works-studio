import { CreationEngine } from "@/components/creation-engine";
import "./creation-engine.css";

export const metadata = {
  title: "Creation Engine — Dynasty Works Studio",
  description: "An idea becomes structure, a system, a company. An interactive Dynasty Works Studio prototype.",
  alternates: { canonical: "/v3" },
  robots: { index: false, follow: false },
};

export default function CreationEnginePage() {
  return <CreationEngine />;
}
