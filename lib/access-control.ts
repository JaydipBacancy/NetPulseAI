import type { Database } from "@/types/supabase";

export type AppRole = Database["public"]["Enums"]["app_role_enum"];

type RoleDefinition = {
  description: string;
  label: string;
  responsibilities: string[];
};

export const roleDefinitions: Record<AppRole, RoleDefinition> = {
  admin: {
    description: "Owns workspace access and all operational changes.",
    label: "Admin",
    responsibilities: [
      "Manage users, roles, and app access",
      "Create and update nodes, alerts, tests, and analysis reports",
      "Approve who gets operator access versus read-only access",
    ],
  },
  operator: {
    description: "Runs day-to-day telecom operations without user administration.",
    label: "Operator",
    responsibilities: [
      "Manage node inventory and alert workflows",
      "Run predefined tests and generate analysis reports",
      "Work inside the operations console without changing user access",
    ],
  },
  viewer: {
    description: "Read-only access for oversight, reporting, and stakeholder review.",
    label: "Viewer",
    responsibilities: [
      "Review dashboards, alerts, tests, analysis, and reports",
      "Track operational status without changing production data",
      "Escalate changes to an operator or admin when action is needed",
    ],
  },
};

export function formatAppRole(role: AppRole) {
  return roleDefinitions[role].label;
}

export function canManageOperations(role: AppRole) {
  return role === "admin" || role === "operator";
}

export function canManageUsers(role: AppRole) {
  return role === "admin";
}
