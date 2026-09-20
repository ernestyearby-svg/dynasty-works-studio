// V1.7 specialization layer. Core catalog IDs and commercial packages remain stable.
export const automationGoals = [
  "Leads",
  "Email",
  "Follow-Ups",
  "Content",
  "Social Publishing",
  "Client Onboarding",
  "Documents",
  "Proposals",
  "Scheduling",
  "Customer Support",
  "Reporting",
  "Analytics",
  "Project Management",
  "Asset Management",
  "Internal Notifications",
  "Sales Pipeline",
  "Other",
] as const;
export const automationMaturities = [
  "Manual",
  "Connected",
  "Automated",
  "Intelligent",
] as const;
export const currentSystems = [
  "Email",
  "Spreadsheets",
  "CRM",
  "Project management",
  "Content calendar",
  "Website forms",
  "Connected applications",
  "Existing workflows",
] as const;
export const maturityDescriptions: Record<
  (typeof automationMaturities)[number],
  string
> = {
  Manual: "Most processes are handled manually.",
  Connected: "Some applications are connected.",
  Automated: "Several repeatable workflows exist.",
  Intelligent: "AI-assisted workflows and decision support exist.",
};
export interface AutomationAssessment {
  goals?: (typeof automationGoals)[number][];
  maturity?: (typeof automationMaturities)[number];
  systems?: (typeof currentSystems)[number][];
  manualProcess?: string;
}
const definitions: [string, string, string[]][] = [
  ["Workflow Architecture", "build-workflow-automation", []],
  ["Business Process Mapping", "build-workflow-automation", []],
  ["AI Integrations", "build-ai-integrations", []],
  ["AI Agents", "build-ai-integrations", []],
  ["Workflow Automation", "build-workflow-automation", []],
  ["n8n Automation", "build-workflow-automation", []],
  ["API Integration", "build-workflow-automation", []],
  ["Webhook Systems", "build-workflow-automation", []],
  ["Database Integration", "build-database-architecture", []],
  ["CRM Automation", "build-internal-business-systems", ["Sales Pipeline"]],
  ["Lead Automation", "build-workflow-automation", ["Leads", "Sales Pipeline"]],
  ["Email Automation", "build-workflow-automation", ["Email", "Follow-Ups"]],
  ["Content Automation", "build-workflow-automation", ["Content"]],
  [
    "Social Publishing Systems",
    "build-workflow-automation",
    ["Social Publishing"],
  ],
  [
    "Client Onboarding Automation",
    "build-workflow-automation",
    ["Client Onboarding"],
  ],
  ["Document Automation", "build-workflow-automation", ["Documents"]],
  ["Proposal Automation", "build-workflow-automation", ["Proposals"]],
  ["Reporting Automation", "build-analytics-foundations", ["Reporting"]],
  ["Analytics Automation", "build-analytics-foundations", ["Analytics"]],
  ["Internal Knowledge Systems", "build-internal-business-systems", []],
  [
    "Operations Dashboards",
    "build-internal-dashboards",
    ["Reporting", "Project Management"],
  ],
  ["Approval Systems", "build-workflow-automation", []],
  [
    "Notification Systems",
    "build-workflow-automation",
    ["Internal Notifications"],
  ],
  ["Scheduling Integration", "build-workflow-automation", ["Scheduling"]],
  [
    "Customer Support Automation",
    "build-workflow-automation",
    ["Customer Support"],
  ],
  [
    "Asset Management Automation",
    "build-internal-business-systems",
    ["Asset Management"],
  ],
  [
    "Project Workflow Automation",
    "build-workflow-automation",
    ["Project Management"],
  ],
];
export const automationServices = definitions.map(
  ([name, parentServiceId, goals]) => ({
    id: "automation-" + name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
    name,
    parentServiceId,
    goals,
    practice: "build" as const,
    status: "available-to-scope" as const,
  }),
);
export const automationStages = [
  "Process discovery",
  "System map",
  "Data architecture",
  "Integrations",
  "Workflow build",
  "Approval logic",
  "Testing",
  "Deployment",
  "Monitoring",
  "Optimization",
] as const;
export const executionModes = [
  {
    id: "draft-only",
    name: "Draft only",
    description:
      "The system prepares work. A person reviews and carries out the action.",
  },
  {
    id: "approval-required",
    name: "Approval required",
    description:
      "The system prepares an action. An authorized person approves it before execution.",
  },
  {
    id: "automated",
    name: "Automated",
    description:
      "An approved, low-risk workflow runs within agreed rules and limits.",
  },
] as const;
export const riskLevels = [
  {
    id: "low",
    name: "Low risk",
    examples:
      "Internal notifications, report generation, data organization and draft creation.",
  },
  {
    id: "medium",
    name: "Medium risk",
    examples:
      "Routine scheduled publishing, standard customer follow-up and CRM updates.",
  },
  {
    id: "higher-consequence",
    name: "Higher consequence",
    examples:
      "Financial actions, legal communications, contractual commitments, sensitive messages, destructive data changes and major public statements.",
  },
] as const;
export const automationEngagements = [
  [
    "Automation Audit",
    "Map the manual work, priorities, risks and opportunities.",
  ],
  ["Workflow Build", "Design and test one clearly defined process."],
  [
    "Connected Operations",
    "Connect approved systems around a shared flow of information.",
  ],
  [
    "AI Operating System",
    "Scope AI-assisted decision support across established operations, with explicit human control.",
  ],
  [
    "Automation Partnership",
    "Ongoing monitoring, maintenance, integration updates and improvement through our Automation Partner structure.",
  ],
] as const;
export const workflowExamples = [
  {
    id: "lead",
    name: "Lead engine",
    outcome: "A clear next step for every inquiry.",
    steps: [
      "Website",
      "Company Builder",
      "Lead capture",
      "Database / CRM",
      "Qualification",
      "Internal notification",
      "Email follow-up",
      "Meeting / next action",
      "Pipeline",
      "Reporting",
    ],
    note: "Follow-up begins as a draft. Sending requires approved backend and email connections.",
  },
  {
    id: "content",
    name: "Content engine",
    outcome: "A repeatable path from an idea to approved content.",
    steps: [
      "Content idea",
      "Brief",
      "Draft",
      "Creative",
      "Caption",
      "Approval",
      "Platform adaptation",
      "Scheduling",
      "Publishing",
      "Analytics",
      "Archive",
    ],
    note: "Publishing depends on real account authorization, API availability and platform permissions.",
  },
  {
    id: "email",
    name: "Email engine",
    outcome: "Organized conversations and considered follow-up.",
    steps: [
      "Incoming email",
      "Classify",
      "Client / project association",
      "Identify action",
      "Draft response",
      "Approval when required",
      "Send",
      "Log",
      "Follow-up",
    ],
    note: "Sensitive client, vendor, meeting and document communications require appropriate review.",
  },
  {
    id: "onboarding",
    name: "Client onboarding engine",
    outcome: "A structured start to every engagement.",
    steps: [
      "Engagement approved",
      "Payment / agreement status",
      "Client record",
      "Project creation",
      "Intake",
      "File structure",
      "Tasks",
      "Timeline",
      "Welcome communication",
      "Project start",
    ],
    note: "Payment and agreement status are future read-only inputs. Payment automation is excluded.",
  },
  {
    id: "document",
    name: "Document engine",
    outcome: "Consistent documents, grounded in reviewed information.",
    steps: [
      "Structured data",
      "Document draft",
      "Human review",
      "Approval",
      "Final output",
      "Client vault",
    ],
    note: "For Founder Blueprints, proposals, reports, roadmaps, meeting summaries, creative briefs, status reports and presentations.",
  },
  {
    id: "distribution",
    name: "Distribution engine",
    outcome: "Better organization around buyer and channel opportunities.",
    steps: [
      "Target database",
      "Distributor / retailer research",
      "Qualification",
      "Outreach preparation",
      "Materials",
      "Contact",
      "Response",
      "Follow-up",
      "Meeting",
      "Status",
      "Next action",
    ],
    note: "Dynasty Works provides strategy and coordination; it is not a licensed distributor. Outreach requires authorization.",
  },
  {
    id: "activation",
    name: "Activation engine",
    outcome: "Connect market activity with useful follow-through.",
    steps: [
      "Market",
      "Event / retail opportunity",
      "Activation plan",
      "Assets",
      "Staff / ambassador coordination",
      "Execution",
      "Data capture",
      "Follow-up",
      "Reporting",
    ],
    note: "Permissions, staffing, consent and operational responsibilities must be confirmed for each activation.",
  },
] as const;
