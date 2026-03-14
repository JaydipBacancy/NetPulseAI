import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserManagementData, UserManagementFilters } from "@/types/access";
import type { Database } from "@/types/supabase";

type ProfileRow = Pick<
  Database["public"]["Tables"]["user_profiles"]["Row"],
  "created_at" | "email" | "full_name" | "id" | "is_active" | "role" | "updated_at"
>;

const roleRank: Record<Database["public"]["Enums"]["app_role_enum"], number> = {
  admin: 0,
  operator: 1,
  viewer: 2,
};

export async function getUserManagementData(
  filters: UserManagementFilters = {},
): Promise<UserManagementData> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role,is_active,created_at,updated_at");

  if (error || !data) {
    throw new Error("User management query failed.");
  }

  const allRows = (data as ProfileRow[])
    .map((row) => ({
      createdAt: row.created_at,
      email: row.email,
      fullName: row.full_name,
      id: row.id,
      isActive: row.is_active,
      role: row.role,
      updatedAt: row.updated_at,
    }))
    .sort((a, b) => {
      const roleDifference = roleRank[a.role] - roleRank[b.role];

      if (roleDifference !== 0) {
        return roleDifference;
      }

      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }

      return a.fullName.localeCompare(b.fullName);
    });
  const query = filters.query?.trim() || undefined;
  const normalizedQuery = query?.toLowerCase();
  const rows = normalizedQuery
    ? allRows.filter((row) => {
        const searchableValues = [
          row.email,
          row.fullName,
          row.isActive ? "active" : "disabled",
          row.role,
        ];

        return searchableValues.some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      })
    : allRows;

  return {
    activeAdminCount: allRows.filter((row) => row.role === "admin" && row.isActive).length,
    activeUserCount: allRows.filter((row) => row.isActive).length,
    filters: {
      query,
    },
    rows,
    totalUsers: allRows.length,
  };
}
