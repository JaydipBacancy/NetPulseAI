export const dashboardNavigation = [
  {
    description: "Health score, key metrics, and operational pulse.",
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    description: "Node inventory, status, and availability controls.",
    href: "/nodes",
    label: "Nodes",
  },
  {
    description: "Severity-based incidents and resolution workflow.",
    href: "/alerts",
    label: "Alerts",
  },
  {
    description: "Predefined tests, execution history, and outcomes.",
    href: "/tests",
    label: "Tests",
  },
  {
    description: "AI-generated risk reports and operator guidance.",
    href: "/analysis",
    label: "Analysis",
  },
  {
    description: "Consolidated operational summary for handoff.",
    href: "/reports",
    label: "Reports",
  },
] as const;
