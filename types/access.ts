import type { Database } from "@/types/supabase";

export type WorkspaceProfile = {
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  isActive: boolean;
  role: Database["public"]["Enums"]["app_role_enum"];
  updatedAt: string;
};

export type WorkspacePermissions = {
  canManageOperations: boolean;
  canManageUsers: boolean;
};

export type UserManagementFilters = {
  query?: string;
};

export type UserManagementData = {
  activeAdminCount: number;
  activeUserCount: number;
  filters: UserManagementFilters;
  rows: WorkspaceProfile[];
  totalUsers: number;
};
