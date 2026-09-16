import { MasterHomepage } from "@/components/master-home";
import { projects } from "@/data/projects";
export default function Home() {
  return <MasterHomepage projects={projects} />;
}
