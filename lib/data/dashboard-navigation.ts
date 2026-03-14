export const dashboardNavigation = [
  {
    description: "Health score, key metrics, and operational pulse.",
    href: "/dashboard",
    label: "Dashboard",
    requiresAdmin: false,
  },
  {
    description: "Node inventory, status, and availability controls.",
    href: "/nodes",
    label: "Nodes",
    requiresAdmin: false,
  },
  {
    description: "Severity-based incidents and resolution workflow.",
    href: "/alerts",
    label: "Alerts",
    requiresAdmin: false,
  },
  {
    description: "Predefined tests, execution history, and outcomes.",
    href: "/tests",
    label: "Tests",
    requiresAdmin: false,
  },
  {
    description: "AI-generated risk reports and operator guidance.",
    href: "/analysis",
    label: "Analysis",
    requiresAdmin: false,
  },
  {
    description: "Consolidated operational summary for handoff.",
    href: "/reports",
    label: "Reports",
    requiresAdmin: false,
  },
  {
    description: "Roles, access control, and workspace user administration.",
    href: "/users",
    label: "Users",
    requiresAdmin: true,
  },
] as const;
