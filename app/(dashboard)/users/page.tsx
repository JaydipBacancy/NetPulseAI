import { redirect } from "next/navigation";
import { AccessRoleGuide } from "@/components/dashboard/access-role-guide";
import { UserAccessPanel } from "@/components/dashboard/user-access-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserManagementData } from "@/lib/data/user-management";
import { requireAuthenticatedWorkspace } from "@/lib/supabase/rbac";
import type { UserManagementFilters } from "@/types/access";

type SearchParams = Record<string, string | string[] | undefined>;

type UsersPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseFilters(params: SearchParams): UserManagementFilters {
  const query = getSingleParam(params.q);

  return {
    query: query?.trim() || undefined,
  };
}

async function loadUserManagement(filters: UserManagementFilters) {
  try {
    return await getUserManagementData(filters);
  } catch {
    return null;
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const access = await requireAuthenticatedWorkspace();
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseFilters(resolvedSearchParams);

  if (!access.permissions.canManageUsers) {
    redirect("/dashboard");
  }

  const userManagementData = await loadUserManagement(filters);

  if (!userManagementData) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>User data unavailable</CardTitle>
          <CardDescription>
            We could not load workspace profiles from Supabase right now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Verify your database connection and refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AccessRoleGuide currentRole={access.profile.role} />
      <UserAccessPanel currentUserId={access.profile.id} data={userManagementData} />
    </div>
  );
}
