import { InquiryForm } from "@legacy/components/inquiry-form";
export const metadata = {
  title: "Start a Project",
  description:
    "Prepare a project brief for Dynasty Works Studio. Tell us about the idea, scope and ambition.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <div className="shell contact-page">
      <InquiryForm />
    </div>
  );
}
