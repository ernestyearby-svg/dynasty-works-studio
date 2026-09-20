import { BlueprintIntakeForm } from "@/components/blueprint-intake";
export const metadata = {
  title: "Founder Blueprint Intake",
  description:
    "Prepare your Founder Blueprint intake locally. Secure submission and payment are not yet connected.",
  alternates: { canonical: "/founder-blueprint/intake" },
  robots: { index: false, follow: false },
};
export default function Intake() {
  return <BlueprintIntakeForm />;
}
