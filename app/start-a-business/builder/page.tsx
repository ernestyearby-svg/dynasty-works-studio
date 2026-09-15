import { CompanyBuilder } from "@/components/company-builder";
export const metadata = {
  title: "Build My Company",
  description:
    "A guided local brief for your company’s strategy, identity, infrastructure, launch and next stage.",
  alternates: { canonical: "/start-a-business/builder" },
  robots: { index: false, follow: false },
};
export default function BuilderPage() {
  return <CompanyBuilder />;
}
