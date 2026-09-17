import { automationServices, automationStages } from "@legacy/data/automation";
import type { CompanyBuild } from "@legacy/types/company";
import type { BusinessStage } from "@legacy/data/service-catalog";
export function recommendAutomation(b: CompanyBuild, stage: BusinessStage) {
  if (!b.needs.includes("AI / Automation")) return null;
  const a = b.automation || {},
    early = stage === "Idea" || stage === "Preparing to launch";
  const maturity = a.maturity || "Manual";
  const discoveryOnly = early || !a.goals?.length;
  const names = [
    "Business Process Mapping",
    "Workflow Architecture",
    "Approval Systems",
  ];
  if (!discoveryOnly)
    for (const s of automationServices)
      if (s.goals.some((g) => a.goals?.some((v) => v === g)))
        names.push(s.name);
  if (!discoveryOnly && a.systems?.length)
    names.push("API Integration", "Database Integration");
  if (!discoveryOnly && maturity === "Intelligent")
    names.push("AI Integrations");
  const services = automationServices.filter((s) => names.includes(s.name));
  return {
    maturity,
    discoveryOnly,
    services,
    goals: a.goals || [],
    systems: a.systems || [],
    engagement:
      discoveryOnly || maturity === "Manual"
        ? "Automation Audit"
        : maturity === "Connected"
          ? "Workflow Build"
          : maturity === "Automated"
            ? "Connected Operations"
            : "AI Operating System",
    reason: discoveryOnly
      ? "Map one repeatable process before investing in integrations or AI. Execution belongs in a later, reviewed scope."
      : maturity === "Manual"
        ? "Start with a process audit and one bounded workflow. Confirm the inputs and approval owner before connecting tools."
        : "Review the existing " +
          maturity.toLowerCase() +
          " workflows, then scope the selected outcomes and connection points.",
    context:
      "Review " +
      (b.businessType || "the business") +
      " operations" +
      (a.manualProcess?.trim()
        ? " against the manual process you described"
        : " with the process owner") +
      ". " +
      (a.systems?.length
        ? "Inventory permissions and data ownership in " +
          a.systems.join(", ") +
          "."
        : "Identify the current systems during discovery."),
    mode: "Draft only" as const,
    stages: automationStages.map((name, i) => ({
      name,
      timing:
        discoveryOnly && i > 1 ? ("future" as const) : ("scoping" as const),
    })),
    status: "Architecture only. No workflows are connected or running.",
  };
}
