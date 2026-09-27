import { CompanyBuilder } from "@legacy/components/company-builder";
export const metadata = {
  title: "Company Builder — Founder Diagnostic",
  description:
    "A founder diagnostic and company roadmap across Define, Build, Launch and Scale. A strategic starting point, not a quote calculator.",
  alternates: { canonical: "/start-a-business/builder" },
  robots: { index: false, follow: false },
};
export default function BuilderPage() {
  return <CompanyBuilder />;
}
