import { CreationHomepage } from "@/components/creation-home";
export const metadata = {
  title: "Company Creation Studio — From Idea to Company",
  description:
    "Dynasty Works is a company creation studio connecting strategy, brand development, product, websites and applications, launch and operational systems.",
  alternates: { canonical: "/" },
};
export default function Home() {
  return <CreationHomepage />;
}
